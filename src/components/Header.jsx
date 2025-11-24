import React, { useState, useEffect, useRef } from "react";
import { MagnifyingGlassIcon, ShoppingBagIcon, Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import { Link, useNavigate } from "react-router-dom";
import logoImage from '../assets/oni/3.png';
import beb from '../assets/3d/beb.glb'

export const Header = () => {
  const [show, setShow] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const navigate = useNavigate();
  const searchRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => setShow(window.scrollY > 200);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Search API call with debounce
useEffect(() => {
  if (!searchQuery) {
    setSearchResults([]);
    return;
  }

  const delayDebounce = setTimeout(async () => {
    try {
      const res = await fetch(`http://localhost:5000/api/products/search`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ q: searchQuery }),
      });
      const data = await res.json();
      setSearchResults(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
      setSearchResults([]);
    }
  }, 300);

  return () => clearTimeout(delayDebounce);
}, [searchQuery]);

  // Close search if clicked outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setSearchOpen(false);
        setSearchQuery("");
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className={`w-full bg-black text-black font-serif  transition-all duration-300 ${show ? 'fixed top-0 shadow-lg' : '-top-20'} z-50 `}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Left menu for PC/Tablet */}
        <nav className="hidden md:flex gap-6">
          <Link to="/men" className="hover:underline text-white font-japanese">Compression</Link>
          <Link to="/women" className="hover:underline  text-white font-japanese">Shorts</Link>
          <Link to="/specials" className="hover:underline  text-white font-japanese">Specials</Link>
        </nav>

        {/* Logo */}
        <Link to={"/"} className="text-xl font-bold">
         <model-viewer
    src={beb}
    alt="3D Oni"
    auto-rotate
    disable-zoom
  auto-rotate-delay="1"
  rotation-per-second="90deg"
    style={{ width: "90px", height: "90px" }}
  ></model-viewer>
        </Link>

        {/* Icons */}
        <div className="flex items-center gap-4 relative" ref={searchRef}>
          {/* Search button */}
          <button onClick={() => setSearchOpen(!searchOpen)}>
            <MagnifyingGlassIcon className="h-6 w-6 text-white" />
          </button>

          <Link to={"/cart"}>
            <ShoppingBagIcon className="h-6 w-6  text-white" />
          </Link>

          {/* Search Input & Results */}
{searchOpen && (
  <div className="absolute top-10 right-0 w-96 bg-white shadow-lg rounded-lg z-50"> {/* width increased */}
    <input
      type="text"
      autoFocus
      value={searchQuery}
      onChange={(e) => setSearchQuery(e.target.value)}
      placeholder="Search products..."
      className="w-full px-4 py-3 border-b rounded-t-lg focus:outline-none text-lg" // increased input height & font
    />
    <div className="max-h-80 overflow-y-auto"> {/* taller list */}
      {searchQuery && searchResults.length === 0 && (
        <p className="px-4 py-3 text-gray-500 text-lg">No products found</p> // bigger text
      )}
      {Array.isArray(searchResults) && searchResults.map(product => (
        <div
          key={product.id}
          className="flex items-center gap-4 px-4 py-3 hover:bg-gray-100 cursor-pointer" // more padding & gap
          onClick={() => {
            navigate(`/product/${product.id}`);
            setSearchOpen(false);
            setSearchQuery("");
            setSearchResults([]);
          }}
        >
          <img src={product.images[0]} alt={product.name} className="w-16 h-16 object-cover rounded" /> {/* bigger image */}
          <span className="truncate text-lg">{product.name}</span> {/* bigger text */}
        </div>
      ))}
    </div>
  </div>
)}

          {/* Mobile menu button */}
          <button className="md:hidden p-2" onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <XMarkIcon className="h-6 w-6 text-white" /> : <Bars3Icon className="h-6 w-6  text-white" />}
          </button>
        </div>
      </div>

      {/* Mobile menu panel */}
      {menuOpen && (
        <div className="md:hidden bg-black shadow-md px-4 py-4 ">
          <Link to="/men" className="block py-2 hover:underline font-japanese text-white">Compression</Link>
          <Link to="/women" className="block py-2 hover:underline font-japanese text-white">Shorts</Link>
          <Link to="/specials" className="block py-2 hover:underline font-japanese text-white">Specials</Link>
        </div>
      )}
    </header>
  );
};
