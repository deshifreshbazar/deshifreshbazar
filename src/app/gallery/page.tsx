"use client";

import { useState } from "react";
import RootLayout from "@/components/layout/RootLayout";
import Image from "next/image";
import { StaticImageData } from "next/image";

// Import images directly
import gallery1 from "@/assets/gallery/1.jpg";
import gallery3 from "@/assets/gallery/3.jpg";
import gallery4 from "@/assets/gallery/4.jpg";
import gallery5 from "@/assets/gallery/5.jpg";
import gallery6 from "@/assets/gallery/6.jpg";
import gallery7 from "@/assets/gallery/7.jpg";
import gallery8 from "@/assets/gallery/8.jpg";
import gallery9 from "@/assets/gallery/9.jpg";
import gallery10 from "@/assets/gallery/10.jpg";

const galleryImages = [
  gallery1,
  gallery3,
  gallery4,
  gallery5,
  gallery6,
  gallery7,
  gallery8,
  gallery9,
  gallery10,
];

export default function GalleryPage() {
  const [selectedImage, setSelectedImage] = useState<StaticImageData | null>(null);

  return (
    <RootLayout>
      <div className="bg-gray-50 py-12">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4">আমাদের গ্যালারি</h1>
            <p className="text-gray-600">দেশি ফ্রেশ বাজারের কিছু মুহূর্ত</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {galleryImages.map((image, index) => (
              <div
                key={index}
                className="relative group overflow-hidden rounded-lg shadow-lg cursor-pointer transform transition-transform duration-300 hover:scale-105"
                onClick={() => setSelectedImage(image)}
              >
                <div className="relative w-full" style={{ paddingBottom: '75%' }}>
                  <Image
                    src={image}
                    alt={`Gallery image ${index + 1}`}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="transition-transform duration-300 group-hover:scale-110 object-cover"
                  />
                </div>
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-opacity duration-300 flex items-center justify-center">
                  <span className="text-white opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300">
                    Zoom In
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Lightbox */}
      {selectedImage && (
        <div
          className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedImage(null)}
        >
          <div className="relative max-w-4xl w-full">
            <button
              className="absolute -top-12 right-0 text-white text-4xl hover:text-gray-300 transition-colors"
              onClick={() => setSelectedImage(null)}
            >
              ×
            </button>
            <div className="relative w-full" style={{ paddingBottom: '66.67%' }}>
              <Image
                src={selectedImage}
                alt="Selected image"
                fill
                className="rounded-lg object-contain"
              />
            </div>
          </div>
        </div>
      )}
    </RootLayout>
  );
}