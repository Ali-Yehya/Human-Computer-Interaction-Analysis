"use client";
import { useState } from "react";
import { useSession } from "@/context/SessionContext";
import styles from "./AddStudentModal.module.css";

export default function AddStudentModal({ onClose }) {
  const { addStudent } = useSession();
  const [name, setName] = useState("");
  const [roll, setRoll] = useState("");
  const [errors, setErrors] = useState({});

  const handleSubmit = () => {
    const errs = {};
    if (!name.trim()) errs.name = "Name is required";
    if (!roll.trim()) errs.roll = "Roll number is required";
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    addStudent(name.trim(), roll.trim());
    onClose();
  };

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.title}>Add New Student</div>
        <div className={styles.field}>
          <label>Student Name</label>
          <input
            className={errors.name ? styles.error : ""}
            value={name}
            onChange={(e) => { setName(e.target.value); setErrors((p) => ({ ...p, name: null })); }}
            placeholder="e.g. Ali Hassan"
            autoFocus
          />
          {errors.name && <span className={styles.errorText}>{errors.name}</span>}
        </div>
        <div className={styles.field}>
          <label>Roll Number</label>
          <input
            className={errors.roll ? styles.error : ""}
            value={roll}
            onChange={(e) => { setRoll(e.target.value); setErrors((p) => ({ ...p, roll: null })); }}
            placeholder="e.g. 23K-0513"
          />
          {errors.roll && <span className={styles.errorText}>{errors.roll}</span>}
        </div>
        <div className={styles.actions}>
          <button className={styles.btnCancel} onClick={onClose}>Cancel</button>
          <button className={styles.btnAdd} onClick={handleSubmit}>+ Add Student</button>
        </div>
      </div>
    </div>
  );
}
