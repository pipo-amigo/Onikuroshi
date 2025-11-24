import React, { useEffect, useState } from "react";
import { Header } from "../components/Header";
import { ProductSection } from "../components/ProductSection";

export const MenPage = () => {
  const [products, setProducts] = useState({ title: "Onikuroshi's Compression", items: [] });
  const [loading, setLoading] = useState(true);

  const BASE_URL = "http://localhost:5000"; // change to your deployed API URL later

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const res = await fetch(`${BASE_URL}/api/products/men`);
        const data = await res.json();

        setProducts({
          title: "Onikuroshi's Compression",
          items: data, // your backend already sends an array of products
        });
      } catch (err) {
        console.error("Failed to fetch men's products:", err);
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
        <ProductSection products={products} loading={loading} />
      </main>
    </>
  );
};
