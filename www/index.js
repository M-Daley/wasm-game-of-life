import { Universe, Cell } from "wasm-game-of-life";
import { memory } from 'wasm-game-of-life/wasm_game_of_life_bg';

const canvas = document.getElementById("game-of-life-canvas");
const ctx = canvas.getContext("2d");
const CELL_SIZE = 5; // px
const UNIVERSE = Universe.new();
const UNIVERSE_WIDTH = UNIVERSE.width();
const UNIVERSE_HEIGHT = UNIVERSE.height();
const GRID_COLOR = "#CCC";
const DEAD_COLOR = "#FFF";
const ALIVE_COLOR = "#000";

canvas.height = (CELL_SIZE + 1) * UNIVERSE_HEIGHT + 1;
canvas.width = (CELL_SIZE + 1) * UNIVERSE_WIDTH + 1;

const renderLoop = () => {
    UNIVERSE.tick()

    drawGrid();
    drawCells();

    requestAnimationFrame(renderLoop);
};

const drawGrid = () => {
    ctx.beginPath();
    ctx.strokeStyle = GRID_COLOR;

    // Veritcal Lines
    for (let i = 0; i <= UNIVERSE_WIDTH; i++) {
        ctx.moveTo(i * (CELL_SIZE + 1) + 1, 0);
        ctx.lineTo(i * (CELL_SIZE + 1) + 1, (CELL_SIZE) * UNIVERSE_HEIGHT + 1);
    }

    // Horizontal Lines
    for (let j = 0; j <= UNIVERSE_HEIGHT; j++) {
        ctx.moveTo(0,                           j * (CELL_SIZE + 1) + 1, );
        ctx.lineTo((CELL_SIZE + 1) * UNIVERSE_WIDTH + 1, j * (CELL_SIZE + 1) + 1);
    }

    ctx.stroke();
};

const getIndex = (row, col) => {
    return row * UNIVERSE_WIDTH + col
};

const drawCells = () => {
    const cellsPtr = UNIVERSE.cells();
    const cells = new Uint8Array(memory.buffer, cellsPtr, UNIVERSE_WIDTH * UNIVERSE_HEIGHT);

    ctx.beginPath();

    for (let row = 0; row < UNIVERSE_HEIGHT; row++) {
        for (let col = 0; col < UNIVERSE_WIDTH; col++) {
            const idx = getIndex(row, col);

            ctx.fillStyle = cells[idx] === Cell.Dead
                ? DEAD_COLOR
                : ALIVE_COLOR;

            ctx.fillRect(
                col * (CELL_SIZE + 1) + 1,
                row * (CELL_SIZE + 1) + 1,
                CELL_SIZE,
                CELL_SIZE
            );
        }
    }

    ctx.stroke();
};

drawGrid();
drawCells();
requestAnimationFrame(renderLoop);