/* ==========================================================================
    SELL YOUR BOOK HANDLER
    Manages the form submission behavior for the Appraisal portal and handles 
    interactive file uploading previews.
   ========================================================================== */

document.addEventListener("DOMContentLoaded", () => {
    // --- 1. HANDLE IMAGE UPLOADS, PREVIEWS & VALIDATION ---
    const uploadContainersList = document.querySelectorAll('.upload-container');

    uploadContainersList.forEach(containerElement => {
        const fileInputElement = containerElement.querySelector('.hidden-file-input');
        const uploadBoxElement = containerElement.querySelector('.upload-box');
        const errorMessageElement = containerElement.querySelector('.upload-error-msg');

        const previewContainerElement = containerElement.querySelector('.upload-preview-container');
        const previewImageElement = containerElement.querySelector('.upload-preview-thumb');
        const previewNameElement = containerElement.querySelector('.upload-preview-name');
        const previewSizeElement = containerElement.querySelector('.upload-preview-size');
        const deleteButtonElement = containerElement.querySelector('.upload-preview-delete');

        fileInputElement.addEventListener('change', function () {
            const uploadedFile = this.files[0];
            if (errorMessageElement) errorMessageElement.style.display = 'none';

            if (uploadedFile) {
                // Validate size (10MB)
                if (uploadedFile.size > 10 * 1024 * 1024) {
                    if (errorMessageElement) {
                        errorMessageElement.textContent = "Image must be 10MB or less.";
                        errorMessageElement.style.display = "block";
                    }
                    this.value = '';
                    return;
                }
                // Validate format
                if (uploadedFile.type !== "image/jpeg" && uploadedFile.type !== "image/png") {
                    if (errorMessageElement) {
                        errorMessageElement.textContent = "Only JPG and PNG formats are supported.";
                        errorMessageElement.style.display = "block";
                    }
                    this.value = '';
                    return;
                }

                previewNameElement.textContent = uploadedFile.name;
                const sizeInMB = (uploadedFile.size / (1024 * 1024)).toFixed(1);
                previewSizeElement.textContent = sizeInMB + 'MB';

                const imageReader = new FileReader();
                imageReader.onload = function (eventResult) {
                    previewImageElement.src = eventResult.target.result;
                };
                imageReader.readAsDataURL(uploadedFile);

                uploadBoxElement.style.display = 'none';
                previewContainerElement.style.display = 'flex';
            }
        });

        deleteButtonElement.addEventListener('click', function () {
            fileInputElement.value = '';
            uploadBoxElement.style.display = 'block';
            previewContainerElement.style.display = 'none';
            previewImageElement.src = '';
            if (errorMessageElement) errorMessageElement.style.display = 'none';
        });
    });

    // --- 2. HANDLE FORM SUBMISSION & INLINE VALIDATION ---
    const appraisalForm = document.getElementById("book-appraisal-form");

    if (appraisalForm) {
        appraisalForm.addEventListener("submit", (event) => {
            event.preventDefault();
            let hasError = false;

            // Validate Condition Dropdown
            const conditionSelect = document.getElementById("sell-book-condition");
            const conditionError = document.getElementById("condition-error");
            if (conditionError) conditionError.style.display = "none";

            if (!conditionSelect.value) {
                if (conditionError) conditionError.style.display = "block";
                hasError = true;
            }

            // Validate File Uploads
            const fileInputs = document.querySelectorAll('.hidden-file-input');
            fileInputs.forEach(input => {
                const container = input.closest('.upload-container');
                const errorMessageElement = container.querySelector('.upload-error-msg');
                if (errorMessageElement) errorMessageElement.style.display = 'none';

                if (!input.value) {
                    if (errorMessageElement) {
                        errorMessageElement.style.display = "block";
                    }
                    hasError = true;
                }
            });

            if (hasError) return; // Stop submission if there are errors

            const successMessageElement = document.getElementById("sell-success-msg");
            if (successMessageElement) {
                successMessageElement.textContent = "Appraisal request submitted successfully!";
                successMessageElement.style.display = "block";
            }

            appraisalForm.reset();
            const deleteButtons = document.querySelectorAll('.upload-preview-delete');
            deleteButtons.forEach(button => button.click());

            document.querySelector('.appraisal-form-card').scrollIntoView({ behavior: 'smooth', block: 'center' });

            setTimeout(() => { if (successMessageElement) successMessageElement.style.display = "none"; }, 30000);
        });
    }
});