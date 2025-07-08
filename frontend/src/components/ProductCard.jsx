// import LaptopIcon from "../assets/laptop-icon.svg"

// const imageOptions = [
//   "/MacBook-Pro-16-Blue.png",
//   "/MacBook-Pro-16-Yellow.png",
//   "/MacBook-Pro-16-Green.png",
//   "/MacBook-Pro-16-Purple.png",
// ]

// const ProductCard = ({ product }) => {
//   const laptop = product?.laptop || {}
//   const name = laptop?.name || "Laptop";
//   const brand = laptop?.brand || "";
//   const price = product?.price || "";
//   const condition = product?.condition || "";


//   const randomImage = imageOptions[Math.floor(Math.random() * imageOptions.length)] || LaptopIcon

//    const imageSrc =
//     product?.images?.length > 0 ? product.images[0] : randomImage;

//   return (
//     <div className="bg-white rounded-2xl shadow-sm hover:shadow-lg p-4 w-full transition-all duration-300 transform hover:scale-[1.02] border border-gray-100">
//       <div className="bg-gray-50 rounded-xl p-4 flex justify-center items-center h-40 mb-4">
//         <img
//           src={imageSrc}
//           alt={laptop?.name || "Laptop"}
//           className="max-h-28 w-auto object-contain"
//         />


//       </div>

//       <div className="space-y-3">
//         <h3 className="text-base font-semibold text-gray-900 leading-tight line-clamp-2">
//           {laptop?.name || "Untitled"}
//         </h3>

//         <div className="text-sm text-gray-600">
//           <div className="flex items-center gap-2">
//             <span className="font-medium text-gray-700">Brand:</span>
//             <span className="text-gray-600">{laptop?.brand || "N/A"}</span>
//           </div>
//         </div>

//         <div className="pt-2 border-t border-gray-100">
//           <p className="text-orange-500 font-bold text-lg">Rs. {product?.price?.toLocaleString() || "N/A"}</p>
//         </div>
//       </div>
//     </div>
//   )
// }

// export default ProductCard





import LaptopIcon from "../assets/laptop-icon.svg"

const imageOptions = [
  "/MacBook-Pro-16-Blue.png",
  "/MacBook-Pro-16-Yellow.png",
  "/MacBook-Pro-16-Green.png",
  "/MacBook-Pro-16-Purple.png",
]

const ProductCard = ({ product }) => {
  const laptop = product?.laptop || {}
  const name = laptop?.name || "Laptop"
  const brand = laptop?.brand || ""
  const price = product?.price || ""
  const condition = product?.condition || ""
  const randomImage = imageOptions[Math.floor(Math.random() * imageOptions.length)] || LaptopIcon

  const imageSrc = product?.images?.length > 0 ? product.images[0] : randomImage

  return (
    <div className="bg-white rounded-xl sm:rounded-2xl shadow-sm hover:shadow-lg p-3 sm:p-4 w-full transition-all duration-300 transform hover:scale-[1.02] border border-gray-100">
      {/* Image Container - Responsive */}
      <div className="bg-gray-50 rounded-lg sm:rounded-xl p-3 sm:p-4 flex justify-center items-center h-32 sm:h-40 mb-3 sm:mb-4">
        <img
          src={imageSrc || "/placeholder.svg"}
          alt={laptop?.name || "Laptop"}
          className="max-h-20 sm:max-h-28 w-auto object-contain"
        />
      </div>

      {/* Content - Responsive */}
      <div className="space-y-2 sm:space-y-3">
        <h3 className="text-sm sm:text-base font-semibold text-gray-900 leading-tight line-clamp-2">
          {laptop?.name || "Untitled"}
        </h3>

        <div className="text-xs sm:text-sm text-gray-600">
          <div className="flex items-center gap-1 sm:gap-2">
            <span className="font-medium text-gray-700">Brand:</span>
            <span className="text-gray-600">{laptop?.brand || "N/A"}</span>
          </div>
        </div>

        <div className="pt-2 border-t border-gray-100">
          <p className="text-orange-500 font-bold text-base sm:text-lg">
            Rs. {product?.price?.toLocaleString() || "N/A"}
          </p>
        </div>
      </div>
    </div>
  )
}

export default ProductCard

