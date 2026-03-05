import { useState } from 'react';
import { supabase } from '../lib/supabase';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState(null);
    const [isSignUp, setIsSignUp] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage(null);

        try {
            if (isSignUp) {
                const { error } = await supabase.auth.signUp({ email, password });
                if (error) throw error;
                setMessage({ type: 'ok', text: '¡Cuenta creada! Revisa tu correo para confirmar.' });
            } else {
                const { error } = await supabase.auth.signInWithPassword({ email, password });
                if (error) throw error;
            }
        } catch (err) {
            setMessage({ type: 'err', text: err.message });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-page">
            <div className="login-card">
                <div className="login-header">
                    <span className="login-icon">🍽️</span>
                    <h1>Ranking</h1>
                    <p>Tu diario gastronómico personal</p>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label className="form-label" htmlFor="login-email">Correo electrónico</label>
                        <input
                            id="login-email"
                            className="form-input"
                            type="email"
                            placeholder="tu@email.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label" htmlFor="login-password">Contraseña</label>
                        <input
                            id="login-password"
                            className="form-input"
                            type="password"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            minLength={6}
                        />
                    </div>

                    <button
                        type="submit"
                        className="btn btn-primary btn-full btn-lg"
                        disabled={loading}
                    >
                        {loading ? 'Cargando...' : isSignUp ? 'Crear cuenta' : 'Iniciar sesión'}
                    </button>

                    {message && (
                        <div className={`msg ${message.type === 'ok' ? 'msg-ok' : 'msg-err'}`}>
                            {message.text}
                        </div>
                    )}
                </form>

                <div style={{ textAlign: 'center', marginTop: '20px' }}>
                    <button
                        className="btn btn-ghost"
                        onClick={() => { setIsSignUp(!isSignUp); setMessage(null); }}
                        type="button"
                    >
                        {isSignUp ? '¿Ya tienes cuenta? Inicia sesión' : '¿No tienes cuenta? Regístrate'}
                    </button>
                </div>
            </div>
        </div>
    );
}
