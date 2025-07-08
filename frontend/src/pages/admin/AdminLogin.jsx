import { useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthWrapper from "../../components/AuthWrapper.jsx";
import InputField from "../../components/InputField.jsx";
import PasswordField from "../../components/PasswordField.jsx";
import Button from "../../components/Button.jsx";
import { useAppContext } from "../../context/AppContext.jsx";

const AdminLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();
  const { setUserRole, setUserData, setAccessToken, setRefreshToken } = useAppContext();

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      setError("All fields are required");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const response = await fetch("http://localhost:5000/api/v1/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
        credentials: "include",
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Login failed");

      setUserRole("admin");
      setUserData(data.data.admin);
      setAccessToken(data.data.accessToken);
      setRefreshToken(data.data.refreshToken);
      navigate("/admin/dashboard");

    } catch (err) {
      setError(err.message || "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  const leftContent = (
    <>
      <h2 className="text-2xl font-bold mb-3">Admin Login</h2>
      <p className="text-center">
        Please enter your credentials to access the admin dashboard.
      </p>
    </>
  );

  const rightContent = (
    <>
      <h2 className="text-2xl sm:text-3xl font-bold text-center mb-6">Admin Sign In</h2>
      <form onSubmit={handleLogin} className="space-y-4">
        {error && <div className="text-red-500 text-sm">{error}</div>}

        <InputField
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <PasswordField
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <Button type="submit" isLoading={isLoading}>Sign In</Button>
      </form>
    </>
  );

  return (
    <AuthWrapper
      leftContent={leftContent}
      rightContent={rightContent}
      reverseOnDesktop 
    />
  );
};

export default AdminLogin;
