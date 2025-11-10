"use client";

export default function Loading() {
  return (
    <div className="max-w-6xl mx-auto p-8">
      {/* Page title skeleton */}
      <div className="h-8 w-48 bg-gray-200 rounded-md animate-pulse mb-8"></div>

      {/* Filter/Search bar placeholder */}
      <div className="h-10 bg-gray-200 rounded-md animate-pulse mb-6"></div>

      {/* Book cards skeleton grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="bg-white shadow-md rounded-2xl p-4 flex flex-col animate-pulse"
          >
            <div className="w-full h-64 bg-gray-200 rounded-lg mb-4"></div>
            <div className="h-5 bg-gray-200 rounded-md w-3/4 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded-md w-1/2 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded-md w-2/3"></div>
          </div>
        ))}
      </div>
    </div>
  );
}
