/* ==============================
   NIKON STORE — script.js
   ============================== */

// ── DATA ─────────────────────────────────────────────
const products = [
  {
    id: 1, category: "mirrorless", name: "Nikon Z9",
    desc: "Flagship full-frame mirrorless with 45.7MP stacked CMOS and 8K video.",
    price: 456995, oldPrice: null, rating: 5, reviews: 312,
    badge: "hot", image: "images/z9_flagship.png",
    specs: { Sensor:"45.7MP Full-Frame Stacked CMOS", Video:"8K/60p RAW", Burst:"120fps", AF:"693-point Deep Learning", Weight:"1340g", Mount:"Nikon Z" }
  },
  {
    id: 2, category: "dslr", name: "Nikon D850",
    desc: "45.7MP full-frame DSLR with exceptional dynamic range for landscapes and studio work.",
    price: 232995, oldPrice: 274995, rating: 5, reviews: 894,
    badge: "sale", image: "images/d850_camera.png",
    specs: { Sensor:"45.7MP Full-Frame BSI CMOS", Video:"4K UHD", Burst:"9fps", AF:"153-point Multi-CAM 20K", Weight:"1005g", Mount:"Nikon F" }
  },
  {
    id: 3, category: "mirrorless", name: "Nikon Z50",
    desc: "Compact APS-C mirrorless perfect for travel, vlogging, and everyday adventures.",
    price: 71995, oldPrice: null, rating: 4, reviews: 456,
    badge: "new", image: "images/z50_camera.png",
    specs: { Sensor:"20.9MP APS-C CMOS", Video:"4K UHD", Burst:"11fps", AF:"209-point Hybrid AF", Weight:"395g", Mount:"Nikon Z" }
  },
  {
    id: 4, category: "mirrorless", name: "Nikon Z8",
    desc: "Professional full-frame mirrorless combining Z9 power in a compact body.",
    price: 331995, oldPrice: null, rating: 5, reviews: 178,
    badge: "new", image: "images/z9_flagship.png",
    specs: { Sensor:"45.7MP Full-Frame Stacked CMOS", Video:"8K/60p RAW", Burst:"20fps", AF:"493-point Deep Learning", Weight:"820g", Mount:"Nikon Z" }
  },
  {
    id: 5, category: "dslr", name: "Nikon D7500",
    desc: "Advanced APS-C DSLR with pro-grade features for enthusiast photographers.",
    price: 82995, oldPrice: 103995, rating: 4, reviews: 732,
    badge: "sale", image: "images/d850_camera.png",
    specs: { Sensor:"20.9MP APS-C CMOS", Video:"4K UHD", Burst:"8fps", AF:"51-point Multi-CAM 3500 II", Weight:"720g", Mount:"Nikon F" }
  },
  {
    id: 6, category: "compact", name: "Nikon COOLPIX P1000",
    desc: "Superzoom compact with an incredible 125x optical zoom for wildlife and astronomy.",
    price: 82995, oldPrice: null, rating: 4, reviews: 567,
    badge: null, image: "images/z50_camera.png",
    specs: { Sensor:"16MP 1/2.3\" CMOS", Video:"4K UHD", Burst:"7fps", Zoom:"125x Optical", Weight:"1415g", Mount:"Fixed" }
  }
];

const lensProducts = [
  { id: 101, name: "NIKKOR Z 50mm f/1.8 S", spec: "Standard Prime | Full Frame", price: 49495, image: "images/lens_collection.png" },
  { id: 102, name: "NIKKOR Z 24-70mm f/2.8 S", spec: "Standard Zoom | Full Frame", price: 190995, image: "images/lens_collection.png" },
  { id: 103, name: "NIKKOR Z 70-200mm f/2.8 VR S", spec: "Telephoto Zoom | Full Frame", price: 215995, image: "images/lens_collection.png" },
  { id: 104, name: "NIKKOR Z 14-30mm f/4 S", spec: "Wide-Angle Zoom | Full Frame", price: 107995, image: "images/lens_collection.png" },
  { id: 105, name: "NIKKOR Z 85mm f/1.2 S", spec: "Portrait Prime | Full Frame", price: 232995, image: "images/lens_collection.png" }
];

