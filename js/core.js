(function (window) {
  'use strict';
  const key = 'liva-store-v1';
  const defaults = { cart: [], wishlist: [], profile: null, orders: [], promo: '' };
  let stored = {};
  try { stored = JSON.parse(localStorage.getItem(key) || '{}') || {}; } catch (_) { }
  const state = { ...defaults, ...stored };
  state.cart = Array.isArray(state.cart) ? state.cart.filter(x => x && typeof x.id === 'string' && Number.isInteger(x.qty) && x.qty > 0 && x.qty <= 99 && typeof x.size === 'string') : [];
  state.wishlist = Array.isArray(state.wishlist) ? state.wishlist.filter(x => typeof x === 'string') : [];
  state.orders = Array.isArray(state.orders) ? state.orders.filter(x => x && typeof x.id === 'string' && Array.isArray(x.items) && x.customer && Number.isFinite(x.total)) : [];
  state.profile = state.profile && typeof state.profile === 'object' && !Array.isArray(state.profile) ? state.profile : null;
  state.promo = '';
  const icons = {
    search: '<circle cx="10.5" cy="10.5" r="6.5"/><path d="m16 16 4.5 4.5"/>',
    heart: '<path d="M20.4 4.6a5.4 5.4 0 0 0-7.6 0l-.8.8-.8-.8a5.4 5.4 0 0 0-7.6 7.6L12 21l8.4-8.8a5.4 5.4 0 0 0 0-7.6Z"/>',
    bag: '<path d="M5 7h14l1 14H4L5 7Z"/><path d="M8 8V6a4 4 0 0 1 8 0v2"/>',
    user: '<circle cx="12" cy="7" r="4"/><path d="M4 21v-2a8 8 0 0 1 16 0v2"/>',
    arrow: '<path d="M4 12h16m-6-6 6 6-6 6"/>',
    chevron: '<path d="m6 9 6 6 6-6"/>',
    plus: '<path d="M12 5v14M5 12h14"/>', minus: '<path d="M5 12h14"/>', close: '<path d="m6 6 12 12M6 18 18 6"/>',
    check: '<path d="m5 12 4 4L19 6"/>', menu: '<path d="M4 7h16M4 12h16M4 17h16"/>',
    star: '<path d="m12 3 2.8 5.7 6.2.9-4.5 4.4 1.1 6.2-5.6-2.9-5.6 2.9 1.1-6.2L3 9.6l6.2-.9L12 3Z"/>',
    leaf: '<path d="M20 3c-7 0-15 1-15 9a6 6 0 0 0 6 6c8 0 9-8 9-15Z"/><path d="M3 21 15 9"/>',
    truck: '<path d="M2 5h12v12H2zM14 9h4l4 4v4h-8"/><circle cx="6" cy="18" r="2"/><circle cx="18" cy="18" r="2"/>',
    sun: '<circle cx="12" cy="12" r="4"/><path d="M12 1v2m0 18v2M1 12h2m18 0h2M4 4l1.5 1.5m13 13L20 20M4 20l1.5-1.5m13-13L20 4"/>',
    drop: '<path d="M12 2S5 10 5 15a7 7 0 0 0 14 0c0-5-7-13-7-13Z"/><path d="M8 15a4 4 0 0 0 4 4"/>',
    globe: '<circle cx="12" cy="12" r="9"/><ellipse cx="12" cy="12" rx="4" ry="9"/><path d="M3 12h18"/>',
    instagram: '<rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><path d="M17.5 6.5h.01"/>',
    eye: '<path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/>',
    box: '<path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"/><path d="m3.3 7 8.7 5 8.7-5M12 22V12"/>',
    card: '<rect width="20" height="14" x="2" y="5" rx="2"/><line x1="2" x2="22" y1="10" y2="10"/>',
    support: '<path d="M3 18v-6a9 9 0 0 1 18 0v6"/><path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z"/>',
    filter: '<polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/>',
    starFill: '<polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" fill="currentColor" stroke="none"/>'
  };
  const langKey = 'liva-lang-v1';
  let currentLang = 'en';
  try {
    const savedLang = typeof localStorage !== 'undefined' && localStorage.getItem(langKey);
    if (savedLang === 'km' || savedLang === 'en') currentLang = savedLang;
  } catch (_) { }

  const translations = {
    en: {
      shopAll: 'Shop all',
      skinCare: 'Skin Care',
      hair: 'Hair',
      hairCare: 'Hair Care',
      body: 'Body',
      bodyCare: 'Body Care',
      makeup: 'Makeup',
      fragrances: 'Fragrances',
      nailCare: 'Nail Care',
      sets: 'Sets',
      setsAndRituals: 'Sets & Rituals',
      buildYourShelf: 'Build your shelf',
      aboutLiva: 'About LIVA',
      search: 'Search',
      bag: 'Bag',
      savedProducts: 'Saved products',
      myAccount: 'My account',
      trackOrder: 'Track an order',
      helpContact: 'Help & contact',
      theCollection: 'The Collection',
      experiences: 'Experiences',
      accountCare: 'Account & Care',
      personalCare: 'Personal care. Personally yours.',
      dailyEdit: 'THE LIVA DAILY EDIT',
      home: 'Home',
      shop: 'Shop',
      filterOptions: 'Filter Options',
      byCategories: 'By Categories',
      allCategories: 'All Categories',
      bySkinType: 'By Skin Type',
      normal: 'Normal',
      oily: 'Oily',
      dry: 'Dry',
      combination: 'Combination',
      sensitive: 'Sensitive',
      price: 'Price',
      review: 'Review',
      star: 'Star',
      andAbove: '& Above',
      byPromotions: 'By Promotions',
      newArrivals: 'New Arrivals',
      bestSellers: 'Best Sellers',
      onSale: 'On Sale',
      availability: 'Availability',
      inStock: 'In Stock',
      outOfStock: 'Out of Stocks',
      showing: 'Showing',
      of: 'of',
      results: 'results',
      sortBy: 'Sort by :',
      defaultSorting: 'Default Sorting',
      priceLow: 'Price: Low to High',
      priceHigh: 'Price: High to Low',
      rating: 'Highest Rated',
      nameAZ: 'Name: A–Z',
      activeFilter: 'Active Filter',
      clearAll: 'Clear All',
      addToBag: 'Add to bag',
      quickView: 'Quick view',
      freeShipping: 'Free Shipping',
      freeShippingDesc: 'Free shipping for order above $50',
      flexiblePayment: 'Flexible Payment',
      flexiblePaymentDesc: 'Multiple secure payment options',
      support247: '24×7 Support',
      support247Desc: 'We support online all days.',
      viewCollection: 'View collection',
      continueExploring: 'CONTINUE EXPLORING',
      moreInCategory: 'More in this collection.',
      otherProducts: 'Other products in the same collection, for a closer comparison.',
      samplePackaging: 'Sample packaging shown. Final presentation may change.',
      format: 'Format',
      size: 'Size',
      volume: 'Volume',
      selectSize: 'Select Size',
      selectVolume: 'Select Volume',
      included: 'Included',
      quantity: 'Quantity',
      compare: 'Compare',
      selected: 'Selected',
      fullDetails: 'Full Details',
      explore: 'Explore',
      customRoutine: 'Curate a personalised daily ritual ↗',
      viewSaved: 'View items saved to your wishlist',
      clearComparison: 'Clear comparison',
      emptyBag: 'Your shopping bag is empty',
      checkout: 'Checkout',
      subtotal: 'Subtotal',
      language: 'Language / ភាសា',
      currencyLang: 'USD $ · English',
      findYourDailyEdit: 'Find your daily edit',
      continueWithGoogle: 'Continue with Google',
      continueWithFacebook: 'Continue with Facebook',
      orWithPhone: 'or continue with phone',
      connectedVia: 'Connected via',
      signedInGoogle: 'Signed in with Google',
      signedInFacebook: 'Signed in with Facebook'
    },
    km: {
      shopAll: 'ទំនិញទាំងអស់',
      skinCare: 'ថែរក្សាស្បែក',
      hair: 'សក់',
      hairCare: 'ថែរក្សាសក់',
      body: 'ដងខ្លួន',
      bodyCare: 'ថែរក្សាដងខ្លួន',
      makeup: 'គ្រឿងសម្អាង',
      fragrances: 'ទឹកអប់',
      nailCare: 'ថែរក្សាក្រចក',
      sets: 'ឈុតផលិតផល',
      setsAndRituals: 'ឈុត & ពិធីថែរក្សា',
      buildYourShelf: 'រៀបចំកញ្ចប់របស់អ្នក',
      aboutLiva: 'អំពី LIVA',
      search: 'ស្វែងរក',
      bag: 'កន្ត្រក',
      savedProducts: 'ទំនិញរក្សាទុក',
      myAccount: 'គណនីខ្ញុំ',
      trackOrder: 'តាមដានការកុម្ម៉ង់',
      helpContact: 'ជំនួយ & ទំនាក់ទំនង',
      theCollection: 'កម្រងផលិតផល',
      experiences: 'បទពិសោធន៍',
      accountCare: 'គណនី & សេវាកម្ម',
      personalCare: 'ការថែទាំផ្ទាល់ខ្លួន។ សម្រាប់អ្នកផ្ទាល់។',
      dailyEdit: 'កម្រងប្រចាំថ្ងៃ LIVA',
      home: 'ទំព័រដើម',
      shop: 'ហាងទំនិញ',
      filterOptions: 'ជម្រើសចម្រាញ់',
      byCategories: 'តាមប្រភេទ',
      allCategories: 'គ្រប់ប្រភេទទាំងអស់',
      bySkinType: 'តាមប្រភេទស្បែក',
      normal: 'ធម្មតា',
      oily: 'ខ្លាញ់',
      dry: 'ស្ងួត',
      combination: 'ចម្រុះ',
      sensitive: 'ប្រតិកម្ម',
      price: 'តម្លៃ',
      review: 'ការវាយតម្លៃ',
      star: 'ផ្កាយ',
      andAbove: 'ឡើងទៅ',
      byPromotions: 'ការផ្សព្វផ្សាយ',
      newArrivals: 'ទំនិញទើបមកដល់',
      bestSellers: 'លក់ដាច់បំផុត',
      onSale: 'មានបញ្ចុះតម្លៃ',
      availability: 'ស្ថានភាពក្នុងស្តុក',
      inStock: 'មានក្នុងស្តុក',
      outOfStock: 'អស់ពីស្តុក',
      showing: 'កំពុងបង្ហាញ',
      of: 'នៃ',
      results: 'ទំនិញ',
      sortBy: 'តម្រៀបតាម :',
      defaultSorting: 'លំនាំដើម',
      priceLow: 'តម្លៃ: ទាប ទៅ ខ្ពស់',
      priceHigh: 'តម្លៃ: ខ្ពស់ ទៅ ទាប',
      rating: 'ពិន្ទុខ្ពស់បំផុត',
      nameAZ: 'ឈ្មោះ: A–Z',
      activeFilter: 'តម្រងសកម្ម',
      clearAll: 'សម្អាតទាំងអស់',
      addToBag: 'ដាក់ក្នុងកន្ត្រក',
      quickView: 'មើលរហ័ស',
      freeShipping: 'ដឹកជញ្ជូនឥតគិតថ្លៃ',
      freeShippingDesc: 'ដឹកជញ្ជូនឥតគិតថ្លៃសម្រាប់ការកុម្ម៉ង់ចាប់ពី $50',
      flexiblePayment: 'ការទូទាត់ងាយស្រួល',
      flexiblePaymentDesc: 'ជម្រើសទូទាត់ប្រកបដោយសុវត្ថិភាពច្រើនប្រភេទ',
      support247: 'ជំនួយ ២៤/៧',
      support247Desc: 'យើងខ្ញុំត្រៀមគាំទ្រអ្នករាល់ថ្ងៃ',
      viewCollection: 'មើលកម្រងទំនិញ',
      continueExploring: 'បន្តការស្វែងរក',
      moreInCategory: 'ទំនិញបន្ថែមក្នុងកម្រងនេះ',
      otherProducts: 'ផលិតផលផ្សេងទៀតក្នុងកម្រងតែមួយ ដើម្បីងាយស្រួលប្រៀបធៀប។',
      samplePackaging: 'ការវេចខ្ចប់គំរូ។ រូបរាងពិតអាចមានការផ្លាស់ប្តូរ។',
      format: 'ទម្រង់',
      size: 'ទំហំ',
      volume: 'ចំណុះ',
      selectSize: 'ជ្រើសរើសទំហំ',
      selectVolume: 'ជ្រើសរើសចំណុះ',
      included: 'រួមមាន',
      quantity: 'ចំនួន',
      compare: 'ប្រៀបធៀប',
      selected: 'បានជ្រើសរើស',
      fullDetails: 'ព័ត៌មានលម្អិត',
      explore: 'ស្វែងរក',
      customRoutine: 'រៀបចំកញ្ចប់ថែទាំផ្ទាល់ខ្លួនរបស់អ្នក ↗',
      viewSaved: 'មើលទំនិញដែលបានរក្សាទុកក្នុងបញ្ជីចង់បាន',
      clearComparison: 'សម្អាតការប្រៀបធៀប',
      emptyBag: 'កន្ត្រកទំនិញរបស់អ្នកទទេ',
      checkout: 'ទូទាត់ប្រាក់',
      subtotal: 'សរុបរង',
      language: 'Language / ភាសា',
      currencyLang: 'USD $ · ភាសាខ្មែរ',
      findYourDailyEdit: 'ស្វែងរកកម្រងប្រចាំថ្ងៃរបស់អ្នក',
      continueWithGoogle: 'បន្តជាមួយ Google',
      continueWithFacebook: 'បន្តជាមួយ Facebook',
      orWithPhone: 'ឬបន្តជាមួយលេខទូរស័ព្ទ',
      connectedVia: 'ភ្ជាប់តាមរយៈ',
      signedInGoogle: 'បានចូលដោយជោគជ័យជាមួយ Google',
      signedInFacebook: 'បានចូលដោយជោគជ័យជាមួយ Facebook'
    }
  };

  const Liva = window.Liva = {
    state, products: [],
    getLang: () => currentLang,
    setLang: (lang) => {
      if (lang !== 'en' && lang !== 'km') return;
      currentLang = lang;
      try { localStorage.setItem(langKey, lang); } catch (_) { }
      if (typeof document !== 'undefined' && document.documentElement) {
        document.documentElement.setAttribute('lang', lang);
      }
      if (typeof document !== 'undefined') {
        document.dispatchEvent(new CustomEvent('liva:lang-changed', { detail: { lang } }));
      }
    },
    t: (k) => (translations[currentLang] && translations[currentLang][k]) || (translations.en && translations.en[k]) || k,
    translations,
    money: value => '$' + Number(value || 0).toFixed(2),
    escape: value => String(value == null ? '' : value).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c])),
    icon: name => '<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.45" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + (icons[name] || icons.leaf) + '</svg>',
    getProduct: id => Liva.products.find(p => p.id === id),
    save: () => {
      try { localStorage.setItem(key, JSON.stringify(state)); } catch (_) { }
      document.dispatchEvent(new CustomEvent('liva:change'));
    },
    addToCart: (id, size, quantity = 1) => {
      const product = Liva.getProduct(id), qty = Number(quantity);
      if (!product || !Number.isInteger(qty) || qty < 1) return false;
      size = String(size || product.size);
      const item = state.cart.find(x => x.id === id && x.size === size);
      if (item) item.qty = Math.min(99, item.qty + qty);
      else state.cart.push({ id, size, qty: Math.min(99, qty) });
      Liva.save(); return true;
    },
    repeatOrder: id => {
      const result = { added: 0, skipped: 0, limited: 0 };
      const order = state.orders.find(entry => entry.id === id);
      if (!order || !Array.isArray(order.items)) return result;
      order.items.forEach(line => {
        const product = line && Liva.getProduct(line.id);
        const validSize = product && (product.sizes ? product.sizes.includes(line.size) : line.size === product.size);
        if (!product || !Number.isSafeInteger(line.qty) || line.qty < 1 || !validSize) {
          result.skipped += 1;
          return;
        }
        const lineSize = line.size || product.size;
        const existing = state.cart.find(item => item.id === product.id && item.size === lineSize);
        const added = Math.min(line.qty, 99 - (existing ? existing.qty : 0));
        result.added += added;
        result.limited += line.qty - added;
        if (!added) return;
        if (existing) existing.qty += added;
        else state.cart.push({ id: product.id, size: lineSize, qty: added });
      });
      if (result.added) Liva.save();
      return result;
    },
    toggleWishlist: id => {
      if (!Liva.getProduct(id)) return;
      const i = state.wishlist.indexOf(id);
      if (i < 0) state.wishlist.push(id); else state.wishlist.splice(i, 1);
      Liva.save();
    },
    cartTotals: () => {
      let cents = 0, count = 0;
      state.cart.forEach(item => {
        const p = Liva.getProduct(item.id);
        if (p) {
          let price = p.price;
          if (p.sizePrices && p.sizePrices[item.size] != null) {
            price = p.sizePrices[item.size];
          } else if (item.price != null && item.size !== p.size) {
            price = item.price;
          }
          cents += Math.round(price * 100) * item.qty;
          count += item.qty;
        }
      });
      return { subtotal: cents / 100, discount: 0, shipping: null, total: cents / 100, count };
    },
    toast: message => {
      const toast = document.getElementById('toast'); if (!toast) return;
      toast.textContent = message; toast.classList.add('is-visible');
      clearTimeout(Liva.toastTimer); Liva.toastTimer = setTimeout(() => toast.classList.remove('is-visible'), 3200);
    },
    navigate: hash => { window.location.hash = hash.startsWith('#') ? hash : '#' + hash; }
  };
})(window);
