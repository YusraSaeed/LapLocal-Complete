import { useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthWrapper from "../../components/AuthWrapper.jsx";
import InputField from "../../components/InputField.jsx";
import PasswordField from "../../components/PasswordField.jsx";
import Button from "../../components/Button.jsx";
import { useAppContext } from "../../context/AppContext.jsx";

const SellerRegister = () => {
    const [fullName, setFullName] = useState("");
    const [shopName, setShopName] = useState("");
    const [shopNumber, setShopNumber] = useState("");
    const [shopAddress, setShopAddress] = useState("");
    const [phone, setPhone] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const navigate = useNavigate();
    // const { setUserRole } = useAppContext();
        const { setUserRole, setUserData, setAccessToken, setRefreshToken } = useAppContext();

    const handleRegister = async (e) => {
        e.preventDefault();
        if (!fullName || !shopName || !shopNumber || !phone || !email || !password || !shopAddress) {
        setError("All fields are required");
        return;
        }

        setIsLoading(true);
        setError("");

        try {
        const res = await fetch("http://localhost:5000/api/v1/sellers/register", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ fullName, shopName, shopNumber, shopAddress, phone, email, password }),
            credentials: "include",
        });

        const data = await res.json();
        if (!res.ok) throw new Error("Registration failed");

        // setUserRole("seller");

        setUserRole("seller"); // or "buyer" if applicable
        setUserData(data.data.user); // full user object
        setAccessToken(data.data.accessToken);
        setRefreshToken(data.data.refreshToken);
        alert("Registration successful!");
        navigate("/seller/dashboard");
        } catch (err) {
        setError("Registration Failed");
        } finally {
        setIsLoading(false);
        }
    };

    const leftContent = (
        <>
        <h2 className="text-center text-4xl italic font-bold mb-4">Welcome to LapLocal</h2>
        <p className="text-center text-black mb-6">
            Join our platform and showcase your shop to a wider local audience!
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
            type="text"
            placeholder="Shop name"
            value={shopName}
            onChange={(e) => setShopName(e.target.value)}
            />
            <InputField
            type="text"
            placeholder="Shop no."
            value={shopNumber}
            onChange={(e) => setShopNumber(e.target.value)}
            />
            <InputField
            type="text"
            placeholder="Shop Address"
            value={shopAddress}
            onChange={(e) => setShopAddress(e.target.value)}
            />
            <InputField
            type="text"
            placeholder="Phone no."
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
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

        <p className="mt-6 text-center text-sm text-gray-600">
            Already have an account?{" "}
            <span
            onClick={() => navigate("/seller/login")}
            className="font-medium text-black hover:underline cursor-pointer"
            >
            Sign In
            </span>
        </p>
        </>
    );

    return <AuthWrapper leftContent={leftContent} rightContent={rightContent} />;
};

export default SellerRegister;

// when I run the app on local host the call to /inventory fetches the result properly but when I hit the same route with the other address that I got using --host the call to inventory fails with a message that token was missing why is that