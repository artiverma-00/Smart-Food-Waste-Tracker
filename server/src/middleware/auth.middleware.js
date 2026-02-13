const { supabaseAnon } = require("../config/supabase");

async function authMiddleware(req, res, next) {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized: token missing",
        data: {},
      });
    }

    const token = authHeader.split(" ")[1];

    const { data, error } = await supabaseAnon.auth.getUser(token);

    if (error || !data?.user) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized: invalid token",
        data: {},
      });
    }

    req.user = {
      userId: data.user.id,
      email: data.user.email,
      name: data.user.user_metadata?.name || data.user.email?.split("@")[0] || "User",
      token,
    };

    return next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized",
      data: {},
    });
  }
}

module.exports = authMiddleware;