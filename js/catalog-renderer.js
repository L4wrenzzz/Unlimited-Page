/* ==========================================================================
    CATALOG & PRODUCT RENDERING
    Handles the display, filtering, sorting, and pagination of products.
   ========================================================================== */

/**
 * Dynamically generates HTML for product cards and injects them into a container.
 * @param {string} containerId - The ID of the HTML element where products will be rendered.
 * @param {Array} productsArray - The array of product objects to display.
 */
function renderProductCards(containerId, productsArray) {
    const containerElement = document.getElementById(containerId);
    if (!containerElement) return; // Exit if the container doesn't exist on the current page

    // Clear previous contents to prevent duplicates
    containerElement.innerHTML = "";

    // Display a fallback message if no products match the current filters
    if (productsArray.length === 0) {
        containerElement.innerHTML = `<p style="grid-column: 1/-1; text-align: center; padding: 40px; color: var(--text-muted-color);">No products found matching your criteria.</p>`;
        return;
    }

    // Loop through each product and build its HTML card
    productsArray.forEach((productItem) => {
        const cardHTML = `
            <article class="product-card-container">
                <div class="product-image-wrapper">
                    <img src="${productItem.imageFile}" alt="${productItem.title}" class="product-image" onerror="this.src='https://placehold.co/300x420?text=Image+Missing'">
                </div>
                <div class="product-details-wrapper">
                    <span class="product-category-label">${productItem.type.toUpperCase()} • ${productItem.category.toUpperCase()}</span>
                    <h3 class="product-title">${productItem.title}</h3>
                    <p class="product-author-brand">by ${productItem.authorOrBrand}</p>
                    <div class="product-stats-container">
                        <span class="stat-sold">Sold: ${productItem.totalSold.toLocaleString()}</span> 
                        <span class="stat-stock">Stock: ${productItem.stock}</span>
                    </div>
                    <p class="product-short-description">${productItem.description}</p>
                    <div class="product-price-and-action">
                        <span class="product-price">${formatCurrency(productItem.price)}</span>
                        <button class="add-to-cart-button" onclick="addProductToCart('${productItem.id}')">
                            <span class="material-icons-outlined" style="font-size: 14px;">add_shopping_cart</span> Add to Cart
                        </button>
                    </div>
                </div>
            </article>
        `;
        containerElement.innerHTML += cardHTML;
    });
}

// Global variables to keep track of catalog state
let currentCatalogDataArray = [];
let currentCatalogPage = 1;
const maxItemsPerPage = 12;

/**
 * Initializes the catalog page by reading URL parameters, setting up filters,
 * and preparing the initial list of products to display.
 */
