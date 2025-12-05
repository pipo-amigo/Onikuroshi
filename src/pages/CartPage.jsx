import React, { useEffect, useState } from "react";
import { X } from "lucide-react";
import axios from "axios";
import { Header } from "../components/Header";

export const CartPage = () => {
  const [cart, setCart] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [selectedItems, setSelectedItems] = useState([]); // Items to buy
  const [formData, setFormData] = useState({
    fullName: "",
    location: "",
    phoneNumber: "",
  });

  useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem("cart")) || [];
    setCart(storedCart);
  }, []);

  const removeItem = (index) => {
    const updatedCart = [...cart];
    updatedCart.splice(index, 1);
    setCart(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
  };

  const changeQuantity = (index, delta) => {
    const updatedCart = [...cart];
    updatedCart[index].quantity = Math.max(1, updatedCart[index].quantity + delta);
    setCart(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
  };

  const totalPrice = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handleInputChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const openForm = (items) => {
    setSelectedItems(items);
    setShowForm(true);
  };

  const handleOrderSubmit = async () => {
    try {
      const orderData = selectedItems.map((item) => ({
        productId: item.productId,
        name: item.name,
        size: item.size,
        quantity: item.quantity,
        price: item.price,
        ...formData,
      }));

      // Send orders to your backend
      await axios.post("https://onikuroshi-backend-production.up.railway.app/api/orders", orderData);

      alert("Order submitted successfully!");
      setShowForm(false);
      setFormData({ fullName: "", location: "", phoneNumber: "" });

      // Optionally, remove bought items from cart
      const remainingCart = cart.filter((item) => !selectedItems.includes(item));
      setCart(remainingCart);
      localStorage.setItem("cart", JSON.stringify(remainingCart));
    } catch (err) {
      console.error(err);
      alert("Failed to submit order");
    }
  };

  if (cart.length === 0)
    return (
    <>
    <Header />
    <p className="text-center mt-20 text-gray-700">Your cart is empty.</p>
    </>
    );

  return (
    <>      <Header />
    <div className="max-w-7xl mx-auto px-4 py-20">
       
      <h1 className="text-4xl  mb-8 font-japanese">🛒 Your Cart</h1>

      <div className="space-y-6">
        {cart.map((item, index) => (
          <div key={index} className="flex items-center gap-6 border rounded-lg p-4 shadow-sm bg-white relative">
             <button
                onClick={() => removeItem(index)}
                className="text-red-600 hover:text-red-800 absolute top-2 right-2"
              >
                <X size={20} />
              </button>
            <img src={item.image} alt={item.name} className="w-24 h-24 object-cover rounded" />
            <div className="flex-1 font-mono">
              <h2 className=" text-sm">{item.name}</h2>
              <p className="text-gray-600">Size: {item.size}</p>
              <p className="text-gray-800 font-japanese">{item.price} DT</p>
              <div className="flex items-center gap-2 mt-2">
                <button
                  onClick={() => changeQuantity(index, -1)}
                  className="px-3 py-1 border rounded hover:bg-gray-100"
                >
                  −
                </button>
                <span>{item.quantity}</span>
                <button
                  onClick={() => changeQuantity(index, 1)}
                  className="px-3 py-1 border rounded hover:bg-gray-100"
                >
                  +
                </button>
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <button
                onClick={() => openForm([item])}
                className="px-4 py-1 border-black border-2 text-black rounded-lg hover:bg-green-700 transition font-mono font-bold absolute bottom-4 right-5"
              >
                Buy
              </button>
             
            </div>
          </div>
        ))}
      </div>

      {/* Buy All Button */}
      <div className="mt-8 flex justify-between items-center">
        <h2 className="text-2xl font-japanese">Total: {totalPrice} DT</h2>
        <button
          onClick={() => openForm(cart)}
          className="px-6 py-3 bg-black text-white rounded-lg font-bold hover:bg-gray-800 transition font-mono"
        >
          Buy All
        </button>
      </div>

      {/* Floating Order Form */}
      {showForm && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
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
    </div>
    </>
  );
};
