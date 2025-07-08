// ✅ src/pages/Unauthorized.jsx

import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

const Unauthorized = () => {
  const navigate = useNavigate();

  // Optional: after few seconds redirect to login or home
  useEffect(() => {
    const timer = setTimeout(() => {
      navigate("/seller/login");
    }, 3000);
    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white p-6">
      <h1 className="text-4xl font-bold text-red-600 mb-4">Unauthorized Access</h1>
      <p className="text-lg text-gray-700 mb-6">
        You are not authorized to view this page. Please login again.
      </p>
      <button
        onClick={() => navigate("/seller/login")}
        className="px-6 py-3 bg-red-500 text-white rounded hover:bg-red-600"
      >
        Go to Login
      </button>
    </div>
  );
};

export default Unauthorized;
