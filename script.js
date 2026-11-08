const DEFAULT_PRODUCTS = [
    {
        id: 1,
        name: "Cloud Scrunchie",
        price: 39,
        category: "Scrunchies",
        image: "5ba571e9-3305-49bd-8072-fed354f5c207.jpg",
        emoji: "\u2601\uFE0F",
        badge: "BESTSELLER",
        description: "Fluffy, soft, and cute for everyday ayos.",
        colors: ["Blush Pink", "Cream", "Brown"]
    },
    {
        id: 2,
        name: "Satin Bow Scrunchie",
        price: 49,
        category: "Scrunchies",
        image: "d14b807f-3e56-40ce-9563-b23bf0405a3e.jpg",
        emoji: "\u{1F380}",
        badge: "NEW",
        description: "A satin bow detail for an extra sweet look.",
        colors: ["Rose", "Ivory", "Black"]
    },
    {
        id: 3,
        name: "Acetate Claw Clip",
        price: 59,
        category: "Claw Clips",
        image: "a264a5d9-f4cc-4a38-9de7-c65bb4912880.jpg",
        emoji: "\u{1F98B}",
        badge: "TRENDING",
        description: "A sturdy claw clip with a polished finish.",
        colors: ["Tortoise", "Pink", "Cream"]
    },
    {
        id: 4,
        name: "Pearl Mini Clips Set",
        price: 45,
        category: "Accessories",
        image: "9b1b16b3-ad1b-4f5d-8f07-960dfb1d5a07.jpg",
        emoji: "\u{1F90D}",
        badge: "SET OF 4",
        description: "Tiny pearl clips for a delicate finishing touch.",
        colors: ["Pearl White", "Blush"]
    },
    {
        id: 5,
        name: "Satin Headband",
        price: 69,
        category: "Headbands",
        image: "8910e610-63fc-447b-ab39-5b8dc31c2480.jpg",
        emoji: "\u{1F451}",
        badge: "TRENDING",
        description: "A comfortable padded headband in soft satin.",
        colors: ["Dusty Pink", "Beige", "Black"]
    },
    {
        id: 6,
        name: "Ribbon Bow Y2K",
        price: 35,
        category: "Accessories",
        image: "6f1d5085-ee67-40a8-b3a4-c72802fdd5b0.jpg",
        emoji: "\u{1F380}",
        badge: "TRENDING",
        description: "A playful ribbon bow for a cute hairstyle.",
        colors: ["Pink", "White", "Red"]
    },
    {
        id: 7,
        name: "Mystery Tali Box",
        price: 199,
        category: "Accessories",
        image: "48a8a73f-5378-4f2d-b467-67a22b70c7db.jpg",
        emoji: "\u{1F381}",
        badge: "GIFT IDEA",
        description: "A surprise box filled with seven hair accessories.",
        colors: ["Surprise Mix"]
    },
    {
        id: 8,
        name: "Mini Butterfly Clips",
        price: 29,
        category: "Claw Clips",
        image: "8421f39b-81c0-43fa-962f-33567c6236fb.jpg",
        emoji: "\u{1F98B}",
        badge: "",
        description: "Tiny clips that add fun to any hairstyle.",
        colors: ["Pink", "Lilac", "Cream"]
    }
];

const PRODUCTS_KEY = "lirayTaliProductsV1";
const CART_KEY = "lirayTaliCartV1";
const MIN_SHIPPING_FEE = 500;
const ORDER_EMAIL = "sharmainecantal@gmail.com";
const CHECKOUT_HASH = "#checkout";

let products = loadProducts();
let cart = loadCart();

let activeCategory = "All";
let selectedColors = {};
let currentProductId = null;
let checkoutItems = [];
let heroGalleryTimer = null;

const formatPrice = amount =>
    Number(amount).toLocaleString("en-PH", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    });


// ==================================================
// LOAD AND SAVE DATA
// ==================================================

function loadProducts() {
    try {
        const saved = localStorage.getItem(PRODUCTS_KEY);

        if (saved !== null) {
            const parsed = JSON.parse(saved);

            if (Array.isArray(parsed)) {
                return parsed;
            }
        }
    } catch (error) {
        console.error("Could not load saved products:", error);
    }

    return JSON.parse(JSON.stringify(DEFAULT_PRODUCTS));
}

