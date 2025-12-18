import { useState } from 'react';

interface ImageGalleryProps {
  images: string[];
  title: string;
}

const ImageGallery = ({ images, title }: ImageGalleryProps) => {
  const [selectedImage, setSelectedImage] = useState(0);

  return (
    <div className="space-y-4">
      {/* Main Image */}
      <div className="relative h-96 md:h-[500px] rounded-2xl overflow-hidden shadow-lg">
        <img
          src={images[selectedImage]}
          alt={`${title} - ${selectedImage + 1}`}
          className="w-full h-full object-cover"
        />

        {/* Navigation Arrows */}
        {images.length > 1 && (
          <>
            <button
              onClick={() => setSelectedImage((prev) => (prev > 0 ? prev - 1 : images.length - 1))}
              className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 rounded-full shadow-lg hover:bg-white transition-colors flex items-center justify-center group"
            >
              <svg
                className="w-6 h-6 text-gray-800 group-hover:text-primary transition-colors"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>
            <button
              onClick={() => setSelectedImage((prev) => (prev < images.length - 1 ? prev + 1 : 0))}
              className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 rounded-full shadow-lg hover:bg-white transition-colors flex items-center justify-center group"
            >
              <svg
                className="w-6 h-6 text-gray-800 group-hover:text-primary transition-colors"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>
          </>
        )}

        {/* Image Counter */}
        <div className="absolute bottom-4 right-4 bg-black/60 text-white px-3 py-1 rounded-full text-sm">
          {selectedImage + 1} / {images.length}
        </div>
      </div>

      {/* Thumbnail Grid */}
      {images.length > 1 && (
        <div className="grid grid-cols-3 gap-4">
          {images.map((image, index) => (
            <button
              key={index}
              onClick={() => setSelectedImage(index)}
              className={`relative h-24 md:h-32 rounded-lg overflow-hidden transition-all ${
                selectedImage === index
                  ? 'ring-4 ring-primary shadow-lg'
                  : 'hover:ring-2 hover:ring-gray-300'
              }`}
            >
              <img
                src={image}
                alt={`${title} - thumbnail ${index + 1}`}
                className="w-full h-full object-cover"
              />
              {selectedImage !== index && (
                <div className="absolute inset-0 bg-black/20 hover:bg-transparent transition-colors" />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default ImageGallery;
