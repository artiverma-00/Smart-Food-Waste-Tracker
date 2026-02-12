import { useMemo, useState } from "react";
import { Calendar, PackagePlus, Shapes } from "lucide-react";
import Button from "../common/Button";
import Input from "../common/Input";

const initialForm = {
  name: "",
  category: "Vegetables",
  quantity: "",
  expiryDate: "",
};

const categories = ["Vegetables", "Fruits", "Dairy", "Meat", "Grains", "Other"];

export default function AddFoodForm({ onSubmit, submitting }) {
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});

  const isValid = useMemo(
    () => form.name.trim() && form.quantity > 0 && form.expiryDate,
    [form]
  );

  const validate = () => {
    const nextErrors = {};
    if (!form.name.trim()) nextErrors.name = "Food name is required";
    if (!form.quantity || Number(form.quantity) <= 0) nextErrors.quantity = "Quantity must be greater than 0";
    if (!form.expiryDate) nextErrors.expiryDate = "Expiry date is required";
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!validate()) return;

    await onSubmit({
      ...form,
      quantity: Number(form.quantity),
    });
    setForm(initialForm);
    setErrors({});
  };

  return (
    <form onSubmit={handleSubmit} className="glass-card space-y-4">
      <h2 className="text-lg font-semibold">Add Food Item</h2>
      <Input
        label="Food Name"
        icon={PackagePlus}
        placeholder="Spinach, Milk, Apples"
        value={form.name}
        onChange={(event) => setForm((prev) => ({ ...prev, name: event.target.value }))}
        error={errors.name}
      />

      <label className="block space-y-2">
        <span className="text-sm font-medium text-slate-700 dark:text-slate-200">Category</span>
        <div className="relative">
          <Shapes className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <select
            value={form.category}
            onChange={(event) => setForm((prev) => ({ ...prev, category: event.target.value }))}
            className="w-full rounded-2xl border border-white/30 bg-white/70 py-3 pl-10 pr-4 text-sm shadow-glass outline-none focus:ring-2 focus:ring-brand-200 dark:border-slate-700 dark:bg-slate-900/70"
          >
            {categories.map((category) => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
        </div>
      </label>

      <Input
        type="number"
        min="1"
        label="Quantity"
        placeholder="1"
        value={form.quantity}
        onChange={(event) => setForm((prev) => ({ ...prev, quantity: event.target.value }))}
        error={errors.quantity}
      />

      <Input
        type="date"
        icon={Calendar}
        label="Expiry Date"
        value={form.expiryDate}
        onChange={(event) => setForm((prev) => ({ ...prev, expiryDate: event.target.value }))}
        error={errors.expiryDate}
      />

      <Button type="submit" disabled={!isValid || submitting} className="w-full">
        {submitting ? "Saving..." : "Save Food"}
      </Button>
    </form>
  );
}