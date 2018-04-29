import { Universe } from '../wasm/game_of_life';
import { memory } from '../wasm/game_of_life_bg';

const GRID_COLOUR = '#CCCCCC';
const DEAD_COLOUR = '#FFFFFF';
const ALIVE_COLOUR = '#000000';

// These must match `Cell::Alive` and `Cell::Dead`
const DEAD = 0;
const ALIVE = 1;

// Buttons
const playPauseButton = document.getElementById('play-pause');
const clearButton = document.getElementById('clear');
const randomButton = document.getElementById('random');

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

const fps = new class {
  constructor() {
    this.fps = document.getElementById('fps');
    this.frames = [];
    this.lastFrameTimeStamp = performance.now();
  }

  render() {
    // Convert the delta time since the last frame render into a measure
    // of frames per second
    const now = performance.now();
    const delta = now - this.lastFrameTimeStamp;
    this.lastFrameTimeStamp = now;
    const fps = 1 / delta * 1000;

    // Save only the latest 100 timings
    this.frames.push(fps);
    if (this.frames.length > 100) {
      this.frames.shift();
    }

    // Find the max, min, and mean of our 100 latest timings.
    let min = Infinity;
    let max = -Infinity;
    let sum = 0;
    for (let i = 0; i < this.frames.length; i += 1) {
      sum += this.frames[i];
      min = Math.min(this.frames[i], min);
      max = Math.max(this.frames[i], max);
    }
    let mean = sum / this.frames.length;

    // Render the stats
    this.fps.textContent = `fps: ${Math.round(mean)}`;
  }
}();

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

  const drawWithFill = (fillColour, state) => {
    ctx.fillStyle = fillColour;
    for (let row = 0; row < height; row += 1) {
      for (let col = 0; col < width; col += 1) {
        const idx = getIndex(row, col);

        if (cells[idx] !== state) {
          continue;
        }

        ctx.fillRect(
          col * (cellSize + 1) + 1,
          row * (cellSize + 1) + 1,
          cellSize,
          cellSize
        );
      }
    }
  };

  drawWithFill(ALIVE_COLOUR, ALIVE);
  drawWithFill(DEAD_COLOUR, DEAD);

  ctx.stroke();
};

let animationId = null;

const renderLoop = () => {
  fps.render();

  universe.tick();

  drawGrid();
  drawCells();

  animationId = requestAnimationFrame(renderLoop);
};

const isPaused = () => animationId === null;

const play = () => {
  playPauseButton.textContent = 'pause';
  renderLoop();
};

const pause = () => {
  playPauseButton.textContent = 'play';
  cancelAnimationFrame(animationId);
  animationId = null;
};

playPauseButton.addEventListener('click', () => {
  if (isPaused()) {
    play();
  } else {
    pause();
  }
});

clearButton.addEventListener('click', () => {
  universe.clear();

  drawCells();
  drawGrid();
});

randomButton.addEventListener('click', () => {
  universe.randomize();

  drawCells();
  drawGrid();
});

canvas.addEventListener('click', event => {
  const boundingRect = canvas.getBoundingClientRect();

  const scaleX = canvas.width / boundingRect.width;
  const scaleY = canvas.height / boundingRect.height;

  const canvasLeft = (event.clientX - boundingRect.left) * scaleX;
  const canvasTop = (event.clientY - boundingRect.top) * scaleY;

  const row = Math.min(Math.floor(canvasTop / (cellSize + 1)), height - 1);
  const col = Math.min(Math.floor(canvasLeft / (cellSize + 1)), width - 1);

  universe.toggle_cell(row, col);

  drawCells();
  drawGrid();
});

play();
