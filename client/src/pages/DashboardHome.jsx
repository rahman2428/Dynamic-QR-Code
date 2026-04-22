import { useState, useEffect, useRef } from 'react';
import { analyticsAPI } from '../services/api';
import { BarChart3, QrCode, Activity, Smartphone, TrendingUp, ArrowUpRight, Clock } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import toast from 'react-hot-toast';

const DEVICE_COLORS = ['#6366f1', '#8b5cf6', '#06b6d4', '#10b981'];

function AnimatedNumber({ value, duration = 800 }) {
  const [display, setDisplay] = useState(0);
  const ref = useRef(null);
  useEffect(() => {
    const start = performance.now();
    const from = 0;
    const to = value || 0;
    const tick = (now) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(Math.round(from + (to - from) * eased));
      if (progress < 1) ref.current = requestAnimationFrame(tick);
    };
    ref.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(ref.current);
  }, [value, duration]);
  return <span className="count-up">{display.toLocaleString()}</span>;
}

function Skeleton({ className = '', h = 'h-4' }) {
  return <div className={`shimmer ${h} ${className}`} />;
}

function StatCard({ icon: Icon, label, value, gradient, sub, delay = 0 }) {
  return (
    <div className="gradient-border glass-card p-5 fade-in-up" style={{ animationDelay: `${delay}s` }}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-dark-400 text-xs font-medium uppercase tracking-wider">{label}</p>
          <p className="text-3xl font-extrabold text-white mt-2 tracking-tight">
            <AnimatedNumber value={value} />
          </p>
          {sub && <p className="text-[11px] text-dark-500 mt-0.5 flex items-center gap-1"><Clock className="w-3 h-3" />{sub}</p>}
        </div>
        <div className={`p-2.5 rounded-xl ${gradient}`}>
          <Icon className="w-5 h-5 text-white" />
        </div>
      </div>
    </div>
  );
}

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="glass-card px-4 py-3 !border-dark-600/30 shadow-xl">
      <p className="text-[11px] text-dark-400 mb-1">{label}</p>
      <p className="text-sm font-bold text-white">{payload[0].value} <span className="text-dark-400 font-normal text-xs">scans</span></p>
    </div>
  );
};

