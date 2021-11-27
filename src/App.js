import { useEffect, useState } from 'react';
import Navigation from './components/Navigation';
import Field from './components/Field';
import Button from './components/Button';
import ManipulationPanel from './components/ManipulationPanel';
import { initFields } from './utils'

const initialPosition = { x: 17, y: 17 };
const initialValues = initFields(35, initialPosition);
const defaultInterval = 100;

// ゲームの状態
const GameStatus = Object.freeze({
  init: 'init',
  playing: 'playing',
  suspended: 'suspended',
  gameover: 'gameover'
});

// 蛇の進行方向
const Direction = Object.freeze({
  up: 'up',
  right: 'right',
  left: 'left',
  down: 'down'
});

// 反対方向
const OppositeDirection = Object.freeze({
  up: Direction.down,
  right: Direction.left,
  left: Direction.right,
  down: Direction.up
});

// 移動方向における座標の変化量
const Delta = Object.freeze({
  up: { x: 0, y: -1 },
  right: { x: 1, y: 0 },
  left: { x: -1, y: 0 },
  down: { x: 0, y: 1 }
});

// let timer = undefined;
let timer = null;

const unsubscribe = () => {
  if (!timer) {
    return
  }
  clearInterval(timer);
}

// 衝突の判定 true:衝突
const isCollision = (fieldSize, position) => {
  if (position.y < 0 || position.x < 0) {
    return true;
  }

  if (position.y > fieldSize - 1 || position.x > fieldSize - 1) {
    return true;
  }

  return false;
}


function App() {
  const [fields, setFields] = useState(initialValues);
  const [position, setPosition] = useState(initialPosition);
  const [status, setStatus] = useState(GameStatus.init);
  const [tick, setTick] = useState(0);
  const [direction, setDirection] = useState(Direction.up);

  useEffect(() => {
    // setPosition(initialPosition);
    timer = setInterval(() => {
      // if (!position) { // useEffectの場合の考慮
      //   return;
      // }
      // console.log(position)
      setTick(tick => tick + 1);
    }, defaultInterval);

    // useEffectのリターンにするとコンポーネントが削除されるタイミングで実行される
    return unsubscribe;
  }, []);

  useEffect(() => {
    // if (!position || status !== GameStatus.playing) {
    if (status !== GameStatus.playing) {
      return;
    }

    const canContinue = handleMoving();
    if (!canContinue) {
      unsubscribe();
      setStatus(GameStatus.gameover);
    }
  }, [tick]);

  const onStart = () => setStatus(GameStatus.playing);

  const onRestart = () => {
    timer = setInterval(() => {
      setTick(tick => tick + 1)
    }, defaultInterval);
    setDirection(Direction.up);
    setStatus(GameStatus.init);
    setPosition(initialPosition);
    setFields(initFields(35, initialPosition));
  }

  // 進行方向の変更
  const onChangeDirection = (newDirection) => {
    // ゲームプレイだけ歩行が変えられる
    if (status !== GameStatus.playing) {
      return direction;
    }
    // 許容しない移動か（進行方向と真逆の移動とか）
    if (OppositeDirection[direction] === newDirection) {
      return;
    }
    setDirection(newDirection)
  }

  // 蛇を動かし、描画する
  const handleMoving = () => {
    const { x, y } = position;
    const delta = Delta[direction];
    const newPosition = {
      x: x + delta.x,
      y: y + delta.y
    };

    // 衝突判定
    if (isCollision(fields.length, newPosition)) {
      return false;
    }

    // フィールド配列の再設定
    const nextFields = fields.map(field => [...field]);
    nextFields[y][x] = '';
    nextFields[newPosition.y][newPosition.x] = 'snake';

    // stateの更新と再レンダリング
    setPosition(newPosition);
    // setFields(fields);
    setFields(nextFields);
    return true;
  }

  return (
    <div className="App">
      <header className="header">
        <div className="title-container">
          <h1 className="title">Snake Game</h1>
        </div>
        <Navigation />
      </header>
      <main className="main">
        <Field fields={fields} />
      </main>
      <footer className="footer">
        <Button status={status} GameStatus={GameStatus} onStart={onStart} onRestart={onRestart} />
        <ManipulationPanel onChange={onChangeDirection} />
      </footer>
    </div>
  );
}

export default App;
export {
  GameStatus,
  Direction
};
