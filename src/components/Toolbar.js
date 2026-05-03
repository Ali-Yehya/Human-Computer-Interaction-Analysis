"use client";
import { useSession } from "@/context/SessionContext";
import { useToast } from "@/context/ToastContext";
import { useRouter } from "next/navigation";
import ThemeToggle from "./ThemeToggle";
import styles from "./Toolbar.module.css";

function formatTime(seconds) {
  const h = String(Math.floor(seconds / 3600)).padStart(2, "0");
  const m = String(Math.floor((seconds % 3600) / 60)).padStart(2, "0");
  const s = String(seconds % 60).padStart(2, "0");
  return `${h}:${m}:${s}`;
}

export default function Toolbar() {
  const { elapsed, paused, ended, markAllPresent, togglePause, endSession } = useSession();
  const { addToast } = useToast();
  const router = useRouter();

  const handleMarkAll = () => {
    markAllPresent();
    addToast("All students marked as engaged", "success");
  };

  const handlePause = () => {
    togglePause();
    addToast(paused ? "Session resumed" : "Session paused", "info");
  };

  const handleEnd = () => {
    if (window.confirm("Are you sure you want to end this session?")) {
      endSession();
      addToast("Session ended", "warning");
      router.push("/summary");
    }
  };

  return (
    <div className={styles.toolbar}>
      <div className={styles.left}>
        <div className={styles.title}>
          Classroom Engagement Monitor
          {paused && <span className={styles.pausedBadge}>Paused</span>}
        </div>
      </div>
      <div className={styles.timer}>{formatTime(elapsed)}</div>
      <div className={styles.actions}>
        <button
          className={`${styles.btn} ${styles.btnPresent}`}
          onClick={handleMarkAll}
          disabled={ended}
        >
          ✓ Mark All Present
        </button>
        <button
          className={`${styles.btn} ${paused ? styles.btnResume : styles.btnPause}`}
          onClick={handlePause}
          disabled={ended}
        >
          {paused ? "▶ Resume" : "⏸ Pause"}
        </button>
        <button
          className={`${styles.btn} ${styles.btnEnd}`}
          onClick={handleEnd}
          disabled={ended}
        >
          ⏹ End Class
        </button>
        <ThemeToggle />
      </div>
    </div>
  );
}
