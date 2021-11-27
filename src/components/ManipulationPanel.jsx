import { Direction } from "../App";

const ManipulationPanel = ({ onChange }) => {

    const onUp = () => onChange(Direction.up);
    const onRight = () => onChange(Direction.right);
    const onLeft = () => onChange(Direction.left);
    const onDown = () => onChange(Direction.down);

    return (
        <div className="manipulation-panel">
            <button onClick={onLeft}>←</button>
            <button onClick={onUp}>↑</button>
            <button onClick={onDown}>↓</button>
            <button onClick={onRight}>→</button>
        </div>
    );
};

export default ManipulationPanel;