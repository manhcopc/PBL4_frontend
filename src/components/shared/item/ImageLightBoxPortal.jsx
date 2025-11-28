// src/components/ImageLightbox.jsx
import { useState, useEffect } from "react";
import { createPortal } from "react-dom";

const portalRoot = document.getElementById("portal-root");

export default function ImageLightbox({ src, alt = "Ảnh bài thi" }) {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isOpen]);

  if (!src) {
    return (
      <div className="w-28 h-36 bg-gray-100 border-2 border-dashed rounded-xl flex items-center justify-center text-xs text-gray-500">
        Không có ảnh
      </div>
    );
  }

  return (
    <>
      <img
        src={src}
        alt={alt}
        className="w-28 h-36 object-cover rounded border border-gray-300 shadow hover:shadow-xl cursor-zoom-in transition-all duration-200"
        onClick={() => setIsOpen(true)}
        loading="lazy"
      />

      {/* LIGHTBOX SIÊU CẤP – ĐÈ LÊN MỌI THỨ TRÊN ĐỜI */}
      {isOpen &&
        portalRoot &&
        createPortal(
          <div
            className="fixed inset-0 z-[999999999] flex items-center justify-center bg-black/95 backdrop-blur-sm"
            onClick={() => setIsOpen(false)}
          >
            <div
              className="relative max-w-[95vw] max-h-[95vh]"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={src}
                alt={alt}
                className="max-w-full max-h-full object-contain rounded-2xl shadow-2xl"
              />
              <button
                onClick={() => setIsOpen(false)}
                className="absolute -top-14 right-0 w-14 h-14 bg-white/30 hover:bg-white/50 backdrop-blur-md rounded-full flex items-center justify-center text-white text-6xl font-thin transition-all"
              >
                ×
              </button>
              <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-white/80 text-sm bg-black/60 px-6 py-3 rounded-full backdrop-blur">
                Click nền hoặc nhấn Esc để đóng
              </div>
            </div>
          </div>,
          portalRoot
        )}
    </>
  );
}