function saveProducts() {
    try {
        localStorage.setItem(PRODUCTS_KEY, JSON.stringify(products));
        return true;
    } catch (error) {
        alert("Could not save products. Check your browser storage.");
        console.error(error);
        return false;
    }
}

function loadCart() {
    try {
        const saved = localStorage.getItem(CART_KEY);
        return saved ? JSON.parse(saved) : [];
    } catch (error) {
        console.error("Could not load shopping cart:", error);
        return [];
    }
}

function saveCart() {
    try {
        localStorage.setItem(CART_KEY, JSON.stringify(cart));
    } catch (error) {
        console.error("Could not save shopping cart:", error);
    }
}

function getProduct(id) {
    return products.find(product => product.id === Number(id));
}

function escapeHTML(value) {
    return String(value ?? "").replace(/[&<>"']/g, character => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#039;"
    })[character]);
}

function imageMarkup(product, extraClass = "") {
    if (product.image && product.image.trim()) {
        const safeImage = escapeHTML(product.image.trim());

        return `
            <img
                class="${extraClass}"
                src="${safeImage}"
                alt="${escapeHTML(product.name)}"
                loading="lazy"
                onerror="this.style.display='none'; this.nextElementSibling.style.display='grid';"
            >
            <div class="placeholder-art" style="display:none">
                ${escapeHTML(product.emoji || "\u{1F380}")}
            </div>
        `;
    }

    return `
        <div class="placeholder-art">
            ${escapeHTML(product.emoji || "\u{1F380}")}
        </div>
    `;
}

function renderHeroGallery() {
    const gallery = document.getElementById("heroProductGallery");

    if (!gallery) return;

    if (heroGalleryTimer) {
        clearInterval(heroGalleryTimer);
        heroGalleryTimer = null;
    }

    const galleryProducts = products.filter(product =>
        product &&
        typeof product.name === "string" &&
        product.name.trim()
    );

    if (galleryProducts.length === 0) return;

    for (let index = galleryProducts.length - 1; index > 0; index -= 1) {
        const randomIndex = Math.floor(Math.random() * (index + 1));
        [galleryProducts[index], galleryProducts[randomIndex]] =
            [galleryProducts[randomIndex], galleryProducts[index]];
    }

    gallery.innerHTML = galleryProducts.map((product, index) => {
        const activeClass = index === 0 ? " is-active" : "";

        if (typeof product.image === "string" && product.image.trim()) {
            return `
                <img
                    class="hero-color-slide${activeClass}"
                    src="${escapeHTML(product.image.trim())}"
                    alt="${escapeHTML(product.name)}"
                    ${index === 0 ? 'fetchpriority="high"' : 'loading="lazy"'}
                >
            `;
        }

        return `
            <div class="hero-color-slide hero-color-slide--placeholder${activeClass}"
                role="img" aria-label="${escapeHTML(product.name)}">
                ${escapeHTML(product.emoji || "\u{1F380}")}
            </div>
        `;
    }).join("");

    if (
        galleryProducts.length < 2 ||
        window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
        return;
    }

    let activeIndex = 0;
    heroGalleryTimer = setInterval(() => {
        if (document.hidden) return;

        const slides = gallery.querySelectorAll(".hero-color-slide");
        slides[activeIndex].classList.remove("is-active");
        activeIndex = (activeIndex + 1) % slides.length;
        slides[activeIndex].classList.add("is-active");
    }, 3500);
}


// ==================================================
// DISPLAY PRODUCTS
// ==================================================

