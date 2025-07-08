

const FeatureCard = ({ icon, title, description, children }) => {
  return (
    <div className="bg-gray-100 rounded-3xl overflow-hidden relative p-6">
      <div className="flex items-center mb-4">
        <div className="bg-[#e8f0d0] p-2 rounded-full">
          <img src={icon || "/placeholder.svg"} alt={title} className="w-6 h-6 object-contain" />
        </div>
      </div>
      <h3 className="font-bold text-xl mb-2">{title}</h3>
      <p className="text-gray-600 text-sm mb-6">{description}</p>

      {/* Content area with green border */}
      <div className="bg-white rounded-xl border-20 border-[#e8f0d0] overflow-hidden">{children}</div>
    </div>
  )
}

export default FeatureCard
