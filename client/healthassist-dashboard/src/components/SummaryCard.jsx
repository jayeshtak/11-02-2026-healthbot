/**
 * 🔹 SummaryCard component
 * Displays a statistic card with optional subtitle and adapts to dark/light mode.
 *
 * @param {string} title - The title of the card (e.g., "Total Conversations")
 * @param {string|number} value - Main numeric/statistical value to display
 * @param {string} [subtitle] - Optional smaller text below the main value
 * @param {boolean} darkMode - Whether dark mode is enabled
 */

export default function SummaryCard({ title, value, subtitle, darkMode }) {
  return (
    <div
      className={`
        rounded-2xl
        p-8
        transition-all duration-200
        ${darkMode
          ? "bg-[#111827] border border-gray-800 shadow-sm"
          : "bg-white border border-gray-500 shadow-sm"

        }
      `}
    >
      <p className="text-[11px] uppercase tracking-widest font-medium text-gray-400 mb-5">
        {title}
      </p>

      <p className="text-4xl font-semibold tracking-tight">
        {value}
      </p>

      {subtitle && (
        <p className="mt-2 text-sm text-gray-500">
          {subtitle}
        </p>
      )}
    </div>
  );
}
