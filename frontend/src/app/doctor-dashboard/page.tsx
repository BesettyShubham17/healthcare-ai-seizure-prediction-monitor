"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { FiActivity, FiShield, FiFileText, FiClock } from "react-icons/fi";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function DoctorDashboard() {
  return (
    <div>
      <Navbar />
      <section style={{ minHeight: "100vh", padding: "140px 24px 80px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} style={{ textAlign: "center", marginBottom: 60 }}>
            <h1 className="heading-lg" style={{ marginBottom: 16 }}>
              Doctor <span className="gradient-text">Dashboard</span>
            </h1>
            <p className="text-body" style={{ maxWidth: 600, margin: "0 auto" }}>
              Access advanced EEG analytics, prediction history, and professional medical reports.
            </p>
          </motion.div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 24 }}>
            <Link href="/advanced-eeg" style={{ textDecoration: "none" }}>
              <motion.div whileHover={{ scale: 1.03 }} className="glass-card" style={{ padding: 32, textAlign: "center", borderColor: "rgba(0, 212, 255, 0.15)" }}>
                <FiActivity size={40} color="#00d4ff" style={{ margin: "0 auto 16px" }} />
                <h3 style={{ fontSize: 20, fontWeight: 700, color: "#f1f5f9", marginBottom: 12 }}>Advanced EEG Mode</h3>
                <p style={{ fontSize: 14, color: "#94a3b8" }}>Upload EDF or CSV files for automated seizure prediction and multi-channel analysis.</p>
              </motion.div>
            </Link>

            <Link href="/prediction-history" style={{ textDecoration: "none" }}>
              <motion.div whileHover={{ scale: 1.03 }} className="glass-card" style={{ padding: 32, textAlign: "center", borderColor: "rgba(124, 58, 237, 0.15)" }}>
                <FiClock size={40} color="#a78bfa" style={{ margin: "0 auto 16px" }} />
                <h3 style={{ fontSize: 20, fontWeight: 700, color: "#f1f5f9", marginBottom: 12 }}>Prediction History</h3>
                <p style={{ fontSize: 14, color: "#94a3b8" }}>View logs of all previous EEG analyses, patient outcomes, and risk assessments.</p>
              </motion.div>
            </Link>

            <Link href="/report-center" style={{ textDecoration: "none" }}>
              <motion.div whileHover={{ scale: 1.03 }} className="glass-card" style={{ padding: 32, textAlign: "center", borderColor: "rgba(34, 197, 94, 0.15)" }}>
                <FiFileText size={40} color="#22c55e" style={{ margin: "0 auto 16px" }} />
                <h3 style={{ fontSize: 20, fontWeight: 700, color: "#f1f5f9", marginBottom: 12 }}>Report Center</h3>
                <p style={{ fontSize: 14, color: "#94a3b8" }}>Manage and download generated PDF medical reports for all patients.</p>
              </motion.div>
            </Link>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
}
