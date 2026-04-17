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
        if (localStorage.getItem("isLoggedIn") !== "true") {
            window.location.href = "login.html";
            return;
        }
        const qtyToadd = parseInt(document.getElementById('detail-quantity').value);
        addBulkQuantityToCart(product.id, qtyToadd);
    });

    document.getElementById('detail-buy-now-btn').addEventListener('click', () => {
        if (localStorage.getItem("isLoggedIn") !== "true") {
            window.location.href = "login.html";
            return;
        }
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

function toggleReviewText(btnElement, reviewId) {
    const textElement = document.getElementById('review-text-' + reviewId);
    if (textElement.classList.contains('collapsed')) {
        textElement.classList.remove('collapsed');
        btnElement.textContent = 'See less';
    } else {
        textElement.classList.add('collapsed');
        btnElement.textContent = 'See more';
    }
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
        const textInput = document.getElementById('review-text').value.trim();
        
        if (!textInput) {
            showToastNotification("Please enter a review message.");
            return;
        }

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
        showToastNotification("Thank you! Your review has been posted.");
    });

    const filterTabs = document.querySelectorAll('.filter-tab');
    filterTabs.forEach(tab => {
        tab.addEventListener('click', (e) => {
            filterTabs.forEach(t => t.classList.remove('active'));
            e.target.classList.add('active');
            currentReviewFilter = e.target.dataset.filter;
            
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
    const reviewToUpdate = currentProductReviews.find(r => r.id === reviewId);
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
    const prevBtn = document.createElement('button');
    prevBtn.className = 'page-button';
    prevBtn.innerHTML = '<span class="material-icons-outlined">chevron_left</span>';
    prevBtn.disabled = currentReviewPage === 1;
    prevBtn.onclick = () => {
        if (currentReviewPage > 1) {
            currentReviewPage--;
            renderReviewsList();
        }
    };
    paginationContainer.appendChild(prevBtn);

    // Numbered Buttons
    for (let i = 1; i <= totalPages; i++) {
        const pageBtn = document.createElement('button');
        pageBtn.className = `page-button ${i === currentReviewPage ? 'active' : ''}`;
        pageBtn.textContent = i;
        pageBtn.onclick = () => {
            currentReviewPage = i;
            renderReviewsList();
        };
        paginationContainer.appendChild(pageBtn);
    }

    // Next Button
    const nextBtn = document.createElement('button');
    nextBtn.className = 'page-button';
    nextBtn.innerHTML = '<span class="material-icons-outlined">chevron_right</span>';
    nextBtn.disabled = currentReviewPage === totalPages;
    nextBtn.onclick = () => {
        if (currentReviewPage < totalPages) {
            currentReviewPage++;
            renderReviewsList();
        }
    };
    paginationContainer.appendChild(nextBtn);
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

    // Process pagination limits
    const totalFilteredReviews = reviewsToRender.length;
    const startIndex = (currentReviewPage - 1) * REVIEWS_PER_PAGE;
    const paginatedReviews = reviewsToRender.slice(startIndex, startIndex + REVIEWS_PER_PAGE);

    if (paginatedReviews.length === 0) {
        gridContainer.innerHTML = `<p style="grid-column: 1/-1; text-align: center; color: var(--text-muted-color); padding: 40px 0;">No reviews to show yet. Be the first to write one!</p>`;
        gridContainer.style.display = "block";
    } else {
        gridContainer.style.display = "grid"; 
        
        // Fetch the users database once to sync avatars/names dynamically
        const usersDatabase = JSON.parse(localStorage.getItem("unlimitedPage_Users")) || {};
        
        gridContainer.innerHTML = paginatedReviews.map(r => {
            const timestampValue = r.timestamp || parseInt(r.id.split('_')[1]);
            const formattedTime = timeAgo(timestampValue);
            
            const isLongText = r.text.length > 140;
            
            // DYNAMIC NAME & AVATAR SYNC LOGIC
            let currentAvatar = r.avatar;
            let currentName = r.name;
            let currentInitials = r.initials;
            let matchingUser = null;
            
            // Check if the review is linked to an email, otherwise try to match by name (for older reviews)
            if (r.userEmail && usersDatabase[r.userEmail]) {
                matchingUser = usersDatabase[r.userEmail];
            } else {
                matchingUser = Object.values(usersDatabase).find(u => u.name === r.name);
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
            if (currentAvatar && currentAvatar !== "images/userProfile.png") {
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
                    <div class="review-stars">${getStarsHTML(r.rating, 14)}</div>
                </div>
                
                <div class="review-text-wrapper">
                    <p id="review-text-${r.id}" class="review-text ${isLongText ? 'collapsed' : ''}">${r.text}</p>
                    ${isLongText ? `<button class="see-more-btn" onclick="toggleReviewText(this, '${r.id}')">See more</button>` : ''}
                </div>
                
                <button class="btn-helpful ${r.liked ? 'liked' : ''}" onclick="toggleReviewLike('${r.id}', this)">
                    <span class="material-icons-outlined">thumb_up</span> ${r.liked ? 1 : 0}
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