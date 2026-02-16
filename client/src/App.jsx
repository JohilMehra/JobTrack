import { Routes, Route, Navigate } from "react-router-dom";
import Layout from "./components/Layout";
import ProtectedRoute from "./components/ProtectedRoute";

import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import Applications from "./pages/Applications";

const App = () => {
  const token = localStorage.getItem("token");

  return (
    <Routes>
      {/* Auth Routes */}
      <Route
        path="/login"
        element={token ? <Navigate to="/dashboard" /> : <Login />}
      />
      <Route
        path="/signup"
        element={token ? <Navigate to="/dashboard" /> : <Signup />}
      />

      {/* Protected Layout Routes */}
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="/dashboard" />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="applications" element={<Applications />} />
      </Route>

      {/* Fallback */}
      <Route path="*" element={<h1 className="p-10">404 Not Found</h1>} />
    </Routes>
  );
};

export default App;
