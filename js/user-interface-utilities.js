/* ==========================================================================
    GLOBAL UTILITY & SEARCH FUNCTIONS
    Reusable helper methods for styling, navigating, and popping up custom UI elements.
   ========================================================================== */

/**
 * Standardizes currency formatting across the app (Philippine Peso).
 * @param {number} amount - The numerical value to be formatted.
 * @returns {string} Formatted string, e.g., "₱1,250.00"
 */
function formatCurrency(amount) {
    return (
        "₱" +
        parseFloat(amount).toLocaleString("en-PH", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        })
    );
}

/**
 * Attaches the 'Enter' key press listener to all search inputs so users
 * can jump straight to the catalog page with their query.
 */
function setupGlobalSearch() {
    const searchInputFields = document.querySelectorAll(".search-input-field");
    searchInputFields.forEach((inputElement) => {
        inputElement.addEventListener("keypress", (event) => {
            if (event.key === "Enter" && inputElement.value.trim() !== "") {
                // Redirect user with the URL parameter attached
                window.location.href = `catalog.html?search=${encodeURIComponent(inputElement.value.trim())}`;
            }
        });
    });
}

/**
 * Smoothly scrolls the window down to the order summary section.
 * Accounts for the height of the fixed navigation header so content isn't hidden.
 */
function scrollToSummary() {
    const orderSummaryBox = document.getElementById("order-summary-box");
    const mainHeader = document.querySelector(".main-navigation-header");

    if (orderSummaryBox && mainHeader) {
        const headerHeight = mainHeader.offsetHeight;
        const paddingOffset = 20;
        const elementPosition = orderSummaryBox.getBoundingClientRect().top;
        const targetScrollPosition =
            elementPosition + window.pageYOffset - headerHeight - paddingOffset;
        window.scrollTo({ top: targetScrollPosition, behavior: "smooth" });
    }
}

/**
 * Observes scroll position to hide the mobile checkout bar once the
 * actual order summary box comes into view (to avoid overlapping duplicate UI).
 */
function setupMobileCheckoutObserver() {
    const mobileCheckoutBar = document.querySelector(".mobile-checkout-bar");
    const orderSummaryBox = document.getElementById("order-summary-box");

    if (mobileCheckoutBar && orderSummaryBox) {
        window.addEventListener("scroll", () => {
            const summaryRectangle = orderSummaryBox.getBoundingClientRect();
            // If the summary box is currently visible on screen
            if (summaryRectangle.top <= window.innerHeight) {
                mobileCheckoutBar.style.transform = "translateY(100%)";
                mobileCheckoutBar.style.opacity = "0";
                mobileCheckoutBar.style.pointerEvents = "none";
            } else {
                mobileCheckoutBar.style.transform = "translateY(0)";
                mobileCheckoutBar.style.opacity = "1";
                mobileCheckoutBar.style.pointerEvents = "auto";
            }
        });
        // Fire event once immediately to set initial state on load
        window.dispatchEvent(new Event("scroll"));
    }
}

/**
 * Generates a temporary "toast" notification bubble at the bottom of the screen.
 * Automatically disappears after 4 seconds or when the user clicks the screen.
 * @param {string} messageText - The message to display.
 */
function showToastNotification(messageText) {
    const toastElement = document.createElement("div");
    toastElement.classList.add("custom-notification-toast");
    toastElement.textContent = messageText;
    document.body.appendChild(toastElement);

    const removeToastElement = () => {
        if (document.body.contains(toastElement)) {
            toastElement.remove();
            document.removeEventListener("click", handleScreenClick);
        }
    };

    const timeoutIdentifier = setTimeout(removeToastElement, 4000);

    // Function allowing users to click anywhere to dismiss the toast early
    const handleScreenClick = () => {
        clearTimeout(timeoutIdentifier);
        removeToastElement();
    };

    setTimeout(() => {
        document.addEventListener("click", handleScreenClick);
    }, 100);
}

/**
 * Creates a generic full-screen modal (used primarily for showing order receipts).
 * @param {string} checkoutMessageHTML - The HTML string to render inside the modal.
 * @param {function} onCloseCallback - Optional function to run after the modal is closed.
 */
function showCheckoutModal(checkoutMessageHTML, onCloseCallback) {
    const overlayElement = document.createElement("div");
    overlayElement.classList.add("custom-modal-overlay");

    const modalBoxElement = document.createElement("div");
    modalBoxElement.classList.add("custom-modal-box");

    const contentContainerElement = document.createElement("div");
    contentContainerElement.innerHTML = checkoutMessageHTML; // Allows for bolding, coloring text, etc.

    const closeButtonElement = document.createElement("button");
    closeButtonElement.textContent = "Close";
    closeButtonElement.classList.add("custom-modal-close-button");

    closeButtonElement.addEventListener("click", () => {
        overlayElement.remove();
        if (onCloseCallback) {
            onCloseCallback();
        }
    });

    modalBoxElement.appendChild(contentContainerElement);
    modalBoxElement.appendChild(closeButtonElement);
    overlayElement.appendChild(modalBoxElement);
    document.body.appendChild(overlayElement);
}

/**
 * Creates a confirmation dialog requiring the user to explicitly "Cancel" or "Confirm".
 * @param {string} confirmMessageText - The prompt text (e.g., "Are you sure?").
 * @param {function} onConfirmCallback - The logic to execute ONLY if they hit confirm.
 */