export default function DashboardHome() {
  const [overview, setOverview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [days, setDays] = useState(30);

  useEffect(() => { fetchOverview(); }, [days]);

  const fetchOverview = async () => {
    setLoading(true);
    try {
      const { data } = await analyticsAPI.getOverview(days);
      setOverview(data);
    } catch (err) {
      toast.error('Failed to load analytics');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-8 fade-in">
        <div className="flex justify-between items-start">
          <div><Skeleton h="h-7" className="w-52 mb-2" /><Skeleton h="h-4" className="w-72" /></div>
          <Skeleton h="h-10" className="w-36" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 stagger">
          {[...Array(4)].map((_, i) => <div key={i} className="glass-card p-5 space-y-3 fade-in-up"><Skeleton h="h-3" className="w-24" /><Skeleton h="h-8" className="w-16" /><Skeleton h="h-3" className="w-20" /></div>)}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          <div className="lg:col-span-2 glass-card p-6"><Skeleton h="h-5" className="w-40 mb-6" /><Skeleton h="h-[280px]" className="w-full" /></div>
          <div className="glass-card p-6"><Skeleton h="h-5" className="w-44 mb-6" /><Skeleton h="h-[280px]" className="w-full" /></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">Dashboard</h1>
          <p className="text-dark-400 mt-0.5 text-sm">Track your QR code performance</p>
        </div>
        <div className="flex items-center gap-2 bg-dark-800/50 border border-dark-700/40 rounded-xl p-1">
          {[{ v: 7, l: '7d' }, { v: 14, l: '14d' }, { v: 30, l: '30d' }, { v: 90, l: '90d' }].map(({ v, l }) => (
            <button
              key={v}
              onClick={() => setDays(v)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                days === v ? 'bg-primary-500/15 text-primary-400 shadow-sm' : 'text-dark-400 hover:text-dark-200'
              }`}
            >
              {l}
            </button>
          ))}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard icon={QrCode} label="Total QR Codes" value={overview?.totalQRCodes || 0} gradient="bg-gradient-to-br from-primary-500 to-primary-700" sub="All time" delay={0} />
        <StatCard icon={Activity} label="Active Codes" value={overview?.activeQRCodes || 0} gradient="bg-gradient-to-br from-accent-500 to-accent-600" sub="Currently active" delay={0.05} />
        <StatCard icon={BarChart3} label="Total Scans" value={overview?.totalScans || 0} gradient="bg-gradient-to-br from-violet-500 to-violet-700" sub={`Last ${days} days`} delay={0.1} />
        <StatCard icon={TrendingUp} label="Avg. Scans/Day" value={overview?.totalScans ? Math.round(overview.totalScans / days) : 0} gradient="bg-gradient-to-br from-cyan-500 to-cyan-400" sub={`Last ${days} days`} delay={0.15} />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Area chart */}
        <div className="lg:col-span-2 glass-card p-6 fade-in-up" style={{ animationDelay: '0.2s' }}>
          <div className="flex items-center justify-between mb-5">
            <h3 className="text-sm font-semibold text-white">Scans Over Time</h3>
            {overview?.totalScans > 0 && (
              <div className="flex items-center gap-1 px-2 py-1 bg-accent-500/10 rounded-lg">
                <ArrowUpRight className="w-3.5 h-3.5 text-accent-400" />
                <span className="text-xs font-semibold text-accent-400">{overview?.totalScans} total</span>
              </div>
            )}
          </div>
          {overview?.scansOverTime?.length > 0 ? (
            <ResponsiveContainer width="100%" height={280}>
              <AreaChart data={overview.scansOverTime}>
                <defs>
                  <linearGradient id="scanGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#6366f1" stopOpacity={0.25} />
                    <stop offset="100%" stopColor="#6366f1" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(51,65,85,0.3)" />
                <XAxis dataKey="date" stroke="#334155" tick={{ fill: '#64748b', fontSize: 11 }} tickFormatter={(v) => v.slice(5)} axisLine={false} tickLine={false} />
                <YAxis stroke="#334155" tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} cursor={{ stroke: 'rgba(99,102,241,0.15)', strokeWidth: 1 }} />
                <Area type="monotone" dataKey="count" stroke="#6366f1" strokeWidth={2.5} fill="url(#scanGradient)" name="Scans" dot={false} activeDot={{ r: 5, fill: '#6366f1', strokeWidth: 2, stroke: '#fff' }} />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[280px] flex items-center justify-center">
              <div className="text-center">
                <div className="w-14 h-14 mx-auto mb-3 rounded-2xl bg-dark-800/60 flex items-center justify-center">
                  <BarChart3 className="w-6 h-6 text-dark-600" />
                </div>
                <p className="text-sm font-medium text-dark-400">No scan data yet</p>
                <p className="text-xs text-dark-500 mt-1">Create QR codes and start sharing!</p>
              </div>
            </div>
          )}
        </div>

        {/* Pie chart */}
        <div className="glass-card p-6 fade-in-up" style={{ animationDelay: '0.25s' }}>
          <h3 className="text-sm font-semibold text-white mb-5">Device Distribution</h3>
          {overview?.deviceDistribution?.length > 0 ? (
            <div>
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie data={overview.deviceDistribution} dataKey="count" nameKey="device" cx="50%" cy="50%" outerRadius={80} innerRadius={55} paddingAngle={4} strokeWidth={0}>
                    {overview.deviceDistribution.map((entry, i) => (
                      <Cell key={entry.device} fill={DEVICE_COLORS[i % DEVICE_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                </PieChart>
              </ResponsiveContainer>
              <div className="space-y-2.5 mt-4">
                {overview.deviceDistribution.map((d, i) => (
                  <div key={d.device} className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2.5">
                      <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: DEVICE_COLORS[i % DEVICE_COLORS.length] }} />
                      <span className="text-dark-300 capitalize text-xs">{d.device}</span>
                    </div>
                    <span className="text-white font-semibold text-xs">{d.count}</span>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="h-[280px] flex items-center justify-center">
              <div className="text-center">
                <div className="w-14 h-14 mx-auto mb-3 rounded-2xl bg-dark-800/60 flex items-center justify-center">
                  <Smartphone className="w-6 h-6 text-dark-600" />
                </div>
                <p className="text-sm font-medium text-dark-400">No device data</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Top performing */}
      {overview?.topQRCodes?.length > 0 && (
        <div className="glass-card overflow-hidden fade-in-up" style={{ animationDelay: '0.3s' }}>
          <div className="px-6 py-4 border-b border-dark-700/30">
            <h3 className="text-sm font-semibold text-white">Top Performing</h3>
          </div>
          <div className="divide-y divide-dark-800/40">
            {overview.topQRCodes.map((qr, i) => (
              <div key={qr.id} className="flex items-center gap-4 px-6 py-3.5 hover:bg-dark-800/20 transition-colors">
                <span className="w-6 text-center text-xs font-bold text-dark-500">#{i + 1}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-white truncate">{qr.title}</p>
                  <code className="text-[11px] text-dark-400">{qr.shortId}</code>
                </div>
                <div className="px-3 py-1 bg-primary-500/10 rounded-full">
                  <span className="text-xs font-bold text-primary-400"><AnimatedNumber value={qr.totalScans} /> scans</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
