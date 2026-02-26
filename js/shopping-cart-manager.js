/* ==========================================================================
    GLOBAL CART LOGIC
    Manages state for the shopping cart using the browser's localStorage. 
    Handles adding/removing items, promo codes, and calculating totals.
   ========================================================================== */

// Attempt to load existing cart data from localStorage, fallback to empty array
let rawCartData = JSON.parse(localStorage.getItem("unlimitedPageCart")) || [];

// Clean up the cart by filtering out items that no longer exist in the database
let userShoppingCart = rawCartData.filter((cartItem) =>
    productDatabase.some((databaseItem) => databaseItem.id === cartItem.id),
);

// If invalid items were removed during the filter, update local storage
if (rawCartData.length !== userShoppingCart.length) {
    localStorage.setItem("unlimitedPageCart", JSON.stringify(userShoppingCart));
}

// Global checkout state variables
let currentPromoDiscount = 0;
let isPromoApplied = false;
let promoBurnedDatabase =
    JSON.parse(localStorage.getItem("promoBurned")) || false;
let selectedPaymentMethod = "Cash on Delivery";

/**
 * Updates the selected payment method visually and functionally.
 * @param {string} paymentMethodString - The string representing the selected payment method.
 */
function selectPayment(paymentMethodString) {
    selectedPaymentMethod = paymentMethodString;
    const paymentMethodElements = document.querySelectorAll(
        ".checkout-payment-method",
    );

    // Toggle the "selected" CSS class on the correct payment box
    paymentMethodElements.forEach((paymentElement) => {
        if (
            paymentElement.getAttribute("data-method") === paymentMethodString
        ) {
            paymentElement.classList.add("selected");
        } else {
            paymentElement.classList.remove("selected");
        }
    });
}

/**
 * Updates the little number badge attached to the cart icon in the navigation.
 */
function updateCartBadge() {
    const badgeElement = document.getElementById("global-cart-badge");
    if (badgeElement) {
        badgeElement.textContent = userShoppingCart.length;
    }
}

/**
 * Adds a new item to the cart or increments its quantity if it's already there.
 * @param {string} productId - The unique identifier of the product.
 */
function addProductToCart(productId) {
    const productToAdd = productDatabase.find(
        (databaseItem) => databaseItem.id === productId,
    );
    if (!productToAdd) return;

    const existingCartItem = userShoppingCart.find(
        (databaseItem) => databaseItem.id === productId,
    );

    if (existingCartItem) {
        // Prevent users from adding more items than what is physically in stock
        if (existingCartItem.quantity < productToAdd.stock) {
            existingCartItem.quantity += 1;
            showToastNotification(
                `Increased quantity of ${productToAdd.title} in cart.`,
            );
        } else {
            showToastNotification(
                `Sorry, only ${productToAdd.stock} items in stock!`,
            );
        }
    } else {
        // Add new item object to cart array
        userShoppingCart.push({
            id: productToAdd.id,
            quantity: 1,
            isSelectedForOrder: false, // Items are unselected by default
        });
        showToastNotification(
            `${productToAdd.title} has been added to your cart!`,
        );
    }

    // Save changes to localStorage
    localStorage.setItem("unlimitedPageCart", JSON.stringify(userShoppingCart));
    updateCartBadge();
}

/**
 * Toggles whether a cart item is selected to be purchased in the current order.
 * @param {string} productId - The unique identifier of the product.
 */
function toggleCartItemSelection(productId) {
    const targetItem = userShoppingCart.find(
        (databaseItem) => databaseItem.id === productId,
    );
    if (targetItem) {
        targetItem.isSelectedForOrder = !targetItem.isSelectedForOrder;
        localStorage.setItem(
            "unlimitedPageCart",
            JSON.stringify(userShoppingCart),
        );
        initCart(); // Re-render cart to update subtotals
    }
}

/**
 * Directly sets a specific quantity for a cart item via the input field.
 * @param {string} productId - The unique identifier of the product.
 * @param {string|number} inputValue - The raw input value from the user.
 */
function manualCartQuantityUpdate(productId, inputValue) {
    let newQuantity = parseInt(inputValue);
    const itemIndex = userShoppingCart.findIndex(
        (databaseItem) => databaseItem.id === productId,
    );

    if (itemIndex > -1 && !isNaN(newQuantity)) {
        const productInfo = productDatabase.find(
            (databaseItem) => databaseItem.id === productId,
        );

        // Ensure quantity doesn't fall below 1
        if (newQuantity < 1) newQuantity = 1;

        // Ensure quantity doesn't exceed available stock
        if (newQuantity > productInfo.stock) {
            newQuantity = productInfo.stock;
            showToastNotification(
                `Maximum stock reached. Only ${productInfo.stock} available.`,
            );
        }

        userShoppingCart[itemIndex].quantity = newQuantity;
        localStorage.setItem(
            "unlimitedPageCart",
            JSON.stringify(userShoppingCart),
        );

        updateCartBadge();
        initCart(); // Re-render to update line-item total prices
    }
}

