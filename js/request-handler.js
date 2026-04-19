/* ==========================================================================
    REQUEST A BOOK HANDLER
    Manages the form submission behavior for the Request a Book page.
   ========================================================================== */

document.addEventListener("DOMContentLoaded", () => {
    const requestForm = document.getElementById("book-request-form");
    if (requestForm) {
        requestForm.addEventListener("submit", (event) => {
            event.preventDefault();
            const requestedTitle = document.getElementById("book-title").value;
            const successMessageElement = document.getElementById("request-success-msg");

            successMessageElement.textContent = `Successfully requested: "${requestedTitle}". We will notify you once available.`;
            successMessageElement.style.display = "block";

            requestForm.reset();
            setTimeout(() => { successMessageElement.style.display = "none"; }, 30000);
        });
    }
}); 