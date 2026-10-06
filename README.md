# BloodConnect

> **“Connecting Every Drop to Those Who Need It.”**

A modern, premium, professional frontend prototype for a **Healthcare Blood Bank Management System** built exclusively with **HTML5 and CSS3**.

Designed with the aesthetic precision of modern hospital software, healthtech SaaS dashboards, and Apple-level spacing, BloodConnect serves as an academic and portfolio-grade project ready for instant deployment to **GitHub Pages**.

---

## 🌟 Key Features

- **Central Command Center Dashboard (`dashboard.html`)**
  - Enterprise healthcare administration layout with sidebar and main content.
  - 4 large KPI metrics with percentage trends and comparison periods.
  - Real-time **Recent Activity Timeline** tracking dispatches, donations, and vault updates.
  - Comprehensive **Alert Center** highlighting critical deficits, impending expirations, and emergency requests.

- **Real-Time Blood Inventory Ledger (`inventory.html`)**
  - Dynamic stock tracking across all 8 ABO/Rh classifications (`O+`, `O-`, `A+`, `A-`, `B+`, `B-`, `AB+`, `AB-`).
  - Cold-chain safety metrics, critical reserve threshold indicators, and shelf-life expiration risk ratings.
  - Visual filter controls and fractionated blood component breakdowns (PRBC, Platelets, FFP, Cryoprecipitate).

- **Voluntary Donor Management (`donors.html`)**
  - Voluntary donor registry with donation interval calculators (90-day cooldown status).
  - Health clearance tracking, contact coordinates, and emergency broadcast availability.
  - Complete donor registration form with accessible labels, date pickers, and medical consent protocols.

- **Requisition & Emergency Dispatch Hub (`requests.html`)**
  - Acute trauma requisition queue with priority classification badges (*Critical*, *Urgent*, *Standard*).
  - Prominent emergency alert panel with pulsating CSS animations.
  - Automated cross-match status indicators from requisition to cold-chain delivery.

- **Hospital & Blood Center Network (`hospitals.html`)**
  - Directory of connected hospitals, trauma centers, and regional fractionation centers.
  - Pure CSS **Regional Blood Network** visual topology illustrating hub-and-spoke telemetry without external map scripts.

- **Analytics, Reports & Intelligence (`analytics.html`)**
  - Pure CSS column/bar charts illustrating monthly blood collection volumes.
  - Pure CSS conic-gradient donut chart showing blood group inventory distributions.
  - Departmental demand bars and SVG vector trend area charts tracking dispatch times.
  - Downloadable governance and compliance audit reports table.

- **System Architecture & Clinical Reference (`about.html`)**
  - Mission, Vision, and the Six Pillars of Blood Logistics Modernization.
  - Educational **Blood Compatibility Reference Matrix** detailing ABO/Rh donor and recipient relationships.

- **Institutional Authentication UI (`login.html`)**
  - Split-screen healthtech portal with role selector (Administrator, Blood Staff, Hospital Liaison).

- **24/7 Emergency Support Desk (`contact.html`)**
  - Emergency hotline banner, regional vault facilities directory, and pure HTML5/CSS FAQ accordion.

- **Mock REST API & Dummy Database Backend (`server.js`, `data/db.json`)**
  - Native Node.js REST API server with zero external dependencies (`npm start`).
  - Realistic dummy database with 6 collections (`inventory`, `donors`, `requests`, `hospitals`, `activity`, `stats`).
  - Relational SQL schema (`data/schema.sql`) for PostgreSQL/SQLite/MySQL interoperability.
  - Client-side connector (`js/api.js`) providing live API binding with static `localStorage` fallback for GitHub Pages.

---

## 🚀 Technology Stack & Constraints

- **HTML5**: Semantic tags (`<header>`, `<nav>`, `<main>`, `<section>`, `<article>`, `<aside>`, `<footer>`, `<details>`, `<summary>`).
- **CSS3**: Custom properties (`:root`), Flexbox, CSS Grid, conic-gradients, keyframe animations, glassmorphism (`backdrop-filter`), responsive media queries.
- **Strictly Zero JavaScript**: No `<script>` tags, no external libraries (no React, Bootstrap, Tailwind, jQuery, etc.).
- **Zero External Dependencies**: Works completely offline; SVG vector icons embedded natively.

---

## 📂 Project Structure

```text
bloodconnect/
│
├── index.html            # Landing / Public Homepage
├── dashboard.html        # Command Center Administration Dashboard
├── inventory.html        # Cold Storage Blood Inventory Management
├── donors.html           # Voluntary Donor Registry & Registration Form
├── requests.html         # Hospital Requisitions & Emergency Dispatch
├── hospitals.html        # Hospital Network & CSS Topology Diagram
├── analytics.html        # Healthcare BI Analytics & Reports
├── about.html            # About BloodConnect, Mission & Compatibility Matrix
├── login.html            # Institutional Role-Based Sign In
├── contact.html          # 24/7 Support Desk & Interactive FAQ Accordion
│
├── css/
│   └── style.css         # Master stylesheet (tokens, responsive grid, micro-interactions)
│
├── assets/
│   ├── icons/
│   │   ├── favicon.svg   # Vector favicon blood drop
│   │   └── logo.svg      # Vector platform logo
│   └── images/
│
└── README.md             # Project documentation & deployment guide
```

---

## 🌐 GitHub Pages Deployment Guide

Deploying BloodConnect to GitHub Pages takes less than a minute:

1. **Initialize Git & Push**:
   ```bash
   git init
   git add .
   git commit -m "feat: Initial commit for BloodConnect static healthcare platform"
   git branch -M main
   git remote add origin https://github.com/<your-username>/bloodconnect.git
   git push -u origin main
   ```

2. **Enable GitHub Pages**:
   - Go to your repository settings on GitHub: `Settings` &rarr; `Pages`.
   - Under **Build and deployment** &rarr; **Source**, select **Deploy from a branch**.
   - Under **Branch**, select `main` and `/ (root)`, then click **Save**.
   - Your site will be published at: `https://<your-username>.github.io/bloodconnect/`

3. **Local Testing**:
   - Open any `.html` file (e.g. `index.html`) directly in Google Chrome, Mozilla Firefox, Microsoft Edge, or Safari.
   - Or run a simple local web server:
     ```bash
     python -m http.server 8080
     ```
     Navigate to `http://localhost:8080`.

---

## 📱 Responsive Breakpoints Tested

The user interface adapts across all modern display viewports:
- **Desktop (1440px / 1200px)**: Multi-column dashboard layouts, sidebar navigation, detailed ledger tables.
- **Tablet (1024px / 768px)**: Stacked grid, responsive table containers with horizontal scroll.
- **Mobile (480px / 375px)**: CSS-only mobile drawer menu via checkbox hack (`#nav-toggle`), fluid typography, stacked cards.

---

## 🔒 Accessibility & Code Quality

- Form controls feature explicit `<label for="...">` bindings.
- Interactive states use visible `:focus-visible` rings for keyboard navigation.
- High color contrast compliant with WCAG AA guidelines (`#C62828` primary on white and navy backgrounds).
- Clean, semantic, human-readable code with descriptive class names (`.card`, `.kpi-card`, `.badge`, `.btn`).

---

## ⚠️ Academic & Portfolio Disclaimer

This project is a **frontend academic and portfolio prototype** created for software engineering demonstration. All patient IDs (`PAT-10284`), donor profiles (`DON-20493`), hospital affiliations, and blood reserve quantities are entirely fictional demonstration data. The application is not connected to a live medical facility, electronic medical record (EMR) system, or clinical database.
