"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { FiActivity, FiUser, FiInfo } from "react-icons/fi";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function UserDashboard() {
  return (
    <div>
      <Navbar />
      <section style={{ minHeight: "100vh", padding: "140px 24px 80px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} style={{ textAlign: "center", marginBottom: 60 }}>
            <h1 className="heading-lg" style={{ marginBottom: 16 }}>
              Patient <span className="gradient-text">Dashboard</span>
            </h1>
            <p className="text-body" style={{ maxWidth: 600, margin: "0 auto" }}>
              Welcome back. Easily upload your EEG recordings and check your results.
            </p>
          </motion.div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 24 }}>
            <Link href="/advanced-eeg" style={{ textDecoration: "none" }}>
              <motion.div whileHover={{ scale: 1.03 }} className="glass-card" style={{ padding: 32, textAlign: "center", borderColor: "rgba(124, 58, 237, 0.15)" }}>
                <FiActivity size={40} color="#a78bfa" style={{ margin: "0 auto 16px" }} />
                <h3 style={{ fontSize: 20, fontWeight: 700, color: "#f1f5f9", marginBottom: 12 }}>Check EEG Recording</h3>
                <p style={{ fontSize: 14, color: "#94a3b8" }}>Upload your CSV or EDF file for an instant AI-powered seizure risk assessment.</p>
              </motion.div>
            </Link>

            <Link href="/about" style={{ textDecoration: "none" }}>
              <motion.div whileHover={{ scale: 1.03 }} className="glass-card" style={{ padding: 32, textAlign: "center", borderColor: "rgba(0, 212, 255, 0.15)" }}>
                <FiInfo size={40} color="#00d4ff" style={{ margin: "0 auto 16px" }} />
                <h3 style={{ fontSize: 20, fontWeight: 700, color: "#f1f5f9", marginBottom: 12 }}>Safety Information</h3>
                <p style={{ fontSize: 14, color: "#94a3b8" }}>Read guidelines and best practices for managing your condition.</p>
              </motion.div>
            </Link>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
}
