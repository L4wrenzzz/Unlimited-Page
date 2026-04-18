/* ==========================================================================
    SELL YOUR BOOK HANDLER
    Manages the form submission behavior for the Appraisal portal and handles 
    interactive file uploading previews.
   ========================================================================== */

document.addEventListener("DOMContentLoaded", () => {

    // --- 1. HANDLE IMAGE UPLOADS & PREVIEWS ---
    const uploadContainersList = document.querySelectorAll('.upload-container');

    uploadContainersList.forEach(containerElement => {
        const fileInputElement = containerElement.querySelector('.hidden-file-input');
        const uploadBoxElement = containerElement.querySelector('.upload-box');

        const previewContainerElement = containerElement.querySelector('.upload-preview-container');
        const previewImageElement = containerElement.querySelector('.upload-preview-thumb');
        const previewNameElement = containerElement.querySelector('.upload-preview-name');
        const previewSizeElement = containerElement.querySelector('.upload-preview-size');
        const deleteButtonElement = containerElement.querySelector('.upload-preview-delete');

        // Listen for when a user selects a file
        fileInputElement.addEventListener('change', function () {
            const uploadedFile = this.files[0];

            if (uploadedFile) {
                // Update text details
                previewNameElement.textContent = uploadedFile.name;

                // Calculate and format the size (bytes -> MB)
                const sizeInMB = (uploadedFile.size / (1024 * 1024)).toFixed(1);
                previewSizeElement.textContent = sizeInMB + 'MB';

                // Use FileReader to display the image thumbnail
                const imageReader = new FileReader();
                imageReader.onload = function (eventResult) {
                    previewImageElement.src = eventResult.target.result;
                };
                imageReader.readAsDataURL(uploadedFile);

                // Switch visibility
                uploadBoxElement.style.display = 'none';
                previewContainerElement.style.display = 'flex';
            }
        });

        // Listen for the delete button click
        deleteButtonElement.addEventListener('click', function () {
            // Clear the input value so the form doesn't submit the deleted file
            fileInputElement.value = '';

            // Switch visibility back to the upload box
            uploadBoxElement.style.display = 'block';
            previewContainerElement.style.display = 'none';

            // Clear the source to save memory
            previewImageElement.src = '';
        });
    });

    // --- 2. HANDLE FORM SUBMISSION ---
    const appraisalForm = document.getElementById("book-appraisal-form");

    if (appraisalForm) {
        appraisalForm.addEventListener("submit", (event) => {
            // Prevent the default browser behavior of refreshing the page
            event.preventDefault();

            // Show success toast (Function is imported from user-interface-utilities.js)
            showToastNotification("Appraisal request submitted!");

            // Clear the form fields back to empty
            appraisalForm.reset();

            // Because the form is resetting, we also need to manually trigger the "Delete"
            // logic to hide the previews and show the upload boxes again
            const deleteButtons = document.querySelectorAll('.upload-preview-delete');
            deleteButtons.forEach(button => button.click());

            // Scroll back up to the top of the form smoothly
            document.querySelector('.appraisal-form-card').scrollIntoView({ behavior: 'smooth', block: 'center' });
        });
    }
});