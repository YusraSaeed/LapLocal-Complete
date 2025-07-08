import { useNavigate } from "react-router-dom";
import { FaPlus } from "react-icons/fa";

const EmptyState = ({ message = "Start Adding Your Products" }) => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center text-center p-6 bg-white rounded-xl shadow-md w-full max-w-md mx-auto mt-12">
      <div className="text-4xl text-gray-400 mb-4">
        <FaPlus />
      </div>
      <p className="text-lg text-gray-700 mb-4">{message}</p>
      <button
        onClick={() => navigate("/seller/add-product")}
        className="px-6 py-2 bg-black text-white rounded-full hover:bg-gray-800 transition"
      >
        Add Product
      </button>
    </div>
  );
};

export default EmptyState;