/**
 * Increases or decreases the cart item quantity by a set amount using buttons (+/-).
 * @param {string} productId - The unique identifier of the product.
 * @param {number} quantityDelta - The amount to add or subtract (e.g., 1 or -1).
 */
function changeCartQuantity(productId, quantityDelta) {
    const itemIndex = userShoppingCart.findIndex(
        (databaseItem) => databaseItem.id === productId,
    );
    if (itemIndex > -1) {
        let currentQuantity = userShoppingCart[itemIndex].quantity;
        // Reuse manual update function to enforce limits
        manualCartQuantityUpdate(productId, currentQuantity + quantityDelta);
    }
}

/**
 * Prompts the user for confirmation, and if confirmed, removes the item from the cart entirely.
 * @param {string} productId - The unique identifier of the product.
 */
function deleteItemFromCart(productId) {
    const itemIndex = userShoppingCart.findIndex(
        (databaseItem) => databaseItem.id === productId,
    );

    if (itemIndex > -1) {
        const productInfo = productDatabase.find(
            (databaseItem) => databaseItem.id === productId,
        );

        // Show a styled modal to confirm deletion instead of basic browser alert
        showConfirmModal(
            `Are you sure you want to remove\n<strong>${productInfo.title}</strong>\nfrom your cart?`,
            () => {
                // This callback ONLY runs if the user clicks 'Confirm'
                userShoppingCart.splice(itemIndex, 1);
                localStorage.setItem(
                    "unlimitedPageCart",
                    JSON.stringify(userShoppingCart),
                );
                updateCartBadge();
                initCart();
                showToastNotification(
                    `${productInfo.title} removed from cart.`,
                );
            },
        );
    }
}

/**
 * Evaluates and applies (or removes) promo code logic.
 */
function applyPromoCode() {
    const promoInputField = document.getElementById("promo-code-input");
    const promoMessageElement = document.getElementById("promo-message");
    const applyPromoButton = document.getElementById("promo-apply-button");
    if (!promoInputField) return;

    // Developer backdoor to reset promo code usage limit
    if (promoInputField.value.trim().toUpperCase() === "DEVRESET") {
        localStorage.removeItem("promoBurned");
        promoBurnedDatabase = false;
        promoMessageElement.textContent = "DEV: Promo code database reset!";
        promoMessageElement.style.color = "var(--primary-blue-color)";
        promoInputField.value = "";
        return;
    }

    // If a promo is already applied, clicking the button again will remove it
    if (isPromoApplied) {
        isPromoApplied = false;
        currentPromoDiscount = 0;
        promoInputField.value = "";
        promoInputField.disabled = false;

        applyPromoButton.textContent = "Apply";
        applyPromoButton.style.backgroundColor =
            "var(--background-light-color)";
        applyPromoButton.style.color = "var(--text-dark-color)";

        promoMessageElement.textContent = "Promo code removed.";
        promoMessageElement.style.color = "var(--text-muted-color)";

        initCart(); // Re-calculate total
        return;
    }

    const enteredCode = promoInputField.value.trim().toUpperCase();

    // Check if the one-time code was already used
    if (enteredCode === "DEATHNOTE" && promoBurnedDatabase) {
        promoMessageElement.textContent =
            "This code has already been used on your account.";
        promoMessageElement.style.color = "var(--danger-red-color)";
        return;
    }

    // Calculate subtotal to ensure it meets promo requirements
    let calculatedSubtotal = 0;
    userShoppingCart.forEach((cartItem) => {
        if (cartItem.isSelectedForOrder) {
            const databaseItem = productDatabase.find(
                (item) => item.id === cartItem.id,
            );
            if (databaseItem) {
                calculatedSubtotal +=
                    parseFloat(databaseItem.price) *
                    parseInt(cartItem.quantity);
            }
        }
    });

    if (enteredCode === "DEATHNOTE") {
        // Enforce minimum spend requirement
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
            promoMessageElement.textContent =
                "Order total must be at least ₱1000.";
            promoMessageElement.style.color = "var(--danger-red-color)";
        }
    } else {
        promoMessageElement.textContent = "Invalid promo code.";
        promoMessageElement.style.color = "var(--danger-red-color)";
    }

    initCart(); // Refresh cart UI with new discount applied
}

/**
 * Handles the checkout process, calculates final totals, shows receipt, and clears selected items.
 */
