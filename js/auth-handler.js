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
    // --- View Toggling Logic ---
    const loginView = document.getElementById("login-view");
    const signupView = document.getElementById("signup-view");
    const showSignupLink = document.getElementById("show-signup-link");
    const showLoginLink = document.getElementById("show-login-link");

    if (showSignupLink && showLoginLink) {
        showSignupLink.addEventListener("click", (e) => {
            e.preventDefault();
            loginView.style.display = "none";
            signupView.style.display = "block";
        });

        showLoginLink.addEventListener("click", (e) => {
            e.preventDefault();
            signupView.style.display = "none";
            loginView.style.display = "block";
        });
    }

    // --- Sign Up Password Eye Toggle ---
    const signupPasswordInput = document.getElementById("signup-password-input");
    const signupPasswordToggle = document.getElementById("signup-password-toggle-icon");
    setupPasswordToggle(signupPasswordInput, signupPasswordToggle);

    // 2. Login Logic (Strictly checks for existing users)
    if (loginFormElement) {
        loginFormElement.addEventListener("submit", (event) => {
            event.preventDefault();
            const emailValue = loginFormElement.querySelector('input[type="email"]').value.trim().toLowerCase();
            const passwordValue = loginPasswordInput.value;

            if (usersDatabase[emailValue]) {
                if (usersDatabase[emailValue].password === passwordValue) {
                    processAuthenticationSuccess(emailValue, "Logging in");
                } else {
                    showToastNotification("Incorrect password. Please try again.");
                }
            } else {
                showToastNotification("Account not found. Please Sign Up first.");
            }
        });
    }

    // 2.5 Registration Logic (Strictly creates new users)
    const signupFormElement = document.getElementById("signup-form");
    if (signupFormElement) {
        signupFormElement.addEventListener("submit", (event) => {
            event.preventDefault();
            const emailValue = signupFormElement.querySelector('input[type="email"]').value.trim().toLowerCase();
            const passwordValue = signupPasswordInput.value;

            if (usersDatabase[emailValue]) {
                showToastNotification("Email is already registered. Please Log In.");
            } else {
                // Remove any numbers or symbols from the generated name
                let namePrefixString = emailValue.split('@')[0].replace(/[^a-zA-Z\s]/g, '').substring(0, 16); 
                if(!namePrefixString) namePrefixString = "User"; // Fallback if email was purely numbers

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
                processAuthenticationSuccess(emailValue, ""); // Sent as empty string to hide toast
            }
        });
    }

    const nameErrorText = document.getElementById("name-error-text");
    if (accountNameInput) {
        
        // 1. Handle regular typing and pasting
        accountNameInput.addEventListener("input", function() {
            // Strip out numbers and symbols
            this.value = this.value.replace(/[^a-zA-Z\s]/g, '');

            // Hide the error text if they delete characters and drop below 16
            if (this.value.length < 16) {
                if (nameErrorText) nameErrorText.style.display = "none";
            } else if (this.value.length >= 16) {
                if (nameErrorText) nameErrorText.style.display = "block";
            }
        });

        // 2. Catch them trying to type when it's ALREADY at 16 characters
        accountNameInput.addEventListener("keydown", function(e) {
            // e.key.length === 1 ensures we only trigger on actual letters/numbers, 
            // and NOT control keys like 'Backspace', 'Tab', or 'ArrowLeft'
            if (this.value.length >= 16 && e.key.length === 1) {
                if (nameErrorText) nameErrorText.style.display = "block";
            }
        });

        // 3. Hide the error text when the user clicks away or clicks the Save button
        accountNameInput.addEventListener("blur", function() {
            if (nameErrorText) nameErrorText.style.display = "none";
        });
    }

    // 3. Load Data on Account Page Load
    if (accountNameInput) {
        loadUserProfileData();
    }

    // 4. Save Profile Data (With Email/Password changing logic)
    if (saveProfileButtonElement) {
        saveProfileButtonElement.addEventListener("click", (event) => {
            event.preventDefault();

            if (currentUserEmail && usersDatabase[currentUserEmail]) {
                const newEmailValue = accountEmailInput.value.trim().toLowerCase();
                const newPasswordValue = accountPasswordInput.value;

                // Check if the user is trying to change their email to an entirely new one
                if (newEmailValue !== currentUserEmail) {
                    // Prevent them from overwriting someone else's existing account
                    if (usersDatabase[newEmailValue]) {
                        showToastNotification("That email is already in use by another account.");
                        return; 
                    }

                    // Migrate data to the new email key
                    usersDatabase[newEmailValue] = { ...usersDatabase[currentUserEmail] };
                    
                    // Delete the old email record
                    delete usersDatabase[currentUserEmail];
                    
                    // Update the active session to the new email so they aren't logged out
                    currentUserEmail = newEmailValue;
                    localStorage.setItem("unlimitedPage_CurrentUser", newEmailValue);
                    
                    // Update the cart key to match the new email
                    let userShoppingCartData = JSON.parse(localStorage.getItem(`unlimitedPageCart_${currentUserEmail}`)) || [];
                    localStorage.setItem(`unlimitedPageCart_${newEmailValue}`, JSON.stringify(userShoppingCartData));
                }

                // Update the rest of the database fields
                usersDatabase[currentUserEmail].name = accountNameInput.value.substring(0, 16);
                usersDatabase[currentUserEmail].password = newPasswordValue;
                usersDatabase[currentUserEmail].email = newEmailValue; 
                usersDatabase[currentUserEmail].phone = accountPhoneNumberInput.value;
                usersDatabase[currentUserEmail].dob = accountDateOfBirthInput.value;
                
                if (accountGenderMaleRadio.checked) usersDatabase[currentUserEmail].gender = "male";
                else if (accountGenderFemaleRadio.checked) usersDatabase[currentUserEmail].gender = "female";

                localStorage.setItem("unlimitedPage_Users", JSON.stringify(usersDatabase));
                
                showToastNotification("Changes saved successfully!");

                if (typeof updateHeaderAccount === "function") updateHeaderAccount();
            }
        });
    }

    // 5. Handle Image Upload
    if (imageUploadInputElement && imagePreviewElement) {
        imageUploadInputElement.addEventListener("change", function() {
            const uploadedFile = this.files[0];
            if (uploadedFile) {
                // Validate size (1MB = 1048576 bytes)
                if (uploadedFile.size > 1048576) {
                    showToastNotification("Image must be 1MB or less.");
                    this.value = ""; // Clear file
                    return;
                }
                // Validate file format
                if (uploadedFile.type !== "image/jpeg" && uploadedFile.type !== "image/png") {
                    showToastNotification("Only JPG and PNG formats are supported.");
                    this.value = ""; // Clear file
                    return;
                }

                const fileReader = new FileReader();
                fileReader.onload = function(eventResult) {
                    const base64ImageString = eventResult.target.result;
                    imagePreviewElement.src = base64ImageString;
                    
                    if (currentUserEmail && usersDatabase[currentUserEmail]) {
                        usersDatabase[currentUserEmail].avatar = base64ImageString;
                        try {
                            localStorage.setItem("unlimitedPage_Users", JSON.stringify(usersDatabase));
                            showToastNotification("Profile photo updated!");
                        } catch (error) {
                            showToastNotification("Error: Image file is too large to save.");
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
            }, 1000);
        });
    }

    // --- Helper Functions ---
    function processAuthenticationSuccess(emailString, messageString) {
        localStorage.setItem("isLoggedIn", "true");
        localStorage.setItem("unlimitedPage_CurrentUser", emailString); 
        if(messageString) showToastNotification(messageString); 
        setTimeout(() => { window.location.href = "account.html"; }, 1000);
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