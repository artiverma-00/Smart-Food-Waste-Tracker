import api from "./api";

function unwrapResponse(data, fallback) {
  if (!data?.success) {
    throw new Error(data?.message || fallback);
  }
  return data.data;
}

export async function getWasteOverview() {
  const { data } = await api.get("/analytics/overview");
  const overview = unwrapResponse(data, "Failed to fetch overview");

  return [
    { name: "Mon", waste: Math.round((overview.totalWasted || 0) * 0.1) },
    { name: "Tue", waste: Math.round((overview.totalWasted || 0) * 0.12) },
    { name: "Wed", waste: Math.round((overview.totalWasted || 0) * 0.14) },
    { name: "Thu", waste: Math.round((overview.totalWasted || 0) * 0.16) },
    { name: "Fri", waste: Math.round((overview.totalWasted || 0) * 0.18) },
    { name: "Sat", waste: Math.round((overview.totalWasted || 0) * 0.15) },
    { name: "Sun", waste: Math.round((overview.totalWasted || 0) * 0.15) },
  ];
}

export async function getCategoryBreakdown() {
  const { data } = await api.get("/analytics/categories");
  return unwrapResponse(data, "Failed to fetch category analytics");
}