# GrainMaster Agro Solutions Ltd. (RC9167936)
**Official Static Company & E-Commerce Catalog Website**

- **Company Name:** GrainMaster Agro Solutions Ltd.
- **Corporate Registration:** RC9167936
- **Head Office & Showroom:** GF7, Helu plaza, France rd by Galadima, Kano Nigeria
- **Direct Hotline & WhatsApp:** +2349032326937
- **Official Domain:** [https://grainmasteragro.com](https://grainmasteragro.com)
- **Official Platform:** Static GitHub Pages Architecture (HTML5, Vanilla CSS3, Vanilla JS ES6+)

---

## 🌟 Key Features

1. **E-Commerce Horizontal Scrolling Showcases:**
   - 4 specialized horizontal touch/drag runway carousels with smooth arrow navigation:
     - Commercial Rice Milling Machines & Whiteners
     - Precision Milling Screens, Rubber & Emery Rollers
     - Optical Color Sorters, Solenoid Ejector Valves & Pressure Regulators
     - Elevator Buckets, Bolts, Suction Fans & Maize Processing Machinery
2. **Detailed Product Modal with Technical Specifications:**
   - Tabbed engineering spec sheets (Motor Power, Dimensions, Capacity, Material, RPM, Weight).
   - Machine compatibility matrix (Exact fitment for Bühler, Satake, N-Series).
   - High-resolution real equipment photography with zoom.
   - Quantity selector with direct WhatsApp enquiry generator.
3. **Interactive Shopping Cart with WhatsApp Checkout:**
   - Slide-over drawer with real-time total calculations in Nigerian Naira (₦).
   - Customer checkout form: Full Name, Phone / WhatsApp, Delivery State / City, Order Type, Machine Notes.
   - **One-Click WhatsApp Checkout:** Compiles an itemized, pre-formatted order sent directly to `+2349032326937`.
   - **Offline Pro-Forma Invoice Generation:** Instant print-ready quotation sheet with bank transfer details and showroom collection address.
4. **Consolidated Collapsible Floating Action Button (FAB):**
   - Floating corner trigger with subtle pulsing indicator.
   - Expands into three direct communication channels:
     - **WhatsApp** (+2349032326937)
     - **Facebook** (Official page)
     - **Direct Phone Call** (+2349032326937)
5. **Authentic, Real Product Photography:**
   - All 26 machines and spare parts feature genuine, verified industrial photographs stored locally in `assets/images/products/` for fast loading and zero external dependencies.

---

## 📂 Project Structure

```
grainmaster-agro/
├── index.html                   # Main static website landing page
├── README.md                    # Documentation & deployment guide
└── assets/
    ├── css/
    │   └── style.css            # Responsive agro-industrial styles & CSS variables
    ├── js/
    │   ├── products-data.js     # Technical database for 26 machines & spare parts
    │   └── app.js               # Reactive cart, modal, filter, search & WhatsApp logic
    └── images/
        └── products/            # 26 Verified real product photos
            ├── buhler-topwhite-bspb.png
            ├── buhler-drpa-polisher.jpg
            ├── n70-rice-polisher.jpg
            ├── n120-rice-polisher.jpg
            ├── satake-vta-whitener.jpg
            ├── satake-kb40-polisher.jpg
            ├── rice-color-sorter.jpg
            ├── color-sorter-ejector.jpg
            ├── color-sorter-regulator.jpg
            ├── color-sorter-chute.jpg
            ├── rubber-roller-paddy.jpg
            ├── emery-roller-whitener.jpg
            ├── iron-roller-polisher.jpg
            ├── bspb-screen.jpg
            ├── drpa-screen.jpg
            ├── n-series-screen.png
            ├── pressure-plates-brake.jpg
            ├── elevator-cups-hdpe.jpg
            ├── elevator-bolts-nuts.jpg
            ├── centrifugal-suction-fan.jpg
            ├── screw-impeller-auger.jpg
            ├── heavy-duty-bearings.jpg
            ├── industrial-fasteners.jpg
            ├── hammer-mill-cyclone.jpg
            ├── hammer-mill-beaters.jpg
            └── maize-degerminator.jpg
```

---

## 🚀 How to Publish to GitHub Pages

### Option 1: Using Git via Command Line

1. Open your terminal in this project folder:
   ```bash
   cd "C:\Users\Engr_ Mukhtar\.gemini\antigravity\scratch\grainmaster-agro"
   ```

2. Initialize git and commit files:
   ```bash
   git init
   git add .
   git commit -m "Initial release of GrainMaster Agro Solutions website"
   ```

3. Create a new repository on your GitHub account (e.g. `grainmaster-agro`).

4. Link the remote and push to GitHub:
   ```bash
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/grainmaster-agro.git
   git push -u origin main
   ```

5. Enable GitHub Pages:
   - On GitHub, go to your repository **Settings** > **Pages**.
   - Under **Build and deployment** > **Source**, select **Deploy from a branch**.
   - Select `main` branch and `/ (root)` folder, then click **Save**.
   - Your site will be live at `https://YOUR_USERNAME.github.io/grainmaster-agro/` in seconds!

### Option 2: Drag & Drop via GitHub Web UI

1. Create a repository on github.com named `grainmaster-agro`.
2. Click **Uploading an existing file**.
3. Drag and drop all folders (`assets`, `index.html`, `README.md`).
4. Commit and enable GitHub Pages under **Settings** > **Pages**.