function renderProducts() {
    const grid = document.getElementById("productGrid");
    const searchInput = document.getElementById("searchInput");
    const searchTerm = searchInput.value.trim().toLowerCase();

    let visibleProducts = products.filter(product => {
        const matchesCategory =
            activeCategory === "All" ||
            product.category === activeCategory;

        const searchableText = [
            product.name,
            product.category,
            product.description,
            ...(product.colors || [])
        ].join(" ").toLowerCase();

        const matchesSearch = searchableText.includes(searchTerm);

        return matchesCategory && matchesSearch;
    });

    const sortValue = document.getElementById("sortSelect").value;

    if (sortValue === "low") {
        visibleProducts.sort((a, b) => a.price - b.price);
    } else if (sortValue === "high") {
        visibleProducts.sort((a, b) => b.price - a.price);
    } else if (sortValue === "name") {
        visibleProducts.sort((a, b) =>
            a.name.localeCompare(b.name)
        );
    }

    if (visibleProducts.length === 0) {
        grid.innerHTML = `
            <div class="empty-results">
                <h3>No products found.</h3>
                <p>Try another category or search term.</p>
            </div>
        `;

        return;
    }

    grid.innerHTML = visibleProducts.map(product => {
        const colors = Array.isArray(product.colors)
            ? product.colors
            : [];

        const selectedColor =
            selectedColors[product.id] || colors[0] || "";

        return `
            <article class="product-card">

                <div
                    class="product-picture"
                    data-open-product="${product.id}"
                    role="button"
                    tabindex="0"
                    aria-label="View ${escapeHTML(product.name)}"
                >

                    ${imageMarkup(product)}

                    ${product.badge
                ? `<span class="product-badge">
                                ${escapeHTML(product.badge)}
                               </span>`
                : ""
            }

                    <div class="product-actions">
                        <button
                            class="quick-add"
                            data-quick-add="${product.id}"
                            type="button"
                        >
                            ADD TO CART +
                        </button>

                        <button
                            class="buy-now"
                            data-buy-now="${product.id}"
                            type="button"
                        >
                            BUY NOW
                        </button>
                    </div>

                </div>

                <div class="product-info">

                    <h3>${escapeHTML(product.name)}</h3>

                    <div class="product-price">
                        ${formatPrice(product.price)}
                    </div>

                    <div class="product-description">
                        ${escapeHTML(product.description)}
                    </div>

                    <div class="swatches">
                        ${colors.map(color => `
                            <button
                                type="button"
                                class="swatch ${selectedColor === color ? "selected" : ""
                }"
                                style="background:${getColorCode(color)}"
                                data-swatch-product="${product.id}"
                                data-swatch-color="${escapeHTML(color)}"
                                title="${escapeHTML(color)}"
                                aria-label="Choose ${escapeHTML(color)}"
                            ></button>
                        `).join("")}
                    </div>

                </div>

            </article>
        `;
    }).join("");
}


// ==================================================
// COLOR SWATCHES
// ==================================================

function getColorCode(color) {
    const colorMap = {
        "Pink": "#e6b8bd",
        "Blush Pink": "#e6b8bd",
        "Rose": "#d88f91",
        "Dusty Pink": "#dca3a8",
        "Cream": "#eee4d2",
        "Ivory": "#f2e7d5",
        "Beige": "#cdb8a1",
        "Brown": "#8c6858",
        "Tortoise": "#76513c",
        "Black": "#292426",
        "White": "#ffffff",
        "Red": "#a94c51",
        "Lilac": "#c8b9df",
        "Pearl White": "#f6f0e8",
        "Surprise Mix": "#dca3a8"
    };

    return colorMap[color] || "#dfc7c1";
}


// ==================================================
// CATEGORY FILTERS
// ==================================================

function setCategory(category) {
    activeCategory = category;

    document.querySelectorAll("[data-filter]").forEach(button => {
        button.classList.toggle(
            "active",
            button.dataset.filter === category
        );
    });

    renderProducts();

    document.getElementById("shop").scrollIntoView({
        behavior: "smooth",
        block: "start"
    });
}

document.querySelectorAll("[data-filter]").forEach(button => {
    button.addEventListener("click", () => {
        setCategory(button.dataset.filter);
    });
});

document.querySelectorAll("[data-category]").forEach(link => {
    link.addEventListener("click", () => {
        setCategory(link.dataset.category);
        document.getElementById("navigation").classList.remove("open");
        document.getElementById("menuToggle").setAttribute("aria-expanded", "false");
    });
});


// ==================================================
// PRODUCT DETAILS
// ==================================================

