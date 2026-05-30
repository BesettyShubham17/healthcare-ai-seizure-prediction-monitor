"use client";

import { motion } from "framer-motion";
import { FiGithub, FiLinkedin, FiMail, FiZap } from "react-icons/fi";

export default function Footer() {
  return (
    <footer
      style={{
        borderTop: "1px solid rgba(255,255,255,0.04)",
        padding: "60px 24px 40px",
        background: "rgba(2, 8, 23, 0.5)",
        backdropFilter: "blur(10px)",
      }}
    >
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
            gap: 40,
            marginBottom: 40,
          }}
        >
          {/* Brand */}
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
              <div
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 10,
                  background: "linear-gradient(135deg, #00d4ff 0%, #7c3aed 100%)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <FiZap color="white" size={18} />
              </div>
              <span style={{ fontSize: 18, fontWeight: 700, color: "#f1f5f9" }}>
                Neuro<span style={{ color: "#00d4ff" }}>Sense</span> AI
              </span>
            </div>
            <p style={{ fontSize: 14, color: "#64748b", lineHeight: 1.7, maxWidth: 300 }}>
              Hospital-grade AI-powered epileptic seizure prediction system using LSTM deep learning models and EEG signal analysis.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 style={{ fontSize: 13, fontWeight: 600, color: "#94a3b8", letterSpacing: "1.5px", textTransform: "uppercase", marginBottom: 16 }}>
              Platform
            </h4>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {["Home", "About", "Sample Data", "Detection"].map((item) => (
                <a
                  key={item}
                  href={item === "Home" ? "/" : `/${item.toLowerCase().replace(" ", "-")}`}
                  style={{ fontSize: 14, color: "#64748b", textDecoration: "none", transition: "color 0.2s" }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = "#00d4ff")}
                  onMouseLeave={(e) => (e.currentTarget.style.color = "#64748b")}
                >
                  {item}
                </a>
              ))}
            </div>
          </div>

          {/* Tech Stack */}
          <div>
            <h4 style={{ fontSize: 13, fontWeight: 600, color: "#94a3b8", letterSpacing: "1.5px", textTransform: "uppercase", marginBottom: 16 }}>
              Technology
            </h4>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {["LSTM", "TensorFlow", "Next.js", "Python", "EEG Analysis", "Deep Learning"].map((tag) => (
                <span
                  key={tag}
                  style={{
                    padding: "5px 12px",
                    borderRadius: 8,
                    fontSize: 12,
                    fontWeight: 500,
                    color: "#94a3b8",
                    background: "rgba(0, 212, 255, 0.06)",
                    border: "1px solid rgba(0, 212, 255, 0.1)",
                  }}
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: 16,
            paddingTop: 24,
            borderTop: "1px solid rgba(255,255,255,0.04)",
          }}
        >
          <p style={{ fontSize: 13, color: "#475569" }}>
            © 2026 NeuroSense AI. Built with 🧠 for healthcare innovation.
          <br />
          <span style={{ fontSize: 12, color: "#334155", marginTop: 4, display: "block" }}>
            © Shubham Besetty. All rights reserved.
          </span>
          </p>
          <div style={{ display: "flex", gap: 12 }}>
            {[FiGithub, FiLinkedin, FiMail].map((Icon, i) => (
              <motion.a
                key={i}
                href="#"
                whileHover={{ scale: 1.15, y: -2 }}
                whileTap={{ scale: 0.9 }}
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 10,
                  background: "rgba(255,255,255,0.04)",
                  border: "1px solid rgba(255,255,255,0.06)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#64748b",
                  textDecoration: "none",
                  transition: "all 0.2s",
                }}
              >
                <Icon size={16} />
              </motion.a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
