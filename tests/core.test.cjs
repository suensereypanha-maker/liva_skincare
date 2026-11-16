const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
function create(saved) {
 const storage = new Map(saved ? [['liva-store-v1',saved]] : []);
 const context = {window:{}, document:{dispatchEvent(){}}, CustomEvent:class{}, localStorage:{getItem:k=>storage.get(k),setItem:(k,v)=>storage.set(k,v)}, console, setTimeout, clearTimeout};
 vm.createContext(context);
 if(fs.existsSync('js/core.js')) vm.runInContext(fs.readFileSync('js/core.js','utf8'),context);
 const app = context.window.Liva || {};
 app.products = [{id:'shampoo',price:18,size:'300 mL'},{id:'conditioner',price:20,size:'300 mL'}];
 return {app,storage,context};
}
test('cart merges matching products and persists quantities',()=>{const {app,storage}=create(); assert.equal(typeof app.addToCart,'function'); app.addToCart('shampoo','300 mL',2); app.addToCart('shampoo','300 mL',1); assert.equal(app.state.cart.length,1); assert.equal(app.state.cart[0].qty,3); assert.equal(JSON.parse(storage.get('liva-store-v1')).cart[0].qty,3);});
test('totals contain product prices only and never imply configured shipping or offers',()=>{const {app}=create(JSON.stringify({promo:'LIVA10'})); assert.equal(app.state.promo,''); app.addToCart('shampoo','300 mL',2); assert.equal(app.cartTotals().total,36); app.addToCart('conditioner','300 mL',1); app.state.promo='LIVA10'; assert.equal(app.cartTotals().total,56); assert.equal(app.cartTotals().shipping,null); assert.equal(app.cartTotals().discount,0); app.products[0].price=18.19; assert.equal(app.cartTotals().subtotal,56.38);});
test('invalid products and quantities cannot corrupt cart',()=>{const {app}=create(); assert.equal(typeof app.addToCart,'function'); app.addToCart('missing','300 mL',1); app.addToCart('shampoo','300 mL',-3); app.addToCart('shampoo','300 mL',NaN); assert.equal(app.state.cart.length,0);});
test('wishlist toggles and malformed saved state recovers',()=>{const {app}=create('{bad json'); assert.equal(typeof app.toggleWishlist,'function'); app.toggleWishlist('shampoo'); assert.equal(app.state.wishlist.length,1); app.toggleWishlist('shampoo'); assert.equal(app.state.wishlist.length,0);});

test('repeat order preserves the bag, merges quantities, and uses current catalog prices',()=>{
 const {app,storage}=create();
 app.addToCart('shampoo','300 mL',2);
 app.state.orders=[{id:'local-1',items:[{id:'shampoo',size:'300 mL',qty:3,price:1},{id:'conditioner',size:'300 mL',qty:1,price:2}]}];
 assert.equal(typeof app.repeatOrder,'function');
 const result=app.repeatOrder('local-1');
 assert.equal(result.added,4); assert.equal(result.skipped,0); assert.equal(result.limited,0);
 assert.deepEqual(JSON.parse(JSON.stringify(app.state.cart)),[{id:'shampoo',size:'300 mL',qty:5},{id:'conditioner',size:'300 mL',qty:1}]);
 assert.equal(app.cartTotals().subtotal,110);
 assert.equal(JSON.parse(storage.get('liva-store-v1')).cart[0].qty,5);
 assert.equal(app.state.orders[0].items[0].qty,3);
});

test('repeat order skips unavailable products, obsolete sizes, and malformed lines',()=>{
 const {app}=create();
 app.state.orders=[{id:'local-2',items:[{id:'missing',size:'300 mL',qty:1},{id:'shampoo',size:'old size',qty:1},null,{id:'shampoo',size:'300 mL',qty:-1},{id:'shampoo',size:'300 mL',qty:1.5},{id:'shampoo',size:'300 mL',qty:2}]}];
 assert.equal(typeof app.repeatOrder,'function');
 const result=app.repeatOrder('local-2');
 assert.equal(result.added,2); assert.equal(result.skipped,5); assert.equal(result.limited,0);
 assert.equal(app.state.cart.length,1); assert.equal(app.state.cart[0].qty,2);
});

test('repeat order respects quantity caps and does not mutate the bag for unknown orders',()=>{
 const {app,storage}=create();
 app.addToCart('shampoo','300 mL',98);
 app.state.orders=[{id:'local-3',items:[{id:'shampoo',size:'300 mL',qty:4},{id:'conditioner',size:'300 mL',qty:103}]}];
 assert.equal(typeof app.repeatOrder,'function');
 const result=app.repeatOrder('local-3');
 assert.equal(result.added,100); assert.equal(result.skipped,0); assert.equal(result.limited,7);
 assert.equal(app.state.cart[0].qty,99); assert.equal(app.state.cart[1].qty,99);
 const before=storage.get('liva-store-v1');
 const missing=app.repeatOrder('not-found');
 assert.equal(missing.added,0); assert.equal(missing.skipped,0); assert.equal(missing.limited,0);
 assert.equal(storage.get('liva-store-v1'),before);
});

test('receipt tracking opens its saved order after reload and replaces previous lookups',()=>{
 const orders=['A','B'].map(letter=>({id:'ORDER-'+letter,createdAt:'2026-11-13',status:'Confirmed',customer:{name:'Sample '+letter,city:'Phnom Penh'},items:[],subtotal:0,total:0}));
 const {app,context}=create(JSON.stringify({orders}));
 context.document.addEventListener=()=>{};
 context.document.getElementById=()=>null;
 vm.runInContext(fs.readFileSync('js/commerce.js','utf8'),context);
 assert.ok(app.renderConfirmation('ORDER-A').includes('href="#tracking/ORDER-A"'));
 const first=app.renderTracking('ORDER-A');
 assert.ok(first.includes('<h2>ORDER-A</h2>'));
 app.renderTracking('ORDER-B');
 const requested=app.renderTracking('order-a');
 assert.ok(requested.includes('<h2>ORDER-A</h2>'));
 assert.ok(!requested.includes('<h2>ORDER-B</h2>'));
 const missing=app.renderTracking('ORDER-MISSING');
 assert.ok(!missing.includes('<h2>ORDER-A</h2>'));
 assert.ok(missing.includes('value="ORDER-MISSING"'));
});