function openProduct(id) {
    const product = getProduct(id);

    if (!product) return;

    currentProductId = product.id;

    const colors = Array.isArray(product.colors)
        ? product.colors
        : [];

    const selectedColor =
        selectedColors[product.id] || colors[0] || "";

    const styleOptions = colors.length ? colors : ["Standard"];

    document.getElementById("productDetails").innerHTML = `
        <div class="product-details">

            <div class="detail-art">
                ${imageMarkup(product)}
            </div>

            <div class="detail-copy">

                <p class="eyebrow">
                    ${escapeHTML(product.category).toUpperCase()}
                </p>

                <h2>${escapeHTML(product.name)}</h2>

                <div class="detail-price">
                    ${formatPrice(product.price)}
                </div>

                <p>${escapeHTML(product.description)}</p>

                <fieldset class="style-picker">
                    <legend>CHOOSE YOUR STYLE</legend>
                    <div class="style-options">
                        ${styleOptions.map(color => `
                            <button
                                type="button"
                                class="style-option ${color === selectedColor ? "selected" : ""}"
                                data-product-style="${product.id}"
                                data-style-color="${escapeHTML(color)}"
                                aria-pressed="${color === selectedColor}"
                            >
                                <span
                                    class="style-swatch"
                                    style="background:${getColorCode(color)}"
                                    aria-hidden="true"
                                ></span>
                                <span>${escapeHTML(color)}</span>
                            </button>
                        `).join("")}
                    </div>
                </fieldset>
                <p class="selected-style">Selected: <span id="selectedStyle">${escapeHTML(selectedColor || "Standard")}</span></p>

                <button
                    class="button button-dark full-width"
                    id="addFromDetails"
                    type="button"
                >
                    ADD TO BAG \u2014 ${formatPrice(product.price)}
                </button>

            </div>

        </div>
    `;

    const productDialog = document.getElementById("productDialog");

    if (!productDialog.open) {
        productDialog.showModal();
    }

    document.getElementById("addFromDetails").addEventListener("click", () => {
        const color = selectedColors[product.id] || styleOptions[0];

        selectedColors[product.id] = color;

        addToCart(product.id, color);

        document.getElementById("productDialog").close();
    });
}

document.getElementById("productDetails").addEventListener("click", event => {
    const styleOption = event.target.closest("[data-product-style]");

    if (styleOption) {
        const productId = Number(styleOption.dataset.productStyle);
        const color = styleOption.dataset.styleColor;

        selectedColors[productId] = color;
        document.querySelectorAll("[data-product-style]").forEach(option => {
            const isSelected = option === styleOption;
            option.classList.toggle("selected", isSelected);
            option.setAttribute("aria-pressed", String(isSelected));
        });
        document.getElementById("selectedStyle").textContent = color;
    }
});


// ==================================================
// SHOPPING CART
// ==================================================

function addToCart(id, chosenColor) {
    const product = getProduct(id);

    if (!product) return;

    const color =
        chosenColor ||
        selectedColors[id] ||
        (product.colors && product.colors[0]) ||
        "Default";

    const existingItem = cart.find(item =>
        item.id === product.id &&
        item.color === color
    );

    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            id: product.id,
            color: color,
            quantity: 1
        });
    }

    saveCart();
    updateCart();

    const cartCount = document.getElementById("cartCount");

    cartCount.animate(
        [
            { transform: "scale(1)" },
            { transform: "scale(1.25)" },
            { transform: "scale(1)" }
        ],
        { duration: 250 }
    );
}

function updateCart() {
    const validCart = cart.filter(item => {
        return getProduct(item.id) &&
            Number.isFinite(Number(item.quantity)) &&
            Number(item.quantity) > 0;
    });

    cart = validCart;

    saveCart();

    const totalQuantity = cart.reduce(
        (sum, item) => sum + Number(item.quantity),
        0
    );

    document.getElementById("cartCount").textContent = totalQuantity;

    const totalPrice = cart.reduce((sum, item) => {
        const product = getProduct(item.id);

        return sum + product.price * item.quantity;
    }, 0);

    document.getElementById("cartSubtotal").textContent = formatPrice(totalPrice);
    document.getElementById("cartShipping").textContent = formatPrice(MIN_SHIPPING_FEE);
    document.getElementById("cartTotal").textContent =
        formatPrice(totalPrice + MIN_SHIPPING_FEE);

    const cartItems = document.getElementById("cartItems");

    if (cart.length === 0) {
        cartItems.innerHTML = `
            <div class="empty-cart">
                <h3>Your bag is empty \u2661</h3>
                <p>Find something cute for your everyday ayos!</p>
            </div>
        `;

        return;
    }

    cartItems.innerHTML = cart.map(item => {
        const product = getProduct(item.id);

        return `
            <div class="cart-row">

                <div class="cart-thumb">
                    ${imageMarkup(product)}
                </div>

                <div>
                    <h3>${escapeHTML(product.name)}</h3>

                    <p>
                        ${escapeHTML(item.color)} \u00B7
                        <span class="cart-item-price">${formatPrice(product.price)}</span>
                    </p>

                    <div class="quantity-controls">

                        <button
                            type="button"
                            data-quantity-id="${product.id}"
                            data-quantity-color="${escapeHTML(item.color)}"
                            data-change="-1"
                            aria-label="Decrease quantity"
                        >
                            \u2212
                        </button>

                        <span>${item.quantity}</span>

                        <button
                            type="button"
                            data-quantity-id="${product.id}"
                            data-quantity-color="${escapeHTML(item.color)}"
                            data-change="1"
                            aria-label="Increase quantity"
                        >
                            +
                        </button>

                    </div>
                </div>

                <button
                    type="button"
                    class="remove-item"
                    data-remove-id="${product.id}"
                    data-remove-color="${escapeHTML(item.color)}"
                >
                    Remove
                </button>

            </div>
        `;
    }).join("");
}

