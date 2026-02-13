async function connectDB() {
  // No-op: MongoDB removed. Supabase is used as data/auth backend.
  return Promise.resolve();
}

module.exports = connectDB;