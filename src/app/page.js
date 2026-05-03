"use client";
import Link from "next/link";
import ThemeToggle from "@/components/ThemeToggle";
import styles from "./page.module.css";

export default function LandingPage() {
  return (
    <div className={styles.page}>
      {/* Background glows */}
      <div className={`${styles.bgGlow} ${styles.glowBlue}`} />
      <div className={`${styles.bgGlow} ${styles.glowPurple}`} />
      <div className={`${styles.bgGlow} ${styles.glowGreen}`} />

      <div className={styles.topBar}>
        <div className={styles.logo}>CEM</div>
        <ThemeToggle />
      </div>

      <div className={styles.hero}>
        <div className={styles.badge}>AHCI Project</div>
        <h1 className={styles.title}>
          Classroom<br />
          <span className={styles.titleAccent}>Engagement Monitor</span>
        </h1>
        <p className={styles.subtitle}>
          Real-time student engagement tracking designed around Advanced Human-Computer
          Interaction principles. Monitor, respond, and adapt — all during live instruction.
        </p>
        <div className={styles.actions}>
          <Link href="/dashboard" className={styles.primaryBtn}>
            Start Session
            <span className={styles.arrow}>→</span>
          </Link>
        </div>

        <div className={styles.stats}>
          <div className={styles.stat}>
            <div className={styles.statValue}>15</div>
            <div className={styles.statLabel}>AHCI Concepts</div>
          </div>
          <div className={styles.stat}>
            <div className={styles.statValue}>3</div>
            <div className={styles.statLabel}>Screens</div>
          </div>
          <div className={styles.stat}>
            <div className={styles.statValue}>Real-Time</div>
            <div className={styles.statLabel}>Monitoring</div>
          </div>
        </div>
      </div>

      <div className={styles.footer}>
        Ali Yehya Hayati · Ammar Zulfiqar · Mohammad Abd-Ur-Rahman
      </div>
    </div>
  );
}
