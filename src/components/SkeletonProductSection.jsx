import { SkeletonProductCard } from "./SkeletonProductCard";

export const SkeletonProductSection = ({ title = "Loading..." }) => {
  return (
    <div className="px-4 py-6">
      <h2 className="text-xl font-semibold mb-4">{title}</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <SkeletonProductCard key={i} />
        ))}
      </div>
    </div>
  );
};
