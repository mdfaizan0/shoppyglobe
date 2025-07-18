# 🛍️ ShoppyGlobe

**ShoppyGlobe** is a feature-rich, single-page e-commerce web application built with **React**, **Redux**, and **core CSS**, offering product browsing, cart management, filtering, checkout, and order confirmation.

## 💻 Live Demo

[Click here](https://superlative-jalebi-9f1b8b.netlify.app/) to view a live demo of **ShoppyGlobe**. 

## 🚀 Features

- **Global Search & Filters** — Search by title, brand, category, or description.
- **Cart Functionality** — Add, remove, and manage quantity in real-time.
- **Product Details Page** — Dynamic rendering by using React-Router's useParams.
- **Checkout Process** — Calculates subtotal, taxes, and delivery fees.
- **Custom Hooks** — For cleaner, reusable API data fetching.
- **Lazy Loading** — Components loaded on demand via `React.lazy` and `Suspense`.

---

## 🧰 Tech Stack

- **Frontend**: React ([Vite](https://vite.dev/)), [Redux Toolkit](https://redux-toolkit.js.org/), [React Router DOM](https://reactrouter.com/)  
- **Styling**: Core CSS
- **API**: [DummyJSON](https://dummyjson.com/)  
- **Routing**: Nested, parameterized, and error-bound via React Router v6+
---

## 📂 Folder Structure
```
├── assets/ # Favicon and logos
├── components/ # Reusable UI components (e.g. Counter, CartItem)
├── pages/ # Page-level routes (Home, Cart, ProductDetail, etc.)
├── utils/ # Redux slices, custom hooks
├── App.jsx # Layout wrapper
├── main.jsx # Router setup & Redux provider
```
---

## ⚙️ Setup & Run Locally

> Requires Node.js 18+ and internet connection (for API)

#### Clone the project:
```bash
git clone https://github.com/mdfaizan0/shoppyglobe.git
```

#### Go to the project directory:

```bash
cd shoppyglobe
```

#### Install dependencies:

```bash
npm install
```

#### Kickstart the server:

```bash
npm run dev
```

> This project is built for academic and learning purposes only.

Thank You 💚