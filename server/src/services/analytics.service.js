const { supabaseAdmin } = require("../config/supabase");
const { calculateWastePercentage } = require("../utils/wasteCalculator");

async function listUserFoods(userId) {
  const { data, error } = await supabaseAdmin
    .from("foods")
    .select("category, quantity, status, created_at, wasted_at, updated_at")
    .eq("user_id", userId);

  if (error) throw new Error(error.message);
  return data || [];
}

async function getOverview(userId) {
  const rows = await listUserFoods(userId);

  const totalAdded = rows.reduce((sum, row) => sum + (row.quantity || 0), 0);
  const totalConsumed = rows
    .filter((row) => row.status === "consumed")
    .reduce((sum, row) => sum + (row.quantity || 0), 0);
  const totalWasted = rows
    .filter((row) => row.status === "wasted")
    .reduce((sum, row) => sum + (row.quantity || 0), 0);

  return {
    totalAdded,
    totalConsumed,
    totalWasted,
    wastePercentage: calculateWastePercentage(totalConsumed, totalWasted),
  };
}

async function getCategoryBreakdown(userId) {
  const rows = await listUserFoods(userId);
  const grouped = new Map();

  rows
    .filter((row) => row.status === "wasted")
    .forEach((row) => {
      const key = row.category || "Other";
      grouped.set(key, (grouped.get(key) || 0) + (row.quantity || 0));
    });

  return Array.from(grouped.entries()).map(([name, value]) => ({ name, value }));
}

async function getMonthlyWasteTrend(userId) {
  const rows = await listUserFoods(userId);
  const grouped = new Map();

  rows
    .filter((row) => row.status === "wasted")
    .forEach((row) => {
      const source = row.wasted_at || row.updated_at || row.created_at;
      const date = new Date(source);
      const key = `${String(date.getMonth() + 1).padStart(2, "0")}/${date.getFullYear()}`;
      grouped.set(key, (grouped.get(key) || 0) + (row.quantity || 0));
    });

  return Array.from(grouped.entries()).map(([name, waste]) => ({ name, waste }));
}

module.exports = {
  getOverview,
  getCategoryBreakdown,
  getMonthlyWasteTrend,
};