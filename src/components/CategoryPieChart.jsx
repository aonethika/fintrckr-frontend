import React, { useMemo } from "react";
import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";

const COLORS = [
  "#6366f1",
  "#10b981",
  "#dfb977",
  "#ef4444",
  "#8b5cf6",
  "#10312d",
  "#cb6d2a",
  "#3b82f6",
  "#64748b",
  "#f59e0b",
  "#14b8a6",
  "#e11d48"
];

function CategoryPieChart({ expenses = [] }) {

  /* ===== BUILD CATEGORY TOTALS DYNAMICALLY ===== */
  const data = useMemo(() => {
    const totals = {};

    expenses.forEach((exp) => {
      let category = exp.category?.trim() || "Other";

      // normalize same way backend does
      category =
        category.charAt(0).toUpperCase() +
        category.slice(1).toLowerCase();

      if (!totals[category]) {
        totals[category] = 0;
      }

      totals[category] += Number(exp.amount);
    });

    return Object.entries(totals).map(([name, value]) => ({
      name,
      value
    }));
  }, [expenses]);

  /* ===== TOTAL FOR % CALC ===== */
  const total = data.reduce((sum, item) => sum + item.value, 0);

  if (!data.length) {
    return <p>No expense data</p>;
  }

  return (
    <PieChart width={500} height={300}>
      <Pie
        data={data}
        dataKey="value"
        nameKey="name"
        cx="50%"
        cy="50%"
        outerRadius={100}
        label={(entry) =>
          `${entry.name} (${((entry.value / total) * 100).toFixed(0)}%)`
        }
      >
        {data.map((entry, index) => (
          <Cell
            key={entry.name}
            fill={COLORS[index % COLORS.length]}
          />
        ))}
      </Pie>

      <Tooltip />
      <Legend />
    </PieChart>
  );
}

export default CategoryPieChart;