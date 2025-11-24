import { Link } from "react-router-dom"
import logoImage from '../assets/oni/3.png';

export const Footer = () => (
  <footer className="bg-black text-white py-12">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-3 gap-8">
      {/* Logo & Info */}
      <div>
        <div className="flex items-center gap-3 mb-3">
          <img src={logoImage} className="w-10 h-10 rounded-md bg-white flex items-center justify-center text-black font-bold"/>
          <div>
            <div className="  text-lg font-japanese">Onikuroshi's shop</div>
            <div className="text-sm font-mono">Online Shop</div>
          </div>
        </div>
      </div>

      {/* Links */}
      <div>
        <div className="mb-2 font-japanese">Links</div>
        <ul className="space-y-1 font-mono">
          <li><Link to="/men" className="hover:underline">Compression</Link></li>
          <li><Link to="/women" className="hover:underline">Shorts</Link></li>
          <li><Link to="/specials" className="hover:underline">Specials</Link></li>
        </ul>
      </div>

      {/* Social */}
      <div>
        <div className=" mb-2 font-japanese">Follow Us</div>
        <div className="flex gap-4">
          <a href="https://www.instagram.com/oni.kuroshi/" className="hover:text-gray-400 font-mono">Instagram</a>
        </div>
      </div>
    </div>
    <div className="text-center text-gray-500 text-sm mt-8">© 2025 Onikuroshi . </div>
  </footer>
);