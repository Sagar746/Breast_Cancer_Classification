import { useState } from "react";
import { patientsApi } from "../api/client";
import toast from "react-hot-toast";

export default function AddPatient({ onClose, onAdded }) {
  const [patientForm, setPatientForm] = useState({
    patient_code: "",
    full_name: "",
    date_of_birth: "",
    gender: "",
    phone: "",
    email: "",
    address: "",
    notes: "",
  });

  const handleAddPatient = async (e) => {
    e.preventDefault();
    try {
      await patientsApi.create(patientForm);
      toast.success("Patient added successfully!");
      onClose?.();
      setPatientForm({
        patient_code: "",
        full_name: "",
        date_of_birth: "",
        gender: "",
        phone: "",
        email: "",
        address: "",
        notes: "",
      });
      onAdded?.();
    } catch (error) {
      toast.error(error.response?.data?.detail || "Failed to add patient");
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border">
      <h3 className="text-lg font-medium text-gray-900 mb-4">Add New Patient</h3>
      <form onSubmit={handleAddPatient} className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Patient Code *</label>
          <input
            type="text"
            required
            value={patientForm.patient_code}
            onChange={(e) => setPatientForm({...patientForm, patient_code: e.target.value})}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
            placeholder="e.g., P001"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
          <input
            type="text"
            required
            value={patientForm.full_name}
            onChange={(e) => setPatientForm({...patientForm, full_name: e.target.value})}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
            placeholder="Patient full name"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Date of Birth</label>
          <input
            type="date"
            value={patientForm.date_of_birth}
            onChange={(e) => setPatientForm({...patientForm, date_of_birth: e.target.value})}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
          <select
            value={patientForm.gender}
            onChange={(e) => setPatientForm({...patientForm, gender: e.target.value})}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
          >
            <option value="">Select Gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
          <input
            type="tel"
            value={patientForm.phone}
            onChange={(e) => setPatientForm({...patientForm, phone: e.target.value})}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
            placeholder="Phone number"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
          <input
            type="email"
            value={patientForm.email}
            onChange={(e) => setPatientForm({...patientForm, email: e.target.value})}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
            placeholder="Email address"
          />
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
          <textarea
            value={patientForm.address}
            onChange={(e) => setPatientForm({...patientForm, address: e.target.value})}
            rows={2}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
            placeholder="Patient address"
          />
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
          <textarea
            value={patientForm.notes}
            onChange={(e) => setPatientForm({...patientForm, notes: e.target.value})}
            rows={2}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
            placeholder="Additional notes"
          />
        </div>
        <div className="md:col-span-2 flex justify-end gap-4">
          <button
            type="button"
            onClick={() => onClose?.()}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-rose-600 text-white text-sm font-medium rounded-lg hover:bg-rose-700"
          >
            Add Patient
          </button>
        </div>
      </form>
    </div>
  );
}
