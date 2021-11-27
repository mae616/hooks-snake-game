import { GameStatus } from "../App";

const Button = ({ status, onStart, onRestart }) => {
    return (
        <div className="button">
            {
                // status === 'gameover' ?
                status === GameStatus.gameover ?
                    <button onClick={onRestart}>gameover</button>
                    :
                    <button onClick={onStart}>start</button>
            }
        </div>
    );
};

export default Button;