import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { UserPlus, Mail, Lock, User, Eye, EyeOff, QrCode, ArrowRight } from 'lucide-react';
import toast from 'react-hot-toast';

export default function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await register(name, email, password);
      toast.success('Account created! Welcome!');
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const strength = password.length === 0 ? 0 : password.length < 6 ? 1 : password.length < 10 ? 2 : 3;
  const strengthColors = ['', 'bg-danger-400', 'bg-warning-400', 'bg-accent-400'];
  const strengthLabels = ['', 'Weak', 'Good', 'Strong'];

  return (
    <div className="min-h-screen flex mesh-bg relative overflow-hidden">
      <div className="orb orb-1" />
      <div className="orb orb-2" />
      <div className="orb orb-3" />

      {/* Left branding */}
      <div className="hidden lg:flex lg:w-[45%] relative z-10 flex-col justify-between p-12">
        <div className="fade-in">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-violet-500 to-primary-500 flex items-center justify-center shadow-lg shadow-violet-500/25">
              <QrCode className="w-5.5 h-5.5 text-white" />
            </div>
            <span className="text-xl font-bold text-white tracking-tight">QR Hub</span>
          </div>
        </div>

        <div className="fade-in" style={{ animationDelay: '0.1s' }}>
          <h1 className="text-4xl lg:text-5xl font-extrabold text-white leading-tight tracking-tight">
            Start managing<br />
            <span className="gradient-text">your QR codes.</span>
          </h1>
          <p className="text-dark-400 mt-4 text-lg leading-relaxed max-w-md">
            Join thousands of businesses using QR Hub to create dynamic, trackable QR codes.
          </p>

          <div className="mt-8 flex items-center gap-4 fade-in-up" style={{ animationDelay: '0.25s' }}>
            <div className="flex -space-x-2">
              {['#6366f1', '#8b5cf6', '#06b6d4', '#10b981'].map((c, i) => (
                <div key={i} className="w-8 h-8 rounded-full border-2 border-dark-950 flex items-center justify-center text-white text-xs font-bold" style={{ background: c, zIndex: 4 - i }}>
                  {String.fromCharCode(65 + i)}
                </div>
              ))}
            </div>
            <p className="text-sm text-dark-300"><span className="text-white font-semibold">2,400+</span> businesses trust QR Hub</p>
          </div>
        </div>

        <p className="text-dark-500 text-xs fade-in" style={{ animationDelay: '0.3s' }}>
          © {new Date().getFullYear()} QR Hub • Enterprise QR Management
        </p>
      </div>

      {/* Right form */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-12 relative z-10">
        <div className="w-full max-w-md">
          <div className="lg:hidden text-center mb-10 fade-in">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-violet-500 to-primary-500 mb-3 shadow-lg shadow-violet-500/25">
              <QrCode className="w-7 h-7 text-white" />
            </div>
            <h1 className="text-2xl font-bold gradient-text">QR Hub</h1>
          </div>

          <div className="fade-in-up">
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-white">Create your account</h2>
              <p className="text-dark-400 mt-1 text-sm">Get started in under a minute</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-xs font-medium text-dark-300 mb-1.5 uppercase tracking-wider">Full Name</label>
                <div className="relative group">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-[18px] h-[18px] text-dark-500 group-focus-within:text-primary-400 transition-colors" />
                  <input
                    id="register-name" type="text" value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full pl-11 pr-4 py-3 bg-dark-800/40 border border-dark-600/60 rounded-xl text-white placeholder-dark-500 focus:outline-none focus:border-primary-500/60 focus:bg-dark-800/70 focus:shadow-[0_0_0_3px_rgba(99,102,241,0.08)] transition-all text-sm"
                    placeholder="John Doe" required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-dark-300 mb-1.5 uppercase tracking-wider">Email</label>
                <div className="relative group">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-[18px] h-[18px] text-dark-500 group-focus-within:text-primary-400 transition-colors" />
                  <input
                    id="register-email" type="email" value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-11 pr-4 py-3 bg-dark-800/40 border border-dark-600/60 rounded-xl text-white placeholder-dark-500 focus:outline-none focus:border-primary-500/60 focus:bg-dark-800/70 focus:shadow-[0_0_0_3px_rgba(99,102,241,0.08)] transition-all text-sm"
                    placeholder="your@email.com" required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-dark-300 mb-1.5 uppercase tracking-wider">Password</label>
                <div className="relative group">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-[18px] h-[18px] text-dark-500 group-focus-within:text-primary-400 transition-colors" />
                  <input
                    id="register-password" type={showPassword ? 'text' : 'password'} value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-11 pr-12 py-3 bg-dark-800/40 border border-dark-600/60 rounded-xl text-white placeholder-dark-500 focus:outline-none focus:border-primary-500/60 focus:bg-dark-800/70 focus:shadow-[0_0_0_3px_rgba(99,102,241,0.08)] transition-all text-sm"
                    placeholder="Min 6 characters" required minLength={6}
                  />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-dark-500 hover:text-dark-300 transition-colors rounded-md" tabIndex={-1}>
                    {showPassword ? <EyeOff className="w-[18px] h-[18px]" /> : <Eye className="w-[18px] h-[18px]" />}
                  </button>
                </div>
                {/* Password strength */}
                {password.length > 0 && (
                  <div className="mt-2 flex items-center gap-2">
                    <div className="flex-1 flex gap-1">
                      {[1, 2, 3].map((i) => (
                        <div key={i} className={`h-1 flex-1 rounded-full transition-all duration-300 ${i <= strength ? strengthColors[strength] : 'bg-dark-700'}`} />
                      ))}
                    </div>
                    <span className={`text-xs font-medium ${strength === 1 ? 'text-danger-400' : strength === 2 ? 'text-warning-400' : 'text-accent-400'}`}>{strengthLabels[strength]}</span>
                  </div>
                )}
              </div>

              <button
                id="register-submit" type="submit" disabled={loading}
                className="btn-shine w-full py-3 px-6 bg-gradient-to-r from-violet-500 to-primary-500 hover:from-violet-400 hover:to-primary-400 text-white font-semibold rounded-xl transition-all duration-300 shadow-lg shadow-violet-500/20 hover:shadow-violet-500/30 hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 flex items-center justify-center gap-2 text-sm"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    Create Account
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            <div className="mt-8 pt-6 border-t border-dark-700/40 text-center">
              <p className="text-dark-400 text-sm">
                Already have an account?{' '}
                <Link to="/login" className="text-primary-400 hover:text-primary-300 font-semibold transition-colors">
                  Sign in
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