// ── STATE ─────────────────────────────────────────────
let cart = JSON.parse(localStorage.getItem("nikonCart") || "[]");
let wishlist = new Set(JSON.parse(localStorage.getItem("nikonWishlist") || "[]"));
let currentFilter = "all";
let currentSort = "default";
let testimonialIndex = 0;
let testimonialInterval;

// ── INIT ─────────────────────────────────────────────
document.addEventListener("DOMContentLoaded", () => {
  renderProducts();
  renderLenses();
  renderCart();
  updateCartCount();
  initParticles();
  initNavbar();
  initIntersectionObserver();
  initTestimonialDots();
  startTestimonialAuto();
  animateStats();
  initSmoothScrollNav();
});

// ── NAVBAR ────────────────────────────────────────────
function initNavbar() {
  const navbar = document.getElementById("navbar");
  const hamburger = document.getElementById("hamburger");
  const navLinks = document.getElementById("nav-links");

  window.addEventListener("scroll", () => {
    if (window.scrollY > 40) navbar.classList.add("scrolled");
    else navbar.classList.remove("scrolled");

    const scrollTopBtn = document.getElementById("scroll-top-btn");
    if (window.scrollY > 400) scrollTopBtn.classList.add("visible");
    else scrollTopBtn.classList.remove("visible");
  });

  hamburger.addEventListener("click", () => {
    navLinks.classList.toggle("open");
    const spans = hamburger.querySelectorAll("span");
    spans[0].style.transform = navLinks.classList.contains("open") ? "rotate(45deg) translate(5px,5px)" : "";
    spans[1].style.opacity = navLinks.classList.contains("open") ? "0" : "1";
    spans[2].style.transform = navLinks.classList.contains("open") ? "rotate(-45deg) translate(5px,-5px)" : "";
  });

  navLinks.querySelectorAll(".nav-link").forEach(link => {
    link.addEventListener("click", () => {
      navLinks.classList.remove("open");
    });
  });
}

function initSmoothScrollNav() {
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener("click", e => {
      const target = document.querySelector(a.getAttribute("href"));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    });
  });

  // Active nav highlight on scroll
  const sections = ["home","products","lenses","features","testimonials","contact"];
  window.addEventListener("scroll", () => {
    let current = "";
    sections.forEach(id => {
      const el = document.getElementById(id);
      if (el && window.scrollY >= el.offsetTop - 120) current = id;
    });
    document.querySelectorAll(".nav-link").forEach(link => {
      link.classList.toggle("active", link.dataset.nav === current);
    });
  });
}

// ── SEARCH ────────────────────────────────────────────
document.getElementById("search-btn").addEventListener("click", openSearch);
document.getElementById("search-close").addEventListener("click", closeSearch);
document.getElementById("search-input").addEventListener("input", handleSearch);

document.addEventListener("keydown", e => {
  if (e.key === "Escape") { closeSearch(); closeModal(); closeCart(); }
});

function openSearch() {
  document.getElementById("search-overlay").classList.add("active");
  setTimeout(() => document.getElementById("search-input").focus(), 300);
}
function closeSearch() {
  document.getElementById("search-overlay").classList.remove("active");
  document.getElementById("search-input").value = "";
  document.getElementById("search-results").innerHTML = "";
}
function handleSearch(e) {
  const q = e.target.value.toLowerCase().trim();
  const resultsEl = document.getElementById("search-results");
  if (!q) { resultsEl.innerHTML = ""; return; }
  const matches = [...products, ...lensProducts].filter(p => p.name.toLowerCase().includes(q) || (p.desc || p.spec || "").toLowerCase().includes(q));
  resultsEl.innerHTML = matches.length
    ? matches.map(p => `
        <div class="search-result-item" onclick="handleSearchSelect(${p.id})">
          <img src="${p.image}" alt="${p.name}" style="width:44px;height:44px;object-fit:contain;background:var(--dark3);border-radius:8px;padding:4px;">
          <div>
            <strong>${p.name}</strong><br>
            <span>&#8377;${(p.price).toLocaleString('en-IN')}</span>
          </div>
        </div>`).join("")
    : `<div style="color:var(--gray2);font-size:14px;padding:12px;">No results found for "<strong style="color:var(--white)">${q}</strong>"</div>`;
}
function handleSearchSelect(id) {
  closeSearch();
  const product = products.find(p => p.id === id);
  if (product) { openProductModal(id); }
  else {
    document.getElementById("lenses").scrollIntoView({ behavior: "smooth" });
  }
}

