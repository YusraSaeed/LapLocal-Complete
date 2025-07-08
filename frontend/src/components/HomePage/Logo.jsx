import React from 'react';

const Logo = () => {
  return (
    <div className="flex items-center">
      <img 
        src={`${import.meta.env.BASE_URL}logo.png`} 
        alt="Logo" 
        className="w-10 h-8"
      />
    </div>
  );
};

export default Logo;