/* ==========================================================================
    PAYMENT METHODS HANDLER
    Manages rendering, adding, editing, and deleting user payment methods.
   ========================================================================== */

let currentPaymentType = "Visa";
let editingPaymentIndex = null;

document.addEventListener("DOMContentLoaded", () => {
    if (localStorage.getItem("isLoggedIn") !== "true") {
        window.location.href = "login.html";
        return;
    }

    renderPaymentMethods();
    setupInputValidation();

    const paymentForm = document.getElementById("payment-form");
    if (paymentForm) {
        paymentForm.addEventListener("submit", (event) => {
            event.preventDefault();
            savePaymentMethod();
        });
    }
});

function getUserData() {
    const email = localStorage.getItem("unlimitedPage_CurrentUser");
    const userDatabase = JSON.parse(localStorage.getItem("unlimitedPage_Users")) || {};
    return { email, userDatabase, user: userDatabase[email] };
}

function openPaymentModal() {
    editingPaymentIndex = null;
    const headerTitle = document.querySelector("#payment-modal-overlay .modal-header h2");
    if (headerTitle) headerTitle.textContent = "Add Payment Method";

    const form = document.getElementById("payment-form");
    if (form) form.reset();

    const selectorGroup = document.querySelector(".paymentMethodItem-type-selector");
    if (selectorGroup) selectorGroup.classList.remove("disabled");

    selectPaymentType("Visa");
    document.getElementById("payment-modal-overlay").style.display = "flex";
}

function closePaymentModal() {
    document.getElementById("payment-modal-overlay").style.display = "none";
    editingPaymentIndex = null;
}

function selectPaymentType(type) {
    currentPaymentType = type;

    const options = document.querySelectorAll(".paymentMethodItem-type-option");
    options.forEach(optionElement => {
        if (optionElement.dataset.type === type) {
            optionElement.classList.add("selected");
        } else {
            optionElement.classList.remove("selected");
        }
    });

    const cardFields = document.getElementById("card-fields");
    const ewalletFields = document.getElementById("ewallet-fields");

    if (type === "Visa" || type === "Mastercard") {
        cardFields.style.display = "block";
        ewalletFields.style.display = "none";
        document.getElementById("paymentMethodItem-mobile").removeAttribute("required");
        document.getElementById("paymentMethodItem-card-number").setAttribute("required", "true");
        document.getElementById("paymentMethodItem-expiration").setAttribute("required", "true");
        document.getElementById("paymentMethodItem-cvv").setAttribute("required", "true");
    } else {
        cardFields.style.display = "none";
        ewalletFields.style.display = "block";
        document.getElementById("paymentMethodItem-card-number").removeAttribute("required");
        document.getElementById("paymentMethodItem-expiration").removeAttribute("required");
        document.getElementById("paymentMethodItem-cvv").removeAttribute("required");
        document.getElementById("paymentMethodItem-mobile").setAttribute("required", "true");
    }
}

function setupInputValidation() {
    const numericInputs = document.querySelectorAll(".numeric-only");
    numericInputs.forEach(input => {
        input.addEventListener("input", function () {
            this.value = this.value.replace(/\D/g, "");
        });
    });

    const cardInput = document.getElementById("paymentMethodItem-card-number");
    if (cardInput) {
        cardInput.addEventListener("input", function () {
            let inputValue = this.value.replace(/\D/g, "");
            let formatted = inputValue.match(/.{1,4}/g);
            this.value = formatted ? formatted.join(" ") : inputValue;
        });
    }

    const expInput = document.getElementById("paymentMethodItem-expiration");
    if (expInput) {
        expInput.addEventListener("input", function (event) {
            let inputValue = this.value.replace(/\D/g, "");

            if (inputValue.length > 0) {
                let month = inputValue.substring(0, 2);
                if (parseInt(month) > 12) month = "12";
                if (month === "00") month = "01";

                if (month.length === 2 && inputValue.length > 2) {
                    let year = inputValue.substring(2, 4);
                    inputValue = month + "/" + year;
                } else {
                    inputValue = month;
                }
            }

            if (inputValue.length === 2 && event.inputType !== "deleteContentBackward") {
                inputValue = inputValue + "/";
            }
            this.value = inputValue;
        });
    }
}

function editPaymentMethod(index) {
    const { user } = getUserData();
    const paymentMethodItem = user.paymentMethods[index];

    editingPaymentIndex = index;

    const headerTitle = document.querySelector("#payment-modal-overlay .modal-header h2");
    if (headerTitle) headerTitle.textContent = "Edit Payment Method";

    const selectorGroup = document.querySelector(".paymentMethodItem-type-selector");
    if (selectorGroup) selectorGroup.classList.add("disabled");

    selectPaymentType(paymentMethodItem.type);

    if (paymentMethodItem.type === "Visa" || paymentMethodItem.type === "Mastercard") {
        let formattedCard = (paymentMethodItem.rawCardNumber || "").match(/.{1,4}/g);
        document.getElementById("paymentMethodItem-card-number").value = formattedCard ? formattedCard.join(" ") : "";
        document.getElementById("paymentMethodItem-expiration").value = paymentMethodItem.rawExpiration || "";
        document.getElementById("paymentMethodItem-cvv").value = paymentMethodItem.rawCvv || "";
    } else {
        document.getElementById("paymentMethodItem-mobile").value = paymentMethodItem.rawMobile || "";
    }

    document.getElementById("payment-modal-overlay").style.display = "flex";
}

