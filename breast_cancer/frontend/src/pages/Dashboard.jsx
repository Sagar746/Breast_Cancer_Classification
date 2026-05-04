import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import { patientsApi, predictionsApi } from "../api/client";
import { Users, Activity, TrendingUp, LogOut, Plus, X } from "lucide-react";
import toast from "react-hot-toast";
import AddPatient from "../components/AddPatient";

export default function Dashboard() {
  const [stats, setStats] = useState({
    totalPatients: 0,
    totalPredictions: 0,
    malignantPredictions: 0,
    benignPredictions: 0,
  });
  const [loading, setLoading] = useState(true);
  const [showAddPatient, setShowAddPatient] = useState(false);
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    loadStats();
  }, []);

  // Refresh stats when navigating back to dashboard
  useEffect(() => {
    if (location.pathname === '/dashboard' || location.pathname === '/') {
      loadStats();
    }
  }, [location.pathname]);

  // Refresh stats when component becomes visible 
  useEffect(() => {
    const handleFocus = () => {
      loadStats();
    };

    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, []);

  const loadStats = async () => {
    try {
      const [patientsRes, predictionsRes] = await Promise.all([
        patientsApi.getAll({ limit: 1000 }),
        predictionsApi.getAll({ limit: 1000 }),
      ]);

      const predictions = predictionsRes.data;
      const malignantCount = predictions.filter(p => p.prediction === "Malignant").length;
      const benignCount = predictions.filter(p => p.prediction === "Benign").length;

      setStats({
        totalPatients: patientsRes.data.length,
        totalPredictions: predictions.length,
        malignantPredictions: malignantCount,
        benignPredictions: benignCount,
      });
    } catch (error) {
      toast.error("Failed to load dashboard stats");
    } finally {
      setLoading(false);
    }
  };

  // Add patient handled in AddPatient component

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-rose-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Be patience not patient...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
              <p className="text-sm text-gray-600"> {user?.full_name}</p>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div
            onClick={() => navigate("/patients")}
            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); navigate('/patients'); } }}
            role="button"
            tabIndex={0}
            className="bg-white p-6 rounded-lg shadow-sm border hover:shadow-lg hover:scale-105 transform transition-shadow transition-transform duration-150 ease-in-out cursor-pointer focus:outline-none focus:ring-2 focus:ring-rose-500"
          >
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Patients</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalPatients}</p>
              </div>
            </div>
          </div>

          <div
            onClick={() => navigate("/predictions")}
            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); navigate('/predictions'); } }}
            role="button"
            tabIndex={0}
            className="bg-white p-6 rounded-lg shadow-sm border hover:shadow-lg hover:scale-105 transform transition-shadow transition-transform duration-150 ease-in-out cursor-pointer focus:outline-none focus:ring-2 focus:ring-rose-500"
          >
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <Activity className="w-6 h-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Predictions</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalPredictions}</p>
              </div>
            </div>
          </div>

          <div
            onClick={() => navigate('/malignant')}
            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); navigate('/malignant'); } }}
            role="button"
            tabIndex={0}
            className="bg-white p-6 rounded-lg shadow-sm hover:shadow-lg hover:scale-105 transform transition-shadow transition-transform duration-150 ease-in-out cursor-pointer focus:outline-none focus:ring-2 focus:ring-red-400"
          >
            <div className="flex items-center">
              <div className="p-2 bg-red-100 rounded-lg">
                <TrendingUp className="w-6 h-6 text-red-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Malignant Cases</p>
                <p className="text-2xl font-bold text-gray-900">{stats.malignantPredictions}</p>
              </div>
            </div>
          </div>

          <div
            onClick={() => navigate('/benign')}
            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); navigate('/benign'); } }}
            role="button"
            tabIndex={0}
            className="bg-white p-6 rounded-lg shadow-sm hover:shadow-lg hover:scale-105 transform transition-shadow transition-transform duration-150 ease-in-out cursor-pointer focus:outline-none focus:ring-2 focus:ring-green-400"
          >
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <TrendingUp className="w-6 h-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Benign Cases</p>
                <p className="text-2xl font-bold text-gray-900">{stats.benignPredictions}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Add Patient */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-900">Quick Actions</h2>
            <button
              onClick={() => setShowAddPatient(!showAddPatient)}
              className="flex items-center gap-2 px-4 py-2 bg-rose-600 text-white text-sm font-medium rounded-lg hover:bg-rose-700"
            >
              {showAddPatient ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
              {showAddPatient ? "Cancel" : "Add Patient"}
            </button>
          </div>

          {showAddPatient && (
            <AddPatient onClose={() => setShowAddPatient(false)} onAdded={loadStats} />
          )}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div
            onClick={() => navigate("/patients")}
            className="bg-white p-6 rounded-lg shadow-sm border hover:shadow-md cursor-pointer transition-shadow"
          >
            <div className="flex items-center mb-4">
              <Users className="w-8 h-8 text-blue-600" />
              <h3 className="ml-3 text-lg font-semibold text-gray-900">Patient Management</h3>
            </div>
            <p className="text-gray-600">Manage patient records, add new patients, and view patient details.</p>
          </div>

          <div
            onClick={() => navigate("/predictions")}
            className="bg-white p-6 rounded-lg shadow-sm border hover:shadow-md cursor-pointer transition-shadow"
          >
            <div className="flex items-center mb-4">
              <Activity className="w-8 h-8 text-green-600" />
              <h3 className="ml-3 text-lg font-semibold text-gray-900">Prediction Analysis</h3>
            </div>
            <p className="text-gray-600">View and analyze breast cancer predictions, manage diagnosis results.</p>
          </div>
        </div>
      </main>
    </div>
  );
}