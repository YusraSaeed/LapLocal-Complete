// "use client"

// import { useEffect, useState } from "react"
// import { MessageCircle } from "lucide-react"
// import TopBar from "../../components/TopBar"
// import ProductCard from "../../components/ProductCard"
// import ChatWindow from "../../components/ChatWindow"
// import { useAppContext } from "../../context/AppContext"
// import { useNavigate } from "react-router-dom"

// const BuyerDashboard = () => {
//   const {
//     userData,
//     accessToken,
//     setUserData,
//     setUserRole
//   } = useAppContext()

//   const [recommendedProducts, setRecommendedProducts] = useState([])
//   const [searchTerm, setSearchTerm] = useState("")
//   const [loadingRecommendations, setLoadingRecommendations] = useState(true)
//   const [showChatbot, setShowChatbot] = useState(false)

//   const navigate = useNavigate()

//   // ✅ Fetch user if logged in via Google (cookie-based)
//   useEffect(() => {
//     const init = async () => {
//       if (userData && userData._id) return

//       try {
//         const res = await fetch("http://localhost:5000/api/v1/buyers/me", {
//           method: "GET",
//           credentials: "include", // important for cookies
//         })

//         const data = await res.json()
//         if (!res.ok) throw new Error(data.message || "Failed to fetch user")

//         setUserData(data.data)
//         setUserRole("buyer")
//       } catch (err) {
//         console.error("⚠️ Could not fetch user:", err.message)
//         navigate("/buyer/login")
//       }
//     }

//     init()
//   }, [])

//   // ✅ Fetch AI recommendations
//   useEffect(() => {
//     if (!userData?._id) return

//     const fetchRecommendations = async () => {
//       setLoadingRecommendations(true)
//       try {
//         const res = await fetch(
//           `http://localhost:5000/api/v1/buyers/${userData._id}/recommendations`,
//           {
//             method: "GET",
//             headers: {
//               "Content-Type": "application/json",
//               ...(accessToken && { Authorization: `Bearer ${accessToken}` }),
//             },
//             credentials: "include",
//           }
//         )
//         const data = await res.json()
//         if (!res.ok) throw new Error(data.message || "Failed to fetch recommendations")
//         setRecommendedProducts(data.data)
//       } catch (err) {
//         console.error("🚨 Recommendation error:", err.message)
//       } finally {
//         setLoadingRecommendations(false)
//       }
//     }

//     fetchRecommendations()
//   }, [userData, accessToken])

//   const handleViewProduct = (listingId) => {
//     navigate(`/buyer/listing/${listingId}`)
//   }

//   return (
//     <div className="min-h-screen bg-gray-50">
//       <TopBar />

//       <div className="pt-20 px-6 md:px-12 lg:px-24">
//         <div
//           className="relative rounded-3xl p-6 md:p-8 mb-8 overflow-hidden"
//           style={{ background: "linear-gradient(135deg, #E8F5B8 0%, #D4E89B 100%)" }}
//         >
//           <div className="flex flex-col md:flex-row items-start justify-between">
//             <div className="relative z-10 w-full md:max-w-md mb-6 md:mb-0">
//               <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
//                 Buy your dream <br /> Laptop Today!
//               </h1>
//               <p className="text-gray-700 mb-6 text-base">
//                 Discover unbeatable deals and dive away in the laptop of your dreams today!
//               </p>
//             </div>
//             <div className="w-full md:w-1/2 flex justify-center md:justify-end">
//               <img
//                 src="/laptop-hero.png"
//                 alt="Laptop Hero"
//                 className="max-h-48 w-auto object-contain"
//               />
//             </div>
//           </div>
//         </div>

//         {/* Heading + Search */}
//         <div className="flex items-center justify-between mb-4">
//           <h2 className="text-2xl font-semibold text-gray-800">
//             AI Recommended Products
//           </h2>
//           <div className="flex items-center space-x-2">
//             <input
//               type="text"
//               placeholder="Search laptops..."
//               value={searchTerm}
//               onChange={(e) => setSearchTerm(e.target.value)}
//               onKeyDown={(e) => {
//                 if (e.key === "Enter" && searchTerm.trim()) {
//                   navigate(`/buyer/search?keyword=${encodeURIComponent(searchTerm.trim())}`)
//                 }
//               }}
//               className="px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-orange-500"
//             />
//             <button
//               onClick={() => {
//                 if (searchTerm.trim()) {
//                   navigate(`/buyer/search?keyword=${encodeURIComponent(searchTerm.trim())}`)
//                 }
//               }}
//               className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-full"
//             >
//               Search
//             </button>
//           </div>
//         </div>

