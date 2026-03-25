/* ==========================================================================
    AUTHENTICATION HANDLER
    Mocks a backend database using localStorage for Registration, Login, and Profiles.
   ========================================================================== */

document.addEventListener("DOMContentLoaded", () => {
    // --- DATABASE MOCK ---
    let usersDatabase = JSON.parse(localStorage.getItem("unlimitedPage_Users")) || {};
    let currentUserEmail = localStorage.getItem("unlimitedPage_CurrentUser");
    const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";

    // --- ROUTE PROTECTION (Security Guard) ---
    // Prevent logged-out users from seeing the account page, and logged-in users from seeing the login page
    const currentFileName = window.location.pathname.split("/").pop();
    if (currentFileName === "account.html" && !isLoggedIn) {
        window.location.href = "login.html";
        return; // Stop executing the rest of the script
    }
    if (currentFileName === "login.html" && isLoggedIn) {
        window.location.href = "account.html";
        return;
    }

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
    if (loginFormElement) {
        loginFormElement.addEventListener("submit", (event) => {
            event.preventDefault();
            // Force lowercase to ensure case-insensitive matching in the database
            const emailValue = loginFormElement.querySelector('input[type="email"]').value.trim().toLowerCase();
            const passwordValue = loginPasswordInput.value;

            // Check if user exists
            if (usersDatabase[emailValue]) {
                if (usersDatabase[emailValue].password === passwordValue) {
                    processAuthenticationSuccess(emailValue, "Logging in...");
                } else {
                    showToastNotification("Incorrect password. Please try again.");
                }
            } else {
                // User doesn't exist, register them automatically
                const namePrefixString = emailValue.split('@')[0].substring(0, 16); 
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
                processAuthenticationSuccess(emailValue, "Account created successfully! Logging in...");
            }
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
                
                showToastNotification("Profile saved successfully!");
            }
        });
    }

    // 5. Handle Image Upload
    if (imageUploadInputElement && imagePreviewElement) {
        imageUploadInputElement.addEventListener("change", function() {
            const uploadedFile = this.files[0];
            if (uploadedFile) {
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
            showToastNotification("Successfully logged out.");
            
            setTimeout(() => {
                window.location.href = "login.html";
            }, 1000);
        });
    }

    // --- Helper Functions ---
    function processAuthenticationSuccess(emailString, messageString) {
        localStorage.setItem("isLoggedIn", "true");
        localStorage.setItem("unlimitedPage_CurrentUser", emailString); 
        showToastNotification(messageString); 
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