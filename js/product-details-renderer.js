/* ==========================================================================
    PRODUCT DETAILS RENDERER
    Reads the URL parameters to fetch the correct item, populates the DOM, 
    and handles specific add-to-cart logic, manual quantities, and user reviews.
   ========================================================================== */

let currentInteractiveRating = 5;
let currentProductReviews = [];
let currentReviewFilter = "All";
let currentProductId = null;

let currentReviewPage = 1;
const REVIEWS_PER_PAGE = 4;

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
    document.getElementById('detail-description').innerHTML = product.description.replace(/\n/g, '<br><br>');
    document.getElementById('detail-image').src = product.imageFile;

    // Load saved reviews specific to this product
    currentProductReviews = JSON.parse(localStorage.getItem(`unlimitedPageReviews_${currentProductId}`)) || [];

    // Setup Related Products
    const relatedProductsArray = productDatabase
        .filter(p => p.category === product.category && p.id !== product.id)
        .slice(0, 4);

    renderProductCards("related-products-grid", relatedProductsArray);

    // Setup Action Buttons
    document.getElementById('detail-add-cart-button').addEventListener('click', () => {
        if (localStorage.getItem("isLoggedIn") !== "true") {
            window.location.href = "login.html";
            return;
        }
        const quantityToAdd = parseInt(document.getElementById('detail-quantity').value);
        addBulkQuantityToCart(product.id, quantityToAdd);
    });

    document.getElementById('detail-buy-now-button').addEventListener('click', () => {
        if (localStorage.getItem("isLoggedIn") !== "true") {
            window.location.href = "login.html";
            return;
        }
        const quantityToAdd = parseInt(document.getElementById('detail-quantity').value);
        addBulkQuantityToCart(product.id, quantityToAdd, false); // Pass false to hide toast
        window.location.href = "cart.html";
    });

    initReviewSystem();
});

function changeDetailQuantity(delta) {
    const inputField = document.getElementById('detail-quantity');
    let currentValue = parseInt(inputField.value);
    manualDetailQuantityUpdate(currentValue + delta);
}

function manualDetailQuantityUpdate(val) {
    const inputField = document.getElementById('detail-quantity');
    const maxStock = parseInt(document.getElementById('detail-stock').dataset.stock);

    let newValue = parseInt(val);

    if (isNaN(newValue) || newValue < 1) newValue = 1;
    if (newValue > maxStock) {
        newValue = maxStock;
        showToastNotification("Maximum stock reached");
    }

    inputField.value = newValue;
}

function addBulkQuantityToCart(productId, quantityToAdd, showToast = true) {
    const productToAdd = productDatabase.find(item => item.id === productId);

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
            if (showToast) showToastNotification("Maximum stock reached");
        } else {
            if (showToast) showToastNotification("Item has been added to your shopping cart.");
        }
    } else {
        existingCart.unshift({
            id: productId,
            quantity: quantityToAdd,
            isSelectedForOrder: true
        });
        if (showToast) showToastNotification("Item has been added to your shopping cart.");
    }

    localStorage.setItem(cartKey, JSON.stringify(existingCart));

    if (typeof updateCartBadge === "function") {
        userShoppingCart = existingCart;
        updateCartBadge();
    }
}

/* ==========================================================================
    INTERACTIVE REVIEW SYSTEM & TIME FORMATTING
   ========================================================================== */

function openReviewModal() {
    if (localStorage.getItem("isLoggedIn") !== "true") {
        window.location.href = "login.html";
        return;
    }
    document.getElementById('review-modal').style.display = 'flex';
}

function closeReviewModal() {
    document.getElementById('review-modal').style.display = 'none';
}

/**
 * Calculates relative time differences based on a given timestamp.
 */
function timeAgo(timestamp) {
    const seconds = Math.floor((Date.now() - timestamp) / 1000);

    if (seconds < 60) return "Just now";

    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes} minute${minutes !== 1 ? 's' : ''} ago`;

    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours} hour${hours !== 1 ? 's' : ''} ago`;

    const days = Math.floor(hours / 24);
    if (days < 7) return `${days} day${days !== 1 ? 's' : ''} ago`;

    const weeks = Math.floor(days / 7);
    if (weeks < 4) return `${weeks} week${weeks !== 1 ? 's' : ''} ago`;

    const months = Math.floor(days / 30);
    if (months < 12) return `${months} month${months !== 1 ? 's' : ''} ago`;

    const years = Math.floor(days / 365);
    return `${years} year${years !== 1 ? 's' : ''} ago`;
}

function toggleReviewText(buttonElement, reviewId) {
    const textElement = document.getElementById('review-text-' + reviewId);
    if (textElement.classList.contains('collapsed')) {
        textElement.classList.remove('collapsed');
        buttonElement.textContent = 'See less';
    } else {
        textElement.classList.add('collapsed');
        buttonElement.textContent = 'See more';
    }
}

