/* LIVA commerce prototype. Orders and profile are kept in this browser only. */
(function () {
  'use strict';

  var L = window.Liva;
  var checkoutDraft = {};
  var accountStep = 'phone';
  var accountMode = 'signin';
  var pendingProfile = {};
  var trackingResult = null;
  var trackingQuery = '';
  var trackingError = '';
  var cartTrigger = null;
  var cartBackground = [];
  var orderSubmitting = false;

  var e = function (value) { return L.escape(String(value == null ? '' : value)); };
  var money = function (value) { return L.money(value); };
  var icon = function (name) { return L.icon(name); };
  var cartItems = function () {
    return L.state.cart.map(function (item) {
      return { item: item, product: L.getProduct(item.id) };
    }).filter(function (entry) { return entry.product && entry.item.qty > 0; });
  };
  var provinceOptions = ['Phnom Penh', 'Siem Reap', 'Battambang', 'Kampong Cham', 'Kampot', 'Kandal', 'Preah Sihanouk', 'Other province'];

  function totals() {
    return L.cartTotals();
  }

  function demoNotice(text) {
    return '<div class="commerce-demo">' + icon('leaf') + '<p><strong>Store preview.</strong> ' + text + '</p></div>';
  }

  function pageHeading(eyebrow, title, copy) {
    return '<div class="commerce-heading"><p class="eyebrow">' + eyebrow + '</p><h1>' + title + '</h1>' + (copy ? '<p>' + copy + '</p>' : '') + '</div>';
  }

  function emptyState(title, text, link, label) {
    return '<div class="commerce-empty empty-state"><span class="commerce-empty-icon">' + icon('bag') + '</span><h2>' + title + '</h2><p>' + text + '</p><a class="btn btn-primary" href="' + (link || '#shop') + '">' + (label || 'Explore the collection') + icon('arrow') + '</a></div>';
  }

  function orderSubtotal(order) {
    return order.items.reduce(function (sum, item) { return sum + Math.round(item.price * 100) * item.qty; }, 0) / 100;
  }

  function linesHtml(t) {
    var subtotal = t.items ? orderSubtotal(t) : t.subtotal;
    return '<div class="commerce-totals"><div><span>Products</span><span>' + money(subtotal) + '</span></div>' +
      '<div><span>Delivery</span><span>Not configured</span></div>' +
      '<div class="commerce-total"><strong>Illustrative subtotal</strong><strong>' + money(subtotal) + '<small> USD</small></strong></div></div>';
  }

  function repeatButton(order) {
    return '<button type="button" class="btn btn-secondary commerce-repeat-order" data-order-id="' + e(order.id) + '" aria-label="Add items from order ' + e(order.id) + ' to your bag again">Add again' + icon('bag') + '</button>';
  }

  function cartRow(entry, index) {
    var p = entry.product;
    var item = entry.item;
    var unitPrice = (p.sizePrices && p.sizePrices[item.size] != null) ? p.sizePrices[item.size] : ((item.price != null) ? item.price : p.price);
    return '<article class="commerce-cart-item"><a href="#product/' + e(p.id) + '" class="commerce-cart-image commerce-cart-route"><img src="' + e(p.image) + '" alt="' + e(p.name) + '"></a><div class="commerce-cart-detail"><p class="commerce-item-category">' + e({ hair: 'Hair care', body: 'Body care', sets: 'Sets' }[p.category] || p.category) + '</p><a class="commerce-item-name commerce-cart-route" href="#product/' + e(p.id) + '">' + e(p.name) + '</a><p class="commerce-item-size">' + e(item.size || p.size) + '</p><div class="commerce-item-bottom"><div class="commerce-quantity" aria-label="Quantity for ' + e(p.name) + '"><button type="button" class="commerce-cart-quantity" data-index="' + index + '" data-delta="-1" aria-label="Decrease ' + e(p.name) + ' quantity"' + (item.qty <= 1 ? ' disabled' : '') + '>' + icon('minus') + '</button><span aria-live="polite">' + item.qty + '</span><button type="button" class="commerce-cart-quantity" data-index="' + index + '" data-delta="1" aria-label="Increase ' + e(p.name) + ' quantity"' + (item.qty >= 99 ? ' disabled' : '') + '>' + icon('plus') + '</button></div><span>' + money(unitPrice * item.qty) + '</span></div></div><button type="button" class="icon-button commerce-cart-remove" data-index="' + index + '" aria-label="Remove ' + e(p.name) + '">' + icon('close') + '</button></article>';
  }

  L.renderCart = function () {
    var drawer = document.getElementById('cart-drawer');
    if (!drawer) return;
    var t = totals();
    var items = cartItems();
    drawer.setAttribute('role', 'dialog');
    drawer.setAttribute('aria-modal', 'true');
    drawer.setAttribute('aria-labelledby', 'commerce-cart-title');
    drawer.setAttribute('tabindex', '-1');
    drawer.setAttribute('aria-hidden', drawer.classList.contains('is-open') ? 'false' : 'true');
    drawer.inert = !drawer.classList.contains('is-open');
    drawer.innerHTML = '<div class="commerce-cart-header"><h2 id="commerce-cart-title">Your bag <span>(' + t.count + ')</span></h2><button class="icon-button commerce-cart-close" type="button" aria-label="Close shopping bag">' + icon('close') + '</button></div>' +
      (items.length ? '<div class="commerce-shipping-message">' + icon('bag') + '<p>Review your selection. Prices and sizes are illustrative.</p></div><div class="commerce-cart-list">' + items.map(function (entry) { return cartRow(entry, L.state.cart.indexOf(entry.item)); }).join('') + '</div><div class="commerce-cart-footer">' + linesHtml(t) + '<p class="commerce-delivery-note">Delivery fees, coverage and timing are not configured.</p><a href="#checkout" class="btn btn-primary commerce-cart-route commerce-checkout-link">Continue to checkout' + icon('arrow') + '</a><button type="button" class="commerce-text-button commerce-cart-close">Continue shopping</button><p class="commerce-cart-assurance">Demo checkout. No payment or delivery.</p></div>' : '<div class="commerce-cart-empty">' + emptyState('Your bag is empty.', 'Explore hair care, body care and sets to start your selection.') + '</div>');
  };

  L.openCart = function () {
    var drawer = document.getElementById('cart-drawer');
    var overlay = document.getElementById('overlay');
    if (!drawer) return;
    if (!drawer.classList.contains('is-open')) {
      cartTrigger = document.activeElement;
      cartBackground = Array.from(document.body.children).filter(function (element) {
        return !['cart-drawer', 'overlay', 'toast'].includes(element.id) && !['SCRIPT', 'STYLE', 'LINK', 'NOSCRIPT'].includes(element.tagName);
      }).map(function (element) { var original = element.inert; element.inert = true; return { element: element, inert: original }; });
    }
    L.renderCart();
    drawer.classList.add('is-open');
    drawer.setAttribute('aria-hidden', 'false');
    drawer.inert = false;
    if (overlay) { overlay.classList.add('is-open'); overlay.setAttribute('aria-hidden', 'true'); }
    document.body.classList.add('drawer-open');
    window.setTimeout(function () { var button = drawer.querySelector('.commerce-cart-close'); if (button) button.focus(); }, 40);
  };

  L.closeCart = function () {
    var drawer = document.getElementById('cart-drawer');
    if (!drawer || !drawer.classList.contains('is-open')) return;
    drawer.classList.remove('is-open');
    drawer.setAttribute('aria-hidden', 'true');
    drawer.inert = true;
    cartBackground.forEach(function (entry) { entry.element.inert = entry.inert; });
    cartBackground = [];
    var overlay = document.getElementById('overlay');
    if (overlay) overlay.classList.remove('is-open');
    document.body.classList.remove('drawer-open');
    if (cartTrigger && document.contains(cartTrigger)) cartTrigger.focus();
  };

  function checkoutValues() {
    var p = L.state.profile || {};
    return Object.assign({ name: p.name || '', email: p.email || '', phone: p.phone || '', address: p.address || '', city: p.city || 'Phnom Penh', note: '', payment: 'cod' }, checkoutDraft);
  }

  function inputField(label, name, value, attrs, wide) {
    return '<div class="form-field' + (wide ? ' commerce-field-wide' : '') + '"><label for="commerce-' + name + '">' + label + '</label><input id="commerce-' + name + '" name="' + name + '" value="' + e(value) + '" ' + (attrs || '') + '></div>';
  }

  function selectCity(value) {
    return '<div class="form-field commerce-field-wide"><label for="commerce-city">City / province</label><select id="commerce-city" name="city" required>' + provinceOptions.map(function (name) { return '<option' + (name === value ? ' selected' : '') + '>' + name + '</option>'; }).join('') + '</select></div>';
  }

  function checkoutSummary() {
    var t = totals();
    return '<h2>In your bag <span>' + t.count + ' ' + (t.count === 1 ? 'item' : 'items') + '</span></h2><div class="commerce-summary-items">' + cartItems().map(function (entry) { var p = entry.product, item = entry.item; return '<div class="commerce-summary-item"><div class="commerce-summary-image"><img src="' + e(p.image) + '" alt="' + e(p.name) + '"><span>' + item.qty + '</span></div><div><h3>' + e(p.name) + '</h3><p>' + e(item.size || p.size) + '</p></div><strong>' + money(p.price * item.qty) + '</strong></div>'; }).join('') + '</div>' + linesHtml(t) + '<div class="commerce-summary-note">' + icon('truck') + '<p>Delivery is not configured.<small>Fees, coverage and timing have not been supplied.</small></p></div><a class="commerce-edit-bag" href="#shop">Continue shopping' + icon('arrow') + '</a>';
  }

  L.renderCheckout = function () {
    if (!cartItems().length) return '<section class="commerce-page container">' + pageHeading('YOUR SELECTION', 'Checkout', '') + emptyState('Your bag is empty.', 'Add products to your bag before trying checkout.') + '</section>';
    var v = checkoutValues();
    return '<section class="commerce-page container"><a href="#shop" class="commerce-back">' + icon('arrow') + ' Back to the collection</a>' + pageHeading('YOUR SELECTION', 'Checkout', 'Review your selection and try the checkout flow.') + '<div class="commerce-checkout-layout"><form id="commerce-checkout-form" class="commerce-checkout-form">' + demoNotice('Use sample contact and address details. This demo saves your order on this device only; no payment is collected and no order is sent.') + '<section class="commerce-form-section"><div class="commerce-section-title"><span>01</span><h2>Your details</h2></div>' + (!L.state.profile ? '<p class="commerce-signin-note">Saved your details before? <a href="#account">Open your demo account</a></p>' : '') + '<div class="commerce-field-grid">' + inputField('Full name', 'name', v.name, 'type="text" autocomplete="name" required minlength="2" maxlength="100" placeholder="Your first and last name"', true) + inputField('Email address', 'email', v.email, 'type="email" autocomplete="email" required maxlength="120" placeholder="you@example.com"') + inputField('Phone number', 'phone', v.phone, 'type="tel" autocomplete="tel" required pattern="[+0-9][0-9 ]{7,17}" placeholder="012 345 678" title="Enter a valid phone number, such as 012 345 678"') + '</div></section><section class="commerce-form-section"><div class="commerce-section-title"><span>02</span><h2>Delivery details</h2></div><div class="commerce-field-grid">' + inputField('Delivery address', 'address', v.address, 'type="text" autocomplete="street-address" required minlength="5" maxlength="240" placeholder="House number, street and district"', true) + selectCity(v.city) + '<div class="form-field commerce-field-wide"><label for="commerce-note">Delivery note <span>(optional)</span></label><textarea id="commerce-note" name="note" rows="3" maxlength="500" placeholder="A nearby landmark or delivery instructions">' + e(v.note) + '</textarea></div></div><p class="commerce-field-hint">Location fields demonstrate checkout only. Delivery availability and fees are not configured.</p></section><section class="commerce-form-section"><div class="commerce-section-title"><span>03</span><h2>Payment preview</h2></div><div class="commerce-payment-options"><label class="commerce-payment-option"><input type="radio" name="payment" value="cod"' + (v.payment === 'cod' ? ' checked' : '') + '><span class="commerce-radio"></span><span><strong>Cash on delivery · Preview</strong><small>Example selection. No amount is due.</small></span><span class="commerce-payment-badge">COD</span></label><label class="commerce-payment-option"><input type="radio" name="payment" value="aba"' + (v.payment === 'aba' ? ' checked' : '') + '><span class="commerce-radio"></span><span><strong>ABA transfer · Preview</strong><small>Example selection. No payment connection.</small></span><span class="commerce-payment-badge commerce-aba-badge">ABA</span></label></div><div id="commerce-payment-note" class="commerce-payment-note">' + paymentNote(v.payment) + '</div></section><div id="commerce-checkout-error" class="commerce-form-error" role="alert"></div><button type="submit" class="btn btn-primary commerce-place-order">Save demo order' + icon('arrow') + '</button><p class="commerce-submit-note">Your demo order is saved on this device only.</p></form><aside id="commerce-checkout-summary" class="commerce-checkout-summary" aria-label="Order summary">' + checkoutSummary() + '</aside></div></section>';
  };

  function paymentNote(payment) {
    return payment === 'aba' ? '<strong>ABA payment preview</strong><p>No active QR code or bank details are provided. You will not be charged; placing this order only creates a local demo record.</p>' : '<p>Cash on delivery is shown for illustration. No delivery is arranged and nothing is due for this demo order.</p>';
  }

  function captureCheckout() {
    var form = document.getElementById('commerce-checkout-form');
    if (form) checkoutDraft = Object.fromEntries(new FormData(form).entries());
  }

  function refreshSummary() {
    var summary = document.getElementById('commerce-checkout-summary');
    if (summary) summary.innerHTML = checkoutSummary();
  }

  function dateLabel(value) {
    var date = new Date(value);
    return isNaN(date.getTime()) ? 'Just now' : date.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
  }

  function orderItemsHtml(items) {
    return '<div class="commerce-order-items">' + items.map(function (item) { return '<div class="commerce-order-item">' + (item.image ? '<img src="' + e(item.image) + '" alt="' + e(item.name) + '">' : '') + '<div><h3>' + e(item.name) + '</h3><p>' + e(item.size) + ' · Qty ' + item.qty + '</p></div><span>' + money(item.price * item.qty) + '</span></div>'; }).join('') + '</div>';
  }

  L.renderConfirmation = function (id) {
    var order = (L.state.orders || []).find(function (entry) { return entry.id === id; });
    if (!order) return '<section class="commerce-page container">' + emptyState('We can’t find that order.', 'This demo saves orders in the browser where they were placed.', '#tracking', 'Track an order') + '</section>';
    return '<section class="commerce-page commerce-confirmation container"><div class="commerce-confirmation-head"><span class="commerce-success-icon">' + icon('check') + '</span><p class="eyebrow">DEMO ORDER SAVED</p><h1>Thank you, ' + e(order.customer.name.split(' ')[0]) + '.</h1><p>Your demo order is saved on this device.</p><div class="commerce-reference">Order <strong>' + e(order.id) + '</strong><span>' + dateLabel(order.createdAt) + '</span></div></div><div class="commerce-confirmation-card">' + demoNotice('This order is saved in your browser only. Nothing will be charged, shipped or emailed.') + '<h2>Your selection</h2>' + orderItemsHtml(order.items) + linesHtml(order) + '<div class="commerce-confirmation-details"><div><span>DELIVERY ADDRESS</span><p>' + e(order.customer.name) + '<br>' + e(order.customer.address) + '<br>' + e(order.customer.city) + ', Cambodia</p></div><div><span>PAYMENT METHOD</span><p>' + (order.payment === 'aba' ? 'ABA bank transfer · Demo' : 'Cash on delivery · Demo') + '<br>' + e(order.customer.phone) + '</p></div></div></div><div class="commerce-confirmation-actions"><a href="#tracking/' + e(order.id) + '" class="btn btn-primary">View demo tracking' + icon('arrow') + '</a>' + repeatButton(order) + '<a href="#shop" class="btn btn-secondary">Continue shopping</a></div><p class="commerce-submit-note">Add again uses current illustrative prices. Review your bag before checkout.</p></section>';
  };

  function renderSocialAuth() {
    var googleLabel = (L && L.t) ? L.t('continueWithGoogle') : 'Continue with Google';
    var facebookLabel = (L && L.t) ? L.t('continueWithFacebook') : 'Continue with Facebook';
    var orWithPhone = (L && L.t) ? L.t('orWithPhone') : 'or continue with phone';
    return '<div class="commerce-social-auth">' +
      '<button type="button" class="commerce-social-btn commerce-social-google" data-social="google" aria-label="' + e(googleLabel) + '">' +
      '<svg class="commerce-social-icon" viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">' +
      '<path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>' +
      '<path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>' +
      '<path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>' +
      '<path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>' +
      '</svg>' +
      '<span data-i18n="continueWithGoogle">' + e(googleLabel) + '</span>' +
      '</button>' +
      '<button type="button" class="commerce-social-btn commerce-social-facebook" data-social="facebook" aria-label="' + e(facebookLabel) + '">' +
      '<svg class="commerce-social-icon" viewBox="0 0 24 24" width="20" height="20" fill="#1877F2" aria-hidden="true">' +
      '<path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>' +
      '</svg>' +
      '<span data-i18n="continueWithFacebook">' + e(facebookLabel) + '</span>' +
      '</button>' +
      '</div>' +
      '<div class="commerce-auth-divider">' +
      '<span data-i18n="orWithPhone">' + e(orWithPhone) + '</span>' +
      '</div>';
  }

  L.renderAccount = function () {
    if (L.state.profile) return renderProfile();
    var register = accountMode === 'register';
    var otp = accountStep === 'otp';
    return '<section class="commerce-account-page container"><div class="commerce-account-intro"><p class="eyebrow">YOUR LIVA</p><h1>Your favourites.<br>Your orders.<br><em>All together.</em></h1><p>Save a selection, revisit local demo orders, and add your favourites again.</p><div class="commerce-account-benefits"><span>' + icon('heart') + ' Saved favourites</span><span>' + icon('bag') + ' Local order history</span><span>' + icon('leaf') + ' Saved checkout details</span></div><div class="commerce-account-signature"><span>LIVA</span></div></div><div class="commerce-auth-card"><p class="eyebrow">' + (otp ? 'DEMO ACCESS' : 'YOUR ACCOUNT') + '</p><h2>' + (otp ? 'Enter your demo code.' : register ? 'Create a demo profile.' : 'Welcome back.') + '</h2><p class="commerce-auth-description">' + (otp ? 'Enter the preview code for ' + e(pendingProfile.phone) + '.' : 'Keep your shopping details together on this device.') + '</p>' + (otp ? renderOtpForm() : '<div class="commerce-auth-tabs" role="group" aria-label="Account action"><button type="button" class="commerce-account-mode' + (!register ? ' is-active' : '') + '" data-mode="signin" aria-pressed="' + !register + '">Sign in</button><button type="button" class="commerce-account-mode' + (register ? ' is-active' : '') + '" data-mode="register" aria-pressed="' + register + '">Create a profile</button></div>' + renderSocialAuth() + '<form id="commerce-login-form">' + (register ? inputField('Your name', 'name', pendingProfile.name || '', 'type="text" required minlength="2" maxlength="100" autocomplete="name" placeholder="Your name"') + inputField('Email address', 'email', pendingProfile.email || '', 'type="email" required maxlength="120" autocomplete="email" placeholder="you@example.com"') : '') + inputField('Phone number', 'phone', pendingProfile.phone || '', 'type="tel" required autocomplete="tel" pattern="[+0-9][0-9 ]{7,17}" title="Enter a valid phone number, such as 012 345 678" placeholder="012 345 678"') + '<div id="commerce-login-error" class="commerce-form-error" role="alert"></div><button class="btn btn-primary" type="submit">Continue' + icon('arrow') + '</button></form>' + demoNotice('Demo account access only. No SMS is sent. You’ll use the preview code <strong>123456</strong>.')) + '</div></section>';
  };

  function renderOtpForm() {
    return '<div class="commerce-otp-preview"><span>YOUR DEMO CODE</span><strong>123456</strong><p>No SMS has been sent.</p></div><form id="commerce-otp-form"><div class="form-field"><label for="commerce-otp">Six-digit code</label><input id="commerce-otp" name="otp" inputmode="numeric" pattern="[0-9]{6}" required maxlength="6" autocomplete="one-time-code" placeholder="000000" class="commerce-otp-input" aria-describedby="commerce-otp-description"><p id="commerce-otp-description" class="commerce-field-hint">Enter the code shown above to try your account.</p></div><div id="commerce-otp-error" class="commerce-form-error" role="alert"></div><button class="btn btn-primary" type="submit">Open demo account' + icon('arrow') + '</button><button type="button" class="commerce-text-button commerce-back-to-phone">Use a different phone number</button></form>';
  }

  function renderProfile() {
    var p = L.state.profile;
    var orders = L.state.orders || [];
    var providerText = p.provider ? ((L && L.t ? L.t('connectedVia') : 'Connected via') + ' ' + p.provider) : 'LOCAL DEMO PROFILE';
    return '<section class="commerce-page container">' + pageHeading('YOUR LIVA', 'Hello, ' + e((p.name || 'there').split(' ')[0]) + '.', 'Saved details and order history on this device.') + '<div class="commerce-profile-layout"><aside class="commerce-profile-sidebar"><div class="commerce-avatar">' + e((p.name || 'L').charAt(0).toUpperCase()) + '</div><h2>' + e(p.name || 'LIVA Guest') + '</h2><p>' + e(p.phone || p.email) + '</p><span class="commerce-profile-label">' + e(providerText) + '</span><a href="#wishlist">' + icon('heart') + ' Your favourites' + icon('arrow') + '</a><a href="#tracking">' + icon('truck') + ' Track an order' + icon('arrow') + '</a><button type="button" class="commerce-logout">Sign out</button></aside><div class="commerce-profile-content">' + demoNotice('Your profile and order history live on this device. This is not a real authenticated account.') + '<section class="commerce-profile-section"><div class="commerce-profile-section-head"><h2>Your details</h2><span>For demo checkout</span></div><form id="commerce-profile-form"><div class="commerce-field-grid">' + inputField('Full name', 'name', p.name, 'type="text" required minlength="2" maxlength="100" autocomplete="name"') + inputField('Email address', 'email', p.email || '', 'type="email" required maxlength="120" autocomplete="email"') + inputField('Phone number', 'phone', p.phone, 'type="tel" required pattern="[+0-9][0-9 ]{7,17}" title="Enter a valid phone number" autocomplete="tel"') + inputField('Delivery address (optional)', 'address', p.address || '', 'type="text" maxlength="240" autocomplete="street-address"') + selectCity(p.city || 'Phnom Penh') + '</div><div id="commerce-profile-error" class="commerce-form-error" role="alert"></div><div class="commerce-profile-save"><button type="submit" class="btn btn-secondary">Save your details</button><span id="commerce-profile-saved" role="status"></span></div></form></section><section class="commerce-profile-section"><div class="commerce-profile-section-head"><h2>Order history</h2><span>' + orders.length + ' ' + (orders.length === 1 ? 'order' : 'orders') + '</span></div>' + (orders.length ? '<div class="commerce-order-history">' + orders.slice().reverse().map(function (order) { return '<article class="commerce-history-order"><div><a href="#confirmation/' + e(order.id) + '">' + e(order.id) + '</a><p>' + dateLabel(order.createdAt) + ' · ' + order.items.reduce(function (n, item) { return n + item.qty; }, 0) + ' items</p></div><span class="commerce-status">' + e(order.status || 'Confirmed') + '</span><strong>' + money(orderSubtotal(order)) + '</strong>' + repeatButton(order) + '<a class="commerce-history-link" href="#confirmation/' + e(order.id) + '" aria-label="View order ' + e(order.id) + '">' + icon('arrow') + '</a></article>'; }).join('') + '</div>' : '<div class="commerce-orders-empty">' + icon('bag') + '<h3>No demo orders yet.</h3><p>Once you place a demo order, you’ll find it here.</p><a href="#shop" class="commerce-text-link">Explore the collection' + icon('arrow') + '</a></div>') + '</section></div></div></section>';
  }

  function sampleOrder() {
    var p = L.products[0];
    return { id: 'LIVA-1024', createdAt: new Date(Date.now() - 86400000).toISOString(), status: 'On the way', sample: true, customer: { name: 'LIVA Guest', city: 'Phnom Penh' }, items: p ? [{ id: p.id, name: p.name, size: p.size, qty: 1, price: p.price, image: p.image }] : [], total: p ? p.price : 0 };
  }

  function renderTrackingResult(order) {
    var statuses = ['Confirmed', 'Preparing', 'On the way', 'Delivered'];
    var activeIndex = Math.max(0, statuses.indexOf(order.status));
    var stages = [['Confirmed', 'Example order confirmation.'], ['Preparing', 'Example preparation stage.'], ['On the way', 'Example transit stage.'], ['Delivered', 'Example delivery stage.']];
    return '<div class="commerce-tracking-result"><div class="commerce-tracking-result-head"><div><p class="eyebrow">' + (order.sample ? 'SAMPLE ORDER' : 'LOCAL DEMO ORDER') + '</p><h2>' + e(order.id) + '</h2><p>Placed ' + dateLabel(order.createdAt) + '</p></div><span class="commerce-status">' + e(order.status || 'Confirmed') + '</span></div><ol class="commerce-timeline">' + stages.map(function (stage, i) { return '<li class="' + (i < activeIndex ? 'is-complete' : i === activeIndex ? 'is-current' : '') + '"><span class="commerce-timeline-dot">' + (i <= activeIndex ? icon('check') : '<span></span>') + '</span><div><h3>' + stage[0] + '</h3><p>' + stage[1] + '</p>' + (i === activeIndex ? '<span class="commerce-timeline-now">' + (order.sample ? 'Sample progress' : 'Demo status') + '</span>' : '') + '</div></li>'; }).join('') + '</ol><div class="commerce-tracking-delivery">' + icon('truck') + '<div><strong>' + e(order.customer.city) + ', Cambodia</strong><p>' + 'Demo destination. No delivery is arranged.' + '</p></div></div>' + orderItemsHtml(order.items) + '<p class="commerce-tracking-disclaimer">' + (order.sample ? 'This sample shows how tracking will look. It is not connected to a delivery service.' : 'Status is saved on this device and does not update from a delivery service.') + '</p></div>';
  }

  L.renderTracking = function (orderId) {
    if (orderId) selectTrackingOrder(orderId);
    return '<section class="commerce-page commerce-tracking-page container">' + pageHeading('ORDER LOOKUP', 'Track a demo order.', 'Look up an order saved on this device, or explore a sample tracking view.') + '<div class="commerce-tracking-layout"><div><form id="commerce-tracking-form" class="commerce-tracking-form"><h2>Where’s my order?</h2><p>Enter your order number to take a look.</p><div class="form-field"><label for="commerce-order-id">Order number</label><input id="commerce-order-id" name="orderId" required maxlength="40" placeholder="e.g. LIVA-1024" value="' + e(trackingQuery) + '" autocomplete="off"></div><button type="submit" class="btn btn-primary">Find my order' + icon('arrow') + '</button><div id="commerce-tracking-error" class="commerce-form-error" role="alert">' + e(trackingError) + '</div><p class="commerce-tracking-example">Just exploring? <button type="button" class="commerce-sample-order">Try sample order LIVA-1024</button></p></form><div class="commerce-tracking-help"><span>' + icon('heart') + '</span><h3>About this preview</h3><p>Tracking uses local demo records. It is not connected to a delivery service.</p><a href="#contact" class="commerce-text-link">View help' + icon('arrow') + '</a></div></div><div id="commerce-tracking-output" aria-live="polite">' + (trackingResult ? renderTrackingResult(trackingResult) : '<div class="commerce-tracking-placeholder"><div class="commerce-tracking-illustration">' + icon('bag') + '<span>' + icon('leaf') + '</span></div><p class="eyebrow">DEMO TRACKING</p><h2>Your order,<br>at a glance.</h2><p>Enter an order number to see its demo details.</p><span class="commerce-tracking-fineprint">Demo tracking · Local and sample orders only</span></div>') + '</div></div></section>';
  };

  L.renderContact = function () {
    var faqs = [
      ['Can I buy products here?', 'This storefront is a design preview. Prices and sizes are illustrative. Checkout saves a demo order on your device and does not create a purchase.'],
      ['What are the delivery and returns policies?', 'Delivery fees, delivery coverage, timing and returns terms have not been supplied. No delivery is arranged through this preview.'],
      ['How does the payment preview work?', 'Cash on delivery and ABA transfer are example selections. There is no payment connection, no active payment code and no money is collected.'],
      ['Where can I find product information?', 'The collection shows sample products. Verified ingredients, instructions, benefits and certifications have not been supplied.'],
      ['Can I add a previous order again?', 'Open a saved demo order or your account history and choose Add again. Available products are added to your existing bag at current illustrative prices so you can review them.']
    ];
    return '<section class="commerce-page commerce-contact-page container">' + pageHeading('HELP & CONTACT', 'A clear place to start.', 'Explore how this store preview works.') + '<div class="commerce-contact-layout"><div class="commerce-contact-info"><p class="eyebrow">STORE PREVIEW</p><h2>Questions about<br>the experience?</h2><p>Try the contact form and explore the answers below. The form demonstrates the interaction without sending a message.</p><div class="commerce-contact-details"><div><span>' + icon('bag') + '</span><div><h3>Your shopping details</h3><p>Demo orders and saved items remain in this browser.</p></div></div><div><span>' + icon('user') + '</span><div><h3>Contact details</h3><p>Live contact channels and service hours have not been supplied.</p></div></div></div></div><div class="commerce-contact-form-wrap"><form id="commerce-contact-form"><h2>Contact form preview</h2><div class="commerce-field-grid">' + inputField('Your name', 'name', '', 'type="text" required minlength="2" maxlength="100" autocomplete="name" placeholder="Your name"') + inputField('Email address', 'email', '', 'type="email" required maxlength="120" autocomplete="email" placeholder="you@example.com"') + '<div class="form-field commerce-field-wide"><label for="commerce-subject">Topic</label><select id="commerce-subject" name="subject" required><option value="">Choose a topic</option><option>Product advice</option><option>My order</option><option>Delivery & payment</option><option>Partnerships</option><option>Other</option></select></div><div class="form-field commerce-field-wide"><label for="commerce-message">Your message</label><textarea id="commerce-message" name="message" required minlength="10" maxlength="2000" rows="5" placeholder="Write a sample message…"></textarea></div></div><div id="commerce-contact-error" class="commerce-form-error" role="alert"></div><button type="submit" class="btn btn-primary">Preview message' + icon('arrow') + '</button><p class="commerce-submit-note">Demo form · Your message won’t be sent or stored.</p></form><div id="commerce-contact-success" class="commerce-contact-success" hidden><span class="commerce-success-icon">' + icon('check') + '</span><p class="eyebrow">MESSAGE PREVIEW</p><h2>Preview complete.</h2><p>Your message preview is complete. This is a local demo, so your note has not been sent or stored.</p><button type="button" class="btn btn-secondary commerce-contact-again">Try another message</button></div></div></div><section class="commerce-faq"><div><p class="eyebrow">COMMON QUESTIONS</p><h2>Good to know.</h2><p>What works in this demo, and what is not configured.</p></div><div class="commerce-faq-list">' + faqs.map(function (faq, i) { return '<details class="commerce-faq-item"><summary>' + faq[0] + '<span>' + icon('plus') + '</span></summary><div><p>' + faq[1] + '</p></div></details>'; }).join('') + '</div></section></section>';
  };

  function announceError(id, text) {
    var el = document.getElementById(id);
    if (el) el.textContent = text;
  }

  function validateForm(form, errorId) {
    if (!form.reportValidity()) return false;
    var name = form.elements.namedItem('name');
    if (name && name.value.trim().length < 2) { announceError(errorId, 'Please enter your name.'); name.focus(); return false; }
    var phone = form.elements.namedItem('phone');
    if (phone && !/^[+]?[0-9 ]+$/.test(phone.value.trim())) { announceError(errorId, 'Please enter a valid phone number using numbers and spaces.'); phone.focus(); return false; }
    if (phone && (phone.value.replace(/[^0-9]/g, '').length < 8 || phone.value.replace(/[^0-9]/g, '').length > 15)) { announceError(errorId, 'Please enter a phone number with 8–15 digits.'); phone.focus(); return false; }
    var address = form.elements.namedItem('address');
    if (address && address.required && address.value.trim().length < 5) { announceError(errorId, 'Please add your full delivery address.'); address.focus(); return false; }
    var message = form.elements.namedItem('message');
    if (message && message.value.trim().length < 10) { announceError(errorId, 'Please add a few more details to your message.'); message.focus(); return false; }
    announceError(errorId, '');
    return true;
  }

  function refreshCartAfterMutation(focusSelector) {
    L.save();
    L.renderCart();
    document.dispatchEvent(new CustomEvent('liva:cart-updated'));
    if (typeof L.updateCounts === 'function') L.updateCounts();
    if (typeof L.updateHeader === 'function') L.updateHeader();
    var target = focusSelector && document.querySelector(focusSelector);
    if (target && !target.disabled) target.focus();
    else { var close = document.querySelector('#cart-drawer .commerce-cart-close'); if (close) close.focus(); }
    if (document.getElementById('commerce-checkout-summary')) { captureCheckout(); if (!cartItems().length) L.render(); else refreshSummary(); }
  }

  function selectTrackingOrder(value) {
    trackingQuery = value.trim().toUpperCase();
    trackingResult = trackingQuery === 'LIVA-1024' ? sampleOrder() : (L.state.orders || []).find(function (order) { return order.id.toUpperCase() === trackingQuery; });
    trackingError = trackingResult ? '' : 'We couldn’t find that order. Check the number, or try LIVA-1024. Demo orders are available only on the device where you placed them.';
  }

  function findOrder(value) {
    selectTrackingOrder(value);
    var output = document.getElementById('commerce-tracking-output');
    if (output) output.innerHTML = trackingResult ? renderTrackingResult(trackingResult) : '<div class="commerce-tracking-not-found"><span>' + icon('search') + '</span><h2>Not quite there.</h2><p>Double-check your order number and try again.</p></div>';
    announceError('commerce-tracking-error', trackingError);
  }

  document.addEventListener('click', function (event) {
    var close = event.target.closest('.commerce-cart-close');
    if (close) { event.preventDefault(); L.closeCart(); return; }
    if (event.target.id === 'overlay') { L.closeCart(); return; }
    if (event.target.closest('.commerce-cart-route, .commerce-cart-empty a')) L.closeCart();
    var quantity = event.target.closest('.commerce-cart-quantity');
    if (quantity) {
      var index = Number(quantity.dataset.index);
      var item = L.state.cart[index];
      if (item) { item.qty = Math.max(1, Math.min(99, item.qty + Number(quantity.dataset.delta))); refreshCartAfterMutation('.commerce-cart-quantity[data-index="' + index + '"][data-delta="' + quantity.dataset.delta + '"]'); }
      return;
    }
    var remove = event.target.closest('.commerce-cart-remove');
    if (remove) { L.state.cart.splice(Number(remove.dataset.index), 1); refreshCartAfterMutation('.commerce-cart-close'); L.toast('Removed from your bag.'); return; }
    var repeat = event.target.closest('.commerce-repeat-order');
    if (repeat) {
      var result = L.repeatOrder(repeat.dataset.orderId);
      var message = result.added ? result.added + (result.added === 1 ? ' item added to your bag.' : ' items added to your bag.') : 'No items added.';
      if (result.skipped) message += ' ' + result.skipped + (result.skipped === 1 ? ' unavailable item skipped.' : ' unavailable items skipped.');
      if (result.limited) message += ' ' + result.limited + (result.limited === 1 ? ' unit' : ' units') + ' left out by the quantity limit.';
      L.toast(message);
      if (result.added) {
        document.dispatchEvent(new CustomEvent('liva:cart-updated'));
        if (typeof L.updateCounts === 'function') L.updateCounts();
        L.openCart();
      }
      return;
    }
    var socialBtn = event.target.closest('.commerce-social-btn');
    if (socialBtn) {
      var provider = socialBtn.dataset.social;
      if (provider === 'google') {
        L.state.profile = {
          name: 'Sophea Alex',
          email: 'sophea.alex@gmail.com',
          phone: '012 345 678',
          provider: 'Google',
          city: 'Phnom Penh',
          address: 'Street 240, Daun Penh'
        };
        L.save();
        accountStep = 'phone';
        L.render();
        L.toast(L.getLang && L.getLang() === 'km' ? 'បានចូលដោយជោគជ័យជាមួយ Google' : 'Signed in with Google');
      } else if (provider === 'facebook') {
        L.state.profile = {
          name: 'Sophea Alex',
          email: 'sophea.alex@facebook.com',
          phone: '012 345 678',
          provider: 'Facebook',
          city: 'Phnom Penh',
          address: 'Street 240, Daun Penh'
        };
        L.save();
        accountStep = 'phone';
        L.render();
        L.toast(L.getLang && L.getLang() === 'km' ? 'បានចូលដោយជោគជ័យជាមួយ Facebook' : 'Signed in with Facebook');
      }
      return;
    }
    var mode = event.target.closest('.commerce-account-mode');
    if (mode) { accountMode = mode.dataset.mode; accountStep = 'phone'; L.render(); return; }
    if (event.target.closest('.commerce-back-to-phone')) { accountStep = 'phone'; L.render(); return; }
    if (event.target.closest('.commerce-logout')) { L.state.profile = null; pendingProfile = {}; accountStep = 'phone'; L.save(); L.render(); L.toast('You’ve signed out of your demo account.'); return; }
    if (event.target.closest('.commerce-sample-order')) { var input = document.getElementById('commerce-order-id'); input.value = 'LIVA-1024'; findOrder('LIVA-1024'); return; }
    if (event.target.closest('.commerce-contact-again')) { document.getElementById('commerce-contact-success').hidden = true; document.getElementById('commerce-contact-form').hidden = false; document.getElementById('commerce-contact-form').reset(); document.getElementById('commerce-name').focus(); }
  });

  document.addEventListener('change', function (event) {
    var form = event.target.closest('#commerce-checkout-form');
    if (form) {
      captureCheckout();
      if (event.target.name === 'city') refreshSummary();
      if (event.target.name === 'payment') document.getElementById('commerce-payment-note').innerHTML = paymentNote(event.target.value);
    }
  });
  document.addEventListener('input', function (event) { if (event.target.closest('#commerce-checkout-form')) captureCheckout(); });

  document.addEventListener('submit', function (event) {
    var form = event.target;
    if (form.id === 'commerce-checkout-form') {
      event.preventDefault();
      if (orderSubmitting || !validateForm(form, 'commerce-checkout-error')) return;
      if (!cartItems().length) { announceError('commerce-checkout-error', 'Your bag is empty. Add a product before checking out.'); return; }
      orderSubmitting = true;
      var submit = form.querySelector('[type="submit"]');
      submit.disabled = true;
      captureCheckout();
      var v = checkoutValues();
      var t = totals();
      var id = 'LIVA-' + Date.now().toString(36).toUpperCase() + '-' + Math.random().toString(36).slice(2, 5).toUpperCase();
      /* Persisted order schema: totals, item price snapshots, customer address, demo payment and local status. */
      var order = Object.assign({
        id: id,
        createdAt: new Date().toISOString(),
        status: 'Confirmed',
        payment: v.payment === 'aba' ? 'aba' : 'cod',
        customer: { name: v.name.trim(), email: v.email.trim(), phone: v.phone.trim(), address: v.address.trim(), city: v.city, note: (v.note || '').trim() },
        items: cartItems().map(function (entry) {
          var p = entry.product;
          var item = entry.item;
          var unitPrice = (p.sizePrices && p.sizePrices[item.size] != null) ? p.sizePrices[item.size] : ((item.price != null) ? item.price : p.price);
          return { id: p.id, name: p.name, size: item.size || p.size, qty: item.qty, price: unitPrice, image: p.image };
        })
      }, t);
      L.state.orders = L.state.orders || [];
      L.state.orders.push(order);
      L.state.cart = [];
      L.state.promo = '';
      L.save();
      checkoutDraft = {};
      trackingResult = order;
      trackingQuery = order.id;
      trackingError = '';
      L.closeCart();
      L.navigate('#confirmation/' + id);
      L.renderCart();
      document.dispatchEvent(new CustomEvent('liva:cart-updated'));
      if (typeof L.updateCounts === 'function') L.updateCounts();
      orderSubmitting = false;
      return;
    }
    if (form.id === 'commerce-login-form') {
      event.preventDefault();
      if (!validateForm(form, 'commerce-login-error')) return;
      var login = Object.fromEntries(new FormData(form).entries());
      pendingProfile = { phone: login.phone.trim(), name: (login.name || '').trim(), email: (login.email || '').trim() };
      accountStep = 'otp';
      L.render();
      var otp = document.getElementById('commerce-otp');
      if (otp) otp.focus();
      return;
    }
    if (form.id === 'commerce-otp-form') {
      event.preventDefault();
      if (form.elements.otp.value !== '123456') { announceError('commerce-otp-error', 'Use the demo code 123456 shown above.'); form.elements.otp.setAttribute('aria-invalid', 'true'); return; }
      L.state.profile = { name: pendingProfile.name || 'LIVA Guest', email: pendingProfile.email || '', phone: pendingProfile.phone, address: '', city: 'Phnom Penh' };
      L.save();
      accountStep = 'phone';
      L.render();
      L.toast('Your demo profile is ready.');
      return;
    }
    if (form.id === 'commerce-profile-form') {
      event.preventDefault();
      if (!validateForm(form, 'commerce-profile-error')) return;
      var values = Object.fromEntries(new FormData(form).entries());
      Object.keys(values).forEach(function (key) { values[key] = values[key].trim(); });
      L.state.profile = values;
      L.save();
      document.getElementById('commerce-profile-saved').textContent = 'Your details are saved.';
      var sidebar = document.querySelector('.commerce-profile-sidebar');
      if (sidebar) { sidebar.querySelector('h2').textContent = values.name; sidebar.querySelector('p').textContent = values.phone; sidebar.querySelector('.commerce-avatar').textContent = values.name.charAt(0).toUpperCase(); }
      L.toast('Your details are saved on this device.');
      return;
    }
    if (form.id === 'commerce-tracking-form') { event.preventDefault(); if (form.reportValidity()) findOrder(form.elements.orderId.value); return; }
    if (form.id === 'commerce-contact-form') {
      event.preventDefault();
      if (!validateForm(form, 'commerce-contact-error')) return;
      form.hidden = true;
      var success = document.getElementById('commerce-contact-success');
      success.hidden = false;
      success.setAttribute('tabindex', '-1');
      success.focus();
    }
  });

  document.addEventListener('keydown', function (event) {
    var drawer = document.getElementById('cart-drawer');
    if (!drawer || !drawer.classList.contains('is-open')) return;
    if (event.key === 'Escape') { event.preventDefault(); L.closeCart(); return; }
    if (event.key === 'Tab') {
      var focusables = Array.from(drawer.querySelectorAll('a[href], button:not([disabled]), input:not([disabled]), select, textarea, [tabindex="0"]')).filter(function (el) { return el.getClientRects().length; });
      var first = focusables[0], last = focusables[focusables.length - 1];
      if (!first) { event.preventDefault(); drawer.focus(); return; }
      if (event.shiftKey && (document.activeElement === first || !drawer.contains(document.activeElement))) { event.preventDefault(); last.focus(); }
      else if (!event.shiftKey && (document.activeElement === last || !drawer.contains(document.activeElement))) { event.preventDefault(); first.focus(); }
    }
  });
})();
