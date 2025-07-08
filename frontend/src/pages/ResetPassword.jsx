// import { useState } from "react";
// import { useNavigate, useParams, useSearchParams } from "react-router-dom";
// import InputField from "../components/InputField.jsx";
// import PasswordField from "../components/PasswordField.jsx";
// import Button from "../components/Button.jsx";

// const ResetPassword = () => {
//     const { token } = useParams();
//     const [searchParams] = useSearchParams();
//     const navigate = useNavigate();

//     const role = searchParams.get("role") || "buyer";
//     const [newPassword, setNewPassword] = useState("");
//     const [confirmPassword, setConfirmPassword] = useState("");
//     const [message, setMessage] = useState("");
//     const [error, setError] = useState("");
//     const [isLoading, setIsLoading] = useState(false);

//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         setMessage("");
//         setError("");

//         if (newPassword !== confirmPassword) {
//         setError("Passwords do not match");
//         return;
//         }

//         setIsLoading(true);

//         try {
//         const res = await fetch(`http://localhost:5000/api/v1/auth/reset-password/${token}`, {
//             method: "POST",
//             headers: {
//             "Content-Type": "application/json",
//             },
//             body: JSON.stringify({ newPassword, role }),
//         });

//         const data = await res.json();
//         if (!res.ok) throw new Error(data.message || "Reset failed");

//         setMessage("Password reset successfully!");
//         setTimeout(() => navigate("/login"), 2000);
//         } catch (err) {
//         setError(err.message);
//         } finally {
//         setIsLoading(false);
//         }
//     };

//     return (
//         <div className="min-h-screen bg-[#FDF7F2] px-4 py-30 flex justify-center items-start">
//         <div className="w-full max-w-md bg-white p-6 sm:p-8 rounded-2xl shadow-lg">
//             <h2 className="text-2xl sm:text-3xl font-bold text-center mb-6">Reset Password</h2>
//             <form onSubmit={handleSubmit} className="space-y-4">
//             {message && <p className="text-green-600 text-sm text-center">{message}</p>}
//             {error && <p className="text-red-500 text-sm text-center">{error}</p>}

//             <PasswordField
//                 placeholder="New Password"
//                 value={newPassword}
//                 onChange={(e) => setNewPassword(e.target.value)}
//             />

//             <PasswordField
//                 placeholder="Confirm Password"
//                 value={confirmPassword}
//                 onChange={(e) => setConfirmPassword(e.target.value)}
//             />

//             <Button type="submit" isLoading={isLoading}>Reset Password</Button>
//             </form>
//         </div>
//         </div>
//     );
// };

// export default ResetPassword;

import { useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import InputField from "../components/InputField.jsx";
import PasswordField from "../components/PasswordField.jsx";
import Button from "../components/Button.jsx";

const ResetPassword = () => {
  const { token } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const role = searchParams.get("role") || "buyer";

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    if (!newPassword || !confirmPassword) {
      setError("All fields are required");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch(`http://localhost:5000/api/v1/auth/reset-password/${token}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ newPassword, role }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Reset failed");

      setMessage("Password reset successfully!");
      setTimeout(() => navigate("/choose-role?mode=signin"), 2000);
    } catch (err) {
      setError(err.message || "Request failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FDF7F2] px-4 py-8 flex justify-center items-start">
      <div className="w-full max-w-md bg-white p-6 sm:p-8 rounded-2xl shadow-lg">
        <h2 className="text-2xl sm:text-3xl font-bold text-center mb-6">Reset Password</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {message && <p className="text-green-600 text-sm text-center">{message}</p>}
          {error && <p className="text-red-500 text-sm text-center">{error}</p>}

          <PasswordField
            placeholder="New Password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />

          <PasswordField
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />

          <Button type="submit" isLoading={isLoading}>Reset Password</Button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-600">
          Already reset?{" "}
          <span
            onClick={() => navigate("/login")}
            className="text-black font-medium hover:underline cursor-pointer"
          >
            Sign In
          </span>
        </p>
      </div>
    </div>
  );
};

export default ResetPassword;