function initCatalog() {
    // Only run this script if the catalog grid actually exists on the page
    if (!document.getElementById("dynamic-catalog-grid")) return;

    // Retrieve search or category parameters from the URL
    const pageUrlParameters = new URLSearchParams(window.location.search);
    const searchParameterString = pageUrlParameters.get("search");
    const categoryParameterString =
        pageUrlParameters.get("category") || "Books";

    const filterLinksElements = document.querySelectorAll(
        ".filter-options-list li",
    );
    const applyPriceButton = document.getElementById("apply-price-filter");
    const resetPriceButton = document.getElementById("reset-price-filter");
    const minPriceInput = document.getElementById("min-price-filter");
    const maxPriceInput = document.getElementById("max-price-filter");

    // Handle Global Search
    if (searchParameterString) {
        // Normalize the search query by making it lowercase and removing special characters
        const cleanSearchQuery = searchParameterString
            .toLowerCase()
            .replace(/[^a-z0-9]/g, "");

        // Filter the main database to find matching titles, authors, or categories
        currentCatalogDataArray = productDatabase.filter((databaseItem) => {
            const cleanTitle = databaseItem.title
                .toLowerCase()
                .replace(/[^a-z0-9]/g, "");
            const cleanAuthor = databaseItem.authorOrBrand
                .toLowerCase()
                .replace(/[^a-z0-9]/g, "");
            const cleanCategory = databaseItem.category
                .toLowerCase()
                .replace(/[^a-z0-9]/g, "");

            return (
                cleanTitle.includes(cleanSearchQuery) ||
                cleanAuthor.includes(cleanSearchQuery) ||
                cleanCategory.includes(cleanSearchQuery)
            );
        });

        // Sort search results by popularity by default
        currentCatalogDataArray.sort(
            (itemA, itemB) => itemB.totalSold - itemA.totalSold,
        );

        // Update the page title to reflect the search
        document.getElementById("catalog-section-title").textContent =
            `Search Results for "${searchParameterString}"`;

        // Remove active highlights from sidebar categories since we are in search mode
        filterLinksElements.forEach((filterLink) =>
            filterLink.classList.remove("active-filter"),
        );
    } else {
        // Standard category navigation
        applyCategoryFilter(categoryParameterString);

        // Highlight the currently active category in the sidebar
        filterLinksElements.forEach((filterLink) => {
            filterLink.classList.remove("active-filter");
            if (
                filterLink.getAttribute("data-filter") ===
                categoryParameterString
            ) {
                filterLink.classList.add("active-filter");
            }
        });
    }

    // Render the first page of the catalog
    renderCatalogPage();

    // Attach click listeners to sidebar category links
    filterLinksElements.forEach((filterLink) => {
        filterLink.addEventListener("click", (event) => {
            // Visually update the active link
            filterLinksElements.forEach((link) =>
                link.classList.remove("active-filter"),
            );
            event.target.classList.add("active-filter");

            // Clean up the URL to remove old search parameters for a cleaner look
            window.history.replaceState(null, "", "catalog.html");

            // Apply the new category filter and reset other settings
            applyCategoryFilter(event.target.getAttribute("data-filter"));
            document.getElementById("catalog-sort-select").value =
                "Most Popular";
            minPriceInput.value = "";
            maxPriceInput.value = "";
            renderCatalogPage();
        });
    });

    // Handle sorting dropdown changes
    const sortSelectElement = document.getElementById("catalog-sort-select");
    if (sortSelectElement) {
        sortSelectElement.addEventListener("change", (event) => {
            const selectedSortOption = event.target.value;
            if (selectedSortOption === "Price: Low to High")
                currentCatalogDataArray.sort(
                    (itemA, itemB) => itemA.price - itemB.price,
                );
            else if (selectedSortOption === "Price: High to Low")
                currentCatalogDataArray.sort(
                    (itemA, itemB) => itemB.price - itemA.price,
                );
            else if (selectedSortOption === "Newest")
                currentCatalogDataArray.sort(
                    (itemA, itemB) =>
                        new Date(itemB.releaseDate) -
                        new Date(itemA.releaseDate),
                );
            // Default: Most Popular
            else
                currentCatalogDataArray.sort(
                    (itemA, itemB) => itemB.totalSold - itemA.totalSold,
                );

            renderCatalogPage();
        });
    }

    // Handle price range filter applications
    if (applyPriceButton && resetPriceButton) {
        applyPriceButton.addEventListener("click", () => {
            // Fallback to 0 or Infinity if the user leaves an input blank
            const minPriceLimit =
                minPriceInput.value === ""
                    ? 0
                    : parseFloat(minPriceInput.value);
            const maxPriceLimit =
                maxPriceInput.value === ""
                    ? Infinity
                    : parseFloat(maxPriceInput.value);

            // Re-apply the current category first to ensure we aren't filtering a previously filtered list
            const activeCategoryElement = document.querySelector(
                ".filter-options-list li.active-filter",
            );
            applyCategoryFilter(
                activeCategoryElement
                    ? activeCategoryElement.getAttribute("data-filter")
                    : "Books",
            );

            // Filter by the price limits
            currentCatalogDataArray = currentCatalogDataArray.filter(
                (databaseItem) =>
                    databaseItem.price >= minPriceLimit &&
                    databaseItem.price <= maxPriceLimit,
            );
            renderCatalogPage();
        });

        // Reset price inputs and revert to the raw category list
        resetPriceButton.addEventListener("click", () => {
            minPriceInput.value = "";
            maxPriceInput.value = "";
            const activeCategoryElement = document.querySelector(
                ".filter-options-list li.active-filter",
            );
            applyCategoryFilter(
                activeCategoryElement
                    ? activeCategoryElement.getAttribute("data-filter")
                    : "Books",
            );
            renderCatalogPage();
        });
    }
}

