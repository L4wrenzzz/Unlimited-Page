/* ==========================================================================
    PAGE INITIALIZERS & EVENT LISTENERS
    Acts as the entry point for the application, ensuring functions only run 
    after the HTML Document Object Model (DOM) is fully loaded.
   ========================================================================== */

/**
 * Initializes the automated Hero Banner Carousel with a progress bar.
 */
function initCarousel() {
    const carouselTrack = document.getElementById("carousel-track");
    const progressBar = document.getElementById("carousel-progress-bar");
    
    // Only run if the carousel exists on the page
    if (!carouselTrack || !progressBar) return;

    const slideImages = document.querySelectorAll(".carousel-slide-image");
    const totalNumberOfSlides = slideImages.length;
    let currentSlideIndex = 0;
    const durationPerSlideMs = 5000; // 5 seconds

    /**
     * Moves the carousel track to the specified slide index
     * @param {number} targetIndex - The index of the slide to display
     */
    function shiftToSlide(targetIndex) {
        // Use modulo to loop back to the start or end seamlessly
        currentSlideIndex = (targetIndex + totalNumberOfSlides) % totalNumberOfSlides;
        carouselTrack.style.transform = `translateX(-${currentSlideIndex * 100}%)`;
        restartProgressBar();
    }

    // Attach click events to the manual control buttons
    document.getElementById("carousel-next-button").addEventListener("click", () => shiftToSlide(currentSlideIndex + 1));
    document.getElementById("carousel-prev-button").addEventListener("click", () => shiftToSlide(currentSlideIndex - 1));

    let autoSlideIntervalId;

    /**
     * Resets the CSS animation on the progress bar and restarts the interval timer
     */
    function restartProgressBar() {
        clearInterval(autoSlideIntervalId);
        
        // Reset bar visually to 0
        progressBar.style.width = "0%";
        progressBar.style.transition = "none";
        
        // Force the browser to recalculate layout (reflow) so the reset happens instantly
        void progressBar.offsetWidth;
        
        // Start the CSS animation to fill the bar
        progressBar.style.transition = `width ${durationPerSlideMs}ms linear`;
        progressBar.style.width = "100%";

        // Set the timer to trigger the next slide when the bar is full
        autoSlideIntervalId = setInterval(() => {
            shiftToSlide(currentSlideIndex + 1);
        }, durationPerSlideMs);
    }

    // Initialize the very first progress bar cycle
    restartProgressBar();
}

/**
 * Initializes the homepage specific sections (New Arrivals, Best Sellers, Stationery).
 * Slices the top 5 items for each respective grid.
 */
function initHomepage() {
    // Prevent script from running if we aren't on the homepage
    if (!document.getElementById("new-arrivals-grid")) return;

    // Filter books, sort them by release date (Newest first), and grab the first 5
    const newArrivalsArray = productDatabase
        .filter((databaseItem) => databaseItem.type === "Book")
        .sort(
            (itemA, itemB) =>
                new Date(itemB.releaseDate) - new Date(itemA.releaseDate),
        )
        .slice(0, 5);
    renderProductCards("new-arrivals-grid", newArrivalsArray);

    // Sort the entire database by total units sold and grab the top 5
    const bestSellersArray = [...productDatabase]
        .filter((databaseItem) => databaseItem.type === "Book")
        .sort((itemA, itemB) => itemB.totalSold - itemA.totalSold)
        .slice(0, 5);
    renderProductCards("best-sellers-grid", bestSellersArray);

    // Filter for stationery items and grab the first 5
    const stationeryListArray = productDatabase
        .filter((databaseItem) => databaseItem.type === "Stationery")
        .slice(0, 5);
    renderProductCards("stationery-grid", stationeryListArray);
}

/**
 * Event Listener waiting for the HTML document to fully parse before executing scripts.
 * This is a fundamental best practice to avoid trying to manipulate elements that don't exist yet.
 */
document.addEventListener("DOMContentLoaded", () => {
    updateCartBadge(); // Initialize cart icon number
    setupGlobalSearch(); // Attach listener to the search bar
    initCarousel(); // Setup hero banner sliding logic
    initHomepage(); // Populate homepage grids if they exist
    initCatalog(); // Setup catalog filtering and pagination if on catalog page
    initCart(); // Render cart items if on cart page
    setupMobileCheckoutObserver(); // Handle sticky mobile checkout bar behavior
});