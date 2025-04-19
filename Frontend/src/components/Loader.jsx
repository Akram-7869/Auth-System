import React from 'react';

const Loader = ({ className = '' }) => {
  return (
    <div className={`min-h-screen bg-gray-100 flex items-center justify-center ${className}`}>
      <div
        className="animate-spin rounded-full h-16 w-16 border-t-4 border-indigo-600 border-solid border-r-transparent"
        role="status"
        aria-label="Loading"
      ></div>
    </div>
  );
};

export default Loader;