// ── PARTICLES ─────────────────────────────────────────
function initParticles() {
  const container = document.getElementById("hero-particles");
  for (let i = 0; i < 28; i++) {
    const p = document.createElement("div");
    p.className = "particle";
    p.style.left = Math.random() * 100 + "%";
    p.style.animationDuration = (6 + Math.random() * 14) + "s";
    p.style.animationDelay = (Math.random() * 12) + "s";
    p.style.width = p.style.height = (1 + Math.random() * 3) + "px";
    p.style.opacity = (0.2 + Math.random() * 0.6).toString();
    container.appendChild(p);
  }
}

// ── PRODUCTS ──────────────────────────────────────────
function renderProducts(filter = currentFilter, sort = currentSort) {
  let list = filter === "all" ? [...products] : products.filter(p => p.category === filter);
  if (sort === "price-asc") list.sort((a,b) => a.price - b.price);
  else if (sort === "price-desc") list.sort((a,b) => b.price - a.price);
  else if (sort === "name-asc") list.sort((a,b) => a.name.localeCompare(b.name));

  const grid = document.getElementById("products-grid");
  grid.innerHTML = list.length ? list.map(productCard).join("") : `<div style="color:var(--gray2);grid-column:1/-1;text-align:center;padding:60px;">No products found.</div>`;
}

