/**
 * GrainMaster Agro Solutions Ltd. (RC9167936)
 * Main Interactive Application Script
 * Kano, Nigeria | +2349032326937
 */

document.addEventListener("DOMContentLoaded", () => {
  // State
  let cart = JSON.parse(localStorage.getItem("grainmaster_cart")) || [];
  let currentFilter = "all";
  let searchQuery = "";
  let currentModalProduct = null;

  // DOM Elements
  const cartTriggerBtn = document.getElementById("cartTriggerBtn");
  const cartDrawer = document.getElementById("cartDrawer");
  const cartOverlay = document.getElementById("cartOverlay");
  const cartCloseBtn = document.getElementById("cartCloseBtn");
  const cartItemsContainer = document.getElementById("cartItemsContainer");
  const cartCountBadges = document.querySelectorAll(".cart-badge");
  const cartSubtotalEl = document.getElementById("cartSubtotalAmount");
  const btnWhatsAppCheckout = document.getElementById("btnWhatsAppCheckout");
  const btnManualInvoice = document.getElementById("btnManualInvoice");

  const productModal = document.getElementById("productModal");
  const modalCloseBtn = document.getElementById("modalCloseBtn");
  const fabContainer = document.getElementById("fabContainer");
  const fabToggleBtn = document.getElementById("fabToggleBtn");

  const headerSearchInput = document.getElementById("headerSearchInput");
  const searchForm = document.getElementById("searchForm");
  const categoryNav = document.getElementById("categoryNav");
  const toastNotice = document.getElementById("toastNotice");

  // Format Naira Currency
  const formatNaira = (num) => {
    return "₦" + Number(num).toLocaleString("en-NG");
  };

  // Show Toast
  const showToast = (message, icon = "fa-check-circle") => {
    if (!toastNotice) return;
    toastNotice.innerHTML = `<i class="fas ${icon}"></i> <span>${message}</span>`;
    toastNotice.classList.add("show");
    setTimeout(() => {
      toastNotice.classList.remove("show");
    }, 3000);
  };

  // --- CART MANAGEMENT ---
  const saveCart = () => {
    localStorage.setItem("grainmaster_cart", JSON.stringify(cart));
    updateCartUI();
  };

  const addToCart = (productId, quantity = 1) => {
    const product = PRODUCTS_DATA.find((p) => p.id === productId);
    if (!product) return;

    const existing = cart.find((item) => item.id === productId);
    if (existing) {
      existing.quantity += quantity;
    } else {
      cart.push({
        id: product.id,
        name: product.name,
        sku: product.sku,
        price: product.price,
        image: product.image,
        category: product.category,
        quantity: quantity,
      });
    }

    saveCart();
    showToast(`Added "${product.name}" to your order cart`);
  };

  const updateCartQuantity = (productId, delta) => {
    const item = cart.find((i) => i.id === productId);
    if (!item) return;

    item.quantity += delta;
    if (item.quantity <= 0) {
      cart = cart.filter((i) => i.id !== productId);
    }
    saveCart();
  };

  const removeFromCart = (productId) => {
    cart = cart.filter((i) => i.id !== productId);
    saveCart();
    showToast("Item removed from cart", "fa-trash-alt");
  };

  const updateCartUI = () => {
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    const subtotal = cart.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );

    cartCountBadges.forEach((badge) => {
      badge.textContent = totalItems;
    });

    if (cartSubtotalEl) {
      cartSubtotalEl.textContent = formatNaira(subtotal);
    }

    if (!cartItemsContainer) return;

    if (cart.length === 0) {
      cartItemsContainer.innerHTML = `
        <div class="cart-empty-state">
          <i class="fas fa-shopping-basket cart-empty-icon"></i>
          <h4>Your Order Cart is Empty</h4>
          <p>Browse our machines and spare parts catalog and add items for direct WhatsApp enquiry or manual invoice generation.</p>
        </div>
      `;
      if (btnWhatsAppCheckout) btnWhatsAppCheckout.disabled = true;
      return;
    }

    if (btnWhatsAppCheckout) btnWhatsAppCheckout.disabled = false;

    cartItemsContainer.innerHTML = cart
      .map(
        (item) => `
      <div class="cart-item-card">
        <div class="cart-item-img">
          <img src="${item.image}" alt="${item.name}" loading="lazy" />
        </div>
        <div class="cart-item-info">
          <h4 class="cart-item-title">${item.name}</h4>
          <div class="cart-item-price">${formatNaira(item.price)} × ${item.quantity} = <strong>${formatNaira(item.price * item.quantity)}</strong></div>
          <div class="cart-item-bottom">
            <div class="cart-mini-qty">
              <button class="cart-qty-btn" onclick="window.appUpdateCartQty('${item.id}', -1)" aria-label="Decrease quantity">-</button>
              <span>${item.quantity}</span>
              <button class="cart-qty-btn" onclick="window.appUpdateCartQty('${item.id}', 1)" aria-label="Increase quantity">+</button>
            </div>
            <button class="btn-remove-item" onclick="window.appRemoveCartItem('${item.id}')">
              <i class="fas fa-trash-alt"></i> Remove
            </button>
          </div>
        </div>
      </div>
    `
      )
      .join("");
  };

  // Expose cart helpers globally for inline onclick
  window.appUpdateCartQty = updateCartQuantity;
  window.appRemoveCartItem = removeFromCart;

  // Toggle Cart Drawer
  const openCart = () => {
    cartDrawer.classList.add("active");
    cartOverlay.classList.add("active");
    document.body.style.overflow = "hidden";
  };

  const closeCart = () => {
    cartDrawer.classList.remove("active");
    cartOverlay.classList.remove("active");
    document.body.style.overflow = "";
  };

  if (cartTriggerBtn) cartTriggerBtn.addEventListener("click", openCart);
  if (cartCloseBtn) cartCloseBtn.addEventListener("click", closeCart);
  if (cartOverlay) cartOverlay.addEventListener("click", closeCart);

  // --- WHATSAPP CHECKOUT GENERATOR ---
  if (btnWhatsAppCheckout) {
    btnWhatsAppCheckout.addEventListener("click", () => {
      if (cart.length === 0) {
        alert("Your cart is empty. Please add items to inquire.");
        return;
      }

      const custName = document.getElementById("custName")?.value.trim() || "Valued Customer";
      const custPhone = document.getElementById("custPhone")?.value.trim() || "Not provided";
      const custLocation = document.getElementById("custLocation")?.value.trim() || "Kano / Nationwide Delivery";
      const custOrderType = document.getElementById("custOrderType")?.value || "Purchase Order & Delivery";
      const custNotes = document.getElementById("custNotes")?.value.trim() || "None";

      const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

      let orderItemsText = "";
      cart.forEach((item, index) => {
        orderItemsText += `${index + 1}. *${item.name}*\n   - SKU: ${item.sku}\n   - Qty: ${item.quantity}\n   - Unit Price: ${formatNaira(item.price)}\n   - Total: ${formatNaira(item.price * item.quantity)}\n\n`;
      });

      const message = 
`🌾 *OFFICIAL ORDER / ENQUIRY - GRAINMASTER AGRO SOLUTIONS LTD.*
*Company RC:* RC9167936
*Showroom:* GF7, Helu Plaza, France Rd by Galadima, Kano Nigeria

📋 *CLIENT & DELIVERY DETAILS:*
• *Customer Name:* ${custName}
• *Phone / WhatsApp:* ${custPhone}
• *Delivery Destination:* ${custLocation}
• *Order Request Type:* ${custOrderType}
• *Special Notes:* ${custNotes}

📦 *ITEMS ORDERED / REQUESTED:*
${orderItemsText}
💰 *ESTIMATED TOTAL:* *${formatNaira(subtotal)}*
_(Excluding delivery / installation where applicable)_

📍 Please confirm stock availability at your Kano warehouse, payment details, and estimated dispatch time. Thank you!`;

      const encoded = encodeURIComponent(message);
      const whatsappUrl = `https://wa.me/2349032326937?text=${encoded}`;
      window.open(whatsappUrl, "_blank");
    });
  }

  // --- MANUAL OFFLINE INVOICE / PRINT ---
  if (btnManualInvoice) {
    btnManualInvoice.addEventListener("click", () => {
      if (cart.length === 0) {
        alert("Cart is empty.");
        return;
      }
      const custName = document.getElementById("custName")?.value.trim() || "Customer";
      const custLocation = document.getElementById("custLocation")?.value.trim() || "Kano / Nigeria";
      const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

      const printWindow = window.open("", "_blank");
      printWindow.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
          <title>GrainMaster Agro Solutions - Order Quotation</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 30px; color: #1e293b; }
            .header { border-bottom: 3px solid #0f5132; padding-bottom: 20px; margin-bottom: 25px; }
            .title { font-size: 24px; font-weight: bold; color: #0f5132; }
            .meta { font-size: 13px; color: #64748b; line-height: 1.5; }
            table { width: 100%; border-collapse: collapse; margin: 25px 0; }
            th, td { border: 1px solid #cbd5e1; padding: 10px; text-align: left; }
            th { background: #f1f5f9; font-weight: bold; }
            .total-box { font-size: 18px; font-weight: bold; text-align: right; margin-top: 15px; }
            .bank-info { background: #f8fafc; border: 1px dashed #0f5132; padding: 15px; border-radius: 6px; margin-top: 30px; font-size: 13px; }
          </style>
        </head>
        <body>
          <div class="header">
            <div class="title">GrainMaster Agro Solutions Ltd.</div>
            <div class="meta">
              <strong>Registration:</strong> RC9167936<br>
              <strong>Head Office & Warehouse:</strong> GF7, Helu plaza, France rd by Galadima, Kano Nigeria<br>
              <strong>Direct Hotline / WhatsApp:</strong> +2349032326937<br>
              <strong>Date:</strong> ${new Date().toLocaleDateString("en-GB")} | <strong>Client:</strong> ${custName} (${custLocation})
            </div>
          </div>
          <h3>COMMERCIAL PRO-FORMA QUOTATION / ORDER SHEET</h3>
          <table>
            <thead>
              <tr>
                <th>#</th>
                <th>Item Description</th>
                <th>Part SKU</th>
                <th>Qty</th>
                <th>Unit Price</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              ${cart.map((i, idx) => `
                <tr>
                  <td>${idx + 1}</td>
                  <td><strong>${i.name}</strong></td>
                  <td>${i.sku}</td>
                  <td>${i.quantity}</td>
                  <td>${formatNaira(i.price)}</td>
                  <td>${formatNaira(i.price * i.quantity)}</td>
                </tr>
              `).join("")}
            </tbody>
          </table>
          <div class="total-box">Grand Total: ${formatNaira(subtotal)}</div>
          <div class="bank-info">
            <strong>OFFICIAL SETTLEMENT & ORDER CONFIRMATION INSTRUCTIONS:</strong><br>
            Please present this quotation at our showroom: <em>GF7, Helu plaza, France rd by Galadima, Kano</em> or verify via WhatsApp at <strong>+2349032326937</strong>.<br>
            Orders dispatched nationwide across all 36 states via certified freight carriers (Kano central hub).
          </div>
          <script>
            window.onload = function() { window.print(); }
          </script>
        </body>
        </html>
      `);
      printWindow.document.close();
    });
  }

  // --- PRODUCT CARD BUILDER ---
  const createProductCard = (product) => {
    return `
      <div class="product-card" data-category="${product.category}" data-id="${product.id}">
        <div class="card-top-badge">${product.badge}</div>
        <div class="card-brand-pill">${product.brand}</div>
        <div class="product-card-img-wrap" onclick="window.appOpenModal('${product.id}')">
          <img src="${product.image}" alt="${product.name}" loading="lazy" />
        </div>
        <div class="product-card-body">
          <span class="product-sku">${product.sku}</span>
          <h3 class="product-card-title" onclick="window.appOpenModal('${product.id}')" style="cursor:pointer;">${product.name}</h3>
          
          <div class="product-rating">
            <span class="rating-stars">
              <i class="fas fa-star"></i>
              <i class="fas fa-star"></i>
              <i class="fas fa-star"></i>
              <i class="fas fa-star"></i>
              <i class="fas fa-star"></i>
            </span>
            <span><strong>${product.rating}</strong> (${product.reviewsCount} reviews)</span>
          </div>

          <ul class="product-highlights-list">
            ${product.highlights.slice(0, 3).map((h) => `<li><i class="fas fa-check-circle"></i> <span>${h}</span></li>`).join("")}
          </ul>

          <div class="product-card-footer">
            <div class="price-stock-row">
              <span class="product-price">${formatNaira(product.price)}</span>
              <span class="stock-indicator">In Stock Kano</span>
            </div>
            <div class="card-actions-grid">
              <button class="btn-view-specs" onclick="window.appOpenModal('${product.id}')">
                <i class="fas fa-sliders-h"></i> Specs
              </button>
              <button class="btn-add-cart" onclick="window.appAddToCart('${product.id}')">
                <i class="fas fa-cart-plus"></i> Order
              </button>
            </div>
          </div>
        </div>
      </div>
    `;
  };

  // Expose Add to Cart globally
  window.appAddToCart = (id) => addToCart(id, 1);

  // --- HORIZONTAL SCROLL RUNWAYS ---
  const populateHorizontalTracks = () => {
    // Track 1: Commercial Rice Machines & Whiteners
    const track1 = document.getElementById("trackRiceMachines");
    if (track1) {
      const riceMachines = PRODUCTS_DATA.filter((p) => p.category === "rice-machines");
      track1.innerHTML = riceMachines.map(createProductCard).join("");
    }

    // Track 2: Rollers, Abrasives & Screens
    const track2 = document.getElementById("trackScreensRollers");
    if (track2) {
      const screensRollers = PRODUCTS_DATA.filter(
        (p) => p.category === "screens-sieves" || p.category === "rollers-abrasives"
      );
      track2.innerHTML = screensRollers.map(createProductCard).join("");
    }

    // Track 3: Optical Color Sorters & Spares
    const track3 = document.getElementById("trackColorSorters");
    if (track3) {
      const colorSorters = PRODUCTS_DATA.filter((p) => p.category === "color-sorter");
      track3.innerHTML = colorSorters.map(createProductCard).join("");
    }

    // Track 4: Elevators, Hardware & Maize Milling
    const track4 = document.getElementById("trackElevatorsMaize");
    if (track4) {
      const elevatorsMaize = PRODUCTS_DATA.filter(
        (p) => p.category === "elevator-hardware" || p.category === "maize-milling"
      );
      track4.innerHTML = elevatorsMaize.map(createProductCard).join("");
    }
  };

  // Setup Scroll Buttons
  const setupScrollButtons = () => {
    document.querySelectorAll(".scroll-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        const targetId = btn.getAttribute("data-target");
        const direction = btn.getAttribute("data-direction") === "left" ? -1 : 1;
        const track = document.getElementById(targetId);
        if (track) {
          const scrollDistance = 340 * direction;
          track.scrollBy({ left: scrollDistance, behavior: "smooth" });
        }
      });
    });
  };

  // --- FULL GRID & SEARCH FILTERING ---
  const fullProductsGrid = document.getElementById("fullProductsGrid");
  const filterResultsCount = document.getElementById("filterResultsCount");

  const renderFilteredProducts = () => {
    if (!fullProductsGrid) return;

    let filtered = PRODUCTS_DATA;

    // Filter by Category
    if (currentFilter !== "all") {
      filtered = filtered.filter((p) => p.category === currentFilter);
    }

    // Filter by Search Query
    if (searchQuery.trim() !== "") {
      const q = searchQuery.toLowerCase().trim();
      filtered = filtered.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.sku.toLowerCase().includes(q) ||
          p.brand.toLowerCase().includes(q) ||
          p.shortDesc.toLowerCase().includes(q) ||
          p.applications.toLowerCase().includes(q)
      );
    }

    if (filterResultsCount) {
      filterResultsCount.textContent = `${filtered.length} products found`;
    }

    if (filtered.length === 0) {
      fullProductsGrid.innerHTML = `
        <div style="grid-column: 1/-1; text-align: center; padding: 3rem 1rem; color: #64748b;">
          <i class="fas fa-search" style="font-size: 2.5rem; color: #cbd5e1; margin-bottom: 1rem;"></i>
          <h3>No machines or spare parts matched "${searchQuery}"</h3>
          <p>Please check your spelling or contact our Kano warehouse directly via WhatsApp for custom machine sourcing.</p>
          <a href="https://wa.me/2349032326937?text=Hello%20GrainMaster%2C%20I%20am%20looking%20for%20a%20specific%20spare%20part%3A%20${encodeURIComponent(searchQuery)}" target="_blank" class="btn-primary" style="margin-top: 1rem;">
            <i class="fab fa-whatsapp"></i> Inquire via WhatsApp (+2349032326937)
          </a>
        </div>
      `;
      return;
    }

    fullProductsGrid.innerHTML = filtered.map(createProductCard).join("");
  };

  // Category Tab Click
  if (categoryNav) {
    categoryNav.addEventListener("click", (e) => {
      const tab = e.target.closest(".cat-tab-btn");
      if (!tab) return;
      document.querySelectorAll(".cat-tab-btn").forEach((t) => t.classList.remove("active"));
      tab.classList.add("active");
      currentFilter = tab.getAttribute("data-category");
      renderFilteredProducts();

      // Scroll smoothly to catalog section if not already there
      const catalogSec = document.getElementById("catalogSection");
      if (catalogSec) {
        catalogSec.scrollIntoView({ behavior: "smooth" });
      }
    });
  }

  // Search input handler
  if (headerSearchInput) {
    headerSearchInput.addEventListener("input", (e) => {
      searchQuery = e.target.value;
      renderFilteredProducts();
    });
  }

  if (searchForm) {
    searchForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const catalogSec = document.getElementById("catalogSection");
      if (catalogSec) {
        catalogSec.scrollIntoView({ behavior: "smooth" });
      }
    });
  }

  // --- PRODUCT DETAILS MODAL & TECHNICAL SPECIFICATIONS ---
  const openProductModal = (productId) => {
    const product = PRODUCTS_DATA.find((p) => p.id === productId);
    if (!product) return;
    currentModalProduct = product;

    // Populate modal fields
    document.getElementById("modalImg").src = product.image;
    document.getElementById("modalImg").alt = product.name;
    document.getElementById("modalBrandTag").textContent = product.brand;
    document.getElementById("modalTitle").textContent = product.name;
    document.getElementById("modalSku").textContent = `SKU: ${product.sku}`;
    document.getElementById("modalCategoryName").textContent = `Category: ${product.categoryName}`;
    document.getElementById("modalPrice").textContent = formatNaira(product.price);
    document.getElementById("modalShortDesc").textContent = product.shortDesc;

    // Build Specs Table
    const specsTableBody = document.getElementById("modalSpecsTableBody");
    if (specsTableBody) {
      specsTableBody.innerHTML = Object.entries(product.specs)
        .map(
          ([key, val]) => `
          <tr>
            <td>${key}</td>
            <td><strong>${val}</strong></td>
          </tr>
        `
        )
        .join("");
    }

    // Build Highlights Tab
    const tabHighlights = document.getElementById("tabFeaturesContent");
    if (tabHighlights) {
      tabHighlights.innerHTML = `
        <h4 style="margin-bottom:0.75rem; color:#0f172a; font-weight:700;">Key Engineering Highlights:</h4>
        <ul style="list-style:none; margin-bottom:1.25rem;">
          ${product.highlights.map((h) => `<li style="margin-bottom:0.4rem; display:flex; gap:0.5rem; align-items:flex-start;"><i class="fas fa-check-circle" style="color:#0f5132; margin-top:3px;"></i> <span>${h}</span></li>`).join("")}
        </ul>
        <h4 style="margin-bottom:0.4rem; color:#0f172a; font-weight:700;">Field Application:</h4>
        <p style="color:#475569; font-size:0.88rem; line-height:1.5;">${product.applications}</p>
      `;
    }

    // Build Compatibility Tab
    const tabCompat = document.getElementById("tabCompatContent");
    if (tabCompat) {
      tabCompat.innerHTML = `
        <div style="background:#f8fafc; border:1px solid #e2e8f0; border-radius:8px; padding:1.25rem;">
          <h4 style="margin-bottom:0.5rem; color:#0f5132; font-weight:700;"><i class="fas fa-link"></i> Machine & Component Compatibility</h4>
          <p style="color:#334155; font-size:0.9rem; line-height:1.5; margin-bottom:1rem;">${product.compatibility}</p>
          <div style="display:inline-flex; align-items:center; gap:0.5rem; background:#dcfce7; color:#166534; font-size:0.8rem; font-weight:700; padding:0.25rem 0.6rem; border-radius:4px;">
            <i class="fas fa-check-double"></i> 100% Guaranteed Fitment Verified in Kano Showroom
          </div>
        </div>
      `;
    }

    // Reset Qty Input
    const modalQtyInput = document.getElementById("modalQtyInput");
    if (modalQtyInput) modalQtyInput.value = 1;

    // Reset Tabs
    document.querySelectorAll(".modal-tab-btn").forEach((t) => t.classList.remove("active"));
    document.querySelectorAll(".modal-tab-content").forEach((c) => c.classList.remove("active"));
    const firstTabBtn = document.querySelector(".modal-tab-btn");
    const firstTabContent = document.getElementById("tabSpecs");
    if (firstTabBtn) firstTabBtn.classList.add("active");
    if (firstTabContent) firstTabContent.classList.add("active");

    // Open Modal
    productModal.classList.add("active");
    document.body.style.overflow = "hidden";
  };

  window.appOpenModal = openProductModal;

  const closeProductModal = () => {
    productModal.classList.remove("active");
    document.body.style.overflow = "";
    currentModalProduct = null;
  };

  if (modalCloseBtn) modalCloseBtn.addEventListener("click", closeProductModal);
  if (productModal) {
    productModal.addEventListener("click", (e) => {
      if (e.target === productModal) closeProductModal();
    });
  }

  // Modal Tabs switching
  document.querySelectorAll(".modal-tab-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const targetId = btn.getAttribute("data-tab");
      document.querySelectorAll(".modal-tab-btn").forEach((b) => b.classList.remove("active"));
      document.querySelectorAll(".modal-tab-content").forEach((c) => c.classList.remove("active"));
      btn.classList.add("active");
      const targetContent = document.getElementById(targetId);
      if (targetContent) targetContent.classList.add("active");
    });
  });

  // Modal Quantity Buttons
  const modalQtyMinus = document.getElementById("modalQtyMinus");
  const modalQtyPlus = document.getElementById("modalQtyPlus");
  const modalQtyInput = document.getElementById("modalQtyInput");

  if (modalQtyMinus && modalQtyInput) {
    modalQtyMinus.addEventListener("click", () => {
      let val = parseInt(modalQtyInput.value) || 1;
      if (val > 1) modalQtyInput.value = val - 1;
    });
  }

  if (modalQtyPlus && modalQtyInput) {
    modalQtyPlus.addEventListener("click", () => {
      let val = parseInt(modalQtyInput.value) || 1;
      modalQtyInput.value = val + 1;
    });
  }

  // Modal Add To Cart Button
  const btnModalAddToCart = document.getElementById("btnModalAddToCart");
  if (btnModalAddToCart) {
    btnModalAddToCart.addEventListener("click", () => {
      if (!currentModalProduct) return;
      const qty = parseInt(modalQtyInput?.value) || 1;
      addToCart(currentModalProduct.id, qty);
      closeProductModal();
      openCart();
    });
  }

  // Modal Direct WhatsApp Enquiry Button
  const btnModalDirectWhatsApp = document.getElementById("btnModalDirectWhatsApp");
  if (btnModalDirectWhatsApp) {
    btnModalDirectWhatsApp.addEventListener("click", () => {
      if (!currentModalProduct) return;
      const qty = parseInt(modalQtyInput?.value) || 1;
      const msg = 
`🌾 *PRODUCT INQUIRY - GRAINMASTER AGRO SOLUTIONS LTD.*
*Registration:* RC9167936
*Showroom:* GF7, Helu Plaza, France Rd by Galadima, Kano Nigeria

Hello GrainMaster, I would like to inquire about the following item:
• *Product:* ${currentModalProduct.name}
• *SKU:* ${currentModalProduct.sku}
• *Category:* ${currentModalProduct.categoryName}
• *Unit Price:* ${formatNaira(currentModalProduct.price)}
• *Quantity Required:* ${qty} unit(s)
• *Estimated Total:* ${formatNaira(currentModalProduct.price * qty)}

Please advise on stock availability at your Kano warehouse, pickup instructions or nationwide freight rates.`;

      const url = `https://wa.me/2349032326937?text=${encodeURIComponent(msg)}`;
      window.open(url, "_blank");
    });
  }

  // --- CONSOLIDATED COLLAPSIBLE FLOATING BUTTON (FAB) ---
  if (fabToggleBtn && fabContainer) {
    fabToggleBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      fabContainer.classList.toggle("active");
    });

    // Close when clicking outside
    document.addEventListener("click", (e) => {
      if (!fabContainer.contains(e.target)) {
        fabContainer.classList.remove("active");
      }
    });
  }

  // Keyboard accessibility (ESC closes modals & drawer)
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      closeCart();
      closeProductModal();
      if (fabContainer) fabContainer.classList.remove("active");
    }
  });

  // INITIALIZATION
  updateCartUI();
  populateHorizontalTracks();
  setupScrollButtons();
  renderFilteredProducts();
});
