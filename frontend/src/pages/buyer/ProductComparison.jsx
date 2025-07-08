

// import { useEffect, useState } from "react";
// import { useLocation } from "react-router-dom";
// import TopBar from "../../components/TopBar";

// const ProductComparison = () => {
//   const location = useLocation();
//   const queryParams = new URLSearchParams(location.search);
//   const initialListingId = queryParams.get("listingId");

//   const [product1, setProduct1] = useState(null);
//   const [product2, setProduct2] = useState(null);
//   const [searchInput, setSearchInput] = useState("");
//   const [searchMode, setSearchMode] = useState(false);
//   const [sellerListings, setSellerListings] = useState([]);
//   const [searchResults, setSearchResults] = useState([]);

//   const fetchProduct = async (id, setter) => {
//     try {
//       const res = await fetch(`http://localhost:5000/api/v1/laptop-listing/getlisting/${id}`);
//       const data = await res.json();
//       if (res.ok) setter(data.data);
//     } catch (err) {
//       console.error("❌ Error fetching product:", err);
//     }
//   };

//   // On page load → get product1 + listings from same seller
//   useEffect(() => {
//     const init = async () => {
//       if (!initialListingId) return;

//       const res = await fetch(`http://localhost:5000/api/v1/laptop-listing/getlisting/${initialListingId}`);
//       const data = await res.json();
//       if (res.ok) {
//         const product = data.data;
//         setProduct1(product);

//         // Fetch all listings of the same seller
//         const sellerId = product?.seller?._id;
//         if (sellerId) {
//           const sellerRes = await fetch(`http://localhost:5000/api/v1/laptop-listing/getlistings/by-seller/${sellerId}`);
//           const sellerData = await sellerRes.json();
//           if (sellerRes.ok) setSellerListings(sellerData.data || []);
//         }
//       }
//     };

//     init();
//   }, [initialListingId]);

//   // Local search over seller listings
//   const handleSearchChange = (e) => {
//     const value = e.target.value;
//     setSearchInput(value);

//     if (!value || sellerListings.length === 0) {
//       setSearchResults([]);
//       return;
//     }

//     const filtered = sellerListings.filter((item) =>
//       item?.laptop?.name?.toLowerCase().includes(value.toLowerCase())
//     );

//     setSearchResults(filtered);
//   };

//   const handleSelectProduct2 = async (item) => {
//     await fetchProduct(item._id, setProduct2);
//     setSearchInput(item.laptop?.name || item.title);
//     setSearchResults([]);
//     setSearchMode(false);
//   };

//   const renderSpecs = (product) => {
//     if (!product) return [];
//     const specs = [
//       { name: "Product Name", value: product.laptop?.name || "-" },
//       { name: "Brand", value: product.laptop?.brand || "-" },
//       ...(product.specifications
//         ? Object.entries(product.specifications).map(([key, value]) => ({
//             name: key.toLowerCase(),
//             value: value || "-",
//           }))
//         : []),
//     ];
//     return specs;
//   };

//   const specs1 = renderSpecs(product1);
//   const specs2 = renderSpecs(product2);

//   return (
//     <div className="min-h-screen bg-gray-50">
//       <TopBar />

//       <div className="pt-20 px-4 sm:px-6 lg:px-8">
//         <div className="max-w-5xl mx-auto py-8">
//           <div className="bg-white rounded-lg border border-gray-200 p-6">
//             <h2 className="text-xl font-semibold text-gray-900 mb-6 text-center">Product Comparison</h2>

//             <div className="grid grid-cols-2 gap-6 mb-6">
//               {/* Product 1 */}
//               <div className="text-center">
//                 <h3 className="text-sm font-medium text-gray-900 mb-2">Product You Viewed</h3>
//                 <div className="bg-gray-100 rounded p-3 mb-3 min-h-[140px] flex items-center justify-center">
//                   <img
//                     src={product1?.images?.[0] || "/placeholder.svg"}
//                     alt="Product 1"
//                     className="w-32 h-32 object-contain"
//                   />
//                 </div>
//                 <p className="text-xs text-gray-500">Product 1</p>
//               </div>

