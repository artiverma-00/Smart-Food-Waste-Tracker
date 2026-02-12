import { forwardRef } from "react";
import { motion } from "framer-motion";

const variants = {
  primary:
    "bg-brand-600 text-white hover:bg-brand-700 shadow-soft dark:bg-brand-500 dark:hover:bg-brand-400",
  secondary:
    "bg-white/60 text-slate-900 hover:bg-white dark:bg-slate-900/50 dark:text-slate-100 dark:hover:bg-slate-900",
  ghost:
    "bg-transparent text-brand-700 hover:bg-brand-50 dark:text-brand-300 dark:hover:bg-slate-800",
  danger: "bg-rose-600 text-white hover:bg-rose-700",
};

const sizes = {
  sm: "h-9 px-3 text-sm",
  md: "h-11 px-4 text-sm",
  lg: "h-12 px-5 text-base",
};

const Button = forwardRef(
  ({ className = "", variant = "primary", size = "md", children, ...props }, ref) => (
    <motion.button
      ref={ref}
      whileTap={{ scale: 0.98 }}
      whileHover={{ y: -1 }}
      className={`inline-flex items-center justify-center rounded-2xl font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-brand-300 disabled:opacity-60 ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </motion.button>
  )
);

Button.displayName = "Button";

export default Button;