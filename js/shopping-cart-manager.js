/* ==========================================================================
    GLOBAL CART LOGIC
    Manages state for the shopping cart using the browser's localStorage. 
    Handles adding/removing items, promo codes, and calculating totals.
   ========================================================================== */

const activeUserEmail = localStorage.getItem("unlimitedPage_CurrentUser") || "guest";
window.CART_STORAGE_KEY = `unlimitedPageCart_${activeUserEmail}`;

let rawCartData = JSON.parse(localStorage.getItem(window.CART_STORAGE_KEY)) || [];
let userShoppingCart = rawCartData.filter((cartItem) => productDatabase.some((databaseItem) => databaseItem.id === cartItem.id));

if (rawCartData.length !== userShoppingCart.length) {
    localStorage.setItem(window.CART_STORAGE_KEY, JSON.stringify(userShoppingCart));
}

let currentPromoDiscount = 0;
let isPromoApplied = false;
let promoBurnedDatabase = JSON.parse(localStorage.getItem("promoBurned")) || false;

// Checkout State Variables
let isCheckoutViewActive = false;
let selectedCheckoutAddressIndex = null;
let selectedCheckoutAddressData = null; // Tracks the actual address data to survive re-sorting
let selectedPaymentCategory = "Cash on Delivery";
let selectedPaymentMethodIndex = null; 

function updateCartBadge() {
    const badgeElement = document.getElementById("global-cart-badge");
    if (badgeElement) {
        badgeElement.textContent = userShoppingCart.length;
    }
}

function addProductToCart(productId) {
    if (localStorage.getItem("isLoggedIn") !== "true") {
        window.location.href = "login.html";
        return;
    }

    const productToAdd = productDatabase.find((databaseItem) => databaseItem.id === productId);
    if (!productToAdd) return;

    const existingCartItemIndex = userShoppingCart.findIndex((databaseItem) => databaseItem.id === productId);

    if (existingCartItemIndex > -1) {
        const existingCartItem = userShoppingCart[existingCartItemIndex];

        if (existingCartItem.quantity < productToAdd.stock) {
            existingCartItem.quantity += 1;
            existingCartItem.isSelectedForOrder = true;

            userShoppingCart.splice(existingCartItemIndex, 1);
            userShoppingCart.unshift(existingCartItem);

            showToastNotification("Item has been added to your shopping cart");
        } else {
            showToastNotification("Maximum stock reached.");
        }
    } else {
        userShoppingCart.unshift({
            id: productToAdd.id,
            quantity: 1,
            isSelectedForOrder: true,
        });
        showToastNotification("Item has been added to your shopping cart");
    }

    localStorage.setItem(window.CART_STORAGE_KEY, JSON.stringify(userShoppingCart));
    updateCartBadge();
}

function toggleCartItemSelection(productId) {
    const targetItem = userShoppingCart.find((databaseItem) => databaseItem.id === productId);
    if (targetItem) {
        targetItem.isSelectedForOrder = !targetItem.isSelectedForOrder;
        localStorage.setItem(window.CART_STORAGE_KEY, JSON.stringify(userShoppingCart));
        initCart();
    }
}

function manualCartQuantityUpdate(productId, inputValue) {
    let newQuantity = parseInt(inputValue);
    const itemIndex = userShoppingCart.findIndex((databaseItem) => databaseItem.id === productId);

    if (itemIndex > -1 && !isNaN(newQuantity)) {
        const productInfo = productDatabase.find((databaseItem) => databaseItem.id === productId);

        if (newQuantity < 1) newQuantity = 1;

        if (newQuantity > productInfo.stock) {
            newQuantity = productInfo.stock;
            showToastNotification("Maximum stock reached.");
        }

        userShoppingCart[itemIndex].quantity = newQuantity;
        localStorage.setItem(window.CART_STORAGE_KEY, JSON.stringify(userShoppingCart));

        updateCartBadge();
        initCart();
    }
}

function changeCartQuantity(productId, quantityDelta) {
    const itemIndex = userShoppingCart.findIndex((databaseItem) => databaseItem.id === productId);
    if (itemIndex > -1) {
        let currentQuantity = userShoppingCart[itemIndex].quantity;
        manualCartQuantityUpdate(productId, currentQuantity + quantityDelta);
    }
}

