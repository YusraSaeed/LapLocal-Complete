
"use client"

import { useEffect, useRef, useState } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import TopBar from "../../components/TopBar"
import ProductCard from "../../components/ProductCard"
import { useAppContext } from "../../context/AppContext"
import { MessageCircle, X, Filter, Check } from "lucide-react"
import ChatWindow from "../../components/ChatWindow"

const BuyerSearch = () => {
  const { accessToken } = useAppContext()
  const location = useLocation()
  const navigate = useNavigate()
  const query = new URLSearchParams(location.search)
  const keyword = query.get("keyword") || ""
  const initialBrands = query.get("brand")?.split(",") || []
  const initialRAM = query.get("ram")?.split(",") || []
  const initialStorage = query.get("storage")?.split(",") || []
  const initialMin = Number.parseInt(query.get("min")) || 0
  const initialMax = Number.parseInt(query.get("max")) || 300000

  const [searchResults, setSearchResults] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState(keyword)
  const [showChatbot, setShowChatbot] = useState(false)
  const [showMobileFilters, setShowMobileFilters] = useState(false)

  const brands = ["HP", "Apple", "Dell", "Toshiba", "Lenovo", "Asus"]
  const ramOptions = ["4GB", "8GB", "16GB", "32GB"]
  const storageOptions = ["128GB SSD", "256GB SSD", "512GB SSD", "1TB SSD"]

  const [selectedBrands, setSelectedBrands] = useState(initialBrands)
  const [selectedRAM, setSelectedRAM] = useState(initialRAM)
  const [selectedStorage, setSelectedStorage] = useState(initialStorage)
  const [priceRange, setPriceRange] = useState({ min: initialMin, max: initialMax })

  const priceMinRef = useRef(initialMin)
  const priceMaxRef = useRef(initialMax)

  const updateURL = () => {
    const params = new URLSearchParams()
    if (searchTerm) params.set("keyword", searchTerm)
    if (selectedBrands.length) params.set("brand", selectedBrands.join(","))
    if (selectedRAM.length) params.set("ram", selectedRAM.join(","))
    if (selectedStorage.length) params.set("storage", selectedStorage.join(","))
    if (priceRange.min !== 0) params.set("min", priceRange.min)
    if (priceRange.max !== 300000) params.set("max", priceRange.max)
    navigate(`/buyer/search?${params.toString()}`, { replace: true })
  }

  const normalize = (val) => val?.toString().replace(/\s+/g, "").toLowerCase()

  const filteredResults = searchResults.filter((product) => {
    const specs = product.specifications || {}
    const brand = product.laptop?.brand || product.brand || ""
    const ram = specs.ram || product.ram || ""
    const storage = specs.storage || product.storage || ""
    const priceStr = product.price || ""
    const priceNum = Number.parseInt(priceStr.replace(/,/g, "")) || 0

    const ramMatch = selectedRAM.length === 0 || selectedRAM.some((r) => normalize(r) === normalize(ram))
    const storageMatch = selectedStorage.length === 0 || selectedStorage.some((s) => normalize(s) === normalize(storage))
    const brandMatch = selectedBrands.length === 0 || selectedBrands.some((b) => normalize(b) === normalize(brand))
    const priceMatch = priceNum >= priceRange.min && priceNum <= priceRange.max

    return ramMatch && storageMatch && brandMatch && priceMatch
  })

  const saveFiltersToBackend = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/v1/laptop-listing/apply-filters", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          filters: {
            brand: selectedBrands,
            ram: selectedRAM,
            storage: selectedStorage,
            priceRange,
          },
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.message)
    } catch (err) {
      console.error("❌ Failed to send filters to backend:", err.message)
    }
  }

  useEffect(() => {
    const fetchResults = async () => {
      setLoading(true)
      try {
        if (!keyword) {
          setSearchResults([])
          return
        }
        const res = await fetch(
          `http://localhost:5000/api/v1/laptop-listing/search?keyword=${encodeURIComponent(keyword)}`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${accessToken}`,
            },
            credentials: "include",
          },
        )
        const data = await res.json()
        if (!res.ok) throw new Error(data.message)
        setSearchResults(data.data)
      } catch (err) {
        console.error("Search error:", err.message)
      } finally {
        setLoading(false)
      }
    }
    fetchResults()
  }, [keyword, accessToken])

  useEffect(() => {
    const hasFilters = selectedRAM.length || selectedStorage.length || selectedBrands.length
    if (!keyword && hasFilters) {
      const applyFiltersOnly = async () => {
        setLoading(true)
        try {
          const res = await fetch("http://localhost:5000/api/v1/laptop-listing/filter-only", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${accessToken}`,
            },
            body: JSON.stringify({
              filters: {
                ram: selectedRAM,
                storage: selectedStorage,
                brand: selectedBrands,
                priceRange,
              },
            }),
          })
          const data = await res.json()
          if (!res.ok) throw new Error(data.message)
          setSearchResults(data.data)
          saveFiltersToBackend()
        } catch (err) {
          console.error("Filter-only error:", err.message)
        } finally {
          setLoading(false)
        }
      }
      applyFiltersOnly()
    }
  }, [selectedRAM, selectedStorage, selectedBrands, priceRange, keyword, accessToken])

  useEffect(() => {
    updateURL()
  }, [selectedBrands, selectedRAM, selectedStorage, priceRange, searchTerm])

  const resetFilters = () => {
    setSelectedBrands([])
    setSelectedRAM([])
    setSelectedStorage([])
    setPriceRange({ min: 0, max: 300000 })
    priceMinRef.current = 0
    priceMaxRef.current = 300000
    setSearchResults([])
    setSearchTerm("")
    navigate("/buyer/search", { replace: true })
  }

  const applyPriceRange = () => {
    setPriceRange({
      min: priceMinRef.current,
      max: priceMaxRef.current,
    })
  }

  const FilterContent = ({ onClose }) => (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-gray-900">Filters</h2>
        <div className="flex items-center space-x-2">
          <button onClick={resetFilters} className="text-sm text-orange-600 hover:underline">Reset</button>
          {onClose && (
            <button onClick={onClose} className="lg:hidden text-gray-500 hover:text-gray-700">
              <X className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>

      {/* Brand Filter */}
      <div className="mb-6">
        <h3 className="text-sm font-medium text-gray-700 mb-2">Brand</h3>
        <div className="space-y-2">
          {brands.map((brand) => (
            <label key={brand} className="flex items-center">
              <input
                type="checkbox"
                className="rounded border-gray-300 text-orange-500"
                checked={selectedBrands.includes(brand)}
                onChange={() =>
                  setSelectedBrands((prev) =>
                    prev.includes(brand) ? prev.filter((b) => b !== brand) : [...prev, brand]
                  )
                }
              />
              <span className="ml-2 text-sm">{brand}</span>
            </label>
          ))}
        </div>
      </div>

      {/* RAM Filter */}
      <div className="mb-6">
        <h3 className="text-sm font-medium text-gray-700 mb-2">RAM</h3>
        <div className="space-y-2">
          {ramOptions.map((ram) => (
            <label key={ram} className="flex items-center">
              <input
                type="checkbox"
                className="rounded border-gray-300 text-orange-500"
                checked={selectedRAM.includes(ram)}
                onChange={() =>
                  setSelectedRAM((prev) =>
                    prev.includes(ram) ? prev.filter((r) => r !== ram) : [...prev, ram]
                  )
                }
              />
              <span className="ml-2 text-sm">{ram}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Storage Filter */}
      <div className="mb-6">
        <h3 className="text-sm font-medium text-gray-700 mb-2">Storage</h3>
        <div className="space-y-2">
          {storageOptions.map((storage) => (
            <label key={storage} className="flex items-center">
              <input
                type="checkbox"
                className="rounded border-gray-300 text-orange-500"
                checked={selectedStorage.includes(storage)}
                onChange={() =>
                  setSelectedStorage((prev) =>
                    prev.includes(storage) ? prev.filter((s) => s !== storage) : [...prev, storage]
                  )
                }
              />
              <span className="ml-2 text-sm">{storage}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Price Range with Tick Button */}
      <div className="mb-6">
        <h3 className="text-sm font-medium text-gray-700 mb-2">Price Range (PKR)</h3>
        <div className="flex items-center space-x-2">
          <input
            type="number"
            defaultValue={priceRange.min}
            onChange={(e) => {
              priceMinRef.current = Number.parseInt(e.target.value) || 0
            }}
            className="w-full border border-gray-300 rounded px-2 py-1 text-sm"
          />
          <span>-</span>
          <input
            type="number"
            defaultValue={priceRange.max}
            onChange={(e) => {
              priceMaxRef.current = Number.parseInt(e.target.value) || 0
            }}
            className="w-full border border-gray-300 rounded px-2 py-1 text-sm"
          />
          <button
            onClick={applyPriceRange}
            className="text-green-600 hover:text-green-800 px-2"
            title="Apply price filter"
          >
            <Check className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-50">
      <TopBar />
      <div className="pt-20 flex">
        <div className="hidden lg:block w-80 bg-white border-r border-gray-200 h-screen sticky top-20 overflow-y-auto rounded-tl-3xl">
          <FilterContent />
        </div>

        {showMobileFilters && (
          <div className="lg:hidden fixed inset-0 z-50 bg-black bg-opacity-50">
            <div className="absolute inset-0 bg-white overflow-y-auto">
              <FilterContent onClose={() => setShowMobileFilters(false)} />
            </div>
          </div>
        )}

        <div className="flex-1 p-4 lg:p-6 bg-white lg:rounded-tr-3xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 space-y-4 sm:space-y-0">
            <h2 className="text-xl lg:text-2xl font-semibold text-gray-800">
              {searchTerm ? `Search results for "${searchTerm}"` : "Browse Laptops"}
            </h2>
            <div className="flex items-center space-x-2 relative">
              <input
                type="text"
                placeholder="Search laptops..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && searchTerm.trim()) {
                    navigate(`/buyer/search?keyword=${encodeURIComponent(searchTerm.trim())}`)
                  }
                }}
                className="px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-orange-500 pr-10 w-full sm:w-auto"
              />
              {searchTerm && (
                <button
                  onClick={resetFilters}
                  className="absolute right-16 sm:right-24 text-gray-400 hover:text-red-500"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
              <button
                onClick={() => {
                  if (searchTerm.trim()) {
                    navigate(`/buyer/search?keyword=${encodeURIComponent(searchTerm.trim())}`)
                  }
                }}
                className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-full whitespace-nowrap"
              >
                Search
              </button>
            </div>
          </div>

          {loading ? (
            <p className="text-gray-500 text-center py-12">Loading...</p>
          ) : filteredResults.length === 0 ? (
            <p className="text-gray-500 text-center py-12">Try searching products or apply filters to view products.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 lg:gap-6">
              {filteredResults.map((product) => (
                <div
                  key={product._id}
                  className="cursor-pointer"
                  onClick={() => navigate(`/buyer/listing/${product._id}`)}
                >
                  <ProductCard product={product} />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <button
        onClick={() => setShowMobileFilters(true)}
        className="lg:hidden fixed bottom-6 left-6 w-14 h-14 bg-blue-500 hover:bg-blue-600 text-white rounded-full shadow-lg flex items-center justify-center z-40"
      >
        <Filter className="w-6 h-6" />
      </button>

      <button
        onClick={() => setShowChatbot(true)}
        className="fixed bottom-6 right-6 w-14 h-14 bg-orange-500 hover:bg-orange-600 text-white rounded-full shadow-lg flex items-center justify-center z-40"
      >
        <MessageCircle className="w-6 h-6" />
      </button>

      <ChatWindow isOpen={showChatbot} onClose={() => setShowChatbot(false)} />
    </div>
  )
}

export default BuyerSearch



// fully functional