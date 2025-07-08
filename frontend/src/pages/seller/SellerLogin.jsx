import { useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthWrapper from "../../components/AuthWrapper.jsx";
import InputField from "../../components/InputField.jsx";
import PasswordField from "../../components/PasswordField.jsx";
import Button from "../../components/Button.jsx";
import { useAppContext } from "../../context/AppContext.jsx";

const SellerLogin = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const navigate = useNavigate();
    // const { setUserRole } = useAppContext();
        const { setUserRole, setUserData, setAccessToken, setRefreshToken } = useAppContext();


    // const handleLogin = async (e) => {
    //     e.preventDefault();
    //     setError("");

    //     if (!email || !password) {
    //     setError("All fields are required");
    //     return;
    //     }

    //     setIsLoading(true);

    //     try {
    //     const res = await fetch("http://localhost:5000/api/v1/sellers/login", {
    //         method: "POST",
    //         headers: { "Content-Type": "application/json" },
    //         body: JSON.stringify({ email, password }),
    //         credentials: "include",
    //     });

    //     const data = await res.json();
    //     if (!res.ok) throw new Error(data.message || "Login failed");


    //     setUserRole("seller"); // or "buyer" if applicable
    //     setUserData(data.data.user); // full user object
    //     setAccessToken(data.data.accessToken);
    //     setRefreshToken(data.refreshToken);
    //     // setUserRole("seller");
    //     navigate("/seller/dashboard");
    //     } catch (err) {
    //     setError(err.message);
    //     } finally {
    //     setIsLoading(false);
    //     }
    // };

    const handleLogin = async (e) => {
  e.preventDefault();
  setError("");

  if (!email || !password) {
    setError("All fields are required");
    return;
  }

  setIsLoading(true);

  try {
    const res = await fetch("http://localhost:5000/api/v1/sellers/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
      credentials: "include",
    });

    const contentType = res.headers.get("content-type");
    const isJSON = contentType && contentType.includes("application/json");

    const data = isJSON ? await res.json() : null;

    if (!res.ok) {
      const message =
        data?.message ||
        (isJSON ? "Login failed" : "Invalid Credentials");
      throw new Error(message);
    }

    setUserRole("seller");
    setUserData(data.data.user);
    setAccessToken(data.data.accessToken);
    setRefreshToken(data.data.refreshToken);
    navigate("/seller/dashboard");

  } catch (err) {
    if (err.message.includes("found")) {
      setError("Invalid email or password.");
    } else if (err.message.includes("required")) {
      setError("Required fields are missing.");
    } else {
      setError(err.message || "Something went wrong.");
    }
  } finally {
    setIsLoading(false);
  }
};
    const leftContent = (
        <>
        <h2 className="text-3xl font-bold text-black mb-2">Welcome Back!</h2>
        <p className="text-center text-black mb-6">
            To keep connected with us please <br /> login your personal info.
        </p>
        <button
            onClick={() => navigate("/register")}
            className="border border-black px-8 py-2 rounded-full hover:bg-black hover:text-white transition"
        >
            Sign Up
        </button>
        </>
    );

    const rightContent = (
        <>
        <h2 className="text-3xl font-bold text-center mb-6">Sign in</h2>
        <form onSubmit={handleLogin} className="space-y-4">
            {error && <p className="text-red-500 text-sm">{error}</p>}

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

            <div className="text-right">
            <span
                className="text-sm text-orange-500 hover:underline cursor-pointer"
                onClick={() => navigate("/forgot-password")}
            >
                Forget Password?
            </span>
            </div>

            <Button type="submit" isLoading={isLoading}>Sign In</Button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-600">
            Don’t have any account?{" "}
            <span
            onClick={() => navigate("/seller/register")}
            className="text-black font-medium hover:underline cursor-pointer"
            >
            Create account
            </span>
        </p>
        </>
    );

    return <AuthWrapper leftContent={leftContent} rightContent={rightContent} />;
};

export default SellerLogin;