function deleteItemFromCart(productId) {
    const itemIndex = userShoppingCart.findIndex((databaseItem) => databaseItem.id === productId);

    if (itemIndex > -1) {
        const productInfo = productDatabase.find((databaseItem) => databaseItem.id === productId);
        showConfirmModal(
            `Are you sure you want to remove\n<strong>${productInfo.title}</strong>\nfrom your cart?`,
            () => {
                userShoppingCart.splice(itemIndex, 1);
                localStorage.setItem(window.CART_STORAGE_KEY, JSON.stringify(userShoppingCart));
                updateCartBadge();
                initCart();
                showToastNotification(`${productInfo.title} removed from cart.`);
            },
        );
    }
}

function applyPromoCode() {
    const promoInputField = document.getElementById("promo-code-input");
    const promoMessageElement = document.getElementById("promo-message");
    const applyPromoButton = document.getElementById("promo-apply-button");
    if (!promoInputField) return;

    if (promoInputField.value.trim().toUpperCase() === "DEVRESET") {
        localStorage.removeItem("promoBurned");
        promoBurnedDatabase = false;
        promoMessageElement.textContent = "DEV: Promo code database reset!";
        promoMessageElement.style.color = "var(--primary-blue-color)";
        promoInputField.value = "";
        return;
    }

    if (isPromoApplied) {
        isPromoApplied = false;
        currentPromoDiscount = 0;
        promoInputField.value = "";
        promoInputField.disabled = false;

        applyPromoButton.textContent = "Apply";
        applyPromoButton.style.backgroundColor = "var(--background-light-color)";
        applyPromoButton.style.color = "var(--text-dark-color)";

        promoMessageElement.textContent = "Promo code removed.";
        promoMessageElement.style.color = "var(--text-muted-color)";

        initCart();
        return;
    }

    const enteredCode = promoInputField.value.trim().toUpperCase();

    if (enteredCode === "DEATHNOTE" && promoBurnedDatabase) {
        promoMessageElement.textContent = "This code has already been used on your account.";
        promoMessageElement.style.color = "var(--danger-red-color)";
        return;
    }

    let calculatedSubtotal = 0;
    userShoppingCart.forEach((cartItem) => {
        if (cartItem.isSelectedForOrder) {
            const databaseItem = productDatabase.find((item) => item.id === cartItem.id);
            if (databaseItem) {
                calculatedSubtotal += parseFloat(databaseItem.price) * parseInt(cartItem.quantity);
            }
        }
    });

    if (enteredCode === "DEATHNOTE") {
        if (calculatedSubtotal >= 1000) {
            isPromoApplied = true;
            currentPromoDiscount = 299;
            promoInputField.disabled = true;

            applyPromoButton.textContent = "Remove";
            applyPromoButton.style.backgroundColor = "var(--danger-red-color)";
            applyPromoButton.style.color = "white";

            promoMessageElement.textContent = "Discount applied successfully!";
            promoMessageElement.style.color = "var(--success-green-color)";
        } else {
            promoMessageElement.textContent = "Order total must be at least ₱1000.";
            promoMessageElement.style.color = "var(--danger-red-color)";
        }
    } else {
        promoMessageElement.textContent = "Invalid promo code.";
        promoMessageElement.style.color = "var(--danger-red-color)";
    }

    initCart();
}

/* ==========================================================================
    CHECKOUT VIEW LOGIC (Address & Payment Methods)
   ========================================================================== */

function toggleCheckoutView(showCheckout) {
    if (showCheckout) {
        proceedToCheckoutView();
    } else {
        document.getElementById("cart-items-view").style.display = "block";
        document.getElementById("checkout-details-view").style.display = "none";
        
        const mainBtn = document.getElementById("main-checkout-btn");
        mainBtn.textContent = "PROCEED TO CHECKOUT";
        mainBtn.onclick = proceedToCheckoutView;

        const backLink = document.getElementById("cart-back-link");
        backLink.innerHTML = '<span class="material-icons-outlined" style="font-size: 16px">arrow_back</span> Continue Shopping';
        backLink.onclick = null;
        backLink.href = "catalog.html";
        
        document.getElementById("cart-main-title").textContent = "Your Cart";
        isCheckoutViewActive = false;
    }
}

