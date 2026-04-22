import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import Nav from './components/Nav'
import Ticker from './components/Ticker'
import ProtectedRoute from './components/ProtectedRoute'
import LoginPage from './pages/LoginPage'
import HomePage from './pages/HomePage'
import SalesPage from './pages/SalesPage'
import SalePage from './pages/SalePage'
import OrdersPage from './pages/OrdersPage'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30_000,
      retry: 1,
      // Don't refetch on window focus in development — reduces noise
      refetchOnWindowFocus: false,
    },
  },
})

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Nav />
        <Ticker />
        <Routes>
          <Route path="/login" element={<LoginPage />} />

          {/* Protected: requires auth token in localStorage */}
          <Route element={<ProtectedRoute />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/sales" element={<SalesPage />} />
            <Route path="/sales/:saleId" element={<SalePage />} />
            <Route path="/orders" element={<OrdersPage />} />
          </Route>

          {/* Catch-all */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  )
}
