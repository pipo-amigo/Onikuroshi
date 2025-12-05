import React, { useRef, useState, useEffect } from "react";
import { ProductSection } from "../components/ProductSection";
import { Header } from "../components/Header";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { useParams } from "react-router-dom";
import backgroundImage from "../assets/oni/14.jpg" //23
export const ProductPage = () => {
  const { id } = useParams();
  const sliderRef = useRef(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedSize, setSelectedSize] = useState("M");
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [orders, setOrders] = useState([]);
  const [formData, setFormData] = useState({
    fullName: "",
    location: "",
    phoneNumber: "",
  });

  // ---------------- Fetch product + related ----------------
  useEffect(() => {
    const fetchProductAndRelated = async () => {
      try {
        setLoading(true);

        // 1. Fetch product by ID
        const res = await fetch(`https://onikuroshi-backend-production.up.railway.app/api/products/${id}`);
        if (!res.ok) throw new Error("Product not found");
        const productData = await res.json();
        setProduct(productData);

        // 2. Fetch all sections
        const [menRes, womenRes, specialsRes] = await Promise.all([
          fetch("https://onikuroshi-backend-production.up.railway.app/api/products/men"),
          fetch("https://onikuroshi-backend-production.up.railway.app/api/products/women"),
          fetch("https://onikuroshi-backend-production.up.railway.app/api/products/specials"),
        ]);

        const [men, women, specials] = await Promise.all([
          menRes.json(),
          womenRes.json(),
          specialsRes.json(),
        ]);

        // 3. Find section where product exists
        let sectionItems = [];
        if (men.find((p) => p.id == id)) {
          sectionItems = men;
        } else if (women.find((p) => p.id == id)) {
          sectionItems = women;
        } else if (specials.find((p) => p.id == id)) {
          sectionItems = specials;
        }

        // 4. Related products = 6 from same section (excluding current)
        const related = sectionItems.filter((p) => p.id != id).slice(0, 6);
        setRelatedProducts(related);
      } catch (err) {
        console.error(err);
        setProduct(null);
      } finally {
        setLoading(false);
      }
    };

    fetchProductAndRelated();
  }, [id]);

  // ---------------- Loading / Not Found ----------------
  if (loading) {
    return (
      <div className="flex items-center justify-center h-[80vh]">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-black"></div>
      </div>
    );
  }

  if (!product) {
    return <p className="text-center mt-20">Product not found.</p>;
  }

  // ---------------- Slider Logic ----------------
  const handleScroll = () => {
    if (!sliderRef.current) return;
    const scrollLeft = sliderRef.current.scrollLeft;
    const width = sliderRef.current.clientWidth;
    const index = Math.round(scrollLeft / width);
    setCurrentIndex(index);
  };

  const scrollToIndex = (index) => {
    if (!sliderRef.current) return;
    const width = sliderRef.current.clientWidth;
    sliderRef.current.scrollTo({
      left: width * index,
      behavior: "smooth",
    });
    setCurrentIndex(index);
  };

  const nextSlide = () => {
    if (currentIndex < product.images.length - 1) {
      scrollToIndex(currentIndex + 1);
    }
  };

  const prevSlide = () => {
    if (currentIndex > 0) {
      scrollToIndex(currentIndex - 1);
    }
  };

  // ---------------- Order Form ----------------
  const handleInputChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

const handleOrderSubmit = async () => {
  if (!formData.fullName || !formData.location || !formData.phoneNumber) {
    alert("Please fill in all fields");
    return;
  }

  const newOrder = {
    productId: product.id,
    name: product.name,       // match backend field
    size: selectedSize,
    quantity,
    price: product.price,
    ...formData,              // fullName, location, phoneNumber
  };

  try {
    // Send order to backend
    const res = await fetch("https://onikuroshi-backend-production.up.railway.app/api/orders", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify([newOrder]), // backend expects an array
    });

    if (!res.ok) throw new Error("Failed to submit order");

    alert("Order submitted successfully!");
    setFormData({ fullName: "", location: "", phoneNumber: "" });
    setShowForm(false);
  } catch (err) {
    console.error(err);
    alert("Failed to submit order. Try again later.");
  }
};