function initReviewSystem() {
    const stars = document.querySelectorAll('.star-item');
    updateStarsUI(stars);

    stars.forEach(star => {
        star.addEventListener('click', (event) => {
            currentInteractiveRating = parseInt(event.target.dataset.value); // Fixed
            updateStarsUI(stars);
        });
    });

    document.getElementById('submit-review-button').addEventListener('click', () => {
        const textInput = document.getElementById('review-text').value.trim();
        const reviewErrorText = document.getElementById('review-error-msg');

        if (!textInput) {
            if (reviewErrorText) reviewErrorText.style.display = "block";
            return;
        }
        if (reviewErrorText) reviewErrorText.style.display = "none";

        const currentUserEmail = localStorage.getItem("unlimitedPage_CurrentUser");
        const usersDatabase = JSON.parse(localStorage.getItem("unlimitedPage_Users")) || {};

        let finalName = "Anonymous User";
        let userAvatar = null;

        if (currentUserEmail && usersDatabase[currentUserEmail]) {
            finalName = usersDatabase[currentUserEmail].name || "User";
            userAvatar = usersDatabase[currentUserEmail].avatar;
        }

        const initials = finalName.substring(0, 2).toUpperCase();

        const newReview = {
            id: 'rev_' + Date.now(),
            userEmail: currentUserEmail,
            name: finalName,
            initials: initials,
            avatar: userAvatar,
            text: textInput,
            rating: currentInteractiveRating,
            liked: false,
            timestamp: Date.now()
        };

        currentProductReviews.unshift(newReview);

        localStorage.setItem(`unlimitedPageReviews_${currentProductId}`, JSON.stringify(currentProductReviews));

        closeReviewModal();
        document.getElementById('review-text').value = '';
        currentInteractiveRating = 5;
        updateStarsUI(stars);

        currentReviewPage = 1;
        renderReviewsList();
    });

    const filterTabs = document.querySelectorAll('.filter-tab');
    filterTabs.forEach(tab => {
        tab.addEventListener('click', (event) => {
            filterTabs.forEach(tabElement => tabElement.classList.remove('active'));
            event.target.classList.add('active'); // Fixed
            currentReviewFilter = event.target.dataset.filter; // Fixed

            currentReviewPage = 1;
            renderReviewsList();
        });
    });

    renderReviewsList();
}

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

function toggleReviewLike(reviewId, buttonElement) {
    const reviewToUpdate = currentProductReviews.find(reviewItem => reviewItem.id === reviewId);
    if (reviewToUpdate) {
        // Update data silently
        reviewToUpdate.liked = !reviewToUpdate.liked;
        localStorage.setItem(`unlimitedPageReviews_${currentProductId}`, JSON.stringify(currentProductReviews));

        // Update DOM element directly to preserve the "See more" state
        if (reviewToUpdate.liked) {
            buttonElement.classList.add('liked');
            buttonElement.innerHTML = '<span class="material-icons-outlined">thumb_up</span> 1';
        } else {
            buttonElement.classList.remove('liked');
            buttonElement.innerHTML = '<span class="material-icons-outlined">thumb_up</span> 0';
        }
    }
}

function renderReviewPagination(totalFilteredItems) {
    const paginationContainer = document.getElementById('review-pagination-container');
    if (!paginationContainer) return;

    paginationContainer.innerHTML = '';
    const totalPages = Math.ceil(totalFilteredItems / REVIEWS_PER_PAGE);

    if (totalPages <= 1) {
        paginationContainer.style.display = 'none';
        return;
    }

    paginationContainer.style.display = 'flex';

    // Previous Button
    const previousButtonElement = document.createElement('button');
    previousButtonElement.className = 'page-button';
    previousButtonElement.innerHTML = '<span class="material-icons-outlined">chevron_left</span>';
    previousButtonElement.disabled = currentReviewPage === 1;
    previousButtonElement.onclick = () => {
        if (currentReviewPage > 1) {
            currentReviewPage--;
            renderReviewsList();
        }
    };
    paginationContainer.appendChild(previousButtonElement);

    // Numbered Buttons
    for (let i = 1; i <= totalPages; i++) {
        const pageButtonElement = document.createElement('button');
        pageButtonElement.className = `page-button ${i === currentReviewPage ? 'active' : ''}`;
        pageButtonElement.textContent = i;
        pageButtonElement.onclick = () => {
            currentReviewPage = i;
            renderReviewsList();
        };
        paginationContainer.appendChild(pageButtonElement);
    }

    // Next Button
    const nextButtonElement = document.createElement('button');
    nextButtonElement.className = 'page-button';
    nextButtonElement.innerHTML = '<span class="material-icons-outlined">chevron_right</span>';
    nextButtonElement.disabled = currentReviewPage === totalPages;
    nextButtonElement.onclick = () => {
        if (currentReviewPage < totalPages) {
            currentReviewPage++;
            renderReviewsList();
        }
    };
    paginationContainer.appendChild(nextButtonElement);
}

