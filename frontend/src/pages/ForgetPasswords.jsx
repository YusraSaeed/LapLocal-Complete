// import { useState, useEffect } from "react";
// import { useNavigate, useLocation } from "react-router-dom";
// import AuthWrapper from "../components/AuthWrapper.jsx";
// import InputField from "../components/InputField.jsx";
// import Button from "../components/Button.jsx";
// import { useAppContext } from "../context/AppContext.jsx";

// const ForgotPassword = () => {
//   const [email, setEmail] = useState("");
//   const [role, setRole] = useState("buyer");
//   const [message, setMessage] = useState("");
//   const [error, setError] = useState("");
//   const [isLoading, setIsLoading] = useState(false);

//   const navigate = useNavigate();
//   const location = useLocation();
//   const { userRole } = useAppContext();

//   useEffect(() => {
//     if (userRole) setRole(userRole);
//   }, [userRole]);

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setIsLoading(true);
//     setMessage("");
//     setError("");

//     try {
//       const res = await fetch("http://localhost:5000/api/v1/auth/forgot-password", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ email, role })
//       });

//       const contentType = res.headers.get("Content-Type");
//       const isJSON = contentType && contentType.includes("application/json");
//       const data = isJSON ? await res.json() : {};

//       if (!res.ok && res.status == 404) {
//         throw new Error(data.message || "User not found");
//       }

//       setMessage("Reset link sent to your email!");
//     } catch (err) {
//       setError(err.message || "Unexpected error. Please try again.");
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const leftContent = (
//     <>
//       <h2 className="text-3xl font-bold text-black mb-2">Forgot Password?</h2>
//       <p className="text-center text-black mb-6">
//         Enter your registered email and role <br /> to receive a reset link
//       </p>
//       <button
//         onClick={() => navigate("/login")}
//         className="border border-black px-8 py-2 rounded-full hover:bg-black hover:text-white transition"
//       >
//         Back to Login
//       </button>
//     </>
//   );

//   const rightContent = (
//     <>
//       <h2 className="text-3xl font-bold text-center mb-6">Reset Password</h2>
//       <form onSubmit={handleSubmit} className="space-y-4">
//         {message && <p className="text-green-600 text-sm">{message}</p>}
//         {error && <p className="text-red-500 text-sm">{error}</p>}

//         <InputField
//           type="email"
//           placeholder="Enter your email"
//           value={email}
//           onChange={(e) => setEmail(e.target.value)}
//         />

//         <select
//           value={role}
//           onChange={(e) => setRole(e.target.value)}
//           className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-gray-500"
//         >
//           <option value="buyer">Buyer</option>
//           <option value="seller">Seller</option>
//         </select>

//         <Button type="submit" isLoading={isLoading}>Send Reset Link</Button>
//       </form>
//     </>
//   );

//   return <AuthWrapper leftContent={leftContent} rightContent={rightContent} />;
// };

// export default ForgotPassword;

// import { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import InputField from "../components/InputField.jsx";
// import Button from "../components/Button.jsx";
// import { useAppContext } from "../context/AppContext.jsx";

// const ForgotPassword = () => {
//   const [email, setEmail] = useState("");
//   const [message, setMessage] = useState("");
//   const [error, setError] = useState("");
//   const [isLoading, setIsLoading] = useState(false);

//   const { userRole } = useAppContext(); // either "buyer" or "seller"
//   const navigate = useNavigate();

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setMessage("");
//     setError("");

//     if (!email) {
//       setError("Email is required");
//       return;
//     }

//     if (!userRole) {
//       setError("User role is missing.");
//       return;
//     }

//     setIsLoading(true);

//     try {
//       const res = await fetch("http://localhost:5000/api/v1/auth/forgot-password", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ email, role: userRole }),
//       });

//       const data = await res.json();
//       if (!res.ok) throw new Error(data.message || "Something went wrong");

//       setMessage("Reset link sent! Please check your email.");
//       setEmail("");
//     } catch (err) {
//       setError(err.message || "Request failed");
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-[#FDF7F2] px-4 py-8 flex justify-center items-start">
//       <div className="w-full max-w-md bg-white p-6 sm:p-8 rounded-2xl shadow-lg">
//         <h2 className="text-2xl sm:text-3xl font-bold text-center mb-6">Forgot Password</h2>

//         <form onSubmit={handleSubmit} className="space-y-4">
//           {message && <p className="text-green-600 text-sm text-center">{message}</p>}
//           {error && <p className="text-red-500 text-sm text-center">{error}</p>}

//           <InputField
//             type="email"
//             placeholder="Enter your email"
//             value={email}
//             onChange={(e) => setEmail(e.target.value)}
//           />

        
//           <Button type="submit" isLoading={isLoading}>Send Reset Link</Button>
//         </form>

//         <p className="mt-6 text-center text-sm text-gray-600">
//           Remembered your password?{" "}
//           <span
//             onClick={() => navigate("/login")}
//             className="text-black font-medium hover:underline cursor-pointer"
//           >
//             Sign In
//           </span>
//         </p>
//       </div>
//     </div>
//   );
// };

// export default ForgotPassword;


import { useState } from "react";
import { useNavigate } from "react-router-dom";
import InputField from "../components/InputField.jsx";
import Button from "../components/Button.jsx";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("buyer");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    if (!email || !role) {
      setError("Both email and role are required.");
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch("http://localhost:5000/api/v1/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, role }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Something went wrong");

      setMessage("Reset link sent! Please check your email.");
      setEmail("");
    } catch (err) {
      setError(err.message || "Request failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FDF7F2] px-4 py-8 flex justify-center items-start">
      <div className="w-full max-w-md bg-white p-6 sm:p-8 rounded-2xl shadow-lg">
        <h2 className="text-2xl sm:text-3xl font-bold text-center mb-6">Forgot Password</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {message && <p className="text-green-600 text-sm text-center">{message}</p>}
          {error && <p className="text-red-500 text-sm text-center">{error}</p>}

          <InputField
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-gray-500"
          >
            <option value="buyer">Buyer</option>
            <option value="seller">Seller</option>
          </select>

          <Button type="submit" isLoading={isLoading}>Send Reset Link</Button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-600">
          Remembered your password?{" "}
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

export default ForgotPassword;