//------------------cart---------------------
const addToCart = () => {
  const cartItem = {
    productId: product.id,
    name: product.name,
    price: product.price,
    size: selectedSize,
    quantity,
    image: product.images[0],
  };

  const existingCart = JSON.parse(localStorage.getItem("cart")) || [];
  
  // Check if same product + size already exists
  const index = existingCart.findIndex(
    (item) => item.productId === cartItem.productId && item.size === cartItem.size
  );

  if (index > -1) {
    // Update quantity if already exists
    existingCart[index].quantity += cartItem.quantity;
  } else {
    existingCart.push(cartItem);
  }

  localStorage.setItem("cart", JSON.stringify(existingCart));
  alert("Added to cart!");
};
  // ---------------- Render ----------------
 return (
  <>
    <Header />

    <div
      className="min-h-screen w-full bg-cover bg-center bg-fixed"
      style={{ backgroundImage: `url(${backgroundImage})` }}
    >
      {/* Dark overlay for readability */}
      <div className="min-h-screen bg-black/40">
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          {/* Product Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 mb-20">
            
            {/* Image Gallery */}
            <div className="relative group">
              <div
                ref={sliderRef}
                className="flex gap-4 overflow-x-hidden snap-x snap-mandatory rounded-2xl shadow-lg"
                onScroll={handleScroll}
              >
                {product.images.map((img, idx) => (
                  <img
                    key={idx}
                    src={img}
                    alt={product.name}
                    className="w-full h-[500px] object-cover flex-shrink-0 snap-center rounded-2xl"
                  />
                ))}
              </div>

              {currentIndex > 0 && (
                <button
                  onClick={prevSlide}
                  className="absolute top-1/2 left-3 -translate-y-1/2 bg-white/80 hover:bg-white text-gray-900 p-3 rounded-full shadow-md transition hidden group-hover:flex"
                >
                  <ChevronLeft size={22} />
                </button>
              )}

              {currentIndex < product.images.length - 1 && (
                <button
                  onClick={nextSlide}
                  className="absolute top-1/2 right-3 -translate-y-1/2 bg-white/80 hover:bg-white text-gray-900 p-3 rounded-full shadow-md transition hidden group-hover:flex"
                >
                  <ChevronRight size={22} />
                </button>
              )}

              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                {product.images.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => scrollToIndex(idx)}
                    className={`w-3 h-3 rounded-full transition-all ${
                      idx === currentIndex ? "bg-black scale-110" : "bg-gray-400"
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Product Info */}
            <div className="flex flex-col justify-center space-y-10 text-white">
              <div>
                <h1 className="text-5xl font-mono font-bold tracking-tight">
                  {product.name}
                </h1>
                <p className="mt-3 text-3xl font-japanese">
                  {product.price} DT
                </p>
              </div>

              {/* Size Selector */}
              <div>
                <span className="block mb-2 text-sm font-mono">Select Size</span>
                <div className="flex gap-3">
                  {["S", "M", "L", "XL"].map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`px-6 py-3 rounded-lg border font-semibold transition-all ${
                        selectedSize === size
                          ? "bg-white text-black border-white"
                          : "bg-black/50 text-white border-white/20 hover:border-white"
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              {/* Quantity */}
              <div>
                <span className="block mb-2 text-sm font-mono">Quantity</span>
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-4 py-2 border border-white/30 rounded-lg hover:bg-white/10"
                  >
                    −
                  </button>
                  <span className="text-xl font-semibold">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="px-4 py-2 border border-white/30 rounded-lg hover:bg-white/10"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col gap-4 mt-4">
                <button
                  onClick={addToCart}
                  className="w-full px-6 py-4 bg-black text-white rounded-lg font-bold font-mono hover:bg-gray-900 transition"
                >
                  Add to Cart
                </button>

                <button
                  onClick={() => setShowForm(true)}
                  className="w-full px-6 py-4 bg-white text-black rounded-lg font-japanese hover:bg-gray-200 transition"
                >
                  Buy Now
                </button>
              </div>
            </div>
          </div>

          {/* Related */}
          <div>
           {relatedProducts.length> 0&& <h2 className="text-3xl font-serif font-bold mb-8 text-white">
              Related Products
            </h2>} 

            <ProductSection
              products={{ title: "", items: relatedProducts }}
              loading={loading}
            />
          </div>
        </main>
      </div>
    </div>

    {/* Floating Order Form (unchanged) */}
    {showForm && (
     <div  className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
          <div className="bg-white rounded-2xl p-8 w-full max-w-md shadow-lg relative">
            <button
              className="absolute top-4 right-4 text-gray-500 hover:text-black"
              onClick={() => setShowForm(false)}
            >
              <X size={24} />
            </button>
            <h2 className="text-2xl font-japanese mb-6">Complete Your Order</h2>

            <div className="space-y-4">
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleInputChange}
                placeholder="Full Name"
                className="w-full px-4 py-2 border rounded-lg font-mono"
              />
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleInputChange}
                placeholder="Location"
                className="w-full px-4 py-2 border rounded-lg font-mono"
              />
              <input
                type="text"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleInputChange}
                placeholder="Phone Number"
                className="w-full px-4 py-2 border rounded-lg font-mono"
              />

              <button
                onClick={handleOrderSubmit}
                className="w-full px-6 py-3 bg-black text-white rounded-lg  hover:bg-gray-800 transition font-japanese"
              >
                Submit Order
              </button>
            </div>
          </div>
        </div>
    )}
  </>
);

};