//         {/* Products Grid or Status */}
//         <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
//           {loadingRecommendations ? (
//             <div className="col-span-full text-center py-12">
//               <div className="flex justify-center space-x-2">
//                 <span className="animate-bounce w-3 h-3 bg-orange-500 rounded-full"></span>
//                 <span className="animate-bounce w-3 h-3 bg-orange-500 rounded-full delay-150"></span>
//                 <span className="animate-bounce w-3 h-3 bg-orange-500 rounded-full delay-300"></span>
//               </div>
//               <p className="mt-4 text-gray-500 text-lg font-medium">Loading...</p>
//             </div>
//           ) : recommendedProducts.length > 0 ? (
//             recommendedProducts.map((product) => (
//               <div
//                 onClick={() => handleViewProduct(product._id)}
//                 className="cursor-pointer"
//                 key={product._id}
//               >
//                 <ProductCard product={product} />
//               </div>
//             ))
//           ) : (
//             <div className="text-gray-600 col-span-full text-center py-8 px-4 text-lg font-medium">
//               Start viewing a few laptops to help us recommend the best ones for you!
//             </div>
//           )}
//         </div>
//       </div>

//       {/* Chatbot Icon */}
//       <button
//         onClick={() => setShowChatbot(true)}
//         className="fixed bottom-6 right-6 w-14 h-14 bg-orange-500 hover:bg-orange-600 text-white rounded-full shadow-lg flex items-center justify-center z-50"
//       >
//         <MessageCircle className="w-6 h-6" />
//       </button>

//       <ChatWindow isOpen={showChatbot} onClose={() => setShowChatbot(false)} />
//     </div>
//   )
// }

// export default BuyerDashboard


// responsives check 
"use client"

import { useEffect, useState } from "react"
import { MessageCircle } from "lucide-react"
import TopBar from "../../components/TopBar"
import ProductCard from "../../components/ProductCard"
import ChatWindow from "../../components/ChatWindow"
import { useAppContext } from "../../context/AppContext"
import { useNavigate } from "react-router-dom"

