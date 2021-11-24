const Field = ({ fields }) => {
    return (
        <div className="field">
            {
                // new Array(35 * 35).fill('').map(() => <div className="dots"></div>)
                fields.map((row) => {
                    return row.map((column) => {
                        return <div className={`dots ${column}`}></div>
                    })
                })
            }
        </div>
    );
};

export default Field;