function proceedToCheckoutView() {
    const selectedCartItems = userShoppingCart.filter((cartItem) => cartItem.isSelectedForOrder);
    
    if (selectedCartItems.length === 0) {
        showToastNotification("Please select at least one item to place an order.");
        return;
    }

    document.getElementById("cart-items-view").style.display = "none";
    document.getElementById("checkout-details-view").style.display = "block";

    const mainBtn = document.getElementById("main-checkout-btn");
    mainBtn.textContent = "PLACE ORDER";
    mainBtn.onclick = placeOrder;

    const backLink = document.getElementById("cart-back-link");
    backLink.innerHTML = '<span class="material-icons-outlined" style="font-size: 16px">arrow_back</span> Back to Cart';
    backLink.href = "#";
    backLink.onclick = (e) => { e.preventDefault(); toggleCheckoutView(false); };
    
    document.getElementById("cart-main-title").textContent = "Checkout Details";

    renderCheckoutAddress();
    renderCheckoutPaymentMethods();

    isCheckoutViewActive = true;
    window.scrollTo({ top: 0, behavior: "smooth" });
}

function renderCheckoutAddress() {
    const container = document.getElementById("checkout-address-container");
    const changeBtn = document.getElementById("change-address-btn");
    
    const db = JSON.parse(localStorage.getItem("unlimitedPage_Users")) || {};
    const email = localStorage.getItem("unlimitedPage_CurrentUser");
    const addresses = (db[email] || {}).addresses || [];

    if (addresses.length === 0) {
        container.innerHTML = `
            <button class="add-address-button" onclick="openAddressModal()">
                + Add New Address
            </button>
        `;
        changeBtn.style.display = "none";
        selectedCheckoutAddressIndex = null;
        selectedCheckoutAddressData = null;
        return;
    }

    changeBtn.style.display = "block";

    // Re-sync index bulletproof check: Survives array re-sorting
    if (selectedCheckoutAddressData) {
        const newIndex = addresses.findIndex(a => a.label === selectedCheckoutAddressData.label && a.street === selectedCheckoutAddressData.street);
        if (newIndex > -1) {
            selectedCheckoutAddressIndex = newIndex;
        } else {
            selectedCheckoutAddressData = null;
        }
    }

    if (selectedCheckoutAddressIndex === null || !addresses[selectedCheckoutAddressIndex]) {
        const defaultIndex = addresses.findIndex(a => a.isDefault);
        selectedCheckoutAddressIndex = defaultIndex > -1 ? defaultIndex : 0;
        selectedCheckoutAddressData = addresses[selectedCheckoutAddressIndex];
    }

    const addr = addresses[selectedCheckoutAddressIndex];
    container.innerHTML = `
        <div style="display: flex; flex-direction: column; gap: 4px; font-size: 14px;">
            <div style="font-weight: 700; color: var(--text-dark-color);">
                ${addr.label} <span style="font-weight: 400; color: var(--text-muted-color);">| ${addr.phone}</span>
            </div>
            <div style="color: var(--text-muted-color);">
                ${addr.street}, ${addr.city}, ${addr.state}, ${addr.zip}
            </div>
        </div>
    `;
}

function openCheckoutAddressModal() {
    const listContainer = document.getElementById("checkout-address-list");
    const db = JSON.parse(localStorage.getItem("unlimitedPage_Users")) || {};
    const email = localStorage.getItem("unlimitedPage_CurrentUser");
    const addresses = (db[email] || {}).addresses || [];

    listContainer.innerHTML = addresses.map((addr, index) => `
        <div class="address-modal-radio-container" onclick="selectCheckoutAddress(${index})">
            <div style="padding-top: 2px;">
                <input type="radio" name="checkout_address" ${index === selectedCheckoutAddressIndex ? 'checked' : ''} style="accent-color: var(--primary-blue-color); width: 18px; height: 18px;">
            </div>
            <div style="flex-grow: 1; font-size: 14px; line-height: 1.5;">
                <div style="font-weight: 700; color: var(--text-dark-color); display: flex; align-items: center; gap: 10px;">
                    ${addr.label} <span style="font-weight: 400; color: var(--text-muted-color);">| ${addr.phone}</span>
                </div>
                <div style="color: var(--text-muted-color);">
                    ${addr.street}<br>${addr.city}, ${addr.state}, ${addr.zip}
                </div>
                ${addr.isDefault ? '<span class="default-badge" style="display: inline-block; margin-top: 8px;">Default</span>' : ''}
            </div>
            <button class="change-address-btn" onclick="event.stopPropagation(); editAddress(${index}); closeCheckoutAddressModal();">Edit</button>
        </div>
    `).join('');

    document.getElementById("checkout-address-modal").style.display = "flex";
}

