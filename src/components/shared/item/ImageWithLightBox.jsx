// src/components/ImageLightbox.jsx
import { useState } from "react";

export default function ImageWithLightbox({ src, alt = "Ảnh bài thi" }) {
  const [isOpen, setIsOpen] = useState(false);

  if (!src)
    return (
      <div className="w-28 h-36 bg-gray-100 border-2 border-dashed rounded flex items-center justify-center text-xs">
        Không có ảnh
      </div>
    );

  return (
    <>
      {/* Ảnh nhỏ trong bảng */}
      <img
        src={src}
        alt={alt}
        className="w-28 h-36 object-cover rounded border border-gray-300 shadow hover:shadow-lg cursor-zoom-in transition"
        onClick={() => setIsOpen(true)}
      />

      {/* LIGHTBOX – ĐÃ SỬA ĐỂ ĐẸP NHẤT VỚI ẢNH 5:4 */}
      {isOpen && (
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/95"
          onClick={() => setIsOpen(false)}
        >
          <div className="relative">
            {/* BỎ max-w/max-h cứng, thay bằng max 90% màn hình */}
            <img
              src={src}
              alt={alt}
              className="max-w-[90vw] max-h-[90vh] object-contain rounded-xl shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            />
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-4 right-4 w-12 h-12 bg-white/20 hover:bg-white/40 backdrop-blur-sm rounded-full flex items-center justify-center text-white text-5xl font-thin"
            >
              ×
            </button>
          </div>
        </div>
      )}
    </>
  );
}