function updateCheckoutUrl(open) {
    const url = `${window.location.pathname}${window.location.search}`;

    if (open && window.location.hash !== CHECKOUT_HASH) {
        window.history.pushState({ checkout: true }, "", `${url}${CHECKOUT_HASH}`);
    } else if (!open && window.location.hash === CHECKOUT_HASH) {
        window.history.replaceState(null, "", url);
    }
}

function startCheckout(items, syncUrl = true) {
    checkoutItems = items.map(item => ({ ...item }));

    if (checkoutItems.length === 0) {
        alert("Your shopping bag is empty.");
        return;
    }

    renderCheckoutReview();
    showCheckoutStep("review");
    if (syncUrl) updateCheckoutUrl(true);
    document.getElementById("checkoutDialog").showModal();
}

function restoreCheckoutFromUrl() {
    if (window.location.hash !== CHECKOUT_HASH) return;

    if (cart.length > 0) {
        startCheckout(cart, false);
    } else {
        document.getElementById("cartDialog").showModal();
    }
}

function renderCheckoutReview() {
    const validItems = checkoutItems.filter(item => getProduct(item.id));
    checkoutItems = validItems;

    document.getElementById("checkoutReview").innerHTML = checkoutItems.map(item => {
        const product = getProduct(item.id);

        return `
            <div class="checkout-review-row">
                <div class="cart-thumb">${imageMarkup(product)}</div>
                <div>
                    <h4>${escapeHTML(product.name)}</h4>
                    <p>${escapeHTML(item.color)} \u00B7 Qty ${Number(item.quantity)}</p>
                </div>
                <strong>${formatPrice(product.price * Number(item.quantity))}</strong>
            </div>
        `;
    }).join("");

    const total = checkoutItems.reduce((sum, item) => {
        const product = getProduct(item.id);
        return sum + product.price * Number(item.quantity);
    }, 0);

    document.getElementById("checkoutSubtotal").textContent = formatPrice(total);
    document.getElementById("checkoutShipping").textContent = formatPrice(MIN_SHIPPING_FEE);
    document.getElementById("checkoutTotal").textContent =
        formatPrice(total + MIN_SHIPPING_FEE);
}

function showCheckoutStep(step) {
    document.querySelectorAll("[data-checkout-step]").forEach(section => {
        section.hidden = section.dataset.checkoutStep !== step;
    });

    document.querySelectorAll("[data-checkout-progress]").forEach(label => {
        label.classList.toggle(
            "active",
            label.dataset.checkoutProgress === step ||
            (step === "confirmation" && label.dataset.checkoutProgress === "payment")
        );
    });

    const titles = {
        review: "Checkout \u00B7 Review",
        customer: "Checkout \u00B7 Customer info",
        payment: "Checkout \u00B7 Payment",
        confirmation: "Order request"
    };

    document.getElementById("checkoutTitle").textContent = titles[step];
}

function updatePaymentNotice() {
    const paymentMethod = document.querySelector(
        'input[name="paymentMethod"]:checked'
    );
    const notice = document.getElementById("paymentNotice");

    if (paymentMethod && paymentMethod.value === "Cash on Delivery (COD)") {
        notice.textContent =
            "Cash on delivery availability is confirmed when we reply. No payment is collected on this website.";
    } else {
        notice.textContent =
            "This site does not process card or e-wallet payments. We will confirm payment instructions after confirming your order. Never email your card number or security code.";
    }
}

