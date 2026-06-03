"use client";

import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { FiZap, FiMenu, FiX, FiMoon, FiSun } from "react-icons/fi";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/sample-data", label: "Sample Data" },
  { href: "/detect", label: "Detection" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(true);

  return (
    <motion.nav
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: "easeOut" as const }}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        padding: "0 24px",
      }}
    >
      <div
        style={{
          maxWidth: 1280,
          margin: "12px auto 0",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "14px 28px",
          background: "rgba(2, 8, 23, 0.7)",
          backdropFilter: "blur(24px)",
          WebkitBackdropFilter: "blur(24px)",
          border: "1px solid rgba(0, 212, 255, 0.08)",
          borderRadius: 18,
        }}
      >
        {/* Logo */}
        <Link href="/" style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: 10 }}>
          <motion.div
            animate={{ rotate: [0, 360] }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            style={{
              width: 38,
              height: 38,
              borderRadius: 12,
              background: "linear-gradient(135deg, #00d4ff 0%, #7c3aed 100%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 20,
            }}
          >
            <FiZap color="white" />
          </motion.div>
          <div>
            <div style={{ fontSize: 17, fontWeight: 800, color: "#f1f5f9", letterSpacing: "-0.5px" }}>
              Neuro<span style={{ color: "#00d4ff" }}>Sense</span>
            </div>
            <div style={{ fontSize: 9, color: "#64748b", letterSpacing: "2px", textTransform: "uppercase", marginTop: -2 }}>
              AI DIAGNOSTICS
            </div>
          </div>
        </Link>

        {/* Desktop Links */}
        <div style={{ display: "flex", alignItems: "center", gap: 6 }} className="hidden md:flex">
          {navLinks.map((link) => {
            const active = pathname === link.href;
            return (
              <Link key={link.href} href={link.href} style={{ textDecoration: "none", position: "relative" }}>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  style={{
                    padding: "8px 18px",
                    borderRadius: 10,
                    fontSize: 14,
                    fontWeight: active ? 600 : 400,
                    color: active ? "#00d4ff" : "#94a3b8",
                    background: active ? "rgba(0, 212, 255, 0.08)" : "transparent",
                    transition: "all 0.3s",
                  }}
                >
                  {link.label}
                  {active && (
                    <motion.div
                      layoutId="nav-indicator"
                      style={{
                        position: "absolute",
                        bottom: 0,
                        left: "50%",
                        transform: "translateX(-50%)",
                        width: 20,
                        height: 2,
                        borderRadius: 2,
                        background: "#00d4ff",
                      }}
                    />
                  )}
                </motion.div>
              </Link>
            );
          })}
        </div>

        {/* Right Controls */}
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setDarkMode(!darkMode)}
            style={{
              width: 38,
              height: 38,
              borderRadius: 10,
              border: "1px solid rgba(255,255,255,0.06)",
              background: "rgba(255,255,255,0.03)",
              color: "#94a3b8",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              fontSize: 16,
            }}
          >
            {darkMode ? <FiSun /> : <FiMoon />}
          </motion.button>

          {/* Mobile Toggle */}
          <motion.button
            className="md:hidden"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setMobileOpen(!mobileOpen)}
            style={{
              width: 38,
              height: 38,
              borderRadius: 10,
              border: "1px solid rgba(255,255,255,0.06)",
              background: "rgba(255,255,255,0.03)",
              color: "#94a3b8",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              fontSize: 18,
            }}
          >
            {mobileOpen ? <FiX /> : <FiMenu />}
          </motion.button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scaleY: 0.95 }}
            animate={{ opacity: 1, y: 0, scaleY: 1 }}
            exit={{ opacity: 0, y: -10, scaleY: 0.95 }}
            transition={{ duration: 0.3 }}
            className="md:hidden"
            style={{
              maxWidth: 1280,
              margin: "8px auto 0",
              padding: "16px",
              background: "rgba(2, 8, 23, 0.9)",
              backdropFilter: "blur(24px)",
              border: "1px solid rgba(0, 212, 255, 0.08)",
              borderRadius: 16,
              display: "flex",
              flexDirection: "column",
              gap: 4,
            }}
          >
            {navLinks.map((link, i) => (
              <motion.div key={link.href} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}>
                <Link
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  style={{
                    display: "block",
                    padding: "12px 16px",
                    borderRadius: 10,
                    fontSize: 15,
                    fontWeight: pathname === link.href ? 600 : 400,
                    color: pathname === link.href ? "#00d4ff" : "#94a3b8",
                    background: pathname === link.href ? "rgba(0, 212, 255, 0.08)" : "transparent",
                    textDecoration: "none",
                  }}
                >
                  {link.label}
                </Link>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
