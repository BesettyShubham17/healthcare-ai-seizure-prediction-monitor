"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import Link from "next/link";
import { useRef } from "react";
import {
  FiShield,
  FiActivity,
  FiCpu,
  FiZap,
  FiArrowRight,
  FiUsers,
  FiTrendingUp,
  FiHeart,
} from "react-icons/fi";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import EEGWaveCanvas from "@/components/EEGWaveCanvas";

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] },
  }),
};

const features = [
  {
    icon: FiCpu,
    title: "LSTM Deep Learning",
    desc: "Advanced Long Short-Term Memory neural network architecture specifically designed for temporal EEG signal pattern recognition.",
    color: "#00d4ff",
  },
  {
    icon: FiActivity,
    title: "Real-Time EEG Analysis",
    desc: "Process 178-feature EEG signal data in real-time with multi-channel waveform visualization and anomaly detection.",
    color: "#7c3aed",
  },
  {
    icon: FiShield,
    title: "98.53% Accuracy",
    desc: "Clinically validated prediction accuracy with high precision and recall scores, ensuring reliable seizure detection.",
    color: "#22c55e",
  },
  {
    icon: FiZap,
    title: "Instant Prediction",
    desc: "Sub-second inference time for critical medical decisions. AI-powered risk assessment with confidence scoring.",
    color: "#f59e0b",
  },
];

const stats = [
  { value: "98.53%", label: "Model Accuracy", icon: FiTrendingUp },
  { value: "178", label: "EEG Features", icon: FiActivity },
  { value: "11,500", label: "Dataset Samples", icon: FiCpu },
  { value: "<1s", label: "Prediction Time", icon: FiZap },
];

