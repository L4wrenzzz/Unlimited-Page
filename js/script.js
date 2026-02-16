/* ==========================================================================
    1. PRODUCT DATABASE (60 Items)
   ========================================================================== */

const productDatabase = [
    // --- 10 MANGA ---
    { id: "manga1", type: "Book", category: "Manga", title: "Attack on Titan Vol 3", authorOrBrand: "Hajime Isayama", price: 500.00, stock: 40, totalSold: 7800, releaseDate: "2018-09-01", imageFile: "images/attack-on-titan-volume-3.jpg", description: "Humanity's fight against the Titans continues." },
    { id: "manga2", type: "Book", category: "Manga", title: "Bleach Vol 2", authorOrBrand: "Tite Kubo", price: 450.00, stock: 15, totalSold: 4300, releaseDate: "2016-02-14", imageFile: "images/bleach-volume-2.jpg", description: "Ichigo's Soul Reaper duties intensify." },
    { id: "manga3", type: "Book", category: "Manga", title: "Death Note Vol 1", authorOrBrand: "Tsugumi Ohba", price: 520.00, stock: 12, totalSold: 9200, releaseDate: "2010-10-10", imageFile: "images/death-note-volume-1.jpg", description: "Light finds a notebook of death." },
    { id: "manga4", type: "Book", category: "Manga", title: "Demon Slayer Vol 2", authorOrBrand: "Koyoharu Gotouge", price: 480.00, stock: 55, totalSold: 8500, releaseDate: "2020-11-20", imageFile: "images/demon-slayer-volume-2.jpg", description: "Tanjiro faces new demonic threats." },
    { id: "manga5", type: "Book", category: "Manga", title: "Fullmetal Alchemist Vol 5", authorOrBrand: "Hiromu Arakawa", price: 550.00, stock: 18, totalSold: 5800, releaseDate: "2012-04-18", imageFile: "images/fullmetal-alchemist-volume-5.jpg", description: "The Elric brothers uncover dark secrets." },
    { id: "manga6", type: "Book", category: "Manga", title: "Haikyuu Vol 4", authorOrBrand: "Haruichi Furudate", price: 450.00, stock: 42, totalSold: 7100, releaseDate: "2019-07-22", imageFile: "images/haikyu-volume-4.jpg", description: "Karasuno gears up for the tournament." },
    { id: "manga7", type: "Book", category: "Manga", title: "Jujutsu Kaisen Vol 6", authorOrBrand: "Gege Akutami", price: 480.00, stock: 60, totalSold: 8900, releaseDate: "2021-03-15", imageFile: "images/jujutsu-kaisen-volume-6.jpg", description: "The Kyoto Goodwill Event begins." },
    { id: "manga8", type: "Book", category: "Manga", title: "My Hero Academia Vol 1", authorOrBrand: "Kohei Horikoshi", price: 450.00, stock: 35, totalSold: 6700, releaseDate: "2017-06-05", imageFile: "images/my-hero-academia-volume-1.jpg", description: "Izuku Midoriya's origin story." },
    { id: "manga9", type: "Book", category: "Manga", title: "Naruto Vol 3", authorOrBrand: "Masashi Kishimoto", price: 450.00, stock: 25, totalSold: 5200, releaseDate: "2015-05-10", imageFile: "images/naruto-volume-3.jpg", description: "The Chunin Exams approach." },
    { id: "manga10", type: "Book", category: "Manga", title: "One Piece Vol 1", authorOrBrand: "Eiichiro Oda", price: 450.00, stock: 30, totalSold: 6100, releaseDate: "2014-08-20", imageFile: "images/one-piece-volume-1.jpg", description: "Romance Dawn. Set sail with Luffy." },

    // --- 15 NON-FICTION ---
    { id: "nonfiction1", type: "Book", category: "Self-Improvement", title: "Atomic Habits", authorOrBrand: "James Clear", price: 850.00, stock: 80, totalSold: 12000, releaseDate: "2018-10-16", imageFile: "images/atomic-habits.jpg", description: "Tiny changes, remarkable results." },
    { id: "nonfiction2", type: "Book", category: "Self-Improvement", title: "Can't Hurt Me", authorOrBrand: "David Goggins", price: 950.00, stock: 75, totalSold: 13000, releaseDate: "2018-12-04", imageFile: "images/cant-hurt-me.jpg", description: "Master your mind and defy the odds." },
    { id: "nonfiction3", type: "Book", category: "Business", title: "Dare to Lead", authorOrBrand: "Brené Brown", price: 880.00, stock: 40, totalSold: 6500, releaseDate: "2018-10-09", imageFile: "images/dare-to-lead.jpg", description: "Brave work. Tough conversations. Whole hearts." },
    { id: "nonfiction4", type: "Book", category: "Self-Improvement", title: "Deep Work", authorOrBrand: "Cal Newport", price: 790.00, stock: 55, totalSold: 7600, releaseDate: "2016-01-05", imageFile: "images/deep-work.jpg", description: "Rules for focused success in a distracted world." },
    { id: "nonfiction5", type: "Book", category: "Self-Improvement", title: "Essentialism", authorOrBrand: "Greg McKeown", price: 780.00, stock: 50, totalSold: 6800, releaseDate: "2014-04-15", imageFile: "images/essentialism.jpg", description: "The disciplined pursuit of less." },
    { id: "nonfiction6", type: "Book", category: "Business", title: "Good to Great", authorOrBrand: "Jim Collins", price: 900.00, stock: 28, totalSold: 8800, releaseDate: "2001-10-16", imageFile: "images/good-to-great.jpg", description: "Why some companies make the leap and others don't." },
    { id: "nonfiction7", type: "Book", category: "Psychology", title: "Outliers", authorOrBrand: "Malcolm Gladwell", price: 850.00, stock: 48, totalSold: 9400, releaseDate: "2008-11-18", imageFile: "images/outliers.jpg", description: "The story of success." },
    { id: "nonfiction8", type: "Book", category: "Business", title: "Rich Dad Poor Dad", authorOrBrand: "Robert Kiyosaki", price: 750.00, stock: 65, totalSold: 15000, releaseDate: "1997-04-01", imageFile: "images/rich-dad-poor-dad.jpg", description: "What the rich teach their kids about money." },
    { id: "nonfiction9", type: "Book", category: "History", title: "Sapiens", authorOrBrand: "Yuval Noah Harari", price: 950.00, stock: 45, totalSold: 9800, releaseDate: "2015-02-10", imageFile: "images/sapiens.jpg", description: "A brief history of humankind." },
    { id: "nonfiction10", type: "Book", category: "Business", title: "Start with Why", authorOrBrand: "Simon Sinek", price: 750.00, stock: 62, totalSold: 9100, releaseDate: "2009-10-29", imageFile: "images/start-with-why.jpg", description: "How great leaders inspire everyone to take action." },
    { id: "nonfiction11", type: "Book", category: "Psychology", title: "The 48 Laws of Power", authorOrBrand: "Robert Greene", price: 980.00, stock: 40, totalSold: 14500, releaseDate: "1998-09-01", imageFile: "images/the-48-laws-of-power.jpg", description: "Amoral, cunning, ruthless, and instructive." },
    { id: "nonfiction12", type: "Book", category: "Business", title: "The Psychology of Money", authorOrBrand: "Morgan Housel", price: 820.00, stock: 110, totalSold: 10200, releaseDate: "2020-09-08", imageFile: "images/the-psychology-of-money.jpg", description: "Timeless lessons on wealth and greed." },
    { id: "nonfiction13", type: "Book", category: "Psychology", title: "Thinking, Fast and Slow", authorOrBrand: "Daniel Kahneman", price: 920.00, stock: 30, totalSold: 8400, releaseDate: "2011-10-25", imageFile: "images/thinking-fast-and-slow.jpg", description: "The two systems that drive the way we think." },
    { id: "nonfiction14", type: "Book", category: "Business", title: "Zero to One", authorOrBrand: "Peter Thiel", price: 820.00, stock: 35, totalSold: 7900, releaseDate: "2014-09-16", imageFile: "images/zero-to-one.jpg", description: "Notes on startups, or how to build the future." },
    { id: "nonfiction15", type: "Book", category: "Self-Improvement", title: "How to Win Friends", authorOrBrand: "Dale Carnegie", price: 650.00, stock: 85, totalSold: 16000, releaseDate: "1936-10-01", imageFile: "images/how-to-win-friends.jpg", description: "The classic manual on human relations." }, 

    // --- 15 ACADEMIC BOOKS ---
    { id: "academic1", type: "Book", category: "Mathematics", title: "Advanced Calculus", authorOrBrand: "James Stewart", price: 2520.00, stock: 45, totalSold: 1250, releaseDate: "2025-01-15", imageFile: "images/advanced-calculus.jpg", description: "The industry standard, featuring clear explanations." },
    { id: "academic2", type: "Book", category: "IT", title: "Data Structures in C++", authorOrBrand: "D.S. Malik", price: 1750.00, stock: 14, totalSold: 1340, releaseDate: "2024-07-30", imageFile: "images/data-structures-using-cpp.jpg", description: "Learn how to build efficient algorithms." },
    { id: "academic3", type: "Book", category: "Mathematics", title: "Discrete Math", authorOrBrand: "Kenneth Rosen", price: 2150.00, stock: 33, totalSold: 2120, releaseDate: "2024-02-14", imageFile: "images/discrete-mathematics-and-its-applications.jpg", description: "Foundations essential for computer science." },
    { id: "academic4", type: "Book", category: "Engineering", title: "Engineering Mechanics", authorOrBrand: "R.C. Hibbeler", price: 2600.00, stock: 7, totalSold: 1650, releaseDate: "2025-06-25", imageFile: "images/engineering-mechanics.jpg", description: "Statics and dynamics fundamentals." },
    { id: "academic5", type: "Book", category: "IT", title: "Foundation of Computer Science", authorOrBrand: "Behrouz A. Forouzan", price: 1980.00, stock: 30, totalSold: 1500, releaseDate: "2026-01-05", imageFile: "images/foundation-of-computer-science.jpg", description: "Introduction to data, hardware, and algorithms." },
    { id: "academic6", type: "Book", category: "Science", title: "Human Anatomy", authorOrBrand: "Elaine N. Marieb", price: 3400.00, stock: 11, totalSold: 3000, releaseDate: "2023-11-10", imageFile: "images/human-anatomy-and-physiology.jpg", description: "Detailed exploration of human body systems." },
    { id: "academic7", type: "Book", category: "Social Science", title: "Intro to Sociology", authorOrBrand: "Anthony Giddens", price: 1400.00, stock: 19, totalSold: 980, releaseDate: "2024-09-05", imageFile: "images/introduction-to-sociology.jpg", description: "Understanding society and culture." },
    { id: "academic8", type: "Book", category: "Business", title: "Macroeconomics", authorOrBrand: "N. Gregory Mankiw", price: 1530.00, stock: 8, totalSold: 2100, releaseDate: "2025-02-10", imageFile: "images/macroeconomics.jpg", description: "Accessible textbook providing an economic framework." },
    { id: "academic9", type: "Book", category: "Business", title: "Marketing Management", authorOrBrand: "Philip Kotler", price: 2100.00, stock: 18, totalSold: 2500, releaseDate: "2023-10-22", imageFile: "images/marketing-management.jpg", description: "The gold standard for marketing students." },
    { id: "academic10", type: "Book", category: "Science", title: "Microbiology", authorOrBrand: "Marjorie Cowan", price: 2200.00, stock: 25, totalSold: 670, releaseDate: "2025-03-11", imageFile: "images/microbiology.jpg", description: "A clinical approach to understanding microbes." },
    { id: "academic11", type: "Book", category: "Science", title: "Modern Biology", authorOrBrand: "Campbell & Reece", price: 2850.50, stock: 12, totalSold: 980, releaseDate: "2024-11-20", imageFile: "images/modern-biology.jpg", description: "The premier undergraduate textbook." },
    { id: "academic12", type: "Book", category: "Science", title: "Organic Chemistry", authorOrBrand: "K. Peter C. Vollhardt", price: 3100.00, stock: 5, totalSold: 840, releaseDate: "2025-12-01", imageFile: "images/organic-chemistry.jpg", description: "Structure and function of organic molecules." },
    { id: "academic13", type: "Book", category: "Science", title: "Physics for Scientists", authorOrBrand: "Serway & Jewett", price: 2900.00, stock: 40, totalSold: 1890, releaseDate: "2026-02-01", imageFile: "images/physics-for-scientists-and-engineers.jpg", description: "Achieve success with this comprehensive text." },
    { id: "academic14", type: "Book", category: "Social Science", title: "Psychology 101", authorOrBrand: "David G. Myers", price: 1250.00, stock: 55, totalSold: 3200, releaseDate: "2023-08-14", imageFile: "images/psychology.jpg", description: "An engaging introduction to human behavior." },
    { id: "academic15", type: "Book", category: "History", title: "World History", authorOrBrand: "William Duiker", price: 1800.00, stock: 22, totalSold: 1100, releaseDate: "2024-05-18", imageFile: "images/world-history.jpg", description: "Narrative of human civilization." },

    // --- 20 STATIONERY / SUPPLIES ---
    { id: "stationery1", type: "Stationery", category: "Electronics", title: "Casio Scientific Calculator", authorOrBrand: "Casio", price: 1450.00, stock: 85, totalSold: 3200, releaseDate: "2021-07-25", imageFile: "images/casio-scientific-calculator-fx-991ex.jpg", description: "ClassWiz series with spreadsheet function." },
    { id: "stationery2", type: "Stationery", category: "Notebooks", title: "Cattleya Filler Notebook", authorOrBrand: "Cattleya", price: 35.00, stock: 500, totalSold: 8900, releaseDate: "2022-08-01", imageFile: "images/cattleya-filler-notebook.jpg", description: "Standard 80 leaves spiral notebook." },
    { id: "stationery3", type: "Stationery", category: "Organization", title: "Clear Expanding Envelope", authorOrBrand: "Generic", price: 25.00, stock: 600, totalSold: 10800, releaseDate: "2023-01-05", imageFile: "images/clear-expanding-envelope-long.jpg", description: "Plastic envelope with push lock." },
    { id: "stationery4", type: "Stationery", category: "Organization", title: "Deli 2-Hole Puncher", authorOrBrand: "Deli", price: 150.00, stock: 90, totalSold: 1200, releaseDate: "2022-04-18", imageFile: "images/deli-2-hole-puncher.jpg", description: "Heavy duty metal puncher." },
    { id: "stationery5", type: "Stationery", category: "Office", title: "Elmer's Glue Stick 22g", authorOrBrand: "Elmer's", price: 65.00, stock: 220, totalSold: 2400, releaseDate: "2022-09-05", imageFile: "images/elmers-glue-stick.jpg", description: "Washable, no-run glue stick." },
    { id: "stationery6", type: "Stationery", category: "Art", title: "Faber-Castell Color Pencils", authorOrBrand: "Faber-Castell", price: 280.00, stock: 110, totalSold: 1500, releaseDate: "2022-01-15", imageFile: "images/faber-castell-classic-color-pencils.jpg", description: "Vibrant, break-resistant lead." },
    { id: "stationery7", type: "Stationery", category: "Writing", title: "Faber-Castell Highlighter", authorOrBrand: "Faber-Castell", price: 45.00, stock: 200, totalSold: 9600, releaseDate: "2023-02-10", imageFile: "images/faber-castell-highligher-yellow.jpg", description: "Super fluorescent highlighter." },
    { id: "stationery8", type: "Stationery", category: "Office", title: "Joy Stapler with Remover", authorOrBrand: "Joy", price: 85.00, stock: 160, totalSold: 2100, releaseDate: "2023-08-11", imageFile: "images/joy-stapler-with-remover.jpg", description: "Standard #10 stapler." },
    { id: "stationery9", type: "Stationery", category: "Office", title: "Maped Eraser (Pack of 2)", authorOrBrand: "Maped", price: 40.00, stock: 350, totalSold: 4100, releaseDate: "2022-11-20", imageFile: "images/maped-eraser.jpg", description: "Dust-free white eraser." },
    { id: "stationery10", type: "Stationery", category: "Office", title: "Metal Binder Clips", authorOrBrand: "Generic", price: 45.00, stock: 400, totalSold: 8900, releaseDate: "2021-08-30", imageFile: "images/metal-binder-clips.jpg", description: "Strong grip paper clips." },
    { id: "stationery11", type: "Stationery", category: "Notebooks", title: "Moleskine Hardcover", authorOrBrand: "Moleskine", price: 1250.00, stock: 40, totalSold: 850, releaseDate: "2021-04-10", imageFile: "images/moleskine-classic-hardcover.jpg", description: "Premium dotted journal." },
    { id: "stationery12", type: "Stationery", category: "Notebooks", title: "Muji Cahier Journal", authorOrBrand: "Muji", price: 650.00, stock: 60, totalSold: 1100, releaseDate: "2022-10-12", imageFile: "images/muji-cahier-journal.jpg", description: "Minimalist grid notebooks." },
    { id: "stationery13", type: "Stationery", category: "Writing", title: "Panda Ballpen Black", authorOrBrand: "Panda", price: 120.00, stock: 300, totalSold: 14200, releaseDate: "2023-01-01", imageFile: "images/panda-ballpen-black.jpg", description: "Smooth writing ballpoint pens." },
    { id: "stationery14", type: "Stationery", category: "Writing", title: "Pentel Energel 0.5mm Blue", authorOrBrand: "Pentel", price: 75.00, stock: 90, totalSold: 1800, releaseDate: "2023-06-20", imageFile: "images/pentel-engergel-blue.jpg", description: "Quick-drying liquid gel pen." },
    { id: "stationery15", type: "Stationery", category: "Writing", title: "Pilot G-Tec C4 Black", authorOrBrand: "Pilot", price: 65.00, stock: 150, totalSold: 3400, releaseDate: "2022-05-15", imageFile: "images/pilot-g-tec-pen.jpg", description: "Ultra-fine 0.4mm gel pen." },
    { id: "stationery16", type: "Stationery", category: "Office", title: "Post-it Notes 3x3", authorOrBrand: "3M", price: 75.00, stock: 280, totalSold: 11500, releaseDate: "2021-06-14", imageFile: "images/post-it-notes.jpg", description: "100 sheets sticky notes." },
    { id: "stationery17", type: "Stationery", category: "Art", title: "Prang Watercolors 8 Colors", authorOrBrand: "Prang", price: 195.00, stock: 75, totalSold: 900, releaseDate: "2023-05-10", imageFile: "images/prang-watercolors-8-colors.jpg", description: "Semi-moist watercolors with brush." },
    { id: "stationery18", type: "Stationery", category: "Office", title: "Scotch Magic Tape", authorOrBrand: "3M", price: 110.00, stock: 140, totalSold: 1800, releaseDate: "2021-03-22", imageFile: "images/scotch-magic-tape-with-dispenser.jpg", description: "Invisible matte finish tape." },
    { id: "stationery19", type: "Stationery", category: "Writing", title: "Sharpie Marker Black", authorOrBrand: "Sharpie", price: 55.00, stock: 120, totalSold: 2100, releaseDate: "2021-11-05", imageFile: "images/sharphie-permanent-marker-black.jpg", description: "Fine point permanent marker." },
    { id: "stationery20", type: "Stationery", category: "Notebooks", title: "Veco Yellow Pad Paper", authorOrBrand: "Veco", price: 45.00, stock: 450, totalSold: 13800, releaseDate: "2023-03-01", imageFile: "images/veco-yellow-pad-paper.jpg", description: "Standard 90 leaves legal pad." }
];

