# 📸 Imagify — Your Ultimate Image Upload & Sharing Platform

Imagify is a modern full-stack image management web application that allows users to effortlessly upload, transform, manage, and share images across various platforms. Designed with scalability, speed, and user-friendliness in mind, Imagify leverages cloud storage, Firebase, and modern UI/UX principles to deliver a seamless experience.

---

## 🚀 Features

### 👤 User-Side

* 🔐 Signup/Login with Email, Google, **GitHub OAuth via Firebase**
* ☁️ Drag-and-drop image uploading
* ✨ Resize, crop, compress, apply filters
* 🏷️ Add descriptions, tags, titles
* 📤 One-click social sharing
* 🔍 Search & filter by tags, name, date
* 🗂️ Organize with albums/folders
* 🔗 Copy image URL & download
* 💳 Razorpay integration for credit purchase

---

## 🧠 Tech Stack

| Category      | Tools & Libraries                                                                 |
| ------------- | --------------------------------------------------------------------------------- |
| Frontend      | React.js, Tailwind CSS, React Router, Axios, React Query, Toastify, Framer Motion |
| Backend       | Node.js, Express.js, Multer, JWT                                                  |
| Database      | MongoDB + Mongoose                                                                |
| Image Hosting | Cloudinary                                                                        |
| Auth          | JWT, Google OAuth2, **Firebase (Email, Google & GitHub sign-in)**                 |

---
## 🧬 System Design Overview

Here’s a visual representation of Imagify's high-level architecture:

### 🖼️ SVG Architecture

<img src="https://jmp.sh/RuKveDFoZjFJsPcdo0Uo" alt="System Design SVG" width="100%"/>

> *Tip: Zoom in for better clarity.*

### 📌 UI Preview or Flow Diagram

![Imagify UI or Flow](https://i.ibb.co/bg6Jzskg/system-design.png)


## 📁 Project Structure

```
imagify/
├── client/              # React frontend
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── stores/
│   │   ├── auth/         # Firebase auth integration (Email, Google, GitHub)
│   │   ├── ui/           # UI-specific components
│   │   └── App.jsx
│   └── index.html
├── server/              # Express backend
│   ├── config/           # Firebase service key + DB config
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── utils/
│   └── index.js
├── README.md
└── package.json
```

---

## 🔑 Environment Variables

### Backend (`/server/.env`)

```env
PORT=5000
MONGODB_URL=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
CLIPDROP_API=your_clipdrop_api_key
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_secret
CURRENCY=INR
CLOUDINARY_CLOUD_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

# Firebase Admin SDK
# ✅ Option 1: Local dev using file path
VITE_FIREBASE_ADMIN_KEY_PATH=./config/firebaseServiceKey.json

# 🔐 Option 2: Production environment, paste minified JSON
FIREBASE_SERVICE_ACCOUNT={...}  
```

### Frontend (`/client/.env`)

```env
VITE_BACKEND_URL=http://localhost:5000
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_RAZORPAY_KEY_ID=your_razorpay_key_id
VITE_API_KEY=your_custom_api_key
```

---

## 🌐 API Endpoints

### 🔐 Auth & User (`/user`)

```js
POST   /register          → registerUser
POST   /login             → loginUser
POST   /forget-password   → forgetPassword
POST   /social-login      → social login via Firebase (Google/GitHub)
POST   /update-user       → updateUser
GET    /credits           → userCredits (protected)
POST   /pay-razor         → paymentRazorPay (protected)
POST   /verify-razor      → verifyRazorPay (protected)
GET    /saved-images      → getSavedImages (protected)
POST   /save-image        → saveImage (protected)
GET    /all-users         → getAllUsers (protected/admin)
GET    /all-transactions  → getAllTransaction (protected/admin)
```

### 🖼️ Image Processing (`/image`)

```js
POST   /generate-image        → generateImage (protected)
POST   /reImagine             → reImagine (protected, multipart)
POST   /removebackground      → removeBackGround (protected, multipart)
POST   /productphotography    → productPhotography (protected, multipart)
POST   /removetext            → removeText (protected, multipart)
POST   /upscaling             → upscaling (protected, multipart)
POST   /replace-background    → replaceBackground (protected, multipart)
POST   /cleanup               → cleanup (protected, multipart with mask + image)
```

---

## ▶️ Running the App Locally

### Backend

```bash
cd server
npm install
npm run dev
```

### Frontend

```bash
cd client
npm install
npm run dev
```

Visit: [http://localhost:5173](http://localhost:5173)

---

## 🐳 Dockerize Imagify

**1. Backend `Dockerfile`:**

```dockerfile
FROM node:18
WORKDIR /app
COPY ./server ./
RUN npm install
CMD ["npm","run","dev"]
EXPOSE 5000
```

**2. Frontend `Dockerfile`:**

```dockerfile
FROM node:18
WORKDIR /app
COPY ./client ./
RUN npm install && npm run build
RUN npm install -g serve
CMD ["serve","-s","dist"]
EXPOSE 5173
```

**3. `docker-compose.yml`:**

```yaml
version: "3.9"
services:
  backend:
    build:
      context: .
      dockerfile: Dockerfile
    ports:
      - "5000:5000"
    environment:
      - MONGODB_URL=${MONGODB_URL}
      - JWT_SECRET=${JWT_SECRET}
      # include all backend env vars

  frontend:
    build:
      context: .
      dockerfile: Dockerfile
    ports:
      - "5173:5173"
    depends_on:
      - backend
```

**4. Bring it up:**

```bash
docker-compose up --build
```

---

## 📄 License

This project is licensed under the **MIT License**.
See the [LICENSE](./LICENSE) file for more details.

---

## 🌐 Connect with Me

* 💼 [LinkedIn](https://linkedin.com/in/amanpoddar12)
* 🔙 [GitHub](https://github.com/amanpoddar-dev12)
* 🧵 [Twitter](https://twitter.com/amanpoddarr)

---

> Built with ❤️ using the MERN Stack, Tailwind CSS, Firebase, Cloudinary, and Docker
