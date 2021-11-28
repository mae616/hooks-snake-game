import { GameStatus } from "../App";

const Button = ({ status, onStart, onStop, onRestart }) => {
    return (
        <div className="button">
            {status === GameStatus.gameover && <button onClick={onRestart}>gameover</button>}
            {status === GameStatus.init && <button onClick={onStart}>start</button>}
            {status === GameStatus.suspended && <button onClick={onStart}>start</button>}
            {status === GameStatus.playing && <button onClick={onStop}>stop</button>}
        </div>
    );
};

export default Button;