document.getElementById("cartItems").addEventListener("click", event => {
    const quantityButton = event.target.closest("[data-quantity-id]");

    if (quantityButton) {
        const id = Number(quantityButton.dataset.quantityId);
        const color = quantityButton.dataset.quantityColor;
        const change = Number(quantityButton.dataset.change);

        const item = cart.find(cartItem =>
            cartItem.id === id &&
            cartItem.color === color
        );

        if (item) {
            item.quantity += change;

            if (item.quantity <= 0) {
                cart = cart.filter(cartItem => cartItem !== item);
            }
        }

        updateCart();
        return;
    }

    const removeButton = event.target.closest("[data-remove-id]");

    if (removeButton) {
        const id = Number(removeButton.dataset.removeId);
        const color = removeButton.dataset.removeColor;

        cart = cart.filter(item =>
            !(item.id === id && item.color === color)
        );

        updateCart();
    }
});


// ==================================================
// PRODUCT GRID EVENTS
// ==================================================

document.getElementById("productGrid").addEventListener("click", event => {
    const buyNow = event.target.closest("[data-buy-now]");

    if (buyNow) {
        event.stopPropagation();

        const id = Number(buyNow.dataset.buyNow);
        const product = getProduct(id);

        if (product) {
            const color =
                selectedColors[id] ||
                (product.colors && product.colors[0]) ||
                "Default";

            startCheckout([{ id: product.id, color, quantity: 1 }]);
        }

        return;
    }

    const quickAdd = event.target.closest("[data-quick-add]");

    if (quickAdd) {
        event.stopPropagation();

        const id = Number(quickAdd.dataset.quickAdd);
        const product = getProduct(id);

        if (product) {
            const color =
                selectedColors[id] ||
                (product.colors && product.colors[0]) ||
                "Default";

            addToCart(id, color);
        }

        return;
    }

    const swatch = event.target.closest("[data-swatch-product]");

    if (swatch) {
        event.stopPropagation();

        const id = Number(swatch.dataset.swatchProduct);

        selectedColors[id] = swatch.dataset.swatchColor;

        renderProducts();
        return;
    }

    const productCard = event.target.closest("[data-open-product]");

    if (productCard) {
        openProduct(Number(productCard.dataset.openProduct));
    }
});

document.getElementById("productGrid").addEventListener("keydown", event => {
    const card = event.target.closest("[data-open-product]");

    if (
        card &&
        card === event.target &&
        (event.key === "Enter" || event.key === " ")
    ) {
        event.preventDefault();
        openProduct(Number(card.dataset.openProduct));
    }
});


// ==================================================
// SEARCH AND SORTING
// ==================================================

document.getElementById("searchToggle").addEventListener("click", () => {
    const container = document.getElementById("searchContainer");

    container.hidden = !container.hidden;

    if (!container.hidden) {
        document.getElementById("searchInput").focus();
    } else {
        document.getElementById("searchInput").value = "";
        renderProducts();
    }
});

document.getElementById("searchInput").addEventListener("input", renderProducts);

document.getElementById("clearSearch").addEventListener("click", () => {
    document.getElementById("searchInput").value = "";
    renderProducts();
});

document.getElementById("sortSelect").addEventListener("change", renderProducts);


// ==================================================
// OPEN AND CLOSE DIALOGS
// ==================================================

document.getElementById("cartToggle").addEventListener("click", () => {
    document.getElementById("cartDialog").showModal();
});

document.getElementById("closeCartDialog").addEventListener("click", () => {
    document.getElementById("cartDialog").close();
});

document.getElementById("closeProductDialog").addEventListener("click", () => {
    document.getElementById("productDialog").close();
});

document.getElementById("menuToggle").addEventListener("click", () => {
    const navigation = document.getElementById("navigation");
    const isOpen = navigation.classList.toggle("open");

    document.getElementById("menuToggle").setAttribute("aria-expanded", String(isOpen));
});

document.querySelectorAll("#navigation a:not([data-category])").forEach(link => {
    link.addEventListener("click", () => {
        document.getElementById("navigation").classList.remove("open");
        document.getElementById("menuToggle").setAttribute("aria-expanded", "false");
    });
});


// ==================================================
// ADMIN PRODUCT EDITOR
// ==================================================

function openAdmin() {
    renderAdminProducts();

    document.getElementById("adminDialog").showModal();
}

