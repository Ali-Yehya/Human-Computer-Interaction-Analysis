"use client";
import { ThemeProvider } from "@/context/ThemeContext";
import { SessionProvider } from "@/context/SessionContext";
import { ToastProvider } from "@/context/ToastContext";
import ToastContainer from "@/components/Toast";

export default function ClientProvider({ children }) {
  return (
    <ThemeProvider>
      <ToastProvider>
        <SessionProvider>
          {children}
          <ToastContainer />
        </SessionProvider>
      </ToastProvider>
    </ThemeProvider>
  );
}
