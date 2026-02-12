import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import Button from "./Button";

export default function Modal({ isOpen, onClose, title, children }) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4 backdrop-blur-sm"
        >
          <motion.div
            initial={{ y: 20, opacity: 0, scale: 0.98 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 20, opacity: 0, scale: 0.98 }}
            className="w-full max-w-lg rounded-2xl border border-white/20 bg-white/80 p-6 shadow-glass dark:border-slate-700 dark:bg-slate-900/80"
          >
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-semibold">{title}</h3>
              <Button variant="ghost" size="sm" onClick={onClose}>
                <X className="h-4 w-4" />
              </Button>
            </div>
            {children}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}