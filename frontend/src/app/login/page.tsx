"use client";

import { motion } from "framer-motion";
import { useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { FiUser, FiLock, FiLogIn, FiShield, FiCpu } from "react-icons/fi";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

function LoginContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const modeParam = searchParams.get("mode");
  const mode = modeParam === "doctor" ? "doctor" : "user";
  
  const [username, setUsername] = useState(mode === "doctor" ? "dr_smith" : "patient_01");
  const [password, setPassword] = useState("password123");
  const [loading, setLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Mock authentication
    setTimeout(() => {
      setLoading(false);
      if (mode === "doctor") {
        router.push(`/doctor-dashboard`);
      } else {
        router.push(`/user-dashboard`);
      }
    }, 1500);
  };

  return (
    <div>
      <Navbar />

      <section style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "120px 24px 80px" }}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="glass-card"
          style={{ width: "100%", maxWidth: 440, padding: 48, position: "relative", overflow: "hidden" }}
        >
          {/* Background decoration */}
          <div style={{ position: "absolute", top: -50, right: -50, width: 150, height: 150, borderRadius: "50%", background: mode === "doctor" ? "rgba(0, 212, 255, 0.1)" : "rgba(124, 58, 237, 0.1)", filter: "blur(40px)", zIndex: 0 }} />
          
          <div style={{ position: "relative", zIndex: 1, textAlign: "center", marginBottom: 32 }}>
            <div style={{ 
              width: 64, height: 64, borderRadius: 20, 
              background: mode === "doctor" ? "linear-gradient(135deg, rgba(0, 212, 255, 0.1) 0%, rgba(124, 58, 237, 0.1) 100%)" : "linear-gradient(135deg, rgba(124, 58, 237, 0.1) 0%, rgba(0, 212, 255, 0.1) 100%)",
              display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px",
              border: `1px solid ${mode === "doctor" ? "rgba(0, 212, 255, 0.2)" : "rgba(124, 58, 237, 0.2)"}`
            }}>
              {mode === "doctor" ? <FiShield size={28} color="#00d4ff" /> : <FiUser size={28} color="#a78bfa" />}
            </div>
            <h2 style={{ fontSize: 24, fontWeight: 700, color: "#f1f5f9", marginBottom: 8 }}>
              {mode === "doctor" ? "Doctor Login" : "Patient Login"}
            </h2>
            <p style={{ fontSize: 14, color: "#94a3b8" }}>
              Secure access to NeuroSense AI Platform
            </p>
          </div>

          <form onSubmit={handleLogin} style={{ position: "relative", zIndex: 1, display: "flex", flexDirection: "column", gap: 20 }}>
            <div>
              <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#94a3b8", marginBottom: 8 }}>Username / ID</label>
              <div style={{ position: "relative" }}>
                <FiUser style={{ position: "absolute", left: 16, top: "50%", transform: "translateY(-50%)", color: "#64748b" }} />
                <input 
                  type="text" 
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  style={{ 
                    width: "100%", padding: "12px 16px 12px 42px", borderRadius: 12, 
                    background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)",
                    color: "#f1f5f9", fontSize: 15, outline: "none", transition: "border 0.3s"
                  }} 
                  onFocus={(e) => e.target.style.borderColor = mode === "doctor" ? "#00d4ff" : "#a78bfa"}
                  onBlur={(e) => e.target.style.borderColor = "rgba(255,255,255,0.08)"}
                  required
                />
              </div>
            </div>

            <div>
              <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#94a3b8", marginBottom: 8 }}>Password</label>
              <div style={{ position: "relative" }}>
                <FiLock style={{ position: "absolute", left: 16, top: "50%", transform: "translateY(-50%)", color: "#64748b" }} />
                <input 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  style={{ 
                    width: "100%", padding: "12px 16px 12px 42px", borderRadius: 12, 
                    background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)",
                    color: "#f1f5f9", fontSize: 15, outline: "none", transition: "border 0.3s"
                  }} 
                  onFocus={(e) => e.target.style.borderColor = mode === "doctor" ? "#00d4ff" : "#a78bfa"}
                  onBlur={(e) => e.target.style.borderColor = "rgba(255,255,255,0.08)"}
                  required
                />
              </div>
            </div>

            <motion.button 
              whileHover={{ scale: 1.02 }} 
              whileTap={{ scale: 0.98 }} 
              type="submit"
              disabled={loading}
              className={mode === "doctor" ? "btn-primary" : "btn-secondary"}
              style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, marginTop: 12, opacity: loading ? 0.7 : 1 }}
            >
              {loading ? (
                <>
                  <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }} style={{ width: 16, height: 16, border: "2px solid rgba(255,255,255,0.3)", borderTopColor: "white", borderRadius: "50%" }} />
                  Authenticating...
                </>
              ) : (
                <>
                  <FiLogIn /> Secure Login
                </>
              )}
            </motion.button>

            <div style={{ textAlign: "center", marginTop: 16 }}>
              <p style={{ fontSize: 12, color: "#64748b" }}>
                Demo Credentials: <br/> Username: {mode === "doctor" ? "dr_smith" : "patient_01"} | Password: password123
              </p>
            </div>
          </form>
        </motion.div>
      </section>

      <Footer />
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}><div style={{ color: "#64748b" }}>Loading...</div></div>}>
      <LoginContent />
    </Suspense>
  );
}
