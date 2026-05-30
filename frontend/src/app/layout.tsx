import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "NeuroSense AI — Epileptic Seizure Prediction System",
  description:
    "AI-Powered Epileptic Seizure Prediction using LSTM Deep Learning. Hospital-grade medical intelligence platform for EEG analysis and real-time seizure detection.",
  keywords: [
    "epileptic seizure",
    "EEG",
    "LSTM",
    "deep learning",
    "medical AI",
    "seizure prediction",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=JetBrains+Mono:wght@400;500;600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body style={{ fontFamily: "'Inter', system-ui, sans-serif" }}>
        {/* Background Effects */}
        <div className="grid-bg" />
        <div className="orb orb-1" />
        <div className="orb orb-2" />
        <div className="orb orb-3" />
        <div className="eeg-bg">
          <div className="eeg-wave eeg-wave-1" />
          <div className="eeg-wave eeg-wave-2" />
          <div className="eeg-wave eeg-wave-3" />
          <div className="eeg-wave eeg-wave-4" />
        </div>
        <div style={{ position: "relative", zIndex: 1 }}>{children}</div>
      </body>
    </html>
  );
}
