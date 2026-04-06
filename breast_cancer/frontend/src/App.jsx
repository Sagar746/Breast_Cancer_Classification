import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import LoginPage from "./pages/LoginPage";

function App() {
  return (
    <BrowserRouter>
      {/* This allows the "Welcome" popups to work */}
      <Toaster position="top-center" reverseOrder={false} />
      
      <Routes>
        {/* The main route shows the Login Page */}
        <Route path="/login" element={<LoginPage />} />
        
        {/* If someone goes to the home page, send them to login for now */}
        <Route path="/" element={<Navigate to="/login" />} />
        
        {/* We will add the Dashboard route here in the next step! */}
      </Routes>
    </BrowserRouter>
  );
}

export default App;