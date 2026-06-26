import { ImageResponse } from "next/og";

export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          alignItems: "center",
          background: "linear-gradient(90deg, #ffeaea 0%, #ad150b 100%)",
          color: "#210807",
          display: "flex",
          flexDirection: "column",
          fontFamily: "Arial, sans-serif",
          height: "100%",
          justifyContent: "center",
          letterSpacing: "0",
          width: "100%",
        }}
      >
        <div style={{ fontSize: 82, fontWeight: 700, lineHeight: 1 }}>WEBSTUDIO</div>
        <div style={{ fontSize: 30, marginTop: 26 }}>Por Sebastián</div>
        <div style={{ fontSize: 18, letterSpacing: "0.12em", marginTop: 18, textTransform: "uppercase" }}>
          Powered by LIKELI
        </div>
      </div>
    ),
    size,
  );
}