function processCheckout() {
    const selectedCartItems = userShoppingCart.filter(
        (cartItem) => cartItem.isSelectedForOrder,
    );

    // Validate that the user actually selected items before checking out
    if (selectedCartItems.length === 0) {
        showToastNotification(
            "Please select at least one item to place an order.",
        );
        return;
    }

    let finalSubtotal = 0;
    selectedCartItems.forEach((cartItem) => {
        const databaseItem = productDatabase.find(
            (item) => item.id === cartItem.id,
        );
        if (databaseItem)
            finalSubtotal +=
                parseFloat(databaseItem.price) * parseInt(cartItem.quantity);
    });

    // Apply shipping fee if order is under ₱200
    let calculatedShippingFee =
        finalSubtotal < 200 && finalSubtotal > 0 ? 30 : 0;

    // Ensure the total never goes below 0 due to discounts
    const finalOrderTotal = Math.max(
        0,
        finalSubtotal + calculatedShippingFee - currentPromoDiscount,
    );

    // Build Receipt UI
    const receiptHTML = `
        <h2 style="color: var(--success-green-color); margin-bottom: 15px; font-size: 24px;">Order Confirmed!</h2>
        
        <p style="margin-bottom: 20px; color: var(--text-dark-color); font-size: 16px;">
            Thank you for shopping with <strong style="white-space: nowrap;">Unlimited Page</strong>.
        </p>
        
        <div style="background-color: var(--background-light-color); padding: 15px; border-radius: 6px; text-align: left; margin-bottom: 20px; border: 1px solid var(--border-light-color);">
            <p style="margin-bottom: 8px; font-size: 14px;">
                <strong style="color: var(--text-muted-color);">Payment Method:</strong> <br> 
                <span style="font-weight: 600; color: var(--text-dark-color);">${selectedPaymentMethod}</span>
            </p>
            <p style="font-size: 14px;">
                <strong style="color: var(--text-muted-color);">Total Paid:</strong> <br> 
                <span style="font-size: 20px; font-weight: 700; color: var(--primary-blue-color);">${formatCurrency(finalOrderTotal)}</span>
            </p>
        </div>
    `;

    // Burn the promo code so it can't be used again
    if (isPromoApplied) {
        localStorage.setItem("promoBurned", JSON.stringify(true));
        promoBurnedDatabase = true;
    }

    // Remove purchased items from the cart
    userShoppingCart = userShoppingCart.filter(
        (cartItem) => !cartItem.isSelectedForOrder,
    );
    localStorage.setItem("unlimitedPageCart", JSON.stringify(userShoppingCart));

    // Reset checkout state
    isPromoApplied = false;
    currentPromoDiscount = 0;

    // Reset UI fields for promo codes
    const promoInputField = document.getElementById("promo-code-input");
    const promoMessageElement = document.getElementById("promo-message");
    const applyPromoButton = document.getElementById("promo-apply-button");

    if (promoInputField) {
        promoInputField.value = "";
        promoInputField.disabled = false;
    }
    if (promoMessageElement) {
        promoMessageElement.textContent = "";
    }
    if (applyPromoButton) {
        applyPromoButton.textContent = "Apply";
        applyPromoButton.style.backgroundColor =
            "var(--background-light-color)";
        applyPromoButton.style.color = "var(--text-dark-color)";
    }

    updateCartBadge();
    initCart(); // Reload empty/remaining cart

    // Show the receipt modal
    showCheckoutModal(receiptHTML, () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    });
}

/**
 * Main rendering function for the Cart page. Rebuilds the DOM list of cart items and updates summary numbers.
 */
