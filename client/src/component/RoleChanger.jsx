import React, { useContext, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { AppContext } from "../context/AppContext";
const UserRoleToggle = ({ email, currentRole }) => {
  const [role, setRole] = useState(currentRole);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const { backendUrl } = useContext(AppContext);
  const handleToggle = async () => {
    const newRole = role === "admin" ? "user" : "admin";
    setLoading(true);
    setMessage("");

    try {
      const res = await axios.post(`${backendUrl}/api/user/update-user`, {
        email,
        role: newRole,
      });

      setRole(newRole);
      setMessage("Role updated successfully ✅");
      toast.success(message);
    } catch (err) {
      console.error(err);
      setMessage("❌ Failed to update role");
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-between bg-white dark:bg-gray-800 p-4 rounded-xl shadow-md">
      <div className="">
        {/* <p className="font-medium text-gray-800 dark:text-white">{email}</p> */}
        <p className="text-sm gap-3 text-gray-500 dark:text-gray-400">
          Current Role: {role}
        </p>
        {/* {message && (
          <p
            className={`text-sm mt-1 ${
              message.includes("success") ? "text-green-500" : "text-red-500"
            }`}
          >
            {message}
          </p>
        )} */}
      </div>

      <label className="inline-flex items-center cursor-pointer ml-3">
        <input
          type="checkbox"
          className="sr-only peer"
          checked={role === "admin"}
          onChange={handleToggle}
          disabled={loading}
        />
        <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-indigo-500 dark:bg-gray-700 rounded-full peer dark:peer-focus:ring-indigo-400 peer-checked:bg-indigo-600 relative transition-all duration-300">
          <div
            className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white dark:bg-gray-200 rounded-full transition-transform ${
              role === "admin" ? "translate-x-5" : "translate-x-0"
            }`}
          />
        </div>
      </label>
    </div>
  );
};

export default UserRoleToggle;
