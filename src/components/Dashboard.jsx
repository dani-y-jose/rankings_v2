import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import PlaceCard from './PlaceCard';
import PlaceForm from './PlaceForm';

export default function Dashboard({ session, onOpenPlace }) {
    const [places, setPlaces] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [sortBy, setSortBy] = useState('recent');

    const fetchPlaces = useCallback(async () => {
        setLoading(true);

        // Fetch all places
        const { data: placesData, error: placesErr } = await supabase
            .from('places')
            .select('*')
            .order('created_at', { ascending: false });

        if (placesErr) {
            console.error('Error fetching places:', placesErr);
            setLoading(false);
            return;
        }

        // Fetch review stats for each place
        const { data: reviewsData } = await supabase
            .from('product_reviews')
            .select('place_id, overall_rating');

        // Build stats map
        const statsMap = {};
        (reviewsData || []).forEach((r) => {
            if (!statsMap[r.place_id]) {
                statsMap[r.place_id] = { total: 0, sum: 0 };
            }
            statsMap[r.place_id].total += 1;
            statsMap[r.place_id].sum += r.overall_rating || 0;
        });

        const enriched = (placesData || []).map((p) => ({
            ...p,
            review_count: statsMap[p.id]?.total || 0,
            avg_rating: statsMap[p.id]
                ? statsMap[p.id].sum / statsMap[p.id].total
                : 0,
        }));

        setPlaces(enriched);
        setLoading(false);
    }, []);

    useEffect(() => {
        fetchPlaces();
    }, [fetchPlaces]);

    const handlePlaceCreated = () => {
        fetchPlaces();
    };

    const sortedPlaces = [...places].sort((a, b) => {
        if (sortBy === 'rating') return b.avg_rating - a.avg_rating;
        if (sortBy === 'reviews') return b.review_count - a.review_count;
        if (sortBy === 'name') return a.name.localeCompare(b.name);
        // 'recent' (default)
        return new Date(b.created_at) - new Date(a.created_at);
    });

    return (
        <>
            <div className="dashboard-header">
                <div>
                    <h2>Mis Lugares</h2>
                    <div className="subtitle">
                        {places.length} {places.length === 1 ? 'lugar' : 'lugares'} registrados
                    </div>
                </div>
                <button className="btn btn-primary" onClick={() => setShowForm(true)}>
                    + Nuevo lugar
                </button>
            </div>

            {places.length > 1 && (
                <div className="sort-controls" style={{ marginBottom: '20px' }}>
                    {[
                        { key: 'recent', label: 'Recientes' },
                        { key: 'rating', label: 'Mejor rating' },
                        { key: 'reviews', label: 'Más reseñas' },
                        { key: 'name', label: 'A-Z' },
                    ].map((s) => (
                        <button
                            key={s.key}
                            className={`sort-btn ${sortBy === s.key ? 'active' : ''}`}
                            onClick={() => setSortBy(s.key)}
                        >
                            {s.label}
                        </button>
                    ))}
                </div>
            )}

            {loading ? (
                <div className="loading">
                    <div className="spinner" />
                </div>
            ) : places.length === 0 ? (
                <div className="empty-state">
                    <span className="empty-icon">🍽️</span>
                    <h3>Aún no hay lugares</h3>
                    <p>Agrega tu primer restaurante, café o bar para comenzar.</p>
                    <button className="btn btn-primary" onClick={() => setShowForm(true)}>
                        + Agregar lugar
                    </button>
                </div>
            ) : (
                <div className="places-grid">
                    {sortedPlaces.map((place) => (
                        <PlaceCard
                            key={place.id}
                            place={place}
                            onClick={() => onOpenPlace(place.id)}
                        />
                    ))}
                </div>
            )}

            {showForm && (
                <PlaceForm
                    session={session}
                    onClose={() => setShowForm(false)}
                    onCreated={handlePlaceCreated}
                />
            )}
        </>
    );
}
