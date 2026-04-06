import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { authApi } from "../api/client";
import { useAuthStore } from "../store/authStore";
import toast from "react-hot-toast";

export default function LoginPage() {
  const [email, setEmail] = useState("admin@cancer.ai");
  const [password, setPassword] = useState("admin123");
  const [loading, setLoading] = useState(false);
  const { setAuth } = useAuthStore();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await authApi.login(email, password);
      setAuth(data.access_token, {
        id: data.user_id, role: data.role, full_name: data.full_name,
      });
      toast.success(`Welcome, ${data.full_name}!`);
      navigate("/");
    } catch {
      toast.error("Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    /* The "bg-rose-50/30" makes the whole page a very lite, soft tint */
    <div className="min-h-screen bg-[#fdf2f2] flex items-center justify-center p-6">
      
      <div className="w-full max-w-md">
        {/* Simple Branding */}
        <div className="text-center mb-10">
          <span className="text-4xl"></span>
          <h1 className="text-2xl font-bold text-slate-900 mt-2">Breast Cancer Classification</h1>
          {/* <p className="text-slate-500 text-sm">Diagnostic Analysis System</p> */}
        </div>

        {/* Form Card */}
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-rose-100">
          <h2 className="text-lg font-bold text-slate-800 mb-6">Login</h2>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase mb-1 ml-1">Email</label>
              <input 
                type="email" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                required
                className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:border-rose-400 focus:ring-1 focus:ring-rose-400 outline-none transition-all"
                placeholder="Enter email"
              />
            </div>

            <div className="mb-6">
              <label className="block text-xs font-bold text-slate-400 uppercase mb-1 ml-1">Password</label>
              <input 
                type="password" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                required
                className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:border-rose-400 focus:ring-1 focus:ring-rose-400 outline-none transition-all"
                placeholder="Enter password"
              />
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-rose-600 hover:bg-rose-700 text-white font-bold py-3 rounded-xl transition-colors disabled:opacity-50"
            >
              {loading ? "Please wait..." : "Sign In"}
            </button>
          </form>

          {/* Minimal Demo Footer */}
          <div className="mt-8 pt-6 border-t border-slate-50 text-center">
            <p className="text-[10px] text-slate-400 font-medium">
              ADMIN:   OR  DOCTOR: 
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}