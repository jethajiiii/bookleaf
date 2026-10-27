import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth.js';
import httpClient from '../../api/httpClient.js';
import Button from '../../components/ui/Button.jsx';
import Card from '../../components/ui/Card.jsx';

/**
 * LoginPage provides authentication for authors and admins.
 */
export function LoginPage() {
  const [email, setEmail] = useState('priya.sharma@email.com');
  const [password, setPassword] = useState('password123');
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      const res = await httpClient.post('/auth/login', { email, password });
      login(res.data.token, res.data.user);
      const target = location.state?.from?.pathname || (res.data.user.role === 'admin' ? '/admin' : '/books');
      navigate(target, { replace: true });
    } catch (err) {
      setError(err.message || 'Invalid email or password');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-cream flex flex-col justify-center items-center px-4 py-12">
      <div className="text-center mb-8">
        <div className="w-12 h-12 rounded-2xl bg-terracotta text-white flex items-center justify-center font-serif text-2xl font-bold mx-auto mb-3 shadow-sm">
          B
        </div>
        <h1 className="font-serif text-3xl font-bold text-charcoal">BookLeaf Publishing</h1>
        <p className="text-sm text-charcoal-light mt-1">Author Support & Communication Portal</p>
      </div>

      <Card className="w-full max-w-md shadow-sm">
        <h2 className="font-serif text-xl font-semibold text-charcoal mb-6 text-center">
          Sign In to Your Account
        </h2>

        {error && (
          <div className="mb-4 p-3 rounded-xl bg-terracotta-light border border-terracotta/30 text-terracotta text-xs font-medium">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-charcoal-light uppercase tracking-wider mb-1.5">
              Email Address
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-card-border bg-cream-light text-charcoal text-sm focus:outline-none focus:ring-2 focus:ring-terracotta/50"
              placeholder="author@example.com"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-charcoal-light uppercase tracking-wider mb-1.5">
              Password
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-card-border bg-cream-light text-charcoal text-sm focus:outline-none focus:ring-2 focus:ring-terracotta/50"
              placeholder="••••••••"
            />
          </div>

          <Button
            type="submit"
            variant="primary"
            size="lg"
            className="w-full mt-2"
            disabled={submitting}
          >
            {submitting ? 'Authenticating...' : 'Sign In'}
          </Button>
        </form>

        <div className="mt-6 pt-4 border-t border-card-border text-center text-xs text-charcoal-muted space-y-2">
          <p className="font-semibold text-charcoal-light">Quick demo sign in:</p>
          <div className="flex justify-center gap-2">
            <button
              type="button"
              onClick={() => {
                setEmail('priya.sharma@email.com');
                setPassword('password123');
              }}
              className="px-2.5 py-1 rounded-lg bg-cream-dark/60 hover:bg-cream-dark text-charcoal text-[11px] font-medium border border-card-border transition-colors"
            >
              Fill Author
            </button>
            <button
              type="button"
              onClick={() => {
                setEmail('admin@bookleaf.com');
                setPassword('admin123');
              }}
              className="px-2.5 py-1 rounded-lg bg-teal-light hover:bg-teal/20 text-teal text-[11px] font-semibold border border-teal/30 transition-colors"
            >
              Fill Admin
            </button>
          </div>
        </div>
      </Card>
    </div>
  );
}

export default LoginPage;
