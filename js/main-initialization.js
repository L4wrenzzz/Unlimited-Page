/* ==========================================================================
    PAGE INITIALIZERS & EVENT LISTENERS
    Acts as the entry point for the application, ensuring functions only run 
    after the HTML Document Object Model (DOM) is fully loaded.
   ========================================================================== */

/**
 * Initializes the homepage specific sections (New Arrivals, Top Stationery, Best Sellers).
 * Slices the top 5 items for each respective grid.
 */
function initHomepage() {
    // Prevent script from running if we aren't on the homepage
    if (!document.getElementById("books-grid")) return;

    // Filter books, sort them by release date (Newest first), and grab the first 5
    const bookListArray = productDatabase
        .filter((databaseItem) => databaseItem.type === "Book")
        .sort(
            (itemA, itemB) =>
                new Date(itemB.releaseDate) - new Date(itemA.releaseDate),
        )
        .slice(0, 5);
    renderProductCards("books-grid", bookListArray);

    // Filter for stationery items and grab the first 5
    const stationeryListArray = productDatabase
        .filter((databaseItem) => databaseItem.type === "Stationery")
        .slice(0, 5);
    renderProductCards("stationery-grid", stationeryListArray);

    // Sort the entire database by total units sold and grab the top 5
    const bestSellersArray = [...productDatabase]
        .sort((itemA, itemB) => itemB.totalSold - itemA.totalSold)
        .slice(0, 5);
    renderProductCards("best-sellers-grid", bestSellersArray);
}

/**
 * Event Listener waiting for the HTML document to fully parse before executing scripts.
 * This is a fundamental best practice to avoid trying to manipulate elements that don't exist yet.
 */
document.addEventListener("DOMContentLoaded", () => {
    updateCartBadge(); // Initialize cart icon number
    setupGlobalSearch(); // Attach listener to the search bar
    initHomepage(); // Populate homepage grids if they exist
    initCatalog(); // Setup catalog filtering and pagination if on catalog page
    initCart(); // Render cart items if on cart page
    setupMobileCheckoutObserver(); // Handle sticky mobile checkout bar behavior
});