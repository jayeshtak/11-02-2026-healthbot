/**
 * 🔹 StatsChart component
 * Displays a responsive Pie Chart for language, intent, or WhatsApp stats.
 *
 * @param {string} title - The chart title (e.g., "Language Distribution")
 * @param {object} data - Stats object, e.g., { English: 25, Hindi: 25 }
 * @param {boolean} darkMode - Whether dark mode is enabled
 *
 * Uses Recharts for rendering charts.
 */

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { formatData } from "../utils/helpers";

export default function StatsChart({ title, data, darkMode }) {
  const formattedData = formatData(data);

  return (
    <div
      className={`
        rounded-2xl
        p-8
        ${darkMode
          ? "bg-[#111827] border border-gray-800 shadow-sm"
          : "bg-white border border-gray-500 shadow-sm"
        }
      `}
    >
      {/* Chart title */}
      <h2 className="text-lg font-semibold mb-6">
        {title}
      </h2>

      {formattedData.length > 0 ? (
        <ResponsiveContainer width="100%" height={280}>
          <PieChart>
            <Pie
              data={formattedData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              innerRadius={70}
              outerRadius={100}
              paddingAngle={3}
              cornerRadius={6}
            >
              {formattedData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={
                    index === 0
                      ? "#6366f1" // primary
                      : "#475569" // muted slate
                  }
                />
              ))}
            </Pie>

            <Tooltip
  contentStyle={{
    backgroundColor: darkMode ? "#111827" : "#ffffff",
    border: darkMode ? "1px solid #374151" : "1px solid #e5e7eb",
    borderRadius: "12px",
    fontSize: "14px",
    color: darkMode ? "#f3f4f6" : "#111827",
  }}
  itemStyle={{
    color: darkMode ? "#f3f4f6" : "#111827",
  }}
  labelStyle={{
    color: darkMode ? "#9ca3af" : "#374151",
  }}
/>

            <Legend
              verticalAlign="bottom"
              iconType="circle"
              wrapperStyle={{
                fontSize: "13px",
                marginTop: "12px",
                color: darkMode ? "#cbd5e1" : "#334155",
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      ) : (
        <p className="text-gray-400 text-center mt-20">
          No data available
        </p>
      )}
    </div>
  );
}