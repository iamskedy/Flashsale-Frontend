# ⚡ FlashSale Frontend — Complete Build & Run Guide

> Full JavaScript (no TypeScript) React app. Dark-themed real-time flash sale platform with WebSocket live stock, protected routes, and Zustand auth persistence.

---

## Table of Contents

1. [Project Overview](#1-project-overview)
2. [Tech Stack](#2-tech-stack)
3. [Folder Structure](#3-folder-structure)
4. [Prerequisites](#4-prerequisites)
5. [Installation & Running](#5-installation--running)
6. [Environment Variables](#6-environment-variables)
7. [How Each File Works](#7-how-each-file-works)
8. [API Contract (What the Backend Must Provide)](#8-api-contract)
9. [WebSocket Events](#9-websocket-events)
10. [Why Your Original App Was Blank](#10-why-your-original-app-was-blank)
11. [Common Errors & Fixes](#11-common-errors--fixes)
12. [Building for Production](#12-building-for-production)

---

## 1. Project Overview

FlashSale is a real-time e-commerce flash sale frontend. Users log in, browse time-limited deals, buy items (stock decrements live via WebSocket), and track their orders. Key features:

- 🔐 JWT auth persisted to `localStorage` via Zustand
- 📡 Socket.IO WebSocket for live stock updates and order confirmations
- ⚡ React Query for server state (sales, orders) with 30s stale time
- 🛡️ Protected routes — unauthenticated users redirect to `/login`
- 🎨 Dark glassmorphic UI with `Bebas Neue` + `DM Sans` typography

---

## 2. Tech Stack

| Library | Version | Purpose |
|---|---|---|
| React | 18 | UI framework |
| Vite | 5 | Dev server & bundler |
| react-router-dom | 6 | Client-side routing |
| @tanstack/react-query | 5 | Server state & caching |
| axios | 1.7 | HTTP client |
| socket.io-client | 4.8 | WebSocket real-time |
| zustand | 4.5 | Global auth & stock state |

> **JavaScript only** — no TypeScript, no Tailwind. Pure inline styles + CSS variables.

---

## 3. Folder Structure

```
flashsale-app/
├── index.html                  # Entry HTML, loads Google Fonts
├── vite.config.js              # Vite config with API & WS proxy
├── package.json                # Dependencies (JS, not TS)
├── .env                        # VITE_API_URL + VITE_WS_URL
│
└── src/
    ├── main.jsx                # ReactDOM.createRoot entry point
    ├── App.jsx                 # BrowserRouter + all Routes
    ├── index.css               # CSS variables, animations, global styles
    │
    ├── store/
    │   ├── auth.store.js       # Zustand: token, userId, role → localStorage
    │   └── sale.store.js       # Zustand: live stock map (saleId → number)
    │
    ├── api/
    │   ├── client.js           # Axios instance: baseURL, JWT header, 401 logout
    │   ├── auth.api.js         # login(), register()
    │   ├── sales.api.js        # getSales(), getSale(id)
    │   └── orders.api.js       # purchase(), getOrders()
    │
    ├── socket/
    │   └── socket.js           # Socket.IO singleton: getSocket(), disconnectSocket()
    │
    ├── components/
    │   ├── Nav.jsx             # Sticky top nav with active link highlighting
    │   ├── Ticker.jsx          # Scrolling orange marquee bar
    │   ├── ProtectedRoute.jsx  # Redirects to /login if no token
    │   ├── StockBar.jsx        # Animated stock percentage bar (green→gold→red)
    │   ├── Countdown.jsx       # Live HH:MM:SS countdown from targetTime
    │   ├── BuyButton.jsx       # State-machine button: idle/loading/processing/success/error
    │   ├── OrderStatus.jsx     # Coloured pill badge for order status
    │   └── Toast.jsx           # Bottom-right notification toasts
    │
    └── pages/
        ├── LoginPage.jsx       # Login + Register form, calls authApi
        ├── HomePage.jsx        # Hero, stats, "Today's Drops" preview grid
        ├── SalesPage.jsx       # Full sales grid + live countdown banner
        ├── SalePage.jsx        # Single sale: buy button, WebSocket stock, countdown
        └── OrdersPage.jsx      # User's order history with real-time refresh
```

---

## 4. Prerequisites

You need these installed on your machine:

```bash
# Check versions
node --version    # Must be >= 18.0.0
npm --version     # Must be >= 9.0.0
```

If Node is not installed, download from: https://nodejs.org (choose the LTS version)

You also need the **backend server running** at `http://localhost:3000`. The frontend is a pure UI — it needs the API to show any data.

---

## 5. Installation & Running

### Step 1 — Extract and enter the folder

```bash
unzip flashsale-app.zip
cd flashsale-app
```

### Step 2 — Install dependencies

```bash
npm install
```

This installs all packages listed in `package.json`. It creates a `node_modules/` folder. Takes ~30–60 seconds.

### Step 3 — Configure environment

Open `.env` and update the URLs to match your backend:

```env
VITE_API_URL=http://localhost:3000
VITE_WS_URL=http://localhost:3000
```

If your backend runs on a different port (e.g. 8080), change both values.

### Step 4 — Start the dev server

```bash
npm run dev
```

You will see output like:

```
  VITE v5.x.x  ready in 300ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: http://192.168.x.x:5173/
```

Open `http://localhost:5173` in your browser.

### Step 5 — Log in

- Go to `http://localhost:5173/login`
- Enter your credentials (user must exist in the backend database)
- On success, the JWT token is stored in `localStorage` under the key `flashsale-auth`
- You are redirected to the home page

---

## 6. Environment Variables

All environment variables must start with `VITE_` to be accessible in the browser.

| Variable | Default | Description |
|---|---|---|
| `VITE_API_URL` | `http://localhost:3000` | Base URL for all REST API calls (`/api/...`) |
| `VITE_WS_URL` | `http://localhost:3000` | URL for Socket.IO connection |

**Important:** After changing `.env`, you must restart the dev server (`Ctrl+C` then `npm run dev`).

---

## 7. How Each File Works

### `src/main.jsx`
Entry point. Mounts `<App />` into `<div id="root">` in `index.html`. Uses React 18's `createRoot`.

### `src/App.jsx`
Sets up three things:
1. `QueryClientProvider` — wraps the whole app so any component can use `useQuery`
2. `BrowserRouter` — enables URL-based navigation
3. `Routes` — maps URLs to page components. All pages except `/login` are wrapped in `<ProtectedRoute />`.

### `src/store/auth.store.js`
Uses Zustand to store `token`, `userId`, and `role`. These are manually saved to `localStorage` on `login()` and removed on `logout()`. On page refresh, the initial state is loaded from `localStorage` — this is why you stay logged in.

### `src/store/sale.store.js`
In-memory map of `saleId → stockCount`. Updated in real-time via WebSocket. Components read from this store to show live stock without re-fetching from the API.

### `src/api/client.js`
Creates one Axios instance with:
- `baseURL` from `VITE_API_URL`
- Request interceptor: reads `token` from auth store, adds `Authorization: Bearer <token>` header
- Response interceptor: if the backend returns `401`, calls `logout()` and redirects to `/login`

### `src/socket/socket.js`
Creates a Socket.IO connection **once** (singleton pattern). If `getSocket()` is called multiple times, it returns the same connection. The socket connects to `VITE_WS_URL` and sends the JWT token in the `auth` object. Connection errors are logged but do not crash the app.

### `src/components/ProtectedRoute.jsx`
Reads `isAuthenticated()` from the auth store. If `false` (no token), renders `<Navigate to="/login" replace />` instead of the page. This is what enforces auth on `/`, `/sales`, `/sales/:id`, and `/orders`.

### `src/components/BuyButton.jsx`
A state machine button. It renders differently based on the `state` prop:
- `idle` → orange "Buy Now" button
- `loading` → grey spinning "Confirming..."
- `processing` → grey spinning "Processing payment..."
- `success` → green "Order Confirmed!"
- `error` → red "Failed — Retry" (clickable, calls `onClick` to reset)

### `src/pages/SalePage.jsx`
The most complex page. On mount:
1. Fetches sale data via `useQuery`
2. Connects to WebSocket and emits `subscribe:sale` with the `saleId`
3. Listens for `stock:update`, `order:confirmed`, `order:failed` events
4. On buy: calls `ordersApi.purchase()`, transitions button to `processing`, waits for WebSocket confirmation

On unmount: cleans up all socket listeners and emits `unsubscribe:sale`.

---

## 8. API Contract

The frontend expects these REST endpoints on the backend:

### Auth

```
POST /api/auth/login
Body: { "email": "...", "password": "..." }
Response: { "data": { "token": "JWT", "user": { "id": "...", "email": "...", "role": "user" } } }

POST /api/auth/register
Body: { "email": "...", "password": "..." }
Response: same as login
```

### Sales

```
GET /api/sales
Headers: Authorization: Bearer <token>
Response: { "data": [ { sale objects... } ] }

GET /api/sales/:id
Headers: Authorization: Bearer <token>
Response: { "data": { sale object } }
```

**Sale object shape:**
```json
{
  "id": "uuid",
  "productId": "uuid",
  "salePrice": "1999",
  "totalStock": 100,
  "maxPerUser": 1,
  "startTime": "ISO-8601",
  "endTime": "ISO-8601",
  "status": "active | scheduled | ended | cancelled",
  "product": {
    "id": "uuid",
    "name": "Sony WH-1000XM5",
    "description": "...",
    "basePrice": "5999",
    "imageUrl": null
  }
}
```

### Orders

```
POST /api/orders/purchase
Headers: Authorization: Bearer <token>
         x-idempotency-key: <uuid>
Body: { "saleId": "...", "productId": "...", "quantity": 1 }
Response: { "data": { ... } }

GET /api/orders/my-orders
Headers: Authorization: Bearer <token>
Response: { "data": [ { order objects... } ] }
```

**Order object shape:**
```json
{
  "id": "uuid",
  "userId": "uuid",
  "saleId": "uuid",
  "productId": "uuid",
  "quantity": 1,
  "unitPrice": "1999",
  "totalAmount": "1999",
  "status": "pending | confirmed | failed | cancelled",
  "paymentId": "pay_xxx or null",
  "createdAt": "ISO-8601",
  "updatedAt": "ISO-8601"
}
```

---

## 9. WebSocket Events

The frontend both **emits** and **listens** on the Socket.IO connection.

### Frontend emits:

| Event | Payload | When |
|---|---|---|
| `subscribe:sale` | `saleId: string` | On entering a sale detail page |
| `unsubscribe:sale` | `saleId: string` | On leaving a sale detail page |

### Frontend listens for:

| Event | Payload | Action |
|---|---|---|
| `stock:update` | `{ saleId, stockRemaining }` | Updates `useSaleStore` → StockBar re-renders |
| `order:confirmed` | `{ orderId }` | Sets buyState to `success`, invalidates orders query |
| `order:failed` | `{ reason }` | Sets buyState to `error`, shows reason message |

---

## 10. Why Your Original App Was Blank

Your original TypeScript app had four compounding issues:

### Issue 1: ProtectedRoute redirecting immediately
The `useAuthStore` with `zustand/middleware persist` has a hydration delay on first render. Before the store rehydrates from `localStorage`, `isAuthenticated()` returns `false` — causing an immediate redirect to `/login` even for logged-in users. The JS version solves this by reading `localStorage` synchronously in the store initializer, so the state is correct from frame 1.

### Issue 2: Backend not running / wrong URL
The app renders nothing when `salesApi.getSales()` throws because the backend isn't reachable. React Query returns `undefined` for `data`, and the "Today's Drops" grid conditionally renders `null`. Add a loading and error state to see what's happening. The JS version uses `retry: 1` (not 3) so failures surface faster.

### Issue 3: WebSocket crashing on unauthenticated pages
The original `getSocket()` was called inside `LoginPage` on `submit()`. If the socket constructor throws (e.g. invalid URL), it bubbled up and could break the component. The JS version wraps socket calls in `try/catch`.

### Issue 4: Tailwind directives with no compiler
`index.css` had `@tailwind base; @tailwind components; @tailwind utilities;` but `package.json` had no `tailwindcss` package. Vite would either error or strip those lines, removing base CSS resets. The JS version removes Tailwind entirely and uses hand-written CSS variables and keyframes only.

---

## 11. Common Errors & Fixes

### "Cannot connect to server" / all pages blank

```bash
# Check the backend is running
curl http://localhost:3000/api/sales
# Should return JSON, not "connection refused"
```

If the backend is on a different port:
```env
# .env
VITE_API_URL=http://localhost:8080
VITE_WS_URL=http://localhost:8080
```

Then restart: `Ctrl+C` → `npm run dev`

---

### "401 Unauthorized" loop / redirected to login immediately

Your token expired or the backend changed the JWT secret. Fix:
```javascript
// Open browser DevTools → Application → Local Storage → localhost:5173
// Delete the "flashsale-auth" key, then log in again
localStorage.removeItem('flashsale-auth')
```

---

### "CORS error" in console

The backend needs to allow `http://localhost:5173`. Add to your backend:
```javascript
// Express example
app.use(cors({ origin: 'http://localhost:5173', credentials: true }))
```

For Socket.IO on the backend:
```javascript
const io = new Server(server, {
  cors: { origin: 'http://localhost:5173', methods: ['GET', 'POST'] }
})
```

---

### Stock bar shows 100% even after purchase

The WebSocket `stock:update` event wasn't received. Check:
1. Backend is emitting the event after a purchase
2. The frontend subscribed: look for `[WS] Connected:` in browser console
3. The event name matches exactly: `stock:update` (not `stockUpdate` or `stock_update`)

---

### "Module not found" error on npm run dev

```bash
# Delete node_modules and reinstall
rm -rf node_modules
npm install
npm run dev
```

---

### White flash on page load

Add this to `index.html` `<head>` to prevent the flash before CSS loads:
```html
<style>body { background: #08090c; }</style>
```

---

## 12. Building for Production

```bash
npm run build
```

This outputs a `dist/` folder with static files. To preview locally:

```bash
npm run preview
# Opens at http://localhost:4173
```

### Deploying to Vercel

1. Push your code to GitHub
2. Import the repo on vercel.com
3. Set environment variables in the Vercel dashboard:
   - `VITE_API_URL` = your production backend URL
   - `VITE_WS_URL` = your production WebSocket URL
4. Add `vercel.json` for SPA routing:

```json
{
  "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
}
```

### Deploying to Netlify

Add `public/_redirects`:
```
/*  /index.html  200
```

---

## Quick Reference Card

```bash
# Install
npm install

# Run dev server (http://localhost:5173)
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Clear auth and restart fresh
# (in browser console)
localStorage.clear(); location.reload();
```

---

*Built with React 18 + Vite 5 + Zustand + React Query + Socket.IO*
