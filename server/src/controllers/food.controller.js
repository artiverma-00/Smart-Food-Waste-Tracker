const { supabaseAdmin } = require("../config/supabase");
const { getExpiryState } = require("../utils/wasteCalculator");

function mapFood(row) {
  return {
    id: row.id,
    userId: row.user_id,
    name: row.name,
    category: row.category,
    quantity: row.quantity,
    expiryDate: row.expiry_date,
    status: row.status,
    expiryStatus: getExpiryState(row.expiry_date, row.status),
    notes: row.notes || "",
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

async function addFood(req, res, next) {
  try {
    const payload = {
      user_id: req.user.userId,
      name: req.body.name,
      category: req.body.category,
      quantity: req.body.quantity,
      expiry_date: req.body.expiryDate,
      notes: req.body.notes || "",
      status: "active",
    };

    const { data, error } = await supabaseAdmin
      .from("foods")
      .insert([payload])
      .select("*")
      .single();

    if (error) {
      return res.status(400).json({ success: false, message: error.message, data: {} });
    }

    return res.status(201).json({
      success: true,
      message: "Food item added successfully",
      data: { item: mapFood(data) },
    });
  } catch (error) {
    return next(error);
  }
}

async function getFoods(req, res, next) {
  try {
    const { data, error } = await supabaseAdmin
      .from("foods")
      .select("*")
      .eq("user_id", req.user.userId)
      .order("created_at", { ascending: false });

    if (error) {
      return res.status(400).json({ success: false, message: error.message, data: {} });
    }

    return res.status(200).json({
      success: true,
      message: "Food items fetched successfully",
      data: { items: (data || []).map(mapFood) },
    });
  } catch (error) {
    return next(error);
  }
}

async function updateFood(req, res, next) {
  try {
    const update = {
      ...(req.body.name !== undefined ? { name: req.body.name } : {}),
      ...(req.body.category !== undefined ? { category: req.body.category } : {}),
      ...(req.body.quantity !== undefined ? { quantity: req.body.quantity } : {}),
      ...(req.body.expiryDate !== undefined ? { expiry_date: req.body.expiryDate } : {}),
      ...(req.body.notes !== undefined ? { notes: req.body.notes } : {}),
      updated_at: new Date().toISOString(),
    };

    const { data, error } = await supabaseAdmin
      .from("foods")
      .update(update)
      .eq("id", req.params.id)
      .eq("user_id", req.user.userId)
      .select("*")
      .single();

    if (error) {
      return res.status(400).json({ success: false, message: error.message, data: {} });
    }

    return res.status(200).json({
      success: true,
      message: "Food item updated successfully",
      data: { item: mapFood(data) },
    });
  } catch (error) {
    return next(error);
  }
}

async function deleteFood(req, res, next) {
  try {
    const { error } = await supabaseAdmin
      .from("foods")
      .delete()
      .eq("id", req.params.id)
      .eq("user_id", req.user.userId);

    if (error) {
      return res.status(400).json({ success: false, message: error.message, data: {} });
    }

    return res.status(200).json({
      success: true,
      message: "Food item deleted successfully",
      data: {},
    });
  } catch (error) {
    return next(error);
  }
}

async function markFoodStatus(req, res, next) {
  try {
    const { status } = req.body;

    const update = {
      status,
      updated_at: new Date().toISOString(),
      ...(status === "consumed" ? { consumed_at: new Date().toISOString(), wasted_at: null } : {}),
      ...(status === "wasted" ? { wasted_at: new Date().toISOString(), consumed_at: null } : {}),
    };

    const { data, error } = await supabaseAdmin
      .from("foods")
      .update(update)
      .eq("id", req.params.id)
      .eq("user_id", req.user.userId)
      .select("*")
      .single();

    if (error) {
      return res.status(400).json({ success: false, message: error.message, data: {} });
    }

    return res.status(200).json({
      success: true,
      message: `Food marked as ${status}`,
      data: { item: mapFood(data) },
    });
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  addFood,
  getFoods,
  updateFood,
  deleteFood,
  markFoodStatus,
};