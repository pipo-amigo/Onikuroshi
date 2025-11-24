// Banner.jsx
import React from "react";

export const Banner = ({ image1, image2, loading }) => (
  <section className="w-full relative ">
    {loading ? (
      <div className="w-full h-[450px] lg:h-[600px] bg-gray-500 animate-pulse rounded-2xl"></div>
    ) : (
      <div className="relative w-full h-[450px] lg:h-[600px] max-md:rounded-b-2xl overflow-hidden shadow-xl">

        {/* Two images side-by-side */}
        <div className="w-full h-full flex max-md:flex-col">
          <img
            src={image1}
            alt="Banner Left"
            className="w-1/2 max-md:w-full h-full object-cover"
            onError={(e) =>
              (e.target.src =
                "https://via.placeholder.com/600x600?text=No+Image")
            }
          />

          <img
            src={image2}
            alt="Banner Right"
            className="w-1/2 max-md:w-full h-full object-cover"
            onError={(e) =>
              (e.target.src =
                "https://via.placeholder.com/600x600?text=No+Image")
            }
          />
        </div>

        {/* Dark bottom fade */}
        <div
          className="absolute bottom-0 w-full h-40 pointer-events-none"
          style={{
            background:
              "linear-gradient(to top, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0) 100%)",
          }}
        ></div>

        {/* Explore Button */}
        <div className="absolute bottom-10 w-full flex justify-center">
          <button
            className="
              px-10 py-3 
              bg-black text-white 
              text-lg 
              rounded-full shadow-lg
              tracking-widest
              transition hover:bg-neutral-900
              font-japanese
            "
          >
            Explore – 鬼殺し
          </button>
        </div>

      </div>
    )}
  </section>
);
