// "use client"

// import { useState, useEffect } from "react"
// import TopBar from "../../components/TopBar"
// import SideBar from "../../components/SideBar"
// import { useAppContext } from "../../context/AppContext"

// const SellerViewedListings = () => {
//   const { accessToken, userData } = useAppContext()
//   const [viewedListings, setViewedListings] = useState([])
//   const [loading, setLoading] = useState(true)

//   useEffect(() => {
//     const fetchViewedListings = async () => {
//       if (!userData?._id) return;

//       setLoading(true)
//       try {
//         const response = await fetch(
//           `http://localhost:5000/api/v1/sellers/${userData._id}/viewed-listings`,
//           {
//             headers: {
//               "Content-Type": "application/json",
//               Authorization: `Bearer ${accessToken}`,
//             },
//             credentials: "include",
//           }
//         )

//         if (response.ok) {
//           const data = await response.json()
//           setViewedListings(data || [])
//         } else {
//           console.error("Failed to fetch viewed listings")
//         }
//       } catch (error) {
//         console.error("Error fetching viewed listings:", error)
//       } finally {
//         setLoading(false)
//       }
//     }

//     fetchViewedListings()
//   }, [accessToken, userData])

//   return (
//     <div className="min-h-screen bg-gray-50">
//       <TopBar />
//       <div className="pt-20 px-4 lg:px-6">
//         <div className="max-w-7xl mx-auto">
//           <div className="flex gap-6">
//             <SideBar viewedCount={viewedListings.length} />
//             <div className="flex-1 bg-white rounded-xl shadow-sm border border-gray-100 min-h-[600px]">
//               <div className="p-6">
//                 <div className="flex items-center justify-between mb-6">
//                   <h1 className="text-2xl font-semibold text-gray-900">Viewed Listings</h1>
//                 </div>

//                 <div className="overflow-x-auto">
//                   <table className="w-full">
//                     <thead>
//                       <tr className="border-b border-gray-200">
//                         <th className="text-left py-4 px-2 font-medium text-gray-700">Product</th>
//                         <th className="text-left py-4 px-2 font-medium text-gray-700">Viewer</th>
//                         <th className="text-left py-4 px-2 font-medium text-gray-700">Time</th>
//                       </tr>
//                     </thead>
//                     <tbody>
//                       {loading ? (
//                         <tr>
//                           <td colSpan="4" className="text-center py-12">
//                             <div className="flex items-center justify-center">
//                               <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-orange-500"></div>
//                               <span className="ml-2 text-gray-500">Loading...</span>
//                             </div>
//                           </td>
//                         </tr>
//                       ) : viewedListings.length === 0 ? (
//                         <tr>
//                           <td colSpan="4" className="text-center py-12 text-gray-500">
//                             <p className="text-lg mb-2">No viewed listings found.</p>
//                             <p className="text-sm">Your product views will appear here.</p>
//                           </td>
//                         </tr>
//                       ) : (
//                         viewedListings.map((item) => (
//                           <tr key={item._id} className="border-b border-gray-100 hover:bg-gray-50">
//                             <td className="py-4 px-2">
//                               <div className="flex items-center space-x-3">
//                                 <div className="w-12 h-12 bg-gray-200 rounded-lg overflow-hidden">
//                                   {item.listing?.image ? (
//                                     <img
//                                       src={item.listing.image}
//                                       alt={item.listing.title}
//                                       className="w-full h-full object-cover"
//                                     />
//                                   ) : (
//                                     <div className="w-full h-full bg-gray-300 flex items-center justify-center">
//                                       <span className="text-gray-500 text-xs">No Image</span>
//                                     </div>
//                                   )}
//                                 </div>
//                                 <div>
//                                   <p className="font-medium text-gray-900">
//                                     {item.listing?.title || "Product Title"}
//                                   </p>
//                                   <p className="text-sm text-gray-500">
//                                     ₹{item.listing?.price || "N/A"}
//                                   </p>
//                                 </div>
//                               </div>
//                             </td>
//                             <td className="py-4 px-2">
//                               <div className="flex items-center space-x-2">
//                                 <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
//                                   <span className="text-xs font-medium text-gray-600">
//                                     {item.buyer?.name?.charAt(0) || "U"}
//                                   </span>
//                                 </div>
//                                 <span className="text-sm text-gray-700">
//                                   {item.buyer?.name || "Unknown"}
//                                 </span>
//                               </div>
//                             </td>
//                             <td className="py-4 px-2 text-sm text-gray-600">
//                               {new Date(item.viewedAt).toLocaleString()}
//                             </td>
//                           </tr>
//                         ))
//                       )}
//                     </tbody>
//                   </table>
//                 </div>

//                 {!loading && viewedListings.length > 0 && (
//                   <div className="mt-6 text-sm text-gray-500">
//                     Showing {viewedListings.length} viewed listing{viewedListings.length !== 1 ? "s" : ""}
//                   </div>
//                 )}
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   )
// }

// export default SellerViewedListings






"use client"

import { useState, useEffect } from "react"
import TopBar from "../../components/TopBar"
import SideBar from "../../components/SideBar"
import { useAppContext } from "../../context/AppContext"