document.getElementById("adminToggle").addEventListener("click", openAdmin);

document.getElementById("closeAdminDialog").addEventListener("click", () => {
    document.getElementById("adminDialog").close();
});

function resetAdminForm() {
    document.getElementById("productForm").reset();
    document.getElementById("editProductId").value = "";
}

document.getElementById("resetProductForm").addEventListener("click", resetAdminForm);

function renderAdminProducts() {
    const list = document.getElementById("adminProductList");

    if (products.length === 0) {
        list.innerHTML = "<p>No products yet. Add your first product above.</p>";
        return;
    }

    list.innerHTML = products.map(product => `
        <div class="admin-product-row">

            <div>
                <strong>${escapeHTML(product.name)}</strong>
                <small>${formatPrice(product.price)} \u00B7 ${escapeHTML(product.category)}</small>
            </div>

            <button
                type="button"
                data-edit-product="${product.id}"
            >
                Edit
            </button>

            <button
                type="button"
                data-delete-product="${product.id}"
            >
                Delete
            </button>

        </div>
    `).join("");
}

document.getElementById("adminProductList").addEventListener("click", event => {
    const editButton = event.target.closest("[data-edit-product]");

    if (editButton) {
        const product = getProduct(Number(editButton.dataset.editProduct));

        if (!product) return;

        document.getElementById("editProductId").value = product.id;
        document.getElementById("adminName").value = product.name;
        document.getElementById("adminPrice").value = product.price;
        document.getElementById("adminCategory").value = product.category;
        document.getElementById("adminDescription").value = product.description;
        document.getElementById("adminImage").value = product.image || "";
        document.getElementById("adminColors").value =
            (product.colors || []).join(", ");

        document.getElementById("productForm").scrollIntoView({
            behavior: "smooth",
            block: "start"
        });

        return;
    }

    const deleteButton = event.target.closest("[data-delete-product]");

    if (deleteButton) {
        const id = Number(deleteButton.dataset.deleteProduct);
        const product = getProduct(id);

        if (!product) return;

        const confirmed = confirm(
            `Are you sure you want to delete "${product.name}"?`
        );

        if (!confirmed) return;

        products = products.filter(item => item.id !== id);

        cart = cart.filter(item => item.id !== id);

        if (saveProducts()) {
            saveCart();
            renderProducts();
            renderHeroGallery();
            renderAdminProducts();
            updateCart();
            resetAdminForm();
        }
    }
});

document.getElementById("productForm").addEventListener("submit", event => {
    event.preventDefault();

    const idValue = document.getElementById("editProductId").value;
    const name = document.getElementById("adminName").value.trim();
    const price = Number(document.getElementById("adminPrice").value);
    const category = document.getElementById("adminCategory").value;
    const description = document.getElementById("adminDescription").value.trim();
    const image = document.getElementById("adminImage").value.trim();

    const colors = document.getElementById("adminColors").value
        .split(",")
        .map(color => color.trim())
        .filter(Boolean);

    if (!name || !description || !Number.isFinite(price) || price < 0 || colors.length === 0) {
        alert("Please enter a valid name, price, description, and at least one color.");
        return;
    }

    const editingId = idValue ? Number(idValue) : null;

    if (editingId !== null) {
        const index = products.findIndex(product => product.id === editingId);

        if (index === -1) {
            alert("That product could not be found. Please refresh and try again.");
            return;
        }

        products[index] = {
            ...products[index],
            name,
            price,
            category,
            description,
            image,
            colors
        };
    } else {
        const newId = products.length
            ? Math.max(...products.map(product => Number(product.id) || 0)) + 1
            : 1;

        products.push({
            id: newId,
            name,
            price,
            category,
            description,
            image,
            colors,
            emoji: "\u{1F380}",
            badge: "NEW"
        });
    }

    if (saveProducts()) {
        renderProducts();
        renderHeroGallery();
        renderAdminProducts();
        updateCart();
        resetAdminForm();

        alert("Product saved successfully!");
    }
});


// ==================================================
// CHECKOUT
// ==================================================

document.getElementById("checkoutButton").addEventListener("click", () => {
    if (cart.length === 0) {
        alert("Your shopping bag is empty.");
        return;
    }

    document.getElementById("cartDialog").close();
    startCheckout(cart);
});

