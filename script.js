'use strict';

const TRIANGLE_SIZE = 20;  // pixels
const TRIANGLE_INSET = 3;  // pixels

// Returns a random int [min, max).
function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

function makeTriangularArray(size, constructorFn) {
  let data = [];
  for (let col = 0; col < size; col++) {
    let colData = [];
    for (let row = 0; row < (size - col) * 2 - 1; row++) {
      colData.push(constructorFn());
    }
    data.push(colData);
  }
  return data;
}

function getRandomFill() {
  const r = getRandomInt(0, 256);
  const g = getRandomInt(0, 256);
  const b = getRandomInt(0, 256);
  return `rgba(${r}, ${g}, ${b}, 0.8)`;
}

// Handles drawing a hex grid.
class HexGrid {
  constructor(size, container) {
    this._stage = new Konva.Stage({
      container: container,
      width: 500,
      height: 500,
    });
    this._layer = new Konva.Layer();
    this._stage.add(this._layer);
    this._size = size;
    this._triangles = makeTriangularArray(size, () => []);
  }

  xOffset() {
    return TRIANGLE_SIZE * Math.sin(Math.PI / 3);
  }

  yOffset() {
    return TRIANGLE_SIZE * Math.cos(Math.PI / 3);
  }

  drawTriangle(group, points, col, row) {
    let fill;
    if (this._triangles[col][row].length) {
      fill = this._triangles[col][row][0].fill();
    } else {
      fill = getRandomFill();
    }
    let poly = new Konva.Line({
      points: points,
      fill: fill,
      stroke: 'black',
      strokeWidth: 1,
      closed: true,
    });
    this._triangles[col][row].push(poly);
    group.add(poly);
  }

  drawLeftTriangle(group, x, y, col, row) {
    const points = [x, y, x + this.xOffset(), y + this.yOffset(), x, y + TRIANGLE_SIZE];
    this.drawTriangle(group, points, col, row);
  }

  drawRightTriangle(group, x, y, col, row) {
    const points = [x, y, x, y + TRIANGLE_SIZE, x - this.xOffset(), y + this.yOffset()];
    this.drawTriangle(group, points, col, row);
  }

  drawSlice(rotation, flip) {
    let group = new Konva.Group({
      x: 250,
      y: 250,
      rotation: rotation,
      scaleX: flip ? -1 : 1,
      //scaleY: flip ? -1 : 1,
    });
    for (let col = 0; col < this._size; col++) {
      const rows = this._size - col;
      for (let row = 0; row < rows; row++) {
        let x = col * this.xOffset();
        let y = row * TRIANGLE_SIZE + col * this.yOffset();
        this.drawLeftTriangle(group, x, y, col, row * 2);
        if (row !== (rows - 1)) {
          x += this.xOffset();
          y += this.yOffset();
          this.drawRightTriangle(group, x, y, col, row * 2 + 1);
        }
      }
    }
    this._layer.add(group);
    this._layer.draw();
  }

  draw() {
    for (let i = 0; i < 6; i++) {
      this.drawSlice(0 + 60 * (i - i % 2), i % 2);
    }
  }

  changeRandomTriangle() {
    const col = getRandomInt(0, this._size);
    const row = getRandomInt(0, (this._size - col) * 2 - 1);

    const fill = getRandomFill();

    const triangles = this._triangles[col][row];
    triangles.forEach(t => {
      t.setFill(fill);
      t.draw();
    });
  }

}

function draw() {
  const size = 10;
  let hex = new HexGrid(size, 'container');
  hex.draw();
  setInterval(() => {
    hex.changeRandomTriangle();
    //hex._stage.batchDraw();
  }, 10);
}
