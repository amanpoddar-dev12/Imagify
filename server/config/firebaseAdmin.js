import admin from "firebase-admin";
import fs from "fs";
import path from "path";
import dotenv from "dotenv";

dotenv.config();

const serviceAccountPath = path.resolve("./config/firebaseServiceKey.json");
console.log(serviceAccountPath);
if (!fs.existsSync(serviceAccountPath)) {
  throw new Error(
    "Firebase service key file not found at: " + serviceAccountPath
  );
}

const serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, "utf8"));

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

export default admin;
