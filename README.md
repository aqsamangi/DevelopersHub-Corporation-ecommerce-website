# Brand - E-commerce Storefront (Frontend Internship Project)

A multi-page demo e-commerce website built with HTML5, Tailwind CSS 3 and vanilla JavaScript.
It has a home page, product listing with search/filter/sort, product details, cart, checkout (simulated),
and separate mobile pages. There is no backend: product data is a JavaScript file and the cart and
orders are saved in the browser with localStorage.

> This is a demo. No real payments, accounts, emails or orders exist. The brands, suppliers and reviews are made-up sample data.

## Design Reference

The website was developed with reference to the original Figma community design:

- [E-commerce Web Design - Figma Community](https://www.figma.com/community/file/1339568644170883306/ecommerce-web-design)

The implementation follows the overall layout and visual direction of the reference across desktop and mobile layouts.

## 1. Technologies

| Part | What is used |
|---|---|
| Markup | HTML5 (semantic tags, ARIA labels, skip link) |
| Styling | Tailwind CSS 3.4 (compiled to `assets/css/tailwind.css`, already included) |
| Logic | Vanilla JavaScript (no framework, no ES modules, works on file:// too) |
| Icons | Font Awesome 6 Free (copied into `assets/vendor`) |
| Font | Roboto (copied into `assets/fonts`) |
| Images | WebP / PNG, all stored locally |

Nothing is loaded from a CDN, so the site works offline after you download it.

## 2. Pages and features

| File | What it is |
|---|---|
| `index.html` | Desktop home: category menu, hero banner, deals with countdown, Home and outdoors, Consumer electronics, quote form, recommended items, services, suppliers by region |
| `products.html` | Product listing: category / brand / price / rating filters, sort, grid and list view, pagination (9 per page), active filter chips, no-results state |
| `product-details.html?id=N` | Gallery with zoom, colour/size/quantity, Add to cart, Buy now, tabs, "You may like", related products |
| `cart.html` | Quantity +/-, remove, remove all, coupon (`SAVE10`), totals, free shipping progress, empty state |
| `checkout.html` | Contact + shipping form with validation, demo payment methods, order summary, order confirmation |
| `orders.html` | Orders placed on this browser, "Buy again" |
| `mobile-main.html` | Mobile home (app style, bottom tab bar) |
| `mobile-itemlist.html` | Mobile product list: sort, filter bottom sheet, list/grid toggle, Load more |
| `login.html`, `msg.html`, `help.html` | Demo sign in / register, demo messages, help and contact pages |

## 3. Folder structure

```
.
|-- index.html, products.html, product-details.html, cart.html, checkout.html
|-- orders.html, login.html, msg.html, help.html
|-- mobile-main.html, mobile-itemlist.html
|-- README.md, package.json, package-lock.json, tailwind.config.js, .gitignore
|-- src/
|   `-- input.css              (Tailwind source + small custom CSS)
`-- assets/
    |-- css/tailwind.css       (compiled and minified, committed on purpose)
    |-- js/
    |   |-- products-data.js   (all products, categories, deals)
    |   |-- store.js           (cart, localStorage, formatting, toast)
    |   |-- components.js      (header, footer, mobile bars, product cards)
    |   |-- listing-core.js    (search / filter / sort logic)
    |   `-- one script per page (home, products, product-details, cart, checkout, ...)
    |-- img/                   (products, banners, services, flags, icons, logo)
    |-- fonts/                 (Roboto)
    `-- vendor/fontawesome/    (icons)
```

## 4. Requirements

To only view the site: a modern browser (Chrome, Edge, Firefox). That is all.
To change the Tailwind styles: Node.js 18 or newer (https://nodejs.org).

## 5. Run it on Windows

1. Install VS Code (https://code.visualstudio.com) and the "Live Server" extension (by Ritwick Dey).
2. Unzip the project to a folder, for example `C:\Projects\brand-store`.
3. Open VS Code, then File > Open Folder and choose that folder.
4. Open `index.html`, right-click it and choose "Open with Live Server".
   The site opens at `http://127.0.0.1:5500/index.html`.

Other options:
- Python installed: open a terminal in the folder and run `py -m http.server 8000`, then open http://localhost:8000
- Just double-click `index.html`. It works, but some browsers treat localStorage differently on `file://`, so a local server is better.

### Changing the styles (optional)

```
npm install
npm run build:css      (builds once)
npm run watch:css      (rebuilds when you save)
```

Tailwind colours and breakpoints are in `tailwind.config.js`.

## 6. How things work

- **Navigation:** every page uses the same header and footer, which are inserted by `assets/js/components.js`. Links are relative, so the site works in any folder.
- **Product data:** all products are in `assets/js/products-data.js`. Add a product by adding one object and putting its image in `assets/img/products/`.
- **Search / filter / sort:** `listing-core.js` reads the URL (for example `products.html?category=home&sort=price-asc`), so filtered pages can be bookmarked.
- **Cart:** saved in localStorage under `brand_cart_v1`. The badge updates on every page and across tabs. Totals = subtotal - coupon + shipping (free from $100, else $7.99) + 5% estimated tax.
- **Buy now:** adds the item to the cart and goes to checkout.
- **Checkout:** validates email, phone, name, address, city, postal code and (for card) number (Luhn check), expiry and CVC. Valid orders are saved in localStorage (`brand_orders_v1`), the cart is emptied and a confirmation is shown. Card details are never stored. Test card: `4242 4242 4242 4242`.

## 7. Known limitations

- **Design:** The website follows the overall layout and visual style of the original Figma reference. Some spacing, colours, and other visual details may differ from the original design.
- **Images:** Some product images may appear less sharp on larger screens. Higher-resolution images can be used to improve image quality.
- **Product gallery:** Additional gallery thumbnails use cropped versions of the product's main image.
- **Categories:** Some categories, including Automobiles, Tools, Sports, Animals, and Machinery, do not currently have product listings.
- Currency, language, "Get app" buttons and the supplier/message features are demo only. Reviews are sample text.
- Mobile pages are separate files. The desktop pages are responsive too.

## 8. Image sources and credits

- Product, banner, service and flag images: exported from the original Figma "Ecommerce Web Design" community design that came with the project (converted to WebP, resized). The Germany flag was drawn with a small script.
- Icons: Font Awesome Free 6 (icons CC BY 4.0, fonts SIL OFL 1.1, code MIT).
- Font: Roboto (SIL Open Font License 1.1), via the Fontsource package.

## 9. Testing

The website was tested in Chromium using Playwright to check page loading, responsive layouts, navigation, and key e-commerce features.

The following areas were covered:
- **Page loading and responsiveness:** Checked the main pages at mobile (375px), tablet (768px), and desktop (1440px) viewport widths.
- **Navigation and layout:** Checked page links, shared headers and footers, image loading, and horizontal overflow.
- **Product listing:** Tested search, category and brand filters, price and rating filters, sorting, grid and list views, pagination, and empty search results.
- **Product details:** Checked product information, image gallery, quantity selection, related products, Add to Cart, and Buy Now.
- **Shopping cart:** Tested quantity changes, item removal, clearing the cart, coupon codes, price calculations, shipping progress, and cart persistence after reloading the page.
- **Checkout:** Checked form validation, payment method selection, invalid card details, order confirmation, and cart clearing after placing a demo order.
- **Order history:** Checked saved orders and the Buy Again feature.
- **Mobile features:** Tested the mobile product list, filters, sorting, Load More, navigation drawer, and cart interactions.

**Testing limitations:** Testing was performed in Chromium at multiple viewport sizes. Compatibility with other browsers, physical mobile devices, and screen reader accessibility has not been tested.
