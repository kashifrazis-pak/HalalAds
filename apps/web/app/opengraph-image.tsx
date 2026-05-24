import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Islamic Ad Network — Reach the Muslim World";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          background: "linear-gradient(135deg, #073D24 0%, #0A5C36 50%, #0F7A49 100%)",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          justifyContent: "space-between",
          padding: "72px 80px",
          fontFamily: "serif",
        }}
      >
        {/* Logo row */}
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div
            style={{
              width: 52,
              height: 52,
              borderRadius: 14,
              background: "rgba(201, 168, 76, 0.2)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 28,
            }}
          >
            ☽
          </div>
          <span style={{ color: "#ffffff", fontSize: 28, fontWeight: 700 }}>
            Islamic<span style={{ color: "#C9A84C" }}>AdNetwork</span>
          </span>
        </div>

        {/* Headline */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              background: "rgba(201, 168, 76, 0.15)",
              border: "1px solid rgba(201, 168, 76, 0.3)",
              borderRadius: 9999,
              padding: "6px 18px",
              width: "fit-content",
            }}
          >
            <span style={{ color: "#C9A84C", fontSize: 14, fontWeight: 600 }}>
              Halal Certified Ad Network
            </span>
          </div>
          <p
            style={{
              color: "#ffffff",
              fontSize: 64,
              fontWeight: 800,
              lineHeight: 1.1,
              margin: 0,
              maxWidth: 900,
            }}
          >
            Reach the Muslim World.
          </p>
          <p
            style={{
              color: "rgba(255,255,255,0.65)",
              fontSize: 26,
              margin: 0,
              maxWidth: 700,
              lineHeight: 1.4,
            }}
          >
            1.8 billion Muslims. Shariah-compliant. Precision-targeted advertising across Southeast Asia, the Middle East, and beyond.
          </p>
        </div>

        {/* Bottom stats */}
        <div style={{ display: "flex", gap: 48 }}>
          {[
            { val: "1.8B", label: "Muslim audience" },
            { val: "70%", label: "Publisher rev share" },
            { val: "100%", label: "Halal certified" },
          ].map(({ val, label }) => (
            <div key={label} style={{ display: "flex", flexDirection: "column", gap: 4 }}>
              <span style={{ color: "#C9A84C", fontSize: 36, fontWeight: 800 }}>{val}</span>
              <span style={{ color: "rgba(255,255,255,0.5)", fontSize: 15 }}>{label}</span>
            </div>
          ))}
        </div>
      </div>
    ),
    { ...size }
  );
}
