import React from 'react';

const Shimmer: React.FC = () => {
  return (
    <div className="animate-pulse space-y-2">
      <div className="flex items-center justify-center">
        <div className="h-14 w-14 bg-gray-200 rounded-lg"></div>
      </div>
      <div className="h-6 bg-gray-200 rounded w-5/6"></div>
      <div className="h-6 bg-gray-200 rounded w-2/3"></div>
      <div className="h-6 bg-gray-200 rounded w-4/5"></div>
      <div className="h-12 bg-gray-200 rounded w-full"></div>
      <div className="h-6 bg-gray-200 rounded-full w-1/2"></div>
    </div>
  );
};

export default Shimmer;
