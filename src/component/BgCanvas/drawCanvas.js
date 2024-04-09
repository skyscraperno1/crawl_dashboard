export function drawCanvas(cvs) {
  const ctx = cvs.getContext("2d");
  function init() {
    cvs.width = window.innerWidth * devicePixelRatio;
    cvs.height = window.innerHeight * devicePixelRatio;
  }
  init();

  function getRandom(min, max) {
    return Math.floor(Math.random() * (max + 1 - min) + min);
  }
  class Point {
    constructor() {
      this.r = 2;
      this.x = getRandom(0, cvs.width - this.r / 2);
      this.y = getRandom(0, cvs.height - this.r / 2);
    }

    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.r, 0, 2 * Math.PI);
      ctx.fillStyle = "#e08e50";
      ctx.fill();
    }
  }

  class Graph {
    constructor(pointNumber = 30, maxDis = 300) {
      this.points = new Array(pointNumber).fill(0).map(() => new Point());
      this.maxDis = maxDis;
    }

    draw() {
      for (let i = 0; i < this.points.length; i++) {
        const p1 = this.points[i];
        p1.draw();
        for (let j = i + 1; j < this.points.length; j++) {
          const p2 = this.points[j];
          const d = Math.sqrt((p1.x - p2.x) ** 2 + (p1.y - p2.y) ** 2);
          if (d > this.maxDis) {
            continue;
          }
          ctx.beginPath();
          ctx.moveTo(p1.x, p1.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.strokeStyle = `rgba(239, 181, 133, ${1 - d / this.maxDis})`;
          ctx.stroke();
        }
      }
    }
  }
  const g = new Graph();
  g.draw();
}
