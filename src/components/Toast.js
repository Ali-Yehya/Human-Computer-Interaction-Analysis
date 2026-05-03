"use client";
import { useToast } from "@/context/ToastContext";
import styles from "./Toast.module.css";

const ICONS = {
  success: "✓",
  error: "✗",
  warning: "⚠",
  info: "ℹ",
};

export default function ToastContainer() {
  const { toasts, removeToast } = useToast();

  return (
    <div className={styles.container}>
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`${styles.toast} ${styles[toast.type] || styles.info}`}
          onClick={() => removeToast(toast.id)}
        >
          <span className={styles.icon}>{ICONS[toast.type] || ICONS.info}</span>
          {toast.message}
        </div>
      ))}
    </div>
  );
}
