import React, { useEffect, useRef } from "react";

const CaptchaCanvas = ({ text }) => {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);

  const drawCaptcha = () => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext("2d");

    /* ---------- Responsive sizing ---------- */
    const width = Math.min(container.offsetWidth, 260);
    const height = 50;

    canvas.width = width;
    canvas.height = height;

    ctx.clearRect(0, 0, width, height);

    /* ---------- Enterprise gradient background ---------- */
    const gradient = ctx.createLinearGradient(0, 0, width, height);
    gradient.addColorStop(0, "#f9fafb");
    gradient.addColorStop(1, "#eef2f7");

    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);

    /* ---------- Border ---------- */
    ctx.strokeStyle = "#cbd5e1";
    ctx.lineWidth = 1;
    ctx.strokeRect(0.5, 0.5, width - 1, height - 1);

    /* ---------- Text ---------- */
    ctx.textBaseline = "middle";
    ctx.textAlign = "center";
    ctx.font = "600 22px Inter, system-ui, sans-serif";
    ctx.fillStyle = "#0f172a";

    const spacing = width / (text.length + 1);

    text.split("").forEach((char, index) => {
      const x = spacing * (index + 1);
      const y = height / 2;

      ctx.save();
      ctx.translate(x, y);
      ctx.rotate((Math.random() - 0.5) * 0.05); // very subtle
      ctx.fillText(char, 0, 0);
      ctx.restore();
    });

    /* ---------- Soft security lines (enterprise style) ---------- */
    ctx.strokeStyle = "rgba(15, 23, 42, 0.06)";
    ctx.lineWidth = 1;

    for (let i = 0; i < 2; i++) {
      ctx.beginPath();
      ctx.moveTo(0, Math.random() * height);
      ctx.lineTo(width, Math.random() * height);
      ctx.stroke();
    }
  };

  useEffect(() => {
    drawCaptcha();
    window.addEventListener("resize", drawCaptcha);
    return () => window.removeEventListener("resize", drawCaptcha);
  }, [text]);

  return (
    <div
      ref={containerRef}
      style={{
        width: "100%",
        maxWidth: 150,
      }}
    >
      <canvas
        ref={canvasRef}
        style={{
          width: "100%",
          height: 50,
          borderRadius: 6,
        }}
      />
    </div>
  );
};

export default CaptchaCanvas;
