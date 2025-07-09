# 📸 Imagify — Your Ultimate Image Upload & Sharing Platform

Imagify is a modern full-stack image management web application that allows users to effortlessly upload, transform, manage, and share images across various platforms. Designed with scalability, speed, and user-friendliness in mind, Imagify leverages the power of cloud storage and modern UI/UX principles to deliver a seamless experience.

---

## 🚀 Features

### 👤 User-Side

- 🔐 Signup/Login with Email & Google OAuth
- ☁️ Drag-and-drop image uploading
- ✨ Resize, crop, compress, apply filters
- 🏷️ Add descriptions, tags, titles
- 📤 One-click social sharing
- 🔍 Search & filter by tags, name, date
- 🗂️ Organize with albums/folders
- 🔗 Copy image URL & download

### 🔧 Admin Panel

- 📊 Dashboard with stats (uploads, users, storage)
- 👥 User account management
- 🖼️ Image moderation (delete flagged content)
- ⚙️ Upload limits, transformation settings, maintenance toggle

---

## 🧠 Tech Stack

| Category      | Tools & Libraries                                                                 |
| ------------- | --------------------------------------------------------------------------------- |
| Frontend      | React.js, Tailwind CSS, React Router, Axios, React Query, Toastify, Framer Motion |
| Backend       | Node.js, Express.js, Multer, JWT                                                  |
| Database      | MongoDB + Mongoose                                                                |
| Image Hosting | Cloudinary                                                                        |
| Auth          | JWT, Google OAuth2                                                                |

---

## 📁 Project Structure

```
imagify/
├── client/              # React frontend
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── stores/
│   │   └── App.jsx
│   └── index.html
├── server/              # Express backend
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
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
```

### Frontend (`/client/.env`)

```env
VITE_BACKEND_URL=http://localhost:5000/api
VITE_GOOGLE_CLIENT_ID=your_google_client_id
```

---

## ▶️ Running the App Locally

### Start Backend

```bash
cd server
npm run dev
```

### Start Frontend

```bash
cd client
npm run dev
```

Open in browser: [http://localhost:5173](http://localhost:5173)

---

## 🌐 API Endpoints

### 🔐 Auth

| Method | Endpoint         | Description         |
| ------ | ---------------- | ------------------- |
| POST   | `/auth/register` | Register new user   |
| POST   | `/auth/login`    | Login existing user |
| GET    | `/auth/google`   | Google OAuth login  |

### 🖼️ Images

| Method | Endpoint          | Description        |
| ------ | ----------------- | ------------------ |
| POST   | `/image/upload`   | Upload new image   |
| GET    | `/image/user/:id` | Get user images    |
| DELETE | `/image/:imageId` | Delete image by ID |

### 🛠️ Admin

| Method | Endpoint                | Description             |
| ------ | ----------------------- | ----------------------- |
| GET    | `/admin/users`          | Get all users           |
| DELETE | `/admin/user/:id`       | Delete user             |
| DELETE | `/admin/image/:imageId` | Moderate (delete) image |

---

## 🧪 Testing

- 🔍 **Postman**: For manual API testing
- 🧪 **Jest**: Unit & integration testing (backend)
- 🧼 **React Testing Library**: For UI component testing
- 🚧 **Coming Soon**: Cypress (E2E tests)

---

## 🚀 Deployment

### Frontend

- Host on **Vercel** or **Netlify**

```bash
npm run build
```

- Deploy the `dist` or `build` folder

### Backend

- Host on **Render**, **Railway**, or **VPS** like DigitalOcean
- Use Node runtime
- Set up environment variables on the hosting platform

### Image Hosting

- All images are stored and served via **Cloudinary**

---

## 🔒 Security Measures

- ✅ JWT-based Authentication
- ✅ Secure password hashing with bcrypt
- ✅ CORS properly configured
- ✅ Rate limiting on auth routes
- ✅ File validation via Multer (file type & size)
- ✅ HTTPS enforced on deployment
- ✅ Environment variables secured

---

## 🛠️ Admin Panel Features

<<<<<<< HEAD
| Feature             | Description                                     |
| ------------------- | ----------------------------------------------- |
| 📊 Dashboard        | Overview of users, uploads, storage             |
| 👥 User Management  | Edit/delete users                               |
| 🖼️ Image Moderation | Remove or report harmful/inappropriate content  |
| ⚙️ Settings         | Upload size limits, block users, system toggles |
=======
| Feature              | Description                                     |
| -------------------- | ----------------------------------------------- |
| 📊 Dashboard         | Overview of users, uploads, storage             |
| 👥 User Management   | Edit/delete users                               |
| 🖼️ Image Moderation | Remove or report harmful/inappropriate content  |
| ⚙️ Settings          | Upload size limits, block users, system toggles |
>>>>>>> 516d41b25b0a15af08a789fa3a13b6aac7efb6bb

---

## ✨ Future Roadmap

- 🧠 AI-Based Smart Tagging using ML
- 📅 Schedule Uploads for Future Posting
- 🧑‍🤝‍🧑 Collaborative Albums
- 🎨 Custom Filters and Image Editor
- 📈 Analytics Dashboard for Views/Shares
- 🔔 Email/Push Notifications
- 🧩 Plugin Support (e.g., Watermarking)

---

## 🤝 Contributing

We welcome all contributions! Follow these steps:

```bash
# 1. Fork the repository
# 2. Create a new branch
git checkout -b feature/your-feature

# 3. Commit your changes
git commit -m "Add: Your feature"

# 4. Push to your fork
git push origin feature/your-feature

# 5. Open a Pull Request
```

> Please ensure code is well documented and tested.

---

## 📄 License

This project is licensed under the **MIT License**.\
See the [LICENSE](./LICENSE) file for more details.

---

## 🌐 Connect with Me

- 💼 [LinkedIn](https://linkedin.com/in/amanpoddar12)
- 🐙 [GitHub](https://github.com/amanpoddar-dev12)
- 🧵 [Twitter](https://twitter.com/amanpoddarr

---

> Built with ❤️ using the MERN Stack, Tailwind CSS, and Cloudinary
<<<<<<< HEAD
=======

>>>>>>> 516d41b25b0a15af08a789fa3a13b6aac7efb6bb
