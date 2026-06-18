import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle2, Loader2, LockKeyhole, Mail } from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('admin@taskflow.dev');
  const [password, setPassword] = useState('password123');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError('');

    try {
      await login(email, password);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Check the API and credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="login-page">
      <section className="login-visual">
        <div className="brand-mark">TF</div>
        <h1>TaskFlow Pro</h1>
        <p>Plan, assign, review, and ship team work from one executive dashboard.</p>
        <div className="login-proof">
          {['Project analytics', 'Team workload', 'Deadline tracking'].map((item) => (
            <span key={item}>
              <CheckCircle2 size={18} />
              {item}
            </span>
          ))}
        </div>
      </section>
      <section className="login-card">
        <div>
          <span className="eyebrow">Welcome back</span>
          <h2>Sign in to your workspace</h2>
        </div>
        <form onSubmit={handleSubmit}>
          <label>
            Email
            <span className="input-shell">
              <Mail size={18} />
              <input value={email} onChange={(event) => setEmail(event.target.value)} type="email" />
            </span>
          </label>
          <label>
            Password
            <span className="input-shell">
              <LockKeyhole size={18} />
              <input value={password} onChange={(event) => setPassword(event.target.value)} type="password" />
            </span>
          </label>
          {error && <p className="form-error">{error}</p>}
          <button className="primary-button" type="submit" disabled={loading}>
            {loading ? <Loader2 className="spin" size={18} /> : null}
            Sign in
          </button>
        </form>
      </section>
    </main>
  );
}

