import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { patientsApi } from "../api/client";
import { Plus, Search, Edit, Trash2, ArrowLeft } from "lucide-react";
import toast from "react-hot-toast";

export default function PatientsPage() {
  // State Management
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(false); // Set to false so we can see the page today
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

  // Logic Stubs just to prevent errors today)
  const resetForm = () => {
    setFormData({ patient_code: "", full_name: "", date_of_birth: "", gender: "", phone: "", email: "", address: "", notes: "" });
  };

  const openForm = () => {
    setEditingPatient(null);
    resetForm();
    setShowForm(true);
  };

  // UI Render
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center gap-4">
              <button onClick={() => navigate("/")} className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 border rounded-lg">
                <ArrowLeft className="w-4 h-4" /> Back
              </button>
              <h1 className="text-2xl font-bold text-gray-900">Patient Management</h1>
            </div>
            <button onClick={openForm} className="flex items-center gap-2 px-4 py-2 bg-rose-600 text-white rounded-lg">
              <Plus className="w-4 h-4" /> Add Patient
            </button>
          </div>
        </div>
      </header>
      
      <main className="max-w-7xl mx-auto px-4 py-8 text-center">
        <p className="text-gray-500">Initial setup complete. API integration coming next.</p>
      </main>
    </div>
  );
}