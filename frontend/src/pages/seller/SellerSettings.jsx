// "use client"

// import { useState, useEffect } from "react"
// import InputField from "../../components/InputField"
// import Button from "../../components/Button"
// import SuccessModal from "../../components/SuccessModal"
// import { FaCog, FaLock } from "react-icons/fa"
// import { useAppContext } from "../../context/AppContext"

// const SellerSettings = () => {
//   const { userData, accessToken } = useAppContext()

//   const [activeTab, setActiveTab] = useState("general")
//   const [isLoading, setIsLoading] = useState(false)
//   const [showSuccessModal, setShowSuccessModal] = useState(false)
//   const [successMessage, setSuccessMessage] = useState("")

//   const [formData, setFormData] = useState({
//     fullName: "",
//     shopName: "",
//     shopNumber: "",
//     email: "",
//     address: "",
//     shopAddress: "",
//   })

//   const [passwordData, setPasswordData] = useState({
//     currentPassword: "",
//     newPassword: "",
//     confirmPassword: "",
//   })

//   // ✅ Prefill the form when userData is available
//   useEffect(() => {
//     if (userData) {
//       setFormData({
//         fullName: userData.fullName || "",
//         shopName: userData.shopName || "",
//         shopNumber: userData.shopNumber || "",
//         email: userData.email || "",
//         address: userData.address || "",
//         shopAddress: userData.shopAddress || "",
//       })
//     }
//   }, [userData])

//   const handleInputChange = (field, value) => {
//     setFormData((prev) => ({
//       ...prev,
//       [field]: value,
//     }))
//   }

//   const handlePasswordChange = (field, value) => {
//     setPasswordData((prev) => ({
//       ...prev,
//       [field]: value,
//     }))
//   }

//   const showSuccess = (message) => {
//     setSuccessMessage(message)
//     setShowSuccessModal(true)
//   }

//   // ✅ Save general settings to backend
//   const handleSave = async (e) => {
//     e.preventDefault()
//     if (!userData?._id) {
//       alert("No seller ID found.")
//       return
//     }

//     setIsLoading(true)

//     try {
//       const res = await fetch(`http://localhost:5000/api/v1/sellers/update/${userData._id}`, {
//         method: "PUT",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${accessToken}`,
//         },
//         body: JSON.stringify(formData),
//       })

//       if (res.ok) {
//         showSuccess("Settings have been successfully updated!")
//       } else {
//         const errorData = await res.json()
//         alert(errorData.message || "Failed to save settings")
//       }
//     } catch (err) {
//       console.error("Error saving settings:", err)
//       alert("An error occurred. Please try again.")
//     } finally {
//       setIsLoading(false)
//     }
//   }

//   // ✅ Password update with backend integration
//   const handlePasswordSave = async (e) => {
//     e.preventDefault()
//     if (passwordData.newPassword !== passwordData.confirmPassword) {
//       alert("New passwords don't match!")
//       return
//     }

//     setIsLoading(true)

//     try {
//       const res = await fetch(`http://localhost:5000/api/v1/sellers/update-password/${userData._id}`, {
//         method: "PUT",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${accessToken}`,
//         },
//         body: JSON.stringify(passwordData),
//       })

//       if (res.ok) {
//         showSuccess("Password has been successfully updated!")
//         setPasswordData({
//           currentPassword: "",
//           newPassword: "",
//           confirmPassword: "",
//         })
//       } else {
//         const errorData = await res.json()
//         alert(errorData.message || "Failed to update password")
//       }
//     } catch (err) {
//       console.error("Error updating password:", err)
//       alert("An error occurred. Please try again.")
//     } finally {
//       setIsLoading(false)
//     }
//   }

//   const sidebarItems = [
//     {
//       id: "general",
//       label: "General",
//       icon: FaCog,
//       description: "Access the general settings",
//     },
//     {
//       id: "password",
//       label: "Password",
//       icon: FaLock,
//       description: "Change your account password",
//     },
//   ]

