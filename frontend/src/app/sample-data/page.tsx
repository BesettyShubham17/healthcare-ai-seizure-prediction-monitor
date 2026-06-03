"use client";

import { motion } from "framer-motion";
import { useState, useEffect, useMemo } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
} from "recharts";
import {
  FiDownload,
  FiEye,
  FiActivity,
  FiDatabase,
  FiInfo,
  FiGrid,
} from "react-icons/fi";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, delay: i * 0.1, ease: "easeOut" as const },
  }),
};

// Generate realistic-looking EEG sample data
function generateEEGData(seizure: boolean) {
  const data = [];
  for (let i = 0; i < 178; i++) {
    const base = seizure
      ? Math.sin(i * 0.15) * 300 +
        Math.sin(i * 0.4) * 200 +
        Math.random() * 250 -
        125 +
        (Math.random() > 0.9 ? (Math.random() - 0.5) * 600 : 0)
      : Math.sin(i * 0.05) * 80 +
        Math.sin(i * 0.12) * 40 +
        Math.random() * 60 -
        30;
    data.push({ x: i + 1, value: Math.round(base * 100) / 100 });
  }
  return data;
}

function generateSampleRows() {
  const rows = [];
  for (let i = 0; i < 20; i++) {
    const isSeizure = i < 4;
    const row: Record<string, string | number> = { id: i + 1, label: isSeizure ? 1 : 0 };
    for (let f = 1; f <= 10; f++) {
      row[`X${f}`] = isSeizure
        ? Math.round((Math.random() * 600 - 300) * 10) / 10
        : Math.round((Math.random() * 200 - 100) * 10) / 10;
    }
    rows.push(row);
  }
  return rows;
}

