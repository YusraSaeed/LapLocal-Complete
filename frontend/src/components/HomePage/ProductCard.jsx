const ProductItem = ({ logo, name, percentage }) => (
  <div className="flex items-center mb-3">
    <div className="w-4 h-4 rounded-full border border-gray-300 mr-3"></div>
    <div className="bg-gray-100 rounded-full flex items-center justify-between flex-1 pr-2">
      <div className="flex items-center">
        <div className="bg-white rounded-full p-1 mr-2">{logo}</div>
        <span className="font-medium">{name}</span>
      </div>
      <span className="text-orange-400">{percentage}</span>
    </div>
  </div>
)

const ProductsCard = () => {
  return (
    <div className="p-4">
      <h4 className="font-bold text-lg mb-4">Most Selling Products</h4>

      <div className="bg-gray-100 p-4 rounded-xl">
        <ProductItem
          logo={
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M12 20.94c1.5 0 2.75 1.06 4 1.06 3 0 6-8 6-12.22A4.91 4.91 0 0 0 17 5c-2.22 0-4 1.44-5 2-1-.56-2.78-2-5-2a4.9 4.9 0 0 0-5 4.78C2 14 5 22 8 22c1.25 0 2.5-1.06 4-1.06Z" />
              <path d="M10 2c1 .5 2 2 2 5" />
            </svg>
          }
          name="Apple"
          percentage="43%"
        />

        <ProductItem logo={<div className="w-5 h-5 rounded-full bg-red-600"></div>} name="Lenovo" percentage="43%" />

        <div className="flex items-center">
          <div className="w-4 h-4 rounded-full border border-gray-300 mr-3"></div>
          <div className="bg-gray-100 rounded-full flex items-center justify-between flex-1 pr-2">
            <div className="flex items-center">
              <div className="bg-white rounded-full p-1 mr-2">
                <div className="w-5 h-5 rounded-full bg-red-400"></div>
              </div>
              <span className="font-medium">Dell</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProductsCard
