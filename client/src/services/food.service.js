import api from "./api";

function unwrapResponse(data, fallback) {
  if (!data?.success) {
    throw new Error(data?.message || fallback);
  }
  return data.data;
}

export async function getFoods() {
  const { data } = await api.get("/food");
  return unwrapResponse(data, "Failed to fetch foods").items || [];
}

export async function createFood(payload) {
  const { data } = await api.post("/food", payload);
  return unwrapResponse(data, "Failed to create food");
}

export async function updateFood(id, payload) {
  const { data } = await api.put(`/food/${id}`, payload);
  return unwrapResponse(data, "Failed to update food");
}

export async function markFoodStatus(id, status) {
  const { data } = await api.patch(`/food/${id}/status`, { status });
  return unwrapResponse(data, "Failed to update food status");
}

export async function deleteFood(id) {
  const { data } = await api.delete(`/food/${id}`);
  return unwrapResponse(data, "Failed to delete food");
}