import { useState } from "react";
import { Mail, Save, UserRound } from "lucide-react";
import useAuth from "../hooks/useAuth";
import Input from "../components/common/Input";
import Button from "../components/common/Button";

export default function Profile() {
  const { user, updateProfile } = useAuth();
  const [form, setForm] = useState({
    name: user?.name || "",
    email: user?.email || "",
  });
  const [message, setMessage] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    await updateProfile(form);
    setMessage("Profile updated successfully.");
  };

  return (
    <section className="mx-auto max-w-xl">
      <form onSubmit={handleSubmit} className="glass-card space-y-4">
        <h2 className="text-xl font-semibold">Profile Settings</h2>
        <Input
          label="Full Name"
          icon={UserRound}
          value={form.name}
          onChange={(event) => setForm((prev) => ({ ...prev, name: event.target.value }))}
        />
        <Input
          label="Email"
          type="email"
          icon={Mail}
          value={form.email}
          onChange={(event) => setForm((prev) => ({ ...prev, email: event.target.value }))}
        />
        <Button type="submit"><Save className="mr-2 h-4 w-4" /> Save Changes</Button>
        {message && <p className="text-sm text-brand-700 dark:text-brand-300">{message}</p>}
      </form>
    </section>
  );
}