function initCart() {
    const cartContainerElement = document.getElementById(
        "cart-items-container",
    );
    if (!cartContainerElement) return;

    cartContainerElement.innerHTML = "";
    let rollingSubtotal = 0;
    let summaryItemsHTML = "";
    let selectedItemsCount = 0;

    // Handle empty cart state
    if (userShoppingCart.length === 0) {
        cartContainerElement.innerHTML =
            '<p style="padding: 20px; color: var(--text-muted-color);">Your cart is currently empty.</p>';
        document.getElementById("cart-subtotal").textContent = "₱0.00";
        document.getElementById("cart-shipping").textContent = "₱0.00";
        document.getElementById("cart-total").textContent = "₱0.00";

        if (document.getElementById("mobile-cart-total"))
            document.getElementById("mobile-cart-total").textContent = "₱0.00";
        if (document.getElementById("discount-row"))
            document.getElementById("discount-row").style.display = "none";

        const summaryListContainer =
            document.getElementById("summary-items-list");
        if (summaryListContainer) summaryListContainer.style.display = "none";

        return;
    }

    // Sort items so selected items appear at the top of the list
    userShoppingCart.sort((itemA, itemB) => {
        return itemA.isSelectedForOrder === itemB.isSelectedForOrder
            ? 0
            : itemA.isSelectedForOrder
              ? -1
              : 1;
    });

    // Render each item
    userShoppingCart.forEach((cartItem) => {
        const productInfo = productDatabase.find(
            (databaseItem) => databaseItem.id === cartItem.id,
        );
        if (!productInfo) return;

        // If selected, add to subtotal and inject into the receipt summary view
        if (cartItem.isSelectedForOrder) {
            rollingSubtotal +=
                parseFloat(productInfo.price) * parseInt(cartItem.quantity);

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

        // Setup dynamic CSS classes for unselected items (to make them look faded)
        const opacityClass = cartItem.isSelectedForOrder
            ? ""
            : "omitted-from-order";
        const toggleButtonClass = cartItem.isSelectedForOrder
            ? "remove-button"
            : "add-button";
        const toggleIcon = cartItem.isSelectedForOrder
            ? "remove_circle_outline"
            : "add_circle_outline";
        const toggleText = cartItem.isSelectedForOrder
            ? "Remove"
            : "Place Order";

        const itemHTML = `
            <article class="cart-item-row ${opacityClass}">
                <div class="cart-item-product-col">
                    <img src="${productInfo.imageFile}" alt="${productInfo.title}" class="cart-item-image" onerror="this.src='https://placehold.co/300x420?text=Image+Missing'">
                    <div class="cart-item-details">
                        <h3 class="product-title" style="font-size: 15px;">${productInfo.title}</h3>
                        <p class="product-author-brand">by ${productInfo.authorOrBrand}</p>
                        <div class="cart-item-stock">Stock: ${productInfo.stock} available</div>
                        
                        <div class="cart-item-action-buttons">
                            <button class="cart-item-toggle-button ${toggleButtonClass}" onclick="toggleCartItemSelection('${productInfo.id}')">
                                <span class="material-icons-outlined" style="font-size: 14px; margin-right: 4px;">${toggleIcon}</span> ${toggleText}
                            </button>
                            <button class="cart-item-delete-button" onclick="deleteItemFromCart('${productInfo.id}')">
                                <span class="material-icons-outlined" style="font-size: 14px; margin-right: 4px;">delete</span> Remove from Cart
                            </button>
                        </div>
                    </div>
                </div>
                
                <div class="cart-item-price-col" style="font-weight: 600; text-align: center;">${formatCurrency(productInfo.price)}</div>
                
                <div class="cart-quantity-selector" style="justify-self: center;">
                    <button class="quantity-button" onclick="changeCartQuantity('${productInfo.id}', -1)">-</button>
                    <input type="number" min="1" value="${cartItem.quantity}" class="quantity-input-field" 
                            onkeypress="return event.charCode >= 48 && event.charCode <= 57" 
                            onchange="manualCartQuantityUpdate('${productInfo.id}', this.value)">
                    <button class="quantity-button" onclick="changeCartQuantity('${productInfo.id}', 1)">+</button>
                </div>
                
                <div class="cart-item-total-col" style="font-weight: 700; text-align: right; font-size: 16px; color: var(--primary-blue-color);">
                    ${formatCurrency(productInfo.price * cartItem.quantity)}
                </div>
            </article>
        `;
        cartContainerElement.innerHTML += itemHTML;
    });

    // Update the Summary List Container UI
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

    // Auto-remove promo code if subtotal falls below requirement
    if (rollingSubtotal < 1000 && isPromoApplied) {
        applyPromoCode();
    }

    // Calculate dynamic shipping fee based on subtotal limits
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
        shippingDisplayElement.textContent = "Free"; // Free shipping threshold met
        shippingDisplayElement.style.color = "var(--success-green-color)";
    }

    // Final calculations
    const finalCalculatedTotal = Math.max(
        0,
        rollingSubtotal + shippingFeeToApply - currentPromoDiscount,
    );

    document.getElementById("cart-subtotal").textContent =
        formatCurrency(rollingSubtotal);
    document.getElementById("cart-total").textContent =
        formatCurrency(finalCalculatedTotal);

    if (document.getElementById("mobile-cart-total")) {
        document.getElementById("mobile-cart-total").textContent =
            formatCurrency(finalCalculatedTotal);
    }

    // Toggle discount row visibility in summary
    const discountRowElement = document.getElementById("discount-row");
    if (currentPromoDiscount > 0) {
        discountRowElement.style.display = "flex";
        document.getElementById("cart-discount-amount").textContent =
            "-" + formatCurrency(currentPromoDiscount);
    } else {
        if (discountRowElement) discountRowElement.style.display = "none";
    }
}
