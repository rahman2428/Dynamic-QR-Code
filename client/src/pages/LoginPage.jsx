import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogIn, Mail, Lock, Eye, EyeOff, QrCode, ArrowRight, Zap, Shield, BarChart3 } from 'lucide-react';
import toast from 'react-hot-toast';

const FEATURES = [
  { icon: Zap, title: 'Instant Redirects', desc: 'Sub-200ms redirect engine' },
  { icon: Shield, title: 'Enterprise Security', desc: 'JWT auth & rate limiting' },
  { icon: BarChart3, title: 'Real-time Analytics', desc: 'Device, location & trends' },
];

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(email, password);
      toast.success('Welcome back!');
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex mesh-bg relative overflow-hidden">
      {/* Animated orbs */}
      <div className="orb orb-1" />
      <div className="orb orb-2" />
      <div className="orb orb-3" />

      {/* Left — Branding panel (hidden on mobile) */}
      <div className="hidden lg:flex lg:w-[45%] relative z-10 flex-col justify-between p-12">
        <div className="fade-in">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-primary-500 to-violet-500 flex items-center justify-center shadow-lg shadow-primary-500/25">
              <QrCode className="w-5.5 h-5.5 text-white" />
            </div>
            <span className="text-xl font-bold text-white tracking-tight">QR Hub</span>
          </div>
        </div>

        <div className="space-y-8 fade-in" style={{ animationDelay: '0.15s' }}>
          <div>
            <h1 className="text-4xl lg:text-5xl font-extrabold text-white leading-tight tracking-tight">
              Dynamic QR codes<br />
              <span className="gradient-text">you control.</span>
            </h1>
            <p className="text-dark-400 mt-4 text-lg leading-relaxed max-w-md">
              Create, manage, and track QR codes in real-time. Change destinations instantly — no reprinting needed.
            </p>
          </div>

          <div className="space-y-4 stagger">
            {FEATURES.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="flex items-center gap-4 fade-in-up">
                <div className="w-10 h-10 rounded-xl bg-dark-800/80 border border-dark-700/50 flex items-center justify-center flex-shrink-0">
                  <Icon className="w-5 h-5 text-primary-400" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-white">{title}</p>
                  <p className="text-xs text-dark-400">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <p className="text-dark-500 text-xs fade-in" style={{ animationDelay: '0.3s' }}>
          © {new Date().getFullYear()} QR Hub • Enterprise QR Management
        </p>
      </div>

      {/* Right — Login form */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-12 relative z-10">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="lg:hidden text-center mb-10 fade-in">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-primary-500 to-violet-500 mb-3 shadow-lg shadow-primary-500/25">
              <QrCode className="w-7 h-7 text-white" />
            </div>
            <h1 className="text-2xl font-bold gradient-text">QR Hub</h1>
          </div>

          <div className="fade-in-up">
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-white">Welcome back</h2>
              <p className="text-dark-400 mt-1 text-sm">Sign in to your dashboard</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-xs font-medium text-dark-300 mb-1.5 uppercase tracking-wider">Email</label>
                <div className="relative group">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-[18px] h-[18px] text-dark-500 group-focus-within:text-primary-400 transition-colors" />
                  <input
                    id="login-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-11 pr-4 py-3 bg-dark-800/40 border border-dark-600/60 rounded-xl text-white placeholder-dark-500 focus:outline-none focus:border-primary-500/60 focus:bg-dark-800/70 focus:shadow-[0_0_0_3px_rgba(99,102,241,0.08)] transition-all text-sm"
                    placeholder="your@email.com"
                    required
                    autoComplete="email"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-dark-300 mb-1.5 uppercase tracking-wider">Password</label>
                <div className="relative group">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-[18px] h-[18px] text-dark-500 group-focus-within:text-primary-400 transition-colors" />
                  <input
                    id="login-password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-11 pr-12 py-3 bg-dark-800/40 border border-dark-600/60 rounded-xl text-white placeholder-dark-500 focus:outline-none focus:border-primary-500/60 focus:bg-dark-800/70 focus:shadow-[0_0_0_3px_rgba(99,102,241,0.08)] transition-all text-sm"
                    placeholder="••••••••"
                    required
                    minLength={6}
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-dark-500 hover:text-dark-300 transition-colors rounded-md"
                    tabIndex={-1}
                  >
                    {showPassword ? <EyeOff className="w-[18px] h-[18px]" /> : <Eye className="w-[18px] h-[18px]" />}
                  </button>
                </div>
              </div>

              <button
                id="login-submit"
                type="submit"
                disabled={loading}
                className="btn-shine w-full py-3 px-6 bg-gradient-to-r from-primary-600 to-primary-500 hover:from-primary-500 hover:to-primary-400 text-white font-semibold rounded-xl transition-all duration-300 shadow-lg shadow-primary-600/20 hover:shadow-primary-500/30 hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 flex items-center justify-center gap-2 text-sm"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    Sign In
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            <div className="mt-8 pt-6 border-t border-dark-700/40 text-center">
              <p className="text-dark-400 text-sm">
                Don't have an account?{' '}
                <Link to="/register" className="text-primary-400 hover:text-primary-300 font-semibold transition-colors">
                  Create one
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
