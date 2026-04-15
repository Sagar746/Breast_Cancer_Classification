import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { patientsApi } from "../api/client";
import { Plus, Search, Edit, Trash2, ArrowLeft } from "lucide-react";
import toast from "react-hot-toast";

export default function PatientsPage() {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingPatient, setEditingPatient] = useState(null);
  const [formData, setFormData] = useState({
    patient_code: "",
    full_name: "",
    date_of_birth: "",
    gender: "",
    phone: "",
    email: "",
    address: "",
    notes: "",
  });
  const navigate = useNavigate();

 
  useEffect(() => {
    loadPatients();
  }, []);

  const loadPatients = async () => {
    try {
      const response = await patientsApi.getAll();
      setPatients(response.data);
    } catch (error) {
      toast.error("Failed to load patients");
    } finally {
      setLoading(false);
    }
  };

  const filteredPatients = patients.filter(patient =>
    patient.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.patient_code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this patient?")) return;
    try {
      await patientsApi.delete(id);
      toast.success("Patient deleted successfully");
      loadPatients();
    } catch (error) {
      toast.error("Failed to delete patient");
    }
  };

  const resetForm = () => {
    setFormData({ patient_code: "", full_name: "", date_of_birth: "", gender: "", phone: "", email: "", address: "", notes: "" });
  };

  const openForm = () => {
    setEditingPatient(null);
    resetForm();
    setShowForm(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-rose-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading patients...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center gap-4">
              <button onClick={() => navigate("/")} className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50">
                <ArrowLeft className="w-4 h-4" /> Back to Dashboard
              </button>
              <h1 className="text-2xl font-bold text-gray-900">Patient Management</h1>
            </div>
            <button onClick={openForm} className="flex items-center gap-2 px-4 py-2 bg-rose-600 text-white text-sm font-medium rounded-lg hover:bg-rose-700">
              <Plus className="w-4 h-4" /> Add Patient
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Day 2: Search UI */}
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search patients by name or code..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
            />
          </div>
        </div>
        
        <div className="text-center py-12 bg-white rounded-lg border">
          <p className="text-gray-500">API Connected. Data fetching active. Table UI coming in Day 3.</p>
        </div>
      </main>
    </div>
  );
}