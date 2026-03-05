import { useState } from 'react';
import { supabase } from '../lib/supabase';

export default function PlaceForm({ session, onClose, onCreated }) {
    const [name, setName] = useState('');
    const [address, setAddress] = useState('');
    const [description, setDescription] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!name.trim()) {
            setMessage({ type: 'err', text: 'El nombre es obligatorio.' });
            return;
        }

        setLoading(true);
        setMessage(null);

        const { data, error } = await supabase
            .from('places')
            .insert({
                name: name.trim(),
                address: address.trim() || null,
                description: description.trim() || null,
                user_id: session.user.id,
            })
            .select()
            .single();

        if (error) {
            setMessage({ type: 'err', text: error.message });
            setLoading(false);
            return;
        }

        setMessage({ type: 'ok', text: '¡Lugar creado!' });
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
                    <h3>📍 Nuevo lugar</h3>
                    <button className="modal-close" onClick={onClose}>×</button>
                </div>
                <div className="modal-body">
                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label className="form-label" htmlFor="place-name">Nombre *</label>
                            <input
                                id="place-name"
                                className="form-input"
                                type="text"
                                placeholder="Ej: Café República"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                autoFocus
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-label" htmlFor="place-address">Dirección</label>
                            <input
                                id="place-address"
                                className="form-input"
                                type="text"
                                placeholder="Ej: Av. 6 de Agosto #123, La Paz"
                                value={address}
                                onChange={(e) => setAddress(e.target.value)}
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-label" htmlFor="place-description">Descripción</label>
                            <textarea
                                id="place-description"
                                className="form-textarea"
                                placeholder="Describe el ambiente, tipo de comida..."
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                rows={3}
                            />
                        </div>

                        <button
                            type="submit"
                            className="btn btn-primary btn-full btn-lg"
                            disabled={loading}
                        >
                            {loading ? 'Guardando...' : 'Crear lugar'}
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
