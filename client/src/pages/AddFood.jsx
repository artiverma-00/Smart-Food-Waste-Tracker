import { useState } from "react";
import { motion } from "framer-motion";
import AddFoodForm from "../components/food/AddFoodForm";
import * as foodService from "../services/food.service";

export default function AddFood() {
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");

  const handleSubmit = async (payload) => {
    setSubmitting(true);
    setMessage("");
    try {
      await foodService.createFood(payload);
      setMessage("Food item added successfully.");
    } catch {
      setMessage("Could not add item right now. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="mx-auto max-w-2xl space-y-4">
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
        <AddFoodForm onSubmit={handleSubmit} submitting={submitting} />
      </motion.div>
      {message && <p className="text-center text-sm text-brand-700 dark:text-brand-300">{message}</p>}
    </section>
  );
}