function savePaymentMethod() {
    const { email, userDatabase, user } = getUserData();
    if (!user.paymentMethods) user.paymentMethods = [];

    document.getElementById("paymentMethodItem-card-error").style.display = "none";
    document.getElementById("paymentMethodItem-expiration-error").style.display = "none";
    document.getElementById("paymentMethodItem-cvv-error").style.display = "none";
    document.getElementById("paymentMethodItem-mobile-error").style.display = "none";

    let hasError = false;
    let newPaymentMethod = { type: currentPaymentType, logo: `images/payment-method/${currentPaymentType.toLowerCase()}-logo.jpg` };

    if (currentPaymentType === "Visa" || currentPaymentType === "Mastercard") {
        const cardNumber = document.getElementById("paymentMethodItem-card-number").value.replace(/\s/g, "");
        const expirationDate = document.getElementById("paymentMethodItem-expiration").value;
        const cvv = document.getElementById("paymentMethodItem-cvv").value;

        if (cardNumber.length !== 16) {
            document.getElementById("paymentMethodItem-card-error").textContent = "Please enter a valid card number.";
            document.getElementById("paymentMethodItem-card-error").style.display = "block";
            hasError = true;
        }
        if (expirationDate.length < 5) {
            document.getElementById("paymentMethodItem-expiration-error").textContent = "Please enter a complete expiration date.";
            document.getElementById("paymentMethodItem-expiration-error").style.display = "block";
            hasError = true;
        }
        if (cvv.length < 3) {
            document.getElementById("paymentMethodItem-cvv-error").textContent = "CVV must be at least 3 digits.";
            document.getElementById("paymentMethodItem-cvv-error").style.display = "block";
            hasError = true;
        }
        if (hasError) return;

        newPaymentMethod.displayNumber = "**** **** **** " + cardNumber.slice(-4);
        newPaymentMethod.detail = `Expires ${expirationDate}`;
        newPaymentMethod.tag = "CREDIT CARD";
        newPaymentMethod.rawCardNumber = cardNumber;
        newPaymentMethod.rawExpiration = expirationDate;
        newPaymentMethod.rawCvv = cvv;

    } else {
        const mobile = document.getElementById("paymentMethodItem-mobile").value;

        if (mobile.length < 10) {
            document.getElementById("paymentMethodItem-mobile-error").textContent = "Please enter a valid mobile number.";
            document.getElementById("paymentMethodItem-mobile-error").style.display = "block";
            return;
        }

        newPaymentMethod.displayNumber = "**** *** " + mobile.slice(-4);
        newPaymentMethod.detail = "Linked Number";
        newPaymentMethod.tag = "E-WALLET";
        newPaymentMethod.rawMobile = mobile;
    }

    if (editingPaymentIndex !== null) {
        user.paymentMethods[editingPaymentIndex] = newPaymentMethod;
    } else {
        user.paymentMethods.push(newPaymentMethod);
    }

    userDatabase[email] = user;
    localStorage.setItem("unlimitedPage_Users", JSON.stringify(userDatabase));
    closePaymentModal();

    if (typeof renderPaymentMethods === 'function') {
        renderPaymentMethods();
    }
}

function renderPaymentMethods() {
    const container = document.getElementById("payment-methods-container");
    if (!container) return;

    const { user } = getUserData();
    const methods = user.paymentMethods || [];

    if (methods.length === 0) {
        container.innerHTML = `<div class="no-addresses-message">No saved payment method.</div>`;
        container.style.display = "block";
        return;
    }

    container.style.display = "grid";
    container.innerHTML = methods.map((paymentMethodItem, index) => `
        <article class="payment-card">
            <button class="payment-card-button edit" onclick="editPaymentMethod(${index})">Edit</button>
            <button class="payment-card-button delete" onclick="deletePaymentMethod(${index})">Delete</button>
            <div class="payment-card-header">
                <img src="${paymentMethodItem.logo}" alt="${paymentMethodItem.type}" class="payment-card-logo">
                <span class="payment-card-type">${paymentMethodItem.tag}</span>
            </div>
            <div class="payment-card-number">${paymentMethodItem.displayNumber}</div>
            <div class="payment-card-detail">${paymentMethodItem.detail}</div>
        </article>
    `).join('');
}

function deletePaymentMethod(index) {
    const { email, userDatabase, user } = getUserData();

    if (user.paymentMethods && user.paymentMethods[index]) {
        user.paymentMethods.splice(index, 1);
        userDatabase[email] = user;
        localStorage.setItem("unlimitedPage_Users", JSON.stringify(userDatabase));
        renderPaymentMethods();
        showToastNotification("Payment method removed");
    }
}