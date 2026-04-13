import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { predictionsApi, patientsApi } from "../api/client";
import { Plus, Search, Trash2, ArrowLeft, AlertTriangle, CheckCircle } from "lucide-react";
import toast from "react-hot-toast";

export default function PredictionsPage() {
  const [predictions, setPredictions] = useState([]);
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [predictionsRes, patientsRes] = await Promise.all([
        predictionsApi.getAll(),
        patientsApi.getAll(),
      ]);
      setPredictions(predictionsRes.data);
      setPatients(patientsRes.data);
    } catch (error) {
      toast.error("Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  const getPatientName = (patientId) => {
    const patient = patients.find(p => p.id === patientId);
    return patient ? patient.full_name : "Unknown Patient";
  };

  const filteredPredictions = predictions.filter(prediction => {
    const patientName = getPatientName(prediction.patient_id).toLowerCase();
    return patientName.includes(searchTerm.toLowerCase()) ||
           prediction.prediction.toLowerCase().includes(searchTerm.toLowerCase());
  });

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this prediction?")) return;
    try {
      await predictionsApi.delete(id);
      toast.success("Prediction deleted successfully");
      loadData();
    } catch (error) {
      toast.error("Failed to delete prediction");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-rose-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading predictions...</p>
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
              <h1 className="text-2xl font-bold text-gray-900">Prediction Analysis</h1>
            </div>
            <button className="flex items-center gap-2 px-4 py-2 bg-rose-600 text-white text-sm font-medium rounded-lg opacity-50 cursor-not-allowed">
              <Plus className="w-4 h-4" /> Add Prediction (Coming Soon)
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search predictions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500"
            />
          </div>
        </div>

        <div className="bg-white shadow-sm rounded-lg border overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Patient</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Prediction</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Confidence</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredPredictions.map((prediction) => (
                <tr key={prediction.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{getPatientName(prediction.patient_id)}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${prediction.prediction === "Malignant" ? "bg-red-100 text-red-800" : "bg-green-100 text-green-800"}`}>
                      {prediction.prediction}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{(prediction.confidence * 100).toFixed(1)}%</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(prediction.predicted_at).toLocaleDateString()}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button onClick={() => handleDelete(prediction.id)} className="text-red-600 hover:text-red-900">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}