function selectCheckoutAddress(index) {
    const db = JSON.parse(localStorage.getItem("unlimitedPage_Users")) || {};
    const email = localStorage.getItem("unlimitedPage_CurrentUser");
    const addresses = (db[email] || {}).addresses || [];
    
    selectedCheckoutAddressIndex = index;
    // Store a deep copy so references survive updates
    selectedCheckoutAddressData = JSON.parse(JSON.stringify(addresses[index])); 
    
    renderCheckoutAddress();
    closeCheckoutAddressModal();
}

function closeCheckoutAddressModal() {
    document.getElementById("checkout-address-modal").style.display = "none";
}

function renderCheckoutPaymentMethods() {
    const categoryContainer = document.getElementById("checkout-payment-category-container");
    const cardContainer = document.getElementById("checkout-selected-card-container");
    if (!categoryContainer || !cardContainer) return;

    const db = JSON.parse(localStorage.getItem("unlimitedPage_Users")) || {};
    const email = localStorage.getItem("unlimitedPage_CurrentUser");
    const methods = (db[email] || {}).paymentMethods || [];

    const uniqueTypes = [...new Set(methods.map(m => m.type))];

    let html = ``;
    uniqueTypes.forEach(type => {
        const firstMatch = methods.find(m => m.type === type);
        html += `
            <div class="checkout-payment-method" data-category="${type}" onclick="selectPaymentCategory('${type}')">
                <img src="${firstMatch.logo}" alt="${type}" />
            </div>
        `;
    });

    html += `
        <div class="checkout-payment-method" data-category="Cash on Delivery" onclick="selectPaymentCategory('Cash on Delivery')">
            <img src="images/payment-method/cash-on-delivery-logo.jpg" alt="Cash on Delivery" />
        </div>
    `;

    categoryContainer.innerHTML = html;

    if (uniqueTypes.includes(selectedPaymentCategory)) {
        selectPaymentCategory(selectedPaymentCategory);
    } else {
        selectPaymentCategory('Cash on Delivery');
    }
}

function selectPaymentCategory(category) {
    selectedPaymentCategory = category;
    
    const categoryBoxes = document.querySelectorAll("#checkout-payment-category-container .checkout-payment-method");
    categoryBoxes.forEach(box => {
        if (box.dataset.category === category) {
            box.classList.add("selected");
        } else {
            box.classList.remove("selected");
        }
    });

    const db = JSON.parse(localStorage.getItem("unlimitedPage_Users")) || {};
    const email = localStorage.getItem("unlimitedPage_CurrentUser");
    const methods = (db[email] || {}).paymentMethods || [];

    if (category === 'Cash on Delivery') {
        selectedPaymentMethodIndex = null;
        renderSelectedPaymentCards([]);
    } else {
        const methodsOfType = methods.map((m, index) => ({ ...m, originalIndex: index })).filter(m => m.type === category);
        
        if (selectedPaymentMethodIndex === null || methods[selectedPaymentMethodIndex].type !== category) {
            selectedPaymentMethodIndex = methodsOfType[0].originalIndex;
        }
        
        renderSelectedPaymentCards(methodsOfType);
    }
}

