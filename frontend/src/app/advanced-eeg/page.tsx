"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useRef, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine, AreaChart, Area
} from "recharts";
import {
  FiUpload, FiActivity, FiAlertTriangle, FiCheckCircle, FiInfo, FiDownload, FiFileText
} from "react-icons/fi";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { duration: 0.7, delay: i * 0.1, ease: "easeOut" as const } }),
};

export default function AdvancedEEGPage() {
  const [file, setFile] = useState<File | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState<any>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    audioRef.current = new Audio("data:audio/wav;base64,UklGRl9vT19XQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YU");
  }, []);

  const onDrop = (files: File[]) => {
    if (files.length > 0) {
      setFile(files[0]);
      setResult(null);
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "text/csv": [".csv"], "application/octet-stream": [".edf"] },
    maxFiles: 1
  });

  const runPrediction = async () => {
    if (!file) return;
    setAnalyzing(true);
    setProgress(10);
    setResult(null);
    
    const isEdf = file.name.toLowerCase().endsWith(".edf");
    const endpoint = isEdf ? "http://localhost:8000/predict-edf" : "http://localhost:8000/predict";
    
    const formData = new FormData();
    formData.append("file", file);

    const interval = setInterval(() => {
      setProgress(p => Math.min(p + 10, 90));
    }, 300);

    try {
      const response = await fetch(endpoint, {
        method: "POST",
        body: formData
      });
      
      const data = await response.json();
      clearInterval(interval);
      setProgress(100);
      
      if (!response.ok) {
        alert("Error: " + data.detail);
        setAnalyzing(false);
        return;
      }
      
      setTimeout(() => {
        setResult({
          seizure: data.prediction === "Seizure Detected",
          riskScore: data.risk_score,
          probability: data.probability,
          riskTimeline: data.risk_timeline,
          explanations: data.explanations,
          featureImportance: data.feature_importance
        });
        setAnalyzing(false);

        if (data.prediction === "Seizure Detected" && data.risk_score > 70) {
          try {
            const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
            const osc = ctx.createOscillator();
            osc.type = 'square';
            osc.frequency.setValueAtTime(800, ctx.currentTime);
            osc.connect(ctx.destination);
            osc.start();
            osc.stop(ctx.currentTime + 0.5);
          } catch (e) {
            console.error("Audio failed", e);
          }
        }
      }, 500);

    } catch (err) {
      clearInterval(interval);
      setAnalyzing(false);
      alert("Failed to connect to backend");
    }
  };

  const downloadPDF = async () => {
    if (!result || !file) return;
    try {
      const formData = new FormData();
      formData.append("patient_id", `NS-${Math.floor(Math.random()*10000).toString().padStart(4, '0')}`);
      formData.append("probability", result.probability.toString());
      formData.append("file_type", file.name.endsWith(".edf") ? "EDF" : "CSV");
      formData.append("doctor_notes", "");

      const res = await fetch("http://localhost:8000/generate-report", {
        method: "POST",
        body: formData
      });
      const data = await res.json();
      if (data.pdf_base64) {
        const linkSource = `data:application/pdf;base64,${data.pdf_base64}`;
        const downloadLink = document.createElement("a");
        downloadLink.href = linkSource;
        downloadLink.download = data.filename;
        downloadLink.click();
      }
    } catch(e) {
      console.error(e);
      alert("Failed to generate PDF");
    }
  };

  const clr = result?.seizure ? "#ef4444" : "#22c55e";

  const riskData = result?.riskTimeline?.map((risk: number, i: number) => ({
    time: `Window ${i+1}`,
    risk: risk * 100
  })) || [];

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
              position: "fixed", top: 80, left: "50%", transform: "translateX(-50%)", zIndex: 1000,
              background: "rgba(239, 68, 68, 0.95)", backdropFilter: "blur(10px)",
              padding: "16px 24px", borderRadius: 16, border: "1px solid rgba(255,255,255,0.2)",
              display: "flex", alignItems: "center", gap: 16, boxShadow: "0 10px 40px rgba(239, 68, 68, 0.4)",
            }}
          >
            <motion.div animate={{ opacity: [1, 0.5, 1] }} transition={{ repeat: Infinity, duration: 0.8 }}>
              <FiAlertTriangle size={32} color="#fff" />
            </motion.div>
            <div>
              <h4 style={{ color: "#fff", fontWeight: 800, fontSize: 16, margin: 0 }}>⚠ HIGH RISK OF EPILEPTIC SEIZURE DETECTED</h4>
              <p style={{ color: "rgba(255,255,255,0.9)", fontSize: 13, margin: "4px 0 0" }}>Risk Score: {result.riskScore.toFixed(1)}% — Immediate attention recommended.</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div style={{ transition: "all 0.3s", boxShadow: result?.seizure && result.riskScore > 70 ? "inset 0 0 100px rgba(239,68,68,0.2)" : "none", minHeight: "100vh" }}>
        <section style={{ padding: "140px 24px 40px", textAlign: "center" }}>
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <h1 className="heading-xl" style={{ marginBottom: 20 }}>
              Advanced EEG <span className="gradient-text">Processing Mode</span>
            </h1>
            <p style={{ color: "#94a3b8", fontSize: "1.1rem", maxWidth: 600, margin: "0 auto" }}>
              Upload CSV or EDF files for automatic detection using the unified preprocessing pipeline and LSTM model inference.
            </p>
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
                    <p style={{ fontSize: 13, color: "#64748b" }}>{(file.size / 1024).toFixed(1)} KB</p>
                  </div>
                ) : (
                  <div>
                    <p style={{ fontSize: 16, fontWeight: 600, color: "#f1f5f9", marginBottom: 4 }}>Drop your EEG CSV or EDF file here</p>
                    <p style={{ fontSize: 13, color: "#64748b" }}>or click to browse</p>
                  </div>
                )}
              </div>

              {file && !analyzing && !result && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} style={{ textAlign: "center", marginTop: 24 }}>
                  <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={runPrediction} className="btn-primary" style={{ display: "inline-flex", alignItems: "center", gap: 10, padding: "16px 40px", fontSize: 16 }}>
                    <FiActivity size={20} /> Run Advanced Analysis
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
                  <div className="progress-bar" style={{ marginBottom: 8 }}>
                    <div className="progress-fill" style={{ width: `${progress}%` }} />
                  </div>
                  <p style={{ fontSize: 12, color: "#475569" }}>{Math.round(progress)}% Complete</p>
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
                <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 200 }}
                  className={result.seizure ? "pulse-danger" : "pulse-success"}
                  style={{ padding: 40, borderRadius: 20, textAlign: "center", marginBottom: 32, background: result.seizure ? "rgba(239,68,68,0.06)" : "rgba(34,197,94,0.06)", border: `2px solid ${result.seizure ? "rgba(239,68,68,0.2)" : "rgba(34,197,94,0.2)"}` }}>
                  <div style={{ fontSize: 56, marginBottom: 16 }}>{result.seizure ? "⚠️" : "✅"}</div>
                  <h2 style={{ fontSize: 32, fontWeight: 800, color: clr, marginBottom: 8 }}>
                    {result.seizure ? "SEIZURE DETECTED" : "NO SEIZURE DETECTED"}
                  </h2>
                  <p style={{ fontSize: 16, color: "#94a3b8" }}>
                    Risk Level: <strong style={{ color: clr }}>{result.riskScore.toFixed(1)}%</strong>
                  </p>
                </motion.div>

                <motion.div custom={0} initial="hidden" animate="visible" variants={fadeUp} className="glass-card" style={{ padding: 28, marginBottom: 24 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 20 }}>
                    <FiActivity size={18} color="#00d4ff" />
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
                        <Line type="monotone" dataKey="risk" stroke="#00d4ff" strokeWidth={2} dot={true} activeDot={{ r: 6, fill: "#00d4ff", stroke: "#fff" }} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </motion.div>

                <motion.div custom={1} initial="hidden" animate="visible" variants={fadeUp} className="glass-card" style={{ padding: 28 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 20 }}>
                    <FiInfo size={18} color="#f59e0b" />
                    <h3 style={{ fontSize: 16, fontWeight: 700, color: "#f1f5f9" }}>Why AI Predicted This?</h3>
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 20 }}>
                    <div style={{ padding: 20, borderRadius: 12, background: "rgba(255,255,255,0.02)" }}>
                      <h4 style={{ fontSize: 14, fontWeight: 600, color: "#f59e0b", marginBottom: 10 }}>AI Explanation</h4>
                      <ul style={{ fontSize: 13, color: "#94a3b8", lineHeight: 1.7, paddingLeft: 16 }}>
                        {result.explanations?.map((exp: string, idx: number) => (
                          <li key={idx}>{exp}</li>
                        ))}
                      </ul>
                    </div>
                    <div style={{ padding: 20, borderRadius: 12, background: "rgba(255,255,255,0.02)" }}>
                      <h4 style={{ fontSize: 14, fontWeight: 600, color: "#7c3aed", marginBottom: 10 }}>Feature Influence</h4>
                      <ul style={{ fontSize: 13, color: "#94a3b8", lineHeight: 1.7, paddingLeft: 16 }}>
                        {result.featureImportance?.slice(0, 5).map((f: any, idx: number) => (
                          <li key={idx}>{f.feature}: {(f.importance * 100).toFixed(2)}%</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                  <div style={{ marginTop: 20, display: "flex", gap: 12, flexWrap: "wrap" }}>
                    <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="btn-primary" style={{ padding: "10px 20px", fontSize: 13, display: "flex", alignItems: "center", gap: 6 }}
                      onClick={downloadPDF}>
                      <FiDownload size={14} /> Download PDF Report
                    </motion.button>
                  </div>
                </motion.div>

                <div style={{ textAlign: "center", marginTop: 32 }}>
                  <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => { setFile(null); setResult(null); setProgress(0); }}
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
