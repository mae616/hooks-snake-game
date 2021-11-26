import { useEffect, useState } from 'react';
import Navigation from './components/Navigation';
import Field from './components/Field';
import Button from './components/Button';
import ManipulationPanel from './components/ManipulationPanel';
import { initFields } from './utils'

const initialPosition = { x: 17, y: 17 };
const initialValues = initFields(35, initialPosition);
const defaultInterval = 100;

// let timer = undefined;
let timer = null;

const unsubscribe = () => {
  if (!timer) {
    return
  }
  clearInterval(timer);
}

function App() {
  const [fields, setFields] = useState(initialValues);
  const [position, setPosition] = useState(initialPosition);
  const [tick, setTick] = useState(0);

  useEffect(() => {
    // setPosition(initialPosition);
    timer = setInterval(() => {
      // if (!position) { // useEffectの場合の考慮
      //   return;
      // }
      // console.log(position)
      // goUp();
      setTick(tick => tick + 1);
    }, defaultInterval);

    // useEffectのリターンにするとコンポーネントが削除されるタイミングで実行される
    return unsubscribe;
  }, []);

  useEffect(() => {
    if (!position) {
      return;
    }
    goUp();
  }, [tick]);

  const goUp = () => {
    const { x, y } = position;
    const nextY = Math.max(y - 1, 0);
    const nextFields = fields.map(field => [...field]);
    nextFields[y][x] = '';
    nextFields[nextY][x] = 'snake';
    setPosition({ x, y: nextY });
    // setFields(fields);
    setFields(nextFields);

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
        <Button />
        <ManipulationPanel />
      </footer>
    </div>
  );
}

export default App;
