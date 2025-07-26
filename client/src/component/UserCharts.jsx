import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import RoleChanger from "./RoleChanger";
import { assets } from "../assets/assets";
import { AppContext } from "../context/AppContext";
const UserCharts = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { backendUrl } = useContext(AppContext);
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get(`${backendUrl}/api/user/all-users`);
        setUsers(response.data.data);
        console.log(response.data.data);
      } catch (err) {
        setError("Failed to fetch users.");
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);
  console.log(users);
  if (loading) return <p className="text-center text-blue-600">Loading...</p>;
  if (error) return <p className="text-center text-red-600">{error}</p>;

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6 text-center">All Users</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {users.map((user) => (
          <div
            key={user._id}
            className="bg-white dark:bg-[#0f172a] shadow-lg rounded-xl p-5"
          >
            {/* 👤 Profile Image or Skeleton */}
            <div className="flex items-center gap-4 mb-4">
              {user.profile ? (
                <img
                  src={user.profile}
                  alt="User Avatar"
                  className="w-14 h-14 rounded-full object-cover border-2 border-indigo-400"
                />
              ) : (
                // <div className=" bg-gray-300 dark:bg-gray-700 " />
                <img
                  src={assets.profile_icon}
                  className="w-14 h-14 rounded-full"
                />
              )}

              <div>
                <h3 className="text-lg font-semibold">{user.name}</h3>
                <p className="text-sm text-gray-500">{user.email}</p>
              </div>
            </div>

            {/* 🎖️ Info Tags */}
            <div className="flex flex-wrap items-center gap-2 mt-2 text-sm">
              <span className="px-2 py-1 rounded bg-blue-100 text-blue-700">
                {user.role.toUpperCase()}
              </span>
              <span className="px-2 py-1 rounded bg-green-100 text-green-700">
                Credits: {user.creditBalance}
              </span>
              <span
                className={`px-2 py-1 rounded ${
                  user.isVerified
                    ? "bg-green-200 text-green-800"
                    : "bg-red-200 text-red-800"
                }`}
              >
                {user.isVerified ? "Verified" : "Not Verified"}
              </span>
              <RoleChanger email={user.email} currentRole={user.role} />
            </div>

            {/* 🖼️ Saved Images */}
            {user.savedImages?.length > 0 ? (
              <div className="mt-4">
                <h4 className="font-medium mb-2">Saved Images:</h4>
                <div className="grid grid-cols-2 gap-2">
                  {user.savedImages.map((img) => (
                    <img
                      key={img._id}
                      src={img.url}
                      alt="Saved"
                      className="w-full h-32 object-cover rounded-md border"
                    />
                  ))}
                </div>
              </div>
            ) : (
              <p className="text-sm text-gray-400 italic mt-4">
                No saved images
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default UserCharts;
