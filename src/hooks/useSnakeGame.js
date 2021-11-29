import { useCallback, useEffect, useState } from 'react';
import {
    defaultInterval,
    defaultDifficulty,
    Delta,
    Difficulty,
    Direction,
    DirectionKeyCodeMap,
    GameStatus,
    OppositeDirection,
    initialPosition,
    initialValues
} from '../constants';
import {
    initFields,
    isCollision,
    isEatingMyself,
    getFoodPosition
} from '../utils'

// let timer = undefined;
let timer = null;

const unsubscribe = () => {
    if (!timer) {
        return
    }
    clearInterval(timer);
};

const useSnakeGame = () => {

    const [fields, setFields] = useState(initialValues);
    const [body, setBody] = useState([initialPosition]);
    const [status, setStatus] = useState(GameStatus.init);
    const [direction, setDirection] = useState(Direction.up);
    const [difficulty, setDifficulty] = useState(defaultDifficulty);
    const [tick, setTick] = useState(0);

    useEffect(() => {
        // ゲームの中の時間を管理する
        const interval = Difficulty[difficulty - 1];
        if (status === GameStatus.playing) {
            timer = setInterval(() => {
                setTick(tick => tick + 1);
            }, interval);
        }
        // useEffectのリターンにするとコンポーネントが削除されるタイミングで実行される
        return unsubscribe;
    }, [difficulty, status]);

    useEffect(() => {
        if (status !== GameStatus.playing) {
            return;
        }

        const canContinue = handleMoving();
        if (!canContinue) {
            unsubscribe();
            setStatus(GameStatus.gameover);
        }
    }, [tick]);

    const start = () => setStatus(GameStatus.playing);

    const stop = () => setStatus(GameStatus.suspended);

    const reload = () => {
        timer = setInterval(() => {
            setTick(tick => tick + 1)
        }, defaultInterval);
        setStatus(GameStatus.init);
        setBody([initialPosition]);
        setDirection(Direction.up);
        setFields(initFields(fields.length, initialPosition));
    }

    // 進行方向の変更
    const updateDirection = useCallback(
        (newDirection) => {
            // ゲームプレイだけ歩行が変えられる
            if (status !== GameStatus.playing) {
                return direction;
            }
            // 許容しない移動か（進行方向と真逆の移動とか）
            if (OppositeDirection[direction] === newDirection) {
                return;
            }
            setDirection(newDirection)
        }, [direction, status]);

    // 難易度の変更
    const updateDifficulty = useCallback((difficult) => {

        // 初期状態（ゲームを始める前）以外では変更できない 
        if (status !== GameStatus.init) {
            return;
        }
        if (difficult < 1 || difficult > Difficulty.length) {
            return;
        }
        setDifficulty(difficult);
    }, [status]);

    useEffect(() => {
        const handleKeyDown = (e) => {
            const newDirection = DirectionKeyCodeMap[e.keyCode];
            if (!newDirection) {
                return;
            }
            updateDirection(newDirection);
        }
        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [updateDirection]);

    // 蛇を動かし、描画する
    const handleMoving = () => {
        const { x, y } = body[0];
        const delta = Delta[direction];
        const newPosition = {
            x: x + delta.x,
            y: y + delta.y
        };

        // 衝突判定と、自分(蛇)を食べる判定
        if (isCollision(fields.length, newPosition)
            || isEatingMyself(fields, newPosition)) {
            return false;
        }

        // フィールド配列の再設定
        const nextFields = fields.map(field => [...field]);

        const newBody = [...body];

        if (fields[newPosition.y][newPosition.x] !== 'food') {
            // 移動する、次のフィールドが餌でない場合
            const removingTrack = newBody.pop(); // 最後の要素を取り出し削除
            nextFields[removingTrack.y][removingTrack.x] = '';
        } else {
            // 餌の場合
            const food = getFoodPosition(fields.length, [...newBody, newPosition]);
            nextFields[food.y][food.x] = 'food';
        }
        nextFields[newPosition.y][newPosition.x] = 'snake';
        newBody.unshift(newPosition); // 先頭に要素を追加する

        // stateの更新と再レンダリング
        setBody(newBody);
        // setFields(fields);
        setFields(nextFields);
        return true;
    };

    return {
        body,
        difficulty,
        fields,
        status,
        start,
        stop,
        reload,
        updateDirection,
        updateDifficulty
    };
};

export default useSnakeGame;