//               {/* Product 2 */}
//               <div className="text-center">
//                 {searchMode ? (
//                   <>
//                     <input
//                       type="text"
//                       value={searchInput}
//                       onChange={handleSearchChange}
//                       placeholder="Search product name"
//                       className="w-full border px-3 py-2 rounded mb-2 text-sm"
//                       autoFocus
//                     />
//                     {searchResults.length > 0 && (
//                       <div className="border rounded p-2 max-h-40 overflow-y-auto text-left text-sm bg-white shadow z-10 relative">
//                         {searchResults.map((item) => (
//                           <div
//                             key={item._id}
//                             onClick={() => handleSelectProduct2(item)}
//                             className="cursor-pointer px-2 py-1 hover:bg-gray-100"
//                           >
//                             {item.laptop?.name || item.title}
//                           </div>
//                         ))}
//                       </div>
//                     )}
//                   </>
//                 ) : (
//                   <h3
//                     onClick={() => setSearchMode(true)}
//                     className="text-sm font-medium text-blue-600 cursor-pointer hover:underline mb-2"
//                   >
//                     {searchInput ? `Product: ${searchInput}` : "Search and Select"}
//                   </h3>
//                 )}

//                 <div className="bg-gray-100 rounded p-3 mt-1 min-h-[140px] flex items-center justify-center">
//                   <img
//                     src={product2?.images?.[0] || "/placeholder.svg"}
//                     alt="Product 2"
//                     className="w-32 h-32 object-contain"
//                   />
//                 </div>
//                 <p className="text-xs text-gray-500">Product 2</p>
//               </div>
//             </div>

//             {/* Comparison Table */}
//             <div className="border border-gray-200 rounded-lg overflow-hidden">
//               <div className="bg-gray-50 grid grid-cols-3 border-b border-gray-200 font-medium text-sm text-center">
//                 <div className="px-4 py-3 text-gray-900">Product 1</div>
//                 <div className="px-4 py-3 text-gray-900 border-x border-gray-200">Specification</div>
//                 <div className="px-4 py-3 text-gray-900">Product 2</div>
//               </div>

//               {specs1.map((spec, i) => (
//                 <div key={i} className="grid grid-cols-3 text-sm text-center border-t border-gray-100">
//                   <div className="px-4 py-2 bg-blue-50">{spec.value}</div>
//                   <div className="px-4 py-2 font-medium bg-white border-x border-gray-200">{spec.name}</div>
//                   <div className="px-4 py-2 bg-green-50">{specs2?.[i]?.value || "-"}</div>
//                 </div>
//               ))}
//             </div>

//             <div className="mt-4 text-center text-xs text-gray-500">
//               Compare specifications side by side to make the best decision.
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ProductComparison;









import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import TopBar from "../../components/TopBar";
import { useAppContext } from "../../context/AppContext";

