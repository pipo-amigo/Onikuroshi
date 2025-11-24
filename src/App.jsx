import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Homepage from "./pages/HomePage";
import { ProductPageWrapper } from "./components/ProductPageWrapper";
import { ProductPage } from "./pages/ProductPage";
import { MenPage } from "./pages/MenPage";
import { WomenPage } from "./pages/WomenPage";
import { SpecialsPage } from "./pages/SpecialsPage";
import AdminPage from "./pages/AdminPage";
import { CartPage } from "./pages/CartPage";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/product/:id" element={<ProductPageWrapper />} />
        <Route path="/men" element={<MenPage />} />
        <Route path="/women" element={<WomenPage />} />
        <Route path="/specials" element={<SpecialsPage />} />
        <Route path="/admin" element={<AdminPage/>}/>
        <Route path="/cart" element={<CartPage />} />
      </Routes>
    </Router>
  );
}

export default App;
