import React, { useState, useEffect } from "react";
import axios from "axios";
import { ProductSection } from "../components/ProductSection";
import { AnnouncementBar } from "../components/AnnouncementBar";
import { Banner } from "../components/Banner";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";

import { SkeletonBanner } from "../components/SkeletonBanner";
import { SkeletonProductSection } from "../components/SkeletonProductSection";
import backgroundImage from "../assets/oni/28.jpg"  
const BASE_URL = "http://localhost:5000";

export const Homepage = () => {
  const [banners, setBanners] = useState({ banner1: "", banner2: "" });
  const [men, setMen] = useState([]);
  const [women, setWomen] = useState([]);
  const [specials, setSpecials] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchHomepageData = async () => {
    try {
      setLoading(true);

      const bannersRes = await axios.get(`${BASE_URL}/api/homepage`);
      setBanners(bannersRes.data);

      const [menRes, womenRes, specialsRes] = await Promise.all([
        axios.get(`${BASE_URL}/api/products/men`),
        axios.get(`${BASE_URL}/api/products/women`),
        axios.get(`${BASE_URL}/api/products/specials`)
      ]);

      const formatProducts = arr =>
        arr.map(p => ({
          ...p,
          images: p.images || [p.image1, p.image2],
          status: p.status || "None"
        }));

      setMen(formatProducts(menRes.data || []));
      setWomen(formatProducts(womenRes.data || []));
      setSpecials(formatProducts(specialsRes.data || []));

      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHomepageData();
  }, []);

  return (
  <div
    style={{
      backgroundImage: `url(${backgroundImage})`,
      backgroundSize: "cover",
      backgroundPosition: "center",
      backgroundRepeat: "no-repeat",
      minHeight: "100vh",
    }}
    className="text-black"
  >
    {/* <AnnouncementBar /> */}
    <Header />

    <div className="pt-0">
      {loading ? <SkeletonBanner /> : banners.banner1 && <Banner image1={banners.banner1} image2={banners.banner2} />}

      {loading ? (
        <SkeletonProductSection title="Onikuroshi's Compression" />
      ) : (
        men.length > 0 && (
          <ProductSection
            products={{ title: "Onikuroshi's Compression", items: men.slice(0, 8) }}
          />
        )
      )}

      {loading ? (
        <SkeletonProductSection title="Onikuroshi's Shorts" />
      ) : (
        women.length > 0 && (
          <ProductSection
            products={{ title: "Onikuroshi's Shorts", items: women.slice(0, 8) }}
          />
        )
      )}


      {loading ? (
        <SkeletonProductSection title="Specials" />
      ) : (
        specials.length > 0 && (
          <ProductSection
            products={{ title: "Specials", items: specials.slice(0, 8) }}
          />
        )
      )}
    </div>

    <Footer />
  </div>
);
};

export default Homepage;
