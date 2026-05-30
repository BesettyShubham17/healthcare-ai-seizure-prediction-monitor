"use client";

import { motion } from "framer-motion";
import { useEffect, useRef } from "react";

export default function EEGWaveCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationId: number;
    let time = 0;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = 300;
    };

    resize();
    window.addEventListener("resize", resize);

    const channels = [
      { color: "rgba(0, 212, 255, 0.5)", freq: 0.015, amp: 30, speed: 0.03, yOffset: 0.2 },
      { color: "rgba(124, 58, 237, 0.4)", freq: 0.02, amp: 25, speed: 0.025, yOffset: 0.4 },
      { color: "rgba(0, 212, 255, 0.3)", freq: 0.012, amp: 35, speed: 0.035, yOffset: 0.6 },
      { color: "rgba(167, 139, 250, 0.35)", freq: 0.018, amp: 20, speed: 0.02, yOffset: 0.8 },
    ];

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      time += 1;

      channels.forEach((ch) => {
        ctx.beginPath();
        ctx.strokeStyle = ch.color;
        ctx.lineWidth = 1.5;
        const baseY = canvas.height * ch.yOffset;

        for (let x = 0; x < canvas.width; x++) {
          const spike = Math.random() > 0.997 ? (Math.random() - 0.5) * ch.amp * 3 : 0;
          const y =
            baseY +
            Math.sin(x * ch.freq + time * ch.speed) * ch.amp +
            Math.sin(x * ch.freq * 2.5 + time * ch.speed * 1.5) * (ch.amp * 0.3) +
            Math.sin(x * ch.freq * 0.5 + time * ch.speed * 0.7) * (ch.amp * 0.5) +
            spike;

          if (x === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.stroke();
      });

      animationId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <motion.canvas
      ref={canvasRef}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 2 }}
      style={{
        width: "100%",
        height: 300,
        display: "block",
      }}
    />
  );
}
