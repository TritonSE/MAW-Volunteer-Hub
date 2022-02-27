const { createCanvas } = require("canvas");

function simple_hash(str) {
  if (!str) return 2;
  return str.split("").reduce((prev, next) => prev + next.charCodeAt(0), 0);
}

function pfp_generate(name, as_buffer = false) {
  const canvas = createCanvas(400, 400);
  const ctx = canvas.getContext("2d");

  const colors = [
    "#FF585D",
    "#FFB549",
    "#8DC8E8",
    "#1A68BF",
    "#0057B8",
    "#5286C0",
    "#0057B8",
    "#E478f0",
  ];

  ctx.beginPath();
  ctx.fillStyle = colors[simple_hash(name) % colors.length];
  ctx.arc(200, 200, 200, 0, 2 * Math.PI);
  ctx.fill();

  ctx.textAlign = "center";
  if (!name) {
    ctx.font = "100px sans-serif";

    ctx.fillStyle = "#333333";
    ctx.fillText("MAW", 205, 245);

    ctx.fillStyle = "#F3F3F3";
    ctx.fillText("MAW", 200, 240);
  } else {
    ctx.font = "200px sans-serif";

    ctx.fillStyle = "#333333";
    ctx.fillText(name.charAt(0).toUpperCase(), 205, 265);

    ctx.fillStyle = "#F3F3F3";
    ctx.fillText(name.charAt(0).toUpperCase(), 200, 260);
  }

  if (as_buffer) return canvas.toBuffer("image/png");
  return canvas.createPNGStream();
}

module.exports = {
  pfp_generate,
};
