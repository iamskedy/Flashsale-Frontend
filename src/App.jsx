import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import Nav from './components/Nav'
import Ticker from './components/Ticker'
import ProtectedRoute from './components/ProtectedRoute'
import AdminRoute from './components/AdminRoute'
import LoginPage from './pages/LoginPage'
import HomePage from './pages/HomePage'
import SalesPage from './pages/SalesPage'
import SalePage from './pages/SalePage'
import OrdersPage from './pages/OrdersPage'
import AdminLayout from './pages/AdminLayout'
import AdminDashboard from './pages/AdminDashboard'
import AdminProducts from './pages/AdminProducts'
import AdminSales from './pages/AdminSales'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30_000,
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
})

function CustomerLayout() {
  return (
    <>
      <Nav />
      <Ticker />
      <Outlet />
    </>
  )
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>

          {/* ── Admin panel (own layout, no Nav/Ticker) ── */}
          <Route element={<AdminRoute />}>
            <Route path="/admin" element={<AdminLayout />}>
              <Route index           element={<AdminDashboard />} />
              <Route path="products" element={<AdminProducts />} />
              <Route path="sales"    element={<AdminSales />} />
            </Route>
          </Route>

          {/* ── Customer site ── */}
          <Route path="/login" element={<LoginPage />} />

          <Route element={<ProtectedRoute />}>
            <Route element={<CustomerLayout />}>
              <Route path="/"              element={<HomePage />} />
              <Route path="/sales"         element={<SalesPage />} />
              <Route path="/sales/:saleId" element={<SalePage />} />
              <Route path="/orders"        element={<OrdersPage />} />
            </Route>
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />

        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  )
}