import { initFields } from '../utils'

const fieldSize = 35;
export const initialPosition = { x: 17, y: 17 };
export const initialValues = initFields(fieldSize, initialPosition);
export const defaultInterval = 100;
export const defaultDifficulty = 3;

export const Difficulty = [1000, 500, 100, 50, 10];

// ゲームの状態
export const GameStatus = Object.freeze({
    init: 'init',
    playing: 'playing',
    suspended: 'suspended', // 一時停止
    gameover: 'gameover'
});

// 蛇の進行方向
export const Direction = Object.freeze({
    up: 'up',
    right: 'right',
    left: 'left',
    down: 'down'
});

// キーコードと進行方向のマッピング
export const DirectionKeyCodeMap = Object.freeze({
    37: Direction.left,
    38: Direction.up,
    39: Direction.right,
    40: Direction.down
});

// 反対方向
export const OppositeDirection = Object.freeze({
    up: Direction.down,
    right: Direction.left,
    left: Direction.right,
    down: Direction.up
});

// 移動方向における座標の変化量
export const Delta = Object.freeze({
    up: { x: 0, y: -1 },
    right: { x: 1, y: 0 },
    left: { x: -1, y: 0 },
    down: { x: 0, y: 1 }
});