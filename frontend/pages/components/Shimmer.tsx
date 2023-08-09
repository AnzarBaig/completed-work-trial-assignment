import React from 'react';

const Shimmer: React.FC = () => {
  return (
    <div className="animate-pulse space-y-2">
      <div className="h-8 bg-gray-200 rounded w-1/2"></div>
      <div className="h-4 bg-gray-200 rounded"></div>
      <div className="h-4 bg-gray-200 rounded w-3/4"></div>
      <div className="h-4 bg-gray-200 rounded w-1/4"></div>
    </div>
  );
};

export default Shimmer;
