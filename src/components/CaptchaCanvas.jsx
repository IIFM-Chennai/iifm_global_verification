import React, { useEffect, useRef } from "react";

const CaptchaCanvas = ({ text }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Background
    ctx.fillStyle = "#f5f5f5";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Noise lines
    for (let i = 0; i < 8; i++) {
      ctx.strokeStyle = randomColor();
      ctx.beginPath();
      ctx.moveTo(Math.random() * canvas.width, Math.random() * canvas.height);
      ctx.lineTo(Math.random() * canvas.width, Math.random() * canvas.height);
      ctx.stroke();
    }

    // Characters
    const chars = text.split("");
    chars.forEach((char, i) => {
      const fontSize = 28 + Math.random() * 4;
      ctx.font = `${fontSize}px Arial`;
      ctx.fillStyle = randomColor();

      const angle = (Math.random() - 0.5) * 0.6;
      ctx.save();
      ctx.translate(20 + i * 25, 30);
      ctx.rotate(angle);
      ctx.fillText(char, 0, 0);
      ctx.restore();
    });

    // Noise dots
    for (let i = 0; i < 80; i++) {
      ctx.fillStyle = randomColor();
      ctx.beginPath();
      ctx.arc(Math.random() * canvas.width, Math.random() * canvas.height, 1, 0, 2 * Math.PI);
      ctx.fill();
    }
  }, [text]);

  const randomColor = () =>
    `rgb(${Math.floor(Math.random() * 200)},${Math.floor(Math.random() * 200)},${Math.floor(Math.random() * 200)})`;

  return <canvas ref={canvasRef} width={180} height={50} style={{ borderRadius: 6 }} />;
};

export default CaptchaCanvas;
