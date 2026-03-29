import React, { useContext, useState } from 'react';
import AppContext from '../../context/AppContext';
import { useNavigate, Link } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google';

const Login = () => {
    const { login, googleLogin } = useContext(AppContext);
    const navigate = useNavigate();
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [loading,  setLoading]  = useState(false);
    const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID?.trim();

    const onChangerHandler = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const submitHandler = async (e) => {
        e.preventDefault();
        setLoading(true);
        const result = await login(formData.email, formData.password);
        setLoading(false);
        if (result?.success) {
            // Admin → admin panel, regular user → home
            navigate(result.isAdmin ? '/admin' : '/');
        }
    };

    const handleGoogleSuccess = async (credentialResponse) => {
        if (!credentialResponse?.credential) return;
        setLoading(true);
        const result = await googleLogin(credentialResponse.credential);
        setLoading(false);
        if (result?.success) {
            navigate(result.isAdmin ? '/admin' : '/');
        }
    };

    return (
        <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem', background: 'var(--bg)' }}>
            <div className="paint-form-card" style={{ width: '100%' }}>
                <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                    <div style={{ width: '56px', height: '56px', background: 'var(--primary)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem', fontSize: '1.4rem' }}>🎨</div>
                    <h1 style={{ fontSize: '1.8rem', marginBottom: '0.35rem' }}>Welcome Back</h1>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem' }}>Sign in to your Ajmera Paints account</p>
                </div>
                <form onSubmit={submitHandler}>
                    <div className="paint-form-group">
                        <label className="paint-form-label">Email Address or Mobile Number</label>
                        <input name="email" value={formData.email} onChange={onChangerHandler}
                            type="text" className="paint-form-input" placeholder="you@example.com or 9988776655" required />
                    </div>
                    <div className="paint-form-group">
                        <label className="paint-form-label">Password</label>
                        <input name="password" value={formData.password} onChange={onChangerHandler}
                            type="password" className="paint-form-input" placeholder="••••••••" required />
                        <div style={{ textAlign: 'right', marginTop: '0.5rem' }}>
                            <Link to="/forgot-password" style={{ color: 'var(--primary)', fontSize: '0.85rem', textDecoration: 'none' }}>Forgot Password?</Link>
                        </div>
                    </div>
                    <button type="submit" className="btn-paint-primary"
                        style={{ width: '100%', padding: '0.75rem', fontSize: '1rem', marginTop: '0.5rem', opacity: loading ? 0.7 : 1 }}
                        disabled={loading}>
                        {loading ? 'Signing in...' : 'Sign In'}
                    </button>
                    
                    <div style={{ margin: '1.5rem 0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <span style={{ height: '1px', background: 'var(--border)', flex: 1 }}></span>
                        <span style={{ padding: '0 1rem', color: 'var(--text-muted)', fontSize: '0.9rem' }}>OR</span>
                        <span style={{ height: '1px', background: 'var(--border)', flex: 1 }}></span>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'center' }}>
                        {googleClientId ? (
                            <GoogleLogin
                                onSuccess={handleGoogleSuccess}
                                onError={() => {
                                    setLoading(false);
                                    console.error('Google login failed before a credential was returned.');
                                }}
                                useOneTap
                            />
                        ) : (
                            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', textAlign: 'center' }}>
                                Google sign-in is not configured for this environment.
                            </p>
                        )}
                    </div>
                </form>
                <p style={{ textAlign: 'center', margin: '1.5rem 0', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                    Don't have an account?{' '}
                    <Link to="/register" style={{ color: 'var(--primary)', fontWeight: 600 }}>Register here</Link>
                </p>
            </div>
        </div>
    );
};

export default Login;
