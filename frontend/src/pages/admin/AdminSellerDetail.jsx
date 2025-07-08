// import { useEffect, useState } from "react";
// import { useParams } from "react-router-dom";
// import TopBar from "../../components/TopBar";
// import AdminSellerInfoCard from "../../components/AdminSellerInfoCard";
// import ProductCard from "../../components/ProductCard";

// const AdminSellerDetail = () => {
//   const { id } = useParams();
//   const [seller, setSeller] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [modalOpen, setModalOpen] = useState(false);
//   const [actionType, setActionType] = useState("verify"); // "verify" or "unverify"
//   const [error, setError] = useState("");

//   const fetchSeller = async () => {
//     try {
//       const res = await fetch(`http://localhost:5000/api/v1/admin/sellers/${id}`, {
//         credentials: "include",
//       });
//       const data = await res.json();
//       if (!res.ok) throw new Error(data.message);
//       setSeller(data.data);
//     } catch (err) {
//       setError(err.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchSeller();
//   }, [id]);

//   const handleToggleVerify = () => {
//     setActionType(seller.verificationStatus ? "unverify" : "verify");
//     setModalOpen(true);
//   };

//   const confirmAction = async () => {
//     try {
//       const route = actionType === "verify" ? "approve" : "reject";
//       const res = await fetch(`http://localhost:5000/api/v1/admin/sellers/${route}/${id}`, {
//         method: "PATCH",
//         credentials: "include",
//       });

//       const data = await res.json();
//       if (!res.ok) throw new Error(data.message);
//       setSeller(data.data);
//     } catch (err) {
//       alert(err.message);
//     } finally {
//       setModalOpen(false);
//     }
//   };

//   if (loading) return <div className="p-6 text-center">Loading seller...</div>;
//   if (error) return <div className="p-6 text-center text-red-500">{error}</div>;

//   return (
//     <div>
//       <div className="max-w-6xl mx-auto px-4 py-6 space-y-6">
//         <AdminSellerInfoCard seller={seller} onToggleVerify={handleToggleVerify} />

//         <div className="bg-white rounded-xl shadow p-6">
//           <h2 className="text-xl font-bold text-gray-800 mb-4">Seller Listings</h2>
//           {seller.inventory?.length > 0 ? (
//             <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
//               {seller.inventory.map((product) => (
//                 <ProductCard key={product._id} product={product} />
//               ))}
//             </div>
//           ) : (
//             <p className="text-gray-500">No listings found.</p>
//           )}
//         </div>
//       </div>

//       {/* Confirmation Modal */}
//       {modalOpen && (
//         <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
//           <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-sm text-center">
//             <h3 className="text-lg font-bold mb-4">
//               {actionType === "verify" ? "Verify Seller" : "Unverify Seller"}?
//             </h3>
//             <p className="text-sm text-gray-600 mb-4">
//               Are you sure you want to {actionType} this seller?
//             </p>
//             <div className="flex justify-center gap-4">
//               <button
//                 onClick={() => setModalOpen(false)}
//                 className="bg-gray-300 text-black px-4 py-2 rounded"
//               >
//                 Cancel
//               </button>
//               <button
//                 onClick={confirmAction}
//                 className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800"
//               >
//                 Confirm
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default AdminSellerDetail;



import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import TopBar from "../../components/TopBar";
import AdminSellerInfoCard from "../../components/AdminSellerInfoCard";
import ProductCard from "../../components/ProductCard";

const AdminSellerDetail = () => {
  const { id } = useParams();
  const [seller, setSeller] = useState(null);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [actionType, setActionType] = useState("verify"); // "verify" or "unverify"
  const [error, setError] = useState("");
  const [cachedInventory, setCachedInventory] = useState([]); // ✅ cache inventory

  useEffect(() => {
    fetchSeller();
  }, [id]);

  const fetchSeller = async () => {
    try {
      const res = await fetch(`http://localhost:5000/api/v1/admin/sellers/${id}`, {
        credentials: "include",
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      setSeller(data.data);
      setCachedInventory(data.data.inventory); // ✅ cache inventory once
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleVerify = () => {
    const nextAction = seller.verificationStatus ? "unverify" : "verify";
    setActionType(nextAction);
    setModalOpen(true);
  };

  const confirmAction = async () => {
    try {
      const route = actionType === "verify" ? "approve" : "reject";
      const res = await fetch(`http://localhost:5000/api/v1/admin/sellers/${route}/${id}`, {
        method: "PATCH",
        credentials: "include",
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      setSeller((prev) => ({
        ...prev,
        verificationStatus: data.data.verificationStatus,
      }));

      setModalOpen(false);
    } catch (err) {
      alert(err.message);
    }
  };

  if (loading) return <div className="p-6 text-center">Loading seller...</div>;
  if (error) return <div className="p-6 text-center text-red-500">{error}</div>;

  return (
    <div>
      <div className="max-w-6xl mx-auto px-4 py-6 space-y-6">
        <AdminSellerInfoCard
          seller={seller}
          onToggleVerify={handleToggleVerify}
        />

        <div className="bg-white rounded-xl shadow p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Seller Listings</h2>
          {cachedInventory.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {cachedInventory.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          ) : (
            <p className="text-gray-500">No listings found.</p>
          )}
        </div>
      </div>

      {/* Confirmation Modal */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-sm text-center">
            <h3 className="text-lg font-bold mb-4">
              {actionType === "verify" ? "Verify Seller" : "Unverify Seller"}?
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              Are you sure you want to {actionType} this seller?
            </p>
            <div className="flex justify-center gap-4">
              <button
                onClick={() => setModalOpen(false)}
                className="bg-gray-300 text-black px-4 py-2 rounded"
              >
                Cancel
              </button>
              <button
                onClick={confirmAction}
                className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminSellerDetail;
