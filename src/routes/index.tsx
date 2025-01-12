import { Routes, Route } from "react-router-dom";
import { ProtectedRoute } from "./ProtectedRoute";
import Dashboard from "../pages/Dashboard";
import Home from "../pages/Home";
import { Login } from "../pages/Login";
import { Register } from "../pages/Register";
import { Layout } from "../layouts/Layout";
import { UnProtectedRoute } from "./UnProtectedRoute";

export function AppRoutes() {
  return (
    <Routes>
      <Route element={<Layout />}>
      {/* Unprotected Routes */}
        <Route path="/" element={<Home />} />
        <Route
          path="/login"
          element={
            <UnProtectedRoute>
              <Login />
            </UnProtectedRoute>
          }
        />
        <Route
          path="/register"
          element={
            <UnProtectedRoute>
              <Register />
            </UnProtectedRoute>
          }
        />
        
        {/* Protected Routes */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
      </Route>
    </Routes>
  );
}
