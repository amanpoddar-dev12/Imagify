import admin from "firebase-admin";
import fs from "fs";
import path from "path";
import dotenv from "dotenv";

dotenv.config();

const serviceAccountPath = process.env.VITE_FIREBASE_ADMIN_KEY_PATH;
const serviceAccount = JSON.parse(
  fs.readFileSync(path.resolve(serviceAccountPath), "utf8")
);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

export default admin;
