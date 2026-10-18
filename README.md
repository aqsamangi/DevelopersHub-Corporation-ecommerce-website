# Brand - E-commerce Storefront (Frontend Internship Project)

A multi-page demo e-commerce website built with HTML5, Tailwind CSS 3 and vanilla JavaScript.
It has a home page, product listing with search/filter/sort, product details, cart, checkout (simulated),
and separate mobile pages. There is no backend: product data is a JavaScript file and the cart and
orders are saved in the browser with localStorage.

> This is a demo. No real payments, accounts, emails or orders exist. The brands, suppliers and reviews are made-up sample data.

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

- **Figma:** I could not open the Figma links (Figma blocks automated access). The layout, colours and spacing were rebuilt from the original project files and the images exported from Figma. I did not compare it with Figma frame by frame, so it is close to the original design but not verified as pixel-perfect. Colours/fonts can be tuned in `tailwind.config.js`.
- **Images:** the only photos are the ones that were already in the project. Home interiors and some electronics were exported small (82 px), so they were enlarged to 480 px and look softer on the product page. Replace them with larger photos for a sharper result (keep the same file names).
- **Gallery:** each product has one photo, so the extra thumbnails are zoomed crops of the same photo.
- **Categories:** Automobiles, Tools, Sports, Animals and Machinery are in the menu (as in the design) but have no products, so they show the empty state.
- Currency, language, "Get app" buttons and the supplier/message features are demo only. Reviews are sample text.
- Mobile pages are separate files (as requested). The desktop pages are responsive too.

## 8. Image sources and credits

- Product, banner, service and flag images: exported from the original Figma "Ecommerce Web Design" community design that came with the project (converted to WebP, resized). The Germany flag was drawn with a small script.
- Icons: Font Awesome Free 6 (icons CC BY 4.0, fonts SIL OFL 1.1, code MIT).
- Font: Roboto (SIL Open Font License 1.1), via the Fontsource package.
- If you replace images with photos from Unsplash, Pexels or similar, add the credit here.

## 9. Tests done

Automated browser tests (Playwright) were run in Chromium against a local server: 67 checks passed.
- All 11 main pages at 375, 768 and 1440 px: no console errors, no failed requests, no broken images, no horizontal scroll.
- Search, no-results state, category/brand/price/rating filters, both sort orders, list view, pagination.
- Product details, add to cart, badge, persistence after reload, quantity, coupon (valid and invalid), totals, remove, empty cart.
- Buy now, checkout validation, bad card rejected, order confirmation, card number not stored, cart cleared, orders page.
- Mobile list: Load more, filter sheet, add to cart, drawer menu.
- A script checked that all 187 local links and file paths exist.

**Not tested:** Firefox, Safari and real phones (Firefox could not be installed in my test environment), screen readers, and a side-by-side comparison with Figma. Please open the site in Firefox yourself before submitting.

## 10. Upload to GitHub

### Browser method (no Git needed)
1. Create an account at https://github.com and click New repository. Name it, for example, `brand-ecommerce-store`, keep it Public and click Create.
2. On the empty repository page click "uploading an existing file".
3. Open your project folder in File Explorer, press Ctrl+A to select everything (the folders and files, not the folder itself) and drag it into the browser. Do not upload `node_modules` if you have one.
4. Write a commit message such as "Add e-commerce project" and click Commit changes.
   (If a folder fails to upload, upload the zip contents folder by folder.)

### Git method
```
git init
git add .
git commit -m "Add e-commerce project"
git branch -M main
git remote add origin https://github.com/YOUR-USERNAME/brand-ecommerce-store.git
git push -u origin main
```

### GitHub Pages
1. In the repository open Settings > Pages.
2. Under "Build and deployment" choose Source: Deploy from a branch, Branch: `main`, Folder: `/ (root)`, then Save.
3. After about a minute the site is at `https://YOUR-USERNAME.github.io/brand-ecommerce-store/`.

All links in the project are relative, so it works under the repository sub-path. Keep the file names in lowercase exactly as they are (GitHub Pages is case sensitive).
