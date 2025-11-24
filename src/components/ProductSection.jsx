import React, { useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

export const ProductSection = ({ products, loading }) => {
  useEffect(() => {
    console.log(products);
  }, []);
  return (
    <section className="py-16  text-black bg-transparent">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
<h2 className="text-3xl mb-8 font-japanese text-stroke-white drop-shadow-[0_0_12px_rgba(0,0,0,0.9)]">
  {products.title}
</h2>


        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
          {loading ? (
            // Placeholder cards
            Array.from({ length: 8 }).map((_, idx) => (
              <div
                key={idx}
                className="bg-gray-500 rounded-2xl h-48 sm:h-64 md:h-80 animate-pulse"
              ></div>
            ))
          ) : (
            products.items.map((p, idx) => (
              <Link key={idx} to={`/product/${p.id}`}>
                <motion.article
                  className="bg-white/50 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition transform hover:-translate-y-1"
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.6,
                    delay: idx * 0.1, // small stagger effect
                    ease: "easeOut",
                  }}
                  viewport={{ once: true, amount: 0.2 }}
                >
                  <div className="relative">
                    <img
                      src={p.images[0]}
                      alt={p.name}
                      className="w-full h-48 sm:h-64 md:h-80 object-cover"
                      onError={(e) =>
                        (e.target.src =
                          "https://via.placeholder.com/400x320?text=No+Image")
                      }
                    />
                    {p.status && p.status !== "None" && (
                      <div
                        className={`absolute top-2 right-2 px-2 py-1 rounded-md text-xs font-semibold ${
                          p.status === "Sold Out"
                            ? "bg-red-500 text-white"
                            : "bg-green-500 text-white"
                        }`}
                      >
                        {p.status}
                      </div>
                    )}
                  </div>
                  <div className="p-4 flex flex-col items-start">
                    <h3 className="text-base sm:text-lg font-mono text-gray-900">
                      {p.name}
                    </h3>
                    <div className="mt-1 sm:mt-2 font-japanese text-gray-800">
                      {p.price} DT
                    </div>
                  </div>
                </motion.article>
              </Link>
            ))
          )}
        </div>
      </div>
    </section>
  );
};
