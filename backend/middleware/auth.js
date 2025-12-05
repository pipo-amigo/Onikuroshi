import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

export function verifyAdmin(req, res, next) {
  const auth = req.headers.authorization;
  if (!auth) return res.status(401).json({ error: "No token provided" });

  const token = auth.split(" ")[1];
  try {
    jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch (err) {
    res.status(403).json({ error: "Unauthorized" });
  }
}
