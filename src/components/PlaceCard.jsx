import StarRating from './StarRating';

export default function PlaceCard({ place, onClick }) {
    const avgRating = place.avg_rating;
    const reviewCount = place.review_count || 0;

    return (
        <div className="card card-clickable" onClick={onClick}>
            <div className="place-card">
                <div className="place-header">
                    <div>
                        <div className="place-name">{place.name}</div>
                        {place.address && (
                            <div className="place-address">📍 {place.address}</div>
                        )}
                    </div>
                    {avgRating > 0 && (
                        <div className="rating-badge">
                            <StarRating value={avgRating} readonly size={14} />
                            <span>{avgRating.toFixed(1)}</span>
                        </div>
                    )}
                </div>

                {place.description && (
                    <div className="place-description">{place.description}</div>
                )}

                <div className="place-meta">
                    <span>
                        {reviewCount} {reviewCount === 1 ? 'reseña' : 'reseñas'}
                    </span>
                    {place.created_at && (
                        <span>Agregado {new Date(place.created_at).toLocaleDateString('es-BO')}</span>
                    )}
                </div>
            </div>
        </div>
    );
}
