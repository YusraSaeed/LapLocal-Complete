import React from 'react';
import Button from '../Button';

const ProductShowcase = () => {
  return (
    <div className="container mx-auto px-4 pb-16">
      <div className="bg-white rounded-3xl shadow-xl overflow-hidden max-w-5xl mx-auto">
        {/* Header with tabs */}
        <div className="flex items-center px-6 py-4 border-b overflow-x-auto">
          <div className="flex-shrink-0 mr-4">
            <img 
              src={`${import.meta.env.BASE_URL}logo.png`} 
              alt="Logo" 
              className="w-6 h-6"
            />
          </div>
          <div className="flex space-x-4">
            <Tab active>Browse Laptops</Tab>
            <Tab>Compare Models</Tab>
            <Tab>Setting</Tab>
          </div>
          <div className="ml-auto flex items-center space-x-3">
            <button className="p-2 rounded-full bg-gray-100">
              <SearchIcon />
            </button>
            <button className="p-2 rounded-full bg-gray-100">
              <BellIcon />
            </button>
            <div className="flex items-center ml-4">
              <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center mr-2">
                <img 
                  src={`${import.meta.env.BASE_URL}avatar-placeholder.png`} 
                  alt="User" 
                  className="w-8 h-8 rounded-full"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>';
                  }}
                />
              </div>
              <div className="text-left hidden sm:block">
                <div className="text-xs text-gray-500">Welcome</div>
                <div className="text-sm font-medium">User</div>
              </div>
            </div>
          </div>
        </div>

        {/* Main content */}
        <div className="flex flex-col lg:flex-row">
          {/* Sidebar filters */}
          <div className="w-full lg:w-64 p-6 border-r">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-medium">Filter</h3>
              <button className="text-orange-500 text-sm">Reset</button>
            </div>
            
            <FilterCategory title="Brand" />
            <FilterCategory title="RAM" />
            <FilterCategory title="Storage" />
            <FilterCategory title="Location" />
            <FilterCategory title="Model" />
          </div>

          {/* Main product area */}
          <div className="flex-1">
            {/* Featured product */}
            <div className="p-6 relative">
              <div className="bg-[#e8f0d0] rounded-xl p-8 flex flex-col md:flex-row relative overflow-hidden">
                <div className="w-full md:w-1/2 z-10">
                  <h2 className="text-2xl font-bold mb-2">Buy Smarter, Not Harder
Skip the shop-hopping.

                  </h2>
                  <p className="text-gray-600 mb-6">
                    Explore AI-powered listings, compare Laptops, talk to the chatbot — all in one place, all near you.
                  </p>
                  <div className="inline-block">
                    <BuyNowButton />
                  </div>
                </div>
                <div className="w-full md:w-1/2 mt-8 md:mt-0 relative">
                  <img 
                    src={`${import.meta.env.BASE_URL}laptop-hero.png`} 
                    alt="Laptop" 
                    className="w-full h-auto md:absolute md:right-0 md:bottom-0 z-10"
                  />
                </div>
              </div>
            </div>

            {/* Product list */}
            <div className="p-6 pb-8">
              <div className="flex flex-col md:flex-row md:items-center justify-center">
                <div className="flex space-x-4 mb-4 md:mb-0 overflow-x-auto pb-2">
                  <ProductCard image="MacBook-2.png" bgColor="bg-blue-100" rating="4.9" />
                  <ProductCard image="MacBook-1.png" bgColor="bg-yellow-100" rating="4.9" />
                  <ProductCard image="MacBook-3.png" bgColor="bg-purple-100" rating="4.9" />
                </div>
                {/* <h3 className="font-bold whitespace-nowrap">Most Selling Products</h3> */}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const Tab = ({ children, active }) => {
  return (
    <button className={`px-4 py-2 rounded-full text-sm whitespace-nowrap ${active ? 'bg-gray-100 font-medium' : 'text-gray-500'}`}>
      {children}
    </button>
  );
};

const FilterCategory = ({ title }) => {
  return (
    <div className="mb-4">
      <div className="flex justify-between items-center py-2 border-b">
        <span className="text-sm">{title}</span>
        <ChevronDownIcon />
      </div>
    </div>
  );
};

const BuyNowButton = () => {
  return (
    <button className="bg-black text-white px-6 py-3 rounded-full flex items-center space-x-2 transform transition-transform duration-300 hover:scale-105">
      <span>Buy Now</span>
      <div className="w-6 h-6 rounded-full bg-gray-700 flex items-center justify-center">
        <ArrowRightIcon />
      </div>
    </button>
  );
};

const ProductCard = ({ image, bgColor, rating }) => {
  return (
    <div className="w-32 h-20 rounded-lg overflow-hidden relative flex-shrink-0">
      <div className={`absolute inset-0 ${bgColor}`}></div>
      <img 
        src={`${import.meta.env.BASE_URL}${image}`} 
        alt={`MacBook`}
        className="absolute inset-0 h-full w-full object-contain object-right"
      />
      <div className="absolute top-2 left-2 flex items-center space-x-1">
        <StarIcon />
        <span className="text-xs font-medium">{rating}</span>
      </div>
    </div>
  );
};

// Icons
const SearchIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8"></circle>
    <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
  </svg>
);

const BellIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
    <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
  </svg>
);

const ChevronDownIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="6 9 12 15 18 9"></polyline>
  </svg>
);

const ArrowRightIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="5" y1="12" x2="19" y2="12"></line>
    <polyline points="12 5 19 12 12 19"></polyline>
  </svg>
);

const StarIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="orange" stroke="orange" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
  </svg>
);

export default ProductShowcase;