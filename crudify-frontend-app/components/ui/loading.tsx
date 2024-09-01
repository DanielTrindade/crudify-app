import React from 'react';

const LoadingSpinner = () => {
  return (
    <div className="flex justify-center items-center h-24">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500" />
      <span className="ml-3 text-lg text-gray-700 dark:text-gray-300">Carregando...</span>
    </div>
  );
};

export default LoadingSpinner;