const ProductComparison = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const initialListingId = queryParams.get("listingId");

  const [product1, setProduct1] = useState(null);
  const [product2, setProduct2] = useState(null);
  const [selectedImage1, setSelectedImage1] = useState(null);
  const [selectedImage2, setSelectedImage2] = useState(null);
  const [searchInput, setSearchInput] = useState("");
  const [searchMode, setSearchMode] = useState(false);
  const [sellerListings, setSellerListings] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const {accessToken} = useAppContext();

  const fetchProduct = async (id, setter, setImage) => {
    try {
      const res = await fetch(`http://localhost:5000/api/v1/laptop-listing/getlisting/${id}`, {
        headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
  },
  credentials: "include",
      });
      const data = await res.json();
      if (res.ok) {
        setter(data.data);
        const imgs = data.data?.images;
        if (imgs?.length) setImage(imgs[0]);
      }
    } catch (err) {
      console.error("❌ Error fetching product:", err);
    }
  };

  useEffect(() => {
    const init = async () => {
      if (!initialListingId) return;

      const res = await fetch(`http://localhost:5000/api/v1/laptop-listing/getlisting/${initialListingId}`, {
        headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
        },
        credentials: "include",
      });
      const data = await res.json();
      if (res.ok) {
        const product = data.data;
        setProduct1(product);
        setSelectedImage1(product.images?.[0] || "/ProductImage-1.png");

        // fetch all listings of same seller
        const sellerId = product?.seller?._id;
        if (sellerId) {
          const sellerRes = await fetch(`http://localhost:5000/api/v1/laptop-listing/getlistings/by-seller/${sellerId}`);
          const sellerData = await sellerRes.json();
          if (sellerRes.ok) setSellerListings(sellerData.data || []);
        }
      }
    };

    init();
  }, [initialListingId]);

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchInput(value);

    if (!value || sellerListings.length === 0) {
      setSearchResults([]);
      return;
    }

    const filtered = sellerListings.filter((item) =>
      item?.laptop?.name?.toLowerCase().includes(value.toLowerCase())
    );

    setSearchResults(filtered);
  };

  const handleSelectProduct2 = async (item) => {
    await fetchProduct(item._id, setProduct2, setSelectedImage2);
    setSearchInput(item.laptop?.name || item.title);
    setSearchResults([]);
    setSearchMode(false);
  };

  const renderSpecs = (product) => {
    if (!product) return [];
    const specs = [
      { name: "Product Name", value: product.laptop?.name || "-" },
      { name: "Brand", value: product.laptop?.brand || "-" },
      ...(product.specifications
        ? Object.entries(product.specifications).map(([key, value]) => ({
            name: key.toLowerCase(),
            value: value || "-",
          }))
        : []),
    ];
    return specs;
  };

  const specs1 = renderSpecs(product1);
  const specs2 = renderSpecs(product2);

  const renderImageBlock = (product, selectedImage, setSelectedImage, label) => (
    <>
      <div className="bg-gray-100 rounded p-3 mb-3 min-h-[140px] flex items-center justify-center">
        <img
          src={selectedImage || "/ProductImage-1.png"}
          alt={`Product ${label}`}
          className="w-32 h-32 object-contain"
        />
      </div>

      {product?.images?.length > 0 ? (
        <div className="flex gap-2 justify-center mt-2">
          {product.images.map((img, i) => (
            <button
              key={i}
              onClick={() => setSelectedImage(img)}
              className={`w-8 h-8 rounded border-2 overflow-hidden ${
                selectedImage === img ? "border-orange-500" : "border-gray-200"
              }`}
            >
              <img
                src={img}
                alt={`Thumb ${i + 1}`}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      ) : (
        <div className="text-xs text-gray-400 mt-2">No images found</div>
      )}
    </>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <TopBar />

      <div className="pt-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto py-8">
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6 text-center">Product Comparison</h2>

            <div className="grid grid-cols-2 gap-6 mb-6">
              {/* Product 1 */}
              <div className="text-center">
                <h3 className="text-sm font-medium text-gray-900 mb-2">Product You Viewed</h3>
                {renderImageBlock(product1, selectedImage1, setSelectedImage1, 1)}
                <p className="text-xs text-gray-500 mt-1">Product 1</p>
              </div>

              {/* Product 2 */}
              <div className="text-center">
                {searchMode ? (
                  <>
                    <input
                      type="text"
                      value={searchInput}
                      onChange={handleSearchChange}
                      placeholder="Search product name"
                      className="w-full border px-3 py-2 rounded mb-2 text-sm"
                      autoFocus
                    />
                    {searchResults.length > 0 && (
                      <div className="border rounded p-2 max-h-40 overflow-y-auto text-left text-sm bg-white shadow z-10 relative">
                        {searchResults.map((item) => (
                          <div
                            key={item._id}
                            onClick={() => handleSelectProduct2(item)}
                            className="cursor-pointer px-2 py-1 hover:bg-gray-100"
                          >
                            {item.laptop?.name || item.title}
                          </div>
                        ))}
                      </div>
                    )}
                  </>
                ) : (
                  <h3
                    onClick={() => setSearchMode(true)}
                    className="text-sm font-medium text-blue-600 cursor-pointer hover:underline mb-2"
                  >
                    {searchInput ? `Product: ${searchInput}` : "Search and Select"}
                  </h3>
                )}

                {renderImageBlock(product2, selectedImage2, setSelectedImage2, 2)}
                <p className="text-xs text-gray-500 mt-1">Product 2</p>
              </div>
            </div>

            {/* Comparison Table */}
            <div className="border border-gray-200 rounded-lg overflow-hidden">
              <div className="bg-gray-50 grid grid-cols-3 border-b border-gray-200 font-medium text-sm text-center">
                <div className="px-4 py-3 text-gray-900">Product 1</div>
                <div className="px-4 py-3 text-gray-900 border-x border-gray-200">Specification</div>
                <div className="px-4 py-3 text-gray-900">Product 2</div>
              </div>

              {specs1.map((spec, i) => (
                <div key={i} className="grid grid-cols-3 text-sm text-center border-t border-gray-100">
                  <div className="px-4 py-2 bg-blue-50">{spec.value}</div>
                  <div className="px-4 py-2 font-medium bg-white border-x border-gray-200">{spec.name}</div>
                  <div className="px-4 py-2 bg-green-50">{specs2?.[i]?.value || "-"}</div>
                </div>
              ))}
            </div>

            <div className="mt-4 text-center text-xs text-gray-500">
              Compare specifications side by side to make the best decision.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductComparison;
