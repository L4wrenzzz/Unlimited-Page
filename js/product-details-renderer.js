/* ==========================================================================
    PRODUCT DETAILS RENDERER
    Reads the URL parameters to fetch the correct item, populates the DOM, 
    and handles specific add-to-cart logic, manual quantities, and user reviews.
   ========================================================================== */

let currentInteractiveRating = 5; 
let currentProductReviews = []; 
let currentReviewFilter = "All";
let currentProductId = null; 

document.addEventListener("DOMContentLoaded", () => {
    const urlParams = new URLSearchParams(window.location.search);
    currentProductId = urlParams.get('id');

    if (!currentProductId) return;

    const product = productDatabase.find(p => p.id === currentProductId);

    if (!product) {
        document.querySelector(".product-overview-grid").innerHTML = "<h2>Product Not Found</h2>";
        return;
    }

    // Populate DOM Elements
    document.title = `Unlimited Page - ${product.title}`;
    document.getElementById('detail-title').textContent = product.title;
    document.getElementById('detail-author').textContent = `by ${product.authorOrBrand}`;
    document.getElementById('detail-sold').textContent = `Sold: ${product.totalSold.toLocaleString()}`;
    
    const stockElement = document.getElementById('detail-stock');
    stockElement.textContent = `Stock: ${product.stock}`;
    stockElement.dataset.stock = product.stock;

    document.getElementById('detail-price').textContent = formatCurrency(product.price);
    document.getElementById('detail-desc').innerHTML = product.description.replace(/\n/g, '<br><br>');
    document.getElementById('detail-image').src = product.imageFile;

    // Load saved reviews specific to this product
    currentProductReviews = JSON.parse(localStorage.getItem(`unlimitedPageReviews_${currentProductId}`)) || [];

    // Setup Related Products
    const relatedProductsArray = productDatabase
        .filter(p => p.category === product.category && p.id !== product.id)
        .slice(0, 4);

    renderProductCards("related-products-grid", relatedProductsArray);

    // Setup Action Buttons
    document.getElementById('detail-add-cart-btn').addEventListener('click', () => {
        const qtyToadd = parseInt(document.getElementById('detail-quantity').value);
        addBulkQuantityToCart(product.id, qtyToadd);
    });

    document.getElementById('detail-buy-now-btn').addEventListener('click', () => {
        const qtyToadd = parseInt(document.getElementById('detail-quantity').value);
        addBulkQuantityToCart(product.id, qtyToadd);
        window.location.href = "cart.html";
    });

    initReviewSystem();
});

function changeDetailQuantity(delta) {
    const inputField = document.getElementById('detail-quantity');
    let currentVal = parseInt(inputField.value);
    manualDetailQuantityUpdate(currentVal + delta);
}

function manualDetailQuantityUpdate(val) {
    const inputField = document.getElementById('detail-quantity');
    const maxStock = parseInt(document.getElementById('detail-stock').dataset.stock);
    
    let newVal = parseInt(val);
    
    if (isNaN(newVal) || newVal < 1) newVal = 1;
    if (newVal > maxStock) {
        newVal = maxStock;
        showToastNotification("Maximum stock reached.");
    }

    inputField.value = newVal;
}

function addBulkQuantityToCart(productId, quantityToAdd) {
    const productToAdd = productDatabase.find(item => item.id === productId);
    
    // Use the dynamic cart key, defaulting to guest if not found
    let cartKey = window.CART_STORAGE_KEY || "unlimitedPageCart_guest";
    let existingCart = JSON.parse(localStorage.getItem(cartKey)) || [];
    
    let cartItemIndex = existingCart.findIndex(item => item.id === productId);

    if (cartItemIndex > -1) {
        let cartItem = existingCart[cartItemIndex];
        cartItem.quantity += quantityToAdd;
        cartItem.isSelectedForOrder = true;
        
        existingCart.splice(cartItemIndex, 1);
        existingCart.unshift(cartItem);

        if (cartItem.quantity > productToAdd.stock) {
            cartItem.quantity = productToAdd.stock;
            showToastNotification("Maximum stock reached.");
        } else {
            showToastNotification(`Added ${quantityToAdd} more to your cart!`);
        }
    } else {
        existingCart.unshift({
            id: productId,
            quantity: quantityToAdd,
            isSelectedForOrder: true
        });
        showToastNotification(`${quantityToAdd}x ${productToAdd.title} added to your cart!`);
    }

    // Save using the dynamic user key
    localStorage.setItem(cartKey, JSON.stringify(existingCart));
    
    if (typeof updateCartBadge === "function") {
        userShoppingCart = existingCart;
        updateCartBadge();
    }
}

/* ==========================================================================
    INTERACTIVE REVIEW SYSTEM
   ========================================================================== */

function openReviewModal() {
    document.getElementById('review-modal').style.display = 'flex';
}

function closeReviewModal() {
    document.getElementById('review-modal').style.display = 'none';
}

