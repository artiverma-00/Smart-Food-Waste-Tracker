import { supabase } from "./supabase";

function mapUser(user) {
  if (!user) return null;
  return {
    id: user.id,
    email: user.email,
    name: user.user_metadata?.name || user.email?.split("@")[0] || "User",
  };
}

function normalizeAuthError(error, mode) {
  const status = error?.status;
  const message = (error?.message || "").toLowerCase();

  if (status === 429) {
    return new Error("Too many attempts. Please wait a minute and try again.");
  }

  if (mode === "register") {
    if (status === 422) {
      return new Error("Please use a valid email and a stronger password (at least 6 characters).");
    }
    if (message.includes("already registered") || message.includes("already been registered")) {
      return new Error("This email is already registered. Please login instead.");
    }
  }

  if (mode === "login") {
    if (status === 400) {
      return new Error("Invalid email/password or email not confirmed yet.");
    }
  }

  return new Error(error?.message || "Authentication failed");
}

export async function getCurrentSession() {
  const { data, error } = await supabase.auth.getSession();
  if (error) throw error;

  const session = data.session;
  return {
    token: session?.access_token || null,
    user: mapUser(session?.user || null),
  };
}

export function onAuthStateChange(callback) {
  return supabase.auth.onAuthStateChange((_event, session) => {
    callback({
      token: session?.access_token || null,
      user: mapUser(session?.user || null),
    });
  });
}

export async function login(payload) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email: payload.email,
    password: payload.password,
  });

  if (error) throw normalizeAuthError(error, "login");

  return {
    token: data.session?.access_token || null,
    user: mapUser(data.user),
  };
}

export async function register(payload) {
  const { data, error } = await supabase.auth.signUp({
    email: payload.email,
    password: payload.password,
    options: {
      data: {
        name: payload.name,
      },
    },
  });

  if (error) throw normalizeAuthError(error, "register");

  return {
    token: data.session?.access_token || null,
    user: mapUser(data.user),
  };
}

export async function updateProfile(payload) {
  const updates = {};
  if (payload.name) updates.data = { name: payload.name };
  if (payload.email) updates.email = payload.email;

  const { data, error } = await supabase.auth.updateUser(updates);
  if (error) throw error;

  return {
    user: mapUser(data.user),
  };
}

export async function logout() {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}