//   return (
//     <div className="min-h-screen bg-gray-50 p-4 lg:p-6">
//       <div className="max-w-7xl mx-auto">
//         {/* Header */}
//         <div className="mb-6">
//           <div className="flex items-center gap-3 mb-2">
//             <img src="/logo.png" alt="Logo" className="w-8 h-8" />
//             <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">Settings</h1>
//           </div>
//           <p className="text-gray-600">Manage your account settings and preferences</p>
//         </div>

//         <div className="flex flex-col lg:flex-row gap-8">
//           {/* Sidebar */}
//           <div className="lg:w-80 w-full">
//             <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-4">
//               <nav className="space-y-2">
//                 {sidebarItems.map((item) => {
//                   const IconComponent = item.icon
//                   return (
//                     <button
//                       key={item.id}
//                       onClick={() => setActiveTab(item.id)}
//                       className={`w-full flex items-start gap-3 p-3 rounded-xl transition-all duration-200 text-left ${
//                         activeTab === item.id ? "bg-[#D3E584] text-black shadow-sm" : "text-gray-600 hover:bg-gray-50"
//                       }`}
//                     >
//                       <IconComponent className="w-5 h-5 mt-0.5 flex-shrink-0" />
//                       <div className="min-w-0">
//                         <div className="font-medium">{item.label}</div>
//                         <div className="text-sm text-gray-500 mt-1">{item.description}</div>
//                       </div>
//                     </button>
//                   )
//                 })}
//               </nav>
//             </div>
//           </div>

//           {/* Main Content */}
//           <div className="flex-1">
//             <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-4 lg:p-6">
//               {activeTab === "general" && (
//                 <div>
//                   <div className="mb-4">
//                     <h2 className="text-2xl font-bold text-gray-900 mb-2">General Settings</h2>
//                     <p className="text-gray-600">Update your personal and shop information</p>
//                   </div>

//                   <form onSubmit={handleSave} className="space-y-4">
//                     {/* Full Name */}
//                     <InputField
//                       label="Full Name"
//                       placeholder="Enter your full name"
//                       value={formData.fullName}
//                       onChange={(e) => handleInputChange("fullName", e.target.value)}
//                       className="p-2.5"
//                     />

//                     {/* Shop Name */}
//                     <InputField
//                       label="Shop Name"
//                       placeholder="Enter your shop name"
//                       value={formData.shopName}
//                       onChange={(e) => handleInputChange("shopName", e.target.value)}
//                       className="p-2.5"
//                     />

//                     {/* Shop Number */}
//                     <InputField
//                       label="Shop Number"
//                       placeholder="Enter your shop number"
//                       value={formData.shopNumber}
//                       onChange={(e) => handleInputChange("shopNumber", e.target.value)}
//                       className="p-2.5"
//                     />

//                     {/* Email */}
//                     <InputField
//                       label="Email"
//                       type="email"
//                       placeholder="Enter your email address"
//                       value={formData.email}
//                       onChange={(e) => handleInputChange("email", e.target.value)}
//                       className="p-2.5"
//                     />

//                     {/* Shop Address */}
//                     <InputField
//                       label="Shop Address"
//                       placeholder="Enter your shop address"
//                       value={formData.shopAddress}
//                       onChange={(e) => handleInputChange("shopAddress", e.target.value)}
//                       className="p-2.5"
//                     />

//                     {/* Save Button */}
//                     <div className="pt-2">
//                       <Button type="submit" isLoading={isLoading}>
//                         Save Changes
//                       </Button>
//                     </div>
//                   </form>
//                 </div>
//               )}

//               {activeTab === "password" && (
//                 <div>
//                   <div className="mb-4">
//                     <h2 className="text-2xl font-bold text-gray-900 mb-2">Change Password</h2>
//                     <p className="text-gray-600">Update your account password for security</p>
//                   </div>

