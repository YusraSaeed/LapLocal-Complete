// // import { User, LogOut } from "lucide-react"
// // import { useAppContext } from "../context/AppContext"
// // import { useNavigate } from "react-router-dom"

// // const TopBar = () => {
// //   const { userData, accessToken } = useAppContext()
// //   const navigate = useNavigate()

// //   const handleLogout = async () => {
// //     const logoutURL =
// //       userData?.shopNumber !== undefined
// //         ? "http://localhost:5000/api/v1/sellers/logout"
// //         : "http://localhost:5000/api/v1/buyers/logout"

// //     try {
// //       await fetch(logoutURL, {
// //         method: "POST",
// //         headers: { Authorization: `Bearer ${accessToken}` },
// //         credentials: "include",
// //       })

// //       sessionStorage.clear()
// //       localStorage.clear()
// //       navigate("/", { replace: true })
// //     } catch (err) {
// //       sessionStorage.clear()
// //       localStorage.clear()
// //       navigate("/", { replace: true })
// //     }
// //   }

// //   return (
// //     <div className="fixed top-0 left-0 right-0 w-full bg-white border-b border-gray-100 px-6 py-4 z-50">
// //       <div className="max-w-7xl mx-auto flex items-center justify-between">
// //         <div className="flex items-center">
// //           <img src="/logo.png" alt="Logo" className="h-8 w-auto" />
// //         </div>

// //         <div className="flex items-center space-x-4">
// //           <div className="flex items-center space-x-3">
// //             <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
// //               <User className="h-5 w-5 text-gray-600" />
// //             </div>
// //             <div className="text-sm">
// //               <span className="text-gray-500">Welcome</span>
// //               <br />
// //               <span className="text-gray-900 font-medium">
// //                 {userData?.fullName || "User"}
// //               </span>
// //             </div>
// //           </div>

// //           <button
// //             onClick={handleLogout}
// //             className="flex items-center gap-1 px-3 py-2 border border-gray-200 rounded-full bg-white text-gray-600 hover:bg-gray-100 transition"
// //           >
// //             <LogOut className="h-4 w-4" />
// //             <span className="text-sm font-medium">Logout</span>
// //           </button>
// //         </div>
// //       </div>
// //     </div>
// //   )
// // }

// // export default TopBar


// // above is before admin logout

// import { User, LogOut } from "lucide-react";
// import { useAppContext } from "../context/AppContext";
// import { useNavigate } from "react-router-dom";

// const TopBar = () => {
//   const { userData, accessToken } = useAppContext();
//   const navigate = useNavigate();

//   const handleLogout = async () => {
//     const logoutURL =
//       userData?.shopNumber !== undefined
//         ? "http://localhost:5000/api/v1/sellers/logout"
//         : userData?.role === "admin"
//         ? "http://localhost:5000/api/v1/admin/logout"
//         : "http://localhost:5000/api/v1/buyers/logout";

//     try {
//       await fetch(logoutURL, {
//         method: "POST",
//         headers: { Authorization: `Bearer ${accessToken}` },
//         credentials: "include",
//       });

//       sessionStorage.clear();
//       localStorage.clear();
//       navigate("/", { replace: true });
//     } catch (err) {
//       sessionStorage.clear();
//       localStorage.clear();
//       navigate("/", { replace: true });
//     }
//   };

//   return (
//     <div className="fixed top-0 left-0 right-0 w-full bg-white border-b border-gray-100 px-6 py-4 z-50">
//       <div className="max-w-7xl mx-auto flex items-center justify-between">
//         <div className="flex items-center">
//           <img src="/logo.png" alt="Logo" className="h-8 w-auto" />
//         </div>

//         <div className="flex items-center space-x-4">
//           <div className="flex items-center space-x-3">
//             <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
//               <User className="h-5 w-5 text-gray-600" />
//             </div>
//             <div className="text-sm">
//               <span className="text-gray-500">Welcome</span>
//               <br />
//               <span className="text-gray-900 font-medium">
//                 {userData?.fullName || "User"}
//               </span>
//             </div>
//           </div>

//           <button
//             onClick={handleLogout}
//             className="flex items-center gap-1 px-3 py-2 border border-gray-200 rounded-full bg-white text-gray-600 hover:bg-gray-100 transition"
//           >
//             <LogOut className="h-4 w-4" />
//             <span className="text-sm font-medium">Logout</span>
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default TopBar;






"use client"

import { User, LogOut, Menu, X } from "lucide-react"
import { useState } from "react"
import { useAppContext } from "../context/AppContext"
import { useNavigate } from "react-router-dom"

const TopBar = () => {
  const { userData, accessToken } = useAppContext()
  const navigate = useNavigate()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const handleLogout = async () => {
    const logoutURL =
      userData?.shopNumber !== undefined
        ? "http://localhost:5000/api/v1/sellers/logout"
        : userData?.role === "admin"
          ? "http://localhost:5000/api/v1/admin/logout"
          : "http://localhost:5000/api/v1/buyers/logout"

    try {
      await fetch(logoutURL, {
        method: "POST",
        headers: { Authorization: `Bearer ${accessToken}` },
        credentials: "include",
      })
      sessionStorage.clear()
      localStorage.clear()
      navigate("/", { replace: true })
    } catch (err) {
      sessionStorage.clear()
      localStorage.clear()
      navigate("/", { replace: true })
    }
  }

  return (
    <div className="fixed top-0 left-0 right-0 w-full bg-white border-b border-gray-100 z-50">
      <div className="px-4 sm:px-6 md:px-8 lg:px-12 xl:px-24 py-3 sm:py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center">
            <img src="/logo.png" alt="Logo" className="h-6 sm:h-8 w-auto" />
            {/* <img src="/logo2.png" alt="Logo" className="h-6 sm:h-8 w-auto" /> */}

          </div>

          {/* Desktop User Info & Logout */}
          <div className="hidden sm:flex items-center space-x-3 md:space-x-4">
            <div className="flex items-center space-x-2 md:space-x-3">
              <div className="w-7 h-7 sm:w-8 sm:h-8 bg-gray-300 rounded-full flex items-center justify-center">
                <User className="h-4 w-4 sm:h-5 sm:w-5 text-gray-600" />
              </div>
              <div className="text-xs sm:text-sm">
                <span className="text-gray-500 block">Welcome</span>
                <span className="text-gray-900 font-medium block">{userData?.fullName || "User"}</span>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-1 px-2 sm:px-3 py-1.5 sm:py-2 border border-gray-200 rounded-full bg-white text-gray-600 hover:bg-gray-100 transition text-xs sm:text-sm"
            >
              <LogOut className="h-3 w-3 sm:h-4 sm:w-4" />
              <span className="font-medium">Logout</span>
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="sm:hidden p-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="sm:hidden mt-4 pt-4 border-t border-gray-200">
            <div className="flex flex-col space-y-4">
              {/* User Info */}
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                  <User className="h-5 w-5 text-gray-600" />
                </div>
                <div className="text-sm">
                  <span className="text-gray-500 block">Welcome</span>
                  <span className="text-gray-900 font-medium block">{userData?.fullName || "User"}</span>
                </div>
              </div>

              {/* Logout Button */}
              <button
                onClick={() => {
                  handleLogout()
                  setIsMobileMenuOpen(false)
                }}
                className="flex items-center gap-2 px-4 py-3 bg-gray-50 rounded-lg text-gray-600 hover:bg-gray-100 transition text-sm font-medium"
              >
                <LogOut className="h-4 w-4" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default TopBar