function renderSelectedPaymentCards(methodsOfType) {
    const cardContainer = document.getElementById("checkout-selected-card-container");
    if (!cardContainer) return;

    if (methodsOfType.length === 0) {
        cardContainer.innerHTML = "";
        return;
    }

    cardContainer.innerHTML = `
        <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 15px;">
            ${methodsOfType.map(method => `
                <article class="payment-card checkout-selectable-card ${method.originalIndex === selectedPaymentMethodIndex ? 'selected' : ''}" 
                         onclick="selectSpecificCard(${method.originalIndex})">
                    <button class="payment-card-button edit" onclick="event.stopPropagation(); editPaymentMethod(${method.originalIndex})">EDIT</button>
                    <div class="payment-card-header">
                        <img src="${method.logo}" alt="${method.type}" class="payment-card-logo">
                        <span class="payment-card-type">${method.tag}</span>
                    </div>
                    <div class="payment-card-number">${method.displayNumber}</div>
                    <div class="payment-card-detail">${method.detail}</div>
                </article>
            `).join('')}
        </div>
    `;
}

function selectSpecificCard(index) {
    selectedPaymentMethodIndex = index;
    selectPaymentCategory(selectedPaymentCategory); 
}

function placeOrder() {
    if (selectedCheckoutAddressIndex === null) {
        showToastNotification("Please select a delivery address.");
        return;
    }
    
    if (selectedPaymentCategory !== "Cash on Delivery" && selectedPaymentMethodIndex === null) {
        showToastNotification("Please select a payment method.");
        return;
    }

    const selectedCartItems = userShoppingCart.filter((cartItem) => cartItem.isSelectedForOrder);

    let finalSubtotal = 0;
    selectedCartItems.forEach((cartItem) => {
        const databaseItem = productDatabase.find((item) => item.id === cartItem.id);
        if (databaseItem) finalSubtotal += parseFloat(databaseItem.price) * parseInt(cartItem.quantity);
    });

    let calculatedShippingFee = finalSubtotal < 200 && finalSubtotal > 0 ? 30 : 0;
    const finalOrderTotal = Math.max(0, finalSubtotal + calculatedShippingFee - currentPromoDiscount);

    const db = JSON.parse(localStorage.getItem("unlimitedPage_Users")) || {};
    const email = localStorage.getItem("unlimitedPage_CurrentUser");
    const addr = (db[email] || {}).addresses[selectedCheckoutAddressIndex];
    
    let paymentDisplayString = "Cash on Delivery";
    if (selectedPaymentCategory !== "Cash on Delivery" && selectedPaymentMethodIndex !== null) {
        const method = (db[email] || {}).paymentMethods[selectedPaymentMethodIndex];
        paymentDisplayString = `${method.type} ending in ${method.displayNumber.slice(-4)}`;
    }

    const receiptHTML = `
        <h2 style="color: var(--success-green-color); margin-bottom: 15px; font-size: 24px;">Order Confirmed!</h2>
        
        <p style="margin-bottom: 20px; color: var(--text-dark-color); font-size: 16px;">
            Thank you for shopping with <strong style="white-space: nowrap;">Unlimited Page</strong>.
        </p>
        
        <div style="background-color: var(--background-light-color); padding: 15px; border-radius: 6px; text-align: left; margin-bottom: 20px; border: 1px solid var(--border-light-color);">
            <p style="margin-bottom: 8px; font-size: 14px;">
                <strong style="color: var(--text-muted-color);">Delivery Address:</strong> <br> 
                <span style="font-weight: 600; color: var(--text-dark-color);">${addr.street}, ${addr.city}, ${addr.state}</span>
            </p>
            <p style="margin-bottom: 8px; font-size: 14px;">
                <strong style="color: var(--text-muted-color);">Payment Method:</strong> <br> 
                <span style="font-weight: 600; color: var(--text-dark-color);">${paymentDisplayString}</span>
            </p>
            <p style="font-size: 14px;">
                <strong style="color: var(--text-muted-color);">Total Paid:</strong> <br> 
                <span style="font-size: 20px; font-weight: 700; color: var(--primary-blue-color);">${formatCurrency(finalOrderTotal)}</span>
            </p>
        </div>
    `;

    if (isPromoApplied) {
        localStorage.setItem("promoBurned", JSON.stringify(true));
        promoBurnedDatabase = true;
    }

    userShoppingCart = userShoppingCart.filter((cartItem) => !cartItem.isSelectedForOrder);
    localStorage.setItem(window.CART_STORAGE_KEY, JSON.stringify(userShoppingCart));

    isPromoApplied = false;
    currentPromoDiscount = 0;

    const promoInputField = document.getElementById("promo-code-input");
    const promoMessageElement = document.getElementById("promo-message");
    const applyPromoButton = document.getElementById("promo-apply-button");

    if (promoInputField) {
        promoInputField.value = "";
        promoInputField.disabled = false;
    }
    if (promoMessageElement) promoMessageElement.textContent = "";

    if (applyPromoButton) {
        applyPromoButton.textContent = "Apply";
        applyPromoButton.style.backgroundColor = "var(--background-light-color)";
        applyPromoButton.style.color = "var(--text-dark-color)";
    }

    updateCartBadge();
    initCart();

    showCheckoutModal(receiptHTML, () => {
        toggleCheckoutView(false); // Go back to cart view for next time
        window.scrollTo({ top: 0, behavior: "smooth" });
    });
}

