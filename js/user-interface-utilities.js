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