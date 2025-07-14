import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { UserCircle, LayoutDashboard, TrendingUp } from "lucide-react"; // icons

import AdminCharts from "../component/AdminCharts";
import TransactionCharts from "../component/TransactionCharts";
import UserCharts from "../component/UserCharts";

const TABS = [
  { id: "user", label: "User Data", icon: <UserCircle size={20} /> },
  { id: "admin", label: "All Data", icon: <LayoutDashboard size={20} /> },
  { id: "transaction", label: "Transactions", icon: <TrendingUp size={20} /> },
];

const AdminDashBoard = () => {
  const [activeTab, setActiveTab] = useState("user");

  // Load from localStorage
  useEffect(() => {
    const stored = localStorage.getItem("activeTab");
    if (stored) setActiveTab(stored);
  }, []);

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem("activeTab", activeTab);
  }, [activeTab]);

  const renderTabComponent = () => {
    switch (activeTab) {
      case "user":
        return <UserCharts />;
      case "admin":
        return <AdminCharts />;
      case "transaction":
        return <TransactionCharts />;
      default:
        return null;
    }
  };

  return (
    <div className="p-6 min-h-screen  text-gray-800 dark:text-white">
      {/* Tab Buttons */}
      <div className="flex justify-center gap-4 mb-8 flex-wrap">
        {TABS.map((tab) => (
          <motion.button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`relative group px-5 py-2 rounded-lg font-semibold transition-all flex items-center gap-2 ${
              activeTab === tab.id
                ? "bg-indigo-600 text-white shadow-md"
                : "bg-gray-200 dark:bg-[#0f172a] hover:bg-gray-300 dark:hover:bg-gray-700 text-gray-800 dark:text-gray-200"
            }`}
          >
            {tab.icon}
            {tab.label}

            {/* Tooltip */}
            <span className="absolute -top-8 left-1/2 transform -translate-x-1/2 scale-0 group-hover:scale-100 transition-all text-xs bg-gray-800 text-white px-2 py-1 rounded-md whitespace-nowrap z-10">
              View {tab.label}
            </span>
          </motion.button>
        ))}
      </div>

      {/* Chart Animation */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
        >
          {renderTabComponent()}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default AdminDashBoard;
