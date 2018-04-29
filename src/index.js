import { Universe } from '../game_of_life';
import { memory } from '../game_of_life_bg';

const GRID_COLOUR = '#CCCCCC';
const DEAD_COLOUR = '#FFFFFF';
const ALIVE_COLOUR = '#000000';

// These must match `Cell::Alive` and `Cell::Dead`
const DEAD = 0;
const ALIVE = 1;

// Construct the universe, and get its width and height.
const canvas = document.getElementById('game-of-life-canvas');
const container = document.getElementsByClassName('canvas-container')[0];

const universe = Universe.new();
const width = universe.width();
const height = universe.height();
console.log(`width ${width} height ${height}`);

let cellSize = 5;
const calcCellSize = () => {
  const minSize = Math.min(container.clientWidth, container.clientHeight);
  const minDim = Math.min(width, height);
  cellSize = Math.floor(minSize / minDim) - 1;

  // Give the canvas room for all our cells and a 1px border
  canvas.height = (cellSize + 1) * height + 1;
  canvas.width = (cellSize + 1) * width + 1;

  console.log(`cell size ${cellSize}`);
};
calcCellSize();
window.addEventListener('resize', calcCellSize);

const ctx = canvas.getContext('2d');

const drawGrid = () => {
  ctx.beginPath();
  ctx.lineWidth = 1 / window.devicePixelRatio;
  ctx.strokeStyle = GRID_COLOUR;

  // Vertical lines.
  for (let i = 0; i <= width; i += 1) {
    ctx.moveTo(i * (cellSize + 1) + 1, 0);
    ctx.lineTo(i * (cellSize + 1) + 1, (cellSize + 1) * height + 1);
  }

  // Horizontal lines.
  for (let j = 0; j <= height; j += 1) {
    ctx.moveTo(0, j * (cellSize + 1) + 1);
    ctx.lineTo((cellSize + 1) * width + 1, j * (cellSize + 1) + 1);
  }

  ctx.stroke();
};

const getIndex = (row, column) => row * width + column;

const drawCells = () => {
  const cellsPtr = universe.cells();
  const cells = new Uint8Array(memory.buffer, cellsPtr, width * height);

  ctx.beginPath();

  for (let row = 0; row < height; row += 1) {
    for (let col = 0; col < width; col += 1) {
      const idx = getIndex(row, col);

      ctx.fillStyle = cells[idx] === DEAD ? DEAD_COLOUR : ALIVE_COLOUR;

      ctx.fillRect(
        col * (cellSize + 1) + 1,
        row * (cellSize + 1) + 1,
        cellSize,
        cellSize
      );
    }
  }

  ctx.stroke();
};

const renderLoop = () => {
  universe.tick();

  drawGrid();
  drawCells();

  requestAnimationFrame(renderLoop);
};

requestAnimationFrame(renderLoop);
