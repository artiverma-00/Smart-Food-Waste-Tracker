import api from "./api";

function unwrapResponse(data, fallback) {
  if (!data?.success) {
    throw new Error(data?.message || fallback);
  }
  return data.data;
}

export async function login(payload) {
  const { data } = await api.post("/auth/login", payload);
  return unwrapResponse(data, "Login failed");
}

export async function register(payload) {
  const { data } = await api.post("/auth/register", payload);
  return unwrapResponse(data, "Registration failed");
}

export async function getCurrentSession() {
  const token = localStorage.getItem("token");
  const rawUser = localStorage.getItem("user");
  return {
    token: token || null,
    user: rawUser ? JSON.parse(rawUser) : null,
  };
}

export function onAuthStateChange(callback) {
  callback({
    token: localStorage.getItem("token"),
    user: (() => {
      const raw = localStorage.getItem("user");
      return raw ? JSON.parse(raw) : null;
    })(),
  });

  return {
    data: {
      subscription: {
        unsubscribe() {},
      },
    },
  };
}

export async function updateProfile(payload) {
  const { data } = await api.put("/auth/profile", payload);
  return unwrapResponse(data, "Profile update failed");
}

export async function logout() {
  return Promise.resolve();
}