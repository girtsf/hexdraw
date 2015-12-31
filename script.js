'use strict';

const TRIANGLE_SIZE = 50;  // pixels
const TRIANGLE_INSET = 3;  // pixels

class HexGrid {
  constructor(container) {
    this._stage = new Konva.Stage({
      container: container,
      width: 500,
      height: 500,
    });
    this._layer = new Konva.Layer();
    this._stage.add(this._layer);
    //  const canvas = document.getElementById(canvasName);
    // this._ctx = canvas.getContext('2d');
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

  drawTriangle(group, points, r, g, b, a) {
    const fill = `rgba(${r}, ${g}, ${b}, ${a})`;
    let poly = new Konva.Line({
      points: points,
      fill: fill,
      stroke: 'black',
      strokeWidth: 1,
      closed: true,
    });
    group.add(poly);
  }

  drawLeftTriangle(group, x, y, r, g, b, a) {
    const points = [x, y, x + this.xOffset(), y + this.yOffset(), x, y + TRIANGLE_SIZE];
    this.drawTriangle(group, points, r, g, b, a);
  }

  drawRightTriangle(group, x, y, r, g, b, a) {
    const points = [x, y, x, y + TRIANGLE_SIZE, x - this.xOffset(), y + this.yOffset()];
    this.drawTriangle(group, points, r, g, b, a);
  }

  drawSlice(wedges) {
    let group = new Konva.Group({
      x: 100,
      y: 50,
    });
    for (let col = 0; col < wedges; col++) {
      const rows = wedges - col;
      for (let row = 0; row < rows; row++) {
        let x = col * this.xOffset();
        let y = row * TRIANGLE_SIZE + col * this.yOffset();
        this.drawLeftTriangle(group, x, y, this.randomColor(), this.randomColor(), this.randomColor(), 0.7);
        if (row !== (rows - 1)) {
          x += this.xOffset();
          y += this.yOffset();
          this.drawRightTriangle(group, x, y, this.randomColor(), this.randomColor(), this.randomColor(), 0.7);
        }
      }
    }
    this._layer.add(group);
    this._layer.draw();
  }
}

function draw() {
  let hex = new HexGrid('container')
  hex.drawSlice(3);
}
