import { supabase } from "./supabase";

function mapFoodRow(row) {
  return {
    id: row.id,
    name: row.name,
    category: row.category,
    quantity: row.quantity,
    expiryDate: row.expiry_date,
    status: row.status,
    notes: row.notes || "",
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export async function getFoods() {
  const { data, error } = await supabase
    .from("foods")
    .select("id, name, category, quantity, expiry_date, status, notes, created_at, updated_at")
    .order("created_at", { ascending: false });

  if (error) throw error;
  return (data || []).map(mapFoodRow);
}

export async function createFood(payload) {
  const { data: authData, error: authError } = await supabase.auth.getUser();
  if (authError) throw authError;

  const userId = authData.user?.id;
  if (!userId) throw new Error("User is not authenticated");

  const { data, error } = await supabase
    .from("foods")
    .insert([
      {
        user_id: userId,
        name: payload.name,
        category: payload.category,
        quantity: payload.quantity,
        expiry_date: payload.expiryDate,
        status: "active",
        notes: payload.notes || "",
      },
    ])
    .select("id, name, category, quantity, expiry_date, status, notes, created_at, updated_at")
    .single();

  if (error) throw error;
  return { item: mapFoodRow(data) };
}

export async function updateFood(id, payload) {
  const update = {
    ...(payload.name !== undefined ? { name: payload.name } : {}),
    ...(payload.category !== undefined ? { category: payload.category } : {}),
    ...(payload.quantity !== undefined ? { quantity: payload.quantity } : {}),
    ...(payload.expiryDate !== undefined ? { expiry_date: payload.expiryDate } : {}),
    ...(payload.notes !== undefined ? { notes: payload.notes } : {}),
    updated_at: new Date().toISOString(),
  };

  const { data, error } = await supabase
    .from("foods")
    .update(update)
    .eq("id", id)
    .select("id, name, category, quantity, expiry_date, status, notes, created_at, updated_at")
    .single();

  if (error) throw error;
  return { item: mapFoodRow(data) };
}

export async function markFoodStatus(id, status) {
  const update = {
    status,
    updated_at: new Date().toISOString(),
    ...(status === "consumed" ? { consumed_at: new Date().toISOString(), wasted_at: null } : {}),
    ...(status === "wasted" ? { wasted_at: new Date().toISOString(), consumed_at: null } : {}),
  };

  const { data, error } = await supabase
    .from("foods")
    .update(update)
    .eq("id", id)
    .select("id, name, category, quantity, expiry_date, status, notes, created_at, updated_at")
    .single();

  if (error) throw error;
  return { item: mapFoodRow(data) };
}

export async function deleteFood(id) {
  const { error } = await supabase.from("foods").delete().eq("id", id);
  if (error) throw error;
  return {};
}