function showConfirmModal(confirmMessageText, onConfirmCallback) {
    const overlayElement = document.createElement("div");
    overlayElement.classList.add("custom-modal-overlay");

    const modalBoxElement = document.createElement("div");
    modalBoxElement.classList.add("custom-modal-box");

    const textParagraphElement = document.createElement("p");
    textParagraphElement.innerHTML = confirmMessageText;
    textParagraphElement.style.whiteSpace = "pre-line"; // Preserves \n line breaks

    const buttonGroupElement = document.createElement("div");
    buttonGroupElement.classList.add("custom-modal-button-group");

    const cancelButton = document.createElement("button");
    cancelButton.textContent = "Cancel";
    cancelButton.classList.add("custom-modal-cancel-button");
    cancelButton.addEventListener("click", () => overlayElement.remove());

    const confirmButton = document.createElement("button");
    confirmButton.textContent = "Remove Item";
    confirmButton.classList.add("custom-modal-confirm-button");
    confirmButton.addEventListener("click", () => {
        overlayElement.remove();
        if (onConfirmCallback) {
            onConfirmCallback();
        }
    });

    buttonGroupElement.appendChild(cancelButton);
    buttonGroupElement.appendChild(confirmButton);

    modalBoxElement.appendChild(textParagraphElement);
    modalBoxElement.appendChild(buttonGroupElement);
    overlayElement.appendChild(modalBoxElement);
    document.body.appendChild(overlayElement);
}

/* ==========================================================================
   SMART HEADER SCROLL LOGIC
   Hides the header when scrolling down, shows it when scrolling up.
========================================================================== */
function initSmartHeader() {
    let lastScrollTop = 0;
    const header = document.querySelector('.main-navigation-header');
    
    if (!header) return;

    window.addEventListener('scroll', () => {
        let scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        // Add a small threshold to avoid triggering on tiny bounces
        if (Math.abs(lastScrollTop - scrollTop) <= 5) return;
        
        if (scrollTop > lastScrollTop && scrollTop > header.offsetHeight) {
            // User is scrolling down
            header.classList.add('header-hidden');
        } else {
            // User is scrolling up
            header.classList.remove('header-hidden');
        }
        
        // Prevent negative scrolling values on mobile bounce effects
        lastScrollTop = scrollTop <= 0 ? 0 : scrollTop; 
    }, false);
}

/* ==========================================================================
   MOBILE HEADER INJECTION
   Dynamically builds the responsive header layout.
========================================================================== */
function injectMobileHeader() {
    const header = document.querySelector('.main-navigation-header');
    if (!header || document.querySelector('.mobile-left-actions')) return;

    const topRow = header.querySelector('.navigation-top-row');
    const searchWrapper = header.querySelector('.search-input-wrapper');
    const navBottom = header.querySelector('.navigation-bottom-row');

    // 1. Create Left Action (Hamburger ONLY)
    const leftActions = document.createElement('div');
    leftActions.className = 'mobile-left-actions';

    const menuBtn = document.createElement('button');
    menuBtn.className = 'mobile-header-btn';
    menuBtn.innerHTML = '<span class="material-icons-outlined">menu</span>';

    leftActions.appendChild(menuBtn);
    topRow.insertBefore(leftActions, topRow.firstChild);

    // 2. Create the Slide-Out Menu Sidebar with Branding
    const sidebar = document.createElement('div');
    sidebar.className = 'mobile-nav-sidebar';
    sidebar.innerHTML = `
        <div class="mobile-nav-header-top">
            <a href="index.html" class="brand-logo-container" style="margin: 0; text-decoration: none;">
                <img src="images/website-logo.jpg" alt="Unlimited Page Logo" class="brand-logo-image" style="height: 28px;" />
                <span>Unlimited Page</span>
            </a>
            <button class="mobile-header-btn close-sidebar-btn"><span class="material-icons-outlined">close</span></button>
        </div>
        <div class="mobile-nav-links-container"></div>
    `;

    const linksContainer = sidebar.querySelector('.mobile-nav-links-container');
    if (navBottom) {
        navBottom.querySelectorAll('a').forEach(link => {
            linksContainer.appendChild(link.cloneNode(true));
        });
    }

    const backdrop = document.createElement('div');
    backdrop.className = 'mobile-nav-backdrop';

    document.body.appendChild(sidebar);
    document.body.appendChild(backdrop);

    // 3. Create the Permanent Mobile Search Row
    const mobileSearchRow = document.createElement('div');
    mobileSearchRow.className = 'mobile-search-row';
    
    if (searchWrapper) {
        // Clone the desktop search wrapper
        const clonedSearch = searchWrapper.cloneNode(true);
        // Force it to display inline-block so it overrides the "display: none" from the CSS
        clonedSearch.style.display = 'block'; 
        mobileSearchRow.appendChild(clonedSearch);
        
        // Re-attach the enter key listener for the mobile search bar
        const mobileInput = clonedSearch.querySelector('.search-input-field');
        if (mobileInput) {
            mobileInput.addEventListener('keypress', (event) => {
                if (event.key === "Enter" && mobileInput.value.trim() !== "") {
                    window.location.href = `catalog.html?search=${encodeURIComponent(mobileInput.value.trim())}`;
                }
            });
        }
    }
    
    header.appendChild(mobileSearchRow);

    // 4. Attach Click Event Listeners
    menuBtn.addEventListener('click', () => {
        sidebar.classList.add('open');
        backdrop.classList.add('open');
        document.body.style.overflow = 'hidden'; 
    });

    const closeSidebar = () => {
        sidebar.classList.remove('open');
        backdrop.classList.remove('open');
        document.body.style.overflow = ''; 
    };

    sidebar.querySelector('.close-sidebar-btn').addEventListener('click', closeSidebar);
    backdrop.addEventListener('click', closeSidebar);
}

// Automatically execute injection and scroll tracker on page load
document.addEventListener("DOMContentLoaded", () => {
    injectMobileHeader();
    initSmartHeader();
});