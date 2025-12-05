import React, { useEffect, useState } from "react";
import { Header } from "../components/Header";
import { ProductSection } from "../components/ProductSection";

export const SpecialsPage = () => {
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState([]);

  const BASE_URL = "https://onikuroshi-backend-production.up.railway.app"; // Replace with your API URL

  useEffect(() => {
    const fetchSpecials = async () => {
      try {
        setLoading(true);
        const res = await fetch(`${BASE_URL}/api/products/specials`);
        const data = await res.json();

        // Ensure images array exists
        const formattedData = data.map(item => ({
          ...item,
          images: item.images || [item.image] // fallback for single image
        }));

        setProducts(formattedData);
      } catch (err) {
        console.error("Failed to fetch specials:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchSpecials();
  }, []);

  return (
    <>
      <Header />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <ProductSection
          products={{ title: "Special Offers", items: products }}
          loading={loading}
        />
      </main>
    </>
  );
};
