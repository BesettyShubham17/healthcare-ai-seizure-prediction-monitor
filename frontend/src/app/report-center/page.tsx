"use client";

import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { FiFileText, FiDownload } from "react-icons/fi";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function ReportCenter() {
  const [reports, setReports] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const res = await fetch("http://localhost:8000/reports");
        const data = await res.json();
        setReports(data);
      } catch (err) {
        console.error("Failed to fetch reports");
      }
      setLoading(false);
    };
    fetchReports();
  }, []);

  return (
    <div>
      <Navbar />
      <section style={{ minHeight: "100vh", padding: "140px 24px 80px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} style={{ textAlign: "center", marginBottom: 40 }}>
            <h1 className="heading-lg" style={{ marginBottom: 16 }}>
              Report <span className="gradient-text">Center</span>
            </h1>
            <p className="text-body" style={{ maxWidth: 600, margin: "0 auto" }}>
              View and manage generated medical reports for EEG predictions.
            </p>
          </motion.div>

          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass-card" style={{ padding: 32 }}>
            {loading ? (
              <div style={{ textAlign: "center", padding: 40, color: "#94a3b8" }}>Loading reports...</div>
            ) : reports.length === 0 ? (
              <div style={{ textAlign: "center", padding: 40, color: "#94a3b8" }}>No reports found.</div>
            ) : (
              <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", color: "#f1f5f9" }}>
                  <thead>
                    <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.1)", color: "#94a3b8" }}>
                      <th style={{ padding: 12 }}>Patient ID</th>
                      <th style={{ padding: 12 }}>Timestamp</th>
                      <th style={{ padding: 12 }}>File Type</th>
                      <th style={{ padding: 12 }}>Result</th>
                      <th style={{ padding: 12 }}>Risk</th>
                    </tr>
                  </thead>
                  <tbody>
                    {reports.map((report, i) => (
                      <tr key={i} style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                        <td style={{ padding: 12, fontWeight: "bold" }}>{report.patient_id}</td>
                        <td style={{ padding: 12 }}>{new Date(report.timestamp).toLocaleString()}</td>
                        <td style={{ padding: 12 }}>{report.file_type}</td>
                        <td style={{ padding: 12, color: report.result === "SEIZURE DETECTED" ? "#ef4444" : "#22c55e" }}>
                          {report.result}
                        </td>
                        <td style={{ padding: 12 }}>{report.risk_pct.toFixed(1)}%</td>
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
