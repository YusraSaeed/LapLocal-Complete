
// filter with search works

import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Star, MapPin, Phone, Mail, User } from "lucide-react";
import TopBar from "../../components/TopBar";
import ProductCard from "../../components/ProductCard";
import { useAppContext } from "../../context/AppContext";


const BuyerProductView = () => {
  const { listingId } = useParams();
  const navigate = useNavigate();
  const { accessToken } = useAppContext();
  const [product, setProduct] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [searchInput, setSearchInput] = useState("");
  const [similarProducts, setSimilarProducts] = useState([]);

  const placeholderImages = [
    "/ProductImage-1.png",
    "/ProductImage-2.png",
    "/MacBook-Pro-16-Green.png",
  ];

  // Fetch main product details
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/v1/laptop-listing/getlisting/${listingId}`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          credentials: "include",
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.message || "Failed to fetch product");

        const imgs = data.data?.images?.length ? data.data.images : placeholderImages;
        setProduct({ ...data.data, images: imgs });
        setSelectedImage(imgs[0]);
      } catch (error) {
        console.error("Error fetching product:", error);
      }
    };

    if (listingId && accessToken) {
      setProduct(null); // clear UI before fetch
      fetchProduct();
    }
  }, [listingId, accessToken]);

  // Fetch similar products from recommender system
  useEffect(() => {
    const fetchSimilar = async () => {
      try {
        const res = await fetch("http://localhost:8000/recommender/recommend", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ listing_ids: [listingId], n_recommendations: 4 }),
        });

        const data = await res.json();
        if (!res.ok || !data.recommendations) throw new Error("Invalid recommender response");

        // Now fetch full details for these listings
        const listingRes = await fetch("http://localhost:5000/api/v1/laptop-listing/bulk", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          credentials: "include",
          body: JSON.stringify({ listingIds: data.recommendations }),
        });

        const finalData = await listingRes.json();
        if (!listingRes.ok) throw new Error(finalData.message || "Failed to load similar listings");

        setSimilarProducts(finalData.data);
      } catch (err) {
        console.error("❌ Similar fetch error:", err.message);
        setSimilarProducts([]);
      }
    };

    if (listingId && accessToken) {
      fetchSimilar();
    }
  }, [listingId, accessToken]);

  const handleSearchChange = (value) => setSearchInput(value);
  const handleSearchClear = () => setSearchInput("");
  const handleViewProduct = (id) => navigate(`/buyer/listing/${id}`);

  return (
    <div className="min-h-screen bg-gray-50">
      <TopBar onInputChange={handleSearchChange} inputValue={searchInput} onClear={handleSearchClear} />

      <div className="pt-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {product ? (
            <div className="px-6 lg:px-12">
              {/* Product Detail Section */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-12">
                {/* Left - Images */}
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
                    {product.images?.map((img, idx) => (
                      <button
                        key={idx}
                        onClick={() => setSelectedImage(img)}
                        className={`relative w-20 h-20 rounded-lg overflow-hidden transition-all ${
                          selectedImage === img ? "ring-2 ring-lime-400 shadow-lg" : "hover:ring-2 hover:ring-gray-300"
                        }`}
                      >
                        <img src={img} alt="thumb" className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                </div>

                {/* Right - Product Info */}
                <div className="space-y-6">
                  <div>
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">{product.laptop?.name}</h1>
                    <div className="flex items-center space-x-2 mb-3">
                      <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className="w-4 h-4 fill-orange-400 text-orange-400" />
                        ))}
                      </div>
                      <span className="text-sm text-gray-600">(5)</span>
                    </div>

                    <div className="flex items-center space-x-3 mb-4">
                      <span className="text-2xl font-bold text-orange-500">Rs. {product.price.toLocaleString()}</span>
                      {product.originalPrice && (
                        <>
                          <span className="text-lg text-gray-400 line-through">Rs. {product.originalPrice.toLocaleString()}</span>
                          <span className="bg-orange-100 text-orange-800 px-2 py-1 rounded text-xs font-medium">-21%</span>
                        </>
                      )}
                    </div>

                    <p className="text-sm text-gray-600 mb-4">{product.description || "No description available."}</p>
                  </div>

                  <div className="space-y-3">
                    <h3 className="text-base font-semibold text-gray-900">Properties</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Model:</span>
                        <span className="font-medium">{product.laptop?.name}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Brand:</span>
                        <span className="font-medium">{product.laptop?.brand}</span>
                      </div>
                      {Object.entries(product.specifications || {}).map(([key, val]) => (
                        <div key={key} className="flex justify-between">
                          <span className="text-gray-600 capitalize">{key}:</span>
                          <span className="font-medium text-xs">{val}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* <button className="w-full bg-gray-800 text-white py-2.5 rounded-full text-sm font-medium transform transition-transform duration-300 hover:scale-105 hover:bg-gray-800 disabled:opacity-70 disabled:cursor-not-allowed">
                    Contact Seller
                  </button> */}

                  <button className="w-full bg-gray-800 text-white py-2.5 rounded-full text-sm font-medium transform transition-transform duration-300 hover:scale-105 hover:bg-gray-800 disabled:opacity-70 disabled:cursor-not-allowed"
                   onClick={() => navigate(`/buyer/compare?listingId=${listingId}`)}
                  >
                    Compare
                  </button>

                  <div className="rounded-2xl p-4"
                  style={{ background: "linear-gradient(135deg, #E8F5B8 0%, #D4E89B 100%)" }}>
                
                    <h3 className="text-base font-semibold text-gray-900 mb-3">Seller Info</h3>
                    <div className="space-y-3 text-sm">
                      {/* <div className="flex items-center space-x-3">
                        <User className="w-4 h-4 text-green-700" />
                        <span>{product.seller?.fullName}</span>
                      </div> */}
                      <div className="flex items-center space-x-3">
  <User className="w-4 h-4 text-green-700" />
  <span>{product.seller?.fullName}</span>
  {product.seller?.verificationStatus ? (
    <span className="ml-2 px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-700">
      Verified Seller
    </span>
  ) : (
    <span className="ml-2 px-2 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-700">
      Unverified Seller
    </span>
  )}
</div>

                      <div className="flex items-center space-x-3">
                        <MapPin className="w-4 h-4 text-green-700" />
                        <span>{product.seller?.shopAddress}</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <Mail className="w-4 h-4 text-green-700" />
                        <span>{product.seller?.email || "shop@email.com"}</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <Phone className="w-4 h-4 text-green-700" />
                        <span>{product.seller?.phone}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Similar Products */}
              {similarProducts.length > 0 && (
                <div className="mb-12">
                  <h2 className="text-xl font-bold text-gray-800 mb-4">Similar Products</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
                    {similarProducts.map((prod) => (
                      <div key={prod._id} onClick={() => handleViewProduct(prod._id)} className="cursor-pointer">
                        <ProductCard product={prod} />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center text-gray-500 text-lg py-20">Loading product...</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BuyerProductView;
