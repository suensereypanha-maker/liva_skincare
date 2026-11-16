(function (window, $) {
  'use strict';
  const L = window.Liva;
  const categoryLabels = {
    'skin-care': { en: 'Skin Care', km: 'ថែរក្សាស្បែក' },
    'makeup': { en: 'Makeup', km: 'គ្រឿងសម្អាង' },
    'hair': { en: 'Hair Care', km: 'ថែរក្សាសក់' },
    'fragrances': { en: 'Fragrances', km: 'ទឹកអប់' },
    'nail-care': { en: 'Nail Care', km: 'ថែរក្សាក្រចក' },
    'body': { en: 'Body Care', km: 'ថែរក្សាដងខ្លួន' },
    'sets': { en: 'Sets', km: 'ឈុតផលិតផល' }
  };
  const categories = new Proxy(categoryLabels, {
    get(target, prop) {
      if (prop in target) {
        const item = target[prop];
        const lang = (L && L.getLang && L.getLang()) || 'en';
        return item[lang] || item.en;
      }
      return target[prop];
    },
    ownKeys(target) {
      return Reflect.ownKeys(target);
    },
    getOwnPropertyDescriptor(target, prop) {
      return {
        enumerable: true,
        configurable: true,
        value: this.get(target, prop)
      };
    }
  });

  const skinTypeLabels = {
    'Normal': { en: 'Normal', km: 'ធម្មតា' },
    'Oily': { en: 'Oily', km: 'ខ្លាញ់' },
    'Dry': { en: 'Dry', km: 'ស្ងួត' },
    'Combination': { en: 'Combination', km: 'ចម្រុះ' },
    'Sensitive': { en: 'Sensitive', km: 'ប្រតិកម្ម' }
  };
  const skinTypes = ['Normal', 'Oily', 'Dry', 'Combination', 'Sensitive'];

  const promotionsList = [
    { id: 'new-arrival', en: 'New Arrivals', km: 'ទំនិញទើបមកដល់', label: 'New Arrivals' },
    { id: 'best-seller', en: 'Best Sellers', km: 'លក់ដាច់បំផុត', label: 'Best Sellers' },
    { id: 'on-sale', en: 'On Sale', km: 'មានបញ្ចុះតម្លៃ', label: 'On Sale' }
  ];

  const sortOptions = [
    ['default', { en: 'Default Sorting', km: 'លំនាំដើម' }],
    ['price-low', { en: 'Price: Low to High', km: 'តម្លៃ: ទាប ទៅ ខ្ពស់' }],
    ['price-high', { en: 'Price: High to Low', km: 'តម្លៃ: ខ្ពស់ ទៅ ទាប' }],
    ['rating', { en: 'Highest Rated', km: 'ពិន្ទុខ្ពស់បំផុត' }],
    ['name', { en: 'Name: A–Z', km: 'ឈ្មោះ: A–Z' }]
  ];

  const pendingDetails = 'Brand-confirmed details will be added before launch.';

  const products = [
    {
      id: 'shampoo',
      name: 'SilkSculpt Shampoo',
      category: 'hair',
      price: 18,
      originalPrice: 36,
      discount: '50% off',
      size: '250 mL',
      sizes: ['100 mL', '250 mL', '500 mL'],
      sizePrices: { '100 mL': 10, '250 mL': 18, '500 mL': 30 },
      image: 'assets/shampoo.webp',
      rating: 4.9,
      reviewsCount: 142,
      skinType: ['Normal', 'Oily'],
      promo: ['best-seller', 'on-sale'],
      inStock: true,
      format: 'Single product',
      description: 'Gentle clarifying shampoo formulated for daily hair vitality and balanced scalp hydration.'
    },
    {
      id: 'conditioner',
      name: 'SilkSkin Conditioner',
      category: 'hair',
      price: 20,
      originalPrice: 25,
      discount: '20% off',
      size: '250 mL',
      sizes: ['100 mL', '250 mL', '500 mL'],
      sizePrices: { '100 mL': 12, '250 mL': 20, '500 mL': 34 },
      image: 'assets/conditioner.webp',
      rating: 4.8,
      reviewsCount: 98,
      skinType: ['Normal', 'Dry'],
      promo: ['best-seller'],
      inStock: true,
      format: 'Single product',
      description: 'Deep nourishing conditioner that restores softness and natural moisture balance without weight.'
    },
    {
      id: 'hair-mask',
      name: 'Argan Glow Hair Mask',
      category: 'hair',
      price: 26,
      originalPrice: 37,
      discount: '30% off',
      size: '200 mL',
      sizes: ['100 mL', '200 mL', '400 mL'],
      sizePrices: { '100 mL': 16, '200 mL': 26, '400 mL': 44 },
      image: 'assets/hair-mask.webp',
      rating: 5.0,
      reviewsCount: 184,
      skinType: ['Dry', 'Sensitive'],
      promo: ['best-seller', 'on-sale'],
      inStock: true,
      format: 'Single product',
      description: 'Intensive botanical argan restorative mask for rich cuticle hydration and silky luster.'
    },
    {
      id: 'body-wash',
      name: 'Nephrolepis Body Wash',
      category: 'body',
      price: 16,
      originalPrice: 18,
      discount: '10% off',
      size: '250 mL',
      sizes: ['100 mL', '250 mL', '500 mL'],
      sizePrices: { '100 mL': 9, '250 mL': 16, '500 mL': 28 },
      image: 'assets/body-wash.webp',
      rating: 5.0,
      reviewsCount: 112,
      skinType: ['Normal', 'Dry', 'Sensitive'],
      promo: ['new-arrival'],
      inStock: true,
      format: 'Single product',
      description: 'Refreshing botanical body wash infused with gentle fern and clean mineral notes.'
    },
    {
      id: 'smooth-foundation',
      name: 'Smooth Foundation',
      category: 'makeup',
      price: 20,
      originalPrice: 40,
      discount: '50% off',
      size: '30 mL',
      sizes: ['30 mL', '50 mL'],
      sizePrices: { '30 mL': 20, '50 mL': 32 },
      image: 'assets/botanical.webp',
      rating: 5.0,
      reviewsCount: 220,
      skinType: ['Normal', 'Combination'],
      promo: ['on-sale', 'best-seller'],
      inStock: true,
      format: 'Glass bottle',
      description: 'Lightweight buildable foundation with a natural velvet finish that blends like a dream.'
    },
    {
      id: 'body-lotion',
      name: 'Smooth Body Cream',
      category: 'body',
      price: 22,
      originalPrice: 44,
      discount: '50% off',
      size: '250 mL',
      sizes: ['100 mL', '250 mL', '400 mL'],
      sizePrices: { '100 mL': 12, '250 mL': 22, '400 mL': 36 },
      image: 'assets/body-lotion.webp',
      rating: 5.0,
      reviewsCount: 165,
      skinType: ['Dry', 'Sensitive'],
      promo: ['best-seller', 'on-sale'],
      inStock: true,
      format: 'Single product',
      description: 'Rich nourishing body cream with restorative shea and botanical oils for lasting comfort.'
    },
    {
      id: 'shower-gel',
      name: 'AquaAura Wellness Gel',
      category: 'body',
      price: 16,
      originalPrice: 32,
      discount: '50% off',
      size: '250 mL',
      sizes: ['100 mL', '250 mL', '500 mL'],
      sizePrices: { '100 mL': 9, '250 mL': 16, '500 mL': 28 },
      image: 'assets/shower-gel.webp',
      rating: 4.8,
      reviewsCount: 76,
      skinType: ['Normal', 'Oily'],
      promo: ['best-seller', 'on-sale'],
      inStock: true,
      format: 'Single product',
      description: 'Aromatic foaming body gel with marine minerals and calming botanical extracts.'
    },
    {
      id: 'velvet-rose',
      name: 'Velvet Rose Tint',
      category: 'makeup',
      price: 10,
      originalPrice: 20,
      discount: '50% off',
      size: '15 mL',
      sizes: ['15 mL', '30 mL'],
      sizePrices: { '15 mL': 10, '30 mL': 18 },
      image: 'assets/daily-edit.webp',
      rating: 4.9,
      reviewsCount: 138,
      skinType: ['Normal', 'Dry', 'Sensitive'],
      promo: ['on-sale'],
      inStock: true,
      format: 'Dropper bottle',
      description: 'Dual-action rose serum tint offering sheer radiance and gentle cheek-and-lip moisture.'
    },
    {
      id: 'herbal-haven',
      name: 'Herbal Haven Cleanser',
      category: 'body',
      price: 10,
      originalPrice: 20,
      discount: '50% off',
      size: '120 g',
      sizes: ['60 g', '120 g', '240 g'],
      sizePrices: { '60 g': 6, '120 g': 10, '240 g': 18 },
      image: 'assets/campaign/everyday-poster.webp',
      rating: 5.0,
      reviewsCount: 94,
      skinType: ['Oily', 'Sensitive'],
      promo: ['best-seller', 'on-sale'],
      inStock: true,
      format: 'Solid bar',
      description: 'Artisanal cold-pressed herbal cleansing bar enriched with olive oil and green tea extract.'
    },
    {
      id: 'essence-body-gel',
      name: 'Essence Body Gel',
      category: 'body',
      price: 30,
      originalPrice: 60,
      discount: '50% off',
      size: '300 mL',
      sizes: ['150 mL', '300 mL', '500 mL'],
      sizePrices: { '150 mL': 18, '300 mL': 30, '500 mL': 46 },
      image: 'assets/daily-edit-detail.webp',
      rating: 4.8,
      reviewsCount: 88,
      skinType: ['Normal', 'Combination'],
      promo: ['on-sale'],
      inStock: true,
      format: 'Pump bottle',
      description: 'Hydrating cooling gel essence designed for quick absorption and all-day dewiness.'
    },
    {
      id: 'hydraluxe-serum',
      name: 'HydraLuxe Serum',
      category: 'skin-care',
      price: 20,
      originalPrice: 40,
      discount: '50% off',
      size: '50 mL',
      sizes: ['30 mL', '50 mL', '100 mL'],
      sizePrices: { '30 mL': 14, '50 mL': 20, '100 mL': 35 },
      image: 'assets/campaign/hair-pair.webp',
      rating: 4.9,
      reviewsCount: 310,
      skinType: ['Dry', 'Sensitive', 'Combination'],
      promo: ['best-seller', 'on-sale'],
      inStock: true,
      format: 'Glass dropper',
      description: 'Concentrated hyaluronic and peptide serum for luminous plumping and cellular barrier repair.'
    },
    {
      id: 'oceanmist-moisturizer',
      name: 'OceanMist Moisturizer',
      category: 'skin-care',
      price: 20,
      originalPrice: 40,
      discount: '50% off',
      size: '60 mL',
      sizes: ['30 mL', '60 mL', '100 mL'],
      sizePrices: { '30 mL': 13, '60 mL': 20, '100 mL': 32 },
      image: 'assets/campaign/your-moment.webp',
      rating: 4.8,
      reviewsCount: 156,
      skinType: ['Normal', 'Dry'],
      promo: ['new-arrival', 'on-sale'],
      inStock: true,
      format: 'Glass jar',
      description: 'Velvety cream moisturizer infused with deep sea algae and botanical squalane.'
    },
    {
      id: 'silksculpt-serum',
      name: 'SilkSculpt Serum',
      category: 'skin-care',
      price: 35,
      originalPrice: 70,
      discount: '50% off',
      size: '50 mL',
      sizes: ['30 mL', '50 mL', '100 mL'],
      sizePrices: { '30 mL': 24, '50 mL': 35, '100 mL': 60 },
      image: 'assets/hero.webp',
      rating: 4.9,
      reviewsCount: 240,
      skinType: ['Normal', 'Combination'],
      promo: ['best-seller', 'on-sale'],
      inStock: true,
      format: 'Glass bottle',
      description: 'Firming daily antioxidant facial serum that visibly smooths skin texture and enhances glow.'
    },
    {
      id: 'ritual-duo',
      name: 'Hair Pair Duo Set',
      category: 'sets',
      price: 38,
      originalPrice: 76,
      discount: '50% off',
      size: '2 × 250 mL',
      sizes: ['2 × 250 mL'],
      sizePrices: { '2 × 250 mL': 38 },
      image: 'assets/ritual-duo.webp',
      rating: 5.0,
      reviewsCount: 340,
      skinType: ['Normal', 'Oily', 'Dry'],
      promo: ['best-seller', 'on-sale'],
      inStock: true,
      format: 'Two-product set',
      description: 'Shampoo and Conditioner together in a sample set. Two 250 mL products, at the same total price as the individual formats.',
      contents: 'Shampoo · 250 mL; Conditioner · 250 mL'
    },
    {
      id: 'travel-set',
      name: 'Botanical Travel Set',
      category: 'sets',
      price: 28,
      originalPrice: 40,
      discount: '30% off',
      size: '4 × 75 mL',
      sizes: ['4 × 75 mL'],
      sizePrices: { '4 × 75 mL': 28 },
      image: 'assets/travel-set.webp',
      rating: 4.9,
      reviewsCount: 205,
      skinType: ['Combination', 'Normal'],
      promo: ['on-sale'],
      inStock: true,
      format: 'Four-product set',
      description: 'A sample assortment of Shampoo, Conditioner, Body Wash and Shower Gel. Four products in 75 mL formats.',
      contents: 'Shampoo, Conditioner, Body Wash and Shower Gel · 75 mL each'
    },
    {
      id: 'botanical-fragrance',
      name: 'Wild Flora Mist',
      category: 'fragrances',
      price: 42,
      originalPrice: 60,
      discount: '30% off',
      size: '100 mL',
      sizes: ['50 mL', '100 mL', '200 mL'],
      sizePrices: { '50 mL': 26, '100 mL': 42, '200 mL': 72 },
      image: 'assets/botanical.webp',
      rating: 4.9,
      reviewsCount: 118,
      skinType: ['Normal', 'Dry', 'Sensitive', 'Combination', 'Oily'],
      promo: ['new-arrival', 'on-sale'],
      inStock: true,
      format: 'Glass spray bottle',
      description: 'Subtle uplifting fragrance mist with hints of wild bergamot, cedarwood and morning dew.'
    },
    {
      id: 'nail-elixir',
      name: 'Botanical Nail Elixir',
      category: 'nail-care',
      price: 15,
      originalPrice: 20,
      discount: '25% off',
      size: '15 mL',
      sizes: ['15 mL', '30 mL'],
      sizePrices: { '15 mL': 15, '30 mL': 25 },
      image: 'assets/daily-edit.webp',
      rating: 4.7,
      reviewsCount: 62,
      skinType: ['Normal', 'Dry', 'Sensitive', 'Combination', 'Oily'],
      promo: ['on-sale'],
      inStock: true,
      format: 'Dropper bottle',
      description: 'Strengthening cuticle and nail serum with organic jojoba and cold-pressed botanical vitamin E.'
    },
    {
      id: 'soothing-toner',
      name: 'Calm Sage Facial Mist',
      category: 'skin-care',
      price: 24,
      originalPrice: 30,
      discount: '20% off',
      size: '150 mL',
      sizes: ['75 mL', '150 mL', '300 mL'],
      sizePrices: { '75 mL': 15, '150 mL': 24, '300 mL': 42 },
      image: 'assets/daily-edit-detail.webp',
      rating: 4.8,
      reviewsCount: 89,
      skinType: ['Sensitive', 'Dry'],
      promo: ['new-arrival'],
      inStock: true,
      format: 'Mist bottle',
      description: 'Balancing alcohol-free facial toner mist that relieves redness and primes the skin.'
    }
  ];

  L.products = products;
  L.comparison = Array.isArray(L.comparison) ? L.comparison.filter(id => products.some(p => p.id === id)).slice(0, 3) : [];

  const esc = value => L.escape(String(value == null ? '' : value));
  const icon = name => L.icon(name);
  const money = value => L.money(value);
  const saved = id => L.state.wishlist.includes(id);
  const compared = id => L.comparison.includes(id);
  const findProduct = id => products.find(product => product.id === id);

  let wishlistSignature = '';
  let purchaseObserver;
  let footerObserver;

  function productImage(product, eager) {
    return `<img src="${esc(product.image)}" alt="LIVA ${esc(product.name)}" loading="${eager ? 'eager' : 'lazy'}" width="720" height="720">`;
  }

  function compareButton(product) {
    const active = compared(product.id);
    return `<button class="cat-compare-toggle${active ? ' is-selected' : ''}" type="button" data-id="${product.id}" aria-pressed="${active}" aria-label="${active ? 'Remove' : 'Add'} ${esc(product.name)} ${active ? 'from' : 'to'} comparison"><span class="cat-compare-check" aria-hidden="true">${active ? icon('check') : ''}</span><span class="cat-compare-label">${active ? 'Selected' : 'Compare'}</span></button>`;
  }

  function addButton(product) {
    return `<button class="cat-card-add cat-quick-add" type="button" data-id="${product.id}" aria-label="Add ${esc(product.name)} to bag"><span>Add to bag</span>${icon('plus')}</button>`;
  }

  L.productCard = function (product) {
    if (!product) return '';
    const isSaved = saved(product.id);
    const categoryName = categories[product.category] || 'Care';
    const ratingVal = product.rating ? Number(product.rating).toFixed(1) : '4.9';

    return `<article class="product-card" data-product-id="${esc(product.id)}">
      <div class="cat-card-media">
        <a class="cat-card-image" href="#product/${product.id}" aria-label="${esc(product.name)}">
          ${productImage(product)}
        </a>
        ${product.discount ? `<span class="cat-card-badge">${esc(product.discount)}</span>` : ''}
        <div class="cat-card-actions-float">
          <button class="cat-action-circle cat-wishlist${isSaved ? ' is-saved' : ''}" type="button" data-id="${product.id}" aria-label="${isSaved ? 'Remove' : 'Save'} ${esc(product.name)} ${isSaved ? 'from' : 'to'} wishlist" aria-pressed="${isSaved}">
            ${icon('heart')}
          </button>
          <button class="cat-action-circle cat-quickview-btn" type="button" data-id="${product.id}" aria-label="Quick view ${esc(product.name)}">
            ${icon('eye')}
          </button>
          <button class="cat-action-circle cat-quick-add" type="button" data-id="${product.id}" aria-label="Add ${esc(product.name)} to bag">
            ${icon('bag')}
          </button>
        </div>
      </div>
      <div class="cat-card-body">
        <div class="cat-card-meta-line">
          <span class="cat-card-category">${esc(categoryName)}</span>
          <span class="cat-card-rating">${icon('starFill')} ${ratingVal}</span>
        </div>
        <h3 class="cat-card-name"><a href="#product/${product.id}">${esc(product.name)}</a></h3>
        <div class="cat-card-price-line">
          <span class="cat-card-price">${money(product.price)}</span>
          ${product.originalPrice ? `<span class="cat-card-orig-price">${money(product.originalPrice)}</span>` : ''}
        </div>
      </div>
    </article>`;
  };

  function normalizedParams(params) {
    return params instanceof URLSearchParams ? params : new URLSearchParams(params || '');
  }

  function filterProducts(params) {
    const category = params.get('category') || '';
    const skinType = params.get('skinType') || '';
    const minPrice = Number(params.get('minPrice')) || 10;
    const maxPrice = Number(params.get('maxPrice')) || 100;
    const rating = Number(params.get('rating')) || 0;
    const promo = params.get('promo') || '';
    const stock = params.get('stock') || '';
    const query = (params.get('q') || '').trim().toLowerCase();

    let result = products.filter(product => {
      if (category && product.category !== category) return false;
      if (skinType && !product.skinType.includes(skinType) && !product.skinType.includes('All')) return false;
      if (product.price < minPrice || product.price > maxPrice) return false;
      if (rating > 0 && (product.rating || 0) < rating) return false;
      if (promo && (!product.promo || !product.promo.includes(promo))) return false;
      if (stock === 'in-stock' && !product.inStock) return false;
      if (stock === 'out-of-stock' && product.inStock) return false;
      if (query) {
        const text = `${product.name} ${product.size} ${categories[product.category] || ''} ${product.description || ''} ${product.contents || ''}`.toLowerCase();
        if (!text.includes(query)) return false;
      }
      return true;
    });

    switch (params.get('sort')) {
      case 'price-low':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        result.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        result.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        break;
      case 'name':
        result.sort((a, b) => a.name.localeCompare(b.name));
        break;
    }
    return result;
  }

  function comparisonSlot() {
    return `<div id="comparison-tray">${L.renderComparisonTray()}</div>`;
  }

  L.renderComparisonTray = function () {
    const items = L.comparison.map(findProduct).filter(Boolean);
    if (!items.length) return '';
    return `<div class="cat-comparison-tray"><div class="cat-comparison-selection"><strong>Compare <span>${items.length}/3</span></strong><div class="cat-comparison-items">${items.map(product => `<button type="button" class="cat-compare-remove" data-id="${product.id}" aria-label="Remove ${esc(product.name)} from comparison">${esc(product.name)}${icon('close')}</button>`).join('')}</div></div><div class="cat-comparison-actions">${items.length >= 2 ? `<a class="btn btn-primary" href="#compare">Compare ${items.length} products ${icon('arrow')}</a>` : '<span class="cat-comparison-hint">Select one more product</span>'}<button class="cat-compare-clear" type="button">Clear</button></div><span class="cat-visually-hidden" role="status">${items.length} of 3 products selected for comparison</span></div>`;
  };

  function renderSidebar(params) {
    const category = params.get('category') || '';
    const skinType = params.get('skinType') || '';
    const minPrice = Number(params.get('minPrice')) || 10;
    const maxPrice = Number(params.get('maxPrice')) || 100;
    const rating = Number(params.get('rating')) || 0;
    const promo = params.get('promo') || '';
    const stock = params.get('stock') || '';

    const minPct = Math.max(0, Math.min(100, ((minPrice - 10) / (100 - 10)) * 100));
    const maxPct = Math.max(0, Math.min(100, ((maxPrice - 10) / (100 - 10)) * 100));

    return `<aside class="cat-filter-sidebar" id="cat-filter-sidebar" aria-label="Product filters">
      <div class="cat-filter-sidebar-head">
        <h2 class="cat-filter-sidebar-title">${L.t('filterOptions')}</h2>
        <button type="button" class="icon-button cat-filter-close" id="cat-filter-close" aria-label="Close filters">${icon('close')}</button>
      </div>

      <!-- Categories Filter -->
      <div class="cat-filter-group">
        <h3 class="cat-filter-heading">${L.t('byCategories')}</h3>
        <ul class="cat-filter-list">
          <li>
            <button type="button" class="cat-filter-link${!category ? ' is-active' : ''}" data-filter-type="category" data-filter-value="">
              <span>${L.t('allCategories')}</span>
              <span class="cat-filter-count">${products.length}</span>
            </button>
          </li>
          ${Object.entries(categories).map(([key, label]) => {
      const count = products.filter(p => p.category === key).length;
      const isActive = category === key;
      return `<li>
              <button type="button" class="cat-filter-link${isActive ? ' is-active' : ''}" data-filter-type="category" data-filter-value="${key}">
                <span>${label}</span>
                <span class="cat-filter-count">${count}</span>
              </button>
            </li>`;
    }).join('')}
        </ul>
      </div>

      <!-- Skin Type Filter -->
      <div class="cat-filter-group">
        <h3 class="cat-filter-heading">${L.t('bySkinType')}</h3>
        <ul class="cat-filter-list">
          ${skinTypes.map(type => {
      const isActive = skinType === type;
      const label = skinTypeLabels[type]?.[L.getLang()] || type;
      return `<li>
              <button type="button" class="cat-filter-link${isActive ? ' is-active' : ''}" data-filter-type="skinType" data-filter-value="${type}">
                <span>${label}</span>
              </button>
            </li>`;
    }).join('')}
        </ul>
      </div>

      <!-- Price Range Slider -->
      <div class="cat-filter-group">
        <div class="cat-price-heading-row">
          <h3 class="cat-filter-heading">${L.t('price')}</h3>
        </div>
        <p class="cat-price-val-display" id="cat-price-val-display">$${minPrice.toFixed(2)} - $${maxPrice.toFixed(2)}</p>
        <div class="cat-dual-slider">
          <div class="cat-slider-track"></div>
          <div class="cat-slider-range" id="cat-slider-range" style="left: ${minPct}%; right: ${100 - maxPct}%;"></div>
          <input type="range" class="cat-slider-input" id="cat-range-min" min="10" max="100" step="5" value="${minPrice}" aria-label="Minimum price">
          <input type="range" class="cat-slider-input" id="cat-range-max" min="10" max="100" step="5" value="${maxPrice}" aria-label="Maximum price">
        </div>
      </div>

      <!-- Review / Ratings Filter -->
      <div class="cat-filter-group">
        <h3 class="cat-filter-heading">${L.t('review')}</h3>
        <ul class="cat-ratings-list">
          ${[5, 4, 3, 2, 1].map(r => {
      const isActive = rating === r;
      const stars = '★'.repeat(r) + '☆'.repeat(5 - r);
      return `<li>
              <button type="button" class="cat-rating-btn${isActive ? ' is-active' : ''}" data-filter-type="rating" data-filter-value="${r}">
                <span class="cat-stars-row" aria-hidden="true">${stars}</span>
                <span class="cat-rating-label">${r} ${L.t('star')}${r === 5 ? '' : ' ' + L.t('andAbove')}</span>
              </button>
            </li>`;
    }).join('')}
        </ul>
      </div>

      <!-- By Promotions Filter -->
      <div class="cat-filter-group">
        <h3 class="cat-filter-heading">${L.t('byPromotions')}</h3>
        <div class="cat-checkbox-group">
          ${promotionsList.map(item => {
      const isChecked = promo === item.id;
      const label = item[L.getLang()] || item.en || item.label;
      return `<label class="cat-custom-checkbox">
              <input type="checkbox" class="cat-promo-toggle" value="${item.id}"${isChecked ? ' checked' : ''}>
              <span class="cat-checkbox-mark"></span>
              <span class="cat-checkbox-text">${label}</span>
            </label>`;
    }).join('')}
        </div>
      </div>

      <!-- Availability Filter -->
      <div class="cat-filter-group">
        <h3 class="cat-filter-heading">${L.t('availability')}</h3>
        <div class="cat-checkbox-group">
          <label class="cat-custom-checkbox">
            <input type="checkbox" class="cat-stock-toggle" value="in-stock"${stock === 'in-stock' ? ' checked' : ''}>
            <span class="cat-checkbox-mark"></span>
            <span class="cat-checkbox-text">${L.t('inStock')}</span>
          </label>
          <label class="cat-custom-checkbox">
            <input type="checkbox" class="cat-stock-toggle" value="out-of-stock"${stock === 'out-of-stock' ? ' checked' : ''}>
            <span class="cat-checkbox-mark"></span>
            <span class="cat-checkbox-text">${L.t('outOfStock')}</span>
          </label>
        </div>
      </div>
    </aside>`;
  }

  function renderActiveFilters(params) {
    const category = params.get('category') || '';
    const skinType = params.get('skinType') || '';
    const minPrice = Number(params.get('minPrice')) || 10;
    const maxPrice = Number(params.get('maxPrice')) || 100;
    const rating = Number(params.get('rating')) || 0;
    const promo = params.get('promo') || '';
    const stock = params.get('stock') || '';
    const query = (params.get('q') || '').trim();

    const chips = [];

    if (minPrice > 10 || maxPrice < 100) {
      chips.push({ key: 'price', label: `${L.t('price')} : $${minPrice.toFixed(2)} - $${maxPrice.toFixed(2)}` });
    }
    if (promo) {
      const pObj = promotionsList.find(x => x.id === promo);
      chips.push({ key: 'promo', label: pObj ? (pObj[L.getLang()] || pObj.en || pObj.label) : promo });
    }
    if (stock) {
      chips.push({ key: 'stock', label: stock === 'in-stock' ? L.t('inStock') : L.t('outOfStock') });
    }
    if (category) {
      chips.push({ key: 'category', label: categories[category] || category });
    }
    if (skinType) {
      const skinLabel = skinTypeLabels[skinType]?.[L.getLang()] || skinType;
      chips.push({ key: 'skinType', label: skinLabel });
    }
    if (rating > 0) {
      chips.push({ key: 'rating', label: `${rating}★ ${L.t('andAbove')}` });
    }
    if (query) {
      chips.push({ key: 'q', label: `“${query}”` });
    }

    if (!chips.length) return '';

    return `<div class="cat-active-filters-bar">
      <span class="cat-active-filters-label">${L.t('activeFilter')}</span>
      <div class="cat-active-chips">
        ${chips.map(chip => `
          <button type="button" class="cat-active-chip" data-remove-filter="${chip.key}" aria-label="Remove filter ${esc(chip.label)}">
            <span>${esc(chip.label)}</span>
            <span class="cat-chip-close" aria-hidden="true">${icon('close')}</span>
          </button>
        `).join('')}
        <button type="button" class="cat-clear-all-link">${L.t('clearAll')}</button>
      </div>
    </div>`;
  }

  function renderPagination(currentPage, totalPages) {
    if (totalPages <= 1) return '';
    const pages = [];
    for (let i = 1; i <= totalPages; i++) {
      pages.push(i);
    }
    return `<nav class="cat-pagination" aria-label="Catalog pages">
      <button type="button" class="cat-page-btn cat-page-prev" data-page="${currentPage - 1}" ${currentPage === 1 ? 'disabled aria-disabled="true"' : ''} aria-label="Previous page">
        ${icon('chevron')}
      </button>
      <div class="cat-page-numbers">
        ${pages.map(p => `
          <button type="button" class="cat-page-number${p === currentPage ? ' is-active' : ''}" data-page="${p}" ${p === currentPage ? 'aria-current="page"' : ''}>
            ${p}
          </button>
        `).join('')}
      </div>
      <button type="button" class="cat-page-btn cat-page-next" data-page="${currentPage + 1}" ${currentPage === totalPages ? 'disabled aria-disabled="true"' : ''} aria-label="Next page">
        ${icon('chevron')}
      </button>
    </nav>`;
  }

  function renderTrustFeatures() {
    return `<section class="cat-trust-features" aria-label="Store guarantees">
      <div class="cat-trust-card">
        <div class="cat-trust-icon-box">${icon('box')}</div>
        <div class="cat-trust-info">
          <h4>${L.t('freeShipping')}</h4>
          <p>${L.t('freeShippingDesc')}</p>
        </div>
      </div>
      <div class="cat-trust-card">
        <div class="cat-trust-icon-box">${icon('card')}</div>
        <div class="cat-trust-info">
          <h4>${L.t('flexiblePayment')}</h4>
          <p>${L.t('flexiblePaymentDesc')}</p>
        </div>
      </div>
      <div class="cat-trust-card">
        <div class="cat-trust-icon-box">${icon('support')}</div>
        <div class="cat-trust-info">
          <h4>${L.t('support247')}</h4>
          <p>${L.t('support247Desc')}</p>
        </div>
      </div>
    </section>`;
  }

  L.renderShop = function (rawParams) {
    const params = normalizedParams(rawParams);
    const query = params.get('q') || '';
    const sort = params.get('sort') || 'default';
    const allFiltered = filterProducts(params);

    const perPage = 12;
    const totalResults = allFiltered.length;
    const totalPages = Math.max(1, Math.ceil(totalResults / perPage));
    const currentPage = Math.max(1, Math.min(totalPages, Number(params.get('page')) || 1));
    const paginatedItems = allFiltered.slice((currentPage - 1) * perPage, currentPage * perPage);

    const startIdx = totalResults ? (currentPage - 1) * perPage + 1 : 0;
    const endIdx = Math.min(currentPage * perPage, totalResults);

    const category = params.get('category') || '';
    const skinType = params.get('skinType') || '';
    const minPrice = Number(params.get('minPrice')) || 10;
    const maxPrice = Number(params.get('maxPrice')) || 100;
    const rating = Number(params.get('rating')) || 0;
    const promo = params.get('promo') || '';
    const stock = params.get('stock') || '';
    const activeCount = [
      Boolean(category),
      Boolean(skinType),
      minPrice > 10 || maxPrice < 100,
      rating > 0,
      Boolean(promo),
      Boolean(stock)
    ].filter(Boolean).length;

    return `<div class="cat-shop-wrapper">
      <!-- Breadcrumb Header -->
      <section class="cat-shop-banner">
        <div class="container cat-shop-banner-content">
          <h1 id="shop-title">${L.t('shop')}</h1>
          <nav class="cat-breadcrumb-trail" aria-label="Breadcrumb">
            <a href="#home">${L.t('home')}</a>
            <span aria-hidden="true">/</span>
            <span aria-current="page">${L.t('shop')}</span>
          </nav>
        </div>
      </section>

      <!-- Mobile Backdrop (OUTSIDE the 2-column grid layout) -->
      <div class="cat-sidebar-overlay" id="cat-sidebar-overlay"></div>

      <!-- Main 2-Column Grid Layout -->
      <div class="container cat-shop-layout">
        <!-- Column 1: Sidebar Filter -->
        ${renderSidebar(params)}

        <!-- Column 2: Main Products Area -->
        <main class="cat-shop-main" id="shop-main">
          <!-- Top Results Bar -->
          <div class="cat-results-header">
            <div class="cat-results-counter">
              <p aria-live="polite">${L.t('showing')} ${startIdx}–${endIdx} ${L.t('of')} ${totalResults} ${L.t('results')}</p>
            </div>
            <div class="cat-results-controls">
              <button type="button" class="cat-mobile-filter-trigger${activeCount ? ' is-active' : ''}" id="cat-mobile-filter-open">
                ${icon('filter')}
                <span>${L.t('filterOptions')}</span>
                ${activeCount ? `<span class="cat-filter-count-badge">${activeCount}</span>` : ''}
              </button>
              <div class="cat-sort-control">
                <label for="cat-sort-select" class="cat-sort-label">${L.t('sortBy')}</label>
                <div class="cat-sort-select-wrap">
                  <select id="cat-sort-select" aria-label="Sort products">
                    ${sortOptions.map(([val, opt]) => `<option value="${val}"${sort === val ? ' selected' : ''}>${opt[L.getLang()] || opt.en}</option>`).join('')}
                  </select>
                  ${icon('chevron')}
                </div>
              </div>
            </div>
          </div>

          <!-- Active Filter Chips -->
          ${renderActiveFilters(params)}

          <!-- Comparison Tray -->
          ${comparisonSlot()}

          <!-- Product Grid (3 Columns) -->
          ${paginatedItems.length ? `
            <div class="cat-product-grid">
              ${paginatedItems.map(L.productCard).join('')}
            </div>
            ${renderPagination(currentPage, totalPages)}
          ` : `
            <div class="cat-empty">
              <span class="cat-empty-symbol">${icon('search')}</span>
              <h2>No products found</h2>
              <p>Try adjusting or clearing your filters to see more of our collection.</p>
              <button type="button" class="btn btn-primary cat-clear-all-link">Clear all filters ${icon('arrow')}</button>
            </div>
          `}
        </main>
      </div>

      <!-- Trust Assurance Badges -->
      <div class="container">
        ${renderTrustFeatures()}
      </div>
    </div>`;
  };

  L.renderProduct = function (id) {
    const product = findProduct(id);
    if (!product) return `<section class="container cat-empty"><p class="eyebrow">PRODUCT NOT FOUND</p><h1>Back to the collection.</h1><p>This product is not part of the current sample collection.</p><a class="btn btn-primary" href="#shop">Shop all ${icon('arrow')}</a></section>`;
    const isSaved = saved(id);
    const related = products.filter(item => item.id !== id && item.category === product.category).slice(0, 3);
    const categoryName = categories[product.category] || 'Care';
    const productSizes = product.sizes || [product.size];
    const sizeSelectorHtml = productSizes.length > 1 ? `
      <div class="cat-size-selector-wrap">
        <div class="cat-size-selector-header">
          <span class="cat-size-selector-label">${L.t('selectSize')}</span>
          <strong id="cat-current-size-name">${esc(product.size)}</strong>
        </div>
        <div class="cat-size-pills" role="radiogroup" aria-label="${L.t('selectSize')}">
          ${productSizes.map(s => {
      const p = (product.sizePrices && product.sizePrices[s] != null) ? product.sizePrices[s] : product.price;
      const isSelected = s === product.size;
      return `<button type="button" class="cat-size-pill${isSelected ? ' is-active' : ''}" data-size="${esc(s)}" data-price="${p}" role="radio" aria-checked="${isSelected}">
              <span class="cat-size-vol">${esc(s)}</span>
             
            </button>`;
    }).join('')}
        </div>
      </div>
    ` : '';

    return `<div class="cat-product-page container"><nav class="cat-breadcrumb" aria-label="Breadcrumb"><a href="#shop">${L.t('theCollection')}</a><span aria-hidden="true">/</span><a href="#shop?category=${product.category}">${categoryName}</a><span aria-hidden="true">/</span><span aria-current="page">${esc(product.name)}</span></nav>
      <section class="cat-product-detail" aria-labelledby="cat-product-title"><div class="cat-product-gallery"><div class="cat-product-photo">${productImage(product, true)}<span class="cat-photo-label">${categoryName}</span></div><p class="cat-photo-footnote">${L.t('samplePackaging')}</p></div><div class="cat-product-info"><p class="eyebrow">LIVA / ${categoryName.toUpperCase()}</p><div class="cat-product-title-row"><h1 id="cat-product-title">${esc(product.name)}</h1><button class="icon-button cat-wishlist cat-detail-wishlist${isSaved ? ' is-saved' : ''}" type="button" data-id="${id}" aria-label="${isSaved ? 'Remove' : 'Save'} ${esc(product.name)} ${isSaved ? 'from' : 'to'} wishlist" aria-pressed="${isSaved}">${icon('heart')}</button></div><div class="cat-product-price-row"><p class="cat-product-price" id="cat-display-price">${money(product.price)}</p><span id="cat-display-size">${esc(product.size)}</span></div><p class="cat-description">${esc(product.description)}</p>
      <dl class="cat-product-facts"><div><dt>${L.t('format')}</dt><dd>${esc(product.format)}</dd></div><div><dt>${L.t('size')}</dt><dd id="cat-fact-size">${esc(product.size)}</dd></div>${product.contents ? `<div><dt>${L.t('included')}</dt><dd>${esc(product.contents)}</dd></div>` : ''}</dl>
      <form id="cat-product-form" data-id="${product.id}" data-selected-size="${esc(product.size)}" data-selected-price="${product.price}">
        ${sizeSelectorHtml}
        <div class="cat-purchase-label"><label for="cat-product-qty">${L.t('quantity')}</label><span>USD</span></div>
        <div class="cat-purchase-row">
          <div class="cat-quantity"><button type="button" class="cat-qty-change" data-delta="-1" aria-label="Decrease quantity">${icon('minus')}</button><input id="cat-product-qty" name="quantity" type="number" min="1" max="99" step="1" value="1" inputmode="numeric"><button type="button" class="cat-qty-change" data-delta="1" aria-label="Increase quantity">${icon('plus')}</button></div>
          <button class="cat-detail-add" type="submit"><span>${L.t('addToBag')}</span><span data-cat-total>${money(product.price)}</span>${icon('arrow')}</button>
        </div>
      </form>
      <div class="cat-product-compare">${compareButton(product)}<a class="cat-text-link" href="#shop?category=${product.category}">${L.t('explore')} ${categoryName} ${icon('arrow')}</a></div><div class="cat-preview-note cat-product-preview"><strong>Sample product</strong><span>This is a storefront preview. Product details and prices are subject to confirmation; checkout is a demonstration.</span></div>
      <div class="cat-product-accordions">${['Formula & ingredients', 'Suitability', 'How to use'].map(label => `<details><summary>${label}${icon('plus')}</summary><p>${pendingDetails}</p></details>`).join('')}</div></div></section>
      ${comparisonSlot()}<div class="cat-mobile-purchase" id="cat-mobile-purchase" aria-label="Product purchase"><div><strong>${esc(product.name)}</strong><span id="cat-mobile-size-display">${esc(product.size)} · <span data-cat-quantity>1</span> selected</span></div><button type="submit" form="cat-product-form"><span>${L.t('addToBag')}</span><span data-cat-total>${money(product.price)}</span></button></div>
      <section class="cat-related" aria-labelledby="cat-related-title"><div class="cat-section-heading"><div><p class="eyebrow">${L.t('continueExploring')}</p><h2 id="cat-related-title">${L.t('moreInCategory')}</h2><p>${L.t('otherProducts')}</p></div><a class="cat-text-link" href="#shop?category=${product.category}">${L.t('viewCollection')} ${icon('arrow')}</a></div><div class="cat-product-grid">${related.map(L.productCard).join('')}</div></section></div>`;
  };

  function wishlistContent(items) {
    return items.length ? `<div class="cat-results-bar"><p>${items.length} saved ${items.length === 1 ? 'product' : 'products'}</p><a class="cat-text-link" href="#shop">Keep exploring ${icon('arrow')}</a></div><div class="cat-product-grid">${items.map(L.productCard).join('')}</div>` : `<div class="cat-empty"><span class="cat-empty-symbol">${icon('heart')}</span><h2>Keep your options open.</h2><p>Use the heart on any product to save it here for later.</p><a href="#shop" class="btn btn-primary">Explore the collection ${icon('arrow')}</a></div>`;
  }

  L.renderWishlist = function () {
    wishlistSignature = L.state.wishlist.join('|');
    return `<section class="cat-wishlist-page container"><div class="cat-page-heading"><p class="eyebrow">YOUR DAILY EDIT</p><h1>Saved for later.</h1><p>Your shortlist, ready when you are.</p></div>${comparisonSlot()}<div id="cat-wishlist-content">${wishlistContent(products.filter(product => saved(product.id)))}</div></section>`;
  };

  function compareContent() {
    const items = L.comparison.map(findProduct).filter(Boolean);
    if (items.length < 2) return `<div class="cat-empty"><h2>${items.length ? 'Choose one more product.' : 'Start with two products.'}</h2><p>Select up to three products from the collection to compare their category, format, size and price.</p>${items.length ? `<p class="cat-comparison-kept">Selected: <strong>${esc(items[0].name)}</strong><button type="button" class="cat-compare-remove" data-id="${items[0].id}" aria-label="Remove ${esc(items[0].name)} from comparison">Remove ${icon('close')}</button></p>` : ''}<a href="#shop" class="btn btn-primary">Choose products ${icon('arrow')}</a></div>`;
    return `${items.length > 2 ? '<p class="cat-compare-swipe">Swipe across to compare all three products →</p>' : ''}<div class="cat-comparison-scroll" tabindex="0" role="region" aria-label="Product comparison table. Scroll horizontally on smaller screens."><table class="cat-comparison-table" data-count="${items.length}"><caption>Compare sample product formats and prices</caption><thead><tr><th scope="col">Your shortlist</th>${items.map(product => `<th scope="col"><button class="cat-compare-remove" type="button" data-id="${product.id}" aria-label="Remove ${esc(product.name)} from comparison">Remove ${icon('close')}</button><a href="#product/${product.id}" class="cat-compare-product">${productImage(product)}<span>${esc(product.name)}</span></a></th>`).join('')}</tr></thead><tbody>${[['Category', p => categories[p.category] || p.category], ['Format', p => p.format], ['Size', p => p.size], ['Price', p => money(p.price)], ['Included', p => p.contents || p.name]].map(([label, value]) => `<tr><th scope="row">${label}</th>${items.map(product => `<td>${esc(value(product))}</td>`).join('')}</tr>`).join('')}<tr><th scope="row">Product details</th>${items.map(() => `<td>${pendingDetails}</td>`).join('')}</tr><tr class="cat-comparison-buy"><th scope="row"><span class="cat-visually-hidden">Add to bag</span></th>${items.map(product => `<td>${addButton(product)}</td>`).join('')}</tr></tbody></table></div>`;
  }

  L.renderCompare = function () {
    return `<section class="cat-compare-page container"><div class="cat-page-heading"><p class="eyebrow">A CLOSER LOOK</p><h1>Side by side.</h1><p>Compare the facts. Choose your edit.</p></div><div class="cat-compare-toolbar"><a class="cat-text-link" href="#shop">${icon('arrow')} Back to collection</a><button class="cat-compare-clear" type="button"${L.comparison.length ? '' : ' hidden'}>Clear comparison</button></div><div id="cat-compare-content">${compareContent()}</div><p class="cat-compare-disclosure">Sample products and prices for the design preview. Formula, suitability and use details will be confirmed before launch.</p></section>`;
  };

  function updateShopParams(mutations) {
    const hash = window.location.hash || '#shop';
    const queryPart = hash.includes('?') ? hash.split('?')[1] : '';
    const params = new URLSearchParams(queryPart);

    Object.entries(mutations).forEach(([k, v]) => {
      if (v === null || v === undefined || v === '') {
        params.delete(k);
      } else {
        params.set(k, String(v));
      }
    });

    const newQuery = params.toString();
    L.navigate('#shop' + (newQuery ? '?' + newQuery : ''));
  }

  function syncComparison() {
    $('.cat-compare-toggle').each(function () {
      const product = findProduct(this.dataset.id);
      if (!product) return;
      const active = compared(product.id);
      $(this).toggleClass('is-selected', active).attr('aria-pressed', String(active)).attr('aria-label', `${active ? 'Remove' : 'Add'} ${product.name} ${active ? 'from' : 'to'} comparison`);
      $(this).find('.cat-compare-check').html(active ? icon('check') : '');
      $(this).find('.cat-compare-label').text(active ? 'Selected' : 'Compare');
    });
    $('#comparison-tray').html(L.renderComparisonTray());
    $('.cat-compare-toolbar .cat-compare-clear').prop('hidden', !L.comparison.length);
    document.dispatchEvent(new CustomEvent('liva:comparison-change'));
  }

  function updateCompareContent() {
    if ($('#cat-compare-content').length) $('#cat-compare-content').html(compareContent());
  }

  function syncWishlist() {
    $('.cat-wishlist').each(function () {
      const product = findProduct(this.dataset.id), active = saved(this.dataset.id);
      $(this).toggleClass('is-saved', active).attr('aria-pressed', String(active)).attr('aria-label', `${active ? 'Remove' : 'Save'} ${product ? product.name : 'product'} ${active ? 'from' : 'to'} wishlist`);
    });
    const signature = L.state.wishlist.join('|');
    if ($('#cat-wishlist-content').length && signature !== wishlistSignature) {
      const restoreFocus = document.activeElement && document.activeElement.closest('#cat-wishlist-content');
      $('#cat-wishlist-content').html(wishlistContent(products.filter(product => saved(product.id))));
      const nextFocus = document.querySelector('#cat-wishlist-content button, #cat-wishlist-content a');
      if (restoreFocus && nextFocus) nextFocus.focus({ preventScroll: true });
    }
    wishlistSignature = signature;
  }

  function normalizedQuantity(value) {
    return Math.max(1, Math.min(99, Math.trunc(Number(value)) || 1));
  }

  function syncQuantity() {
    const input = $('#cat-product-qty');
    if (!input.length) return;
    const quantity = normalizedQuantity(input.val());
    input.val(quantity);
    const form = $('#cat-product-form');
    const product = findProduct(form.attr('data-id'));
    const unitPrice = Number(form.attr('data-selected-price')) || (product ? product.price : 0);
    if (product) $('[data-cat-total]').text(money(unitPrice * quantity));
    $('[data-cat-quantity]').text(quantity);
    $('.cat-qty-change[data-delta="-1"]').prop('disabled', quantity === 1);
    $('.cat-qty-change[data-delta="1"]').prop('disabled', quantity === 99);
  }

  function openQuickView(id) {
    const product = findProduct(id);
    if (!product) return;
    const isSaved = saved(product.id);
    const categoryName = categories[product.category] || 'Care';
    const ratingVal = product.rating ? Number(product.rating).toFixed(1) : '4.9';
    const productSizes = product.sizes || [product.size];

    const sizeSelectorHtml = productSizes.length > 1 ? `
      <div class="cat-size-selector-wrap" style="margin: 14px 0 16px;">
        <div class="cat-size-selector-header">
          <span class="cat-size-selector-label">${L.t('selectSize')}</span>
          <strong class="cat-qv-current-size">${esc(product.size)}</strong>
        </div>
        <div class="cat-size-pills" role="radiogroup" aria-label="${L.t('selectSize')}">
          ${productSizes.map(s => {
      const p = (product.sizePrices && product.sizePrices[s] != null) ? product.sizePrices[s] : product.price;
      const isSelected = s === product.size;
      return `<button type="button" class="cat-size-pill${isSelected ? ' is-active' : ''}" data-size="${esc(s)}" data-price="${p}" role="radio" aria-checked="${isSelected}">
              <span class="cat-size-vol">${esc(s)}</span>
              <span class="cat-size-tag">${money(p)}</span>
            </button>`;
    }).join('')}
        </div>
      </div>
    ` : '';

    const modalHtml = `
      <div id="cat-quickview-backdrop" class="cat-quickview-backdrop" role="dialog" aria-modal="true" aria-labelledby="qv-title">
        <div class="cat-quickview-card">
          <button type="button" class="icon-button cat-quickview-close" id="cat-quickview-close" aria-label="Close modal">${icon('close')}</button>
          <div class="cat-quickview-body">
            <div class="cat-quickview-photo">
              ${productImage(product, true)}
              ${product.discount ? `<span class="cat-card-badge">${esc(product.discount)}</span>` : ''}
            </div>
            <div class="cat-quickview-info">
              <div class="cat-card-meta-line">
                <span class="cat-card-category">${esc(categoryName)}</span>
                <span class="cat-card-rating">${icon('starFill')} ${ratingVal} (${product.reviewsCount || 100} reviews)</span>
              </div>
              <h2 id="qv-title" class="cat-quickview-title">${esc(product.name)}</h2>
              <div class="cat-card-price-line" style="margin: 14px 0 16px;">
                <span class="cat-card-price" style="font-size: 24px;">${money(product.price)}</span>
                ${product.originalPrice ? `<span class="cat-card-orig-price" style="font-size: 16px;">${money(product.originalPrice)}</span>` : ''}
                <span class="cat-card-format" style="margin-left: 12px; font-size: 13px;">${esc(product.size)}</span>
              </div>
              <p class="cat-description">${esc(product.description)}</p>
              ${sizeSelectorHtml}
              <div class="cat-quickview-cta">
                <button type="button" class="btn btn-primary cat-quick-add" data-id="${product.id}" data-size="${esc(product.size)}" data-price="${product.price}">Add to bag ${icon('plus')}</button>
                <a href="#product/${product.id}" class="btn btn-secondary cat-quickview-full">Full Details ${icon('arrow')}</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;

    $('#cat-quickview-backdrop').remove();
    $('body').append(modalHtml);
    setTimeout(() => $('#cat-quickview-backdrop').addClass('is-open'), 10);
  }

  function closeQuickView() {
    const $modal = $('#cat-quickview-backdrop');
    if (!$modal.length) return;
    $modal.removeClass('is-open');
    setTimeout(() => $modal.remove(), 200);
  }

  L.initCatalogPage = function () {
    if (purchaseObserver) purchaseObserver.disconnect();
    if (footerObserver) footerObserver.disconnect();
    syncComparison();
    syncQuantity();
    const purchase = document.querySelector('.cat-detail-add');
    const bar = document.getElementById('cat-mobile-purchase');
    if (purchase && bar && ('IntersectionObserver' in window)) {
      let purchaseVisible = true, footerVisible = false;
      const update = () => bar.classList.toggle('is-visible', !purchaseVisible && !footerVisible);
      purchaseObserver = new IntersectionObserver(entries => { purchaseVisible = entries[0].isIntersecting; update(); });
      purchaseObserver.observe(purchase);
      const footer = document.querySelector('.site-footer');
      if (footer) {
        footerObserver = new IntersectionObserver(entries => { footerVisible = entries[0].isIntersecting; update(); }, { rootMargin: '0px 0px 80px 0px' });
        footerObserver.observe(footer);
      }
    }
  };

  // Event Handlers
  $(document).on('click', '.cat-wishlist', function () {
    L.toggleWishlist(this.dataset.id);
    syncWishlist();
  });

  $(document).on('click', '.cat-card-add, .cat-quick-add', function () {
    const product = findProduct(this.dataset.id);
    const size = this.dataset.size || (product ? product.size : null);
    const price = this.dataset.price ? Number(this.dataset.price) : (product ? product.price : null);
    if (product && L.addToCart(product.id, size, 1, price)) {
      if (L.openCart) L.openCart(); else L.toast('Added to your bag');
    }
  });

  $(document).on('click', '.cat-quickview-btn', function () {
    openQuickView(this.dataset.id);
  });

  $(document).on('click', '#cat-quickview-close, .cat-quickview-full', function () {
    closeQuickView();
  });

  $(document).on('click', '.cat-quickview-backdrop', function (e) {
    if ($(e.target).is('.cat-quickview-backdrop')) {
      closeQuickView();
    }
  });

  $(document).on('click', '.cat-filter-link', function () {
    const type = this.dataset.filterType;
    const value = this.dataset.filterValue;
    updateShopParams({ [type]: value, page: 1 });
  });

  $(document).on('click', '.cat-rating-btn', function () {
    const ratingVal = this.dataset.filterValue;
    const hash = window.location.hash || '';
    const current = new URLSearchParams(hash.split('?')[1] || '').get('rating');
    const nextVal = current === ratingVal ? null : ratingVal;
    updateShopParams({ rating: nextVal, page: 1 });
  });

  $(document).on('change', '.cat-promo-toggle', function () {
    const isChecked = $(this).is(':checked');
    const val = this.value;
    updateShopParams({ promo: isChecked ? val : null, page: 1 });
  });

  $(document).on('change', '.cat-stock-toggle', function () {
    const isChecked = $(this).is(':checked');
    const val = this.value;
    updateShopParams({ stock: isChecked ? val : null, page: 1 });
  });

  // Dual Range Slider logic
  $(document).on('input', '#cat-range-min, #cat-range-max', function () {
    let minVal = Number($('#cat-range-min').val());
    let maxVal = Number($('#cat-range-max').val());

    if (minVal > maxVal) {
      if ($(this).is('#cat-range-min')) {
        $('#cat-range-max').val(minVal);
        maxVal = minVal;
      } else {
        $('#cat-range-min').val(maxVal);
        minVal = maxVal;
      }
    }

    const minPct = ((minVal - 10) / (100 - 10)) * 100;
    const maxPct = ((maxVal - 10) / (100 - 10)) * 100;

    $('#cat-slider-range').css({ left: minPct + '%', right: (100 - maxPct) + '%' });
    $('#cat-price-val-display').text(`$${minVal.toFixed(2)} - $${maxVal.toFixed(2)} `);
  });

  $(document).on('change', '#cat-range-min, #cat-range-max', function () {
    const minVal = Number($('#cat-range-min').val());
    const maxVal = Number($('#cat-range-max').val());
    updateShopParams({
      minPrice: minVal > 10 ? minVal : null,
      maxPrice: maxVal < 100 ? maxVal : null,
      page: 1
    });
  });

  // Sort change
  $(document).on('change', '#cat-sort-select', function () {
    const val = $(this).val();
    updateShopParams({ sort: val === 'default' ? null : val, page: 1 });
  });

  // Active filter chip removal
  $(document).on('click', '.cat-active-chip', function () {
    const key = this.dataset.removeFilter;
    if (key === 'price') {
      updateShopParams({ minPrice: null, maxPrice: null, page: 1 });
    } else {
      updateShopParams({ [key]: null, page: 1 });
    }
  });

  // Clear all filters
  $(document).on('click', '.cat-clear-all-link', function () {
    L.navigate('#shop');
  });

  // Pagination navigation
  $(document).on('click', '.cat-page-btn, .cat-page-number', function () {
    const p = $(this).data('page');
    if (p) {
      updateShopParams({ page: p });
      const mainEl = document.getElementById('shop-main');
      if (mainEl) mainEl.scrollIntoView({ behavior: 'smooth' });
    }
  });

  // Mobile drawer controls
  $(document).on('click', '#cat-mobile-filter-open', function () {
    $('#cat-filter-sidebar').addClass('is-open');
    $('#cat-sidebar-overlay').addClass('is-open');
    $('body').addClass('cat-sidebar-active');
  });

  $(document).on('click', '#cat-filter-close, #cat-sidebar-overlay', function () {
    $('#cat-filter-sidebar').removeClass('is-open');
    $('#cat-sidebar-overlay').removeClass('is-open');
    $('body').removeClass('cat-sidebar-active');
  });

  $(document).on('click', '.cat-qty-change', function () {
    $('#cat-product-qty').val(normalizedQuantity($('#cat-product-qty').val()) + Number(this.dataset.delta));
    syncQuantity();
  });

  $(document).on('change', '#cat-product-qty', syncQuantity);

  $(document).on('click', '.cat-size-pill', function () {
    const size = this.dataset.size;
    const price = Number(this.dataset.price);
    const $container = $(this).closest('.cat-size-selector-wrap, .cat-quickview-info');
    $container.find('.cat-size-pill').removeClass('is-active').attr('aria-checked', 'false');
    $(this).addClass('is-active').attr('aria-checked', 'true');

    // On product page:
    const form = $('#cat-product-form');
    if (form.length && $container.closest('#cat-product-form, .cat-product-info').length) {
      form.attr('data-selected-size', size);
      form.attr('data-selected-price', price);
      $('#cat-current-size-name').text(size);
      $('#cat-display-price').text(money(price));
      $('#cat-display-size').text(size);
      $('#cat-fact-size').text(size);
      const qty = normalizedQuantity($('#cat-product-qty').val());
      $('[data-cat-total]').text(money(price * qty));
      $('#cat-mobile-size-display').html(`${esc(size)} · <span data-cat-quantity>${qty}</span> selected`);
    }

    // Inside QuickView:
    const $qv = $(this).closest('.cat-quickview-info');
    if ($qv.length) {
      $qv.find('.cat-qv-current-size').text(size);
      $qv.find('.cat-card-price').text(money(price));
      $qv.find('.cat-card-format').text(size);
      $qv.find('.cat-quick-add').attr('data-size', size).attr('data-price', price);
    }
  });

  $(document).on('submit', '#cat-product-form', function (event) {
    event.preventDefault();
    const product = findProduct(this.dataset.id);
    if (!product) return;
    syncQuantity();
    const selectedSize = this.dataset.selectedSize || product.size;
    const selectedPrice = Number(this.dataset.selectedPrice) || product.price;
    const qty = normalizedQuantity($('#cat-product-qty').val());
    if (L.addToCart(product.id, selectedSize, qty, selectedPrice)) {
      if (L.openCart) L.openCart(); else L.toast('Added to your bag');
    }
  });

  $(document).on('click', '.cat-compare-toggle', function () {
    const id = this.dataset.id;
    if (!findProduct(id)) return;
    if (compared(id)) L.comparison = L.comparison.filter(item => item !== id);
    else if (L.comparison.length < 3) L.comparison.push(id);
    else { L.toast('Compare up to three products. Remove one to choose another.'); return; }
    syncComparison();
    L.toast(`${L.comparison.length} of 3 products selected for comparison`);
  });

  $(document).on('click', '.cat-compare-remove', function () {
    const source = this.closest('#cat-compare-content') ? '#cat-compare-content' : '#comparison-tray';
    L.comparison = L.comparison.filter(id => id !== this.dataset.id);
    syncComparison();
    updateCompareContent();
    const target = document.querySelector(`${source} button, ${source} a`) || document.querySelector('.cat-compare-toggle, .cat-compare-toolbar a');
    if (target) target.focus({ preventScroll: true });
    L.toast(`${L.comparison.length} of 3 products selected for comparison`);
  });

  $(document).on('click', '.cat-compare-clear', function () {
    L.comparison = [];
    syncComparison();
    updateCompareContent();
    const target = document.querySelector('.cat-compare-toggle, #cat-compare-content a');
    if (target) target.focus({ preventScroll: true });
    L.toast('Comparison cleared');
  });

  $(document).on('liva:change', syncWishlist);
})(window, window.jQuery);