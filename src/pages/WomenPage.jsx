import React, { useEffect, useState } from "react";
import { Header } from "../components/Header";
import { ProductSection } from "../components/ProductSection";

export const WomenPage = () => {
  const [products, setProducts] = useState({ title: "Onikuroshi's Shorts", items: [] });
  const [loading, setLoading] = useState(true);

  const BASE_URL = "https://onikuroshi-backend-production.up.railway.app"; // replace with your deployed API URL later

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const res = await fetch(`${BASE_URL}/api/products/women`);
        const data = await res.json();

        // Map to ensure 'images' array is used correctly
        const formattedData = data.map(item => ({
          ...item,
          images: item.images || [item.image] // fallback if your API sends 'image' instead of 'images'
        }));

        setProducts({
          title: "Women's Collection",
          items: formattedData,
        });
      } catch (err) {
        console.error("Failed to fetch women's products:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  return (
    <>
      <Header />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <ProductSection products={products} loading={loading} showBG={false} />
      </main>
    </>
  );
};
