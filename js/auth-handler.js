/* ==========================================================================
    AUTHENTICATION HANDLER
    Mocks a backend database using localStorage for Registration, Login, and Profiles.
   ========================================================================== */

document.addEventListener("DOMContentLoaded", () => {
    // --- DATABASE MOCK ---
    let usersDatabase = JSON.parse(localStorage.getItem("unlimitedPage_Users")) || {};
    let currentUserEmail = localStorage.getItem("unlimitedPage_CurrentUser");

    // --- LOGIN PAGE ELEMENTS ---
    const loginFormElement = document.getElementById("login-form");
    const loginPasswordInput = document.getElementById("login-password-input");
    const loginPasswordToggle = document.getElementById("password-toggle-icon");

    // --- ACCOUNT PAGE ELEMENTS ---
    const logoutButtonElement = document.getElementById("logout-button");
    const saveProfileButtonElement = document.getElementById("save-profile-button");
    const imageUploadInputElement = document.getElementById("profile-image-upload");
    const imagePreviewElement = document.getElementById("profile-image-preview");

    const accountNameInput = document.getElementById("account-name");
    const accountPasswordInput = document.getElementById("account-password");
    const accountEmailInput = document.getElementById("account-email");
    const accountPhoneNumberInput = document.getElementById("account-phone-number");
    const accountDateOfBirthInput = document.getElementById("account-date-of-birth");
    const accountGenderMaleRadio = document.getElementById("account-gender-male");
    const accountGenderFemaleRadio = document.getElementById("account-gender-female");
    const accountPasswordToggleIcon = document.getElementById("account-password-toggle-icon");

    // 1. Password Visibility Toggles
    function setupPasswordToggle(inputElement, iconElement) {
        if (iconElement && inputElement) {
            iconElement.addEventListener("click", () => {
                if (inputElement.type === "password") {
                    inputElement.type = "text";
                    iconElement.textContent = "visibility_off";
                } else {
                    inputElement.type = "password";
                    iconElement.textContent = "visibility";
                }
            });
        }
    }
    setupPasswordToggle(loginPasswordInput, loginPasswordToggle);
    setupPasswordToggle(accountPasswordInput, accountPasswordToggleIcon);

    // 2. Login & Registration Logic
    const loginView = document.getElementById("login-view");
    const signupView = document.getElementById("signup-view");
    const showSignupLink = document.getElementById("show-signup-link");
    const showLoginLink = document.getElementById("show-login-link");

    if (showSignupLink && showLoginLink) {
        showSignupLink.addEventListener("click", (event) => {
            event.preventDefault();
            loginView.style.display = "none";
            signupView.style.display = "block";
        });

        showLoginLink.addEventListener("click", (event) => {
            event.preventDefault();
            signupView.style.display = "none";
            loginView.style.display = "block";
        });
    }

    const signupPasswordInput = document.getElementById("signup-password-input");
    const signupPasswordToggle = document.getElementById("signup-password-toggle-icon");
    setupPasswordToggle(signupPasswordInput, signupPasswordToggle);

    if (loginFormElement) {
        loginFormElement.addEventListener("submit", (event) => {
            event.preventDefault();
            const emailInput = document.getElementById("login-email-input");
            const emailValue = emailInput ? emailInput.value.trim().toLowerCase() : "";
            const passwordValue = loginPasswordInput.value;

            const emailError = document.getElementById("login-email-error");
            const passwordError = document.getElementById("login-password-error");

            if (emailError) emailError.style.display = "none";
            if (passwordError) passwordError.style.display = "none";

            if (usersDatabase[emailValue]) {
                if (usersDatabase[emailValue].password === passwordValue) {
                    processAuthenticationSuccess(emailValue, "");
                } else {
                    if (passwordError) {
                        passwordError.textContent = "Incorrect password. Please try again.";
                        passwordError.style.display = "block";
                    }
                }
            } else {
                if (emailError) {
                    emailError.textContent = "Account not found. Please Sign Up first.";
                    emailError.style.display = "block";
                }
            }
        });
    }

    const signupFormElement = document.getElementById("signup-form");
    if (signupFormElement) {
        signupFormElement.addEventListener("submit", (event) => {
            event.preventDefault();
            const emailInput = document.getElementById("signup-email-input");
            const emailValue = emailInput ? emailInput.value.trim().toLowerCase() : "";
            const passwordValue = signupPasswordInput.value;

            const signupEmailError = document.getElementById("signup-email-error");
            if (signupEmailError) signupEmailError.style.display = "none";

            if (usersDatabase[emailValue]) {
                if (signupEmailError) {
                    signupEmailError.innerHTML = `Email is already registered.</a>`;
                    signupEmailError.style.display = "block";
                }
            } else {
                let namePrefixString = emailValue.split('@')[0].replace(/[^a-zA-Z\s]/g, '').substring(0, 16);
                if (!namePrefixString) namePrefixString = "User";

                usersDatabase[emailValue] = {
                    email: emailValue,
                    password: passwordValue,
                    name: namePrefixString,
                    phone: "",
                    dob: "",
                    gender: "",
                    avatar: "images/userProfile.png"
                };
                localStorage.setItem("unlimitedPage_Users", JSON.stringify(usersDatabase));
                processAuthenticationSuccess(emailValue, "");
            }
        });
    }

    const nameErrorText = document.getElementById("name-error-text");
    if (accountNameInput) {
        accountNameInput.addEventListener("input", function () {
            this.value = this.value.replace(/[^a-zA-Z\s]/g, '');
            if (this.value.length < 16) {
                if (nameErrorText) nameErrorText.style.display = "none";
            } else if (this.value.length >= 16) {
                if (nameErrorText) nameErrorText.style.display = "block";
            }
        });

        accountNameInput.addEventListener("keydown", function (event) {
            if (this.value.length >= 16 && event.key.length === 1) {
                if (nameErrorText) nameErrorText.style.display = "block";
            }
        });

        accountNameInput.addEventListener("blur", function () {
            if (nameErrorText) nameErrorText.style.display = "none";
        });
    }

    if (accountDateOfBirthInput) {
        accountDateOfBirthInput.addEventListener("input", function (event) {
            let inputValue = this.value.replace(/\D/g, "");

            if (inputValue.length > 0) {
                let month = inputValue.substring(0, 2);
                if (parseInt(month) > 12) month = "12";
                if (month === "00") month = "01";

                if (month.length === 2 && inputValue.length > 2) {
                    let day = inputValue.substring(2, 4);
                    if (parseInt(day) > 31) day = "31";
                    if (day === "00") day = "01";

                    if (day.length === 2 && inputValue.length > 4) {
                        let year = inputValue.substring(4, 8);
                        inputValue = month + "/" + day + "/" + year;
                    } else {
                        inputValue = month + "/" + day;
                    }
                } else {
                    inputValue = month;
                }
            }

            if ((inputValue.length === 2 || inputValue.length === 5) && event.inputType !== "deleteContentBackward") {
                inputValue = inputValue + "/"; // Fixed
            }
            this.value = inputValue; // Fixed
        });

        accountDateOfBirthInput.addEventListener("blur", function () {
            let parts = this.value.split("/");
            if (parts.length === 3) {
                let year = parseInt(parts[2]);
                if (year > 2026) {
                    parts[2] = "2026";
                    this.value = parts.join("/");
                }
            }
        });
    }

    // 3. Load Data on Account Page Load
    if (accountNameInput) {
        loadUserProfileData();
    }

    // 4. Save Profile Data
    if (saveProfileButtonElement) {
        saveProfileButtonElement.addEventListener("click", (event) => {
            event.preventDefault();
            const emailErrorSpan = document.getElementById("account-email-error");
            if (emailErrorSpan) emailErrorSpan.style.display = "none"; // Hide error initially

            if (currentUserEmail && usersDatabase[currentUserEmail]) {
                const newEmailValue = accountEmailInput.value.trim().toLowerCase();
                const newPasswordValue = accountPasswordInput.value;

                if (newEmailValue !== currentUserEmail) {
                    if (usersDatabase[newEmailValue]) {
                        // Show inline error instead of toast!
                        if (emailErrorSpan) emailErrorSpan.style.display = "block";
                        return; // Stops saving if email is taken
                    }
                    usersDatabase[newEmailValue] = { ...usersDatabase[currentUserEmail] };
                    delete usersDatabase[currentUserEmail];

                    currentUserEmail = newEmailValue;
                    localStorage.setItem("unlimitedPage_CurrentUser", newEmailValue);

                    let userShoppingCartData = JSON.parse(localStorage.getItem(`unlimitedPageCart_${currentUserEmail}`)) || [];
                    localStorage.setItem(`unlimitedPageCart_${newEmailValue}`, JSON.stringify(userShoppingCartData));
                }

                usersDatabase[currentUserEmail].name = accountNameInput.value.substring(0, 16);
                usersDatabase[currentUserEmail].password = newPasswordValue;
                usersDatabase[currentUserEmail].email = newEmailValue;
                usersDatabase[currentUserEmail].phone = accountPhoneNumberInput.value;
                usersDatabase[currentUserEmail].dob = accountDateOfBirthInput.value;

                if (accountGenderMaleRadio.checked) usersDatabase[currentUserEmail].gender = "male";
                else if (accountGenderFemaleRadio.checked) usersDatabase[currentUserEmail].gender = "female";

                localStorage.setItem("unlimitedPage_Users", JSON.stringify(usersDatabase));

                showToastNotification("Changes saved successfully");
                if (typeof updateHeaderAccount === "function") updateHeaderAccount();
            }
        });
    }

    // 5. Handle Image Upload & Validation
    if (imageUploadInputElement && imagePreviewElement) {
        const imageError = document.getElementById("profile-image-error");

        imageUploadInputElement.addEventListener("change", function () {
            if (imageError) imageError.style.display = "none";
            const uploadedFile = this.files[0];

            if (uploadedFile) {
                if (uploadedFile.size > 1048576) {
                    if (imageError) {
                        imageError.textContent = "Image must be 1MB or less.";
                        imageError.style.display = "block";
                    }
                    this.value = "";
                    return;
                }
                if (uploadedFile.type !== "image/jpeg" && uploadedFile.type !== "image/png") {
                    if (imageError) {
                        imageError.textContent = "Only JPG and PNG formats are supported.";
                        imageError.style.display = "block";
                    }
                    this.value = "";
                    return;
                }

                const fileReader = new FileReader();
                fileReader.onload = function (eventResult) {
                    const base64ImageString = eventResult.target.result;
                    imagePreviewElement.src = base64ImageString;

                    if (currentUserEmail && usersDatabase[currentUserEmail]) {
                        usersDatabase[currentUserEmail].avatar = base64ImageString;
                        try {
                            localStorage.setItem("unlimitedPage_Users", JSON.stringify(usersDatabase));
                        } catch (error) {
                            if (imageError) {
                                imageError.textContent = "Error: Image file is too large to save to local browser.";
                                imageError.style.display = "block";
                            }
                        }
                    }
                };
                fileReader.readAsDataURL(uploadedFile);
            }
        });
    }

    // 6. Handle Logout
    if (logoutButtonElement) {
        logoutButtonElement.addEventListener("click", (event) => {
            event.preventDefault();
            localStorage.removeItem("isLoggedIn");
            localStorage.removeItem("unlimitedPage_CurrentUser");

            setTimeout(() => {
                window.location.href = "login.html";
            }, 500);
        });
    }

    // --- Helper Functions ---
    function processAuthenticationSuccess(emailString, messageString) {
        localStorage.setItem("isLoggedIn", "true");
        localStorage.setItem("unlimitedPage_CurrentUser", emailString);
        if (messageString) showToastNotification(messageString);
        setTimeout(() => { window.location.href = "account.html"; }, 500);
    }

    function loadUserProfileData() {
        if (currentUserEmail && usersDatabase[currentUserEmail]) {
            const userProfileData = usersDatabase[currentUserEmail];
            accountNameInput.value = userProfileData.name || "";
            accountEmailInput.value = userProfileData.email || "";
            accountPasswordInput.value = userProfileData.password || "";
            accountPhoneNumberInput.value = userProfileData.phone || "";
            accountDateOfBirthInput.value = userProfileData.dob || "";

            if (userProfileData.gender === "male") accountGenderMaleRadio.checked = true;
            else if (userProfileData.gender === "female") accountGenderFemaleRadio.checked = true;

            if (userProfileData.avatar) imagePreviewElement.src = userProfileData.avatar;
        }
    }
});