export default function HomePage() {
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const heroY = useTransform(scrollYProgress, [0, 1], [0, 150]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  return (
    <div>
      <Navbar />

      {/* ===== HERO SECTION ===== */}
      <section
        ref={heroRef}
        style={{
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "120px 24px 80px",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <motion.div
          style={{ y: heroY, opacity: heroOpacity, textAlign: "center", maxWidth: 900 }}
        >
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              padding: "8px 20px",
              borderRadius: 50,
              background: "rgba(0, 212, 255, 0.06)",
              border: "1px solid rgba(0, 212, 255, 0.15)",
              marginBottom: 32,
              fontSize: 13,
              fontWeight: 500,
              color: "#00d4ff",
            }}
          >
            <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#00d4ff", animation: "pulse-glow 2s infinite" }} />
            AI-Powered Medical Intelligence
          </motion.div>

          {/* Title */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="heading-xl"
            style={{ marginBottom: 24 }}
          >
            Epileptic Seizure{" "}
            <span className="gradient-text">Prediction</span>
            <br />
            using Deep Learning
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.5 }}
            className="text-body"
            style={{ maxWidth: 640, margin: "0 auto 48px", fontSize: 17 }}
          >
            Hospital-grade LSTM neural network analyzing EEG brainwave signals to predict
            epileptic seizures with <strong style={{ color: "#00d4ff" }}>98.53% accuracy</strong>.
            Real-time analysis for doctors and patients.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.7 }}
            style={{ display: "flex", justifyContent: "center", gap: 16, flexWrap: "wrap" }}
          >
            <Link href="/login?mode=doctor" style={{ textDecoration: "none" }}>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="btn-primary"
                style={{ display: "flex", alignItems: "center", gap: 10 }}
              >
                👨‍⚕️ Doctor Portal <FiArrowRight />
              </motion.button>
            </Link>
            <Link href="/login?mode=user" style={{ textDecoration: "none" }}>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="btn-secondary"
                style={{ display: "flex", alignItems: "center", gap: 10 }}
              >
                👤 Patient Portal <FiArrowRight />
              </motion.button>
            </Link>
          </motion.div>
        </motion.div>

        {/* EEG Wave Decoration */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.5, delay: 1 }}
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            pointerEvents: "none",
          }}
        >
          <EEGWaveCanvas />
        </motion.div>

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2 }}
          style={{
            position: "absolute",
            bottom: 40,
            left: "50%",
            transform: "translateX(-50%)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 8,
          }}
        >
          <span style={{ fontSize: 11, color: "#475569", letterSpacing: "2px", textTransform: "uppercase" }}>Scroll</span>
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            style={{
              width: 20,
              height: 32,
              borderRadius: 12,
              border: "1.5px solid rgba(255,255,255,0.1)",
              display: "flex",
              justifyContent: "center",
              paddingTop: 6,
            }}
          >
            <div style={{ width: 3, height: 8, borderRadius: 3, background: "#00d4ff" }} />
          </motion.div>
        </motion.div>
      </section>

      {/* ===== STATS SECTION ===== */}
      <section style={{ padding: "40px 24px 80px" }}>
        <div
          style={{
            maxWidth: 1100,
            margin: "0 auto",
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: 20,
          }}
        >
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              custom={i}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-50px" }}
              variants={fadeUp}
              className="glass-card"
              style={{
                padding: 28,
                textAlign: "center",
              }}
            >
              <stat.icon size={24} color="#00d4ff" style={{ marginBottom: 12 }} />
              <div
                style={{
                  fontSize: 32,
                  fontWeight: 800,
                  background: "linear-gradient(135deg, #00d4ff, #7c3aed)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  marginBottom: 4,
                }}
              >
                {stat.value}
              </div>
              <div style={{ fontSize: 13, color: "#64748b", fontWeight: 500 }}>{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ===== FEATURES SECTION ===== */}
      <section style={{ padding: "60px 24px 100px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={fadeUp}
            custom={0}
            style={{ textAlign: "center", marginBottom: 64 }}
          >
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                padding: "6px 16px",
                borderRadius: 50,
                background: "rgba(124, 58, 237, 0.08)",
                border: "1px solid rgba(124, 58, 237, 0.15)",
                marginBottom: 20,
                fontSize: 12,
                fontWeight: 600,
                color: "#a78bfa",
                letterSpacing: "1px",
                textTransform: "uppercase",
              }}
            >
              <FiCpu size={14} /> Core Capabilities
            </div>
            <h2 className="heading-lg" style={{ marginBottom: 16 }}>
              Powered by Advanced{" "}
              <span className="gradient-text">Neural Intelligence</span>
            </h2>
            <p className="text-body" style={{ maxWidth: 600, margin: "0 auto" }}>
              Our LSTM-based deep learning model processes multi-channel EEG signals
              to deliver hospital-grade seizure predictions.
            </p>
          </motion.div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
              gap: 24,
            }}
          >
            {features.map((feat, i) => (
              <motion.div
                key={feat.title}
                custom={i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-50px" }}
                variants={fadeUp}
                className="glass-card"
                style={{ padding: 32 }}
              >
                <div
                  style={{
                    width: 52,
                    height: 52,
                    borderRadius: 14,
                    background: `${feat.color}10`,
                    border: `1px solid ${feat.color}25`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    marginBottom: 20,
                  }}
                >
                  <feat.icon size={24} color={feat.color} />
                </div>
                <h3 style={{ fontSize: 18, fontWeight: 700, color: "#f1f5f9", marginBottom: 12 }}>
                  {feat.title}
                </h3>
                <p style={{ fontSize: 14, color: "#94a3b8", lineHeight: 1.7 }}>{feat.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== DUAL MODE CTA ===== */}
      <section style={{ padding: "60px 24px 120px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={fadeUp}
            custom={0}
            style={{ textAlign: "center", marginBottom: 48 }}
          >
            <h2 className="heading-lg" style={{ marginBottom: 16 }}>
              Choose Your <span className="gradient-text">Portal</span>
            </h2>
            <p className="text-body" style={{ maxWidth: 500, margin: "0 auto" }}>
              Tailored experience for medical professionals and patients.
            </p>
          </motion.div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
              gap: 24,
              maxWidth: 800,
              margin: "0 auto",
            }}
          >
            {/* Doctor Card */}
            <motion.div
              custom={0}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeUp}
            >
              <Link href="/login?mode=doctor" style={{ textDecoration: "none" }}>
                <motion.div
                  whileHover={{ scale: 1.03, y: -5 }}
                  className="glass-card"
                  style={{
                    padding: 40,
                    textAlign: "center",
                    cursor: "pointer",
                    borderColor: "rgba(0, 212, 255, 0.1)",
                  }}
                >
                  <div
                    style={{
                      width: 80,
                      height: 80,
                      borderRadius: 20,
                      background: "linear-gradient(135deg, rgba(0, 212, 255, 0.1) 0%, rgba(124, 58, 237, 0.1) 100%)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      margin: "0 auto 20px",
                      fontSize: 36,
                    }}
                  >
                    👨‍⚕️
                  </div>
                  <h3 style={{ fontSize: 22, fontWeight: 700, color: "#f1f5f9", marginBottom: 12 }}>
                    Doctor Portal
                  </h3>
                  <p style={{ fontSize: 14, color: "#94a3b8", lineHeight: 1.7, marginBottom: 24 }}>
                    Advanced analytics dashboard with full EEG analysis, risk assessment, AI explanation panels, and patient history.
                  </p>
                  <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 6, marginBottom: 24 }}>
                    {["Full Analytics", "Risk History", "AI Insights", "Reports"].map((t) => (
                      <span
                        key={t}
                        style={{
                          padding: "4px 10px",
                          borderRadius: 6,
                          fontSize: 11,
                          fontWeight: 500,
                          background: "rgba(0, 212, 255, 0.08)",
                          color: "#00d4ff",
                          border: "1px solid rgba(0, 212, 255, 0.12)",
                        }}
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                  <div className="btn-primary" style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
                    Enter Dashboard <FiArrowRight />
                  </div>
                </motion.div>
              </Link>
            </motion.div>

            {/* User Card */}
            <motion.div
              custom={1}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeUp}
            >
              <Link href="/login?mode=user" style={{ textDecoration: "none" }}>
                <motion.div
                  whileHover={{ scale: 1.03, y: -5 }}
                  className="glass-card"
                  style={{
                    padding: 40,
                    textAlign: "center",
                    cursor: "pointer",
                    borderColor: "rgba(124, 58, 237, 0.1)",
                  }}
                >
                  <div
                    style={{
                      width: 80,
                      height: 80,
                      borderRadius: 20,
                      background: "linear-gradient(135deg, rgba(124, 58, 237, 0.1) 0%, rgba(0, 212, 255, 0.1) 100%)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      margin: "0 auto 20px",
                      fontSize: 36,
                    }}
                  >
                    👤
                  </div>
                  <h3 style={{ fontSize: 22, fontWeight: 700, color: "#f1f5f9", marginBottom: 12 }}>
                    Patient Portal
                  </h3>
                  <p style={{ fontSize: 14, color: "#94a3b8", lineHeight: 1.7, marginBottom: 24 }}>
                    Simple, friendly interface for uploading EEG data and receiving instant seizure detection results with safety guidance.
                  </p>
                  <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 6, marginBottom: 24 }}>
                    {["Easy Upload", "Quick Results", "Safety Tips", "Simple UI"].map((t) => (
                      <span
                        key={t}
                        style={{
                          padding: "4px 10px",
                          borderRadius: 6,
                          fontSize: 11,
                          fontWeight: 500,
                          background: "rgba(124, 58, 237, 0.08)",
                          color: "#a78bfa",
                          border: "1px solid rgba(124, 58, 237, 0.12)",
                        }}
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                  <div className="btn-secondary" style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
                    Check Now <FiArrowRight />
                  </div>
                </motion.div>
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ===== TRUST BANNER ===== */}
      <section
        style={{
          padding: "48px 24px",
          background: "rgba(0, 212, 255, 0.03)",
          borderTop: "1px solid rgba(0, 212, 255, 0.06)",
          borderBottom: "1px solid rgba(0, 212, 255, 0.06)",
        }}
      >
        <div
          style={{
            maxWidth: 900,
            margin: "0 auto",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: 48,
            flexWrap: "wrap",
          }}
        >
          {[
            { icon: FiShield, text: "HIPAA Compliant" },
            { icon: FiHeart, text: "Patient-First Design" },
            { icon: FiUsers, text: "Dual-Mode Platform" },
            { icon: FiCpu, text: "TensorFlow Powered" },
          ].map((item, i) => (
            <motion.div
              key={item.text}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              style={{ display: "flex", alignItems: "center", gap: 10, color: "#475569", fontSize: 13, fontWeight: 500 }}
            >
              <item.icon size={16} color="#00d4ff" />
              {item.text}
            </motion.div>
          ))}
        </div>
      </section>

      <Footer />
    </div>
  );
}
