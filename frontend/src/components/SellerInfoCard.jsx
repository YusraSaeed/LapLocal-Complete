
// import { useNavigate } from "react-router-dom";

// const SellerInfoCard = ({ seller }) => {
//   const navigate = useNavigate();

//   return (
//     <div className="bg-[#D3E584] rounded-2xl p-4 sm:p-6 shadow-md">
//       <div className="flex flex-col lg:flex-row items-center justify-between gap-4 lg:gap-6">
//         {/* Left: Name & Email - Centered */}
//         <div className="flex flex-col items-center min-w-0 lg:min-w-[180px] text-center">
//           <h2 className="text-lg font-semibold text-black truncate w-full">{seller?.fullName}</h2>
//           <p className="text-sm text-gray-700 truncate w-full">{seller?.email}</p>
//         </div>

//         {/* Center: Personal Info with Responsive Dividers */}
//         <div className="flex-1 w-full lg:border-l lg:border-r border-gray-600 lg:px-6 px-0 text-center">
//           {/* Mobile: Top border, Desktop: Side borders */}
//           <div className="lg:hidden border-t border-b border-gray-600 py-4 mb-4"></div>

//           <h4 className="text-sm font-semibold text-gray-700 mb-2">PERSONAL INFORMATION</h4>
//           <div className="text-sm text-black space-y-1">
//             <p className="flex flex-col sm:flex-row sm:justify-center sm:gap-1">
//               <span className="text-gray-800">Contact Number:</span>
//               <span className="font-semibold">{seller?.phone}</span>
//             </p>
//             <p className="flex flex-col sm:flex-row sm:justify-center sm:gap-1">
//               <span className="text-gray-800">Shop no.:</span>
//               <span className="font-semibold">#{seller?.shopNumber}</span>
//             </p>
//             <p className="flex flex-col sm:flex-row sm:justify-center sm:gap-1">
//               <span className="text-gray-800">Shop name:</span>
//               <span className="break-words">{seller?.shopName}</span>
//             </p>
//           </div>
//         </div>

//         {/* Right: Shop Address & Button */}
//         <div className="flex flex-col justify-between items-center gap-2 text-sm text-black text-center min-w-0 lg:min-w-[180px]">
//           <div className="w-full">
//             <h4 className="text-sm font-semibold text-gray-700 mb-1">Shop Address</h4>
//             <p className="break-words text-xs sm:text-sm">{seller?.shopAddress}</p>
//           </div>
//           <button 
//             onClick={() => navigate('/seller-settings')}
//             className="mt-2 bg-black text-white text-xs sm:text-sm px-3 sm:px-4 py-1.5 rounded-full transform transition-transform duration-300 hover:scale-105 hover:bg-gray-800 disabled:opacity-70 disabled:cursor-not-allowed whitespace-nowrap">
//             Update Profile
//           </button>
//         </div>
//       </div>
//     </div>
//   )
// }

// export default SellerInfoCard


import { useNavigate } from "react-router-dom";
import { FaCheckCircle, FaExclamationCircle } from "react-icons/fa";

const SellerInfoCard = ({ seller }) => {
  const navigate = useNavigate();

  return (
    <div className="bg-[#D3E584] rounded-2xl p-4 sm:p-6 shadow-md">
      <div className="flex flex-col lg:flex-row items-center justify-between gap-4 lg:gap-6">
        {/* Left: Name & Email */}
        <div className="flex flex-col items-center min-w-0 lg:min-w-[180px] text-center">
          <div className="flex items-center justify-center gap-2 w-full">
            <h2 className="text-lg font-semibold text-black truncate">{seller?.fullName}</h2>
            {seller?.verificationStatus ? (
              <FaCheckCircle className="text-green-600 w-4 h-4" title="Verified Seller" />
            ) : (
              <FaExclamationCircle className="text-yellow-600 w-4 h-4" title="Unverified Seller" />
            )}
          </div>
          <p className="text-sm text-gray-700 truncate w-full">{seller?.email}</p>
        </div>

        {/* Center: Info */}
        <div className="flex-1 w-full lg:border-l lg:border-r border-gray-600 lg:px-6 px-0 text-center">
          <div className="lg:hidden border-t border-b border-gray-600 py-4 mb-4"></div>
          <h4 className="text-sm font-semibold text-gray-700 mb-2">PERSONAL INFORMATION</h4>
          <div className="text-sm text-black space-y-1">
            <p className="flex flex-col sm:flex-row sm:justify-center sm:gap-1">
              <span className="text-gray-800">Contact Number:</span>
              <span className="font-semibold">{seller?.phone}</span>
            </p>
            <p className="flex flex-col sm:flex-row sm:justify-center sm:gap-1">
              <span className="text-gray-800">Shop no.:</span>
              <span className="font-semibold">#{seller?.shopNumber}</span>
            </p>
            <p className="flex flex-col sm:flex-row sm:justify-center sm:gap-1">
              <span className="text-gray-800">Shop name:</span>
              <span className="break-words">{seller?.shopName}</span>
            </p>
          </div>
        </div>

        {/* Right: Address + Button */}
        <div className="flex flex-col justify-between items-center gap-2 text-sm text-black text-center min-w-0 lg:min-w-[180px]">
          <div className="w-full">
            <h4 className="text-sm font-semibold text-gray-700 mb-1">Shop Address</h4>
            <p className="break-words text-xs sm:text-sm">{seller?.shopAddress}</p>
          </div>
          <button 
            onClick={() => navigate('/seller-settings')}
            className="mt-2 bg-black text-white text-xs sm:text-sm px-3 sm:px-4 py-1.5 rounded-full transform transition-transform duration-300 hover:scale-105 hover:bg-gray-800 disabled:opacity-70 disabled:cursor-not-allowed whitespace-nowrap"
          >
            Update Profile
          </button>
        </div>
      </div>
    </div>
  );
};

export default SellerInfoCard;
