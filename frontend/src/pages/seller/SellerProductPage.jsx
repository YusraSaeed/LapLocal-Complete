"use client";

import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Upload, ChevronDown } from "lucide-react";
import TopBar from "../../components/TopBar";
import InputField from "../../components/InputField";
import Button from "../../components/Button";
import SuccessModal from "../../components/SuccessModal";
import FailureModal from "../../components/FailureModal";
import { useAppContext } from "../../context/AppContext";

const SellerProductAdd = () => {
  const navigate = useNavigate();
  const { accessToken, userData } = useAppContext();

  const [formData, setFormData] = useState({
    productName: "",
    brand: "",
    price: "",
    processor: "",
    ram: "",
    storage: "",
    gpu: "",
    screen: "",
    weight: "",
    os: "",
    type: "",
    touch: "",
    gpuIntegrated: "",
    condition: "",
    quantityAvailable: "",
  });

  const [selectedFiles, setSelectedFiles] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showFailureModal, setShowFailureModal] = useState(false);
  const fileInputRef = useRef();

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // const handleFilesSelected = (e) => {
  //   const files = Array.from(e.target.files).slice(0, 5);
  //   setSelectedFiles(files);
  // };
  const handleFilesSelected = (e) => {
  const files = Array.from(e.target.files);

  if (files.length > 5) {
    setShowFailureModal(true);
    return;
  }

  setSelectedFiles(files);
};


  const handleUploadClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const form = new FormData();
      form.append("name", formData.productName);
      form.append("brand", formData.brand);
      form.append("price", formData.price);
      form.append("condition", formData.condition);
      form.append("quantityAvailable", formData.quantityAvailable);

      form.append("specifications.processor", formData.processor);
      form.append("specifications.ram", formData.ram);
      form.append("specifications.storage", formData.storage);
      form.append("specifications.gpu", formData.gpu);
      form.append("specifications.screen", formData.screen);
      form.append("specifications.weight", formData.weight);
      form.append("specifications.os", formData.os);
      form.append("specifications.type", formData.type);
      form.append("specifications.touch", formData.touch);
      form.append("specifications.gpuType", formData.gpuIntegrated);

      selectedFiles.forEach((file) => form.append("images", file));

      const res = await fetch(
        `http://localhost:5000/api/v1/laptop-listing/listing`,
        {
          method: "POST",
          headers: { Authorization: `Bearer ${accessToken}` },
          credentials: "include",
          body: form,
        }
      );
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
        // ✅ Update local sessionStorage if needed:
        const sellerId = userData?._id || "unknown";
        const key = `seller_inventory_${sellerId}`;
        const cached = sessionStorage.getItem(key);
        if (cached) {
          const arr = JSON.parse(cached);
          const updatedArr = [data.data, ...arr];
          sessionStorage.setItem(key, JSON.stringify(updatedArr));
        }

        setShowSuccessModal(true);
      } else {
        console.error(data);
        setShowFailureModal(true);
      }
    } catch (err) {
      console.error(err);
      setShowFailureModal(true);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <TopBar />

      <SuccessModal
        isOpen={showSuccessModal}
        message="Product added successfully!"
        onClose={() => navigate("/seller/inventory")}
      />

      <FailureModal
        isOpen={showFailureModal}
        message="Adding product failed. Please check all fields and try again. Make sure you are not uploading more than 5 images"
        onClose={() => setShowFailureModal(false)}
      />

      <div className="pt-20">
        <div className="p-6 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* LEFT: Images */}
          <div className="space-y-6">
            <div className="bg-white rounded-lg p-6 border border-gray-200">
              <h3 className="text-lg font-semibold mb-4">Product Images</h3>
              <div className="flex gap-2 flex-wrap mb-4">
                {selectedFiles.map((file, idx) => (
                  <p
                    key={idx}
                    className="text-xs bg-gray-200 px-2 py-1 rounded"
                  >
                    {file.name}
                  </p>
                ))}
              </div>

              <div
                onClick={handleUploadClick}
                className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center cursor-pointer hover:bg-gray-50"
              >
                <div className="flex justify-center mb-4">
                  <div className="w-20 h-20 bg-gray-100 rounded-lg border-2 border-gray-300 flex items-center justify-center">
                    <Upload className="h-8 w-8 text-gray-400" />
                  </div>
                </div>
                <p className="text-orange-500 text-sm font-medium">
                  Add up to 5 images
                </p>
                <p className="text-gray-500 text-xs mt-2">
                  At least one image is required to add a product.
                </p>
              </div>
              <input
                type="file"
                ref={fileInputRef}
                style={{ display: "none" }}
                accept="image/*"
                multiple
                onChange={handleFilesSelected}
              />
            </div>
          </div>

          {/* RIGHT: Details */}
          <div className="space-y-6">
            <div className="bg-white rounded-lg p-6 border border-gray-200">
              <h3 className="text-lg font-semibold mb-6">Product Details</h3>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Product Name
                    </label>
                    <InputField
                      value={formData.productName}
                      onChange={(e) =>
                        handleInputChange("productName", e.target.value)
                      }
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Brand
                    </label>
                    <InputField
                      value={formData.brand}
                      onChange={(e) =>
                        handleInputChange("brand", e.target.value)
                      }
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Price
                    </label>
                    <InputField
                      value={formData.price}
                      onChange={(e) =>
                        handleInputChange("price", e.target.value)
                      }
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Condition
                    </label>
                    <InputField
                      value={formData.condition}
                      onChange={(e) =>
                        handleInputChange("condition", e.target.value)
                      }
                    />
                  </div>
                </div>

                {[ 
                  ["processor", "Processor"],
                  ["ram", "RAM"],
                  ["storage", "Storage"],
                  ["gpu", "GPU"],
                  ["screen", "Screen"],
                  ["weight", "Weight"],
                  ["os", "OS"],
                  ["type", "Type"],
                ].map(([key, label]) => (
                  <div key={key}>
                    <label className="block text-sm font-medium mb-2">
                      {label}
                    </label>
                    <InputField
                      value={formData[key]}
                      onChange={(e) => handleInputChange(key, e.target.value)}
                    />
                  </div>
                ))}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {["touch", "gpuIntegrated"].map((key) => (
                    <div key={key}>
                      <label className="block text-sm font-medium mb-2">
                        {key === "touch" ? "Touch" : "GPU Integrated"}
                      </label>
                      <div className="relative">
                        <select
                          value={formData[key]}
                          onChange={(e) =>
                            handleInputChange(key, e.target.value)
                          }
                          className="w-full p-2.5 border border-gray-300 rounded-md focus:outline-none bg-white"
                        >
                          <option value=""></option>
                          <option value="Yes">Yes</option>
                          <option value="No">No</option>
                        </select>
                        <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                      </div>
                    </div>
                  ))}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Quantity Available
                    </label>
                    <InputField
                      value={formData.quantityAvailable}
                      onChange={(e) =>
                        handleInputChange("quantityAvailable", e.target.value)
                      }
                    />
                  </div>
                </div>

                <div className="pt-4">
                  <Button type="submit" isLoading={isLoading}>
                    Add Product
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SellerProductAdd;
