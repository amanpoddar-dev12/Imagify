import { useContext } from "react";
import { AppContext } from "../context/AppContext";
import { Navigate } from "react-router-dom";
// import toast from "react-hot-toast";

const AdminRoute = ({ children }) => {
  const { role, loading } = useContext(AppContext);

  //   if (loading) return <p>Loading...</p>;

  if (role === "admin") {
    return children;
  } else {
    // toast.error("Access denied. Admins only.");
    return <Navigate to="/" />;
  }
};

export default AdminRoute;
