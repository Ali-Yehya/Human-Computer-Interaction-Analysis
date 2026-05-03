"use client";
import { useSession } from "@/context/SessionContext";
import styles from "./AlertBanner.module.css";

export default function AlertBanner() {
  const { students } = useSession();
  const now = Date.now();

  const longDisengaged = students
    .filter((s) => s.disengagedSince && now - s.disengagedSince.getTime() > 3 * 60 * 1000)
    .sort((a, b) => a.disengagedSince.getTime() - b.disengagedSince.getTime());

  if (longDisengaged.length === 0) return null;

  const names = longDisengaged.map((s) => {
    const mins = Math.floor((now - s.disengagedSince.getTime()) / 60000);
    return `${s.name} (${mins}m)`;
  });

  return (
    <div className={styles.banner}>
      <span className={styles.icon}>⚠</span>
      <span>
        Disengaged &gt;3 min: {names.join(" · ")}
      </span>
    </div>
  );
}
