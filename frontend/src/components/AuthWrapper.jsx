// const AuthWrapper = ({ leftContent, rightContent }) => {
//     return (
//         <div className="min-h-screen flex items-center justify-center bg-[#FDF7F2]">
//         <div className="flex w-full max-w-5xl shadow-lg rounded-2xl overflow-hidden">
//             <div className="w-1/2 bg-[#D3E584] flex flex-col justify-center items-center p-8">
//             {leftContent}
//             </div>
//             <div className="w-1/2 bg-white p-8">
//             {rightContent}
//             </div>
//         </div>
//         </div>
//     );
// };

// export default AuthWrapper;

// const AuthWrapper = ({ leftContent, rightContent }) => {
//   return (
//     <div className="min-h-screen bg-[#FDF7F2] flex justify-center items-start px-4 py-8">
//       <div className="flex flex-col md:flex-row w-full max-w-5xl rounded-2xl overflow-hidden shadow-lg">
        
//         {/* Left Panel */}
//         <div className="w-full md:w-1/2 bg-[#D3E584] p-6 sm:p-8 md:p-12 flex justify-center items-center">
//           <div className="text-center max-w-md">{leftContent}</div>
//         </div>

//         {/* Right Panel */}
//         <div className="w-full md:w-1/2 bg-white p-6 sm:p-8 md:p-12 flex justify-center items-center">
//           <div className="w-full max-w-md">{rightContent}</div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default AuthWrapper;

// const AuthWrapper = ({ leftContent, rightContent }) => {
//   return (
//     <div className="min-h-screen bg-[#FDF7F2] flex justify-center items-start px-4 py-8">
//       <div className="flex flex-col md:flex-row w-full max-w-5xl rounded-2xl overflow-hidden shadow-lg">
        
//         {/* Green Panel (Top on mobile, Left on desktop) */}
//         <div className="w-full md:w-1/2 bg-[#D3E584] p-6 sm:p-8 md:p-12 flex justify-center items-center">
//           <div className="text-center max-w-md">{leftContent}</div>
//         </div>

//         {/* White Form Panel */}
//         <div className="w-full md:w-1/2 bg-white p-6 sm:p-8 md:p-12 flex justify-center items-center">
//           <div className="w-full max-w-md">{rightContent}</div>
//         </div>
//       </div>
//     </div>
//   );
// };


// export default AuthWrapper;


const AuthWrapper = ({ leftContent, rightContent, reverseOnDesktop = false }) => {
  return (
    <div className="min-h-screen bg-[#FDF7F2] flex justify-center items-start px-4 py-8">
      <div className={`flex flex-col md:flex-row ${reverseOnDesktop ? 'md:flex-row-reverse' : ''} w-full max-w-5xl rounded-2xl overflow-hidden shadow-lg`}>
        
        {/* Green Panel */}
        <div className="w-full md:w-1/2 bg-[#D3E584] p-6 sm:p-8 md:p-12 flex justify-center items-center">
          <div className="text-center max-w-md">{leftContent}</div>
        </div>

        {/* Form Panel */}
        <div className="w-full md:w-1/2 bg-white p-6 sm:p-8 md:p-12 flex justify-center items-center">
          <div className="w-full max-w-md">{rightContent}</div>
        </div>
      </div>
    </div>
  );
};

export default AuthWrapper;


