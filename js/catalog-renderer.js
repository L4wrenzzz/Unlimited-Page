/* ==========================================================================
    CATALOG & PRODUCT RENDERING
    Handles the display, filtering, sorting, and pagination of products.
   ========================================================================== */

function renderProductCards(containerId, productsArray) {
    const containerElement = document.getElementById(containerId);
    if (!containerElement) return;

    containerElement.innerHTML = "";

    if (productsArray.length === 0) {
        containerElement.innerHTML = `<p style="grid-column: 1/-1; text-align: center; padding: 40px; color: var(--text-muted-color);">No products found matching your criteria.</p>`;
        return;
    }

    productsArray.forEach((productItem) => {
        // We added <a> tags around the image and title to link to the details page
        const cardHTML = `
            <article class="product-card-container">
                <div class="product-image-wrapper">
                    <a href="product-details.html?id=${productItem.id}" style="display: flex; justify-content: center; align-items: center; height: 100%; width: 100%; text-decoration: none;">
                        <img src="${productItem.imageFile}" alt="${productItem.title}" class="product-image" onerror="this.src='https://placehold.co/300x420?text=Image+Missing'">
                    </a>
                </div>
                <div class="product-details-wrapper">
                    <h3 class="product-title">
                        <a href="product-details.html?id=${productItem.id}" style="color: inherit; text-decoration: none;">${productItem.title}</a>
                    </h3>
                    <p class="product-author-brand">by ${productItem.authorOrBrand}</p>
                    <div class="product-stats-container">
                        <span class="stat-sold">Sold: ${productItem.totalSold.toLocaleString()}</span> 
                        <span class="stat-stock">Stock: ${productItem.stock}</span>
                    </div>
                    
                    <div class="product-price-and-action" style="margin-top: auto;">
                        <span class="product-price">${formatCurrency(productItem.price)}</span>
                        <button class="add-to-cart-button" onclick="addProductToCart('${productItem.id}')">
                            <img src="images/shopping-cart-icon.png" alt="Cart" style="width: 14px; height: 14px; object-fit: contain;"> Add to Cart
                        </button>
                    </div>
                </div>
            </article>
        `;
        containerElement.innerHTML += cardHTML;
    });
}

// Global Variables for State Management
let currentCatalogDataArray = [];
let currentCatalogPage = 1;
const maxItemsPerPage = 12;

let activeMainCategory = "Books";
let activeSubCategory = "All";
let activeSearchQuery = "";

function initCatalog() {
    if (!document.getElementById("dynamic-catalog-grid")) return;

    const pageUrlParameters = new URLSearchParams(window.location.search);
    activeSearchQuery = pageUrlParameters.get("search") || "";
    activeMainCategory = pageUrlParameters.get("category") || "Books";

    const urlSort = pageUrlParameters.get("sort");
    if (urlSort) {
        const sortSelectElement = document.getElementById("catalog-sort-select");
        if (sortSelectElement) sortSelectElement.value = urlSort;
    }

    if (activeSearchQuery) {
        document.getElementById("catalog-section-title").textContent = `Search Results for "${activeSearchQuery}"`;
        activeMainCategory = "Search";
    }

    buildDynamicSidebar();
    setupEventListeners();
    applyFiltersAndRender();
}

function buildDynamicSidebar() {
    const sidebarList = document.getElementById("dynamic-category-list");
    if (!sidebarList) return;

    sidebarList.innerHTML = "";
    let categoriesToGenerate = [];

    if (activeMainCategory === "Books") {
        categoriesToGenerate = ["All Books", "Academic", "Fiction", "Non-Fiction", "Children"];
    } else if (activeMainCategory === "Stationery") {
        categoriesToGenerate = ["All Stationery", "Paper Supplies", "Writing Supplies", "Coloring Supplies", "Office Supplies"];
    } else {
        categoriesToGenerate = ["All Items"];
    }

    categoriesToGenerate.forEach(categoryString => {
        const listItem = document.createElement("li");
        listItem.textContent = categoryString;

        if (activeSubCategory === categoryString || (activeSubCategory === "All" && categoryString.startsWith("All "))) {
            listItem.classList.add("active-filter");
        }

        listItem.addEventListener("click", () => {
            activeSubCategory = categoryString.startsWith("All ") ? "All" : categoryString;
            buildDynamicSidebar();
            applyFiltersAndRender();
        });

        sidebarList.appendChild(listItem);
    });
}

function setupEventListeners() {
    const applyPriceButton = document.getElementById("apply-price-filter");
    const resetPriceButton = document.getElementById("reset-price-filter");
    const sortSelectElement = document.getElementById("catalog-sort-select");

    if (applyPriceButton) applyPriceButton.addEventListener("click", applyFiltersAndRender);

    if (resetPriceButton) {
        resetPriceButton.addEventListener("click", () => {
            document.getElementById("min-price-filter").value = "";
            document.getElementById("max-price-filter").value = "";
            applyFiltersAndRender();
        });
    }

    if (sortSelectElement) sortSelectElement.addEventListener("change", applyFiltersAndRender);
}

