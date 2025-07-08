import { useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthWrapper from "../../components/AuthWrapper.jsx";
import InputField from "../../components/InputField.jsx";
import PasswordField from "../../components/PasswordField.jsx";
import Button from "../../components/Button.jsx";
import SocialIcons from "../../components/SocialIcons.jsx";
import { useAppContext } from "../../context/AppContext.jsx";

const BuyerRegister = () => {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();
  const {
    setUserRole,
    setUserData,
    setAccessToken,
    setRefreshToken
  } = useAppContext();

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!fullName || !email || !password) {
      setError("All fields are required");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const res = await fetch("http://localhost:5000/api/v1/buyers/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fullName, email, password }),
        credentials: "include",
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Registration failed");

      setUserRole("buyer");
      // setUserData(data.data);
      // setAccessToken(data.accessToken);
      // setRefreshToken(data.refreshToken);
      setUserData(data.data.user);               
      setAccessToken(data.data.accessToken);      
      setRefreshToken(data.data.refreshToken);    


      navigate("/buyer/dashboard");
    } catch (err) {
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    window.location.href = "http://localhost:5000/api/v1/auth/google";
  };

  const leftContent = (
    <>
      <h2 className="text-xl font-bold text-black mb-2">Welcome To</h2>
      <h2 className="text-center text-4xl italic font-bold mb-4">LapLocal!</h2>
      <p className="text-center text-black mb-6">
        Enter your personal details <br /> and start journey with us
      </p>
    </>
  );

  const rightContent = (
    <>
      <h2 className="text-3xl font-bold text-center mb-6">Sign Up</h2>
      <form onSubmit={handleRegister} className="space-y-4">
        {error && <p className="text-red-500 text-sm">{error}</p>}

        <InputField
          type="text"
          placeholder="Full name"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
        />
        <InputField
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <PasswordField
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <Button type="submit" isLoading={isLoading}>Sign Up</Button>
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
        Already have an account?{" "}
        <span
          onClick={() => navigate("/buyer/login")}
          className="font-medium text-black hover:underline cursor-pointer"
        >
          Sign In
        </span>
      </p>
    </>
  );

  return <AuthWrapper leftContent={leftContent} rightContent={rightContent} />;
};

export default BuyerRegister;
