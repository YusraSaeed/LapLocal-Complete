

import { FaPhone, FaEnvelope, FaMapMarkerAlt, FaStore, FaTrash } from "react-icons/fa";

const SellerCards = ({ seller, onViewDetail, onDelete }) => {
  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 p-4 relative">
      {seller.isNew && (
        <span className="absolute top-2 right-2 bg-[#D3E584] text-xs text-black font-semibold px-2 py-0.5 rounded-full">
          New
        </span>
      )}

      <div className="flex items-start gap-3 mb-3">
        <div className="w-10 h-10 flex-shrink-0">
          <img
            src={seller.avatar || "/placeholder.svg"}
            alt={seller.name}
            className="w-full h-full rounded-full object-cover bg-gray-200"
            onError={(e) => {
              e.target.style.display = "none";
              e.target.nextSibling.style.display = "flex";
            }}
          />
          <div className="w-10 h-10 rounded-full bg-gray-200 text-gray-700 font-medium flex items-center justify-center text-sm hidden">
            {seller.name
              .split(" ")
              .map((n) => n[0])
              .join("")}
          </div>
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-sm text-gray-900 mb-1">{seller.name}</h3>
          <p className="text-xs text-gray-600 leading-relaxed line-clamp-2">{seller.title}</p>
        </div>
      </div>

      <div className="space-y-2 mb-4">
        <div className="flex items-center gap-2 text-xs">
          <FaPhone className="w-3 h-3 text-gray-500 flex-shrink-0" />
          <span className="text-gray-700 truncate">
            <span className="font-medium">Phone:</span> {seller.phone}
          </span>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <FaEnvelope className="w-3 h-3 text-gray-500 flex-shrink-0" />
          <span className="text-gray-700 truncate">
            <span className="font-medium">Email:</span> {seller.email}
          </span>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <FaStore className="w-3 h-3 text-gray-500 flex-shrink-0" />
          <span className="text-gray-700 truncate">
            <span className="font-medium">Shop:</span> {seller.shopName}
          </span>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <FaMapMarkerAlt className="w-3 h-3 text-gray-500 flex-shrink-0" />
          <span className="text-gray-700 truncate">
            <span className="font-medium">Location:</span> {seller.location}
          </span>
        </div>
      </div>

      <div className="mt-3 space-y-2">
        <button
          onClick={() => onViewDetail?.(seller)}
          className="w-full bg-black text-white py-2 px-3 rounded-full text-xs font-medium transform transition-transform duration-300 hover:scale-105 hover:bg-gray-800"
        >
          View Detail
        </button>

        <button
          onClick={() => onDelete?.(seller)}
          className="w-full bg-red-400 text-white py-2 px-3 rounded-full text-xs font-medium transform transition-transform duration-300 hover:scale-105 hover:bg-red-700"
        >
          Delete Seller
        </button>
      </div>
    </div>
  );
};

export default SellerCards;

