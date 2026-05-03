"use client";
import { useSession } from "@/context/SessionContext";
import { useToast } from "@/context/ToastContext";
import { useRouter } from "next/navigation";
import ThemeToggle from "@/components/ThemeToggle";
import styles from "./page.module.css";

function computeStats(students, startTime, endTime) {
  const sessionDuration = (endTime || new Date()).getTime() - startTime.getTime();
  const scoreMap = { engaged: 3, neutral: 2, lost: 1 };

  let totalScore = 0;
  let totalEntries = 0;
  let longestDisengagement = { name: "", duration: 0 };
  const flaggedStudents = [];

  const timelines = students.map((s) => {
    const history = s.engagementHistory;
    const segments = [];
    let maxDisengaged = 0;

    for (let i = 0; i < history.length; i++) {
      const start = history[i].timestamp.getTime();
      const end = i < history.length - 1
        ? history[i + 1].timestamp.getTime()
        : (endTime || new Date()).getTime();
      const duration = end - start;

      segments.push({
        status: history[i].status,
        duration,
        percent: sessionDuration > 0 ? (duration / sessionDuration) * 100 : 0,
      });

      totalScore += scoreMap[history[i].status] || 0;
      totalEntries++;

      if (history[i].status !== "engaged") {
        if (duration > maxDisengaged) maxDisengaged = duration;
      }
    }

    if (maxDisengaged > longestDisengagement.duration) {
      longestDisengagement = { name: s.name, duration: maxDisengaged };
    }

    if (s.flagged) flaggedStudents.push(s.name);

    return { id: s.id, name: s.name, segments };
  });

  const avgScore = totalEntries > 0 ? (totalScore / totalEntries).toFixed(2) : "N/A";

  return { timelines, avgScore, longestDisengagement, flaggedStudents };
}

function formatDuration(ms) {
  const secs = Math.floor(ms / 1000);
  const m = Math.floor(secs / 60);
  const s = secs % 60;
  return `${m}m ${s}s`;
}

const mockHistorical = [
  { label: "Session -5", score: 2.3 },
  { label: "Session -4", score: 2.5 },
  { label: "Session -3", score: 2.1 },
  { label: "Session -2", score: 2.6 },
  { label: "Session -1", score: 2.4 },
];

export default function SummaryPage() {
  const { students, startTime, endTime, resetSession } = useSession();
  const { addToast } = useToast();
  const router = useRouter();

  const { timelines, avgScore, longestDisengagement, flaggedStudents } =
    computeStats(students, startTime, endTime);

  const currentScore = parseFloat(avgScore) || 0;
  const allScores = [...mockHistorical.map((h) => h.score), currentScore];
  const maxScore = Math.max(...allScores, 3);

  const handleExport = () => {
    const headers = ["Name", "Roll Number", "Avg Engagement", "Flagged", "Notes Count"];
    const scoreMap = { engaged: 3, neutral: 2, lost: 1 };

    const rows = students.map((s) => {
      const scores = s.engagementHistory.map((h) => scoreMap[h.status] || 0);
      const avg = scores.length > 0 ? (scores.reduce((a, b) => a + b, 0) / scores.length).toFixed(2) : "0";
      return [s.name, s.rollNumber, avg, s.flagged ? "Yes" : "No", s.notes.length].join(",");
    });

    const csv = [headers.join(","), ...rows].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `session-summary-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    addToast("CSV exported successfully", "success");
  };

  const handleReturn = () => {
    resetSession();
    router.push("/dashboard");
  };

  return (
    <div className={styles.page}>
      <div className={styles.topBar}>
        <div className={styles.topBarLeft}>
          <div className={styles.pageTitle}>Session Summary</div>
        </div>
        <div className={styles.topBarActions}>
          <button className={styles.exportBtn} onClick={handleExport}>
            ↓ Export CSV
          </button>
          <button className={styles.returnBtn} onClick={handleReturn}>
            ← New Session
          </button>
          <ThemeToggle />
        </div>
      </div>

      <div className={styles.content}>
        <div className={styles.statsGrid}>
          <div className={styles.statCard}>
            <div className={styles.statValue}>{students.length}</div>
            <div className={styles.statLabel}>Total Students</div>
          </div>
          <div className={styles.statCard}>
            <div className={styles.statValue}>{avgScore}</div>
            <div className={styles.statLabel}>Avg Engagement (1-3)</div>
          </div>
          <div className={styles.statCard}>
            <div className={styles.statValue}>
              {longestDisengagement.duration > 0
                ? formatDuration(longestDisengagement.duration)
                : "0m"}
            </div>
            <div className={styles.statLabel}>
              Longest Disengagement
              {longestDisengagement.name && ` (${longestDisengagement.name})`}
            </div>
          </div>
          <div className={styles.statCard}>
            <div className={styles.statValue}>{flaggedStudents.length}</div>
            <div className={styles.statLabel}>Students Flagged</div>
          </div>
        </div>

        <div className={styles.section}>
          <div className={styles.sectionHeader}>Per-Student Engagement Timeline</div>
          <div className={styles.sectionBody}>
            {timelines.map((t) => (
              <div key={t.id} className={styles.timelineRow}>
                <div className={styles.timelineName} title={t.name}>{t.name}</div>
                <div className={styles.timelineBar}>
                  {t.segments.map((seg, i) => (
                    <div
                      key={i}
                      className={`${styles.timelineSegment} ${styles[`seg${seg.status.charAt(0).toUpperCase() + seg.status.slice(1)}`]}`}
                      style={{ width: `${Math.max(seg.percent, 1)}%` }}
                      title={`${seg.status}: ${formatDuration(seg.duration)}`}
                    />
                  ))}
                </div>
              </div>
            ))}
            <div className={styles.timelineLegend}>
              <div className={styles.legendItem}>
                <div className={`${styles.legendDot} ${styles.segEngaged}`} /> Engaged
              </div>
              <div className={styles.legendItem}>
                <div className={`${styles.legendDot} ${styles.segNeutral}`} /> Neutral
              </div>
              <div className={styles.legendItem}>
                <div className={`${styles.legendDot} ${styles.segLost}`} /> Lost
              </div>
            </div>
          </div>
        </div>

        <div className={styles.section}>
          <div className={styles.sectionHeader}>Session Comparison (Current vs. Last 5)</div>
          <div className={styles.sectionBody}>
            <div className={styles.comparisonChart}>
              {mockHistorical.map((h, i) => (
                <div key={i} className={styles.comparisonBar}>
                  <div className={styles.barValue}>{h.score}</div>
                  <div
                    className={`${styles.barFill} ${styles.barHistory}`}
                    style={{ height: `${(h.score / maxScore) * 150}px` }}
                  />
                  <div className={styles.barLabel}>{h.label}</div>
                </div>
              ))}
              <div className={styles.comparisonBar}>
                <div className={styles.barValue}>{currentScore.toFixed(2)}</div>
                <div
                  className={`${styles.barFill} ${styles.barCurrent}`}
                  style={{ height: `${(currentScore / maxScore) * 150}px` }}
                />
                <div className={styles.barLabel}>Current</div>
              </div>
            </div>
          </div>
        </div>

        <div className={styles.section}>
          <div className={styles.sectionHeader}>Flagged Students</div>
          <div className={styles.sectionBody}>
            {flaggedStudents.length === 0 ? (
              <div className={styles.noFlags}>No students were flagged during this session.</div>
            ) : (
              <ul className={styles.flaggedList}>
                {flaggedStudents.map((name, i) => (
                  <li key={i} className={styles.flaggedItem}>
                    🚩 {name}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
