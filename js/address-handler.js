/* ==========================================================================
    ADDRESS HANDLER
    Manages the CRUD operations for user addresses and modal interactions.
   ========================================================================== */

let editingAddressIndex = null;

document.addEventListener("DOMContentLoaded", () => {
    // Make sure we are logged in, otherwise redirect to login
    if (localStorage.getItem("isLoggedIn") !== "true") {
        window.location.href = "login.html";
        return;
    }

    renderAddresses();

    // Handle form submission
    const addressForm = document.getElementById("address-form");
    if (addressForm) {
        addressForm.addEventListener("submit", (e) => {
            e.preventDefault();
            saveAddress();
        });
    }
});

function openAddressModal() {
    editingAddressIndex = null;
    document.querySelector(".modal-header h2").textContent = "Add New Address";
    document.getElementById("address-form").reset();
    document.getElementById("addr-is-default").disabled = false;
    document.getElementById("address-modal-overlay").style.display = "flex";
}

function closeAddressModal() {
    document.getElementById("address-modal-overlay").style.display = "none";
    document.getElementById("address-form").reset();
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

    // Notice the updated HTML structure combining the Name and Phone
    container.innerHTML = addresses.map((addr, index) => `
        <article class="address-card ${addr.isDefault ? 'default-address' : ''}">
            <div class="address-card-header">
                <div class="address-title-group">
                    <span class="address-label">${addr.label}</span>
                    <span class="address-separator">|</span>
                    <span class="address-phone-inline">${addr.phone}</span>
                </div>
                ${addr.isDefault
            ? '<span class="default-badge">DEFAULT</span>'
            : `<button class="set-default-button" onclick="setDefaultAddress(${index})">Set as Default</button>`}
            </div>
            
            <div class="address-body-actions-wrapper">
                <div class="address-details">
                    ${addr.street}<br>
                    ${addr.city}, ${addr.state}, ${addr.zip}
                </div>
                <div class="address-actions">
                    ${!addr.isDefault ? `<button class="button-delete" onclick="deleteAddress(${index})">DELETE</button>` : ''}
                    <button class="button-edit" onclick="editAddress(${index})">EDIT</button>
                </div>
            </div>
        </article>
    `).join('');
}

function setDefaultAddress(index) {
    const { email, db, user } = getUserData();

    // 1. Turn off default for all addresses
    user.addresses.forEach(addr => addr.isDefault = false);

    // 2. Turn on default ONLY for the clicked index
    user.addresses[index].isDefault = true;

    // 3. Re-sort the array so the new default jumps to the top
    user.addresses.sort((a, b) => b.isDefault - a.isDefault);

    // 4. Save to database
    db[email] = user;
    localStorage.setItem("unlimitedPage_Users", JSON.stringify(db));

    // 5. Re-render the page to show changes
    renderAddresses();

    if (typeof showToastNotification === 'function') {
        showToastNotification("Default address updated.");
    }
}

function editAddress(index) {
    const { user } = getUserData();
    const addr = user.addresses[index];

    editingAddressIndex = index;

    // Update Modal Title
    document.querySelector(".modal-header h2").textContent = "Edit Address";

    // Populate Fields
    document.getElementById("addr-label").value = addr.label || "";
    document.getElementById("addr-phone").value = addr.phone || "";
    document.getElementById("addr-street").value = addr.street || "";
    document.getElementById("addr-city").value = addr.city || "";
    document.getElementById("addr-state").value = addr.state || "";
    document.getElementById("addr-zip").value = addr.zip || "";

    // Handle Default Checkbox
    const defaultCheckbox = document.getElementById("addr-is-default");
    defaultCheckbox.checked = addr.isDefault;

    // Prevent user from unchecking the default box if it's already the default address
    // (They must make another address default to remove this one's status)
    defaultCheckbox.disabled = addr.isDefault;

    document.getElementById("address-modal-overlay").style.display = "flex";
}

function saveAddress() {
    const { email, db, user } = getUserData();
    if (!user.addresses) user.addresses = [];

    // 1. Get values from form
    const label = document.getElementById("addr-label").value;
    const phone = document.getElementById("addr-phone").value;
    const street = document.getElementById("addr-street").value;
    const city = document.getElementById("addr-city").value;
    const state = document.getElementById("addr-state").value;
    const zip = document.getElementById("addr-zip").value;
    let isDefault = document.getElementById("addr-is-default").checked;

    // 2. Logic: If there are no saved addresses, force it to be default. 
    // Also force it if they are editing the existing default address.
    if (user.addresses.length === 0 || (editingAddressIndex !== null && user.addresses[editingAddressIndex].isDefault)) {
        isDefault = true;
    }

    // 3. Logic: If marked as default, turn off default for all others
    if (isDefault) {
        user.addresses.forEach(addr => addr.isDefault = false);
    }

    // 4. Save Data
    const addressObj = { label, phone, street, city, state, zip, isDefault };

    if (editingAddressIndex !== null) {
        user.addresses[editingAddressIndex] = addressObj;
        if (typeof showToastNotification === 'function') showToastNotification("Address updated successfully.");
    } else {
        user.addresses.push(addressObj);
        if (typeof showToastNotification === 'function') showToastNotification("Address saved successfully.");
    }

    // 5. Always sort the array so the default address appears first, then save to DB
    user.addresses.sort((a, b) => b.isDefault - a.isDefault);
    db[email] = user;
    localStorage.setItem("unlimitedPage_Users", JSON.stringify(db));

    closeAddressModal();
    renderAddresses();
}

function deleteAddress(index) {
    const { email, db, user } = getUserData();

    // Double-check to prevent deleting default (backup security)
    if (user.addresses[index].isDefault) return;

    user.addresses.splice(index, 1);

    db[email] = user;
    localStorage.setItem("unlimitedPage_Users", JSON.stringify(db));
    renderAddresses();

    if (typeof showToastNotification === 'function') {
        showToastNotification("Address deleted.");
    }
}