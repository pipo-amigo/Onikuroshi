import express from "express";
import cors from "cors";
import multer from "multer";
import axios from "axios";
import FormData from "form-data";
import dotenv from "dotenv";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

dotenv.config();
const app = express();
const PORT = 5000;
const IMGBB_API_KEY = process.env.IMGBB_API_KEY;

app.use(cors());
app.use(express.json());

// -------------------- JSONBIN CONFIG --------------------
const BIN_ID = process.env.BIN_ID;
const MASTER_KEY = process.env.MASTER_KEY;
const JSONBIN_URL = `https://api.jsonbin.io/v3/b/${BIN_ID}`;

let ADMIN_PASSWORD_HASH;
(async () => {
  ADMIN_PASSWORD_HASH = await bcrypt.hash(process.env.ADMIN_PASSWORD, 10);
})();
// Login Route
app.post("/api/auth/login",async (req, res) => {
  const { password } = req.body;
  if (!password) return res.status(400).json({ error: "Password required" });

  const isValid = await bcrypt.compare(password, ADMIN_PASSWORD_HASH);
  if (!isValid) return res.status(401).json({ error: "Invalid password" });

  const token = jwt.sign({ role: "admin" }, process.env.JWT_SECRET, {
    expiresIn: process.env.TOKEN_EXPIRE
  });

  res.json({ message: "Login success", token });
});
// -------------------- HELPERS --------------------
async function loadData() {
  try {
    const res = await axios.get(JSONBIN_URL, {
      headers: { "X-Master-Key": MASTER_KEY },
    });
    return res.data.record; // JSONBin wraps your data inside "record"
  } catch (err) {
    console.error("Failed to load data from JSONBin", err);
    throw err;
  }
}

async function saveData(data) {
  try {
    const res = await axios.put(JSONBIN_URL, data, {
      headers: {
        "X-Master-Key": MASTER_KEY,
        "Content-Type": "application/json",
      },
    });
    return res.data;
  } catch (err) {
    console.error("Failed to save data to JSONBin", err);
    throw err;
  }
}

// Upload image to imgbb
const uploadToImgbb = async (buffer) => {
  const form = new FormData();
  form.append("image", buffer.toString("base64"));
  const res = await axios.post(
    `https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`,
    form,
    { headers: form.getHeaders() }
  );
  return res.data.data.url;
};

// -------------------- MULTER --------------------
const storage = multer.memoryStorage();
const upload = multer({ storage });

// -------------------- HOMEPAGE --------------------
// Get banners
app.get("/api/homepage", async (req, res) => {
  try {
    const data = await loadData();
    res.json(data.homepage);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch homepage banners" });
  }
});

// Upload banner
app.post("/api/homepage/:bannerType",upload.single("image"), async (req, res) => {
  const { bannerType } = req.params;
  if (!req.file) return res.status(400).json({ error: "Image required" });

  try {
    const url = await uploadToImgbb(req.file.buffer);
    const data = await loadData();
    data.homepage[bannerType] = url;
    await saveData(data);
    res.json({ message: `${bannerType} updated`, banner: url });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to upload banner" });
  }
});

// -------------------- PRODUCTS --------------------
// Get products
app.get("/api/products/men", async (req, res) => {
  const data = await loadData();
  res.json(data.men);
});
app.get("/api/products/women", async (req, res) => {
  const data = await loadData();
  res.json(data.women);
});
app.get("/api/products/specials", async (req, res) => {
  const data = await loadData();
  res.json(data.specials);
});

// Add product helper
const addProduct = async (req, section) => {
  const { name, price, status } = req.body;
  if (!name || !price || !req.files?.image1 || !req.files?.image2)
    throw new Error("All fields + 2 images required");

  const img1 = await uploadToImgbb(req.files.image1[0].buffer);
  const img2 = await uploadToImgbb(req.files.image2[0].buffer);

  const data = await loadData();
  const product = {
    id: Date.now(),
    name,
    price,
    status: status || "None",
    images: [img1, img2],
  };

  data[section].push(product);
  await saveData(data);
  return product;
};

// Add products
app.post("/api/products/men",upload.fields([{ name: "image1" }, { name: "image2" }]), async (req, res) => {
  try {
    const product = await addProduct(req, "men");
    res.json({ message: "Men product added", product });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});
app.post("/api/products/women", upload.fields([{ name: "image1" }, { name: "image2" }]), async (req, res) => {
  try {
    const product = await addProduct(req, "women");
    res.json({ message: "Women product added", product });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});
app.post("/api/products/specials", upload.fields([{ name: "image1" }, { name: "image2" }]), async (req, res) => {
  try {
    const product = await addProduct(req, "specials");
    res.json({ message: "Special product added", product });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Delete product
app.delete("/api/products/:section/:id",async (req, res) => {
  const { section, id } = req.params;
  const data = await loadData();
  if (!data[section]) return res.status(400).json({ error: "Invalid section" });
  data[section] = data[section].filter((p) => p.id != id);
  await saveData(data);
  res.json({ message: `Product removed from ${section}` });
});

// Toggle product status
app.put("/api/products/:section/:id/status", async (req, res) => {
  const { section, id } = req.params;
  const { status } = req.body;

  const data = await loadData();
  if (!data[section]) return res.status(400).json({ error: "Invalid section" });

  const index = data[section].findIndex((p) => p.id == id);
  if (index === -1) return res.status(404).json({ error: "Product not found" });

  data[section][index].status = status;
  await saveData(data);
  res.json({ message: "Product status updated", product: data[section][index] });
});

// Get product by ID
app.get("/api/products/:id", async (req, res) => {
  const { id } = req.params;
  const data = await loadData();

  const sections = ["men", "women", "specials"];
  let product = null;

  for (const section of sections) {
    product = data[section].find(p => p.id == id);
    if (product) break;
  }

  if (!product) return res.status(404).json({ error: "Product not found" });

  res.json(product);
});

app.post("/api/orders",async (req, res) => {
  const newOrders = req.body; // Array of orders [{productId, name, size, quantity, fullName, location, phoneNumber, price}]
  try {
    const data = await loadData();
    if (!data.orders) data.orders = [];
    data.orders.push(...newOrders);
    await saveData(data);
    res.json({ message: "Orders saved successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to save orders" });
  }
});

// GET /api/orders - get all orders (for admin)
app.get("/api/orders", async (req, res) => {
  try {
    const data = await loadData();
    res.json(data.orders || []);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch orders" });
  }
});
//delete order for admin by orderId
app.delete("/api/orders/:productId", async (req, res) => {
  const { productId } = req.params;
  try {
    const data = await loadData();
    if (!data.orders) data.orders = [];

    const originalLength = data.orders.length;
    data.orders = data.orders.filter(order => order.productId != productId);

    if (data.orders.length === originalLength)
      return res.status(404).json({ error: "Order not found" });

    await saveData(data);
    res.json({ message: "Order deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to delete order" });
  }
});
//-------------------- SEARCH PRODUCT ----------------------
app.post("/api/products/search", async (req, res) => {
  const { q } = req.body; // now expects { q: "search term" }
  if (!q) return res.status(400).json({ error: "Body parameter 'q' is required" });

  try {
    const data = await loadData(); // load all data from JSONBin
    const sections = ["men", "women", "specials"];
    let results = [];

    sections.forEach((section) => {
      const filtered = data[section].filter(p =>
        p.name.toLowerCase().includes(q.toLowerCase())
      );
      results = results.concat(filtered);
    });

    res.json(results);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to search products" });
  }
});
// -------------------- START SERVER --------------------
app.listen(PORT, () => console.log(`✅ Server running at http://localhost:${PORT}`));
