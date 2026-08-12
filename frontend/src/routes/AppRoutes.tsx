import { Navigate, Route, Routes } from "react-router-dom";

import { ProtectedRoute } from "./ProtectedRoute";
import { DashboardLayout } from "../layouts/DashboardLayout";

import { Login } from "../pages/Login/Login";
import { Dashboard } from "../pages/Dashboard/Dashboard";
import { Customers } from "../pages/Customers/Customers";
import { Products } from "../pages/Products/Products";
import { Inventory } from "../pages/Inventory/Inventory";
import { Challans } from "../pages/Challans/Challans";

export function AppRoutes() {
  return (
    <Routes>
      {/* Public */}
      <Route path="/login" element={<Login />} />

      {/* Protected */}
      <Route
        element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="/dashboard" replace />} />

        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/customers" element={<Customers />} />
        <Route path="/products" element={<Products />} />
        <Route path="/inventory" element={<Inventory />} />
        <Route path="/challans" element={<Challans />} />
      </Route>

      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}
