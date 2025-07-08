const BigPictureSection = () => {
  const features = [
    {
      icon: "/Home-Chatbot-Icon.png",
      title: "AI Chatbot",
      description: "Smart laptop advice in seconds — just tell the bot what you need.",
    },
    {
      icon: "/Home-Network-Icon.png",
      title: "Networking & Collaboration",
      description: "Verified sellers, direct contact — local deals, zero hassle.",
    },
    {
      icon: "/Home-Product-Icon.png",
      title: "Premium Products",
      description: "Browse premium laptops — work, gaming, or everyday use",
    },
    {
      icon: "/Home-Support-Icon.png",
      title: "Customer Support",
      description: "Need help? We're here if you face any issues with the system!",
    },
  ]

  return (
    <section className="py-4 px-6 sm:px-8 lg:px-22 bg-white">
      <div className="max-w-6xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-start">
          {/* Left Content */}
          <div className="space-y-8">
            <div className="space-y-4">
              <h2 className="text-3xl sm:text-4xl lg:text-3xl font-bold text-gray-900 leading-tight">
                Bring the big picture into view
              </h2>
              <p className="text-sm text-gray-600 leading-relaxed">
                LapLocal brings the entire laptop market near you — together in one platform. With AI guidance, smart search, and local seller connections, we simplify buying like never before. We save you time, and finds you the best with just a few clicks!
              </p>
            </div>

            {/* Features Grid with Reduced Size */}
            <div className="grid sm:grid-cols-2 gap-3">
              {features.map((feature, index) => (
                <div
                  key={index}
                  className="p-4 border border-gray-200 rounded-lg bg-white shadow-sm hover:shadow-md transition-shadow duration-200"
                >
                  <div className="space-y-2">
                    <div className="w-12 h-6 rounded-full flex items-center justify-center">
                      <img
                        src={feature.icon || "/placeholder.svg"}
                        alt={`${feature.title} icon`}
                        className="w-10 h-10 rounded-full"
                      />
                    </div>
                    <div className="space-y-1">
                      <h3 className="text-base font-semibold text-gray-900">{feature.title}</h3>
                      <p className="text-xs text-gray-600 leading-relaxed">{feature.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Illustration with Figma Gradient Background */}
          <div className="relative">
            {/* Green Bars Decorative Element */}
            <div className="absolute -top-12 -right-12 w-32 h-32 opacity-60 z-0">
              <img
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/green-bars-eQ5dNtFgOhW5mHgNbkDIVQfUkIwxG1.png"
                alt="Decorative green bars"
                className="w-full h-full"
              />
            </div>

            {/* Main Container with Figma Gradient Background */}
            <div
              className="relative rounded-3xl p-6 shadow-lg min-h-[400px]"
              style={{
                background: "linear-gradient(135deg, #CAE28D 20%, #CAE28D 60%)",
              }}
            >
              {/* White Inner Container for Chatbot */}
              <div className="bg-white rounded-2xl p-4 shadow-sm">
                {/* Chatbot Interface */}
                <div className="relative z-10">
                  <img
                    src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Home-Chatbot-3wIWDzc5V8tX2WhaECig3UCE86XGyO.png"
                    alt="AI Chatbot Interface"
                    className="w-full h-auto max-w-sm mx-auto"
                  />
                </div>
              </div>

              {/* MacBook Product Card - Positioned further down at bottom-left corner */}
              <div className="absolute -bottom-2 -left-4 bg-white rounded-xl p-3 shadow-lg w-52 z-20">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-1">
                    <span className="text-orange-500 text-sm">★</span>
                    <span className="text-xs font-medium text-gray-700">4.9</span>
                  </div>
                </div>

                <div className="mb-2">
                  <img
                    src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/MacBook-Pro-16-Green-zhs10wYMcIA2rc21rzO33kruaJYxz4.png"
                    alt="MacBook Pro 16 Green"
                    className="w-full h-auto"
                  />
                </div>

                <div className="space-y-1">
                  <h3 className="text-sm font-bold text-gray-900">MacBook 16 Pro</h3>
                  <div className="text-xs text-gray-600 space-y-0.5">
                    <div>
                      Model: <span className="font-medium">Latest</span>
                    </div>
                    <div>
                      Brand: <span className="font-medium">Apple</span>
                    </div>
                    <div>
                      Color: <span className="font-medium">Green</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2">
                    <span className="text-lg font-bold text-orange-500">Rs. 125,000</span>
                    <button className="w-6 h-6 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200 transition-colors">
                      <span className="text-gray-600 text-xs">🛒</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Additional Decorative Elements */}
              <div className="absolute top-4 right-4 w-12 h-12 bg-white bg-opacity-20 rounded-full"></div>
              <div className="absolute bottom-16 right-6 w-8 h-8 bg-white bg-opacity-15 rounded-full"></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default BigPictureSection