document.querySelectorAll("[data-checkout-next]").forEach(button => {
    button.addEventListener("click", () => {
        showCheckoutStep(button.dataset.checkoutNext);
    });
});

document.querySelectorAll("[data-checkout-back]").forEach(button => {
    button.addEventListener("click", () => {
        showCheckoutStep(button.dataset.checkoutBack);
    });
});

document.getElementById("backToBag").addEventListener("click", () => {
    document.getElementById("checkoutDialog").close();
    document.getElementById("cartDialog").showModal();
});

document.getElementById("continueToPayment").addEventListener("click", () => {
    const form = document.getElementById("customerInfoForm");

    if (form.reportValidity()) {
        showCheckoutStep("payment");
    }
});

document.getElementById("emailOrderRequest").addEventListener("click", () => {
    const form = document.getElementById("customerInfoForm");
    const customerName = form.elements.customerName.value.trim();
    const paymentMethod = document.querySelector(
        'input[name="paymentMethod"]:checked'
    );

    if (!form.reportValidity() || !customerName || !paymentMethod || checkoutItems.length === 0) {
        alert("Please complete the checkout details.");
        return;
    }

    const orderTotal = checkoutItems.reduce((sum, item) => {
        const product = getProduct(item.id);
        return sum + product.price * Number(item.quantity);
    }, 0);
    const emailLines = [
        "Hello Liray Tali,",
        "",
        "I'd like to request the following order:",
        ...checkoutItems.map(item => {
            const product = getProduct(item.id);
            return `- ${product.name} (${item.color}) x ${Number(item.quantity)} \u2014 ${formatPrice(product.price * Number(item.quantity))}`;
        }),
        "",
        `Items subtotal: ${formatPrice(orderTotal)}`,
        `Shipping minimum: ${formatPrice(MIN_SHIPPING_FEE)}`,
        `Estimated order total minimum: ${formatPrice(orderTotal + MIN_SHIPPING_FEE)}`,
        `Preferred payment method: ${paymentMethod.value}`,
        "",
        "Customer details:",
        `Name: ${customerName}`,
        `Email: ${form.elements.customerEmail.value.trim()}`,
        `Mobile: ${form.elements.customerPhone.value.trim()}`,
        `Address: ${form.elements.customerAddress.value.trim()}, ${form.elements.customerCity.value.trim()}, ${form.elements.customerProvince.value.trim()} ${form.elements.customerPostalCode.value.trim()}`,
        `Delivery instructions: ${form.elements.deliveryNotes.value.trim() || "None"}`,
        "",
        "Please confirm availability, the final shipping fee based on the delivery address, and payment instructions."
    ];
    const mailto = `mailto:${ORDER_EMAIL}?subject=${encodeURIComponent("Liray Tali order request")}&body=${encodeURIComponent(emailLines.join("\n"))}`;

    document.getElementById("confirmationName").textContent = customerName;
    document.getElementById("confirmationSummary").textContent =
        `${checkoutItems.reduce((sum, item) => sum + Number(item.quantity), 0)} item(s) \u00B7 ` +
        `${formatPrice(orderTotal + MIN_SHIPPING_FEE)} estimated minimum total \u00B7 ${paymentMethod.value}`;
    showCheckoutStep("confirmation");
    window.location.href = mailto;
});

document.querySelectorAll('input[name="paymentMethod"]').forEach(input => {
    input.addEventListener("change", updatePaymentNotice);
});

document.getElementById("closeCheckoutDialog").addEventListener("click", () => {
    document.getElementById("checkoutDialog").close();
});

document.getElementById("finishCheckout").addEventListener("click", () => {
    document.getElementById("checkoutDialog").close();
});

document.getElementById("checkoutDialog").addEventListener("close", () => {
    updateCheckoutUrl(false);
    document.getElementById("customerInfoForm").reset();
    updatePaymentNotice();
    checkoutItems = [];
});

window.addEventListener("popstate", () => {
    const checkoutDialog = document.getElementById("checkoutDialog");

    if (window.location.hash === CHECKOUT_HASH) {
        restoreCheckoutFromUrl();
    } else if (checkoutDialog.open) {
        checkoutDialog.close();
    }
});


// ==================================================
// START WEBSITE
// ==================================================

document.getElementById("currentYear").textContent =
    new Date().getFullYear();

renderProducts();
renderHeroGallery();
updateCart();
restoreCheckoutFromUrl();
