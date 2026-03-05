import { useState } from 'react';
import { supabase } from '../lib/supabase';
import StarRating from './StarRating';

export default function ProductReviewForm({ session, placeId, onClose, onCreated }) {
    const [productName, setProductName] = useState('');
    const [qualityRating, setQualityRating] = useState(0);
    const [priceRating, setPriceRating] = useState(0);
    const [serviceRating, setServiceRating] = useState(0);
    const [comments, setComments] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState(null);

    const overallPreview = qualityRating || priceRating || serviceRating
        ? ((qualityRating + priceRating + serviceRating) / 3).toFixed(1)
        : '–';

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!productName.trim()) {
            setMessage({ type: 'err', text: 'El nombre del producto es obligatorio.' });
            return;
        }
        if (qualityRating === 0 || priceRating === 0 || serviceRating === 0) {
            setMessage({ type: 'err', text: 'Asigna una calificación a las 3 categorías.' });
            return;
        }

        setLoading(true);
        setMessage(null);

        const { data, error } = await supabase
            .from('product_reviews')
            .insert({
                place_id: placeId,
                product_name: productName.trim(),
                quality_rating: qualityRating,
                price_rating: priceRating,
                service_rating: serviceRating,
                comments: comments.trim() || null,
                user_id: session.user.id,
            })
            .select()
            .single();

        if (error) {
            setMessage({ type: 'err', text: error.message });
            setLoading(false);
            return;
        }

        setMessage({ type: 'ok', text: '¡Reseña agregada!' });
        setTimeout(() => {
            onCreated(data);
            onClose();
        }, 600);
        setLoading(false);
    };

    return (
        <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
            <div className="modal">
                <div className="modal-header">
                    <h3>✍️ Nueva reseña</h3>
                    <button className="modal-close" onClick={onClose}>×</button>
                </div>
                <div className="modal-body">
                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label className="form-label" htmlFor="product-name">Producto *</label>
                            <input
                                id="product-name"
                                className="form-input"
                                type="text"
                                placeholder="Ej: Picante de pollo, Café latte..."
                                value={productName}
                                onChange={(e) => setProductName(e.target.value)}
                                autoFocus
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-label">Calificaciones</label>
                            <div className="ratings-grid">
                                <div className="star-input-wrap">
                                    <span className="star-input-label">🏆 Calidad</span>
                                    <StarRating value={qualityRating} onChange={setQualityRating} />
                                </div>
                                <div className="star-input-wrap">
                                    <span className="star-input-label">💰 Precio</span>
                                    <StarRating value={priceRating} onChange={setPriceRating} />
                                </div>
                                <div className="star-input-wrap">
                                    <span className="star-input-label">🤝 Servicio</span>
                                    <StarRating value={serviceRating} onChange={setServiceRating} />
                                </div>
                            </div>
                        </div>

                        <div style={{
                            textAlign: 'center',
                            padding: '12px',
                            background: 'var(--surface2)',
                            borderRadius: 'var(--radius-sm)',
                            marginBottom: '18px',
                            fontSize: '0.9rem',
                            color: 'var(--muted)',
                        }}>
                            Promedio general: <strong style={{ color: 'var(--accent)', fontSize: '1.1rem' }}>
                                {overallPreview}
                            </strong>
                        </div>

                        <div className="form-group">
                            <label className="form-label" htmlFor="review-comments">Comentarios</label>
                            <textarea
                                id="review-comments"
                                className="form-textarea"
                                placeholder="¿Qué te pareció? ¿Lo recomendarías?"
                                value={comments}
                                onChange={(e) => setComments(e.target.value)}
                                rows={3}
                            />
                        </div>

                        <button
                            type="submit"
                            className="btn btn-primary btn-full btn-lg"
                            disabled={loading}
                        >
                            {loading ? 'Guardando...' : 'Enviar reseña'}
                        </button>

                        {message && (
                            <div className={`msg ${message.type === 'ok' ? 'msg-ok' : 'msg-err'}`}>
                                {message.text}
                            </div>
                        )}
                    </form>
                </div>
            </div>
        </div>
    );
}
