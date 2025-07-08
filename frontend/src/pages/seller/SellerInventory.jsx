


"use client";

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppContext } from "../../context/AppContext";
import { SocketProvider } from "../../context/SocketContext";
import {
  FaEdit,
  FaTrash,
  FaEye,
  FaFilter,
  FaTimes,
  FaChevronLeft,
  FaChevronRight,
  FaBars,
} from "react-icons/fa";
import SideBar from "../../components/SideBar";
import LaptopIcon from "../../assets/laptop-icon.svg";
import ConfirmDeleteModal from "../../components/ConfirmDeleteModal";
import Button from "../../components/Button";
import TopBar from "../../components/TopBar";
import useViewedListingsSocket from "../../hooks/useViewedListingsSocket";


const ITEMS_PER_PAGE = 10;

const BRANDS = [
  "HP", "Dell", "Lenovo", "Acer", "Asus", "MSI", "Apple", "Razer",
  "Vero", "Toshiba", "Samsung", "Xiaomi", "Google", "LG", "Microsoft",
  "Mediacom", "Chuwi",
];
const RAMS = ["2GB", "4GB", "8GB", "12GB", "16GB"];
const STORAGES = ["32GB SSD", "64GB SSD", "128GB SSD", "256GB SSD", "512GB SSD", "1TB SSD"];

