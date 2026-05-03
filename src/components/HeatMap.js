"use client";
import { useSession } from "@/context/SessionContext";
import styles from "./HeatMap.module.css";

export default function HeatMap() {
  const { heatmapSnapshots, students } = useSession();

  if (heatmapSnapshots.length === 0) {
    return (
      <div className={styles.container}>
        <div className={styles.heading}>
          <span className={styles.headingDot} />
          Attention Heat Map
        </div>
        <div className={styles.empty}>
          Heat map updates every 30 seconds. First snapshot loading...
        </div>
      </div>
    );
  }

  const allIds = students.map((s) => ({ id: s.id, name: s.name }));

  return (
    <div className={styles.container}>
      <div className={styles.heading}>
        <span className={styles.headingDot} />
        Attention Heat Map (30s intervals)
      </div>
      <div className={styles.grid}>
        {allIds.map(({ id, name }) => (
          <div key={id} className={styles.row}>
            <div className={styles.label} title={name}>{name}</div>
            {heatmapSnapshots.map((snap, i) => {
              const entry = snap.data.find((d) => d.id === id);
              const cls = entry
                ? styles[`cell${entry.engagement.charAt(0).toUpperCase() + entry.engagement.slice(1)}`]
                : styles.cellEmpty;
              return (
                <div
                  key={i}
                  className={`${styles.cell} ${cls}`}
                  title={`${name} @ ${snap.time.toLocaleTimeString()}: ${entry?.engagement || "N/A"}`}
                />
              );
            })}
          </div>
        ))}
      </div>
      <div className={styles.legend}>
        <div className={styles.legendItem}>
          <div className={`${styles.legendDot} ${styles.cellEngaged}`} /> Engaged
        </div>
        <div className={styles.legendItem}>
          <div className={`${styles.legendDot} ${styles.cellNeutral}`} /> Neutral
        </div>
        <div className={styles.legendItem}>
          <div className={`${styles.legendDot} ${styles.cellLost}`} /> Lost
        </div>
      </div>
    </div>
  );
}
