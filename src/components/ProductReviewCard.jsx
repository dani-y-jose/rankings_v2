import StarRating from './StarRating';

export default function ProductReviewCard({ review, onDelete, canDelete }) {
    const date = review.created_at
        ? new Date(review.created_at).toLocaleDateString('es-BO', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
        })
        : '';

    return (
        <div className="review-card">
            <div className="review-header">
                <div>
                    <div className="review-product-name">{review.product_name}</div>
                    <div className="review-date">{date}</div>
                </div>
                <div className="review-overall">
                    <span>★</span>
                    <span>{review.overall_rating?.toFixed(1) || '–'}</span>
                </div>
            </div>

            <div className="review-ratings">
                <div className="review-rating-item">
                    <span className="rating-label">Calidad</span>
                    <StarRating value={review.quality_rating} readonly size={14} />
                    <span className="rating-value">{review.quality_rating}</span>
                </div>
                <div className="review-rating-item">
                    <span className="rating-label">Precio</span>
                    <StarRating value={review.price_rating} readonly size={14} />
                    <span className="rating-value">{review.price_rating}</span>
                </div>
                <div className="review-rating-item">
                    <span className="rating-label">Servicio</span>
                    <StarRating value={review.service_rating} readonly size={14} />
                    <span className="rating-value">{review.service_rating}</span>
                </div>
            </div>

            {review.comments && (
                <div className="review-comments">{review.comments}</div>
            )}

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div className="review-user">
                    Reseña por {review.user_email || 'Anónimo'}
                </div>
                {canDelete && (
                    <div className="review-actions">
                        <button
                            className="btn-icon"
                            onClick={() => onDelete(review.id)}
                            title="Eliminar reseña"
                        >
                            🗑️ Eliminar
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
