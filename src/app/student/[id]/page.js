"use client";
import { useState, use } from "react";
import { useSession } from "@/context/SessionContext";
import { useToast } from "@/context/ToastContext";
import { useRouter } from "next/navigation";
import EngagementChart from "@/components/EngagementChart";
import ThemeToggle from "@/components/ThemeToggle";
import styles from "./page.module.css";

export default function StudentProfile({ params }) {
  const { id } = use(params);
  const { students, setEngagement, addNote, toggleFlag } = useSession();
  const { addToast } = useToast();
  const router = useRouter();
  const [noteText, setNoteText] = useState("");
  const [noteError, setNoteError] = useState(false);

  const student = students.find((s) => s.id === Number(id));

  if (!student) {
    return (
      <div className={styles.page}>
        <div className={styles.topBar}>
          <button className={styles.backBtn} onClick={() => router.push("/dashboard")}>
            ← Back to Dashboard
          </button>
          <div className={styles.pageTitle}>Student Not Found</div>
        </div>
      </div>
    );
  }

  const handleRate = (status) => {
    setEngagement(student.id, status);
    const labels = { engaged: "Engaged", neutral: "Neutral", lost: "Lost" };
    const types = { engaged: "success", neutral: "warning", lost: "error" };
    addToast(`${student.name} marked as ${labels[status]}`, types[status]);
  };

  const handleAddNote = () => {
    if (!noteText.trim()) {
      setNoteError(true);
      addToast("Note cannot be empty", "error");
      return;
    }
    addNote(student.id, noteText.trim());
    setNoteText("");
    setNoteError(false);
    addToast("Note added successfully", "success");
  };

  const handleFlag = () => {
    if (student.flagged) {
      toggleFlag(student.id);
      addToast(`${student.name} unflagged`, "info");
    } else {
      if (window.confirm(`Are you sure you want to flag ${student.name} for follow-up?`)) {
        toggleFlag(student.id);
        addToast(`${student.name} flagged for follow-up`, "warning");
      }
    }
  };

  const badgeClass = styles[`badge${student.engagement.charAt(0).toUpperCase() + student.engagement.slice(1)}`];

  return (
    <div className={styles.page}>
      <div className={styles.topBar}>
        <button className={styles.backBtn} onClick={() => router.push("/dashboard")}>
          ← Back to Dashboard
        </button>
        <div className={styles.pageTitle}>{student.name}</div>
        <div style={{ marginLeft: "auto" }}>
          <ThemeToggle />
        </div>
      </div>

      <div className={styles.content}>
        <div className={styles.section}>
          <div className={styles.sectionHeader}>
            <span className={styles.sectionIcon}>👤</span> Profile
          </div>
          <div className={styles.sectionBody}>
            <div className={styles.profileGrid}>
              <div className={styles.profileItem}>
                <span className={styles.profileLabel}>Name</span>
                <span className={styles.profileValue}>{student.name}</span>
              </div>
              <div className={styles.profileItem}>
                <span className={styles.profileLabel}>Roll Number</span>
                <span className={styles.profileValue}>{student.rollNumber}</span>
              </div>
              <div className={styles.profileItem}>
                <span className={styles.profileLabel}>Current Status</span>
                <span className={`${styles.statusBadge} ${badgeClass}`}>
                  {student.engagement}
                </span>
              </div>
              <div className={styles.profileItem}>
                <span className={styles.profileLabel}>Flagged</span>
                {student.flagged ? (
                  <span className={styles.flagBadge}>🚩 Flagged for follow-up</span>
                ) : (
                  <span className={styles.profileValue}>No</span>
                )}
              </div>
            </div>

            <div className={styles.ratingSection}>
              <button
                className={`${styles.rateBtn} ${styles.rateBtnEngaged} ${student.engagement === "engaged" ? styles.rateBtnActive : ""}`}
                onClick={() => handleRate("engaged")}
              >
                ✓ Engaged
              </button>
              <button
                className={`${styles.rateBtn} ${styles.rateBtnNeutral} ${student.engagement === "neutral" ? styles.rateBtnActive : ""}`}
                onClick={() => handleRate("neutral")}
              >
                — Neutral
              </button>
              <button
                className={`${styles.rateBtn} ${styles.rateBtnLost} ${student.engagement === "lost" ? styles.rateBtnActive : ""}`}
                onClick={() => handleRate("lost")}
              >
                ✗ Lost
              </button>
            </div>

            <div className={styles.flagSection}>
              <button
                className={student.flagged ? styles.unflagBtn : styles.flagBtn}
                onClick={handleFlag}
              >
                {student.flagged ? "✓ Unflag Student" : "🚩 Flag for Follow-Up"}
              </button>
            </div>
          </div>
        </div>

        <div className={styles.section}>
          <div className={styles.sectionHeader}>
            <span className={styles.sectionIcon}>📊</span> Engagement History
          </div>
          <div className={styles.sectionBody}>
            <EngagementChart history={student.engagementHistory} />
          </div>
        </div>

        <div className={styles.section}>
          <div className={styles.sectionHeader}>
            <span className={styles.sectionIcon}>📝</span> Teacher Notes ({student.notes.length})
          </div>
          <div className={styles.sectionBody}>
            <div className={styles.noteForm}>
              <input
                className={`${styles.noteInput} ${noteError ? styles.noteInputError : ""}`}
                value={noteText}
                onChange={(e) => { setNoteText(e.target.value); setNoteError(false); }}
                placeholder="Type a note about this student..."
                onKeyDown={(e) => e.key === "Enter" && handleAddNote()}
              />
              <button className={styles.noteBtn} onClick={handleAddNote}>
                + Add Note
              </button>
            </div>
            {noteError && <div className={styles.errorMsg}>Note cannot be empty</div>}

            {student.notes.length === 0 ? (
              <div className={styles.emptyNotes}>No notes yet. Add one above.</div>
            ) : (
              <ul className={styles.notesList}>
                {[...student.notes].reverse().map((note, i) => (
                  <li key={i} className={styles.noteItem}>
                    <span className={styles.noteTime}>
                      {note.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                    </span>
                    <span className={styles.noteText}>{note.text}</span>
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
