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


export const initFields = (fieldSize, snake) => {
    const fields = [];
    for (let i = 0; i < fieldSize; i++) {
        const cols = new Array(fieldSize).fill('');
        fields.push(cols);

    }
    fields[snake.x][snake.y] = 'snake'

    // テスト(自分を食べる)
    // fields = fields.map((field, index_row) => field.map((item, index_col) => {
    //     if ((index_row >= 17 && index_row <= (17 + 15)) && index_col == 17) {
    //         return 'snake'
    //     } else {
    //         return item;
    //     }
    // }))

    const food = getFoodPosition(fieldSize, [snake]);
    fields[food.y][food.x] = 'food';

    return fields;
}