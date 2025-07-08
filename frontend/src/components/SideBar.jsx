

// "use client";

// import { useState } from "react";
// import { NavLink } from "react-router-dom";
// import {
//   FaTachometerAlt,
//   FaBoxOpen,
//   FaShoppingCart,
//   FaUsers,
//   FaStore,
//   FaEnvelope,
//   FaCube,  // ✅ Added for "Add a Product"
//   FaBars,
//   FaTimes,
// } from "react-icons/fa";

// const SideBar = () => {
//   const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

//   const navigationItems = [
//     { to: "/seller/dashboard", icon: FaTachometerAlt, label: "Dashboard" },
//     { to: "/seller/messages", icon: FaEnvelope, label: "Messages" },
//     { to: "/seller/inventory", icon: FaBoxOpen, label: "Inventory" },
//     { to: "/seller/add-product", icon: FaCube, label: "Add a Product" }, // ✅ NEW ITEM
//   ];

//   const linkClasses = ({ isActive }) =>
//     `flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 font-medium text-sm ${
//       isActive ? "bg-[#D3E584] text-black shadow-sm" : "text-gray-600 hover:bg-gray-50 hover:text-gray-800"
//     }`;

//   const toggleMobileMenu = () => {
//     setIsMobileMenuOpen(!isMobileMenuOpen);
//   };

//   const closeMobileMenu = () => {
//     setIsMobileMenuOpen(false);
//   };

//   return (
//     <>
//       {/* Mobile Hamburger Button */}
//       <div className="lg:hidden fixed top-4 left-4 z-50">
//         <button
//           onClick={toggleMobileMenu}
//           className="bg-white p-3 rounded-lg shadow-lg hover:shadow-xl transition-shadow border border-gray-200"
//           aria-label="Toggle menu"
//         >
//           {isMobileMenuOpen ? (
//             <FaTimes className="w-5 h-5 text-gray-700" />
//           ) : (
//             <FaBars className="w-5 h-5 text-gray-700" />
//           )}
//         </button>
//       </div>

//       {/* Mobile Overlay - Changed from black to light gray */}
//       {isMobileMenuOpen && (
//         <div
//           className="lg:hidden fixed inset-0 bg-gray-300 bg-opacity-60 z-40 backdrop-blur-sm"
//           onClick={closeMobileMenu}
//         />
//       )}

//       {/* Sidebar */}
//       <aside
//         className={`
//           bg-white shadow-lg rounded-xl h-fit sticky top-4 transition-all duration-300 z-40 border border-gray-100
//           ${isMobileMenuOpen ? "fixed left-4 top-20 w-72 max-w-[calc(100vw-2rem)] lg:relative lg:left-0 lg:top-0 lg:w-64" : "hidden lg:block w-64"}
//         `}
//       >
//         <div className="p-6">
//           <nav className="flex flex-col space-y-1">
//             {navigationItems.map((item) => {
//               const IconComponent = item.icon;
//               return (
//                 <NavLink
//                   key={item.to}
//                   to={item.to}
//                   className={linkClasses}
//                   onClick={closeMobileMenu}
//                 >
//                   <IconComponent className="w-4 h-4 flex-shrink-0" />
//                   <span className="truncate">{item.label}</span>
//                 </NavLink>
//               );
//             })}
//           </nav>
//         </div>
//       </aside>
//     </>
//   );
// };

// export default SideBar;

"use client";

import { useState } from "react";
import { NavLink } from "react-router-dom";
import {
  FaTachometerAlt,
  FaBoxOpen,
  FaShoppingCart,
  FaUsers,
  FaStore,
  FaEnvelope,
  FaCube,
  FaBars,
  FaTimes,
  FaEye, // ✅ New icon for Viewed Listings
} from "react-icons/fa";

const SideBar = ({viewedCount = 0}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navigationItems = [
    { to: "/seller/dashboard", icon: FaTachometerAlt, label: "Dashboard" },
    // { to: "/seller/messages", icon: FaEnvelope, label: "Messages" },
    { to: "/seller/inventory", icon: FaBoxOpen, label: "Inventory" },
    { to: "/seller/add-product", icon: FaCube, label: "Add a Product" },
    // { to: "/seller/viewed-listings", icon: FaEye, label: "Viewed Listings" }, // ✅ NEW ITEM
    // {
    //   to: "/seller/viewed-listings",
    //   icon: FaEye,
    //   label: (
    //     <div className="flex items-center justify-between w-full">
    //       <span>Viewed Listings</span>
    //       {viewedCount > 0 && (
    //         <span className="ml-2 bg-red-500 text-white text-xs font-semibold px-2 py-0.5 rounded-full">
    //           {viewedCount}
    //         </span>
    //       )}
    //     </div>
    //   )
    // },
  ];

  const linkClasses = ({ isActive }) =>
    `flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 font-medium text-sm ${
      isActive ? "bg-[#D3E584] text-black shadow-sm" : "text-gray-600 hover:bg-gray-50 hover:text-gray-800"
    }`;

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      {/* Mobile Hamburger Button */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <button
          onClick={toggleMobileMenu}
          className="bg-white p-3 rounded-lg shadow-lg hover:shadow-xl transition-shadow border border-gray-200"
          aria-label="Toggle menu"
        >
          {isMobileMenuOpen ? (
            <FaTimes className="w-5 h-5 text-gray-700" />
          ) : (
            <FaBars className="w-5 h-5 text-gray-700" />
          )}
        </button>
      </div>

      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-gray-300 bg-opacity-60 z-40 backdrop-blur-sm"
          onClick={closeMobileMenu}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`bg-white shadow-lg rounded-xl h-fit sticky top-4 transition-all duration-300 z-40 border border-gray-100
          ${isMobileMenuOpen ? "fixed left-4 top-20 w-72 max-w-[calc(100vw-2rem)] lg:relative lg:left-0 lg:top-0 lg:w-64" : "hidden lg:block w-64"}
        `}
      >
        <div className="p-6">
          <nav className="flex flex-col space-y-1">
            {navigationItems.map((item) => {
              const IconComponent = item.icon;
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={linkClasses}
                  onClick={closeMobileMenu}
                >
                  <IconComponent className="w-4 h-4 flex-shrink-0" />
                  <span className="truncate">{item.label}</span>
                </NavLink>
              );
            })}
          </nav>
        </div>
      </aside>
    </>
  );
};

export default SideBar;
