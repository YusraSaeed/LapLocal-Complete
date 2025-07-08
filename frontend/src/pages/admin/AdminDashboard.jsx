// import AdminSidebar from "../../components/AdminSidebar"
// import TopBar from "../../components/TopBar"
// import { FaUsers, FaStore, FaCheckCircle, FaTimesCircle, FaBoxOpen } from "react-icons/fa"

// const AdminDashboard = () => {
//   // Sample data
//   const stats = [
//     {
//       title: "Total Users",
//       value: "1,247",
//       icon: FaUsers,
//     },
//     {
//       title: "Total Sellers",
//       value: "89",
//       icon: FaStore,
//     },
//     {
//       title: "Verified Sellers",
//       value: "67",
//       icon: FaCheckCircle,
//     },
//     {
//       title: "Unverified Sellers",
//       value: "22",
//       icon: FaTimesCircle,
//     },
//     {
//       title: "Total Listings",
//       value: "3,456",
//       icon: FaBoxOpen,
//     },
//   ]

//   const StatCard = ({ title, value, icon: Icon }) => (
//     <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-200">
//       <div className="flex items-center justify-between">
//         <div>
//           <p className="text-gray-600 text-sm font-medium mb-1">{title}</p>
//           <p className="text-2xl font-bold text-gray-900">{value}</p>
//         </div>
//         <div className="w-12 h-12 bg-[#D3E584] rounded-lg flex items-center justify-center">
//           <Icon className="w-6 h-6 text-gray-700" />
//         </div>
//       </div>
//     </div>
//   )

//   return (
//     <div className="min-h-screen bg-gray-50">
//       {/* Top Bar */}
//       <TopBar />

//       {/* Main Content with top padding for fixed header */}
//       <div className="pt-20">
//         <div className="flex gap-6 p-4 lg:p-6">
//           {/* Sidebar */}
//           <AdminSidebar />

//           {/* Main Content */}
//           <div className="flex-1 lg:ml-0 ml-0">
//             {/* Header */}
//             <div className="mb-8 lg:ml-0 ml-16">
//               <h1 className="text-2xl font-bold text-gray-900 mb-2">Dashboard</h1>
//               <p className="text-gray-600">Welcome back! Here's your platform overview.</p>
//             </div>

//             {/* Stats Grid */}
//             <div className="lg:ml-0 ml-16">
//               <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 mb-8">
//                 {stats.map((stat, index) => (
//                   <StatCard key={index} title={stat.title} value={stat.value} icon={stat.icon} />
//                 ))}
//               </div>

//               {/* Seller Status Card - Now takes full width and more prominent */}
//               <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-100">
//                 <h3 className="text-xl font-semibold text-gray-900 mb-6">Seller Verification Status</h3>
//                 <div className="max-w-2xl">
//                   <div className="flex justify-between items-center mb-4">
//                     <span className="text-gray-600 font-medium">Verification Progress</span>
//                     <span className="text-lg font-bold text-gray-900">75% Complete</span>
//                   </div>
//                   <div className="w-full bg-gray-200 rounded-full h-3 mb-6">
//                     <div
//                       className="bg-[#D3E584] h-3 rounded-full transition-all duration-500"
//                       style={{ width: "75%" }}
//                     ></div>
//                   </div>
//                   <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
//                     <div className="text-center p-4 bg-green-50 rounded-lg border border-green-100">
//                       <div className="text-2xl font-bold text-green-600 mb-1">67</div>
//                       <div className="text-sm text-green-700 font-medium">Verified Sellers</div>
//                     </div>
//                     <div className="text-center p-4 bg-orange-50 rounded-lg border border-orange-100">
//                       <div className="text-2xl font-bold text-orange-600 mb-1">22</div>
//                       <div className="text-sm text-orange-700 font-medium">Pending Verification</div>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   )
// }

// export default AdminDashboard


import { useEffect, useState } from "react";
import AdminSidebar from "../../components/AdminSidebar";
import TopBar from "../../components/TopBar";
import { FaUsers, FaStore, FaCheckCircle, FaTimesCircle, FaBoxOpen } from "react-icons/fa";

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchStats = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/v1/admin/dashboard-stats", {
        credentials: "include",
      });
      const data = await res.json();
      if (data.success) {
        setStats([
          { title: "Total Users", value: data.data.totalBuyers, icon: FaUsers },
          { title: "Total Sellers", value: data.data.totalSellers, icon: FaStore },
          { title: "Verified Sellers", value: data.data.verifiedSellers, icon: FaCheckCircle },
          { title: "Unverified Sellers", value: data.data.unverifiedSellers, icon: FaTimesCircle },
          { title: "Total Listings", value: data.data.totalListings, icon: FaBoxOpen },
        ]);
      }
    } catch (err) {
      console.error("Error fetching dashboard stats:", err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const StatCard = ({ title, value, icon: Icon }) => (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-200">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-600 text-sm font-medium mb-1">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
        </div>
        <div className="w-12 h-12 bg-[#D3E584] rounded-lg flex items-center justify-center">
          <Icon className="w-6 h-6 text-gray-700" />
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <TopBar />

      <div className="pt-20">
        <div className="flex gap-6 p-4 lg:p-6">
          <AdminSidebar />

          <div className="flex-1 lg:ml-0 ml-0">
            <div className="mb-8 lg:ml-0 ml-16">
              <h1 className="text-2xl font-bold text-gray-900 mb-2">Dashboard</h1>
              <p className="text-gray-600">Welcome back! Here's your platform overview.</p>
            </div>

            <div className="lg:ml-0 ml-16">
              {loading ? (
                <div className="text-center py-8 text-gray-600">Loading statistics...</div>
              ) : (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 mb-8">
                    {stats.map((stat, index) => (
                      <StatCard key={index} title={stat.title} value={stat.value} icon={stat.icon} />
                    ))}
                  </div>

                  <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-100">
                    <h3 className="text-xl font-semibold text-gray-900 mb-6">Seller Verification Status</h3>
                    <div className="max-w-2xl">
                      <div className="flex justify-between items-center mb-4">
                        <span className="text-gray-600 font-medium">Verification Progress</span>
                        <span className="text-lg font-bold text-gray-900">
                          {stats[2]?.value && stats[1]?.value
                            ? `${Math.round((stats[2].value / stats[1].value) * 100)}% Complete`
                            : "N/A"}
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-3 mb-6">
                        <div
                          className="bg-[#D3E584] h-3 rounded-full transition-all duration-500"
                          style={{
                            width: `${
                              stats[2]?.value && stats[1]?.value
                                ? `${(stats[2].value / stats[1].value) * 100}%`
                                : "0%"
                            }`,
                          }}
                        ></div>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <div className="text-center p-4 bg-green-50 rounded-lg border border-green-100">
                          <div className="text-2xl font-bold text-green-600 mb-1">{stats[2]?.value || 0}</div>
                          <div className="text-sm text-green-700 font-medium">Verified Sellers</div>
                        </div>
                        <div className="text-center p-4 bg-orange-50 rounded-lg border border-orange-100">
                          <div className="text-2xl font-bold text-orange-600 mb-1">{stats[3]?.value || 0}</div>
                          <div className="text-sm text-orange-700 font-medium">Pending Verification</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
