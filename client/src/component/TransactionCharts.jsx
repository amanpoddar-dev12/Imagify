import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import dayjs from "dayjs";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { AppContext } from "../context/AppContext";

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload || payload.length === 0) return null;

  return (
    <div className="bg-gray-800 text-white p-3 rounded shadow-lg border border-gray-700">
      <p className="text-sm text-gray-300 mb-1">
        {dayjs(label).format("MMM DD, YYYY")}
      </p>
      {payload.map((entry, i) => (
        <p key={i} style={{ color: entry.color }} className="text-sm">
          {entry.name}:{" "}
          {entry.name === "Total Sales"
            ? `₹${entry.value.toLocaleString()}`
            : entry.value}
        </p>
      ))}
    </div>
  );
};

const TransactionCharts = () => {
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [range, setRange] = useState({ from: null, to: null });
  const { backendUrl } = useContext(AppContext);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const res = await axios.get(`${backendUrl}/api/user/all-transactions`);

        const rawData = res.data.data;

        // Convert and group by date
        const grouped = {};

        rawData.forEach((tx) => {
          // Convert numeric timestamp to YYYY-MM-DD
          const date = dayjs(tx.date).format("YYYY-MM-DD");

          if (!grouped[date]) {
            grouped[date] = { date, count: 0, amount: 0 };
          }

          grouped[date].count += 1;
          grouped[date].amount += tx.amount || 0;
        });

        // Sort by date
        const sortedData = Object.values(grouped).sort(
          (a, b) => new Date(a.date) - new Date(b.date)
        );

        setChartData(sortedData);
        setRange({
          from: sortedData[0]?.date,
          to: sortedData[sortedData.length - 1]?.date,
        });
      } catch (err) {
        console.error("Error fetching transactions:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, []);

  if (loading)
    return <p className="text-blue-400 text-center">Loading chart...</p>;

  return (
    <div className="p-6 mt-10 bg-white dark:bg-[#0f172a] rounded-2xl shadow-2xl text-gray-900 dark:text-white">
      <h2 className="text-2xl font-bold mb-6 text-center">
        📊 Transactions from {dayjs(range.from).format("MMM DD, YYYY")} to{" "}
        {dayjs(range.to).format("MMM DD, YYYY")}
      </h2>

      <ResponsiveContainer width="100%" height={420}>
        <AreaChart
          data={chartData}
          margin={{ top: 20, right: 40, left: 20, bottom: 10 }}
        >
          <defs>
            <linearGradient id="amountGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#6366f1" stopOpacity={0.7} />
              <stop offset="100%" stopColor="#6366f1" stopOpacity={0.1} />
            </linearGradient>
            <linearGradient id="countGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#10b981" stopOpacity={0.7} />
              <stop offset="100%" stopColor="#10b981" stopOpacity={0.1} />
            </linearGradient>
          </defs>

          <CartesianGrid
            strokeDasharray="4 4"
            stroke="#e2e8f0"
            className="dark:stroke-[#1e293b]"
          />
          <XAxis
            dataKey="date"
            stroke="#334155"
            className="dark:stroke-slate-300"
          />
          <YAxis
            yAxisId="left"
            stroke="#334155"
            tickFormatter={(v) => `₹${v.toLocaleString()}`}
            className="dark:stroke-slate-300"
          />
          <YAxis
            yAxisId="right"
            orientation="right"
            stroke="#334155"
            className="dark:stroke-slate-300"
          />

          <Tooltip content={<CustomTooltip />} />

          <Legend />

          <Area
            yAxisId="left"
            type="monotone"
            dataKey="amount"
            name="Total Sales"
            stroke="#6366f1"
            fill="url(#amountGradient)"
            strokeWidth={2.5}
          />
          <Area
            yAxisId="right"
            type="monotone"
            dataKey="count"
            name="Number of Transactions"
            stroke="#10b981"
            fill="url(#countGradient)"
            strokeWidth={2.5}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default TransactionCharts;
