"use client";
import { useState } from "react";

interface ProductGalleryProps {
  coverImage: string | null;
  images: string[];
  productName?: string;
}

export function ProductGallery({ coverImage, images, productName = "产品图片" }: ProductGalleryProps) {
  const allImages = coverImage ? [coverImage, ...images.filter((img) => img !== coverImage)] : images;
  const displayImages = allImages.length > 0 ? allImages : [null];
  const [currentIndex, setCurrentIndex] = useState(0);

  return (
    <div>
      {/* Main Image */}
      <div className="aspect-[4/3] bg-gray-100 rounded-xl overflow-hidden mb-4">
        {displayImages[currentIndex] ? (
          <img
            src={displayImages[currentIndex]!}
            alt={productName}
            className="w-full h-full object-contain"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-300">
            <svg className="w-24 h-24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
        )}
      </div>

      {/* Thumbnails */}
      {displayImages.length > 1 && (
        <div className="flex gap-2 overflow-x-auto">
          {displayImages.map((img, i) => (
            <button
              key={i}
              onClick={() => setCurrentIndex(i)}
              className={`w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 border-2 transition-colors ${
                i === currentIndex ? "border-primary-500" : "border-transparent hover:border-gray-300"
              }`}
            >
              {img ? (
                <img src={img} alt="" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full bg-gray-200" />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