function initReviewSystem() {
    const stars = document.querySelectorAll('.star-item');
    updateStarsUI(stars);

    stars.forEach(star => {
        star.addEventListener('click', (e) => {
            currentInteractiveRating = parseInt(e.target.dataset.value);
            updateStarsUI(stars);
        });
    });

    document.getElementById('submit-review-btn').addEventListener('click', () => {
        const nameInput = document.getElementById('review-name').value.trim();
        const textInput = document.getElementById('review-text').value.trim();
        
        if (!textInput) {
            showToastNotification("Please enter a review message.");
            return;
        }

        const finalName = nameInput || "Anonymous User";
        const initials = finalName.substring(0, 2).toUpperCase();

        const newReview = {
            id: 'rev_' + Date.now(),
            name: finalName,
            initials: initials,
            text: textInput,
            rating: currentInteractiveRating,
            liked: false
        };

        currentProductReviews.unshift(newReview); 
        
        localStorage.setItem(`unlimitedPageReviews_${currentProductId}`, JSON.stringify(currentProductReviews));

        closeReviewModal();
        document.getElementById('review-name').value = '';
        document.getElementById('review-text').value = '';
        currentInteractiveRating = 5;
        updateStarsUI(stars);
        
        renderReviewsList();
        showToastNotification("Thank you! Your review has been posted.");
    });

    const filterTabs = document.querySelectorAll('.filter-tab');
    filterTabs.forEach(tab => {
        tab.addEventListener('click', (e) => {
            filterTabs.forEach(t => t.classList.remove('active'));
            e.target.classList.add('active');
            currentReviewFilter = e.target.dataset.filter;
            renderReviewsList();
        });
    });

    renderReviewsList();
}

/**
 * Returns HTML to perfectly render fractional stars using an overlay layer.
 * Note: Removed letter-spacing to fix the mathematical precision of the fractional width.
 */
function getStarsHTML(ratingAmount, fontSize = 16) {
    const percentage = (ratingAmount / 5) * 100;
    return `
        <div style="position: relative; display: inline-block; font-size: ${fontSize}px; color: #cbd5e1; line-height: 1;">
            ★★★★★
            <div style="position: absolute; top: 0; left: 0; white-space: nowrap; overflow: hidden; width: ${percentage}%; color: var(--warning-orange-color);">
                ★★★★★
            </div>
        </div>
    `;
}

function toggleReviewLike(reviewId) {
    const reviewToUpdate = currentProductReviews.find(r => r.id === reviewId);
    if (reviewToUpdate) {
        reviewToUpdate.liked = !reviewToUpdate.liked;
        localStorage.setItem(`unlimitedPageReviews_${currentProductId}`, JSON.stringify(currentProductReviews));
        renderReviewsList();
    }
}

function renderReviewsList() {
    const gridContainer = document.getElementById('reviews-grid-container');
    const totalReviews = currentProductReviews.length;
    let avgRating = "0.0";
    
    if (totalReviews > 0) {
        const sum = currentProductReviews.reduce((acc, rev) => acc + rev.rating, 0);
        avgRating = (sum / totalReviews).toFixed(1);
    }

    document.getElementById('detail-review-count').textContent = `(${totalReviews} Reviews)`;
    document.getElementById('review-huge-score').textContent = avgRating;
    
    document.getElementById('review-huge-stars').innerHTML = getStarsHTML(parseFloat(avgRating), 20);
    document.getElementById('detail-stars').innerHTML = getStarsHTML(parseFloat(avgRating), 18);

    let reviewsToRender = currentProductReviews;
    if (currentReviewFilter !== "All") {
        const filterNumber = parseInt(currentReviewFilter);
        reviewsToRender = currentProductReviews.filter(r => r.rating === filterNumber);
    }

    if (reviewsToRender.length === 0) {
        gridContainer.innerHTML = `<p style="grid-column: 1/-1; text-align: center; color: var(--text-muted-color); padding: 40px 0;">No reviews to show yet. Be the first to write one!</p>`;
        gridContainer.style.display = "block";
    } else {
        gridContainer.style.display = "grid"; 
        gridContainer.innerHTML = reviewsToRender.map(r => `
            <article class="review-card">
                <div class="review-user-header">
                    <div class="avatar" style="background-color: #f1f5f9; color: var(--text-dark-color);">${r.initials}</div>
                    <div class="user-meta">
                        <h4>${r.name}</h4>
                        <span>Just now</span>
                    </div>
                    <div class="review-stars">${getStarsHTML(r.rating, 14)}</div>
                </div>
                <p class="review-text">"${r.text}"</p>
                <button class="btn-helpful ${r.liked ? 'liked' : ''}" onclick="toggleReviewLike('${r.id}')">
                    <span class="material-icons-outlined">thumb_up</span> ${r.liked ? 1 : 0}
                </button>
            </article>
        `).join('');
    }
}

function updateStarsUI(starsNodeList) {
    starsNodeList.forEach(star => {
        const starValue = parseInt(star.dataset.value);
        if (starValue <= currentInteractiveRating) {
            star.classList.add('active');
        } else {
            star.classList.remove('active');
        }
    });
}