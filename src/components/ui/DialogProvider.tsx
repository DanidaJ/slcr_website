"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
} from "react";
import ConfirmDialog from "@/components/ui/ConfirmDialog";

type ConfirmOptions = {
  title: string;
  description?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  destructive?: boolean;
};

type AlertOptions = {
  title: string;
  description?: string;
  buttonLabel?: string;
};

type DialogApi = {
  /** Resolves true if the user confirms, false if they cancel or dismiss. */
  confirm: (options: ConfirmOptions) => Promise<boolean>;
  /** Error notice with a single OK button; resolves once dismissed. */
  alert: (options: AlertOptions) => Promise<void>;
};

type DialogState = ConfirmOptions & { hideCancel: boolean };

const DialogContext = createContext<DialogApi | null>(null);

/**
 * Promise-based, app-styled replacements for window.confirm() and
 * window.alert(). Mounted once in the root layout; use via useDialog().
 */
export default function DialogProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [dialog, setDialog] = useState<DialogState | null>(null);
  const [open, setOpen] = useState(false);
  const resolveRef = useRef<((ok: boolean) => void) | null>(null);

  const show = useCallback((next: DialogState) => {
    // A newer dialog supersedes one that is still open.
    resolveRef.current?.(false);
    setDialog(next);
    setOpen(true);
    return new Promise<boolean>((resolve) => {
      resolveRef.current = resolve;
    });
  }, []);

  const close = useCallback((ok: boolean) => {
    resolveRef.current?.(ok);
    resolveRef.current = null;
    setOpen(false);
  }, []);

  const handleConfirm = useCallback(() => close(true), [close]);
  const handleCancel = useCallback(() => close(false), [close]);

  const api = useMemo<DialogApi>(
    () => ({
      confirm: (options) => show({ ...options, hideCancel: false }),
      alert: ({ buttonLabel = "OK", ...options }) =>
        show({
          ...options,
          confirmLabel: buttonLabel,
          destructive: true,
          hideCancel: true,
        }).then(() => undefined),
    }),
    [show]
  );

  return (
    <DialogContext.Provider value={api}>
      {children}
      <ConfirmDialog
        open={open}
        title={dialog?.title ?? ""}
        description={dialog?.description}
        confirmLabel={dialog?.confirmLabel}
        cancelLabel={dialog?.cancelLabel}
        destructive={dialog?.destructive}
        hideCancel={dialog?.hideCancel}
        onConfirm={handleConfirm}
        onCancel={handleCancel}
      />
    </DialogContext.Provider>
  );
}

export function useDialog(): DialogApi {
  const ctx = useContext(DialogContext);
  if (!ctx) throw new Error("useDialog must be used within <DialogProvider>.");
  return ctx;
}
