const { createClient } = require("@supabase/supabase-js");
const config = require("./index");

const supabaseAnon = createClient(config.supabaseUrl, config.supabaseAnonKey);

const supabaseAdmin = createClient(
  config.supabaseUrl,
  config.supabaseServiceRoleKey || config.supabaseAnonKey
);

function userScopedClient(accessToken) {
  return createClient(config.supabaseUrl, config.supabaseAnonKey, {
    global: {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    },
  });
}

module.exports = {
  supabaseAnon,
  supabaseAdmin,
  userScopedClient,
};