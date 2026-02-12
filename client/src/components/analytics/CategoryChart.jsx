import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";

const COLORS = ["#10b981", "#34d399", "#6ee7b7", "#059669", "#047857"];

export default function CategoryChart({ data }) {
  return (
    <div className="glass-card">
      <h3 className="mb-3 text-base font-semibold sm:text-lg">Waste by Category</h3>
      <div className="h-56 sm:h-64">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie data={data} dataKey="value" nameKey="name" innerRadius={45} outerRadius={85} paddingAngle={3}>
              {data.map((entry, index) => (
                <Cell key={entry.name} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
