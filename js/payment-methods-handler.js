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
        paymentForm.addEventListener("submit", (e) => {
            e.preventDefault();
            savePaymentMethod();
        });
    }
});

function getUserData() {
    const email = localStorage.getItem("unlimitedPage_CurrentUser");
    const db = JSON.parse(localStorage.getItem("unlimitedPage_Users")) || {};
    return { email, db, user: db[email] };
}

function openPaymentModal() {
    editingPaymentIndex = null;
    document.querySelector(".modal-header h2").textContent = "Add Payment Method";
    document.getElementById("payment-form").reset();
    
    // Enable changing payment type
    document.querySelector(".pm-type-selector").classList.remove("disabled");
    
    selectPaymentType("Visa"); 
    document.getElementById("payment-modal-overlay").style.display = "flex";
}

function closePaymentModal() {
    document.getElementById("payment-modal-overlay").style.display = "none";
    editingPaymentIndex = null;
}

function selectPaymentType(type) {
    currentPaymentType = type;
    
    // Update visual selection
    const options = document.querySelectorAll(".pm-type-option");
    options.forEach(opt => {
        if (opt.dataset.type === type) {
            opt.classList.add("selected");
        } else {
            opt.classList.remove("selected");
        }
    });

    // Toggle form fields
    const cardFields = document.getElementById("card-fields");
    const ewalletFields = document.getElementById("ewallet-fields");

    if (type === "Visa" || type === "Mastercard") {
        cardFields.style.display = "block";
        ewalletFields.style.display = "none";
        // Remove 'required' from e-wallet, add to cards
        document.getElementById("pm-mobile").removeAttribute("required");
        document.getElementById("pm-card-number").setAttribute("required", "true");
        document.getElementById("pm-exp").setAttribute("required", "true");
        document.getElementById("pm-cvv").setAttribute("required", "true");
    } else {
        cardFields.style.display = "none";
        ewalletFields.style.display = "block";
        // Remove 'required' from cards, add to e-wallet
        document.getElementById("pm-card-number").removeAttribute("required");
        document.getElementById("pm-exp").removeAttribute("required");
        document.getElementById("pm-cvv").removeAttribute("required");
        document.getElementById("pm-mobile").setAttribute("required", "true");
    }
}

function setupInputValidation() {
    // 1. Force strict numeric input on generic fields
    const numericInputs = document.querySelectorAll(".numeric-only");
    numericInputs.forEach(input => {
        input.addEventListener("input", function() {
            this.value = this.value.replace(/\D/g, ""); 
        });
    });

    // 2. Format Card Number with spaces
    const cardInput = document.getElementById("pm-card-number");
    if (cardInput) {
        cardInput.addEventListener("input", function() {
            let val = this.value.replace(/\D/g, "");
            let formatted = val.match(/.{1,4}/g);
            this.value = formatted ? formatted.join(" ") : val;
        });
    }

    // 3. Format Expiration Date MM/YY (Appends slash exactly after 2nd number)
    const expInput = document.getElementById("pm-exp");
    if (expInput) {
        expInput.addEventListener("input", function(e) {
            let val = this.value.replace(/\D/g, "");
            
            // Check if user is typing (not deleting)
            if (val.length > 2) {
                val = val.substring(0, 2) + "/" + val.substring(2, 4);
            } else if (val.length === 2 && e.inputType !== "deleteContentBackward") {
                val = val + "/";
            }
            
            this.value = val;
        });
    }
}

function editPaymentMethod(index) {
    const { user } = getUserData();
    const pm = user.paymentMethods[index];
    
    editingPaymentIndex = index;
    document.querySelector(".modal-header h2").textContent = "Edit Payment Method";
    
    // Disable changing payment type
    document.querySelector(".pm-type-selector").classList.add("disabled");

    selectPaymentType(pm.type);

    if (pm.type === "Visa" || pm.type === "Mastercard") {
        // Re-format the raw card number back with spaces
        let formattedCard = (pm.rawCardNumber || "").match(/.{1,4}/g);
        document.getElementById("pm-card-number").value = formattedCard ? formattedCard.join(" ") : "";
        document.getElementById("pm-exp").value = pm.rawExp || "";
        document.getElementById("pm-cvv").value = pm.rawCvv || "";
    } else {
        document.getElementById("pm-mobile").value = pm.rawMobile || "";
    }

    document.getElementById("payment-modal-overlay").style.display = "flex";
}

function savePaymentMethod() {
    const { email, db, user } = getUserData();
    if (!user.paymentMethods) user.paymentMethods = [];

    let newMethod = {
        type: currentPaymentType,
        logo: `images/payment-method/${currentPaymentType.toLowerCase()}-logo.jpg`
    };

    if (currentPaymentType === "Visa" || currentPaymentType === "Mastercard") {
        const cardNumber = document.getElementById("pm-card-number").value.replace(/\s/g, "");
        const expDate = document.getElementById("pm-exp").value;
        const cvv = document.getElementById("pm-cvv").value;

        if (cardNumber.length < 13 || expDate.length < 5 || cvv.length < 3) {
            showToastNotification("Please complete all credit card fields.");
            return;
        }

        // Mask all but last 4 digits for display
        newMethod.displayNumber = "**** **** **** " + cardNumber.slice(-4);
        newMethod.detail = `Expires ${expDate}`;
        newMethod.tag = "CREDIT CARD";
        
        // Save raw info to allow editing later
        newMethod.rawCardNumber = cardNumber;
        newMethod.rawExp = expDate;
        newMethod.rawCvv = cvv;

    } else {
        const mobile = document.getElementById("pm-mobile").value;

        if (mobile.length < 10) {
            showToastNotification("Please enter a valid mobile number.");
            return;
        }

        // Mask all but last 4 digits
        newMethod.displayNumber = "**** *** " + mobile.slice(-4);
        newMethod.detail = "Linked Number";
        newMethod.tag = "E-WALLET";
        
        // Save raw info to allow editing later
        newMethod.rawMobile = mobile;
    }

    // Overwrite if editing, otherwise append
    if (editingPaymentIndex !== null) {
        user.paymentMethods[editingPaymentIndex] = newMethod;
        showToastNotification("Payment method updated.");
    } else {
        user.paymentMethods.push(newMethod);
        showToastNotification("Payment method saved successfully.");
    }

    db[email] = user;
    localStorage.setItem("unlimitedPage_Users", JSON.stringify(db));

    closePaymentModal();
    renderPaymentMethods();
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
    container.innerHTML = methods.map((pm, index) => `
        <article class="payment-card">
            <button class="payment-card-btn edit" onclick="editPaymentMethod(${index})">EDIT</button>
            <button class="payment-card-btn delete" onclick="deletePaymentMethod(${index})">DELETE</button>
            <div class="payment-card-header">
                <img src="${pm.logo}" alt="${pm.type}" class="payment-card-logo">
                <span class="payment-card-type">${pm.tag}</span>
            </div>
            <div class="payment-card-number">${pm.displayNumber}</div>
            <div class="payment-card-detail">${pm.detail}</div>
        </article>
    `).join('');
}

function deletePaymentMethod(index) {
    const { email, db, user } = getUserData();
    
    if (user.paymentMethods && user.paymentMethods[index]) {
        user.paymentMethods.splice(index, 1);
        db[email] = user;
        localStorage.setItem("unlimitedPage_Users", JSON.stringify(db));
        renderPaymentMethods();
        showToastNotification("Payment method removed.");
    }
}