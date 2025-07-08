import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { FaSearch, FaFilter } from "react-icons/fa";
import AdminSidebar from "../../components/AdminSideBar";
import SellerCards from "../../components/SellerCards";
import ConfirmDeleteModal from "../../components/ConfirmDeleteModal";
import { io } from "socket.io-client";
import toast from "react-hot-toast";

const AdminSellerPage = () => {
  const [sellers, setSellers] = useState([]);
  const [newSellerEmails, setNewSellerEmails] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filterType, setFilterType] = useState(null);
  const [showFilterMenu, setShowFilterMenu] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [sellerToDelete, setSellerToDelete] = useState(null);
  const filterRef = useRef(null);
  const navigate = useNavigate();

  const fetchSellers = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/v1/admin/sellers", {
        method: "GET",
        credentials: "include",
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Failed to fetch sellers");
      setSellers(data.data);
      localStorage.setItem("adminSellers", JSON.stringify(data.data));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const cached = localStorage.getItem("adminSellers");
    if (cached) {
      setSellers(JSON.parse(cached));
    }
    fetchSellers();

    const handleClickOutside = (e) => {
      if (filterRef.current && !filterRef.current.contains(e.target)) {
        setShowFilterMenu(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const socket = io("http://localhost:5000", {
      withCredentials: true,
    });

    socket.on("new_seller_registered", (seller) => {
      toast.success(`🆕 New seller registered: ${seller.fullName}. Updating list...`, {
        duration: 5000,
        style: { background: "#D3E584", color: "#000" },
      });

      setNewSellerEmails((prev) => [...new Set([...prev, seller.email])]);
      fetchSellers();
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const handleViewDetail = (seller) => {
    setNewSellerEmails((prev) => prev.filter((email) => email !== seller.email));
    navigate(`/admin/sellers/${seller._id}`);
  };

  const filteredSellers = sellers.filter((seller) => {
    const fullName = seller.fullName || "";
    const email = seller.email || "";
    const shopName = seller.shopName || "";

    const matchesSearch =
      fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      shopName.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesFilter =
      filterType === "verified"
        ? seller.verificationStatus === true
        : filterType === "unverified"
        ? seller.verificationStatus === false
        : true;

    return matchesSearch && matchesFilter;
  });

  const openDeleteModal = (seller) => {
    setSellerToDelete(seller);
    setDeleteModalOpen(true);
  };

  const handleDeleteSeller = async () => {
    if (!sellerToDelete) return;

    try {
      const res = await fetch(`http://localhost:5000/api/v1/admin/sellers/${sellerToDelete._id}`, {
        method: "DELETE",
        credentials: "include",
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to delete seller");

      const updated = sellers.filter((s) => s._id !== sellerToDelete._id);
      setSellers(updated);
      localStorage.setItem("adminSellers", JSON.stringify(updated));
    } catch (err) {
      alert(`❌ Error: ${err.message}`);
    } finally {
      setDeleteModalOpen(false);
      setSellerToDelete(null);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex gap-6 p-4">
        <AdminSidebar />

        <div className="flex-1">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <h1 className="text-2xl font-bold text-gray-900">Sellers</h1>

              <div className="flex items-center gap-3 relative" ref={filterRef}>
                <div className="relative">
                  <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Search here"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 pr-4 py-2 w-64 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D3E584] focus:border-transparent"
                  />
                </div>

                <button
                  onClick={() => setShowFilterMenu(!showFilterMenu)}
                  className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <FaFilter className="w-4 h-4" />
                  Filters
                </button>

                {showFilterMenu && (
                  <div className="absolute right-0 top-12 mt-1 w-40 bg-white border border-gray-200 rounded shadow-md z-10">
                    <button
                      onClick={() => {
                        setFilterType("verified");
                        setShowFilterMenu(false);
                      }}
                      className="w-full text-left px-4 py-2 hover:bg-gray-100"
                    >
                      Verified
                    </button>
                    <button
                      onClick={() => {
                        setFilterType("unverified");
                        setShowFilterMenu(false);
                      }}
                      className="w-full text-left px-4 py-2 hover:bg-gray-100"
                    >
                      Unverified
                    </button>
                    <button
                      onClick={() => {
                        setFilterType(null);
                        setShowFilterMenu(false);
                      }}
                      className="w-full text-left px-4 py-2 text-red-500 hover:bg-gray-100"
                    >
                      Clear Filters
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {loading ? (
            <div className="text-center py-20">Loading sellers...</div>
          ) : error ? (
            <div className="text-center py-20 text-red-500">{error}</div>
          ) : filteredSellers.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500">No sellers found matching your search.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredSellers.map((seller) => (
                <SellerCards
                  key={seller._id}
                  seller={{
                    ...seller,
                    name: seller.fullName,
                    location: seller.shopAddress,
                    avatar: seller.avatar || "/placeholder.svg",
                    isNew: newSellerEmails.includes(seller.email),
                  }}
                  onViewDetail={() => handleViewDetail(seller)}
                  onDelete={() => openDeleteModal(seller)}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      <ConfirmDeleteModal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={handleDeleteSeller}
        message={`Are you sure you want to delete seller "${sellerToDelete?.fullName}"? This will remove their profile and all their listings.`}
      />
    </div>
  );
};

export default AdminSellerPage;
