const { supabaseAnon, userScopedClient } = require("../config/supabase");

function mapUser(user) {
  if (!user) return null;
  return {
    id: user.id,
    email: user.email,
    name: user.user_metadata?.name || user.email?.split("@")[0] || "User",
  };
}

async function register(req, res, next) {
  try {
    const { name, email, password } = req.body;

    const { data, error } = await supabaseAnon.auth.signUp({
      email,
      password,
      options: {
        data: { name },
      },
    });

    if (error) {
      return res.status(error.status || 400).json({
        success: false,
        message: error.message,
        data: {},
      });
    }

    return res.status(201).json({
      success: true,
      message: "User registered successfully",
      data: {
        user: mapUser(data.user),
        token: data.session?.access_token || null,
      },
    });
  } catch (error) {
    return next(error);
  }
}

async function login(req, res, next) {
  try {
    const { email, password } = req.body;

    const { data, error } = await supabaseAnon.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return res.status(error.status || 400).json({
        success: false,
        message: error.message,
        data: {},
      });
    }

    return res.status(200).json({
      success: true,
      message: "Login successful",
      data: {
        user: mapUser(data.user),
        token: data.session?.access_token || null,
      },
    });
  } catch (error) {
    return next(error);
  }
}

async function getProfile(req, res, next) {
  try {
    return res.status(200).json({
      success: true,
      message: "Profile fetched successfully",
      data: {
        user: {
          id: req.user.userId,
          email: req.user.email,
          name: req.user.name,
        },
      },
    });
  } catch (error) {
    return next(error);
  }
}

async function updateProfile(req, res, next) {
  try {
    const { name, email } = req.body;
    const scoped = userScopedClient(req.user.token);

    const updatePayload = {};
    if (name) updatePayload.data = { name };
    if (email) updatePayload.email = email;

    const { data, error } = await scoped.auth.updateUser(updatePayload);

    if (error) {
      return res.status(error.status || 400).json({
        success: false,
        message: error.message,
        data: {},
      });
    }

    return res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      data: {
        user: mapUser(data.user),
      },
    });
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  register,
  login,
  getProfile,
  updateProfile,
};