import FeatureCard from "./FeatureCard"

const Card = () => {
  return (
    <div className="container mx-auto px-6 md:px-12 lg:px-24 max-w-7xl pb-32">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 relative z-10">
        {/* Filter Card */}
        <div className="relative">
          {/* Green bars closer to the card */}
          <img
            src="/green-bars.png"
            alt="Decorative green bars"
            className="absolute -left-6 -top-6 w-24 h-24 md:w-28 md:h-28 z-0"
            
          />
          <FeatureCard
            icon="/user-switch.png"
            title="Seamless Filter"
            description="Fine-tune your search using smart filters — brand, budget, RAM, storage, location, and more — to find your ideal laptop fast."
          >
            <div className="p-4 relative z-10">
              <img
                src="/LP-Card1.png"
                alt="Filter UI"
                className="w-full h-auto"
              />
            </div>
          </FeatureCard>
        </div>

        {/* Communication Card */}
        <FeatureCard
          icon="/arrow-expand.png"
          title="Communication"
          description="Each listing shows the shop address, contact number, and seller verification badge — so you can reach out confidently."
        >
          <div className="p-4">
            <img
              src="/LP-Card2.png"
              alt="Seller Info"
              className="w-full h-auto"
            />
          </div>
        </FeatureCard>

        {/* Products Card */}
        <FeatureCard
          icon="/workflow-square-10.png"
          title="Top Brands Products"
          description="Explore listings from trusted local sellers — featuring all your favorite brands with real-time availability."
        >
          <div className="p-4">
            <img
              src="/LP-Card3.png"
              alt="Most Selling Products"
              className="w-full h-auto"
            />
          </div>
        </FeatureCard>
      </div>
    </div>
  )
}

export default Card