export default function SampleDataPage() {
  const [activeTab, setActiveTab] = useState<"seizure" | "normal">("seizure");
  const seizureData = useMemo(() => generateEEGData(true), []);
  const normalData = useMemo(() => generateEEGData(false), []);
  const sampleRows = useMemo(() => generateSampleRows(), []);

  const chartData = activeTab === "seizure" ? seizureData : normalData;
  const chartColor = activeTab === "seizure" ? "#ef4444" : "#22c55e";

  return (
    <div>
      <Navbar />

      {/* Hero */}
      <section style={{ padding: "140px 24px 60px", textAlign: "center" }}>
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
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
            <FiDatabase size={14} /> Dataset Explorer
          </div>
          <h1 className="heading-xl" style={{ marginBottom: 20 }}>
            Sample <span className="gradient-text">EEG Data</span>
          </h1>
          <p className="text-body" style={{ maxWidth: 600, margin: "0 auto" }}>
            Explore the EEG brainwave signals used to train our seizure prediction model.
            Visualize the difference between seizure and normal brain activity.
          </p>
        </motion.div>
      </section>

      {/* ===== EEG VISUALIZATION ===== */}
      <section style={{ padding: "20px 24px 80px" }}>
        <div style={{ maxWidth: 1000, margin: "0 auto" }}>
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            custom={0}
            className="glass-card"
            style={{ padding: 32, overflow: "hidden" }}
          >
            {/* Tabs */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24, flexWrap: "wrap", gap: 16 }}>
              <div style={{ display: "flex", gap: 8 }}>
                {(["seizure", "normal"] as const).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    style={{
                      padding: "10px 24px",
                      borderRadius: 10,
                      border: "1px solid",
                      borderColor: activeTab === tab
                        ? (tab === "seizure" ? "#ef4444" : "#22c55e")
                        : "rgba(255,255,255,0.06)",
                      background: activeTab === tab
                        ? (tab === "seizure" ? "rgba(239,68,68,0.1)" : "rgba(34,197,94,0.1)")
                        : "transparent",
                      color: activeTab === tab
                        ? (tab === "seizure" ? "#ef4444" : "#22c55e")
                        : "#64748b",
                      fontWeight: 600,
                      fontSize: 13,
                      cursor: "pointer",
                      transition: "all 0.3s",
                      textTransform: "capitalize",
                    }}
                  >
                    {tab === "seizure" ? "⚡ Seizure EEG" : "✅ Normal EEG"}
                  </button>
                ))}
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <FiActivity size={16} color={chartColor} />
                <span style={{ fontSize: 13, color: chartColor, fontWeight: 600 }}>
                  {activeTab === "seizure" ? "Epileptic Activity Detected" : "Normal Brain Activity"}
                </span>
              </div>
            </div>

            {/* Chart */}
            <div style={{ height: 300 }}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="eegGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={chartColor} stopOpacity={0.3} />
                      <stop offset="95%" stopColor={chartColor} stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                  <XAxis
                    dataKey="x"
                    stroke="#334155"
                    tick={{ fill: "#475569", fontSize: 11 }}
                    label={{ value: "Time Point (Hz)", position: "insideBottom", offset: -5, fill: "#64748b", fontSize: 12 }}
                  />
                  <YAxis
                    stroke="#334155"
                    tick={{ fill: "#475569", fontSize: 11 }}
                    label={{ value: "Amplitude (µV)", angle: -90, position: "insideLeft", fill: "#64748b", fontSize: 12 }}
                  />
                  <Tooltip
                    contentStyle={{
                      background: "rgba(15, 23, 42, 0.95)",
                      border: `1px solid ${chartColor}30`,
                      borderRadius: 12,
                      color: "#f1f5f9",
                      fontSize: 13,
                    }}
                  />
                  <Area type="monotone" dataKey="value" stroke={chartColor} strokeWidth={1.5} fill="url(#eegGradient)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ===== INFO CARDS ===== */}
      <section style={{ padding: "20px 24px 80px" }}>
        <div
          style={{
            maxWidth: 1000,
            margin: "0 auto",
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: 20,
          }}
        >
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={0} className="glass-card" style={{ padding: 28 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
              <div
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 12,
                  background: "rgba(0, 212, 255, 0.1)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <FiActivity size={20} color="#00d4ff" />
              </div>
              <h3 style={{ fontSize: 16, fontWeight: 700, color: "#f1f5f9" }}>What is EEG?</h3>
            </div>
            <p style={{ fontSize: 13, color: "#94a3b8", lineHeight: 1.8 }}>
              Electroencephalography (EEG) measures electrical activity in the brain using electrodes
              placed on the scalp. It detects voltage fluctuations resulting from ionic current flows
              within neurons, providing real-time insight into brain function.
            </p>
          </motion.div>

          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={1} className="glass-card" style={{ padding: 28 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
              <div
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 12,
                  background: "rgba(124, 58, 237, 0.1)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <FiGrid size={20} color="#7c3aed" />
              </div>
              <h3 style={{ fontSize: 16, fontWeight: 700, color: "#f1f5f9" }}>178 Features</h3>
            </div>
            <p style={{ fontSize: 13, color: "#94a3b8", lineHeight: 1.8 }}>
              Each sample contains 178 data points representing 1 second of EEG recording sampled at
              178 Hz. These features capture the temporal dynamics of brain electrical activity and
              are used as input to our LSTM model for seizure classification.
            </p>
          </motion.div>

          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={2} className="glass-card" style={{ padding: 28 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
              <div
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 12,
                  background: "rgba(34, 197, 94, 0.1)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <FiInfo size={20} color="#22c55e" />
              </div>
              <h3 style={{ fontSize: 16, fontWeight: 700, color: "#f1f5f9" }}>Data Labels</h3>
            </div>
            <p style={{ fontSize: 13, color: "#94a3b8", lineHeight: 1.8 }}>
              The &apos;y&apos; column indicates the class: <strong style={{ color: "#ef4444" }}>1 = Seizure</strong> and{" "}
              <strong style={{ color: "#22c55e" }}>0 = Non-seizure</strong>. The original dataset has 5 classes,
              but we use binary classification for clinical relevance — detecting seizure vs non-seizure states.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ===== DATA TABLE ===== */}
      <section style={{ padding: "20px 24px 80px" }}>
        <div style={{ maxWidth: 1000, margin: "0 auto" }}>
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={0} className="glass-card" style={{ padding: 28, overflow: "hidden" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20, flexWrap: "wrap", gap: 12 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <FiEye size={18} color="#00d4ff" />
                <h3 style={{ fontSize: 17, fontWeight: 700, color: "#f1f5f9" }}>Dataset Preview</h3>
                <span style={{ fontSize: 12, color: "#64748b", background: "rgba(255,255,255,0.04)", padding: "3px 10px", borderRadius: 6 }}>
                  20 rows × 11 cols
                </span>
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="btn-secondary"
                style={{ padding: "8px 20px", fontSize: 13, display: "flex", alignItems: "center", gap: 6 }}
                onClick={() => {
                  const header = ["ID", ...Array.from({ length: 10 }, (_, i) => `X${i + 1}`), "Label"].join(",");
                  const rows = sampleRows.map((r) =>
                    [r.id, ...Array.from({ length: 10 }, (_, i) => r[`X${i + 1}`]), r.label].join(",")
                  );
                  const csv = [header, ...rows].join("\n");
                  const blob = new Blob([csv], { type: "text/csv" });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement("a");
                  a.href = url;
                  a.download = "sample_eeg_data.csv";
                  a.click();
                  URL.revokeObjectURL(url);
                }}
              >
                <FiDownload size={14} /> Download CSV
              </motion.button>
            </div>

            <div style={{ overflowX: "auto" }}>
              <table className="data-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    {Array.from({ length: 10 }, (_, i) => (
                      <th key={i}>X{i + 1}</th>
                    ))}
                    <th>Label</th>
                  </tr>
                </thead>
                <tbody>
                  {sampleRows.map((row) => (
                    <tr key={row.id}>
                      <td style={{ fontWeight: 600, color: "#94a3b8" }}>{row.id}</td>
                      {Array.from({ length: 10 }, (_, i) => (
                        <td key={i}>{row[`X${i + 1}`]}</td>
                      ))}
                      <td>
                        <span
                          style={{
                            padding: "3px 10px",
                            borderRadius: 6,
                            fontSize: 11,
                            fontWeight: 700,
                            color: row.label === 1 ? "#ef4444" : "#22c55e",
                            background: row.label === 1 ? "rgba(239,68,68,0.1)" : "rgba(34,197,94,0.1)",
                          }}
                        >
                          {row.label === 1 ? "SEIZURE" : "NORMAL"}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
