import { useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthWrapper from "../../components/AuthWrapper.jsx";
import InputField from "../../components/InputField.jsx";
import PasswordField from "../../components/PasswordField.jsx";
import Button from "../../components/Button.jsx";
import SocialIcons from "../../components/SocialIcons.jsx";
import { useAppContext } from "../../context/AppContext.jsx";

const BuyerLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();
  const { setUserRole, setUserData,setAccessToken, setRefreshToken } = useAppContext();


  const handleLogin = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      setError("All fields are required");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const response = await fetch("http://localhost:5000/api/v1/buyers/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
        credentials: "include",
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Login failed");

    setUserRole("buyer");
    setUserData(data.data.user);
    setAccessToken(data.data.accessToken);
    setRefreshToken(data.data.refreshToken);
    navigate("/buyer/dashboard");

    } catch (err) {
      setError(err.message || "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    window.location.href = "http://localhost:5000/api/v1/auth/google";
  };

  const leftContent = (
    <>
      <h2 className="text-2xl font-bold mb-3">Welcome Back!</h2>
      <p className="text-center">
        To keep connected with us please login your personal info.
      </p>
    </>
  );

  const rightContent = (
    <>
      <h2 className="text-2xl sm:text-3xl font-bold text-center mb-6">Sign in</h2>
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

        <div className="text-right">
          <span
            className="text-orange-500 text-sm hover:underline cursor-pointer"
            onClick={() => navigate("/forgot-password")}
          >
            Forgot Username?
          </span>
        </div>

        <Button type="submit" isLoading={isLoading}>Sign In</Button>
      </form>

      <div className="mt-6 relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-300"></div>
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-2 bg-white text-gray-500">or Sign in using</span>
        </div>
      </div>

      <SocialIcons onGoogleLogin={handleGoogleLogin} />

      <p className="mt-6 text-center text-sm text-gray-600">
        Don't have any account?{" "}
        <span onClick={() => navigate("/buyer/register")} className="font-medium text-black hover:underline cursor-pointer">
          Create account
        </span>
      </p>
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

export default BuyerLogin;


