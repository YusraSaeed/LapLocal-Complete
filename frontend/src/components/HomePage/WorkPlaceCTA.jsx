const WorkplaceCTA = () => {
  return (
    <div className="relative w-full px-4 py-16">
      <div className="max-w-7xl mx-auto">
        {/* Main CTA Container matching Figma design exactly */}
        <div
          className="relative overflow-hidden rounded-[2rem] px-8 py-16 md:px-16 md:py-20"
          style={{
            background: "linear-gradient(90deg, #CAE28D 0%, #22c55e 30%, #16a34a 60%, #000000 100%)",
          }}
        >
          {/* Content */}
          <div className="relative z-10 text-center max-w-5xl mx-auto">
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-8 leading-tight">
              Ready to take your workplace connections to the next level?
            </h2>

            <p className="text-lg md:text-xl lg:text-2xl text-white/90 leading-relaxed max-w-4xl mx-auto">
              Join Laplocal today to build meaningful relationships and create a more connected, fulfilling work
              environment. Sign up now and unlock endless possibilities.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default WorkplaceCTA