/* ==========================================================================
    2. GLOBAL UTILITY & SEARCH FUNCTIONS
   ========================================================================== */
function formatCurrency(amount) {
    return '₱' + parseFloat(amount).toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function renderProductCards(containerId, productsArray) {
    const containerElement = document.getElementById(containerId);
    if (!containerElement) return;
    
    containerElement.innerHTML = ''; 
    if(productsArray.length === 0) {
        containerElement.innerHTML = `<p style="grid-column: 1/-1; text-align: center; padding: 40px; color: var(--text-muted-color);">No products found matching your criteria.</p>`;
        return;
    }
    
    productsArray.forEach(productItem => {
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

function setupGlobalSearch() {
    const searchInputFields = document.querySelectorAll('.search-input-field');
    searchInputFields.forEach(inputElement => {
        inputElement.addEventListener('keypress', (event) => {
            if (event.key === 'Enter' && inputElement.value.trim() !== '') {
                window.location.href = `catalog.html?search=${encodeURIComponent(inputElement.value.trim())}`;
            }
        });
    });
}

function scrollToSummary() {
    const orderSummaryBox = document.getElementById('order-summary-box');
    const mainHeader = document.querySelector('.main-navigation-header');
    
    if (orderSummaryBox && mainHeader) {
        const headerHeight = mainHeader.offsetHeight;
        const paddingOffset = 20; 
        const elementPosition = orderSummaryBox.getBoundingClientRect().top;
        const targetScrollPosition = elementPosition + window.pageYOffset - headerHeight - paddingOffset;

        window.scrollTo({ top: targetScrollPosition, behavior: "smooth" });
    }
}

function scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

window.addEventListener('scroll', () => {
    const backToTopButton = document.getElementById('back-to-top');
    if (backToTopButton) {
        if (window.scrollY > 300) { backToTopButton.style.display = 'flex'; } 
        else { backToTopButton.style.display = 'none'; }
    }
});

function setupMobileCheckoutObserver() {
    const mobileCheckoutBar = document.querySelector('.mobile-checkout-bar');
    const orderSummaryBox = document.getElementById('order-summary-box');
    
    if (mobileCheckoutBar && orderSummaryBox) {
        window.addEventListener('scroll', () => {
            const summaryRectangle = orderSummaryBox.getBoundingClientRect();
            if (summaryRectangle.top <= window.innerHeight) {
                mobileCheckoutBar.style.transform = 'translateY(100%)';
                mobileCheckoutBar.style.opacity = '0';
                mobileCheckoutBar.style.pointerEvents = 'none';
            } else {
                mobileCheckoutBar.style.transform = 'translateY(0)';
                mobileCheckoutBar.style.opacity = '1';
                mobileCheckoutBar.style.pointerEvents = 'auto';
            }
        });
        window.dispatchEvent(new Event('scroll'));
    }
}

/* ==========================================================================
    3. GLOBAL CART LOGIC
   ========================================================================== */

let rawCartData = JSON.parse(localStorage.getItem('unlimitedPageCart')) || [];
let userShoppingCart = rawCartData.filter(cartItem => productDatabase.some(databaseItem => databaseItem.id === cartItem.id));
if (rawCartData.length !== userShoppingCart.length) {
    localStorage.setItem('unlimitedPageCart', JSON.stringify(userShoppingCart));
}

let currentPromoDiscount = 0; 
let isPromoApplied = false;
let promoBurnedDatabase = JSON.parse(localStorage.getItem('promoBurned')) || false; 
let selectedPaymentMethod = 'Cash on Delivery'; 

function selectPayment(paymentMethodString) {
    selectedPaymentMethod = paymentMethodString;
    const paymentMethodElements = document.querySelectorAll('.checkout-payment-method');
    paymentMethodElements.forEach(paymentElement => {
        if (paymentElement.getAttribute('data-method') === paymentMethodString) { paymentElement.classList.add('selected'); } 
        else { paymentElement.classList.remove('selected'); }
    });
}

function updateCartBadge() {
    const badgeElement = document.getElementById('global-cart-badge');
    if (badgeElement) { 
        badgeElement.textContent = userShoppingCart.length; 
    }
}

function addProductToCart(productId) {
    const productToAdd = productDatabase.find(databaseItem => databaseItem.id === productId);
    if (!productToAdd) return;

    const existingCartItem = userShoppingCart.find(databaseItem => databaseItem.id === productId);
    if (existingCartItem) {
        if (existingCartItem.quantity < productToAdd.stock) {
            existingCartItem.quantity += 1;
            alert(`Increased quantity of ${productToAdd.title} in cart.`);
        } else {
            alert(`Sorry, only ${productToAdd.stock} items in stock!`);
        }
    } else {
        userShoppingCart.push({ id: productToAdd.id, quantity: 1, isSelectedForOrder: false });
        alert(`${productToAdd.title} has been added to your cart!`);
    }

    localStorage.setItem('unlimitedPageCart', JSON.stringify(userShoppingCart));
    updateCartBadge();
}

function toggleCartItemSelection(productId) {
    const targetItem = userShoppingCart.find(databaseItem => databaseItem.id === productId);
    if (targetItem) {
        targetItem.isSelectedForOrder = !targetItem.isSelectedForOrder; 
        localStorage.setItem('unlimitedPageCart', JSON.stringify(userShoppingCart));
        initCart(); 
    }
}

function manualCartQuantityUpdate(productId, inputValue) {
    let newQuantity = parseInt(inputValue);
    const itemIndex = userShoppingCart.findIndex(databaseItem => databaseItem.id === productId);
    
    if (itemIndex > -1 && !isNaN(newQuantity)) {
        const productInfo = productDatabase.find(databaseItem => databaseItem.id === productId);
        if (newQuantity < 1) newQuantity = 1;
        if (newQuantity > productInfo.stock) {
            newQuantity = productInfo.stock;
            alert(`Maximum stock reached. Only ${productInfo.stock} available.`);
        }
        userShoppingCart[itemIndex].quantity = newQuantity;
        localStorage.setItem('unlimitedPageCart', JSON.stringify(userShoppingCart));
        updateCartBadge();
        initCart(); 
    }
}

function changeCartQuantity(productId, quantityDelta) {
    const itemIndex = userShoppingCart.findIndex(databaseItem => databaseItem.id === productId);
    if (itemIndex > -1) {
        let currentQuantity = userShoppingCart[itemIndex].quantity;
        manualCartQuantityUpdate(productId, currentQuantity + quantityDelta);
    }
}

function deleteItemFromCart(productId) {
    const itemIndex = userShoppingCart.findIndex(databaseItem => databaseItem.id === productId);
    if (itemIndex > -1) {
        if(confirm("Are you sure you want to remove this item from your cart?")) {
            userShoppingCart.splice(itemIndex, 1);
            localStorage.setItem('unlimitedPageCart', JSON.stringify(userShoppingCart));
            updateCartBadge();
            initCart();
        }
    }
}

/* ==========================================================================
    4. PROMO CODE & CHECKOUT FUNCTIONS
   ========================================================================== */
function applyPromoCode() {
    const promoInputField = document.getElementById('promo-code-input');
    const promoMessageElement = document.getElementById('promo-message');
    const applyPromoButton = document.getElementById('promo-apply-button');
    if(!promoInputField) return;

    if (promoInputField.value.trim().toUpperCase() === "DEVRESET") {
        localStorage.removeItem('promoBurned');
        promoBurnedDatabase = false;
        promoMessageElement.textContent = "DEV: Promo code database reset!";
        promoMessageElement.style.color = "var(--primary-blue-color)";
        promoInputField.value = '';
        return;
    }

    if (isPromoApplied) {
        isPromoApplied = false;
        currentPromoDiscount = 0;
        promoInputField.value = '';
        promoInputField.disabled = false;
        applyPromoButton.textContent = 'Apply';
        applyPromoButton.style.backgroundColor = 'var(--background-light-color)';
        applyPromoButton.style.color = 'var(--text-dark-color)';
        promoMessageElement.textContent = "Promo code removed.";
        promoMessageElement.style.color = "var(--text-muted-color)";
        initCart();
        return;
    }

    const enteredCode = promoInputField.value.trim().toUpperCase();
    
    if (enteredCode === "DEATHNOTE" && promoBurnedDatabase) {
        promoMessageElement.textContent = "This code has already been used on your account.";
        promoMessageElement.style.color = "var(--danger-red-color)";
        return;
    }

    let calculatedSubtotal = 0;
    userShoppingCart.forEach(cartItem => {
        if (cartItem.isSelectedForOrder) {
            const databaseItem = productDatabase.find(item => item.id === cartItem.id);
            if(databaseItem) {
                calculatedSubtotal += (parseFloat(databaseItem.price) * parseInt(cartItem.quantity));
            }
        }
    });

    if (enteredCode === "DEATHNOTE") {
        if (calculatedSubtotal >= 1000) { 
            isPromoApplied = true;
            currentPromoDiscount = 299;
            promoInputField.disabled = true;
            applyPromoButton.textContent = 'Remove';
            applyPromoButton.style.backgroundColor = 'var(--danger-red-color)';
            applyPromoButton.style.color = 'white';
            promoMessageElement.textContent = "Discount applied successfully!";
            promoMessageElement.style.color = "var(--success-green-color)";
        } else {
            promoMessageElement.textContent = "Order total must be at least ₱1000.";
            promoMessageElement.style.color = "var(--danger-red-color)";
        }
    } else {
        promoMessageElement.textContent = "Invalid promo code.";
        promoMessageElement.style.color = "var(--danger-red-color)";
    }
    initCart(); 
}

function processCheckout() {
    const selectedCartItems = userShoppingCart.filter(cartItem => cartItem.isSelectedForOrder);
    if (selectedCartItems.length === 0) {
        alert("Please select at least one item to place an order.");
        return;
    }
    
    let finalSubtotal = 0;
    selectedCartItems.forEach(cartItem => {
        const databaseItem = productDatabase.find(item => item.id === cartItem.id);
        if(databaseItem) finalSubtotal += (parseFloat(databaseItem.price) * parseInt(cartItem.quantity));
    });
    
    let calculatedShippingFee = (finalSubtotal < 200 && finalSubtotal > 0) ? 30 : 0;
    const finalOrderTotal = Math.max(0, finalSubtotal + calculatedShippingFee - currentPromoDiscount);
    
    alert(`Order Confirmed!\n\nThank you for shopping with Unlimited Page.\nPayment Method: ${selectedPaymentMethod}\nTotal Paid: ${formatCurrency(finalOrderTotal)}`);
    
    if (isPromoApplied) {
        localStorage.setItem('promoBurned', JSON.stringify(true));
        promoBurnedDatabase = true;
    }

    userShoppingCart = userShoppingCart.filter(cartItem => !cartItem.isSelectedForOrder);
    localStorage.setItem('unlimitedPageCart', JSON.stringify(userShoppingCart));
    
    isPromoApplied = false;
    currentPromoDiscount = 0; 
    
    updateCartBadge();
    window.location.reload(); 
}

function initCart() {
    const cartContainerElement = document.getElementById('cart-items-container');
    if (!cartContainerElement) return;

    cartContainerElement.innerHTML = '';
    let rollingSubtotal = 0;

    if (userShoppingCart.length === 0) {
        cartContainerElement.innerHTML = '<p style="padding: 20px; color: var(--text-muted-color);">Your cart is currently empty.</p>';
        document.getElementById('cart-subtotal').textContent = '₱0.00';
        document.getElementById('cart-shipping').textContent = '₱0.00';
        document.getElementById('cart-total').textContent = '₱0.00';
        if(document.getElementById('mobile-cart-total')) document.getElementById('mobile-cart-total').textContent = '₱0.00';
        if(document.getElementById('discount-row')) document.getElementById('discount-row').style.display = 'none';
        return;
    }

    userShoppingCart.sort((itemA, itemB) => {
        return (itemA.isSelectedForOrder === itemB.isSelectedForOrder) ? 0 : itemA.isSelectedForOrder ? -1 : 1;
    });

    userShoppingCart.forEach(cartItem => {
        const productInfo = productDatabase.find(databaseItem => databaseItem.id === cartItem.id);
        if (!productInfo) return;

        if (cartItem.isSelectedForOrder) { 
            rollingSubtotal += (parseFloat(productInfo.price) * parseInt(cartItem.quantity)); 
        }

        const opacityClass = cartItem.isSelectedForOrder ? '' : 'omitted-from-order';
        const toggleButtonClass = cartItem.isSelectedForOrder ? 'remove-button' : 'add-button';
        const toggleIcon = cartItem.isSelectedForOrder ? 'remove_circle_outline' : 'add_circle_outline';
        const toggleText = cartItem.isSelectedForOrder ? 'Remove' : 'Place Order';

        const itemHTML = `
            <article class="cart-item-row ${opacityClass}">
                <div class="cart-item-product-col">
                    <img src="${productInfo.imageFile}" alt="${productInfo.title}" class="cart-item-image" onerror="this.src='https://placehold.co/300x420?text=Image+Missing'">
                    <div class="cart-item-details">
                        <h3 class="product-title" style="font-size: 15px;">${productInfo.title}</h3>
                        <p class="product-author-brand">by ${productInfo.authorOrBrand}</p>
                        <div class="cart-item-stock">Stock: ${productInfo.stock} available</div>
                        
                        <div class="cart-item-action-buttons">
                            <button class="cart-item-toggle-button ${toggleButtonClass}" onclick="toggleCartItemSelection('${productInfo.id}')">
                                <span class="material-icons-outlined" style="font-size: 14px; margin-right: 4px;">${toggleIcon}</span> ${toggleText}
                            </button>
                            <button class="cart-item-delete-button" onclick="deleteItemFromCart('${productInfo.id}')">
                                <span class="material-icons-outlined" style="font-size: 14px; margin-right: 4px;">delete</span> Remove from Cart
                            </button>
                        </div>
                    </div>
                </div>
                
                <div class="cart-item-price-col" style="font-weight: 600; text-align: center;">${formatCurrency(productInfo.price)}</div>
                
                <div class="cart-quantity-selector" style="justify-self: center;">
                    <button class="quantity-button" onclick="changeCartQuantity('${productInfo.id}', -1)">-</button>
                    <input type="number" min="1" value="${cartItem.quantity}" class="quantity-input-field" 
                            onkeypress="return event.charCode >= 48 && event.charCode <= 57" 
                            onchange="manualCartQuantityUpdate('${productInfo.id}', this.value)">
                    <button class="quantity-button" onclick="changeCartQuantity('${productInfo.id}', 1)">+</button>
                </div>
                
                <div class="cart-item-total-col" style="font-weight: 700; text-align: right; font-size: 16px; color: var(--primary-blue-color);">
                    ${formatCurrency(productInfo.price * cartItem.quantity)}
                </div>
            </article>
        `;
        cartContainerElement.innerHTML += itemHTML;
    });

    if (rollingSubtotal < 1000 && isPromoApplied) {
        applyPromoCode(); 
    }
    
    let shippingFeeToApply = 0;
    const shippingDisplayElement = document.getElementById('cart-shipping');
    if (rollingSubtotal === 0) {
        shippingFeeToApply = 0;
        shippingDisplayElement.textContent = "₱0.00";
        shippingDisplayElement.style.color = "var(--text-dark-color)"; 
    } else if (rollingSubtotal > 0 && rollingSubtotal < 200) {
        shippingFeeToApply = 30;
        shippingDisplayElement.textContent = formatCurrency(shippingFeeToApply);
        shippingDisplayElement.style.color = "var(--text-dark-color)";
    } else {
        shippingFeeToApply = 0;
        shippingDisplayElement.textContent = "Free";
        shippingDisplayElement.style.color = "var(--success-green-color)";
    }

    const finalCalculatedTotal = Math.max(0, rollingSubtotal + shippingFeeToApply - currentPromoDiscount);

    document.getElementById('cart-subtotal').textContent = formatCurrency(rollingSubtotal);
    document.getElementById('cart-total').textContent = formatCurrency(finalCalculatedTotal);
    
    if(document.getElementById('mobile-cart-total')) {
        document.getElementById('mobile-cart-total').textContent = formatCurrency(finalCalculatedTotal);
    }
    
    const discountRowElement = document.getElementById('discount-row');
    if (currentPromoDiscount > 0) {
        discountRowElement.style.display = 'flex';
        document.getElementById('cart-discount-amount').textContent = '-' + formatCurrency(currentPromoDiscount);
    } else {
        if(discountRowElement) discountRowElement.style.display = 'none';
    }
}

/* ==========================================================================
   5. PAGE INITIALIZERS (Home & Catalog)
   ========================================================================== */

function initHomepage() {
    if (!document.getElementById('books-grid')) return;

    const bookListArray = productDatabase.filter(databaseItem => databaseItem.type === "Book").sort((itemA, itemB) => new Date(itemB.releaseDate) - new Date(itemA.releaseDate)).slice(0, 5);
    renderProductCards('books-grid', bookListArray);

    const stationeryListArray = productDatabase.filter(databaseItem => databaseItem.type === "Stationery").slice(0, 5);
    renderProductCards('stationery-grid', stationeryListArray);

    const bestSellersArray = [...productDatabase].sort((itemA, itemB) => itemB.totalSold - itemA.totalSold).slice(0, 5);
    renderProductCards('best-sellers-grid', bestSellersArray);
}

// --- CATALOG PAGE ---
let currentCatalogDataArray = []; 
let currentCatalogPage = 1;
const maxItemsPerPage = 12;

function initCatalog() {
    if (!document.getElementById('dynamic-catalog-grid')) return;
    
    const pageUrlParameters = new URLSearchParams(window.location.search);
    const searchParameterString = pageUrlParameters.get('search');
    const categoryParameterString = pageUrlParameters.get('category') || 'Books'; 
    const filterLinksElements = document.querySelectorAll('.filter-options-list li');
    
    const applyPriceButton = document.getElementById('apply-price-filter');
    const resetPriceButton = document.getElementById('reset-price-filter');
    const minPriceInput = document.getElementById('min-price-filter');
    const maxPriceInput = document.getElementById('max-price-filter');

    // FIX 3: Bulletproof Search Sanitizer! Removes everything except letters and numbers.
    if (searchParameterString) {
        const cleanSearchQuery = searchParameterString.toLowerCase().replace(/[^a-z0-9]/g, '');
        currentCatalogDataArray = productDatabase.filter(databaseItem => {
            const cleanTitle = databaseItem.title.toLowerCase().replace(/[^a-z0-9]/g, '');
            const cleanAuthor = databaseItem.authorOrBrand.toLowerCase().replace(/[^a-z0-9]/g, '');
            const cleanCategory = databaseItem.category.toLowerCase().replace(/[^a-z0-9]/g, '');
            
            return cleanTitle.includes(cleanSearchQuery) || 
                    cleanAuthor.includes(cleanSearchQuery) ||
                    cleanCategory.includes(cleanSearchQuery);
        });
        
        // Ensure "Most Popular" sort is applied to Search Results
        currentCatalogDataArray.sort((itemA, itemB) => itemB.totalSold - itemA.totalSold);
        
        document.getElementById('catalog-section-title').textContent = `Search Results for "${searchParameterString}"`;
        filterLinksElements.forEach(filterLink => filterLink.classList.remove('active-filter'));
    } else {
        applyCategoryFilter(categoryParameterString);
        filterLinksElements.forEach(filterLink => {
            filterLink.classList.remove('active-filter');
            if(filterLink.getAttribute('data-filter') === categoryParameterString) filterLink.classList.add('active-filter');
        });
    }

    renderCatalogPage();

    filterLinksElements.forEach(filterLink => {
        filterLink.addEventListener('click', (event) => {
            filterLinksElements.forEach(link => link.classList.remove('active-filter'));
            event.target.classList.add('active-filter');
            window.history.replaceState(null, '', 'catalog.html');
            
            applyCategoryFilter(event.target.getAttribute('data-filter'));
            document.getElementById('catalog-sort-select').value = "Most Popular";
            minPriceInput.value = ""; maxPriceInput.value = "";
            renderCatalogPage();
        });
    });

    const sortSelectElement = document.getElementById('catalog-sort-select');
    if (sortSelectElement) {
        sortSelectElement.addEventListener('change', (event) => {
            const selectedSortOption = event.target.value;
            if (selectedSortOption === 'Price: Low to High') currentCatalogDataArray.sort((itemA, itemB) => itemA.price - itemB.price);
            else if (selectedSortOption === 'Price: High to Low') currentCatalogDataArray.sort((itemA, itemB) => itemB.price - itemA.price);
            else if (selectedSortOption === 'Newest') currentCatalogDataArray.sort((itemA, itemB) => new Date(itemB.releaseDate) - new Date(itemA.releaseDate));
            else currentCatalogDataArray.sort((itemA, itemB) => itemB.totalSold - itemA.totalSold);
            renderCatalogPage();
        });
    }

    if (applyPriceButton && resetPriceButton) {
        applyPriceButton.addEventListener('click', () => {
            const minPriceLimit = minPriceInput.value === '' ? 0 : parseFloat(minPriceInput.value);
            const maxPriceLimit = maxPriceInput.value === '' ? Infinity : parseFloat(maxPriceInput.value);
            
            const activeCategoryElement = document.querySelector('.filter-options-list li.active-filter');
            applyCategoryFilter(activeCategoryElement ? activeCategoryElement.getAttribute('data-filter') : 'Books');
            
            currentCatalogDataArray = currentCatalogDataArray.filter(databaseItem => databaseItem.price >= minPriceLimit && databaseItem.price <= maxPriceLimit);
            renderCatalogPage();
        });

        resetPriceButton.addEventListener('click', () => {
            minPriceInput.value = ""; maxPriceInput.value = "";
            const activeCategoryElement = document.querySelector('.filter-options-list li.active-filter');
            applyCategoryFilter(activeCategoryElement ? activeCategoryElement.getAttribute('data-filter') : 'Books');
            renderCatalogPage();
        });
    }
}

function applyCategoryFilter(selectedCategoryString) {
    if (selectedCategoryString === "Books") {
        currentCatalogDataArray = productDatabase.filter(databaseItem => databaseItem.type === "Book" || databaseItem.type === "E-Book");
        document.getElementById('catalog-section-title').textContent = "Books";
    } else if (selectedCategoryString === "Stationery") {
        currentCatalogDataArray = productDatabase.filter(databaseItem => databaseItem.type === "Stationery");
        document.getElementById('catalog-section-title').textContent = "Stationery";
    } else if (selectedCategoryString === "Best") {
        currentCatalogDataArray = [...productDatabase];
        document.getElementById('catalog-section-title').textContent = "Best Sellers";
    }
    // Always default to sorting by Most Popular when changing categories
    currentCatalogDataArray.sort((itemA, itemB) => itemB.totalSold - itemA.totalSold);
}

function renderCatalogPage() {
    currentCatalogPage = 1; 
    updateCatalogDOM();
}

function updateCatalogDOM() {
    const startItemIndex = (currentCatalogPage - 1) * maxItemsPerPage;
    const endItemIndex = startItemIndex + maxItemsPerPage;
    const paginatedDataArray = currentCatalogDataArray.slice(startItemIndex, endItemIndex);
    
    renderProductCards('dynamic-catalog-grid', paginatedDataArray);
    renderPaginationControls(currentCatalogDataArray.length);
}

function renderPaginationControls(totalItemCount) {
    const paginationContainerElement = document.getElementById('pagination-container');
    if (!paginationContainerElement) return;
    paginationContainerElement.innerHTML = '';
    
    const totalPagesNeeded = Math.ceil(totalItemCount / maxItemsPerPage);
    if (totalPagesNeeded <= 1) return; 

    const previousPageButton = document.createElement('button');
    previousPageButton.className = 'page-button';
    previousPageButton.innerHTML = '<span class="material-icons-outlined">chevron_left</span>';
    previousPageButton.disabled = currentCatalogPage === 1;
    previousPageButton.onclick = () => { if(currentCatalogPage > 1) { currentCatalogPage--; updateCatalogDOM(); window.scrollTo(0,0); } };
    paginationContainerElement.appendChild(previousPageButton);

    for (let pageIndex = 1; pageIndex <= totalPagesNeeded; pageIndex++) {
        const pageNumberButton = document.createElement('button');
        pageNumberButton.className = `page-button ${pageIndex === currentCatalogPage ? 'active' : ''}`;
        pageNumberButton.innerText = pageIndex;
        pageNumberButton.onclick = () => { currentCatalogPage = pageIndex; updateCatalogDOM(); window.scrollTo(0,0); };
        paginationContainerElement.appendChild(pageNumberButton);
    }

    const nextPageButton = document.createElement('button');
    nextPageButton.className = 'page-button';
    nextPageButton.innerHTML = '<span class="material-icons-outlined">chevron_right</span>';
    nextPageButton.disabled = currentCatalogPage === totalPagesNeeded;
    nextPageButton.onclick = () => { if(currentCatalogPage < totalPagesNeeded) { currentCatalogPage++; updateCatalogDOM(); window.scrollTo(0,0); } };
    paginationContainerElement.appendChild(nextPageButton);
}

document.addEventListener('DOMContentLoaded', () => {
    updateCartBadge();
    setupGlobalSearch();
    initHomepage();
    initCatalog();
    initCart();
    setupMobileCheckoutObserver(); 
});