import React, { useContext, useState } from 'react';
import AppContext from '../../context/AppContext';
import { useNavigate, Link } from 'react-router-dom';

const ForgotPassword = () => {
    const { forgotPassword } = useContext(AppContext);
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);

    const submitHandler = async (e) => {
        e.preventDefault();
        setLoading(true);
        await forgotPassword(email);
        setLoading(false);
    };

    return (
        <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem', background: 'var(--bg)' }}>
            <div className="paint-form-card" style={{ width: '100%', maxWidth: '450px' }}>
                <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                    <div style={{ width: '56px', height: '56px', background: 'var(--primary)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem', fontSize: '1.4rem' }}>🔐</div>
                    <h1 style={{ fontSize: '1.8rem', marginBottom: '0.35rem' }}>Forgot Password</h1>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem' }}>Enter your email to receive a reset link.</p>
                </div>
                <form onSubmit={submitHandler}>
                    <div className="paint-form-group">
                        <label className="paint-form-label">Email Address</label>
                        <input name="email" value={email} onChange={(e) => setEmail(e.target.value)}
                            type="email" className="paint-form-input" placeholder="you@example.com" required />
                    </div>
                    <button type="submit" className="btn-paint-primary"
                        style={{ width: '100%', padding: '0.75rem', fontSize: '1rem', marginTop: '0.5rem', opacity: loading ? 0.7 : 1 }}
                        disabled={loading}>
                        {loading ? 'Sending...' : 'Send Reset Link'}
                    </button>
                </form>
                <div style={{ textAlign: 'center', marginTop: '1.5rem' }}>
                    <Link to="/login" style={{ color: 'var(--primary)', fontSize: '0.9rem', textDecoration: 'none', fontWeight: 600 }}>Back to Login</Link>
                </div>
            </div>
        </div>
    );
};

export default ForgotPassword;
