import { supabase } from "./supabase";

function startOfDay(date) {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
}

export async function getWasteOverview() {
  const today = startOfDay(new Date());
  const fromDate = new Date(today);
  fromDate.setDate(fromDate.getDate() - 6);

  const { data, error } = await supabase
    .from("foods")
    .select("quantity, updated_at")
    .eq("status", "wasted")
    .gte("updated_at", fromDate.toISOString())
    .order("updated_at", { ascending: true });

  if (error) throw error;

  const labels = [];
  const map = new Map();

  for (let i = 6; i >= 0; i -= 1) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const key = d.toISOString().slice(0, 10);
    const label = d.toLocaleDateString("en-US", { weekday: "short" });
    labels.push({ key, name: label });
    map.set(key, 0);
  }

  (data || []).forEach((row) => {
    const key = new Date(row.updated_at).toISOString().slice(0, 10);
    if (map.has(key)) {
      map.set(key, map.get(key) + (row.quantity || 0));
    }
  });

  return labels.map((item) => ({
    name: item.name,
    waste: map.get(item.key) || 0,
  }));
}

export async function getCategoryBreakdown() {
  const { data, error } = await supabase
    .from("foods")
    .select("category, quantity")
    .eq("status", "wasted");

  if (error) throw error;

  const grouped = new Map();

  (data || []).forEach((row) => {
    const key = row.category || "Other";
    grouped.set(key, (grouped.get(key) || 0) + (row.quantity || 0));
  });

  return Array.from(grouped.entries()).map(([name, value]) => ({ name, value }));
}