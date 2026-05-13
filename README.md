# ⚡ Flash Sale — Frontend

> Real-time flash sale frontend built with React + Vite. Live stock updates via WebSocket, JWT auth, and a dark high-performance UI designed for high-concurrency sale events.

🔗 **Live Demo:** [flashsale-frontend-murex.vercel.app](https://flashsale-frontend-murex.vercel.app)  
🔧 **Backend Repo:** [Flashsale-backend-monorepo](https://github.com/iamskedy/Flashsale-backend-monorepo)  
🚀 **Backend API:** [flashsale-backend-monorepo-production.up.railway.app](https://flashsale-backend-monorepo-production.up.railway.app)

---

## 🖼️ Features

- 🔐 **JWT Auth** — Login/register with token persisted via Zustand + localStorage
- 📡 **Real-time Stock** — Socket.IO WebSocket updates stock bar live on every purchase
- ⏱️ **Countdown Timer** — Live HH:MM:SS countdown per flash sale
- 🛡️ **Protected Routes** — Unauthenticated users redirected to `/login` automatically
- ⚡ **Buy Button State Machine** — idle → loading → processing → success/error
- 📋 **Order History** — Real-time refreshing order dashboard
- 🎨 **Dark Glassmorphic UI** — Custom CSS variables, no Tailwind dependency

---

## 🧰 Tech Stack

| Library | Version | Purpose |
|---|---|---|
| React | 18 | UI framework |
| Vite | 5 | Dev server + bundler |
| react-router-dom | 6 | Client-side routing |
| @tanstack/react-query | 5 | Server state + caching |
| Axios | 1.7 | HTTP client with JWT interceptor |
| Socket.IO Client | 4.8 | WebSocket real-time connection |
| Zustand | 4.5 | Global auth + stock state |

---

## 🏗️ Architecture

```
App.jsx (BrowserRouter + QueryClientProvider)
│
├── / → HomePage          (public stats + sale preview)
├── /login → LoginPage    (JWT auth form)
├── /sales → SalesPage    (all active sales grid)         ← Protected
├── /sales/:id → SalePage (buy page + live WebSocket)     ← Protected
└── /orders → OrdersPage  (user order history)            ← Protected

State layers:
  Zustand auth.store  → token, userId, role (localStorage sync)
  Zustand sale.store  → live stock map { saleId → count } (WebSocket driven)
  React Query         → sales[], orders[] (server state, 30s stale)
```

### Real-time Flow (SalePage)
```
1. Page mounts → subscribe:sale emitted via Socket.IO
2. User clicks Buy Now
3. POST /api/orders/purchase (with idempotency key)
4. Button transitions: idle → loading → processing
5. Backend BullMQ worker processes order
6. Socket.IO emits order:confirmed or order:failed
7. Button transitions: → success / error
8. stock:update event → StockBar re-renders live
```

---

## 🔑 Key Implementation Details

### JWT Interceptor (axios client)
```js
// Automatically attaches token to every request
axiosClient.interceptors.request.use(config => {
  const { token } = useAuthStore.getState();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Auto-logout on 401
axiosClient.interceptors.response.use(null, error => {
  if (error.response?.status === 401) {
    useAuthStore.getState().logout();
    window.location.href = '/login';
  }
  return Promise.reject(error);
});
```

### Socket.IO Singleton
```js
// One connection shared across the entire app
let socket = null;
export const getSocket = () => {
  if (!socket) {
    socket = io(import.meta.env.VITE_WS_URL, {
      auth: { token: useAuthStore.getState().token }
    });
  }
  return socket;
};
```

### Idempotency Key on Purchase
```js
// Prevents double-orders from double-clicks or retries
headers: { 'x-idempotency-key': crypto.randomUUID() }
```

---

## 🚀 Local Setup

### Prerequisites
- Node.js 18+
- Backend running at `http://localhost:3000`

### Run Locally

```bash
# Clone
git clone https://github.com/iamskedy/Flashsale-Frontend
cd Flashsale-Frontend

# Install dependencies
npm install

# Configure environment
cp .env.example .env
# Set VITE_API_URL and VITE_WS_URL to your backend URL

# Start dev server
npm run dev
# → http://localhost:5173
```

### Environment Variables

```bash
# .env
VITE_API_URL=http://localhost:3000
VITE_WS_URL=http://localhost:3000
```

---

## 📁 Project Structure

```
Flashsale-Frontend/
├── src/
│   ├── pages/
│   │   ├── HomePage.jsx      # Hero + sale preview grid
│   │   ├── LoginPage.jsx     # Login + Register form
│   │   ├── SalesPage.jsx     # All sales listing
│   │   ├── SalePage.jsx      # Buy page with live WebSocket stock
│   │   └── OrdersPage.jsx    # User order history
│   ├── components/
│   │   ├── Nav.jsx           # Sticky nav with active link state
│   │   ├── Ticker.jsx        # Scrolling marquee banner
│   │   ├── ProtectedRoute.jsx # Auth guard → redirect to /login
│   │   ├── StockBar.jsx      # Animated stock bar (green→gold→red)
│   │   ├── Countdown.jsx     # Live HH:MM:SS countdown
│   │   ├── BuyButton.jsx     # 5-state buy button machine
│   │   ├── OrderStatus.jsx   # Status pill badge
│   │   └── Toast.jsx         # Bottom-right notifications
│   ├── store/
│   │   ├── auth.store.js     # Zustand: token, userId, role
│   │   └── sale.store.js     # Zustand: live stock map
│   ├── api/
│   │   ├── client.js         # Axios instance + interceptors
│   │   ├── auth.api.js       # login(), register()
│   │   ├── sales.api.js      # getSales(), getSale(id)
│   │   └── orders.api.js     # purchase(), getOrders()
│   ├── socket/
│   │   └── socket.js         # Socket.IO singleton
│   ├── App.jsx               # Routes + providers
│   └── index.css             # CSS variables + animations
├── vercel.json               # SPA rewrite rules
├── vite.config.js
└── .env.example
```

---

## ☁️ Deployment (Vercel)

Deployed on **Vercel** with automatic deploys on push to `main`.

```json
// vercel.json — required for SPA client-side routing
{
  "rewrites": [{ "source": "/(.*)", "destination": "/" }]
}
```

| Variable | Set In |
|---|---|
| `VITE_API_URL` | Vercel → Settings → Environment Variables |
| `VITE_WS_URL` | Vercel → Settings → Environment Variables |

---

## 👤 Author

**Shubham Dubey** — Frontend + Backend Engineer  
[GitHub](https://github.com/iamskedy) · [LinkedIn](https://linkedin.com/in/iamskedy)