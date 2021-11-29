export const getFoodPosition = (fieldSize, excludes) => {
    while (true) {
        const x = Math.floor(Math.random() * (fieldSize - 1 - 1)) + 1;
        const y = Math.floor(Math.random() * (fieldSize - 1 - 1)) + 1;
        // 蛇の体の座標 配列と一致するとこには餌を置かない
        const conflict = excludes.some(item => item.x === x && item.y === y);

        if (!conflict) {
            return { x, y };
        }
    }
}

// フィールド配列の初期化
export const initFields = (fieldSize, snake) => {
    const fields = [];
    for (let i = 0; i < fieldSize; i++) {
        const cols = new Array(fieldSize).fill('');
        fields.push(cols);

    }
    fields[snake.x][snake.y] = 'snake';

    const food = getFoodPosition(fieldSize, [snake]);
    fields[food.y][food.x] = 'food';

    return fields;
}

// 衝突の判定 true:衝突
export const isCollision = (fieldSize, position) => {
    if (position.y < 0 || position.x < 0) {
        // x, y どちらかの座標がマイナスの時
        return true;
    }

    if (position.y > fieldSize - 1 || position.x > fieldSize - 1) {
        // x, y どちらかの座標がフィールドサイズを超えてしまっている時
        return true;
    }

    return false;
}

// 自分(蛇)を食べてしまう場合 true:食べてしまう
export const isEatingMyself = (fields, position) => {
    return fields[position.y][position.x] === 'snake';
}