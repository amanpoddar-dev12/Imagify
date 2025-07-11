import admin from "firebase-admin";
import fs from "fs";
import path from "path";
import dotenv from "dotenv";

dotenv.config();

let serviceAccount;

if (process.env.FIREBASE_SERVICE_ACCOUNT) {
  // Production on Render
  serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
} else {
  // Local development
  const serviceAccountPath = path.resolve("./config/firebaseServiceKey.json");
  serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, "utf8"));
}

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

export default admin;
