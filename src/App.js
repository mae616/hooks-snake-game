import { useCallback, useEffect, useState } from 'react';
import Navigation from './components/Navigation';
import Field from './components/Field';
import Button from './components/Button';
import ManipulationPanel from './components/ManipulationPanel';
import {
  defaultInterval,
  defaultDifficulty,
  Delta,
  Difficulty,
  Direction,
  DirectionKeyCodeMap,
  fieldSize,
  GameStatus,
  OppositeDirection,
  initialPosition,
  initialValues
} from './constants';
import { initFields, getFoodPosition } from './utils'

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

// 自分(蛇)を食べてしまう場合 true:食べてしまう
const isEatingMyself = (fields, position) => {
  return fields[position.y][position.x] === 'snake';
}


function App() {
  const [fields, setFields] = useState(initialValues);
  const [body, setBody] = useState([initialPosition]);
  // // 自分を食べるテスト
  // const [body, setBody] = useState(
  //   new Array(15).fill('').map((_item, index) => ({ x: 17, y: 17 + index }))
  // );
  const [status, setStatus] = useState(GameStatus.init);
  const [direction, setDirection] = useState(Direction.up);
  const [difficulty, setDifficulty] = useState(defaultDifficulty);
  const [tick, setTick] = useState(0);

  useEffect(() => {
    // setPosition(initialPosition);

    // ゲームの中の時間を管理する
    const interval = Difficulty[difficulty - 1];
    timer = setInterval(() => {
      // if (!position) { // useEffectの場合の考慮
      //   return;
      // }
      // console.log(position)
      setTick(tick => tick + 1);
    }, interval);

    // useEffectのリターンにするとコンポーネントが削除されるタイミングで実行される
    return unsubscribe;
  }, [difficulty]);

  useEffect(() => {
    // if (!body.length === 0 || status !== GameStatus.playing) {
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

  const onStop = () => setStatus(GameStatus.suspended);

  const onRestart = () => {
    timer = setInterval(() => {
      setTick(tick => tick + 1)
    }, defaultInterval);
    setDirection(Direction.up);
    setStatus(GameStatus.init);
    setBody([initialPosition]);
    setFields(initFields(fieldSize, initialPosition));
  }

  // 進行方向の変更
  const onChangeDirection = useCallback((newDirection) => {
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
  const onChangeDifficulty = useCallback((difficulty) => {

    // 初期状態（ゲームを始める前）以外では変更できない 
    if (status !== GameStatus.init) {
      return;
    }
    if (difficulty < 1 || difficulty > Difficulty.length) {
      return;
    }
    setDifficulty(difficulty);
  }, [status, difficulty]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      const newDirection = DirectionKeyCodeMap[e.keyCode];
      if (!newDirection) {
        return;
      }
      onChangeDirection(newDirection);
    }
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [onChangeDirection]);

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
  }

  return (
    <div className="App">
      <header className="header">
        <div className="title-container">
          <h1 className="title">Snake Game</h1>
        </div>
        <Navigation
          length={body.length}
          difficulty={difficulty}
          onChangeDifficulty={onChangeDifficulty}
        />
      </header>
      <main className="main">
        <Field fields={fields} />
      </main>
      <footer className="footer">
        <Button
          status={status}
          onStop={onStop}
          onStart={onStart}
          onRestart={onRestart}
        />
        <ManipulationPanel onChange={onChangeDirection} />
      </footer>
    </div>
  );
}

export default App;
