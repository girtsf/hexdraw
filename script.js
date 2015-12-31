'use strict';

const TRIANGLE_SIZE = 50;  // pixels
const TRIANGLE_INSET = 3;  // pixels

class HexGrid {
  constructor(canvasName) {
    const canvas = document.getElementById(canvasName);
    this._ctx = canvas.getContext('2d');
  }

  getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
  }

  randomColor() {
    const c = this.getRandomInt(0, 256);
    return c;
  }

  xOffset() {
    return TRIANGLE_SIZE * Math.sin(Math.PI / 3);
  }

  yOffset() {
    return TRIANGLE_SIZE * Math.cos(Math.PI / 3);
  }

  drawLeftTriangle(ctx, r, g, b, a) {
    ctx.strokeStyle = 'rgb(0, 0, 0)';
    const fill = `rgba(${r}, ${g}, ${b}, ${a})`;
    ctx.fillStyle = fill;
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(this.xOffset(), this.yOffset());
    ctx.lineTo(0, TRIANGLE_SIZE);
    ctx.lineTo(0, 0);
    ctx.fill();
    ctx.stroke();
  }

  drawRightTriangle(ctx, r, g, b, a) {
    const fill = `rgba(${r}, ${g}, ${b}, ${a})`;
    ctx.fillStyle = fill;
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(0, TRIANGLE_SIZE);
    ctx.lineTo(-this.xOffset(), this.yOffset());
    ctx.lineTo(0, 0);
    ctx.fill();
    ctx.stroke();
  }

  drawSlice(wedges) {
    let ctx = this._ctx;
    for (let col = 0; col < wedges; col++) {
      const rows = wedges - col;
      for (let row = 0; row < rows; row++) {
        ctx.save();
        ctx.translate(col * this.xOffset(), row * TRIANGLE_SIZE + col * this.yOffset());
        this.drawLeftTriangle(ctx, this.randomColor(), this.randomColor(), this.randomColor(), 0.7);
        if (row !== (rows - 1)) {
          ctx.translate(this.xOffset(), this.yOffset());
          this.drawRightTriangle(ctx, this.randomColor(), this.randomColor(), this.randomColor(), 0.7);
        }
        ctx.restore();
      }
    }
  }
}

function draw() {
  let hex = new HexGrid('canvas')
  hex.drawSlice(3);
}
