export default function StarRating({ value = 0, onChange, size = 28, readonly = false }) {
    const stars = [1, 2, 3, 4, 5];

    if (readonly) {
        return (
            <span className="stars-display">
                {stars.map((n) => (
                    <span
                        key={n}
                        className={`star ${n <= Math.round(value) ? 'filled' : ''}`}
                        style={{ fontSize: size + 'px' }}
                    >
                        ★
                    </span>
                ))}
            </span>
        );
    }

    const handleClick = (n) => {
        if (onChange) onChange(n);
    };

    return (
        <div className="star-input-row">
            <div className="star-input-stars">
                {stars.map((n) => (
                    <button
                        key={n}
                        type="button"
                        className={`star-btn ${n <= value ? 'active' : ''}`}
                        onClick={() => handleClick(n)}
                        style={{ fontSize: size + 'px' }}
                        aria-label={`${n} estrella${n > 1 ? 's' : ''}`}
                    >
                        ★
                    </button>
                ))}
            </div>
            <input
                type="number"
                className="star-input-value"
                min="0"
                max="5"
                step="0.5"
                value={value}
                onChange={(e) => {
                    const v = parseFloat(e.target.value);
                    if (!isNaN(v) && v >= 0 && v <= 5) onChange(v);
                }}
                aria-label="Valor de estrellas"
            />
        </div>
    );
}