/**
 * Updates the current catalog array based on the chosen category string.
 * @param {string} selectedCategoryString - The category to filter by (e.g., "Books", "Stationery").
 */
function applyCategoryFilter(selectedCategoryString) {
    if (selectedCategoryString === "Books") {
        currentCatalogDataArray = productDatabase.filter(
            (databaseItem) =>
                databaseItem.type === "Book" || databaseItem.type === "E-Book",
        );
        document.getElementById("catalog-section-title").textContent = "Books";
    } else if (selectedCategoryString === "Stationery") {
        currentCatalogDataArray = productDatabase.filter(
            (databaseItem) => databaseItem.type === "Stationery",
        );
        document.getElementById("catalog-section-title").textContent =
            "Stationery";
    } else if (selectedCategoryString === "Best") {
        currentCatalogDataArray = [...productDatabase]; // Copy the whole database
        document.getElementById("catalog-section-title").textContent =
            "Best Sellers";
    }

    // Sort by most sold by default when a new category is selected
    currentCatalogDataArray.sort(
        (itemA, itemB) => itemB.totalSold - itemA.totalSold,
    );
}

/**
 * Resets the page counter to 1 and triggers a UI update.
 */
function renderCatalogPage() {
    currentCatalogPage = 1;
    updateCatalogDOM();
}

/**
 * Calculates which items to show on the current page and updates the DOM grid and pagination.
 */
function updateCatalogDOM() {
    // Calculate start and end indexes based on current page
    const startItemIndex = (currentCatalogPage - 1) * maxItemsPerPage;
    const endItemIndex = startItemIndex + maxItemsPerPage;

    // Extract only the items meant for the current page
    const paginatedDataArray = currentCatalogDataArray.slice(
        startItemIndex,
        endItemIndex,
    );

    renderProductCards("dynamic-catalog-grid", paginatedDataArray);
    renderPaginationControls(currentCatalogDataArray.length);
}

/**
 * Generates and displays the pagination buttons (Prev, 1, 2, 3, Next).
 * @param {number} totalItemCount - Total number of items in the current filtered list.
 */
function renderPaginationControls(totalItemCount) {
    const paginationContainerElement = document.getElementById(
        "pagination-container",
    );
    if (!paginationContainerElement) return;

    // Clear old pagination
    paginationContainerElement.innerHTML = "";

    const totalPagesNeeded = Math.ceil(totalItemCount / maxItemsPerPage);
    if (totalPagesNeeded <= 1) return; // Don't show pagination if everything fits on one page

    // Create 'Previous' button
    const previousPageButton = document.createElement("button");
    previousPageButton.className = "page-button";
    previousPageButton.innerHTML =
        '<span class="material-icons-outlined">chevron_left</span>';
    previousPageButton.disabled = currentCatalogPage === 1; // Disable if on first page
    previousPageButton.onclick = () => {
        if (currentCatalogPage > 1) {
            currentCatalogPage--;
            updateCatalogDOM();
            window.scrollTo(0, 0); // Scroll back to top after page change
        }
    };
    paginationContainerElement.appendChild(previousPageButton);

    // Create numerical page buttons
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

    // Create 'Next' button
    const nextPageButton = document.createElement("button");
    nextPageButton.className = "page-button";
    nextPageButton.innerHTML =
        '<span class="material-icons-outlined">chevron_right</span>';
    nextPageButton.disabled = currentCatalogPage === totalPagesNeeded; // Disable if on last page
    nextPageButton.onclick = () => {
        if (currentCatalogPage < totalPagesNeeded) {
            currentCatalogPage++;
            updateCatalogDOM();
            window.scrollTo(0, 0);
        }
    };
    paginationContainerElement.appendChild(nextPageButton);
}