function renderReviewsList() {
    const gridContainer = document.getElementById('reviews-grid-container');
    const totalReviews = currentProductReviews.length;
    let averageRating = "0.0";

    if (totalReviews > 0) {
        const sum = currentProductReviews.reduce((accumulator, reviewItem) => accumulator + reviewItem.rating, 0);
        averageRating = (sum / totalReviews).toFixed(1);
    }

    document.getElementById('detail-review-count').textContent = `(${totalReviews} Reviews)`;
    document.getElementById('review-huge-score').textContent = averageRating;

    document.getElementById('review-huge-stars').innerHTML = getStarsHTML(parseFloat(averageRating), 20);
    document.getElementById('detail-stars').innerHTML = getStarsHTML(parseFloat(averageRating), 18);

    let reviewsToRender = currentProductReviews;
    if (currentReviewFilter !== "All") {
        const filterNumber = parseInt(currentReviewFilter);
        reviewsToRender = currentProductReviews.filter(reviewItem => reviewItem.rating === filterNumber);
    }

    // Process pagination limits
    const totalFilteredReviews = reviewsToRender.length;
    const startIndex = (currentReviewPage - 1) * REVIEWS_PER_PAGE;
    const paginatedReviews = reviewsToRender.slice(startIndex, startIndex + REVIEWS_PER_PAGE);

    if (paginatedReviews.length === 0) {
        gridContainer.innerHTML = `<p style="grid-column: 1/-1; text-align: center; color: var(--text-muted-color); padding: 40px 0;">No reviews to show yet.</p>`;
        gridContainer.style.display = "block";
    } else {
        gridContainer.style.display = "grid";

        // Fetch the users database once to sync avatars/names dynamically
        const usersDatabase = JSON.parse(localStorage.getItem("unlimitedPage_Users")) || {};

        gridContainer.innerHTML = paginatedReviews.map(reviewItem => {
            const timestampValue = reviewItem.timestamp || parseInt(reviewItem.id.split('_')[1]);
            const formattedTime = timeAgo(timestampValue);

            const isLongText = reviewItem.text.length > 140;

            // DYNAMIC NAME & AVATAR SYNC LOGIC
            let currentAvatar = reviewItem.avatar;
            let currentName = reviewItem.name;
            let currentInitials = reviewItem.initials;
            let matchingUser = null;

            // Check if the review is linked to an email, otherwise try to match by name (for older reviews)
            if (reviewItem.userEmail && usersDatabase[reviewItem.userEmail]) {
                matchingUser = usersDatabase[reviewItem.userEmail];
            } else {
                matchingUser = Object.values(usersDatabase).find(u => u.name === reviewItem.name);
            }

            // Apply the user's latest avatar, name, and initials if they exist in the DB
            if (matchingUser) {
                if (matchingUser.avatar) {
                    currentAvatar = matchingUser.avatar;
                }
                if (matchingUser.name) {
                    currentName = matchingUser.name;
                    currentInitials = currentName.substring(0, 2).toUpperCase();
                }
            }

            // Render initials by default, unless there is a custom image
            let avatarDisplayHTML = currentInitials;
            if (currentAvatar && currentAvatar !== "images/user-profile.png") {
                avatarDisplayHTML = `<img src="${currentAvatar}" alt="${currentName}" style="width: 100%; height: 100%; border-radius: 50%; object-fit: cover;">`;
            }

            // Note we pass `this` to toggleReviewLike so it only updates the clicked button!
            return `
            <article class="review-card">
                <div class="review-user-header">
                    <div class="avatar" style="background-color: #f1f5f9; color: var(--text-dark-color);">${avatarDisplayHTML}</div>
                    <div class="user-meta">
                        <h4>${currentName}</h4>
                        <span>${formattedTime}</span>
                    </div>
                    <div class="review-stars">${getStarsHTML(reviewItem.rating, 14)}</div>
                </div>
                
                <div class="review-text-wrapper">
                    <p id="review-text-${reviewItem.id}" class="review-text ${isLongText ? 'collapsed' : ''}">${reviewItem.text}</p>
                    ${isLongText ? `<button class="see-more-button" onclick="toggleReviewText(this, '${reviewItem.id}')">See more</button>` : ''}
                </div>
                
                <button class="button-helpful ${reviewItem.liked ? 'liked' : ''}" onclick="toggleReviewLike('${reviewItem.id}', this)">
                    <span class="material-icons-outlined">thumb_up</span> ${reviewItem.liked ? 1 : 0}
                </button>
            </article>
            `;
        }).join('');
    }

    renderReviewPagination(totalFilteredReviews);
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