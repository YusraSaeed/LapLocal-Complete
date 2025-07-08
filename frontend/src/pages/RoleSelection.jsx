// import { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import AuthWrapper from "../components/AuthWrapper";
// import Button from "../components/Button";
// import buyerIcon from "../assets/buyer-icon.svg";
// import sellerIcon from "../assets/seller-icon.svg";
// import { useAppContext } from "../context/AppContext";

// const ChooseRole = () => {
//     const [selectedRole, setSelectedRole] = useState(null);
//     const { setUserRole } = useAppContext();
//     const navigate = useNavigate();

//     const handleNext = () => {
//         if (!selectedRole) return;
//         setUserRole(selectedRole);
//         navigate(selectedRole === "buyer" ? "/buyer/register" : "/seller/register");
//     };


//     const RoleCard = ({ icon, title, description, role }) => (
//     <div
//         onClick={() => setSelectedRole(role)}
//         className={`flex items-center gap-4 p-4 rounded-xl cursor-pointer border transform transition-all duration-300 hover:scale-[1.02] hover:shadow-md ${
//         selectedRole === role ? "border-black bg-gray-100" : "border-gray-300"
//         }`}
//     >
//         <img src={icon} alt={`${title} icon`} className="w-14 h-14" />
//         <div>
//             <h3 className="text-lg font-semibold">{title}</h3>
//             <p className="text-sm text-gray-600">{description}</p>
//         </div>
//     </div>
//     );


//     const leftContent = (
//         <>
//             <h2 className="text-4xl italic font-bold mb-4">Laplocal</h2>
//             <p className="text-center text-black">
//                 Bridging local laptop shops and digital convenience — discover, compare,
//                 and connect seamlessly.
//             </p>
//         </>
//     );

//     const rightContent = (
//         <div className="w-full max-w-md">
//         <h2 className="text-3xl font-bold text-center mb-8">Choose a role</h2>
//         <div className="space-y-4 mb-6">
//             <RoleCard
//             icon={buyerIcon}
//             title="Join as Individual"
//             description="Browse competitive listings and smart AI-based laptop suggestions tailored for you."
//             role="buyer"
//             />
//             <RoleCard
//             icon={sellerIcon}
//             title="Join as Seller"
//             description="Boost visibility, manage inventory, and trade smarter through wholesale options."
//             role="seller"
//             />
//         </div>
//         <Button onClick={handleNext}>Next</Button>
//         </div>
//     );

//     return <AuthWrapper leftContent={leftContent} rightContent={rightContent} />;
// };

// export default ChooseRole;

import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import AuthWrapper from "../components/AuthWrapper";
import Button from "../components/Button";
import buyerIcon from "../assets/buyer-icon.svg";
import sellerIcon from "../assets/seller-icon.svg";
import { useAppContext } from "../context/AppContext";

const ChooseRole = () => {
  const [selectedRole, setSelectedRole] = useState(null);
  const { setUserRole } = useAppContext();
  const navigate = useNavigate();
  const location = useLocation();

  // Determine mode: signup or signin — assuming `?mode=signin` if from Sign In
  const isSignIn = location.search.includes("mode=signin");

  const handleNext = () => {
    if (!selectedRole) return;
    setUserRole(selectedRole);
    navigate(selectedRole === "buyer" ? "/buyer/register" : "/seller/register");
  };

  const handleSignIn = (role) => {
    setUserRole(role);
    navigate(role === "buyer" ? "/buyer/login" : "/seller/login");
  };

  const RoleCard = ({ icon, title, description, role }) => (
    <div
      onClick={() => {
        if (isSignIn) {
          handleSignIn(role);
        } else {
          setSelectedRole(role);
        }
      }}
      className={`flex items-center gap-4 p-4 rounded-xl cursor-pointer border transform transition-all duration-300 hover:scale-[1.02] hover:shadow-md ${
        selectedRole === role && !isSignIn ? "border-black bg-gray-100" : "border-gray-300"
      }`}
    >
      <img src={icon} alt={`${title} icon`} className="w-14 h-14" />
      <div>
        <h3 className="text-lg font-semibold">{title}</h3>
        <p className="text-sm text-gray-600">{description}</p>
      </div>
    </div>
  );

  const leftContent = (
    <>
      <h2 className="text-4xl italic font-bold mb-4">Laplocal</h2>
      <p className="text-center text-black">
        Bridging local laptop shops and digital convenience — discover, compare,
        and connect seamlessly.
      </p>
    </>
  );

  const rightContent = (
    <div className="w-full max-w-md">
      <h2 className="text-3xl font-bold text-center mb-8">
        {isSignIn ? "Sign in as" : "Choose a role"}
      </h2>
      <div className="space-y-4 mb-6">
        <RoleCard
          icon={buyerIcon}
          title={isSignIn ? "Sign in as Buyer" : "Join as Individual"}
          description={
            isSignIn
              ? "Access your buyer dashboard and manage your purchases."
              : "Browse competitive listings and smart AI-based laptop suggestions tailored for you."
          }
          role="buyer"
        />
        <RoleCard
          icon={sellerIcon}
          title={isSignIn ? "Sign in as Seller" : "Join as Seller"}
          description={
            isSignIn
              ? "Access your seller dashboard and manage your inventory."
              : "Boost visibility, manage inventory, and trade smarter through wholesale options."
          }
          role="seller"
        />
      </div>
      {!isSignIn && (
        <Button onClick={handleNext}>Next</Button>
      )}
    </div>
  );

  return <AuthWrapper leftContent={leftContent} rightContent={rightContent} />;
};

export default ChooseRole;

