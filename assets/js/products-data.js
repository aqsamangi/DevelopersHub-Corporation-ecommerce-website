/*
 * Shared catalogue used by every page.
 * To add or edit a product, change this file only.
 * Images live in assets/img/products/ (480px WebP).
 */
(function (global) {
  'use strict';

  var CATEGORIES = [
    { id: 'automobiles', name: 'Automobiles' },
    { id: 'clothes', name: 'Clothes and wear' },
    { id: 'home', name: 'Home interiors' },
    { id: 'tech', name: 'Computer and tech' },
    { id: 'appliances', name: 'Home appliances' },
    { id: 'tools', name: 'Tools, equipment' },
    { id: 'sports', name: 'Sports and outdoor' },
    { id: 'pets', name: 'Animal and pets' },
    { id: 'machinery', name: 'Machinery tools' }
  ];

  var IMG = 'assets/img/products/';

  // p(id, name, category, brand, price, oldPrice, rating, reviews, orders, image, description, specs, extras)
  function p(o) { o.image = IMG + o.image; return o; }

  var PRODUCTS = [
    p({ id: 1, name: "Men's cotton polo shirt, teal", category: 'clothes', brand: 'Nordwear', price: 10.30, oldPrice: 13.50, rating: 4.5, reviews: 128, orders: 410, image: 'polo-shirt.webp', type: 'Polo shirt', material: 'Cotton blend', design: 'Classic fit', colors: ['Teal', 'Navy', 'Grey'], sizes: ['S', 'M', 'L', 'XL'], desc: 'Soft cotton-blend polo with a two-button placket and ribbed collar. A comfortable everyday piece that works for the office and weekends.' }),
    p({ id: 2, name: 'Brown winter jacket with fur hood, medium size', category: 'clothes', brand: 'Nordwear', price: 49.90, oldPrice: 64.00, rating: 4.7, reviews: 86, orders: 220, image: 'winter-jacket.webp', type: 'Winter jacket', material: 'Polyester shell, fleece lining', design: 'Hooded, zip and snap closure', colors: ['Brown', 'Black'], sizes: ['M', 'L', 'XL'], desc: 'Warm padded jacket with a removable faux-fur trim, four front pockets and a windproof outer shell.' }),
    p({ id: 3, name: 'Navy blazer, slim fit, for men', category: 'clothes', brand: 'Urbanline', price: 62.50, oldPrice: 79.00, rating: 4.6, reviews: 54, orders: 150, image: 'navy-blazer.webp', type: 'Blazer', material: 'Wool blend', design: 'Two-button, slim fit', colors: ['Navy'], sizes: ['S', 'M', 'L', 'XL'], desc: 'A tailored two-button blazer in a navy wool blend. Half-lined for breathability and finished with notch lapels.' }),
    p({ id: 4, gift: true, name: 'Blue leather wallet for men, bifold', category: 'clothes', brand: 'Urbanline', price: 34.00, oldPrice: 0, rating: 4.4, reviews: 73, orders: 305, image: 'leather-wallet.webp', type: 'Wallet', material: 'Genuine leather', design: 'Bifold, 8 card slots', colors: ['Blue'], sizes: [], desc: 'Slim bifold wallet with eight card slots, two bill compartments and a coin-free profile that fits any pocket.' }),
    p({ id: 5, name: 'Denim drawstring backpack for travel', category: 'clothes', brand: 'Kestrel', price: 29.00, oldPrice: 39.00, rating: 4.3, reviews: 41, orders: 98, image: 'denim-backpack.webp', type: 'Backpack', material: 'Denim canvas', design: 'Drawstring with flap closure', colors: ['Blue'], sizes: [], desc: 'A roomy denim backpack with an adjustable drawstring, magnetic flap and padded shoulder straps for day trips.' }),
    p({ id: 7, name: 'Blue denim shorts, knee length', category: 'clothes', brand: 'Nordwear', price: 18.90, oldPrice: 24.00, rating: 4.1, reviews: 63, orders: 260, image: 'denim-shorts.webp', type: 'Shorts', material: 'Cotton denim', design: 'Straight leg, five pockets', colors: ['Blue'], sizes: ['30', '32', '34', '36'], desc: 'Classic five-pocket denim shorts with a knee-length cut and a comfortable mid-rise waist.' }),
    p({ id: 8, name: 'Gaming headset with mic, LED lights', category: 'tech', brand: 'Voltix', price: 28.90, oldPrice: 36.00, rating: 4.4, reviews: 212, orders: 880, image: 'gaming-headset.webp', type: 'Over-ear headset', material: 'ABS plastic, memory-foam cushions', design: 'Adjustable boom mic, LED lighting', colors: ['Black / Blue'], sizes: [], desc: 'Stereo gaming headset with a noise-reducing microphone, soft memory-foam ear cushions and in-line volume control.' }),
    p({ id: 9, name: 'DSLR camera with 18-55mm lens kit', category: 'tech', brand: 'Lumio', price: 89.00, oldPrice: 110.00, rating: 4.6, reviews: 94, orders: 340, image: 'dslr-camera.webp', type: 'DSLR camera with lens kit', material: 'Polycarbonate body', design: '18-55mm kit lens', colors: ['Black'], sizes: [], desc: 'Entry-level DSLR camera supplied with an 18-55mm kit lens. Good for learning manual photography and 1080p video.' }),
    p({ id: 10, name: 'Laptop 15.6 inch, 16GB RAM, 512GB SSD', category: 'tech', brand: 'Voltix', price: 340.00, oldPrice: 399.00, rating: 4.5, reviews: 77, orders: 120, image: 'laptop-pro.webp', type: 'Laptop', material: 'Aluminium body', design: '15.6" display, backlit keyboard', colors: ['Space grey'], sizes: [], desc: 'A slim 15.6 inch laptop with a fast SSD, 16GB of memory and a backlit keyboard for work and study.' }),
    p({ id: 11, gift: true, name: 'Smart watch with heart-rate monitor', category: 'tech', brand: 'Lumio', price: 38.00, oldPrice: 55.00, rating: 4.3, reviews: 301, orders: 1200, image: 'smart-watch.webp', type: 'Smart watch', material: 'Aluminium case, silicone strap', design: '1.69" square display', colors: ['Grey', 'Black'], sizes: [], desc: 'Smart watch with heart-rate and sleep tracking, notifications and water resistance for everyday use.' }),
    p({ id: 12, name: 'Smartphone 6.4" display, 128GB, gradient finish', category: 'tech', brand: 'Aurora', price: 99.50, oldPrice: 129.00, rating: 4.2, reviews: 188, orders: 760, image: 'smartphone-aurora.webp', type: 'Smartphone', material: 'Glass back, metal frame', design: '6.4" display, dual SIM', colors: ['Gradient blue'], sizes: [], desc: 'A 6.4 inch smartphone with a vivid display, dual SIM support and an all-day battery.' }),
    p({ id: 13, name: 'Smartphone 6.1" display, 128GB, red', category: 'tech', brand: 'Aurora', price: 240.00, oldPrice: 280.00, rating: 4.7, reviews: 143, orders: 410, image: 'smartphone-red.webp', type: 'Smartphone', material: 'Glass back, aluminium frame', design: '6.1" OLED display, dual camera', colors: ['Red'], sizes: [], desc: 'Compact smartphone with an OLED display, dual rear cameras and fast wireless charging.' }),
    p({ id: 14, name: 'Tablet 11 inch, 128GB, Wi-Fi', category: 'tech', brand: 'Voltix', price: 189.00, oldPrice: 219.00, rating: 4.5, reviews: 58, orders: 190, image: 'tablet-slate.webp', type: 'Tablet', material: 'Aluminium body', design: '11" 120Hz display', colors: ['Slate'], sizes: [], desc: 'An 11 inch tablet with a smooth 120Hz display, four speakers and long battery life for reading and video.' }),
    p({ id: 15, gift: true, name: 'Wireless over-ear headphones, foldable', category: 'tech', brand: 'Lumio', price: 45.00, oldPrice: 59.00, rating: 4.4, reviews: 167, orders: 520, image: 'wireless-headphones.webp', type: 'Over-ear headphones', material: 'Plastic, protein-leather ear pads', design: 'Foldable, Bluetooth 5.0', colors: ['White'], sizes: [], desc: 'Foldable Bluetooth headphones with soft ear pads and up to 30 hours of playback per charge.' }),
    p({ id: 16, name: 'Electric kettle 1.7L, stainless steel', category: 'appliances', brand: 'Hearth & Co', price: 80.95, oldPrice: 99.00, rating: 4.6, reviews: 112, orders: 275, image: 'electric-kettle.webp', type: 'Electric kettle', material: 'Stainless steel and BPA-free plastic', design: '1.7L, auto shut-off', colors: ['Black'], sizes: [], desc: 'Fast-boil 1.7 litre kettle with auto shut-off, boil-dry protection and a cordless 360 degree base.' }),
    p({ id: 17, name: 'Capsule coffee maker, compact', category: 'appliances', brand: 'Hearth & Co', price: 39.00, oldPrice: 49.00, rating: 4.3, reviews: 65, orders: 140, image: 'coffee-maker.webp', type: 'Capsule coffee maker', material: 'Plastic body', design: 'Compact, removable water tank', colors: ['White'], sizes: [], desc: 'A compact capsule coffee maker that brews in under a minute and fits on a small counter.' }),
    p({ id: 18, name: 'Slow juicer, kitchen mixer for fruit and veg', category: 'appliances', brand: 'Hearth & Co', price: 100.00, oldPrice: 125.00, rating: 4.4, reviews: 37, orders: 64, image: 'juicer.webp', type: 'Slow juicer', material: 'Stainless steel and Tritan', design: 'Low-speed masticating', colors: ['Silver'], sizes: [], desc: 'Slow masticating juicer that keeps more of the fibre and nutrients and is easy to disassemble and clean.' }),
    p({ id: 19, name: 'Soft armchair, beige fabric', category: 'home', brand: 'Casa Verde', price: 119.00, oldPrice: 149.00, rating: 4.6, reviews: 48, orders: 85, image: 'armchair.webp', type: 'Armchair', material: 'Fabric, solid-wood legs', design: 'Mid-century style', colors: ['Beige'], sizes: [], desc: 'A deep, soft armchair with a curved back and slim wooden legs. Easy to assemble in minutes.' }),
    p({ id: 20, gift: true, name: 'Ceramic table lamp with linen shade', category: 'home', brand: 'Casa Verde', price: 19.00, oldPrice: 26.00, rating: 4.5, reviews: 91, orders: 330, image: 'table-lamp.webp', type: 'Table lamp', material: 'Ceramic base, linen shade', design: 'Round textured base', colors: ['Grey / Cream'], sizes: [], desc: 'A textured ceramic lamp with a warm linen shade. Takes an E27 bulb (not included).' }),
    p({ id: 21, gift: true, name: 'Handmade clay pot with lid, for home', category: 'home', brand: 'Casa Verde', price: 10.30, oldPrice: 0, rating: 4.8, reviews: 150, orders: 640, image: 'clay-pot.webp', type: 'Clay pot', material: 'Natural terracotta clay', design: 'Handmade, with lid', colors: ['Terracotta'], sizes: [], desc: 'A handmade terracotta pot with a fitted lid for slow cooking, storing grains, or as a decorative piece.' }),
    p({ id: 22, gift: true, name: 'Indoor plant in planter pot, 60 cm', category: 'home', brand: 'Casa Verde', price: 10.00, oldPrice: 14.00, rating: 4.5, reviews: 72, orders: 205, image: 'indoor-plant.webp', type: 'Artificial plant', material: 'Plastic leaves, ceramic-look pot', design: '60 cm tall', colors: ['Green'], sizes: [], desc: 'Low-maintenance decorative plant in a square planter. Adds greenery to a living room or office with no watering.' }),
    p({ id: 23, name: 'Inflatable air mattress with built-in pump', category: 'home', brand: 'Kestrel', price: 19.00, oldPrice: 27.00, rating: 4.1, reviews: 59, orders: 180, image: 'air-mattress.webp', type: 'Air mattress', material: 'PVC, flocked top', design: 'Built-in electric pump', colors: ['Teal'], sizes: [], desc: 'Queen-size air mattress for guests and camping. Inflates in about three minutes with the built-in pump.' }),
    p({ id: 24, name: 'Leather magazine rack with brass frame', category: 'home', brand: 'Casa Verde', price: 19.00, oldPrice: 0, rating: 4.4, reviews: 33, orders: 70, image: 'magazine-rack.webp', type: 'Magazine rack', material: 'Faux leather, metal frame', design: 'Two-slot', colors: ['Tan'], sizes: [], desc: 'A two-slot magazine rack with a brass-coloured metal frame. Keeps newspapers and books tidy.' })
  ];

  // Hot deals shown on the home page (id -> discount %)
  var DEALS = [
    { id: 11, off: 25, label: 'Smart watches' },
    { id: 10, off: 15, label: 'Laptops' },
    { id: 9, off: 40, label: 'Cameras' },
    { id: 8, off: 25, label: 'Headsets' },
    { id: 12, off: 25, label: 'Smartphones' }
  ];

  var BRANDS = Array.from(new Set(PRODUCTS.map(function (x) { return x.brand; }))).sort();

  global.CATALOG = {
    categories: CATEGORIES,
    products: PRODUCTS,
    deals: DEALS,
    brands: BRANDS,
    byId: function (id) {
      id = Number(id);
      for (var i = 0; i < PRODUCTS.length; i++) if (PRODUCTS[i].id === id) return PRODUCTS[i];
      return null;
    },
    categoryName: function (id) {
      for (var i = 0; i < CATEGORIES.length; i++) if (CATEGORIES[i].id === id) return CATEGORIES[i].name;
      return 'All categories';
    }
  };
})(window);
