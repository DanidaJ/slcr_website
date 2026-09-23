"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import { AlertCircle, AlertTriangle } from "lucide-react";

type ConfirmDialogProps = {
  open: boolean;
  title: string;
  description?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  destructive?: boolean;
  /** Alert mode: a single acknowledge button, like window.alert(). */
  hideCancel?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
};

/** App-styled replacement for window.confirm() / window.alert(), rendered via portal. */
export default function ConfirmDialog({
  open,
  title,
  description,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  destructive = true,
  hideCancel = false,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const panelRef = useRef<HTMLDivElement>(null);
  const confirmRef = useRef<HTMLButtonElement>(null);

  // Move focus into the dialog while open and hand it back on close.
  useEffect(() => {
    if (!open || !mounted) return;
    const previous = document.activeElement as HTMLElement | null;
    confirmRef.current?.focus();
    return () => {
      if (previous?.isConnected) previous.focus();
    };
  }, [open, mounted]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      const panel = panelRef.current;
      if (e.key === "Escape") {
        e.preventDefault();
        onCancel();
      } else if (e.key === "Enter") {
        // A focused dialog button already handles Enter itself.
        if (e.target instanceof HTMLButtonElement && panel?.contains(e.target)) return;
        e.preventDefault();
        onConfirm();
      } else if (e.key === "Tab" && panel) {
        // Keep keyboard focus inside the dialog.
        const buttons = Array.from(panel.querySelectorAll("button"));
        const first = buttons[0];
        const last = buttons[buttons.length - 1];
        const active = document.activeElement;
        if (!panel.contains(active) || (e.shiftKey ? active === first : active === last)) {
          e.preventDefault();
          (e.shiftKey ? last : first)?.focus();
        }
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onCancel, onConfirm]);

  if (!mounted) return null;

  const Icon = hideCancel ? AlertCircle : AlertTriangle;

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
            ref={panelRef}
            initial={{ opacity: 0, y: 12, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.98 }}
            transition={{ duration: 0.18, ease: "easeOut" }}
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="confirm-dialog-title"
            aria-describedby={description ? "confirm-dialog-description" : undefined}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-sm rounded-2xl bg-white shadow-2xl shadow-navy-dark/40 border border-navy/10 p-6"
          >
            <div className="flex items-start gap-3">
              <span
                className={`flex-shrink-0 flex items-center justify-center w-10 h-10 rounded-full ${
                  destructive ? "bg-red-50 text-red-500" : "bg-gold/10 text-gold"
                }`}
              >
                <Icon className="w-5 h-5" />
              </span>
              <div className="min-w-0 pt-1">
                <h3
                  id="confirm-dialog-title"
                  className="font-heading text-base font-bold text-navy"
                >
                  {title}
                </h3>
                {description && (
                  <p
                    id="confirm-dialog-description"
                    className="mt-1.5 text-sm text-navy/60 leading-relaxed break-words"
                  >
                    {description}
                  </p>
                )}
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-2.5">
              {!hideCancel && (
                <button
                  onClick={onCancel}
                  className="px-4 py-2 rounded-lg text-sm font-medium text-navy/70 hover:bg-navy/5 transition-colors"
                >
                  {cancelLabel}
                </button>
              )}
              <button
                ref={confirmRef}
                onClick={onConfirm}
                className={`px-4 py-2 rounded-lg text-sm font-semibold text-white transition-colors outline-none focus-visible:ring-2 focus-visible:ring-offset-2 ${
                  destructive && !hideCancel
                    ? "bg-red-500 hover:bg-red-600 focus-visible:ring-red-300"
                    : "bg-navy hover:bg-navy-light focus-visible:ring-gold/60"
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
