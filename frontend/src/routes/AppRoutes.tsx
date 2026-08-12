import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { PageTransition } from "../components/layout/PageTransition";

import { ProtectedRoute } from "./ProtectedRoute";
import { DashboardLayout } from "../layouts/DashboardLayout";

import { Login } from "../pages/Login/Login";
import { Register } from "../pages/Register/Register";
import { Dashboard } from "../pages/Dashboard/Dashboard";
import { Customers } from "../pages/Customers/Customers";
import { Products } from "../pages/Products/Products";
import { Inventory } from "../pages/Inventory/Inventory";
import { Challans } from "../pages/Challans/Challans";

export function AppRoutes() {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        {/* Public */}
        <Route path="/login" element={<PageTransition><Login /></PageTransition>} />
        <Route path="/register" element={<PageTransition><Register /></PageTransition>} />

      {/* Protected */}
      <Route
        element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
          <Route index element={<Navigate to="/dashboard" replace />} />

          <Route path="/dashboard" element={<PageTransition><Dashboard /></PageTransition>} />
          <Route path="/customers" element={<PageTransition><Customers /></PageTransition>} />
          <Route path="/products" element={<PageTransition><Products /></PageTransition>} />
          <Route path="/inventory" element={<PageTransition><Inventory /></PageTransition>} />
          <Route path="/challans" element={<PageTransition><Challans /></PageTransition>} />
        </Route>

        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </AnimatePresence>
  );
}
