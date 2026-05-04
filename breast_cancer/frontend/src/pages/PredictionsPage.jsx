import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { predictionsApi, patientsApi } from "../api/client";
import { Plus, Search, Edit, Trash2, ArrowLeft, AlertTriangle, CheckCircle } from "lucide-react";
import toast from "react-hot-toast";

export default function PredictionsPage() {
  const [predictions, setPredictions] = useState([]);
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingPrediction, setEditingPrediction] = useState(null);
  
  const [formData, setFormData] = useState({
    patient_id: "",
    prediction: "Benign",
    confidence: 0.5,
    malignant_prob: 0.5,
    benign_prob: 0.5,
    model_version: "v1.0",
    threshold_used: 0.5,
    actual_diagnosis: null,
    diagnosis_confirmed: false,
    notes: "",
    // Feature fields
    mean_radius: null, mean_texture: null, mean_perimeter: null, mean_area: null,
    mean_smoothness: null, mean_compactness: null, mean_concavity: null,
    mean_concave_points: null, mean_symmetry: null, mean_fractal_dimension: null,
    radius_error: null, texture_error: null, perimeter_error: null, area_error: null,
    smoothness_error: null, compactness_error: null, concavity_error: null,
    concave_points_error: null, symmetry_error: null, fractal_dimension_error: null,
    worst_radius: null, worst_texture: null, worst_perimeter: null, worst_area: null,
    worst_smoothness: null, worst_compactness: null, worst_concavity: null,
    worst_concave_points: null, worst_symmetry: null, worst_fractal_dimension: null,
  });

  const navigate = useNavigate();

  useEffect(() => { loadData(); }, []);

  const loadData = async () => {
    try {
      const [predictionsRes, patientsRes] = await Promise.all([
        predictionsApi.getAll(),
        patientsApi.getAll(),
      ]);
      setPredictions(Array.isArray(predictionsRes.data) ? predictionsRes.data : []);
      setPatients(Array.isArray(patientsRes.data) ? patientsRes.data : []);
    } catch (error) {
      toast.error("Failed to load data");
      setPredictions([]);
      setPatients([]);
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
    const predictionText = (prediction.prediction || "").toLowerCase();
    return patientName.includes(searchTerm.toLowerCase()) ||
           predictionText.includes(searchTerm.toLowerCase());
  });

  const resetForm = () => {
    setFormData({
      patient_id: "", prediction: "Benign", confidence: 0.5, malignant_prob: 0.5,
      benign_prob: 0.5, model_version: "v1.0", threshold_used: 0.5,
      actual_diagnosis: null, diagnosis_confirmed: false, notes: "",
      mean_radius: null, mean_texture: null, mean_perimeter: null, mean_area: null,
      mean_smoothness: null, mean_compactness: null, mean_concavity: null,
      mean_concave_points: null, mean_symmetry: null, mean_fractal_dimension: null,
      radius_error: null, texture_error: null, perimeter_error: null, area_error: null,
      smoothness_error: null, compactness_error: null, concavity_error: null,
      concave_points_error: null, symmetry_error: null, fractal_dimension_error: null,
      worst_radius: null, worst_texture: null, worst_perimeter: null, worst_area: null,
      worst_smoothness: null, worst_compactness: null, worst_concavity: null,
      worst_concave_points: null, worst_symmetry: null, worst_fractal_dimension: null,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const updatedFormData = {
        ...formData,
        malignant_prob: formData.prediction === "Malignant" ? formData.confidence : (1 - formData.confidence),
        benign_prob: formData.prediction === "Benign" ? formData.confidence : (1 - formData.confidence),
        actual_diagnosis: formData.actual_diagnosis || null,
      };

      if (editingPrediction) {
        await predictionsApi.update(editingPrediction.id, updatedFormData);
        toast.success("Prediction updated successfully");
      } else {
        await predictionsApi.create(updatedFormData);
        toast.success("Prediction created successfully");
      }
      loadData();
      setShowForm(false);
      setEditingPrediction(null);
      resetForm();
    } catch (error) {
      toast.error(error.response?.data?.detail || "Failed to save prediction");
    }
  };

  const handleEdit = (prediction) => {
    setEditingPrediction(prediction);
    setFormData({ ...prediction, actual_diagnosis: prediction.actual_diagnosis ?? null });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete?")) return;
    try {
      await predictionsApi.delete(id);
      toast.success("Deleted successfully");
      loadData();
    } catch (error) { toast.error("Failed to delete"); }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-gradient-to-r from-blue-50 to-indigo-50 shadow-sm border-b border-blue-100">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <button onClick={() => navigate("/")} className="flex items-center gap-2 px-3 py-2 text-sm border rounded-lg hover:bg-blue-50 text-blue-700 border-blue-200">
              <ArrowLeft className="w-4 h-4" /> Back
            </button>
            <h1 className="text-2xl font-bold text-blue-900">Prediction Analysis</h1>
          </div>
          <button onClick={() => { resetForm(); setEditingPrediction(null); setShowForm(true); }} className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            <Plus className="w-4 h-4" /> Add Prediction
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-6 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input type="text" placeholder="Search..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full pl-10 pr-4 py-2 border rounded-lg" />
        </div>

        <div className="bg-white shadow-sm rounded-lg border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Patient</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Prediction</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Confidence</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Diagnosis</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredPredictions.map((prediction, index) => (
                  <tr key={prediction.id || index} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">{getPatientName(prediction.patient_id)}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${prediction.prediction === "Malignant" ? "bg-red-100 text-red-800" : prediction.prediction === "Benign" ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}`}>
                        {prediction.prediction === "Malignant" ? <AlertTriangle className="w-3 h-3 mr-1" /> : prediction.prediction === "Benign" ? <CheckCircle className="w-3 h-3 mr-1" /> : null}
                        {prediction.prediction || "Unknown"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm">{prediction.confidence ? (prediction.confidence * 100).toFixed(1) : '0'}%</td>
                    <td className="px-6 py-4 text-sm">{prediction.actual_diagnosis || "-"} {prediction.diagnosis_confirmed && <CheckCircle className="w-3 h-3 text-green-500 inline ml-1" />}</td>
                    <td className="px-6 py-4 text-sm">{prediction.predicted_at ? new Date(prediction.predicted_at).toLocaleDateString() : "-"}</td>
                    <td className="px-6 py-4 text-right">
                      <button onClick={() => handleEdit(prediction)} className="text-indigo-600 hover:text-indigo-900 mr-4"><Edit className="w-4 h-4" /></button>
                      <button onClick={() => handleDelete(prediction.id)} className="text-red-600 hover:text-red-900"><Trash2 className="w-4 h-4" /></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto p-6">
            <h2 className="text-xl font-bold mb-4">{editingPrediction ? "Edit" : "Add"} Prediction</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Patient *</label>
                  <select required value={formData.patient_id} onChange={(e) => setFormData({...formData, patient_id: e.target.value})} className="w-full p-2 border rounded-lg">
                    <option value="">Select Patient</option>
                    {patients.map(p => <option key={p.id} value={p.id}>{p.full_name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Result *</label>
                  <select required value={formData.prediction} onChange={(e) => setFormData({...formData, prediction: e.target.value})} className="w-full p-2 border rounded-lg">
                    <option value="Benign">Benign</option>
                    <option value="Malignant">Malignant</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Confidence (0-1) *</label>
                  <input type="number" step="0.01" min="0" max="1" required value={formData.confidence} onChange={(e) => setFormData({...formData, confidence: parseFloat(e.target.value)})} className="w-full p-2 border rounded-lg" />
                </div>
              </div>

              <div className="border-t pt-4">
                <h3 className="text-lg font-medium mb-4">Feature Values (Optional)</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {[
                    'mean_radius', 'mean_texture', 'mean_perimeter', 'mean_area', 'mean_smoothness', 'mean_compactness', 'mean_concavity', 'mean_concave_points', 'mean_symmetry', 'mean_fractal_dimension',
                    'radius_error', 'texture_error', 'perimeter_error', 'area_error', 'smoothness_error', 'compactness_error', 'concavity_error', 'concave_points_error', 'symmetry_error', 'fractal_dimension_error',
                    'worst_radius', 'worst_texture', 'worst_perimeter', 'worst_area', 'worst_smoothness', 'worst_compactness', 'worst_concavity', 'worst_concave_points', 'worst_symmetry', 'worst_fractal_dimension'
                  ].map(field => (
                    <div key={field}>
                      <label className="block text-xs font-medium text-gray-600 mb-1 capitalize">{field.replace(/_/g, ' ')}</label>
                      <input type="number" step="0.01" value={formData[field] || ""} onChange={(e) => setFormData({ ...formData, [field]: e.target.value ? parseFloat(e.target.value) : null })} className="w-full p-1 text-sm border rounded" />
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-end gap-4">
                <button type="button" onClick={() => setShowForm(false)} className="px-4 py-2 border rounded-lg">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-rose-600 text-white rounded-lg hover:bg-rose-700">Save</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}