const InventoryTablePage = () => {
  const navigate = useNavigate();
  const { accessToken, userData } = useAppContext();

  const [fullInventory, setFullInventory] = useState([]);
  const [filteredInventory, setFilteredInventory] = useState([]);
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    brands: [],
    ram: [],
    storage: [],
    touch: "",
    price: [0, 200000],
  });
  const [jumpToPage, setJumpToPage] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteTargetId, setDeleteTargetId] = useState(null);
  const viewedCount = useViewedListingsSocket(userData?._id);

  const sellerId = userData?._id || "unknown_seller";
  const cacheKey = `seller_inventory_${sellerId}`;
  const pageKey = `inventory_page_${sellerId}`;

  useEffect(() => {
    if (!sellerId || !accessToken) return;

    const cached = sessionStorage.getItem(cacheKey);
    const cachedPage = sessionStorage.getItem(pageKey);
    if (cached) setFullInventory(JSON.parse(cached));
    if (cachedPage) setPage(Number(cachedPage));
    fetchInventory();
  }, [accessToken, sellerId]);

  const fetchInventory = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`http://localhost:5000/api/v1/laptop-listing/inventory/all`, {
        headers: { Authorization: `Bearer ${accessToken}` },
        credentials: "include",
      });
      if (res.status === 401) {
        // force logout
        setUserData(null);
        setAccessToken(null);
        sessionStorage.clear();
        navigate("/seller/login");
        return;
      }
      const data = await res.json();
      if (res.ok) {
        setFullInventory(data.data);
        sessionStorage.setItem(cacheKey, JSON.stringify(data.data));
      } else if (res.status === 401) {
      navigate("/seller/unauthorized");
    } else {
        console.error(data.message);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  // ✅ Combined search + filter
  useEffect(() => {
    const term = searchTerm.toLowerCase();
    const filtered = fullInventory.filter((item) => {
      const name = item?.laptop?.name?.toLowerCase() || "";
      const brand = item?.laptop?.brand || "";
      const specs = item?.specifications || {};
      const ram = specs?.ram || "";
      const storage = specs?.storage || "";
      const touch = specs?.touch || "";
      const priceNum = parseInt(item?.price?.replace(/,/g, "")) || 0;

      const matchSearch = !term || name.includes(term) || brand.toLowerCase().includes(term);
      const matchBrand = !filters.brands.length || filters.brands.includes(brand);
      const matchRam = !filters.ram.length || filters.ram.includes(ram);
      const matchStorage = !filters.storage.length || filters.storage.includes(storage);
      const matchTouch = !filters.touch || touch.toLowerCase() === filters.touch.toLowerCase();
      const matchPrice = priceNum >= filters.price[0] && priceNum <= filters.price[1];

      return matchSearch && matchBrand && matchRam && matchStorage && matchTouch && matchPrice;
    });

    setFilteredInventory(filtered);

    const maxPage = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE));
    if (page > maxPage) {
      setPage(maxPage);
      sessionStorage.setItem(pageKey, maxPage);
    }
  }, [fullInventory, searchTerm, filters]);

  const start = (page - 1) * ITEMS_PER_PAGE;
  const currentPageListings = filteredInventory.slice(start, start + ITEMS_PER_PAGE);
  const totalPages = Math.max(1, Math.ceil(filteredInventory.length / ITEMS_PER_PAGE));

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage);
      sessionStorage.setItem(pageKey, newPage);
    }
  };

  const getVisiblePages = () => {
    const maxVisible = window.innerWidth < 640 ? 3 : 5;
    let startPage = Math.max(1, page - Math.floor(maxVisible / 2));
    const endPage = Math.min(totalPages, startPage + maxVisible - 1);
    if (endPage - startPage + 1 < maxVisible) startPage = Math.max(1, endPage - maxVisible + 1);
    return Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i);
  };

  const visiblePages = getVisiblePages();
  const canGoPrevGroup = visiblePages[0] > 1;
  const canGoNextGroup = visiblePages[visiblePages.length - 1] < totalPages;

  const handleJumpToPage = (e) => {
    e.preventDefault();
    const pageNum = parseInt(jumpToPage);
    if (pageNum >= 1 && pageNum <= totalPages) {
      setPage(pageNum);
      sessionStorage.setItem(pageKey, pageNum);
      setJumpToPage("");
    }
  };

  const toggleFilter = (type, value) => {
    setFilters((prev) => {
      const list = prev[type];
      const newList = list.includes(value)
        ? list.filter((v) => v !== value)
        : [...list, value];
      return { ...prev, [type]: newList };
    });
  };

  const handlePriceChange = (e, index) => {
    const val = Number(e.target.value);
    setFilters((prev) => {
      const updated = [...prev.price];
      updated[index] = val;
      return { ...prev, price: updated };
    });
  };

  const resetFilters = () => {
    setFilters({
      brands: [],
      ram: [],
      storage: [],
      touch: "",
      price: [0, 200000],
    });
  };

  const handleDeleteClick = (id) => {
    setDeleteTargetId(id);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!deleteTargetId) return;
    try {
      const res = await fetch(`http://localhost:5000/api/v1/laptop-listing/listing/${deleteTargetId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${accessToken}` },
        credentials: "include",
      });
      const data = await res.json();
      if (res.ok) {
        const updated = fullInventory.filter((i) => i._id !== deleteTargetId);
        setFullInventory(updated);
        sessionStorage.setItem(cacheKey, JSON.stringify(updated));
      } else {
        alert(data.message || "Failed to delete");
      }
    } catch (err) {
      console.error(err);
      alert("Error deleting");
    } finally {
      setShowDeleteModal(false);
      setDeleteTargetId(null);
    }
  };

  return (
    <div className="min-h-screen bg-[#FDF7F2]">
      <TopBar/>
      <div className="flex pt-20">
        {/* <SideBar /> */}
        <SideBar viewedCount={viewedCount} />
        <div className="flex-1 min-w-0 p-4">
          <div className="flex justify-between mb-4">
            <h1 className="text-xl font-bold">Inventory</h1>
            <button onClick={() => setShowFilters(true)}
              className="flex items-center gap-2 px-4 py-2 border rounded bg-white hover:bg-gray-100">
              <FaFilter /> Filters
            </button>
          </div>

          <input
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by name or brand"
            className="w-full mb-4 p-2 border rounded"
          />

          <div className="overflow-x-auto bg-white rounded shadow">
            <table className="min-w-full text-sm">
              <thead className="bg-[#F9FAFB]">
                <tr>
                  <th className="px-4 py-3 text-left">Product</th>
                  <th className="px-4 py-3 text-left">Created</th>
                  <th className="px-4 py-3 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <tr><td colSpan="3" className="text-center py-6">Loading...</td></tr>
                ) : currentPageListings.length === 0 ? (
                  <tr><td colSpan="3" className="text-center py-6">No listings found.</td></tr>
                ) : (
                  currentPageListings.map((item) => (
                    <tr key={item._id} className="border-t hover:bg-gray-50">
                      <td className="px-4 py-4 flex items-center gap-3">
                        <img
                          src={item.images?.length ? item.images[0] : LaptopIcon}
                          alt="Laptop"
                          className="w-12 h-12 object-contain rounded bg-gray-100 p-1"
                        />
                        <span>{item.laptop?.name}</span>
                      </td>
                      <td className="px-4 py-4">{new Date(item.createdAt).toLocaleDateString()}</td>
                      <td className="px-4 py-4 flex gap-2">
                        <button onClick={() => navigate(`/seller/view-page/${item._id}`)}><FaEye /></button>
                        <button onClick={() => navigate(`/seller/update-page/${item._id}`)}><FaEdit /></button>
                        <button onClick={() => handleDeleteClick(item._id)}><FaTrash /></button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          <div className="mt-4 flex justify-between items-center">
            <span>Showing {currentPageListings.length} of {filteredInventory.length}</span>
            <form onSubmit={handleJumpToPage} className="flex items-center gap-2">
              <input
                type="number"
                min="1"
                max={totalPages}
                value={jumpToPage}
                onChange={(e) => setJumpToPage(e.target.value)}
                className="border px-2 py-1 w-16 text-center"
                placeholder="Page"
              />
              <button type="submit" className="bg-[#D3E584] px-3 py-1 rounded">Go</button>
            </form>
            <div className="flex gap-1">
              <button disabled={!canGoPrevGroup} onClick={() => handlePageChange(Math.max(1, visiblePages[0] - 5))}><FaChevronLeft /></button>
              {visiblePages.map((p) => (
                <button key={p} onClick={() => handlePageChange(p)} className={`px-2 py-1 border rounded ${p === page ? "bg-[#D3E584]" : ""}`}>{p}</button>
              ))}
              <button disabled={!canGoNextGroup} onClick={() => handlePageChange(Math.min(totalPages, visiblePages[visiblePages.length - 1] + 1))}><FaChevronRight /></button>
            </div>
          </div>
        </div>
      </div>

      {showFilters && (
        <div className="fixed right-0 top-0 h-full w-full max-w-sm bg-white shadow-lg z-50 p-4 overflow-y-auto">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-bold">Filters</h2>
            <button onClick={() => setShowFilters(false)}><FaTimes /></button>
          </div>
          <div>
            <h4 className="font-semibold mb-2">Brands</h4>
            {BRANDS.map((b) => (
              <label key={b} className="flex items-center gap-2">
                <input type="checkbox" checked={filters.brands.includes(b)} onChange={() => toggleFilter("brands", b)} />
                <span>{b}</span>
              </label>
            ))}
            <h4 className="font-semibold mt-4 mb-2">RAM</h4>
            {RAMS.map((r) => (
              <label key={r} className="flex items-center gap-2">
                <input type="checkbox" checked={filters.ram.includes(r)} onChange={() => toggleFilter("ram", r)} />
                <span>{r}</span>
              </label>
            ))}
            <h4 className="font-semibold mt-4 mb-2">Storage</h4>
            {STORAGES.map((s) => (
              <label key={s} className="flex items-center gap-2">
                <input type="checkbox" checked={filters.storage.includes(s)} onChange={() => toggleFilter("storage", s)} />
                <span>{s}</span>
              </label>
            ))}
            <h4 className="font-semibold mt-4 mb-2">Touch</h4>
            {["Yes", "No", "Any"].map((v) => (
              <label key={v} className="flex items-center gap-2">
                <input
                  type="radio"
                  name="touch"
                  checked={filters.touch === (v === "Any" ? "" : v)}
                  onChange={() => setFilters((prev) => ({ ...prev, touch: v === "Any" ? "" : v }))}
                />
                <span>{v}</span>
              </label>
            ))}
            <h4 className="font-semibold mt-4 mb-2">Price</h4>
            <div className="flex gap-2">
              <input type="number" value={filters.price[0]} onChange={(e) => handlePriceChange(e, 0)} placeholder="Min" className="border px-2 py-1 w-1/2" />
              <input type="number" value={filters.price[1]} onChange={(e) => handlePriceChange(e, 1)} placeholder="Max" className="border px-2 py-1 w-1/2" />
            </div>
            <Button onClick={resetFilters} className="mt-4 w-full">Reset Filters</Button>
          </div>
        </div>
      )}

      <ConfirmDeleteModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={confirmDelete}
        message="Are you sure you want to delete this listing?"
      />
      
    </div>
  );
};

export default InventoryTablePage;
