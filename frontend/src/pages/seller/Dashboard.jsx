// import SellerInfoCard from "../../components/SellerInfoCard.jsx";
// import SideBar from "../../components/SideBar.jsx";
// import ProductCard from "../../components/ProductCard.jsx";
// import EmptyState from "../../components/EmptyState.jsx";
// import useSellerDashboardData from "../../hooks/useSellerDashboardData.js";
// import TopBar from "../../components/TopBar.jsx";
// import { Link } from "react-router-dom";
// import useViewedListingsSocket from "../../hooks/useViewedListingsSocket";
// import { useAppContext } from "../../context/AppContext"; // assuming sellerId is here
// import { SocketProvider } from "../../context/SocketContext.jsx";

// const SellerDashboard = () => {
//   const { seller, listings, isLoading } = useSellerDashboardData();
//   const { userData } = useAppContext();

//   // const viewedCount = useViewedListingsSocket(userData?._id);
//   const [viewedCount, setViewedCount] = useViewedListingsSocket(userData?._id);

//   // console.log("👤 Seller ID:", userData?._id);

//   return (
//     <SocketProvider>
//       <div className="min-h-screen bg-[#FDF7F2]">
//       {/* ✅ Fixed TopBar */}
//       <TopBar />

//       {/* ✅ Add top padding to push content below TopBar */}
//       <div className="pt-20 px-4 lg:px-6 flex flex-col lg:flex-row gap-4 lg:gap-6">
//         {/* Sidebar */}
//         {/* <SideBar /> */}
//         <SideBar viewedCount={viewedCount} />


//         {/* Main Content */}
//         <div className="flex-1 flex flex-col gap-4 lg:gap-6">
//           {seller && <SellerInfoCard seller={seller} />}

//           {isLoading ? (
//             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
//               {Array(12)
//                 .fill(0)
//                 .map((_, idx) => (
//                   <div
//                     key={idx}
//                     className="h-64 bg-gray-200 animate-pulse rounded-2xl"
//                   ></div>
//                 ))}
//             </div>
//           ) : listings?.length > 0 ? (
//             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
//               {listings.slice(0, 12).map((listing) => (
//                 <Link key={listing._id} to={`/seller/view-page/${listing._id}`}>
//                   <ProductCard product={listing} />
//                 </Link>
//               ))}
//             </div>
//           ) : (
//             <EmptyState />
//           )}
//         </div>
//       </div>
//     </div>
//     </SocketProvider>
//   );
// };

// export default SellerDashboard;



// src/pages/Seller/SellerDashboard.jsx

import SellerInfoCard from "../../components/SellerInfoCard.jsx";
import SideBar from "../../components/SideBar.jsx";
import ProductCard from "../../components/ProductCard.jsx";
import EmptyState from "../../components/EmptyState.jsx";
import useSellerDashboardData from "../../hooks/useSellerDashboardData.js";
import TopBar from "../../components/TopBar.jsx";
import { Link } from "react-router-dom";
import useViewedListingsSocket from "../../hooks/useViewedListingsSocket";
import { useAppContext } from "../../context/AppContext";
import { SocketProvider } from "../../context/SocketContext.jsx";

const SellerDashboard = () => {
  const { seller, listings, isLoading } = useSellerDashboardData();
  const { userData, accessToken } = useAppContext();

  const [viewedCount, setViewedCount] = useViewedListingsSocket(userData?._id);

  if (!userData || !accessToken) {
    return <div className="p-8 text-center text-gray-500">Loading dashboard...</div>;
  }

  return (
    <SocketProvider>
      <div className="min-h-screen bg-[#FDF7F2]">
        {/* ✅ Fixed TopBar */}
        <TopBar />

        {/* ✅ Add top padding to push content below TopBar */}
        <div className="pt-20 px-4 lg:px-6 flex flex-col lg:flex-row gap-4 lg:gap-6">
          {/* Sidebar */}
          <SideBar viewedCount={viewedCount} />

          {/* Main Content */}
          <div className="flex-1 flex flex-col gap-4 lg:gap-6">
            {seller && <SellerInfoCard seller={seller} />}

            {isLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {Array(12)
                  .fill(0)
                  .map((_, idx) => (
                    <div
                      key={idx}
                      className="h-64 bg-gray-200 animate-pulse rounded-2xl"
                    ></div>
                  ))}
              </div>
            ) : listings?.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {listings.slice(0, 12).map((listing) => (
                  <Link key={listing._id} to={`/seller/view-page/${listing._id}`}>
                    <ProductCard product={listing} />
                  </Link>
                ))}
              </div>
            ) : (
              <EmptyState />
            )}
          </div>
        </div>
      </div>
    </SocketProvider>
  );
};

export default SellerDashboard;