//                   <form onSubmit={handlePasswordSave} className="space-y-4">
//                     {/* Current Password */}
//                     <InputField
//                       label="Current Password"
//                       type="password"
//                       placeholder="Enter your current password"
//                       value={passwordData.currentPassword}
//                       onChange={(e) => handlePasswordChange("currentPassword", e.target.value)}
//                       className="p-2.5"
//                     />

//                     {/* New Password */}
//                     <InputField
//                       label="New Password"
//                       type="password"
//                       placeholder="Enter your new password"
//                       value={passwordData.newPassword}
//                       onChange={(e) => handlePasswordChange("newPassword", e.target.value)}
//                       className="p-2.5"
//                     />

//                     {/* Confirm New Password */}
//                     <InputField
//                       label="Confirm New Password"
//                       type="password"
//                       placeholder="Confirm your new password"
//                       value={passwordData.confirmPassword}
//                       onChange={(e) => handlePasswordChange("confirmPassword", e.target.value)}
//                       className="p-2.5"
//                     />

//                     {/* Save Button */}
//                     <div className="pt-2">
//                       <Button type="submit" isLoading={isLoading}>
//                         Update Password
//                       </Button>
//                     </div>
//                   </form>
//                 </div>
//               )}
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Success Modal */}
//       <SuccessModal isOpen={showSuccessModal} onClose={() => setShowSuccessModal(false)} message={successMessage} />
//     </div>
//   )
// }

// export default SellerSettings

"use client";

import { useState, useEffect } from "react";
import InputField from "../../components/InputField";
import Button from "../../components/Button";
import SuccessModal from "../../components/SuccessModal";
import { FaCog, FaLock } from "react-icons/fa";
import { useAppContext } from "../../context/AppContext";

