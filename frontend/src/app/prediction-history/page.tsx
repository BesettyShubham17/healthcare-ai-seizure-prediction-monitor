"use client";

import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { FiClock, FiSearch } from "react-icons/fi";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function PredictionHistory() {
  const [history, setHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await fetch("http://localhost:8000/prediction-history");
        const data = await res.json();
        setHistory(data);
      } catch (err) {
        console.error("Failed to fetch history");
      }
      setLoading(false);
    };
    fetchHistory();
  }, []);

  return (
    <div>
      <Navbar />
      <section style={{ minHeight: "100vh", padding: "140px 24px 80px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} style={{ textAlign: "center", marginBottom: 40 }}>
            <h1 className="heading-lg" style={{ marginBottom: 16 }}>
              Prediction <span className="gradient-text">History</span>
            </h1>
            <p className="text-body" style={{ maxWidth: 600, margin: "0 auto" }}>
              Review past EEG predictions, risk scores, and input file types.
            </p>
          </motion.div>

          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass-card" style={{ padding: 32 }}>
            {loading ? (
              <div style={{ textAlign: "center", padding: 40, color: "#94a3b8" }}>Loading history...</div>
            ) : history.length === 0 ? (
              <div style={{ textAlign: "center", padding: 40, color: "#94a3b8" }}>No prediction history found.</div>
            ) : (
              <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", color: "#f1f5f9" }}>
                  <thead>
                    <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.1)", color: "#94a3b8" }}>
                      <th style={{ padding: 12 }}>Timestamp</th>
                      <th style={{ padding: 12 }}>File Type</th>
                      <th style={{ padding: 12 }}>Prediction</th>
                      <th style={{ padding: 12 }}>Risk Score</th>
                    </tr>
                  </thead>
                  <tbody>
                    {history.map((record, i) => (
                      <tr key={i} style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                        <td style={{ padding: 12 }}>{new Date(record.timestamp).toLocaleString()}</td>
                        <td style={{ padding: 12 }}>{record.file_type}</td>
                        <td style={{ padding: 12, color: record.prediction === "Seizure Detected" ? "#ef4444" : "#22c55e" }}>
                          {record.prediction}
                        </td>
                        <td style={{ padding: 12 }}>{record.risk_score.toFixed(1)}%</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </motion.div>
        </div>
      </section>
      <Footer />
    </div>
  );
}
