const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');

const cw = 600;
const ch = 500;

canvas.width = cw;
canvas.height = ch;

const color = '#cccccc';
const dotColor = '#888888';
const lineWidth = 2;
let isDrawing = false;
let lastX = 0;
let lastY = 0;
let currentPoints = [];
let best = 0;

clearCanvas();

function drawPoint(x, y) {
  ctx.beginPath();
  ctx.arc(x, y, lineWidth, 0, 2 * Math.PI);
  ctx.fillStyle = color;
  ctx.fill();
}

function drawLine(startX, startY, endX, endY) {
  ctx.beginPath();
  ctx.moveTo(startX, startY);
  ctx.lineTo(endX, endY);
  ctx.strokeStyle = color;
  ctx.lineWidth = lineWidth * 2;
  ctx.stroke();
}

function clearCanvas() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.beginPath();
  ctx.arc(cw / 2, ch / 2, lineWidth, 0, 2 * Math.PI);
  ctx.fillStyle = dotColor;
  ctx.fill();
}

function accuracy(points) {
  points = points.map(point => {
    let x = point.x - cw / 2;
    let y = point.y - ch / 2;
    
    let dist = Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2))

    return dist;
  })

  let totalDistance = 0;
  for (let i = 0; i < points.length; i++) {
    totalDistance += points[i];
  }

  const radius = totalDistance / points.length

  let totalDiff = 0;
  for (let i = 0; i < points.length; i++) {
    totalDiff += Math.abs(radius - points[i]);
  }

  const diff = totalDiff / points.length;
  const acc = 100 - (diff / radius) * 200;

  $('#accuracy').text(acc.toFixed(2));

  if (acc > best) {
    best = acc;
    $('#best').text(best.toFixed(2));
  }
}

$(canvas).on('mousedown', function(e) {
  clearCanvas();
  isDrawing = true;
  const rect = canvas.getBoundingClientRect();
  lastX = e.clientX - rect.left;
  lastY = e.clientY - rect.top;
  drawPoint(lastX, lastY);
  currentPoints = [];
  currentPoints.push({ x: lastX, y: lastY });
});

$(canvas).on('mouseup', function() {
  isDrawing = false;
  accuracy(currentPoints);
});

$(canvas).on('mousemove', function(e) {
  if (isDrawing) {
    const rect = canvas.getBoundingClientRect();
    let scaleX = canvas.width / rect.width;
    let scaleY = canvas.height / rect.height;
    let currentX = (e.clientX - rect.left) * scaleX;
    let currentY = (e.clientY - rect.top) * scaleY;
    drawPoint(currentX, currentY);
    drawLine(lastX, lastY, currentX, currentY);
    lastX = currentX;
    lastY = currentY;
    currentPoints.push({ x: currentX, y: currentY });
  }
});

$(document).on('keydown', function(e) {
  if (e.key === 'r') {
    clearCanvas();
  }
});