function productCard(p) {
  const stars = "★".repeat(p.rating) + "☆".repeat(5 - p.rating);
  const inWishlist = wishlist.has(p.id);
  return `
    <div class="product-card reveal" id="product-${p.id}">
      ${p.badge ? `<span class="product-badge badge-${p.badge}">${p.badge}</span>` : ""}
      <div class="product-image-wrap" onclick="openProductModal(${p.id})" style="cursor:pointer;">
        <img src="${p.image}" alt="${p.name}" loading="lazy" />
      </div>
      <div class="product-info">
        <div class="product-category">${p.category.toUpperCase()}</div>
        <div class="product-name">${p.name}</div>
        <div class="product-desc">${p.desc}</div>
        <div class="product-rating">
          <span class="stars">${stars}</span>
          <span class="rating-count">(${p.reviews})</span>
        </div>
        <div class="product-footer">
          <div class="product-price">
            ${p.oldPrice ? `<span class="price-old">&#8377;${p.oldPrice.toLocaleString('en-IN')}</span>` : ""}
            <span class="price-current">&#8377;${p.price.toLocaleString('en-IN')}</span>
          </div>
          <div class="product-actions">
            <button class="btn-add-cart" onclick="addToCartById(${p.id})" id="add-cart-${p.id}">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 01-8 0"/></svg>
              Add
            </button>
            <button class="btn-wishlist ${inWishlist?"active":""}" onclick="toggleWishlist(${p.id})" id="wishlist-${p.id}" aria-label="Wishlist">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="${inWishlist?"currentColor":"none"}" stroke="currentColor" stroke-width="2"><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/></svg>
            </button>
          </div>
        </div>
      </div>
    </div>`;
}

function filterProducts(cat) {
  currentFilter = cat;
  document.querySelectorAll(".filter-btn").forEach(b => b.classList.remove("active"));
  document.getElementById("filter-" + cat).classList.add("active");
  renderProducts();
  reinitReveal();
}

function filterCategory(cat) {
  if (cat === "lenses") {
    document.getElementById("lenses").scrollIntoView({ behavior: "smooth" });
    return;
  }
  const map = { mirrorless: "mirrorless", dslr: "dslr", accessories: "compact" };
  filterProducts(map[cat] || "all");
  document.getElementById("products").scrollIntoView({ behavior: "smooth" });
}

function sortProducts(val) {
  currentSort = val;
  renderProducts();
  reinitReveal();
}

// ── LENSES ────────────────────────────────────────────
function renderLenses() {
  const grid = document.getElementById("lenses-grid");
  grid.innerHTML = lensProducts.map(l => `
    <div class="lens-card reveal">
      <div class="lens-img-wrap">
        <img src="${l.image}" alt="${l.name}" loading="lazy" />
      </div>
      <div class="lens-info">
        <div class="lens-name">${l.name}</div>
        <div class="lens-spec">${l.spec}</div>
        <div class="lens-price">&#8377;${l.price.toLocaleString('en-IN')}</div>
      </div>
      <button class="lens-add-btn" onclick="addLensToCart(${l.id})" id="lens-add-${l.id}" aria-label="Add to cart">+</button>
    </div>`).join("");
}

function addLensToCart(id) {
  const lens = lensProducts.find(l => l.id === id);
  if (!lens) return;
  const cartItem = { id: lens.id, name: lens.name, price: lens.price, image: lens.image, qty: 1 };
  addItemToCart(cartItem);
}

// ── CART ──────────────────────────────────────────────
document.getElementById("cart-btn").addEventListener("click", openCart);

function openCart() {
  document.getElementById("cart-sidebar").classList.add("active");
  document.getElementById("cart-overlay").classList.add("active");
  document.body.style.overflow = "hidden";
}
function closeCart() {
  document.getElementById("cart-sidebar").classList.remove("active");
  document.getElementById("cart-overlay").classList.remove("active");
  document.body.style.overflow = "";
}

function addToCartById(id) {
  const product = products.find(p => p.id === id);
  if (!product) return;
  addItemToCart({ id: product.id, name: product.name, price: product.price, image: product.image, qty: 1 });
}

function addItemToCart(item) {
  const existing = cart.find(c => c.id === item.id);
  if (existing) {
    existing.qty++;
  } else {
    cart.push({ ...item });
  }
  saveCart();
  renderCart();
  updateCartCount();
  showToast("success", "✓", `${item.name} added to cart!`);
  openCart();
}

function removeFromCart(id) {
  cart = cart.filter(c => c.id !== id);
  saveCart();
  renderCart();
  updateCartCount();
}

function updateQty(id, delta) {
  const item = cart.find(c => c.id === id);
  if (!item) return;
  item.qty = Math.max(1, item.qty + delta);
  saveCart();
  renderCart();
  updateCartCount();
}

function saveCart() {
  localStorage.setItem("nikonCart", JSON.stringify(cart));
}

function renderCart() {
  const itemsEl  = document.getElementById("cart-items");
  const footerEl = document.getElementById("cart-footer");

  if (!cart.length) {
    itemsEl.innerHTML = `
      <div class="cart-empty">
        <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1">
          <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/>
          <line x1="3" y1="6" x2="21" y2="6"/>
          <path d="M16 10a4 4 0 01-8 0"/>
        </svg>
        <p>Your cart is empty</p>
        <button class="btn btn-primary" onclick="closeCart()" id="continue-shopping-btn">Continue Shopping</button>
      </div>`;
    footerEl.style.display = "none";
    return;
  }

  itemsEl.innerHTML = cart.map(item => `
    <div class="cart-item" id="cart-item-${item.id}">
      <img class="cart-item-img" src="${item.image}" alt="${item.name}" />
      <div class="cart-item-info">
        <div class="cart-item-name">${item.name}</div>
        <div class="cart-item-unit-price">&#8377;${item.price.toLocaleString('en-IN')} each</div>
        <div class="cart-item-price">&#8377;${(item.price * item.qty).toLocaleString('en-IN')}</div>
        <div class="cart-item-qty">
          <button class="qty-btn" onclick="updateQty(${item.id}, -1)" aria-label="Decrease">−</button>
          <span class="qty-num">${item.qty}</span>
          <button class="qty-btn" onclick="updateQty(${item.id}, 1)" aria-label="Increase">+</button>
        </div>
      </div>
      <button class="cart-item-remove" onclick="removeFromCart(${item.id})" aria-label="Remove item">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <polyline points="3,6 5,6 21,6"/>
          <path d="M19,6l-1,14a2,2,0,0,1-2,2H8a2,2,0,0,1-2-2L5,6"/>
          <path d="M10,11v6M14,11v6"/><path d="M9,6V4h6v2"/>
        </svg>
      </button>
    </div>`).join("");

  const subtotal = cart.reduce((s, c) => s + c.price * c.qty, 0);
  const shipping  = subtotal >= 42000 ? 0 : 2499;
  const total     = subtotal + shipping;

  document.getElementById("cart-subtotal").textContent = "₹" + subtotal.toLocaleString('en-IN');
  document.getElementById("cart-shipping").textContent = shipping === 0 ? "FREE" : "₹" + shipping.toLocaleString('en-IN');
  document.getElementById("cart-total").textContent    = "₹" + total.toLocaleString('en-IN');

  footerEl.style.display = "flex";
  footerEl.style.flexDirection = "column";
}

function updateCartCount() {
  const count = cart.reduce((s, c) => s + c.qty, 0);
  document.getElementById("cart-count").textContent = count;
}

function handleCheckout() {
  showToast("success", "🛒", "Redirecting to checkout...");
  setTimeout(() => {
    closeCart();
    showToast("success", "✓", "Order placed! Thank you for your purchase.");
    cart = [];
    saveCart();
    renderCart();
    updateCartCount();
  }, 1800);
}

// ── WISHLIST ──────────────────────────────────────────
function toggleWishlist(id) {
  if (wishlist.has(id)) {
    wishlist.delete(id);
    showToast("error", "♡", "Removed from wishlist");
  } else {
    wishlist.add(id);
    showToast("success", "♥", "Added to wishlist!");
  }
  localStorage.setItem("nikonWishlist", JSON.stringify([...wishlist]));
  // Re-render just the button
  const btn = document.getElementById("wishlist-" + id);
  if (btn) {
    const isActive = wishlist.has(id);
    btn.classList.toggle("active", isActive);
    btn.innerHTML = `<svg width="16" height="16" viewBox="0 0 24 24" fill="${isActive?"currentColor":"none"}" stroke="currentColor" stroke-width="2"><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/></svg>`;
  }
}

// ── PRODUCT MODAL ─────────────────────────────────────
function openProductModal(id) {
  const product = products.find(p => p.id === id);
  if (!product) return;
  const stars = "★".repeat(product.rating) + "☆".repeat(5 - product.rating);
  const specsHtml = Object.entries(product.specs).map(([k,v]) =>
    `<div class="modal-spec-item"><span>${k}</span><span>${v}</span></div>`).join("");

  document.getElementById("modal-content").innerHTML = `
    <div class="modal-img-col">
      <img src="${product.image}" alt="${product.name}" />
    </div>
    <div class="modal-info-col">
      <div class="modal-category">${product.category}</div>
      <div class="modal-name">${product.name}</div>
      <div class="modal-rating">
        <span style="color:var(--gold)">${stars}</span>
        <span>(${product.reviews} reviews)</span>
      </div>
      <div class="modal-desc">${product.desc}</div>
      <div class="modal-specs">${specsHtml}</div>
      <div class="modal-price">&#8377;${product.price.toLocaleString('en-IN')}</div>
      <div class="modal-actions">
        <button class="btn btn-primary" onclick="addToCartById(${product.id})" id="modal-add-cart-${product.id}">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 01-8 0"/></svg>
          Add to Cart
        </button>
        <button class="btn btn-outline" onclick="closeModal()" id="modal-close-inner">Close</button>
      </div>
    </div>`;

  document.getElementById("modal-overlay").classList.add("active");
  document.getElementById("product-modal").classList.add("active");
  document.body.style.overflow = "hidden";
}

function closeModal() {
  document.getElementById("modal-overlay").classList.remove("active");
  document.getElementById("product-modal").classList.remove("active");
  document.body.style.overflow = "";
}

// ── TESTIMONIALS ──────────────────────────────────────
function initTestimonialDots() {
  const total = document.querySelectorAll(".testimonial-card").length;
  const dotsEl = document.getElementById("testimonial-dots");
  dotsEl.innerHTML = Array.from({length:total}, (_,i) =>
    `<span class="testimonial-dot ${i===0?"active":""}" onclick="goToTestimonial(${i})" aria-label="Slide ${i+1}"></span>`).join("");
}

function slideTestimonial(dir) {
  const total = document.querySelectorAll(".testimonial-card").length;
  testimonialIndex = (testimonialIndex + dir + total) % total;
  updateTestimonial();
}

function goToTestimonial(idx) {
  testimonialIndex = idx;
  updateTestimonial();
  clearInterval(testimonialInterval);
  startTestimonialAuto();
}

function updateTestimonial() {
  document.getElementById("testimonials-track").style.transform = `translateX(-${testimonialIndex * 100}%)`;
  document.querySelectorAll(".testimonial-dot").forEach((d,i) => d.classList.toggle("active", i === testimonialIndex));
}

function startTestimonialAuto() {
  testimonialInterval = setInterval(() => slideTestimonial(1), 5000);
}

// ── NEWSLETTER ────────────────────────────────────────
function handleNewsletterSubmit(e) {
  e.preventDefault();
  const email = document.getElementById("newsletter-email").value;
  showToast("success", "✓", `Subscribed! Welcome to Nikon community.`);
  document.getElementById("newsletter-email").value = "";
}

// ── CONTACT ───────────────────────────────────────────
function handleContactSubmit(e) {
  e.preventDefault();
  showToast("success", "✓", "Message sent! We'll get back to you soon.");
  e.target.reset();
}

// ── STATS COUNTER ─────────────────────────────────────
function animateStats() {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.querySelectorAll(".stat-number").forEach(el => {
          const target = parseInt(el.dataset.target);
          let current = 0;
          const step = target / 60;
          const interval = setInterval(() => {
            current = Math.min(current + step, target);
            el.textContent = Math.floor(current);
            if (current >= target) clearInterval(interval);
          }, 16);
        });
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });
  const heroStats = document.querySelector(".hero-stats");
  if (heroStats) observer.observe(heroStats);
}

// ── SCROLL REVEAL ─────────────────────────────────────
function initIntersectionObserver() {
  const revealObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });

  document.querySelectorAll(".reveal, .reveal-left, .reveal-right").forEach(el => {
    revealObserver.observe(el);
  });

  // Add reveal to section cards
  document.querySelectorAll(".category-card, .feature-card, .contact-item").forEach((el,i) => {
    el.classList.add("reveal");
    el.style.transitionDelay = (i * 0.1) + "s";
    revealObserver.observe(el);
  });
}

function reinitReveal() {
  setTimeout(() => {
    const revealObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });
    document.querySelectorAll(".reveal:not(.visible)").forEach(el => revealObserver.observe(el));
  }, 50);
}

// ── TOAST ─────────────────────────────────────────────
function showToast(type, icon, message) {
  const container = document.getElementById("toast-container");
  const toast = document.createElement("div");
  toast.className = `toast toast-${type}`;
  toast.innerHTML = `
    <div class="toast-icon">${icon}</div>
    <div class="toast-text">${message}</div>`;
  container.appendChild(toast);
  setTimeout(() => {
    toast.style.opacity = "0";
    toast.style.transform = "translateX(20px)";
    toast.style.transition = "all 0.3s";
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}

// ── SCROLL TO TOP ─────────────────────────────────────
function scrollToTop() {
  window.scrollTo({ top: 0, behavior: "smooth" });
}

// ── PARALLAX (subtle) ─────────────────────────────────
window.addEventListener("scroll", () => {
  const hero = document.querySelector(".hero-camera-img");
  if (hero) {
    const scrollY = window.scrollY;
    hero.style.transform = `translateY(${scrollY * 0.04}px)`;
  }
});
