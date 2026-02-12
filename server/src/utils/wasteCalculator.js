function getExpiryState(expiryDate, status) {
  if (status === "consumed") return "Consumed";
  if (status === "wasted") return "Wasted";

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const target = new Date(expiryDate);
  target.setHours(0, 0, 0, 0);

  const diffDays = Math.ceil((target - today) / (1000 * 60 * 60 * 24));

  if (diffDays < 0) return "Expired";
  if (diffDays <= 2) return "Near Expiry";
  return "Fresh";
}

function calculateWastePercentage(totalConsumed, totalWasted) {
  const denominator = totalConsumed + totalWasted;
  if (!denominator) return 0;
  return Number(((totalWasted / denominator) * 100).toFixed(2));
}

module.exports = {
  getExpiryState,
  calculateWastePercentage,
};