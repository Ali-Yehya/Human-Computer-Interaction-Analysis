"use client";
import { useRef, useEffect } from "react";
import { useTheme } from "@/context/ThemeContext";

const COLORS = {
  dark: {
    engaged: "#34D399",
    neutral: "#FBBF24",
    lost: "#F87171",
    bg: "#242836",
    grid: "#2E3345",
    text: "#9BA1B0",
  },
  light: {
    engaged: "#16A34A",
    neutral: "#D97706",
    lost: "#DC2626",
    bg: "#F1F5F9",
    grid: "#E2E8F0",
    text: "#475569",
  },
};

const STATUS_Y = {
  engaged: 0.15,
  neutral: 0.5,
  lost: 0.85,
};

export default function EngagementChart({ history, width = 800, height = 180 }) {
  const canvasRef = useRef(null);
  const { theme } = useTheme();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || history.length === 0) return;

    const colors = COLORS[theme] || COLORS.dark;
    const ctx = canvas.getContext("2d");
    const dpr = window.devicePixelRatio || 1;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    ctx.scale(dpr, dpr);

    ctx.clearRect(0, 0, width, height);

    const padding = { top: 20, right: 20, bottom: 30, left: 60 };
    const chartW = width - padding.left - padding.right;
    const chartH = height - padding.top - padding.bottom;

    ctx.fillStyle = colors.bg;
    ctx.fillRect(padding.left, padding.top, chartW, chartH);

    const labels = ["Engaged", "Neutral", "Lost"];
    const yPositions = [0.15, 0.5, 0.85];
    ctx.font = "11px sans-serif";
    ctx.fillStyle = colors.text;
    ctx.textAlign = "right";
    labels.forEach((label, i) => {
      const y = padding.top + chartH * yPositions[i];
      ctx.fillText(label, padding.left - 8, y + 4);
      ctx.strokeStyle = colors.grid;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(padding.left, y);
      ctx.lineTo(padding.left + chartW, y);
      ctx.stroke();
    });

    if (history.length < 2) {
      const pt = history[0];
      const y = padding.top + chartH * STATUS_Y[pt.status];
      ctx.fillStyle = colors[pt.status];
      ctx.beginPath();
      ctx.arc(padding.left + chartW / 2, y, 6, 0, Math.PI * 2);
      ctx.fill();
      return;
    }

    const startTime = history[0].timestamp.getTime();
    const endTime = history[history.length - 1].timestamp.getTime();
    const timeRange = endTime - startTime || 1;

    ctx.lineWidth = 3;
    ctx.lineJoin = "round";
    ctx.lineCap = "round";

    for (let i = 0; i < history.length - 1; i++) {
      const curr = history[i];
      const next = history[i + 1];
      const x1 = padding.left + ((curr.timestamp.getTime() - startTime) / timeRange) * chartW;
      const x2 = padding.left + ((next.timestamp.getTime() - startTime) / timeRange) * chartW;
      const y = padding.top + chartH * STATUS_Y[curr.status];

      ctx.strokeStyle = colors[curr.status];
      ctx.beginPath();
      ctx.moveTo(x1, y);
      ctx.lineTo(x2, y);
      ctx.stroke();

      ctx.fillStyle = colors[curr.status];
      ctx.beginPath();
      ctx.arc(x1, y, 5, 0, Math.PI * 2);
      ctx.fill();
    }

    const last = history[history.length - 1];
    const lastX = padding.left + chartW;
    const lastY = padding.top + chartH * STATUS_Y[last.status];
    ctx.fillStyle = colors[last.status];
    ctx.beginPath();
    ctx.arc(lastX, lastY, 5, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = colors.text;
    ctx.font = "10px monospace";
    ctx.textAlign = "center";
    const startLabel = history[0].timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    const endLabel = last.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    ctx.fillText(startLabel, padding.left, height - 8);
    ctx.fillText(endLabel, padding.left + chartW, height - 8);
  }, [history, width, height, theme]);

  return (
    <canvas
      ref={canvasRef}
      style={{ width: `${width}px`, height: `${height}px`, display: "block", maxWidth: "100%" }}
    />
  );
}