const BuyerDashboard = () => {
  const { userData, accessToken, setUserData, setUserRole } = useAppContext()
  const [recommendedProducts, setRecommendedProducts] = useState([])
  const [searchTerm, setSearchTerm] = useState("")
  const [loadingRecommendations, setLoadingRecommendations] = useState(true)
  const [showChatbot, setShowChatbot] = useState(false)
  const navigate = useNavigate()

  // ✅ Fetch user if logged in via Google (cookie-based)
  useEffect(() => {
    const init = async () => {
      if (userData && userData._id) return
      try {
        const res = await fetch("http://localhost:5000/api/v1/buyers/me", {
          method: "GET",
          credentials: "include", // important for cookies
        })
        const data = await res.json()
        if (!res.ok) throw new Error(data.message || "Failed to fetch user")
        setUserData(data.data)
        setUserRole("buyer")
      } catch (err) {
        console.error("⚠️ Could not fetch user:", err.message)
        navigate("/buyer/login")
      }
    }
    init()
  }, [])

  // ✅ Fetch AI recommendations
  useEffect(() => {
    if (!userData?._id) return
    const fetchRecommendations = async () => {
      setLoadingRecommendations(true)
      try {
        const res = await fetch(`http://localhost:5000/api/v1/buyers/${userData._id}/recommendations`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            ...(accessToken && { Authorization: `Bearer ${accessToken}` }),
          },
          credentials: "include",
        })
        const data = await res.json()
        if (!res.ok) throw new Error(data.message || "Failed to fetch recommendations")
        setRecommendedProducts(data.data)
      } catch (err) {
        console.error("🚨 Recommendation error:", err.message)
      } finally {
        setLoadingRecommendations(false)
      }
    }
    fetchRecommendations()
  }, [userData, accessToken])

  const handleViewProduct = (listingId) => {
    navigate(`/buyer/listing/${listingId}`)
  }

  const handleSearch = () => {
    if (searchTerm.trim()) {
      navigate(`/buyer/search?keyword=${encodeURIComponent(searchTerm.trim())}`)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <TopBar />

      {/* Main Content - Responsive padding */}
      <div className="pt-16 sm:pt-20 px-4 sm:px-6 md:px-8 lg:px-12 xl:px-24">
        {/* Hero Section - Responsive */}
        <div
          className="relative rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8 mb-6 sm:mb-8 overflow-hidden"
          style={{ background: "linear-gradient(135deg, #E8F5B8 0%, #D4E89B 100%)" }}
        >
          <div className="flex flex-col lg:flex-row items-start justify-between gap-4 lg:gap-8">
            <div className="relative z-10 w-full lg:max-w-md">
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-3 sm:mb-4 leading-tight">
                Buy your dream <br className="hidden sm:block" />
                <span className="sm:hidden">dream </span>Laptop Today!
              </h1>
              <p className="text-gray-700 mb-4 sm:mb-6 text-sm sm:text-base leading-relaxed">
                Discover unbeatable deals and dive away in the laptop of your dreams today!
              </p>
            </div>
            <div className="w-full lg:w-1/2 flex justify-center lg:justify-end">
              <img
                src="/laptop-hero.png"
                alt="Laptop Hero"
                className="max-h-32 sm:max-h-40 md:max-h-48 w-auto object-contain"
              />
            </div>
          </div>
        </div>

        {/* Heading + Search - Responsive */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 text-center sm:text-left">
            AI Recommended Products
          </h2>

          {/* Search Section - Mobile First */}
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-2">
            <input
              type="text"
              placeholder="Search laptops..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && searchTerm.trim()) {
                  handleSearch()
                }
              }}
              className="w-full sm:w-64 px-4 py-2.5 sm:py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm sm:text-base"
            />
            <button
              onClick={handleSearch}
              className="px-6 py-2.5 sm:py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-full font-medium transition-colors text-sm sm:text-base whitespace-nowrap"
            >
              Search
            </button>
          </div>
        </div>

        {/* Products Grid - Enhanced Responsive */}
        <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 pb-20">
          {loadingRecommendations ? (
            <div className="col-span-full text-center py-12">
              <div className="flex justify-center space-x-2">
                <span className="animate-bounce w-2 h-2 sm:w-3 sm:h-3 bg-orange-500 rounded-full"></span>
                <span className="animate-bounce w-2 h-2 sm:w-3 sm:h-3 bg-orange-500 rounded-full delay-150"></span>
                <span className="animate-bounce w-2 h-2 sm:w-3 sm:h-3 bg-orange-500 rounded-full delay-300"></span>
              </div>
              <p className="mt-4 text-gray-500 text-base sm:text-lg font-medium">Loading...</p>
            </div>
          ) : recommendedProducts.length > 0 ? (
            recommendedProducts.map((product) => (
              <div
                onClick={() => handleViewProduct(product._id)}
                className="cursor-pointer transform hover:scale-105 transition-transform duration-200"
                key={product._id}
              >
                <ProductCard product={product} />
              </div>
            ))
          ) : (
            <div className="text-gray-600 col-span-full text-center py-8 px-4">
              <p className="text-base sm:text-lg font-medium mb-2">No recommendations yet!</p>
              <p className="text-sm sm:text-base text-gray-500">
                Start viewing a few laptops to help us recommend the best ones for you!
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Chatbot Icon - Responsive */}
      <button
        onClick={() => setShowChatbot(true)}
        className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 w-12 h-12 sm:w-14 sm:h-14 bg-orange-500 hover:bg-orange-600 text-white rounded-full shadow-lg flex items-center justify-center z-50 transition-all duration-200 hover:scale-110"
      >
        <MessageCircle className="w-5 h-5 sm:w-6 sm:h-6" />
      </button>

      <ChatWindow isOpen={showChatbot} onClose={() => setShowChatbot(false)} />
    </div>
  )
}

export default BuyerDashboard
