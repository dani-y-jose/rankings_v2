import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import ProductReviewCard from './ProductReviewCard';
import ProductReviewForm from './ProductReviewForm';
import StarRating from './StarRating';

export default function PlaceDetail({ session, placeId, onBack }) {
    const [place, setPlace] = useState(null);
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);

    const fetchData = useCallback(async () => {
        setLoading(true);

        const [placeRes, reviewsRes] = await Promise.all([
            supabase.from('places').select('*').eq('id', placeId).single(),
            supabase
                .from('product_reviews')
                .select('*')
                .eq('place_id', placeId)
                .order('created_at', { ascending: false }),
        ]);

        if (placeRes.data) setPlace(placeRes.data);
        if (reviewsRes.data) {
            // Enrich reviews with user email via user_id lookup
            const userIds = [...new Set(reviewsRes.data.map((r) => r.user_id))];
            // We can't query auth.users directly from client, so we use the session info
            const enriched = reviewsRes.data.map((r) => ({
                ...r,
                user_email: r.user_id === session.user.id
                    ? session.user.email
                    : 'Otro usuario',
            }));
            setReviews(enriched);
        }

        setLoading(false);
    }, [placeId, session]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const handleReviewCreated = () => {
        fetchData();
    };

    const handleDeleteReview = async (reviewId) => {
        if (!confirm('¿Eliminar esta reseña?')) return;

        const { error } = await supabase
            .from('product_reviews')
            .delete()
            .eq('id', reviewId);

        if (error) {
            alert('Error: ' + error.message);
            return;
        }

        setReviews((prev) => prev.filter((r) => r.id !== reviewId));
    };

    const handleDeletePlace = async () => {
        if (!confirm('¿Eliminar este lugar y todas sus reseñas?')) return;

        const { error } = await supabase
            .from('places')
            .delete()
            .eq('id', placeId);

        if (error) {
            alert('Error: ' + error.message);
            return;
        }

        onBack();
    };

    if (loading) {
        return (
            <div className="loading">
                <div className="spinner" />
            </div>
        );
    }

    if (!place) {
        return (
            <div className="empty-state">
                <h3>Lugar no encontrado</h3>
                <button className="btn btn-secondary" onClick={onBack}>← Volver</button>
            </div>
        );
    }

    const avgRating = reviews.length > 0
        ? reviews.reduce((sum, r) => sum + (r.overall_rating || 0), 0) / reviews.length
        : 0;

    const avgQuality = reviews.length > 0
        ? reviews.reduce((sum, r) => sum + r.quality_rating, 0) / reviews.length
        : 0;

    const avgPrice = reviews.length > 0
        ? reviews.reduce((sum, r) => sum + r.price_rating, 0) / reviews.length
        : 0;

    const avgService = reviews.length > 0
        ? reviews.reduce((sum, r) => sum + r.service_rating, 0) / reviews.length
        : 0;

    const isOwner = place.user_id === session.user.id;

    return (
        <>
            <button className="back-button" onClick={onBack}>
                ← Volver a mis lugares
            </button>

            <div className="place-detail-header">
                <h2>{place.name}</h2>
                {place.address && (
                    <div className="detail-address">📍 {place.address}</div>
                )}
                {place.description && (
                    <div className="detail-description">{place.description}</div>
                )}

                {reviews.length > 0 && (
                    <div className="place-detail-stats">
                        <div className="stat-pill">
                            <span className="stat-label">Overall</span>
                            <StarRating value={avgRating} readonly size={14} />
                            <span className="stat-value">{avgRating.toFixed(1)}</span>
                        </div>
                        <div className="stat-pill">
                            <span className="stat-label">Calidad</span>
                            <span className="stat-value">{avgQuality.toFixed(1)}</span>
                        </div>
                        <div className="stat-pill">
                            <span className="stat-label">Precio</span>
                            <span className="stat-value">{avgPrice.toFixed(1)}</span>
                        </div>
                        <div className="stat-pill">
                            <span className="stat-label">Servicio</span>
                            <span className="stat-value">{avgService.toFixed(1)}</span>
                        </div>
                    </div>
                )}
            </div>

            <div className="reviews-section-header">
                <h3>
                    Reseñas ({reviews.length})
                </h3>
                <div style={{ display: 'flex', gap: '8px' }}>
                    <button className="btn btn-primary" onClick={() => setShowForm(true)}>
                        + Reseña
                    </button>
                    {isOwner && (
                        <button className="btn btn-danger" onClick={handleDeletePlace}>
                            Eliminar lugar
                        </button>
                    )}
                </div>
            </div>

            {reviews.length === 0 ? (
                <div className="empty-state">
                    <span className="empty-icon">✍️</span>
                    <h3>Sin reseñas todavía</h3>
                    <p>Agrega la primera reseña para este lugar.</p>
                    <button className="btn btn-primary" onClick={() => setShowForm(true)}>
                        + Agregar reseña
                    </button>
                </div>
            ) : (
                <div className="reviews-list">
                    {reviews.map((review) => (
                        <ProductReviewCard
                            key={review.id}
                            review={review}
                            canDelete={review.user_id === session.user.id}
                            onDelete={handleDeleteReview}
                        />
                    ))}
                </div>
            )}

            {showForm && (
                <ProductReviewForm
                    session={session}
                    placeId={placeId}
                    onClose={() => setShowForm(false)}
                    onCreated={handleReviewCreated}
                />
            )}
        </>
    );
}
