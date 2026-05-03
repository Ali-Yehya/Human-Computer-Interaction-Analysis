"use client";
import { useState } from "react";
import { useSession } from "@/context/SessionContext";
import Toolbar from "@/components/Toolbar";
import AlertBanner from "@/components/AlertBanner";
import StudentCard from "@/components/StudentCard";
import HeatMap from "@/components/HeatMap";
import AddStudentModal from "@/components/AddStudentModal";
import styles from "./page.module.css";

export default function Dashboard() {
  const { students } = useSession();
  const [showAddModal, setShowAddModal] = useState(false);

  const counts = students.reduce(
    (acc, s) => {
      acc[s.engagement]++;
      return acc;
    },
    { engaged: 0, neutral: 0, lost: 0 }
  );

  return (
    <div className={styles.dashboard}>
      <Toolbar />
      <AlertBanner />
      <div className={styles.content}>
        <div className={styles.engagementSummary}>
          <div className={`${styles.summaryChip} ${styles.chipEngaged}`}>
            ✓ {counts.engaged} Engaged
          </div>
          <div className={`${styles.summaryChip} ${styles.chipNeutral}`}>
            — {counts.neutral} Neutral
          </div>
          <div className={`${styles.summaryChip} ${styles.chipLost}`}>
            ✗ {counts.lost} Lost
          </div>
        </div>

        <div className={styles.gridHeader}>
          <div className={styles.gridTitle}>
            Students
            <span className={styles.studentCount}>({students.length})</span>
          </div>
          <button className={styles.addBtn} onClick={() => setShowAddModal(true)}>
            + Add Student
          </button>
        </div>

        <div className={styles.grid}>
          {students.map((s) => (
            <StudentCard key={s.id} student={s} />
          ))}
        </div>

        <div className={styles.heatmapSection}>
          <HeatMap />
        </div>
      </div>

      {showAddModal && <AddStudentModal onClose={() => setShowAddModal(false)} />}
    </div>
  );
}
