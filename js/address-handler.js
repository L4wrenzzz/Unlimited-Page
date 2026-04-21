/* ==========================================================================
    ADDRESS HANDLER
    Manages the CRUD operations for user addresses and modal interactions.
   ========================================================================== */

let editingAddressIndex = null;

document.addEventListener("DOMContentLoaded", () => {
    if (localStorage.getItem("isLoggedIn") !== "true") {
        window.location.href = "login.html";
        return;
    }

    renderAddresses();

    const addressForm = document.getElementById("address-form");
    if (addressForm) {
        addressForm.addEventListener("submit", (event) => {
            event.preventDefault(); 
            saveAddress();
        });
    }
});

function openAddressModal() {
    editingAddressIndex = null;
    const headerTitle = document.querySelector("#address-modal-overlay .modal-header h2");
    if(headerTitle) headerTitle.textContent = "Add New Address";
    
    const form = document.getElementById("address-form");
    if(form) form.reset();
    
    const defaultCheckbox = document.getElementById("addressItem-is-default");
    if(defaultCheckbox) defaultCheckbox.disabled = false;
    
    document.getElementById("address-modal-overlay").style.display = "flex";
}

function closeAddressModal() {
    document.getElementById("address-modal-overlay").style.display = "none";
    const form = document.getElementById("address-form");
    if(form) form.reset();
    editingAddressIndex = null;
}

function getUserData() {
    const email = localStorage.getItem("unlimitedPage_CurrentUser");
    const db = JSON.parse(localStorage.getItem("unlimitedPage_Users")) || {};
    return { email, db, user: db[email] };
}

function renderAddresses() {
    const container = document.getElementById("addresses-container");
    if (!container) return;

    const { user } = getUserData();
    const addresses = user.addresses || [];

    if (addresses.length === 0) {
        container.innerHTML = `<div class="no-addresses-message">No saved address yet.</div>`;
        return;
    }

    container.innerHTML = addresses.map((addressItem, index) => `
        <article class="address-card ${addressItem.isDefault ? 'default-address' : ''}">
            <div class="address-card-header">
                <div class="address-title-group">
                    <span class="address-label">${addressItem.label}</span>
                    <span class="address-separator">|</span>
                    <span class="address-phone-inline">${addressItem.phone}</span>
                </div>
                ${addressItem.isDefault
            ? '<span class="default-badge">DEFAULT</span>'
            : `<button class="set-default-button" onclick="setDefaultAddress(${index})">Set as Default</button>`}
            </div>
            
            <div class="address-body-actions-wrapper">
                <div class="address-details">
                    ${addressItem.street}<br>
                    ${addressItem.city}, ${addressItem.state}, ${addressItem.zip}
                </div>
                <div class="address-actions">
                    ${!addressItem.isDefault ? `<button class="button-delete" onclick="deleteAddress(${index})">Delete</button>` : ''}
                    <button class="button-edit" onclick="editAddress(${index})">Edit</button>
                </div>
            </div>
        </article>
    `).join('');
}

function setDefaultAddress(index) {
    const { email, db, user } = getUserData();

    user.addresses.forEach(addressItem => addressItem.isDefault = false);
    user.addresses[index].isDefault = true;
    user.addresses.sort((a, b) => b.isDefault - a.isDefault);

    db[email] = user;
    localStorage.setItem("unlimitedPage_Users", JSON.stringify(db));

    renderAddresses();
    if (typeof showToastNotification === 'function') {
        showToastNotification("Default address updated");
    }
}

function editAddress(index) {
    const { user } = getUserData();
    const addressItem = user.addresses[index];

    editingAddressIndex = index;

    const headerTitle = document.querySelector("#address-modal-overlay .modal-header h2");
    if(headerTitle) headerTitle.textContent = "Edit Address";

    document.getElementById("addressItem-label").value = addressItem.label || "";
    document.getElementById("addressItem-phone").value = addressItem.phone || "";
    document.getElementById("addressItem-street").value = addressItem.street || "";
    document.getElementById("addressItem-city").value = addressItem.city || "";
    document.getElementById("addressItem-state").value = addressItem.state || "";
    document.getElementById("addressItem-zip").value = addressItem.zip || "";

    const defaultCheckbox = document.getElementById("addressItem-is-default");
    defaultCheckbox.checked = addressItem.isDefault;
    defaultCheckbox.disabled = addressItem.isDefault;

    document.getElementById("address-modal-overlay").style.display = "flex";
}

function saveAddress() {
    const { email, db, user } = getUserData();
    if (!user.addresses) user.addresses = [];

    const label = document.getElementById("addressItem-label").value;
    const phone = document.getElementById("addressItem-phone").value;
    const street = document.getElementById("addressItem-street").value;
    const city = document.getElementById("addressItem-city").value;
    const state = document.getElementById("addressItem-state").value;
    const zip = document.getElementById("addressItem-zip").value;
    let isDefault = document.getElementById("addressItem-is-default").checked;

    if (user.addresses.length === 0 || (editingAddressIndex !== null && user.addresses[editingAddressIndex].isDefault)) {
        isDefault = true;
    }

    if (isDefault) {
        user.addresses.forEach(addressItem => addressItem.isDefault = false);
    }

    const addressObj = { label, phone, street, city, state, zip, isDefault };

    if (editingAddressIndex !== null) {
        user.addresses[editingAddressIndex] = addressObj;
        if (typeof showToastNotification === 'function') showToastNotification("Address updated successfully");
    } else {
        user.addresses.push(addressObj);
        if (typeof showToastNotification === 'function') showToastNotification("Address saved successfully");
    }

    user.addresses.sort((a, b) => b.isDefault - a.isDefault);
    db[email] = user;
    localStorage.setItem("unlimitedPage_Users", JSON.stringify(db));

    closeAddressModal();
    
    if(typeof renderAddresses === 'function') {
        renderAddresses();
    }
}

function deleteAddress(index) {
    const { email, db, user } = getUserData();

    if (user.addresses[index].isDefault) return;

    user.addresses.splice(index, 1);

    db[email] = user;
    localStorage.setItem("unlimitedPage_Users", JSON.stringify(db));
    renderAddresses();

    if (typeof showToastNotification === 'function') {
        showToastNotification("Address deleted");
    }
}