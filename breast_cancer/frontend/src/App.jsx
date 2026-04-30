import { useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import LoginPage from "./pages/LoginPage";
import Dashboard from "./pages/Dashboard";
import PatientsPage from "./pages/PatientsPage"; // Import PatientsPage
import PredictionsPage from "./pages/PredictionsPage"; // Import PredictionsPage
import { useAuthStore } from "./store/authStore";

// Wraps any route that requires login
function ProtectedRoute({ children }) {
  const { token } = useAuthStore();
  return token ? children : <Navigate to="/login" replace />;
}

function App() {
  const { token } = useAuthStore();

  // Force re-render when token changes
  useEffect(() => {
    const unsubscribe = useAuthStore.subscribe(
      (state) => state.token,
      () => {} // Trigger re-render on token change
    );
    return () => unsubscribe();
  }, []);

  return (
    <BrowserRouter>
      <Toaster position="top-center" reverseOrder={false} />
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/patients" element={<PatientsPage />} /> //ProtectedRoute not added will do later comment for reminder
        <Route path="/predictions" element={
          <ProtectedRoute>
            <PredictionsPage />
          </ProtectedRoute>
        } /> //ProtectedRoute added
  

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        {/* Root: go to dashboard if logged in, otherwise login */}
        <Route path="/" element={<Navigate to={token ? "/dashboard" : "/login"} replace />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;