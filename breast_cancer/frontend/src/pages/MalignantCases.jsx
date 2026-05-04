import React, { useEffect, useState } from "react";
import { predictionsApi, patientsApi } from "../api/client";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

export default function MalignantCases() {
  const [cases, setCases] = useState([]);
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const load = async () => {
      try {
        const [predictionsRes, patientsRes] = await Promise.all([
          predictionsApi.getAll({ limit: 1000 }),
          patientsApi.getAll({ limit: 1000 }),
        ]);
        const malignant = predictionsRes.data.filter(p => p.prediction === "Malignant");
        setCases(malignant);
        setPatients(patientsRes.data || []);
      } catch (e) {
        // noop
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const getPatientName = (patientId) => {
    const patient = patients.find(p => p.id === patientId);
    return patient ? patient.full_name : "Unknown Patient";
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-gradient-to-r from-blue-50 to-indigo-50 shadow-sm border-b border-blue-100">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center gap-4">
          <button onClick={() => navigate("/dashboard")} className="flex items-center gap-2 px-3 py-2 text-sm border rounded-lg hover:bg-blue-50 text-blue-700 border-blue-200">
            <ArrowLeft className="w-4 h-4" /> Back
          </button>
          <h1 className="text-2xl font-bold text-blue-900">Malignant Cases</h1>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {loading ? (
          <p>Loading…</p>
        ) : (
          <div className="bg-white rounded-lg shadow-sm p-6">
            {cases.length === 0 ? (
              <p className="text-gray-600">No malignant cases found.</p>
            ) : (
              <div className="space-y-3">
                {cases.map((c) => (
                  <div key={c.id} className="p-4 border rounded-lg hover:bg-gray-50">
                    <div className="font-semibold text-gray-900">{getPatientName(c.patient_id)}</div>
                    <div className="text-sm text-gray-600 mt-1">Confidence: {(c.confidence * 100).toFixed(1)}%</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
