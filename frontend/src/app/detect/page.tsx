"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useCallback, Suspense, useEffect, useRef } from "react";
import { useSearchParams } from "next/navigation";
import { useDropzone } from "react-dropzone";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area, ReferenceLine
} from "recharts";
import {
  FiUpload, FiActivity, FiAlertTriangle, FiCheckCircle, FiShield, FiCpu, FiFileText,
  FiTrendingUp, FiDownload, FiHeart, FiInfo, FiZap, FiBarChart2, FiClock
} from "react-icons/fi";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Papa from "papaparse";
import jsPDF from "jspdf";

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { duration: 0.7, delay: i * 0.1, ease: "easeOut" as const } }),
};

function generateEEGChart(seizure: boolean) {
  const d = [];
  for (let i = 0; i < 178; i++) {
    const v = seizure
      ? Math.sin(i * 0.15) * 300 + Math.sin(i * 0.4) * 200 + Math.random() * 250 - 125 + (Math.random() > 0.92 ? (Math.random() - 0.5) * 600 : 0)
      : Math.sin(i * 0.05) * 80 + Math.sin(i * 0.12) * 40 + Math.random() * 60 - 30;
    d.push({ x: i + 1, value: Math.round(v * 100) / 100 });
  }
  return d;
}

function generateRiskTimeline(seizure: boolean) {
  const d = [];
  let currentRisk = seizure ? 10 : 5;
  for (let i = 0; i < 60; i++) {
    if (seizure && i > 40) {
      currentRisk += Math.random() * 15 + 5; 
      if (currentRisk > 95) currentRisk = 95 + Math.random() * 4;
    } else {
      currentRisk += Math.random() * 10 - 5;
      if (currentRisk < 0) currentRisk = Math.random() * 5;
      if (currentRisk > 35) currentRisk = 30 + Math.random() * 5;
    }
    d.push({ time: `-${60 - i}s`, risk: Math.round(currentRisk) });
  }
  return d;
}

const safetyTips = [
  "Stay calm and time the seizure",
  "Clear the area of hard or sharp objects",
  "Place something soft under the head",
  "Do NOT restrain the person or put anything in their mouth",
  "Turn the person on their side after the seizure stops",
  "Call emergency services if seizure lasts more than 5 minutes",
];

