/* ==========================================================================
    SELL YOUR BOOK HANDLER
    Manages the form submission behavior for the Appraisal portal.
   ========================================================================== */

document.addEventListener("DOMContentLoaded", () => {
    const appraisalForm = document.getElementById("book-appraisal-form");

    if (appraisalForm) {
        appraisalForm.addEventListener("submit", (event) => {
            // Prevent the default browser behavior of refreshing the page
            event.preventDefault();

            // Show success toast (Function is imported from user-interface-utilities.js)
            showToastNotification("Appraisal request submitted! We will email your quote within 24-48 hours.");

            // Clear the form fields back to empty
            appraisalForm.reset();
            
            // Scroll back up to the top of the form smoothly
            document.querySelector('.appraisal-form-card').scrollIntoView({ behavior: 'smooth', block: 'center' });
        });
    }
});