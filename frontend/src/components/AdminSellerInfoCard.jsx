const AdminSellerInfoCard = ({ seller, onToggleVerify }) => {
  return (
    <div className="bg-[#D3E584] rounded-2xl p-4 sm:p-6 shadow-md">
      <div className="flex flex-col lg:flex-row items-center justify-between gap-4 lg:gap-6">
        {/* Seller Basic Info */}
        <div className="flex flex-col items-center min-w-0 lg:min-w-[180px] text-center">
          <h2 className="text-lg font-semibold text-black">{seller?.fullName}</h2>
          <p className="text-sm text-gray-700">{seller?.email}</p>
        </div>

        {/* Personal Info */}
        <div className="flex-1 w-full lg:border-l lg:border-r border-gray-600 lg:px-6 px-0 text-center">
          <div className="lg:hidden border-t border-b border-gray-600 py-4 mb-4"></div>

          <h4 className="text-sm font-semibold text-gray-700 mb-2">PERSONAL INFORMATION</h4>
          <div className="text-sm text-black space-y-1">
            <p>Contact: <span className="font-semibold">{seller?.phone}</span></p>
            <p>Shop #: <span className="font-semibold">{seller?.shopNumber}</span></p>
            <p>Shop Name: {seller?.shopName}</p>
          </div>
        </div>

        {/* Shop Address and Button */}
        <div className="flex flex-col items-center gap-2 text-sm text-black text-center min-w-0 lg:min-w-[180px]">
          <div>
            <h4 className="text-sm font-semibold text-gray-700">Shop Address</h4>
            <p className="text-xs">{seller?.shopAddress}</p>
          </div>

          <button
            onClick={onToggleVerify}
            className="mt-2 bg-black text-white text-xs sm:text-sm px-4 py-1.5 rounded-full transition duration-300 hover:scale-105"
          >
            {seller?.verificationStatus ? "Unverify Seller" : "Verify Seller"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminSellerInfoCard;
