export const SkeletonProductCard = () => {
  return (
    <div className="w-full">
      <div className="w-full h-48 bg-gray-200 animate-pulse rounded-md"></div>
      <div className="mt-2 h-4 bg-gray-200 animate-pulse rounded"></div>
      <div className="mt-1 h-4 bg-gray-200 animate-pulse rounded w-1/2"></div>
    </div>
  );
};
