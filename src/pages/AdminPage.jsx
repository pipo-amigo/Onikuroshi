import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const AdminPage = () => {
  const [activeTab, setActiveTab] = useState("dashboard"); // "dashboard" or "orders"
  const [banners, setBanners] = useState({ banner1: "", banner2: "" });
  const [selectedBanner, setSelectedBanner] = useState(null);
  const [bannerType, setBannerType] = useState("banner1");

  const [sections, setSections] = useState({ men: [], women: [], specials: [] });
  const [newProduct, setNewProduct] = useState({
    name: "",
    price: "",
    status: "None",
    images: [null, null],
  });
  const [sectionType, setSectionType] = useState("men");

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);

  const BASE_URL = "https://onikuroshi-backend-production.up.railway.app";

  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    navigate("/admin/login");
  };
  useEffect(() => {
  const token = localStorage.getItem("adminToken");
  if (!token) navigate("/admin/login");
}, [navigate]);
  // -------------------- Fetch Data --------------------
  const fetchBanners = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/api/homepage`);
      setBanners(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchProducts = async () => {
    try {
      const [menRes, womenRes, specialsRes] = await Promise.all([
        axios.get(`${BASE_URL}/api/products/men`),
        axios.get(`${BASE_URL}/api/products/women`),
        axios.get(`${BASE_URL}/api/products/specials`),
      ]);
      setSections({ men: menRes.data, women: womenRes.data, specials: specialsRes.data });
    } catch (err) {
      console.error(err);
    }
  };

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${BASE_URL}/api/orders`);
      setOrders(res.data);
      console.log(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBanners();
    fetchProducts();
    fetchOrders();
  }, []);

  // -------------------- Handlers --------------------
  const handleBannerUpload = async () => {
    if (!selectedBanner) return alert("Select an image first");
    const formData = new FormData();
    formData.append("image", selectedBanner);
    try {
      setLoading(true);
      const res = await axios.post(`${BASE_URL}/api/homepage/${bannerType}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      alert(res.data.message);
      fetchBanners();
    } catch (err) {
      console.error(err);
      alert("Failed to upload banner");
    } finally {
      setLoading(false);
    }
  };

  const handleAddProduct = async () => {
    if (!newProduct.name || !newProduct.price || !newProduct.images[0] || !newProduct.images[1])
      return alert("All fields + 2 images are required");

    const formData = new FormData();
    formData.append("name", newProduct.name);
    formData.append("price", newProduct.price);
    formData.append("status", newProduct.status);
    formData.append("image1", newProduct.images[0]);
    formData.append("image2", newProduct.images[1]);

    try {
      setLoading(true);
      const res = await axios.post(`${BASE_URL}/api/products/${sectionType}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      alert(res.data.message);
      fetchProducts();
    } catch (err) {
      console.error(err);
      alert("Failed to add product");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteProduct = async (section, id) => {
    if (!window.confirm("Are you sure?")) return;
    try {
      setLoading(true);
      await axios.delete(`${BASE_URL}/api/products/${section}/${id}`);
      fetchProducts();
    } catch (err) {
      console.error(err);
      alert("Failed to delete product");
    } finally {
      setLoading(false);
    }
  };

  const handleToggleStatus = async (section, product) => {
    const newStatus = product.status === "Sold Out" ? "None" : "Sold Out";
    try {
      setLoading(true);
      await axios.put(`${BASE_URL}/api/products/${section}/${product.id}/status`, { status: newStatus });
      fetchProducts();
    } catch (err) {
      console.error(err);
      alert("Failed to update status");
    } finally {
      setLoading(false);
    }
  };

const handleDeleteOrder = async (phoneNumber) => {
  if (!window.confirm("Delete this order?")) return;
  try {
    setLoading(true);
    await axios.delete(`${BASE_URL}/api/orders/${phoneNumber}`);
    fetchOrders(); // refresh orders after deletion
  } catch (err) {
    console.error(err);
    alert("Failed to delete order");
  } finally {
    setLoading(false);
  }
};


  // -------------------- JSX --------------------
  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-8">
        <button
        onClick={handleLogout}
        style={{
          padding: "10px 18px",
          backgroundColor: "#e91e63",
          border: "none",
          borderRadius: "8px",
          color: "#fff",
          cursor: "pointer",
          fontWeight: "bold",
        }}
      >
        Logout
      </button>
      {loading && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="w-20 h-20 border-4 border-gray-300 border-t-gray-800 rounded-full animate-spin"></div>
        </div>
      )}

      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-800 mb-8">⚙️ Admin Dashboard</h1>

        {/* Tabs */}
        <div className="flex flex-wrap gap-4 mb-8">
          <button
            onClick={() => setActiveTab("dashboard")}
            className={`px-4 py-2 rounded font-semibold ${
              activeTab === "dashboard" ? "bg-gray-800 text-white" : "bg-gray-200 text-gray-800"
            }`}
          >
            Dashboard
          </button>
          <button
            onClick={() => setActiveTab("orders")}
            className={`px-4 py-2 rounded font-semibold ${
              activeTab === "orders" ? "bg-gray-800 text-white" : "bg-gray-200 text-gray-800"
            }`}
          >
            Orders
          </button>
        </div>

        {activeTab === "dashboard" && (
          <div className="space-y-10">
            {/* --- Banners --- */}
            <section className="bg-white shadow-md rounded-xl p-6">
              <h2 className="text-2xl font-semibold text-gray-700 mb-6">🏞 Homepage Banners</h2>
              <div className="flex flex-col lg:flex-row gap-8">
                <div className="flex-1 space-y-4">
                  <label className="block text-gray-600 font-medium">Select Banner</label>
                  <select
                    value={bannerType}
                    onChange={(e) => setBannerType(e.target.value)}
                    className="border border-gray-300 p-2 rounded w-full focus:ring-1 focus:ring-gray-400 focus:outline-none"
                  >
                    <option value="banner1">Banner 1</option>
                    <option value="banner2">Banner 2</option>
                  </select>
                  <input
                    type="file"
                    onChange={(e) => setSelectedBanner(e.target.files[0])}
                    className="block w-full border border-gray-300 p-2 rounded"
                  />
                  <button
                    onClick={handleBannerUpload}
                    className="w-full bg-gray-800 hover:bg-gray-900 text-white font-semibold py-2 px-4 rounded shadow-sm transition"
                  >
                    Upload Banner
                  </button>
                </div>
                <div className="flex-1 flex gap-4 flex-wrap justify-center">
                  {banners.banner1 && (
                    <img src={banners.banner1} alt="Banner1" className="w-56 h-28 object-cover rounded shadow" />
                  )}
                  {banners.banner2 && (
                    <img src={banners.banner2} alt="Banner2" className="w-56 h-28 object-cover rounded shadow" />
                  )}
                </div>
              </div>
            </section>

            {/* --- Add Product --- */}
            <section className="bg-white shadow-md rounded-xl p-6">
              <h2 className="text-2xl font-semibold text-gray-700 mb-6">➕ Add Product</h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                <select
                  value={sectionType}
                  onChange={(e) => setSectionType(e.target.value)}
                  className="border border-gray-300 p-2 rounded focus:ring-1 focus:ring-gray-400 focus:outline-none"
                >
                  <option value="men">Compression</option>
                  <option value="women">Shorts</option>
                  <option value="specials">Specials</option>
                </select>
                <input
                  type="text"
                  placeholder="Product Name"
                  value={newProduct.name}
                  onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                  className="border border-gray-300 p-2 rounded focus:ring-1 focus:ring-gray-400 focus:outline-none"
                />
                <input
                  type="text"
                  placeholder="Price"
                  value={newProduct.price}
                  onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                  className="border border-gray-300 p-2 rounded focus:ring-1 focus:ring-gray-400 focus:outline-none"
                />
                <input
                  type="file"
                  onChange={(e) => setNewProduct({ ...newProduct, images: [e.target.files[0], newProduct.images[1]] })}
                  className="border border-gray-300 p-2 rounded"
                />
                <input
                  type="file"
                  onChange={(e) => setNewProduct({ ...newProduct, images: [newProduct.images[0], e.target.files[0]] })}
                  className="border border-gray-300 p-2 rounded"
                />
                <button
                  onClick={handleAddProduct}
                  className="col-span-full bg-gray-800 hover:bg-gray-900 text-white font-semibold py-2 rounded shadow-sm transition"
                >
                  Add Product
                </button>
              </div>
            </section>

            {/* --- Products Display --- */}
            {["men", "women", "specials"].map((section) => (
              <section key={section} className="bg-white shadow-md rounded-xl p-6">
                <h3 className="text-xl font-bold capitalize text-gray-700 mb-4">{section} Products</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
                  {sections[section].map((p) => (
                    <div
                      key={p.id}
                      className="border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition bg-gray-50 relative"
                    >
                      {p.images[0] && <img src={p.images[0]} alt={p.name} className="w-full h-32 object-cover" />}
                      {p.images[1] && <img src={p.images[1]} alt={p.name} className="w-full h-32 object-cover border-t" />}
                      <div className="p-3 text-center">
                        <p className="font-semibold text-gray-800">{p.name}</p>
                        <p className="text-gray-600">{p.price}DT</p>
                        <button
                          onClick={() => handleToggleStatus(section, p)}
                          className={`mt-3 px-4 py-1 rounded text-white text-sm transition shadow ${
                            p.status === "Sold Out" ? "bg-gray-500 hover:bg-gray-600" : "bg-gray-800 hover:bg-gray-900"
                          }`}
                        >
                          {p.status === "Sold Out" ? "Sold Out" : "Set Sold Out"}
                        </button>
                      </div>
                      <button
                        onClick={() => handleDeleteProduct(section, p.id)}
                        className="absolute top-2 right-2 bg-white text-red-600 rounded-full w-7 h-7 flex items-center justify-center shadow hover:bg-red-100"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              </section>
            ))}
          </div>
        )}

        {activeTab === "orders" && (
          <section className="bg-white shadow-md rounded-xl p-6">
            <h2 className="text-2xl font-semibold text-gray-700 mb-6">📦 Orders</h2>
            {orders.length === 0 ? (
              <p className="text-gray-600">No orders yet.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full bg-white border">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="py-2 px-4 border">Product</th>
                      <th className="py-2 px-4 border">Quantity</th>
                      <th className="py-2 px-4 border">Size</th>
                      <th className="py-2 px-4 border">Price</th>
                      <th className="py-2 px-4 border">Customer Name</th>
                      <th className="py-2 px-4 border">Phone</th>
                      <th className="py-2 px-4 border">Location</th>
                      <th className="py-2 px-4 border">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map((order, idx) => (
                      <tr key={idx} className="text-center border-t">
                        <td className="py-2 px-4 border">{order.name}</td>
                        <td className="py-2 px-4 border">{order.quantity}</td>
                        <td className="py-2 px-4 border">{order.size}</td>
                        <td className="py-2 px-4 border">{order.price}DT</td>
                        <td className="py-2 px-4 border">{order.fullName}</td>
                        <td className="py-2 px-4 border">{order.phoneNumber}</td>
                        <td className="py-2 px-4 border">{order.location}</td>
                        <td className="py-2 px-4 border">
                        <button
                          onClick={() => handleDeleteOrder(order.phoneNumber)}
                          className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 transition"
                        >
                          Delete
                        </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        )}
      </div>
    </div>
  );
};

export default AdminPage;
