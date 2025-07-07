import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, GithubAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBOr5pGG9o6h1Ma3YARQ5xxlk6YB_e18SE",
  authDomain: "imagify-bc0a6.firebaseapp.com",
  projectId: "imagify-bc0a6",
  storageBucket: "imagify-bc0a6.firebasestorage.app",
  messagingSenderId: "359572385545",
  appId: "1:359572385545:web:e3f7577d487ac28b882dd8",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();
const githubProvider = new GithubAuthProvider();

export { auth, googleProvider, githubProvider };