function applyFiltersAndRender() {
    let filteredDatabase = productDatabase;

    if (activeSearchQuery) {
        const cleanQuery = activeSearchQuery.toLowerCase().replace(/[^a-z0-9]/g, "");
        filteredDatabase = filteredDatabase.filter((item) => {
            return item.title.toLowerCase().replace(/[^a-z0-9]/g, "").includes(cleanQuery) ||
                item.authorOrBrand.toLowerCase().replace(/[^a-z0-9]/g, "").includes(cleanQuery) ||
                item.category.toLowerCase().replace(/[^a-z0-9]/g, "").includes(cleanQuery);
        });
    } else {
        if (activeMainCategory === "Books") {
            filteredDatabase = filteredDatabase.filter(item => item.type === "Book");
            document.getElementById("catalog-section-title").textContent = "Books";
        } else if (activeMainCategory === "Stationery") {
            filteredDatabase = filteredDatabase.filter(item => item.type === "Stationery");
            document.getElementById("catalog-section-title").textContent = "Stationery";
        } else if (activeMainCategory === "Best") {
            document.getElementById("catalog-section-title").textContent = "Best Sellers";
        }
    }

    if (activeSubCategory !== "All") {
        filteredDatabase = filteredDatabase.filter(item => item.category === activeSubCategory);
    }

    const minInput = document.getElementById("min-price-filter");
    const maxInput = document.getElementById("max-price-filter");
    const minPriceLimit = minInput ? parseFloat(minInput.value) : NaN;
    const maxPriceLimit = maxInput ? parseFloat(maxInput.value) : NaN;

    if (!isNaN(minPriceLimit)) filteredDatabase = filteredDatabase.filter(item => item.price >= minPriceLimit);
    if (!isNaN(maxPriceLimit)) filteredDatabase = filteredDatabase.filter(item => item.price <= maxPriceLimit);

    const sortOption = document.getElementById("catalog-sort-select")?.value || "Most Popular";

    if (sortOption === "Name: A to Z") {
        filteredDatabase.sort((itemA, itemB) => itemA.title.localeCompare(itemB.title));
    } else if (sortOption === "Name: Z to A") {
        filteredDatabase.sort((itemA, itemB) => itemB.title.localeCompare(itemA.title));
    } else if (sortOption === "Price: Low to High") {
        filteredDatabase.sort((itemA, itemB) => itemA.price - itemB.price);
    } else if (sortOption === "Price: High to Low") {
        filteredDatabase.sort((itemA, itemB) => itemB.price - itemA.price);
    } else if (sortOption === "Newest") {
        filteredDatabase.sort((itemA, itemB) => new Date(itemB.releaseDate) - new Date(itemA.releaseDate));
    } else {
        filteredDatabase.sort((itemA, itemB) => itemB.totalSold - itemA.totalSold);
    }

    currentCatalogDataArray = filteredDatabase;
    currentCatalogPage = 1;
    updateCatalogDOM();
}

function updateCatalogDOM() {
    const startItemIndex = (currentCatalogPage - 1) * maxItemsPerPage;
    const endItemIndex = startItemIndex + maxItemsPerPage;
    const paginatedDataArray = currentCatalogDataArray.slice(startItemIndex, endItemIndex);

    renderProductCards("dynamic-catalog-grid", paginatedDataArray);
    renderPaginationControls(currentCatalogDataArray.length);
}

function renderPaginationControls(totalItemCount) {
    const paginationContainerElement = document.getElementById("pagination-container");
    if (!paginationContainerElement) return;

    paginationContainerElement.innerHTML = "";
    const totalPagesNeeded = Math.ceil(totalItemCount / maxItemsPerPage);
    if (totalPagesNeeded <= 1) return;

    const previousPageButton = document.createElement("button");
    previousPageButton.className = "page-button";
    previousPageButton.innerHTML = '<span class="material-icons-outlined">chevron_left</span>';
    previousPageButton.disabled = currentCatalogPage === 1;
    previousPageButton.onclick = () => {
        if (currentCatalogPage > 1) {
            currentCatalogPage--;
            updateCatalogDOM();
            window.scrollTo(0, 0);
        }
    };
    paginationContainerElement.appendChild(previousPageButton);

    for (let pageIndex = 1; pageIndex <= totalPagesNeeded; pageIndex++) {
        const pageNumberButton = document.createElement("button");
        pageNumberButton.className = `page-button ${pageIndex === currentCatalogPage ? "active" : ""}`;
        pageNumberButton.innerText = pageIndex;
        pageNumberButton.onclick = () => {
            currentCatalogPage = pageIndex;
            updateCatalogDOM();
            window.scrollTo(0, 0);
        };
        paginationContainerElement.appendChild(pageNumberButton);
    }

    const nextPageButton = document.createElement("button");
    nextPageButton.className = "page-button";
    nextPageButton.innerHTML = '<span class="material-icons-outlined">chevron_right</span>';
    nextPageButton.disabled = currentCatalogPage === totalPagesNeeded;
    nextPageButton.onclick = () => {
        if (currentCatalogPage < totalPagesNeeded) {
            currentCatalogPage++;
            updateCatalogDOM();
            window.scrollTo(0, 0);
        }
    };
    paginationContainerElement.appendChild(nextPageButton);
}