"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import { AlertTriangle } from "lucide-react";

type ConfirmDialogProps = {
  open: boolean;
  title: string;
  description?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  destructive?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
};

/** App-styled replacement for window.confirm(), rendered via portal. */
export default function ConfirmDialog({
  open,
  title,
  description,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  destructive = true,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onCancel();
      if (e.key === "Enter") onConfirm();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onCancel, onConfirm]);

  if (!mounted) return null;

  return createPortal(
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
          className="fixed inset-0 z-[200] flex items-center justify-center bg-navy-dark/60 backdrop-blur-sm px-4"
          onClick={onCancel}
        >
          <motion.div
            initial={{ opacity: 0, y: 12, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.98 }}
            transition={{ duration: 0.18, ease: "easeOut" }}
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="confirm-dialog-title"
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-sm rounded-2xl bg-white shadow-2xl shadow-navy-dark/40 border border-navy/10 p-6"
          >
            <div className="flex items-start gap-3">
              <span
                className={`flex-shrink-0 flex items-center justify-center w-10 h-10 rounded-full ${
                  destructive ? "bg-red-50 text-red-500" : "bg-gold/10 text-gold"
                }`}
              >
                <AlertTriangle className="w-5 h-5" />
              </span>
              <div className="min-w-0 pt-1">
                <h3
                  id="confirm-dialog-title"
                  className="font-heading text-base font-bold text-navy"
                >
                  {title}
                </h3>
                {description && (
                  <p className="mt-1.5 text-sm text-navy/60 leading-relaxed">
                    {description}
                  </p>
                )}
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-2.5">
              <button
                onClick={onCancel}
                className="px-4 py-2 rounded-lg text-sm font-medium text-navy/70 hover:bg-navy/5 transition-colors"
              >
                {cancelLabel}
              </button>
              <button
                onClick={onConfirm}
                className={`px-4 py-2 rounded-lg text-sm font-semibold text-white transition-colors ${
                  destructive
                    ? "bg-red-500 hover:bg-red-600"
                    : "bg-navy hover:bg-navy-light"
                }`}
              >
                {confirmLabel}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
}
