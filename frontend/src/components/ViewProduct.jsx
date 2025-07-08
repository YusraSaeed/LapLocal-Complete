

"use client";

import { useState, useEffect } from "react";
import { useAppContext } from "../context/AppContext.jsx";
import TopBar from "./TopBar";

const ViewProduct = ({ listingId }) => {
  const { accessToken } = useAppContext();
  const [listing, setListing] = useState(null);
  const [selectedImage, setSelectedImage] = useState("");

  useEffect(() => {
    const fetchListing = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/v1/laptop-listing/listing/${listingId}`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
          credentials: "include",
        });
        const data = await res.json();
        if (res.ok) {
          setListing(data.data);
          if (data.data.images && data.data.images.length > 0) {
            setSelectedImage(data.data.images[0]);
          } else {
            setSelectedImage("/ProductImage-1.png");
          }
        }
      } catch (err) {
        console.error("Error fetching listing:", err);
      }
    };

    if (listingId) fetchListing();
  }, [listingId, accessToken]);

  if (!listing) return <div className="pt-20 text-center">Loading...</div>;

  const thumbnailImages = listing.images?.length > 0 
    ? listing.images 
    : ["/ProductImage-1.png", "/MacBook-Pro-16-Green.png", "/ProductImage-2.png"];

  const properties = [
    { label: "Processor", value: listing.specifications.processor },
    { label: "RAM", value: listing.specifications.ram },
    { label: "Storage", value: listing.specifications.storage },
    { label: "GPU", value: listing.specifications.gpu },
    { label: "Screen", value: listing.specifications.screen },
    { label: "Weight", value: listing.specifications.weight },
    { label: "OS", value: listing.specifications.os },
    { label: "Type", value: listing.specifications.type },
    { label: "Touch", value: listing.specifications.touch },
    { label: "GPU Type", value: listing.specifications.gpuType },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <TopBar />
      <div className="pt-20">
        <div className="max-w-5xl mx-auto p-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Images */}
            <div className="space-y-4">
              <div className="relative p-2 w-fit mx-auto">
                <div className="relative w-80 h-80 flex items-center justify-center">
                  <img
                    src={selectedImage}
                    alt="Product"
                    className="max-w-full max-h-full object-contain"
                  />
                </div>
              </div>
              <div className="flex gap-4 justify-center">
                {thumbnailImages.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(image)}
                    className={`relative w-20 h-20 rounded-lg overflow-hidden transition-all ${
                      selectedImage === image ? "ring-2 ring-lime-400 shadow-lg" : "hover:ring-2 hover:ring-gray-300"
                    }`}
                  >
                    <img src={image} alt={`Thumbnail ${index + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </div>

            {/* Details */}
            <div className="space-y-4">
              <h1 className="text-3xl font-bold text-gray-900">
                {listing.laptop?.name || "Laptop"}
              </h1>
              <div className="flex items-center gap-3">
                <span className="text-3xl font-bold text-orange-500">
                  Rs. {listing.price}
                </span>
              </div>
              <p className="text-gray-600 leading-relaxed">
                Condition: {listing.condition} | Available: {listing.quantityAvailable}
              </p>
              <div className="space-y-3">
                <h3 className="text-lg font-semibold text-gray-900">Specifications</h3>
                <div className="space-y-2">
                  {properties.map((p, i) => (
                    <div key={i} className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4">
                      <span className="text-sm font-medium text-gray-500 min-w-[120px]">{p.label}:</span>
                      <span className="text-sm text-gray-900">{p.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewProduct;

