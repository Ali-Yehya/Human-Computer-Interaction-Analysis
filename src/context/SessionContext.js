"use client";
import { createContext, useContext, useReducer, useCallback, useRef, useEffect, useState } from "react";
import { createInitialStudents, createStudent } from "@/data/students";

const SessionContext = createContext(null);

const ENGAGEMENT_ORDER = { lost: 0, neutral: 1, engaged: 2 };

function sortStudents(students) {
  return [...students].sort(
    (a, b) => ENGAGEMENT_ORDER[a.engagement] - ENGAGEMENT_ORDER[b.engagement]
  );
}

function sessionReducer(state, action) {
  switch (action.type) {
    case "SET_ENGAGEMENT": {
      const now = new Date();
      const students = state.students.map((s) => {
        if (s.id !== action.id) return s;
        const disengagedSince =
          action.status === "engaged" ? null : s.disengagedSince || now;
        return {
          ...s,
          engagement: action.status,
          engagementHistory: [
            ...s.engagementHistory,
            { status: action.status, timestamp: now },
          ],
          disengagedSince,
        };
      });
      return { ...state, students: sortStudents(students) };
    }

    case "ADD_NOTE": {
      const students = state.students.map((s) => {
        if (s.id !== action.id) return s;
        return {
          ...s,
          notes: [...s.notes, { text: action.text, timestamp: new Date() }],
        };
      });
      return { ...state, students: sortStudents(students) };
    }

    case "TOGGLE_FLAG": {
      const students = state.students.map((s) => {
        if (s.id !== action.id) return s;
        return { ...s, flagged: !s.flagged };
      });
      return { ...state, students: sortStudents(students) };
    }

    case "ADD_STUDENT": {
      const newStudent = createStudent(action.name, action.rollNumber);
      return {
        ...state,
        students: sortStudents([...state.students, newStudent]),
      };
    }

    case "MARK_ALL_PRESENT": {
      const now = new Date();
      const students = state.students.map((s) => ({
        ...s,
        engagement: "engaged",
        engagementHistory: [
          ...s.engagementHistory,
          { status: "engaged", timestamp: now },
        ],
        disengagedSince: null,
      }));
      return { ...state, students: sortStudents(students) };
    }

    case "TOGGLE_PAUSE":
      return { ...state, paused: !state.paused };

    case "END_SESSION":
      return { ...state, ended: true, endTime: new Date() };

    case "ADD_HEATMAP_SNAPSHOT": {
      const snapshot = state.students.map((s) => ({
        id: s.id,
        name: s.name,
        engagement: s.engagement,
      }));
      return {
        ...state,
        heatmapSnapshots: [...state.heatmapSnapshots, { time: new Date(), data: snapshot }],
      };
    }

    case "RESET_SESSION": {
      return createInitialState();
    }

    default:
      return state;
  }
}

function createInitialState() {
  return {
    students: sortStudents(createInitialStudents()),
    paused: false,
    ended: false,
    startTime: new Date(),
    endTime: null,
    heatmapSnapshots: [],
  };
}

export function SessionProvider({ children }) {
  const [state, dispatch] = useReducer(sessionReducer, null, createInitialState);
  const [elapsed, setElapsed] = useState(0);
  const intervalRef = useRef(null);
  const heatmapRef = useRef(null);

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      if (!state.paused && !state.ended) {
        setElapsed((e) => e + 1);
      }
    }, 1000);
    return () => clearInterval(intervalRef.current);
  }, [state.paused, state.ended]);

  useEffect(() => {
    heatmapRef.current = setInterval(() => {
      if (!state.paused && !state.ended) {
        dispatch({ type: "ADD_HEATMAP_SNAPSHOT" });
      }
    }, 30000);
    return () => clearInterval(heatmapRef.current);
  }, [state.paused, state.ended]);

  useEffect(() => {
    if (!state.paused && !state.ended && state.heatmapSnapshots.length === 0) {
      dispatch({ type: "ADD_HEATMAP_SNAPSHOT" });
    }
  }, []);

  const setEngagement = useCallback((id, status) => {
    dispatch({ type: "SET_ENGAGEMENT", id, status });
  }, []);

  const addNote = useCallback((id, text) => {
    dispatch({ type: "ADD_NOTE", id, text });
  }, []);

  const toggleFlag = useCallback((id) => {
    dispatch({ type: "TOGGLE_FLAG", id });
  }, []);

  const addStudent = useCallback((name, rollNumber) => {
    dispatch({ type: "ADD_STUDENT", name, rollNumber });
  }, []);

  const markAllPresent = useCallback(() => {
    dispatch({ type: "MARK_ALL_PRESENT" });
  }, []);

  const togglePause = useCallback(() => {
    dispatch({ type: "TOGGLE_PAUSE" });
  }, []);

  const endSession = useCallback(() => {
    dispatch({ type: "ADD_HEATMAP_SNAPSHOT" });
    dispatch({ type: "END_SESSION" });
  }, []);

  const resetSession = useCallback(() => {
    setElapsed(0);
    dispatch({ type: "RESET_SESSION" });
  }, []);

  const value = {
    ...state,
    elapsed,
    setEngagement,
    addNote,
    toggleFlag,
    addStudent,
    markAllPresent,
    togglePause,
    endSession,
    resetSession,
  };

  return (
    <SessionContext.Provider value={value}>{children}</SessionContext.Provider>
  );
}

export function useSession() {
  const ctx = useContext(SessionContext);
  if (!ctx) throw new Error("useSession must be used within SessionProvider");
  return ctx;
}
