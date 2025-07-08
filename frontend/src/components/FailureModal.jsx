"use client";

import { FaExclamationTriangle, FaTimes } from "react-icons/fa";

const FailureModal = ({ isOpen, onClose, message = "An error occurred. Please try again." }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 transform transition-all duration-300 scale-100">
        {/* Header with close button */}
        <div className="flex justify-end p-4 pb-0">
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-full hover:bg-gray-100"
            aria-label="Close"
          >
            <FaTimes className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="px-6 pb-6 pt-2 text-center">
          {/* Failure Icon */}
          <div className="mx-auto flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-4">
            <FaExclamationTriangle className="w-8 h-8 text-red-600" />
          </div>

          {/* Failure Message */}
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Oops!</h3>
          <p className="text-gray-600 text-sm leading-relaxed">{message}</p>

          {/* Action Button */}
          <button
            onClick={onClose}
            className="mt-6 bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition-colors font-medium"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default FailureModal;
