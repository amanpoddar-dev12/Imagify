// config/firebaseAdmin.js
import admin from "firebase-admin";
import serviceAccount from "./firebaseServiceKey.json" assert { type: "json" }; // You will download this below

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

export default admin;