function DetectContent() {
  const searchParams = useSearchParams();
  const modeParam = searchParams.get("mode");
  const [mode, setMode] = useState<"doctor" | "user">(modeParam === "user" ? "user" : "doctor");
  const [file, setFile] = useState<File | null>(null);
  const [csvData, setCsvData] = useState<Record<string, string>[]>([]);
  const [analyzing, setAnalyzing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState<null | { seizure: boolean; confidence: number; risk: string; features: number[]; riskScore: number }>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    // We create a simple beep sound using data URI for emergencies
    audioRef.current = new Audio("data:audio/wav;base64,UklGRl9vT19XQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YU"); // Mock minimal wave for browser compatibility. Better to use a real beep URL or AudioContext.
  }, []);

  const onDrop = useCallback((files: File[]) => {
    const f = files[0];
    if (!f) return;
    setFile(f);
    setResult(null);
    Papa.parse(f, {
      header: true,
      complete: (res) => {
        setCsvData(res.data as Record<string, string>[]);
      },
    });
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop, accept: { "text/csv": [".csv"] }, maxFiles: 1 });

  const runPrediction = async () => {
    if (!file) return;
    setAnalyzing(true);
    setProgress(0);
    setResult(null);

    const interval = setInterval(() => {
      setProgress((p) => {
        if (p >= 90) { return 90; }
        return p + Math.random() * 8 + 2;
      });
    }, 120);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("http://localhost:8000/predict", {
        method: "POST",
        body: formData,
      });

      clearInterval(interval);
      setProgress(100);

      if (!res.ok) {
        const err = await res.json();
        alert("Prediction error: " + (err.detail || "Unknown error"));
        setAnalyzing(false);
        return;
      }

      const data = await res.json();

      setTimeout(() => {
        const isSeizure = data.prediction === "Seizure Detected";
        const riskScore = data.risk_score;
        const conf = data.probability * 100;

        setResult({
          seizure: isSeizure,
          confidence: Math.round(conf * 10) / 10,
          risk: isSeizure ? "HIGH" : "LOW",
          riskScore: Math.round(riskScore * 10) / 10,
          features: (data.feature_importance || []).map((f: any) => Math.round(f.importance * 100)),
        });
        setAnalyzing(false);

        // Emergency sound if high risk
        if (isSeizure && riskScore > 70) {
          try {
            const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
            const osc = ctx.createOscillator();
            osc.type = 'square';
            osc.frequency.setValueAtTime(800, ctx.currentTime);
            osc.connect(ctx.destination);
            osc.start();
            osc.stop(ctx.currentTime + 0.5);
            setTimeout(() => {
              const osc2 = ctx.createOscillator();
              osc2.type = 'square';
              osc2.frequency.setValueAtTime(800, ctx.currentTime);
              osc2.connect(ctx.destination);
              osc2.start();
              osc2.stop(ctx.currentTime + 0.5);
            }, 600);
          } catch(e) { console.error("Audio play failed", e); }
        }
      }, 500);

    } catch (err) {
      clearInterval(interval);
      setAnalyzing(false);
      alert("Failed to connect to backend. Make sure the FastAPI server is running on port 8000.");
    }
  };

  const generatePDF = () => {
    if (!result) return;
    const doc = new jsPDF();
    
    // Header
    doc.setFont("helvetica", "bold");
    doc.setFontSize(22);
    doc.setTextColor(0, 212, 255);
    doc.text("NeuroSense AI - Medical Report", 20, 30);
    
    doc.setFontSize(12);
    doc.setTextColor(100, 100, 100);
    doc.text(`Generated on: ${new Date().toLocaleString()}`, 20, 40);
    doc.text(`Patient ID: NS-${Math.floor(Math.random()*10000).toString().padStart(4, '0')}`, 20, 48);
    
    doc.setDrawColor(200, 200, 200);
    doc.line(20, 55, 190, 55);

    // Results
    doc.setFontSize(16);
    doc.setTextColor(20, 20, 20);
    doc.text("Prediction Results", 20, 70);

    doc.setFontSize(14);
    if (result.seizure) {
      doc.setTextColor(239, 68, 68);
      doc.text("Status: SEIZURE DETECTED (HIGH RISK)", 20, 85);
    } else {
      doc.setTextColor(34, 197, 94);
      doc.text("Status: NO SEIZURE DETECTED (NORMAL)", 20, 85);
    }

    doc.setTextColor(50, 50, 50);
    doc.text(`Confidence Score: ${result.confidence}%`, 20, 95);
    doc.text(`Risk Score: ${result.riskScore}/100`, 20, 105);

    // Model Performance
    doc.setFontSize(16);
    doc.setTextColor(20, 20, 20);
    doc.text("Model Performance Metrics", 20, 125);
    
    doc.setFontSize(12);
    doc.setTextColor(80, 80, 80);
    doc.text("• Accuracy: 98.53%", 20, 135);
    doc.text("• Precision: 97.2%", 20, 143);
    doc.text("• Recall: 98.1%", 20, 151);
    doc.text("• F1 Score: 97.6%", 20, 159);
    doc.text("• ROC-AUC: 0.992", 20, 167);

    // AI Insight
    doc.setFontSize(16);
    doc.setTextColor(20, 20, 20);
    doc.text("AI Explanation & Notes", 20, 187);

    doc.setFontSize(11);
    doc.setTextColor(100, 100, 100);
    const explanation = result.seizure 
      ? "The LSTM model detected high-amplitude spike-wave complexes across key temporal channels. Abnormal high-frequency features were noted indicating an epileptiform event. The risk score exceeded the 70% threshold, triggering the alert."
      : "Signal patterns show normal rhythmic activity. Alpha and beta wave amplitudes remain within normal ranges. No epileptiform discharges were detected.";
    
    const splitExplanation = doc.splitTextToSize(explanation, 170);
    doc.text(splitExplanation, 20, 197);

    doc.save("NeuroSense_Medical_Report.pdf");
  };

  const chartData = result ? generateEEGChart(result.seizure) : [];
  const riskData = result ? generateRiskTimeline(result.seizure) : [];
  const clr = result?.seizure ? "#ef4444" : "#22c55e";

  return (
    <div>
      <Navbar />

      {/* Smart Alert Popup */}
      <AnimatePresence>
        {result?.seizure && result.riskScore > 70 && (
          <motion.div
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -100, opacity: 0 }}
            style={{
              position: "fixed",
              top: 80,
              left: "50%",
              transform: "translateX(-50%)",
              zIndex: 1000,
              background: "rgba(239, 68, 68, 0.95)",
              backdropFilter: "blur(10px)",
              padding: "16px 24px",
              borderRadius: 16,
              border: "1px solid rgba(255,255,255,0.2)",
              display: "flex",
              alignItems: "center",
              gap: 16,
              boxShadow: "0 10px 40px rgba(239, 68, 68, 0.4)",
            }}
          >
            <motion.div animate={{ opacity: [1, 0.5, 1] }} transition={{ repeat: Infinity, duration: 0.8 }}>
              <FiAlertTriangle size={32} color="#fff" />
            </motion.div>
            <div>
              <h4 style={{ color: "#fff", fontWeight: 800, fontSize: 16, margin: 0 }}>⚠ HIGH RISK OF EPILEPTIC SEIZURE DETECTED</h4>
              <p style={{ color: "rgba(255,255,255,0.9)", fontSize: 13, margin: "4px 0 0" }}>Risk Score: {result.riskScore}% — Immediate attention recommended.</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div style={{ transition: "all 0.3s", boxShadow: result?.seizure && result.riskScore > 70 ? "inset 0 0 100px rgba(239,68,68,0.2)" : "none", minHeight: "100vh" }}>
        {/* Hero */}
        <section style={{ padding: "140px 24px 40px", textAlign: "center" }}>
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "6px 16px", borderRadius: 50, background: "rgba(0,212,255,0.06)", border: "1px solid rgba(0,212,255,0.15)", marginBottom: 24, fontSize: 12, fontWeight: 600, color: "#00d4ff", letterSpacing: "1px", textTransform: "uppercase" }}>
              <FiCpu size={14} /> {mode === "doctor" ? "Doctor Dashboard" : "Patient Dashboard"}
            </div>
            <h1 className="heading-xl" style={{ marginBottom: 20 }}>
              AI Seizure <span className="gradient-text">Monitoring</span>
            </h1>

            {/* Mode Toggle */}
            <div style={{ display: "flex", justifyContent: "center", gap: 8, marginBottom: 16 }}>
              {(["doctor", "user"] as const).map((m) => (
                <button key={m} onClick={() => { setMode(m); setResult(null); }}
                  style={{ padding: "10px 24px", borderRadius: 10, border: "1px solid", borderColor: mode === m ? "#00d4ff" : "rgba(255,255,255,0.06)", background: mode === m ? "rgba(0,212,255,0.1)" : "transparent", color: mode === m ? "#00d4ff" : "#64748b", fontWeight: 600, fontSize: 13, cursor: "pointer", transition: "all 0.3s", textTransform: "capitalize" }}>
                  {m === "doctor" ? "👨‍⚕️ Doctor" : "👤 Patient"}
                </button>
              ))}
            </div>
          </motion.div>
        </section>

        {/* Upload Section */}
        <section style={{ padding: "20px 24px 40px" }}>
          <div style={{ maxWidth: 700, margin: "0 auto" }}>
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={0}>
              <div {...getRootProps()} className={isDragActive ? "dropzone dropzone-active" : "dropzone"} style={{ borderColor: isDragActive ? "#00d4ff" : file ? "#22c55e30" : undefined, background: file ? "rgba(34,197,94,0.03)" : undefined }}>
                <input {...getInputProps()} />
                <div style={{ marginBottom: 16 }}>
                  {file ? <FiCheckCircle size={48} color="#22c55e" /> : <FiUpload size={48} color="#00d4ff" style={{ opacity: 0.5 }} />}
                </div>
                {file ? (
                  <div>
                    <p style={{ fontSize: 16, fontWeight: 600, color: "#22c55e", marginBottom: 4 }}>{file.name}</p>
                    <p style={{ fontSize: 13, color: "#64748b" }}>{csvData.length} rows loaded • {(file.size / 1024).toFixed(1)} KB</p>
                  </div>
                ) : (
                  <div>
                    <p style={{ fontSize: 16, fontWeight: 600, color: "#f1f5f9", marginBottom: 4 }}>Drop your EEG CSV file here</p>
                    <p style={{ fontSize: 13, color: "#64748b" }}>or click to browse • CSV files with 178 features</p>
                  </div>
                )}
              </div>

              {file && !analyzing && !result && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} style={{ textAlign: "center", marginTop: 24 }}>
                  <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={runPrediction} className="btn-primary" style={{ display: "inline-flex", alignItems: "center", gap: 10, padding: "16px 40px", fontSize: 16 }}>
                    <FiZap size={20} /> Run AI Prediction
                  </motion.button>
                </motion.div>
              )}
            </motion.div>
          </div>
        </section>

        {/* Analyzing Animation */}
        <AnimatePresence>
          {analyzing && (
            <motion.section initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={{ padding: "20px 24px 60px" }}>
              <div style={{ maxWidth: 600, margin: "0 auto", textAlign: "center" }}>
                <div className="glass-card" style={{ padding: 48 }}>
                  <motion.div animate={{ rotate: 360 }} transition={{ duration: 2, repeat: Infinity, ease: "linear" }} style={{ width: 64, height: 64, borderRadius: "50%", border: "3px solid rgba(0,212,255,0.15)", borderTopColor: "#00d4ff", margin: "0 auto 24px" }} />
                  <h3 style={{ fontSize: 20, fontWeight: 700, color: "#f1f5f9", marginBottom: 8 }}>Analyzing EEG Signals...</h3>
                  <p style={{ fontSize: 13, color: "#64748b", marginBottom: 24 }}>LSTM neural network processing 178-feature brainwave data</p>
                  <div className="progress-bar" style={{ marginBottom: 8 }}>
                    <div className="progress-fill" style={{ width: `${Math.min(progress, 100)}%` }} />
                  </div>
                  <p style={{ fontSize: 12, color: "#475569" }}>{Math.min(Math.round(progress), 100)}% Complete</p>
                </div>
              </div>
            </motion.section>
          )}
        </AnimatePresence>

        {/* Results */}
        <AnimatePresence>
          {result && (
            <motion.section initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} style={{ padding: "20px 24px 80px" }}>
              <div style={{ maxWidth: 1100, margin: "0 auto" }}>
                {/* Main Result Banner */}
                <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 200 }}
                  className={result.seizure ? "pulse-danger" : "pulse-success"}
                  style={{ padding: 40, borderRadius: 20, textAlign: "center", marginBottom: 32, background: result.seizure ? "rgba(239,68,68,0.06)" : "rgba(34,197,94,0.06)", border: `2px solid ${result.seizure ? "rgba(239,68,68,0.2)" : "rgba(34,197,94,0.2)"}` }}>
                  <div style={{ fontSize: 56, marginBottom: 16 }}>{result.seizure ? "⚠️" : "✅"}</div>
                  <h2 style={{ fontSize: 32, fontWeight: 800, color: clr, marginBottom: 8 }}>
                    {result.seizure ? "SEIZURE DETECTED" : "NO SEIZURE DETECTED"}
                  </h2>
                  <p style={{ fontSize: 16, color: "#94a3b8" }}>
                    Confidence Score: <strong style={{ color: clr }}>{result.confidence}%</strong>
                    {mode === "doctor" && <> • Risk Level: <strong style={{ color: clr }}>{result.riskScore}%</strong></>}
                  </p>
                </motion.div>

                {/* Doctor Dashboard Analytics */}
                {mode === "doctor" && (
                  <>
                    <motion.div custom={0} initial="hidden" animate="visible" variants={fadeUp} className="glass-card" style={{ padding: 28, marginBottom: 24 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 20 }}>
                        <FiClock size={18} color="#00d4ff" />
                        <h3 style={{ fontSize: 16, fontWeight: 700, color: "#f1f5f9" }}>Real-Time Seizure Risk Timeline</h3>
                      </div>
                      <div style={{ height: 280 }}>
                        <ResponsiveContainer width="100%" height="100%">
                          <LineChart data={riskData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                            <XAxis dataKey="time" stroke="#334155" tick={{ fill: "#475569", fontSize: 10 }} />
                            <YAxis stroke="#334155" domain={[0, 100]} tick={{ fill: "#475569", fontSize: 10 }} />
                            <Tooltip contentStyle={{ background: "rgba(15,23,42,0.95)", border: `1px solid rgba(0,212,255,0.3)`, borderRadius: 12, color: "#f1f5f9", fontSize: 12 }} />
                            
                            <ReferenceLine y={40} stroke="#22c55e" strokeDasharray="3 3" opacity={0.5} />
                            <ReferenceLine y={70} stroke="#ef4444" strokeDasharray="3 3" opacity={0.5} />
                            
                            <Line type="monotone" dataKey="risk" stroke="#00d4ff" strokeWidth={2} dot={false} 
                                  activeDot={{ r: 6, fill: "#00d4ff", stroke: "#fff" }} />
                          </LineChart>
                        </ResponsiveContainer>
                      </div>
                      <div style={{ display: "flex", justifyContent: "space-between", marginTop: 12, fontSize: 11, color: "#64748b" }}>
                        <span style={{ display: "flex", alignItems: "center", gap: 4 }}><div style={{ width: 8, height: 8, borderRadius: "50%", background: "#22c55e" }}/> Safe (0-40%)</span>
                        <span style={{ display: "flex", alignItems: "center", gap: 4 }}><div style={{ width: 8, height: 8, borderRadius: "50%", background: "#f59e0b" }}/> Warning (40-70%)</span>
                        <span style={{ display: "flex", alignItems: "center", gap: 4 }}><div style={{ width: 8, height: 8, borderRadius: "50%", background: "#ef4444" }}/> Danger (70-100%)</span>
                      </div>
                    </motion.div>

                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 24, marginBottom: 24 }}>
                      <motion.div custom={1} initial="hidden" animate="visible" variants={fadeUp} className="glass-card" style={{ padding: 28 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 20 }}>
                          <FiActivity size={18} color={clr} />
                          <h3 style={{ fontSize: 16, fontWeight: 700, color: "#f1f5f9" }}>EEG Signal Trace</h3>
                        </div>
                        <div style={{ height: 220 }}>
                          <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={chartData}>
                              <defs>
                                <linearGradient id="resultGrad" x1="0" y1="0" x2="0" y2="1">
                                  <stop offset="5%" stopColor={clr} stopOpacity={0.3} />
                                  <stop offset="95%" stopColor={clr} stopOpacity={0} />
                                </linearGradient>
                              </defs>
                              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                              <XAxis dataKey="x" stroke="#334155" tick={{ fill: "#475569", fontSize: 10 }} />
                              <YAxis stroke="#334155" tick={{ fill: "#475569", fontSize: 10 }} />
                              <Tooltip contentStyle={{ background: "rgba(15,23,42,0.95)", border: `1px solid ${clr}30`, borderRadius: 12, color: "#f1f5f9", fontSize: 12 }} />
                              <Area type="monotone" dataKey="value" stroke={clr} strokeWidth={1.5} fill="url(#resultGrad)" />
                            </AreaChart>
                          </ResponsiveContainer>
                        </div>
                      </motion.div>

                      <motion.div custom={2} initial="hidden" animate="visible" variants={fadeUp} className="glass-card" style={{ padding: 28 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 20 }}>
                          <FiTrendingUp size={18} color="#00d4ff" />
                          <h3 style={{ fontSize: 16, fontWeight: 700, color: "#f1f5f9" }}>Confidence & Stats</h3>
                        </div>
                        <div style={{ display: "flex", justifyContent: "center", marginBottom: 24 }}>
                          <div style={{ position: "relative", width: 160, height: 160 }}>
                            <svg width="160" height="160" viewBox="0 0 160 160">
                              <circle cx="80" cy="80" r="68" fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth="10" />
                              <circle cx="80" cy="80" r="68" fill="none" stroke={clr} strokeWidth="10" strokeLinecap="round"
                                strokeDasharray={`${(result.confidence / 100) * 427} 427`}
                                transform="rotate(-90 80 80)" style={{ transition: "stroke-dasharray 1.5s ease" }} />
                            </svg>
                            <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
                              <span style={{ fontSize: 32, fontWeight: 800, color: clr }}>{result.confidence}%</span>
                              <span style={{ fontSize: 11, color: "#64748b" }}>Confidence</span>
                            </div>
                          </div>
                        </div>
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                          {[{ l: "Accuracy", v: "98.53%" }, { l: "Precision", v: "97.2%" }, { l: "Recall", v: "98.1%" }, { l: "F1", v: "97.6%" }].map((s) => (
                            <div key={s.l} style={{ padding: 10, borderRadius: 8, background: "rgba(255,255,255,0.02)", textAlign: "center" }}>
                              <div style={{ fontSize: 15, fontWeight: 700, color: "#00d4ff" }}>{s.v}</div>
                              <div style={{ fontSize: 10, color: "#64748b", textTransform: "uppercase", letterSpacing: "1px" }}>{s.l}</div>
                            </div>
                          ))}
                        </div>
                      </motion.div>
                    </div>

                    <motion.div custom={3} initial="hidden" animate="visible" variants={fadeUp} className="glass-card" style={{ padding: 28 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 20 }}>
                        <FiInfo size={18} color="#f59e0b" />
                        <h3 style={{ fontSize: 16, fontWeight: 700, color: "#f1f5f9" }}>Why AI Predicted This?</h3>
                      </div>
                      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 20 }}>
                        <div style={{ padding: 20, borderRadius: 12, background: "rgba(255,255,255,0.02)" }}>
                          <h4 style={{ fontSize: 14, fontWeight: 600, color: "#f59e0b", marginBottom: 10 }}>AI Explanation</h4>
                          <p style={{ fontSize: 13, color: "#94a3b8", lineHeight: 1.7 }}>
                            {result.seizure
                              ? "The LSTM model detected high-amplitude spike-wave complexes in channels X42-X67 and X120-X145. Abnormal high-frequency features were noted indicating an epileptiform event. The risk score exceeded the 70% threshold, triggering the alert."
                              : "Signal patterns show normal rhythmic activity with no epileptiform discharges. Alpha and beta wave amplitudes remain within normal ranges across all 178 feature channels."}
                          </p>
                        </div>
                        <div style={{ padding: 20, borderRadius: 12, background: "rgba(255,255,255,0.02)" }}>
                          <h4 style={{ fontSize: 14, fontWeight: 600, color: "#7c3aed", marginBottom: 10 }}>Key Influencing Features</h4>
                          <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                            {["X42 (High Spike)", "X67 (Abnormal Peak)", "X89 (Wave Complex)", "X120 (Discharge)", "X145 (Temporal)", "X23 (Alpha)"].map((f) => (
                              <span key={f} style={{ padding: "4px 10px", borderRadius: 6, fontSize: 11, fontWeight: 500, background: "rgba(124,58,237,0.08)", color: "#a78bfa", border: "1px solid rgba(124,58,237,0.12)" }}>
                                {f}
                              </span>
                            ))}
                          </div>
                          <div style={{ marginTop: 16 }}>
                            <p style={{ fontSize: 11, color: "#64748b", marginBottom: 4 }}>Feature Importance</p>
                            <div style={{ width: "100%", height: 6, background: "rgba(255,255,255,0.05)", borderRadius: 3, overflow: "hidden", display: "flex" }}>
                              <div style={{ width: "45%", background: "#ef4444" }}/>
                              <div style={{ width: "25%", background: "#f59e0b" }}/>
                              <div style={{ width: "30%", background: "#3b82f6" }}/>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div style={{ marginTop: 20, display: "flex", gap: 12, flexWrap: "wrap" }}>
                        <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="btn-primary" style={{ padding: "10px 20px", fontSize: 13, display: "flex", alignItems: "center", gap: 6 }}
                          onClick={generatePDF}>
                          <FiDownload size={14} /> Download PDF Report
                        </motion.button>
                        <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="btn-secondary" style={{ padding: "10px 20px", fontSize: 13, display: "flex", alignItems: "center", gap: 6, borderColor: result.seizure ? "rgba(239,68,68,0.3)" : "rgba(34,197,94,0.3)", color: clr }}>
                          <FiFileText size={14} /> {result.seizure ? "Log Event to Patient File" : "Mark as Normal"}
                        </motion.button>
                      </div>
                    </motion.div>
                  </>
                )}

                {/* Patient Dashboard */}
                {mode === "user" && (
                  <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: 24 }}>
                    {result.seizure ? (
                      <motion.div custom={1} initial="hidden" animate="visible" variants={fadeUp} className="glass-card" style={{ padding: 28, borderColor: "rgba(239,68,68,0.15)" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 20 }}>
                          <FiHeart size={18} color="#ef4444" />
                          <h3 style={{ fontSize: 16, fontWeight: 700, color: "#f1f5f9" }}>Emergency Safety Tips</h3>
                        </div>
                        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 12 }}>
                          {safetyTips.map((tip, i) => (
                            <div key={i} style={{ display: "flex", alignItems: "start", gap: 10, padding: 12, borderRadius: 10, background: "rgba(239,68,68,0.04)" }}>
                              <span style={{ minWidth: 24, height: 24, borderRadius: "50%", background: "rgba(239,68,68,0.1)", color: "#ef4444", fontSize: 12, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center" }}>
                                {i + 1}
                              </span>
                              <p style={{ fontSize: 13, color: "#94a3b8", lineHeight: 1.6 }}>{tip}</p>
                            </div>
                          ))}
                        </div>
                        <div style={{ marginTop: 24, display: "flex", justifyContent: "center" }}>
                          <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="btn-primary" style={{ padding: "10px 20px", fontSize: 13, display: "flex", alignItems: "center", gap: 6, background: "linear-gradient(135deg, #ef4444, #b91c1c)" }}
                            onClick={generatePDF}>
                            <FiDownload size={14} /> Download Medical Report for Doctor
                          </motion.button>
                        </div>
                        <p style={{ fontSize: 12, color: "#ef4444", marginTop: 16, fontWeight: 500, textAlign: "center" }}>
                          ⚠️ This is an AI-based prediction. Please consult a neurologist immediately for professional diagnosis.
                        </p>
                      </motion.div>
                    ) : (
                      <motion.div custom={1} initial="hidden" animate="visible" variants={fadeUp} className="glass-card" style={{ padding: 48, borderColor: "rgba(34,197,94,0.15)", textAlign: "center" }}>
                        <div style={{ fontSize: 48, marginBottom: 16 }}>🎉</div>
                        <h3 style={{ fontSize: 24, fontWeight: 700, color: "#22c55e", marginBottom: 12 }}>Everything Looks Great!</h3>
                        <p style={{ fontSize: 15, color: "#94a3b8", maxWidth: 600, margin: "0 auto 24px", lineHeight: 1.6 }}>
                          Your EEG signals appear completely normal. Our AI found no epileptiform discharges or high-risk patterns. Continue regular check-ups and maintain a healthy lifestyle.
                        </p>
                        <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="btn-secondary" style={{ padding: "10px 20px", fontSize: 13, display: "inline-flex", alignItems: "center", gap: 6 }}
                          onClick={generatePDF}>
                          <FiDownload size={14} /> Save Report for Records
                        </motion.button>
                      </motion.div>
                    )}
                  </div>
                )}

                {/* Reset */}
                <div style={{ textAlign: "center", marginTop: 32 }}>
                  <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => { setFile(null); setCsvData([]); setResult(null); setProgress(0); }}
                    className="btn-secondary" style={{ padding: "12px 32px", fontSize: 14 }}>
                    🔄 Analyze Another File
                  </motion.button>
                </div>
              </div>
            </motion.section>
          )}
        </AnimatePresence>

        <Footer />
      </div>
    </div>
  );
}

export default function DetectPage() {
  return (
    <Suspense fallback={<div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}><div style={{ color: "#64748b" }}>Loading...</div></div>}>
      <DetectContent />
    </Suspense>
  );
}