const SellerViewedListings = () => {
  const { accessToken, userData } = useAppContext()
  const [viewedListings, setViewedListings] = useState([])
  const [loading, setLoading] = useState(true)


  // useEffect(() => {
  //   const fetchViewedListings = async () => {
  //     if (!userData?._id) return;

  //     setLoading(true)
  //     try {
  //       const response = await fetch(
  //         `http://localhost:5000/api/v1/sellers/viewed-listings`,
  //         {
  //           headers: {
  //             "Content-Type": "application/json",
  //             Authorization: `Bearer ${accessToken}`,
  //           },
  //           credentials: "include",
  //         }
  //       )

  //       if (response.ok) {
  //         const result = await response.json()
  //         setViewedListings(result.data || []) // ✅ updated to extract from `data`
  //       } else {
  //         console.error("Failed to fetch viewed listings")
  //       }
  //     } catch (error) {
  //       console.error("Error fetching viewed listings:", error)
  //     } finally {
  //       setLoading(false)
  //     }
  //   }

  //   fetchViewedListings()
  // }, [accessToken, userData])

  useEffect(() => {
  const fetchViewedListings = async () => {
    if (!userData?._id) return;

    setLoading(true);
    try {
      // ✅ Mark as read
      await fetch("http://localhost:5000/api/v1/sellers/viewed-listings/mark-read", {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        credentials: "include",
      });

      // ✅ Fetch updated data
      const response = await fetch(
        `http://localhost:5000/api/v1/sellers/viewed-listings`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          credentials: "include",
        }
      );

      if (response.ok) {
        const result = await response.json();
        setViewedListings(result.data || []);
        setViewedCount(0); // ✅ reset live badge
      }
    } catch (error) {
      console.error("Error fetching viewed listings:", error);
    } finally {
      setLoading(false);
    }
  };

  fetchViewedListings();
}, [accessToken, userData, setViewedCount]);


  return (
    <div className="min-h-screen bg-gray-50">
      <TopBar />
      <div className="pt-20 px-4 lg:px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex gap-6">
            <SideBar viewedCount={viewedListings.length} />
            <div className="flex-1 bg-white rounded-xl shadow-sm border border-gray-100 min-h-[600px]">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h1 className="text-2xl font-semibold text-gray-900">Viewed Listings</h1>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="text-left py-4 px-2 font-medium text-gray-700">Product</th>
                        <th className="text-left py-4 px-2 font-medium text-gray-700">Viewer</th>
                        <th className="text-left py-4 px-2 font-medium text-gray-700">Time</th>
                      </tr>
                    </thead>
                    <tbody>
                      {loading ? (
                        <tr>
                          <td colSpan="3" className="text-center py-12">
                            <div className="flex items-center justify-center">
                              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-orange-500"></div>
                              <span className="ml-2 text-gray-500">Loading...</span>
                            </div>
                          </td>
                        </tr>
                      ) : viewedListings.length === 0 ? (
                        <tr>
                          <td colSpan="3" className="text-center py-12 text-gray-500">
                            <p className="text-lg mb-2">No viewed listings found.</p>
                            <p className="text-sm">Your product views will appear here.</p>
                          </td>
                        </tr>
                      ) : (
                        viewedListings.map((item) => (
                          <tr key={item._id} className="border-b border-gray-100 hover:bg-gray-50">
                            <td className="py-4 px-2">
                              <div className="flex items-center space-x-3">
                                <div className="w-12 h-12 bg-gray-200 rounded-lg overflow-hidden">
                                  {item.listing?.images?.[0] ? (
                                    <img
                                      src={item.listing.images[0]}
                                      alt={item.listing.laptop?.name || "Laptop"}
                                      className="w-full h-full object-cover"
                                    />
                                  ) : (
                                    <div className="w-full h-full bg-gray-300 flex items-center justify-center">
                                      <span className="text-gray-500 text-xs">No Image</span>
                                    </div>
                                  )}
                                </div>
                                <div>
                                  <p className="font-medium text-gray-900">
                                    {item.listing?.laptop?.name || "Unnamed Laptop"}
                                  </p>
                                  <p className="text-sm text-gray-500">
                                    ₹{item.listing?.price || "N/A"}
                                  </p>
                                </div>
                              </div>
                            </td>
                            <td className="py-4 px-2">
                              <div className="flex items-center space-x-2">
                                <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                                  <span className="text-xs font-medium text-gray-600">
                                    {item.buyer?.fullName?.charAt(0) || "U"}
                                  </span>
                                </div>
                                <span className="text-sm text-gray-700">
                                  {item.buyer?.fullName || "Unknown"}
                                </span>
                              </div>
                            </td>
                            <td className="py-4 px-2 text-sm text-gray-600">
                              {new Date(item.viewedAt).toLocaleString()}
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>

                {!loading && viewedListings.length > 0 && (
                  <div className="mt-6 text-sm text-gray-500">
                    Showing {viewedListings.length} viewed listing{viewedListings.length !== 1 ? "s" : ""}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SellerViewedListings