const SellerSettings = () => {
  const { userData, accessToken } = useAppContext();

  const [activeTab, setActiveTab] = useState("general");
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const [formData, setFormData] = useState({
    fullName: "",
    shopName: "",
    shopNumber: "",
    email: "",
    address: "",
    shopAddress: "",
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  // ✅ Prefill form with userData
  useEffect(() => {
    if (userData) {
      setFormData({
        fullName: userData.fullName || "",
        shopName: userData.shopName || "",
        shopNumber: userData.shopNumber || "",
        email: userData.email || "",
        address: userData.address || "",
        shopAddress: userData.shopAddress || "",
      });
    }
  }, [userData]);

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handlePasswordChange = (field, value) => {
    setPasswordData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const showSuccess = (message) => {
    setSuccessMessage(message);
    setShowSuccessModal(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!userData?._id) {
      alert("No seller ID found.");
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch(
        `http://localhost:5000/api/v1/sellers/update/${userData._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify(formData),
        }
      );

      if (res.ok) {
        showSuccess("Settings have been successfully updated!");
      } else {
        const errorData = await res.json();
        alert(errorData.message || "Failed to save settings");
      }
    } catch (err) {
      console.error("Error saving settings:", err);
      alert("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordSave = async (e) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert("New passwords don't match!");
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch("http://localhost:5000/api/v1/auth/change-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        credentials: "include",
        body: JSON.stringify({
          oldPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword,
        }),
      });

      if (res.ok) {
        showSuccess("Password has been successfully updated!");
        setPasswordData({
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        });
      } else {
        const errorData = await res.json();
        alert(errorData.message || "Failed to update password");
      }
    } catch (err) {
      console.error("Error updating password:", err);
      alert("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const sidebarItems = [
    {
      id: "general",
      label: "General",
      icon: FaCog,
      description: "Access the general settings",
    },
    {
      id: "password",
      label: "Password",
      icon: FaLock,
      description: "Change your account password",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-4 lg:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-2">
            <img src="/logo.png" alt="Logo" className="w-8 h-8" />
            <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">Settings</h1>
          </div>
          <p className="text-gray-600">
            Manage your account settings and preferences
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <div className="lg:w-80 w-full">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-4">
              <nav className="space-y-2">
                {sidebarItems.map((item) => {
                  const IconComponent = item.icon;
                  return (
                    <button
                      key={item.id}
                      onClick={() => setActiveTab(item.id)}
                      className={`w-full flex items-start gap-3 p-3 rounded-xl transition-all duration-200 text-left ${
                        activeTab === item.id
                          ? "bg-[#D3E584] text-black shadow-sm"
                          : "text-gray-600 hover:bg-gray-50"
                      }`}
                    >
                      <IconComponent className="w-5 h-5 mt-0.5 flex-shrink-0" />
                      <div className="min-w-0">
                        <div className="font-medium">{item.label}</div>
                        <div className="text-sm text-gray-500 mt-1">
                          {item.description}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-4 lg:p-6">
              {activeTab === "general" && (
                <div>
                  <div className="mb-4">
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">
                      General Settings
                    </h2>
                    <p className="text-gray-600">
                      Update your personal and shop information
                    </p>
                  </div>

                  <form onSubmit={handleSave} className="space-y-4">
                    <InputField
                      label="Full Name"
                      placeholder="Enter your full name"
                      value={formData.fullName}
                      onChange={(e) =>
                        handleInputChange("fullName", e.target.value)
                      }
                      className="p-2.5"
                    />

                    <InputField
                      label="Shop Name"
                      placeholder="Enter your shop name"
                      value={formData.shopName}
                      onChange={(e) =>
                        handleInputChange("shopName", e.target.value)
                      }
                      className="p-2.5"
                    />

                    <InputField
                      label="Shop Number"
                      placeholder="Enter your shop number"
                      value={formData.shopNumber}
                      onChange={(e) =>
                        handleInputChange("shopNumber", e.target.value)
                      }
                      className="p-2.5"
                    />

                    <InputField
                      label="Email"
                      type="email"
                      placeholder="Enter your email address"
                      value={formData.email}
                      onChange={(e) =>
                        handleInputChange("email", e.target.value)
                      }
                      className="p-2.5"
                    />

                    <InputField
                      label="Shop Address"
                      placeholder="Enter your shop address"
                      value={formData.shopAddress}
                      onChange={(e) =>
                        handleInputChange("shopAddress", e.target.value)
                      }
                      className="p-2.5"
                    />

                    <div className="pt-2">
                      <Button type="submit" isLoading={isLoading}>
                        Save Changes
                      </Button>
                    </div>
                  </form>
                </div>
              )}

              {activeTab === "password" && (
                <div>
                  <div className="mb-4">
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">
                      Change Password
                    </h2>
                    <p className="text-gray-600">
                      Update your account password for security
                    </p>
                  </div>

                  <form onSubmit={handlePasswordSave} className="space-y-4">
                    <InputField
                      label="Current Password"
                      type="password"
                      placeholder="Enter your current password"
                      value={passwordData.currentPassword}
                      onChange={(e) =>
                        handlePasswordChange("currentPassword", e.target.value)
                      }
                      className="p-2.5"
                    />

                    <InputField
                      label="New Password"
                      type="password"
                      placeholder="Enter your new password"
                      value={passwordData.newPassword}
                      onChange={(e) =>
                        handlePasswordChange("newPassword", e.target.value)
                      }
                      className="p-2.5"
                    />

                    <InputField
                      label="Confirm New Password"
                      type="password"
                      placeholder="Confirm your new password"
                      value={passwordData.confirmPassword}
                      onChange={(e) =>
                        handlePasswordChange("confirmPassword", e.target.value)
                      }
                      className="p-2.5"
                    />

                    <div className="pt-2">
                      <Button type="submit" isLoading={isLoading}>
                        Update Password
                      </Button>
                    </div>
                  </form>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <SuccessModal
        isOpen={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
        message={successMessage}
      />
    </div>
  );
};

export default SellerSettings;

