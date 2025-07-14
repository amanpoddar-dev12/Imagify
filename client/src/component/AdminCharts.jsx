import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  AreaChart,
  Area,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from "recharts";

// 🎨 Chart colors
const COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#ff7f50", "#00bcd4"];

// 🧠 Custom Tooltip
const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload || payload.length === 0) return null;

  return (
    <div className="bg-gray-800 text-white p-3 rounded shadow-lg border border-gray-700">
      <p className="text-sm text-gray-300 mb-1">{label}</p>
      {payload.map((entry, i) => (
        <p key={i} style={{ color: entry.color }} className="text-sm">
          {entry.name}:{" "}
          {entry.name === "Credit Balance"
            ? `₹${entry.value.toLocaleString()}`
            : entry.value}
        </p>
      ))}
    </div>
  );
};

const AdminCharts = () => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState("All");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const isDark = document.documentElement.classList.contains("dark");
  const axisColor = isDark ? "#e5e7eb" : "#374151";

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/user/all-users");
        setUsers(res.data.data || []);
      } catch (err) {
        setError("Failed to fetch data.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const filteredUsers =
    selectedUser === "All"
      ? users
      : users.filter((user) => user.name === selectedUser);

  // ✅ Credit Balance Area Chart Data
  const creditBalanceData = filteredUsers.map((user) => ({
    name: user.name,
    creditBalance: user.creditBalance,
  }));

  // 📊 Pie Chart Data
  const pieData = filteredUsers.map((user) => ({
    name: user.name,
    value: user.creditBalance,
  }));

  // 📊 Image Upload Chart
  const barChartData = filteredUsers.map((user) => ({
    name: user.name,
    uploads: user.savedImages.length,
  }));

  if (loading) return <p className="text-center text-blue-600">Loading...</p>;
  if (error) return <p className="text-center text-red-600">{error}</p>;

  return (
    <div className="p-6 min-h-screen  text-gray-800 dark:text-white ">
      <h2 className="text-2xl font-bold mb-4 text-center">User Activity</h2>

      {/* 🔍 Filter Dropdown */}
      <div className="mb-6 text-center">
        <label className="text-sm font-medium mr-2">Filter by User:</label>
        <select
          value={selectedUser}
          onChange={(e) => setSelectedUser(e.target.value)}
          className="p-2 rounded border border-gray-300 dark:bg-[#0f172a] dark:border-gray-700"
        >
          <option value="All">All</option>
          {users.map((user) => (
            <option key={user._id} value={user.name}>
              {user.name}
            </option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-10">
        {/* ✅ Area Chart for Credit Balance */}
        <div className="bg-white dark:bg-[#0f172a] p-4 rounded shadow">
          <h3 className="text-lg font-semibold mb-3">User Credit Balance</h3>
          <ResponsiveContainer width="100%" height={250}>
            <AreaChart
              data={creditBalanceData}
              margin={{ top: 20, right: 30, left: 10, bottom: 0 }}
            >
              <defs>
                <linearGradient id="creditGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.7} />
                  <stop offset="100%" stopColor="#3b82f6" stopOpacity={0.1} />
                </linearGradient>
              </defs>
              <XAxis dataKey="name" stroke={axisColor} />
              <YAxis stroke={axisColor} allowDecimals={false} />
              <CartesianGrid strokeDasharray="3 3" />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Area
                type="monotone"
                dataKey="creditBalance"
                stroke="#3b82f6"
                fill="url(#creditGradient)"
                name="Credit Balance"
                strokeWidth={2}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* 🥧 Pie Chart */}
        <div className="bg-white dark:bg-[#0f172a] p-4 rounded shadow">
          <h3 className="text-lg font-semibold mb-3">
            User Credit Distribution
          </h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                dataKey="value"
                data={pieData}
                cx="50%"
                cy="50%"
                outerRadius={80}
                label
              >
                {pieData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* 📊 Bar Chart */}
        <div className="bg-white dark:bg-[#0f172a] p-4 rounded shadow">
          <h3 className="text-lg font-semibold mb-3">
            Total Image Uploaded by User
          </h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={barChartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" stroke={axisColor} />
              <YAxis stroke={axisColor} allowDecimals={false} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="uploads" fill="#82ca9d" name="Images Uploaded" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default AdminCharts;