/* ==========================================================================
    CART RENDER LOGIC
   ========================================================================== */

function initCart() {
    const cartContainerElement = document.getElementById("cart-items-container");
    if (!cartContainerElement) return;

    cartContainerElement.innerHTML = "";
    let rollingSubtotal = 0;
    let summaryItemsHTML = "";
    let selectedItemsCount = 0;

    if (userShoppingCart.length === 0) {
        cartContainerElement.innerHTML = '<p style="padding: 20px; color: var(--text-muted-color);">Your cart is currently empty.</p>';
        document.getElementById("cart-subtotal").textContent = "₱0.00";
        document.getElementById("cart-shipping").textContent = "₱0.00";
        document.getElementById("cart-total").textContent = "₱0.00";

        if (document.getElementById("mobile-cart-total")) document.getElementById("mobile-cart-total").textContent = "₱0.00";
        if (document.getElementById("discount-row")) document.getElementById("discount-row").style.display = "none";

        const summaryListContainer = document.getElementById("summary-items-list");
        if (summaryListContainer) summaryListContainer.style.display = "none";

        return;
    }

    userShoppingCart.sort((itemA, itemB) => {
        return itemA.isSelectedForOrder === itemB.isSelectedForOrder ? 0 : itemA.isSelectedForOrder ? -1 : 1;
    });

    userShoppingCart.forEach((cartItem) => {
        const productInfo = productDatabase.find((databaseItem) => databaseItem.id === cartItem.id);
        if (!productInfo) return;

        if (cartItem.isSelectedForOrder) {
            rollingSubtotal += parseFloat(productInfo.price) * parseInt(cartItem.quantity);
            summaryItemsHTML += `
                <div style="display: flex; justify-content: space-between; font-size: 13px; margin-bottom: 8px; color: var(--text-dark-color);">
                    <span style="flex: 1; padding-right: 15px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">
                        <strong>${cartItem.quantity}x</strong> ${productInfo.title}
                    </span>
                    <span style="font-weight: 600;">${formatCurrency(productInfo.price * cartItem.quantity)}</span>
                </div>
            `;
            selectedItemsCount++;
        }

        const opacityClass = cartItem.isSelectedForOrder ? "" : "omitted-from-order";
        const toggleButtonClass = cartItem.isSelectedForOrder ? "remove-button" : "add-button";
        const toggleIcon = cartItem.isSelectedForOrder ? "images/remove-order-icon.png" : "images/add-order-icon.png";
        const toggleText = cartItem.isSelectedForOrder ? "Remove" : "Add";

        const itemHTML = `
            <article class="cart-item-row ${opacityClass}">
                <div class="cart-item-product-column">
                    <a href="product-details.html?id=${productInfo.id}" style="display: block;">
                        <img src="${productInfo.imageFile}" alt="${productInfo.title}" class="cart-item-image" onerror="this.src='https://placehold.co/300x420?text=Image+Missing'">
                    </a>
                    <div class="cart-item-details">
                        <h3 class="product-title" style="font-size: 15px;">
                            <a href="product-details.html?id=${productInfo.id}" style="color: inherit; text-decoration: none;">${productInfo.title}</a>
                        </h3>
                        <p class="product-author-brand">by ${productInfo.authorOrBrand}</p>
                        <div class="cart-item-stock">Stock: ${productInfo.stock} available</div>
                        
                        <div class="cart-item-action-buttons">
                            <button class="cart-item-toggle-button ${toggleButtonClass}" onclick="toggleCartItemSelection('${productInfo.id}')">
                                <img src="${toggleIcon}" alt="Toggle" style="width: 14px; height: 14px; margin-right: 4px; object-fit: contain;"> ${toggleText}
                            </button>
                            <button class="cart-item-delete-button" onclick="deleteItemFromCart('${productInfo.id}')">
                                <img src="images/trash-bin-icon.png" alt="Delete" style="width: 14px; height: 14px; margin-right: 4px; object-fit: contain;"> Remove from Cart
                            </button>
                        </div>
                    </div>
                </div>
                
                <div class="cart-item-price-column" style="font-weight: 600; text-align: center;">${formatCurrency(productInfo.price)}</div>
                
                <div class="cart-quantity-selector" style="justify-self: center;">
                    <button class="quantity-button" onclick="changeCartQuantity('${productInfo.id}', -1)">-</button>
                    <input type="number" min="1" value="${cartItem.quantity}" class="quantity-input-field" 
                        onkeypress="if(event.key === 'Enter') { manualCartQuantityUpdate('${productInfo.id}', this.value); this.blur(); return false; } return event.charCode >= 48 && event.charCode <= 57" 
                        onchange="manualCartQuantityUpdate('${productInfo.id}', this.value)">
                    <button class="quantity-button" onclick="changeCartQuantity('${productInfo.id}', 1)">+</button>
                </div>
                
                <div class="cart-item-total-column" style="font-weight: 700; text-align: right; font-size: 16px; color: var(--primary-blue-color);">
                    ${formatCurrency(productInfo.price * cartItem.quantity)}
                </div>
            </article>
        `;
        cartContainerElement.innerHTML += itemHTML;
    });

    const summaryListContainer = document.getElementById("summary-items-list");
    if (summaryListContainer) {
        if (selectedItemsCount > 0) {
            summaryListContainer.innerHTML = summaryItemsHTML;
            summaryListContainer.style.display = "block";
        } else {
            summaryListContainer.innerHTML = "";
            summaryListContainer.style.display = "none";
        }
    }

    if (rollingSubtotal < 1000 && isPromoApplied) {
        applyPromoCode();
    }

    let shippingFeeToApply = 0;
    const shippingDisplayElement = document.getElementById("cart-shipping");

    if (rollingSubtotal === 0) {
        shippingFeeToApply = 0;
        shippingDisplayElement.textContent = "₱0.00";
        shippingDisplayElement.style.color = "var(--text-dark-color)";
    } else if (rollingSubtotal > 0 && rollingSubtotal < 200) {
        shippingFeeToApply = 30;
        shippingDisplayElement.textContent = formatCurrency(shippingFeeToApply);
        shippingDisplayElement.style.color = "var(--text-dark-color)";
    } else {
        shippingFeeToApply = 0;
        shippingDisplayElement.textContent = "Free";
        shippingDisplayElement.style.color = "var(--success-green-color)";
    }

    const finalCalculatedTotal = Math.max(0, rollingSubtotal + shippingFeeToApply - currentPromoDiscount);

    document.getElementById("cart-subtotal").textContent = formatCurrency(rollingSubtotal);
    document.getElementById("cart-total").textContent = formatCurrency(finalCalculatedTotal);

    if (document.getElementById("mobile-cart-total")) {
        document.getElementById("mobile-cart-total").textContent = formatCurrency(finalCalculatedTotal);
    }

    const discountRowElement = document.getElementById("discount-row");
    if (currentPromoDiscount > 0) {
        discountRowElement.style.display = "flex";
        document.getElementById("cart-discount-amount").textContent = "-" + formatCurrency(currentPromoDiscount);
    } else {
        if (discountRowElement) discountRowElement.style.display = "none";
    }
}

// Intercept external render functions to refresh the checkout views
setTimeout(() => {
    const originalRenderAddresses = window.renderAddresses;
    window.renderAddresses = function() {
        if (originalRenderAddresses) originalRenderAddresses();
        if (isCheckoutViewActive) renderCheckoutAddress();
    };

    const originalRenderPaymentMethods = window.renderPaymentMethods;
    window.renderPaymentMethods = function() {
        if (originalRenderPaymentMethods) originalRenderPaymentMethods();
        if (isCheckoutViewActive) renderCheckoutPaymentMethods();
    };
}, 100);