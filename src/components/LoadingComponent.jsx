import React from "react";

const LoadingComponent = () => {
  return (
    <div className="flex flex-col gap-3">
      <div className="w-full h-16 rounded-lg animate-loading opacity-30"></div>
      <div className="w-full h-16 rounded-lg animate-loading opacity-30"></div>
      <div className="w-full h-16 rounded-lg animate-loading opacity-30"></div>
    </div>
  );
};

export default LoadingComponent;
