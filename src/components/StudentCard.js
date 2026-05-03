"use client";
import { useSession } from "@/context/SessionContext";
import { useToast } from "@/context/ToastContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import styles from "./StudentCard.module.css";

export default function StudentCard({ student }) {
  const { setEngagement } = useSession();
  const { addToast } = useToast();
  const router = useRouter();
  const [disengagedTime, setDisengagedTime] = useState(null);

  useEffect(() => {
    if (!student.disengagedSince) {
      setDisengagedTime(null);
      return;
    }
    const update = () => {
      const secs = Math.floor((Date.now() - student.disengagedSince.getTime()) / 1000);
      setDisengagedTime(secs);
    };
    update();
    const id = setInterval(update, 1000);
    return () => clearInterval(id);
  }, [student.disengagedSince]);

  const isPulsing = disengagedTime !== null && disengagedTime > 180;

  const statusClass = styles[student.engagement];
  const badgeClass = styles[`status${student.engagement.charAt(0).toUpperCase() + student.engagement.slice(1)}`];

  const formatTimer = (secs) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${String(s).padStart(2, "0")}`;
  };

  const handleRate = (e, status) => {
    e.stopPropagation();
    setEngagement(student.id, status);
    const labels = { engaged: "Engaged", neutral: "Neutral", lost: "Lost" };
    const types = { engaged: "success", neutral: "warning", lost: "error" };
    addToast(`${student.name} marked as ${labels[status]}`, types[status]);
  };

  return (
    <div
      className={`${styles.card} ${statusClass} ${isPulsing ? "pulse" : ""}`}
      onClick={() => router.push(`/student/${student.id}`)}
    >
      {student.flagged && <span className={styles.flagIcon}>🚩</span>}
      <div className={styles.header}>
        <div>
          <div className={styles.name}>{student.name}</div>
          <div className={styles.roll}>{student.rollNumber}</div>
        </div>
        <span className={`${styles.statusBadge} ${badgeClass}`}>
          {student.engagement}
        </span>
      </div>

      {disengagedTime !== null && (
        <div className={styles.timer}>
          <span className={styles.timerDot} />
          Disengaged: {formatTimer(disengagedTime)}
        </div>
      )}

      <div className={styles.buttons}>
        <button
          className={`${styles.engBtn} ${styles.engBtnEngaged} ${student.engagement === "engaged" ? styles.engBtnActive : ""}`}
          onClick={(e) => handleRate(e, "engaged")}
          title="Mark Engaged"
        >
          ✓ Engaged
        </button>
        <button
          className={`${styles.engBtn} ${styles.engBtnNeutral} ${student.engagement === "neutral" ? styles.engBtnActive : ""}`}
          onClick={(e) => handleRate(e, "neutral")}
          title="Mark Neutral"
        >
          — Neutral
        </button>
        <button
          className={`${styles.engBtn} ${styles.engBtnLost} ${student.engagement === "lost" ? styles.engBtnActive : ""}`}
          onClick={(e) => handleRate(e, "lost")}
          title="Mark Lost"
        >
          ✗ Lost
        </button>
      </div>
    </div>
  );
}
