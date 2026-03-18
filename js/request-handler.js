/* ==========================================================================
    REQUEST A BOOK HANDLER
    Manages the form submission behavior for the Request a Book page.
   ========================================================================== */

document.addEventListener("DOMContentLoaded", () => {
    const requestForm = document.getElementById("book-request-form");

    if (requestForm) {
        requestForm.addEventListener("submit", (event) => {
            // Prevent the default browser behavior of refreshing the page
            event.preventDefault();

            // Grab the title input to make the toast message feel personalized
            const requestedTitle = document.getElementById("book-title").value;

            // Show success toast (Function is imported from user-interface-utilities.js)
            showToastNotification(`Successfully requested: "${requestedTitle}". We'll keep you updated!`);

            // Clear the form fields back to empty
            requestForm.reset();
        });
    }
});