"use client";

import { motion } from "framer-motion";
import {
  FiDatabase,
  FiFilter,
  FiCpu,
  FiCheckCircle,
  FiBell,
  FiActivity,
  FiTarget,
  FiTrendingUp,
  FiAward,
  FiLayers,
  FiBarChart2,
} from "react-icons/fi";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, delay: i * 0.12, ease: "easeOut" as const },
  }),
};

const pipeline = [
  {
    icon: FiDatabase,
    title: "Data Collection",
    desc: "11,500 EEG samples from Kaggle with 178 features per sample representing brainwave signals across multiple channels.",
    color: "#00d4ff",
  },
  {
    icon: FiFilter,
    title: "Preprocessing",
    desc: "Noise filtering, feature normalization using StandardScaler, and label encoding for binary classification (seizure vs non-seizure).",
    color: "#7c3aed",
  },
  {
    icon: FiCpu,
    title: "LSTM Model Training",
    desc: "Multi-layer LSTM architecture with dropout regularization, trained on 80% data using Adam optimizer and binary crossentropy loss.",
    color: "#f59e0b",
  },
  {
    icon: FiCheckCircle,
    title: "Prediction & Validation",
    desc: "Model achieves 98.53% accuracy on test set with high precision (0.97) and recall (0.98). ROC-AUC score of 0.99.",
    color: "#22c55e",
  },
  {
    icon: FiBell,
    title: "Alert System",
    desc: "Real-time seizure detection with risk classification (High/Medium/Low) and immediate alert generation for medical response.",
    color: "#ef4444",
  },
];

const metrics = [
  { label: "Accuracy", value: "98.53%", icon: FiTarget, color: "#22c55e" },
  { label: "Precision", value: "97.2%", icon: FiCheckCircle, color: "#00d4ff" },
  { label: "Recall", value: "98.1%", icon: FiTrendingUp, color: "#7c3aed" },
  { label: "ROC-AUC", value: "0.993", icon: FiAward, color: "#f59e0b" },
  { label: "F1 Score", value: "97.6%", icon: FiBarChart2, color: "#ef4444" },
  { label: "LSTM Layers", value: "3", icon: FiLayers, color: "#06b6d4" },
];

export default function AboutPage() {
  return (
    <div>
      <Navbar />

      {/* Hero */}
      <section style={{ padding: "140px 24px 80px", textAlign: "center" }}>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
        >
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              padding: "6px 16px",
              borderRadius: 50,
              background: "rgba(0, 212, 255, 0.06)",
              border: "1px solid rgba(0, 212, 255, 0.15)",
              marginBottom: 24,
              fontSize: 12,
              fontWeight: 600,
              color: "#00d4ff",
              letterSpacing: "1px",
              textTransform: "uppercase",
            }}
          >
            <FiActivity size={14} /> About the System
          </div>

          <h1 className="heading-xl" style={{ marginBottom: 20, maxWidth: 700, margin: "0 auto 20px" }}>
            How <span className="gradient-text">NeuroSense AI</span> Works
          </h1>

          <p className="text-body" style={{ maxWidth: 640, margin: "0 auto" }}>
            An end-to-end deep learning pipeline that transforms raw EEG brainwave data into
            life-saving seizure predictions using state-of-the-art LSTM neural networks.
          </p>
        </motion.div>
      </section>

      {/* PIPELINE */}
      <section style={{ padding: "20px 24px 100px" }}>
        <div style={{ maxWidth: 800, margin: "0 auto", position: "relative" }}>
          <div
            style={{
              position: "absolute",
              left: 28,
              top: 0,
              bottom: 0,
              width: 2,
              background:
                "linear-gradient(180deg, rgba(0,212,255,0.3), rgba(124,58,237,0.3), rgba(0,212,255,0.1))",
            }}
          />

          {pipeline.map((step, i) => (
            <motion.div
              key={step.title}
              custom={i}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-50px" }}
              variants={fadeUp}
              style={{
                display: "flex",
                gap: 24,
                marginBottom: 40,
                position: "relative",
              }}
            >
              <div
                style={{
                  minWidth: 56,
                  height: 56,
                  borderRadius: 16,
                  background: `${step.color}12`,
                  border: `2px solid ${step.color}30`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  zIndex: 2,
                }}
              >
                <step.icon size={24} color={step.color} />
              </div>

              <div className="glass-card" style={{ padding: 28, flex: 1 }}>
                <span style={{ fontSize: 11, fontWeight: 700, color: step.color }}>
                  STEP {i + 1}
                </span>

                <h3 style={{ fontSize: 20, fontWeight: 700, color: "#f1f5f9" }}>
                  {step.title}
                </h3>

                <p style={{ fontSize: 14, color: "#94a3b8" }}>{step.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* METRICS */}
      <section style={{ padding: "60px 24px 100px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 48 }}>
            <h2 className="heading-lg">
              Model <span className="gradient-text">Performance</span>
            </h2>
            <p className="text-body">Validated metrics from test set evaluation.</p>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
              gap: 20,
            }}
          >
            {metrics.map((m, i) => (
              <div key={m.label} className="glass-card" style={{ padding: 28, textAlign: "center" }}>
                <m.icon size={22} color={m.color} />
                <div style={{ fontSize: 28, fontWeight: 800, color: m.color }}>
                  {m.value}
                </div>
                <div style={{ fontSize: 12 }}>{m.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CARDS */}
      <section style={{ padding: "40px 24px 100px" }}>
        <div
          style={{
            maxWidth: 1100,
            margin: "0 auto",
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
            gap: 24,
          }}
        >
          <div className="glass-card" style={{ padding: 36 }}>
            <h3>🧠 What is Epilepsy?</h3>
            <p>Neurological disorder with recurrent seizures...</p>
          </div>

          <div className="glass-card" style={{ padding: 36 }}>
            <h3>📊 EEG Dataset</h3>
            <p>11,500 EEG samples from UCI dataset...</p>
          </div>

          <div className="glass-card" style={{ padding: 36 }}>
            <h3>🤖 Why LSTM?</h3>
            <p>Best for sequential EEG time-series data...</p>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
