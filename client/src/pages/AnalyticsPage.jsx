import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { analyticsAPI, qrCodeAPI } from '../services/api';
import {
  BarChart3, Smartphone, Monitor, Tablet, Globe, Clock, ArrowLeft, Calendar
} from 'lucide-react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, PieChart, Pie, Cell
} from 'recharts';
import toast from 'react-hot-toast';

const COLORS = ['#6366f1', '#8b5cf6', '#06b6d4', '#10b981', '#f59e0b', '#ef4444', '#ec4899', '#14b8a6'];

export default function AnalyticsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const qrId = searchParams.get('qr');
  const [qrCodes, setQRCodes] = useState([]);
  const [selectedQR, setSelectedQR] = useState(qrId || '');
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [days, setDays] = useState(30);

  useEffect(() => {
    fetchQRCodes();
  }, []);

  useEffect(() => {
    if (selectedQR) {
      fetchAnalytics();
    }
  }, [selectedQR, days]);

  const fetchQRCodes = async () => {
    try {
      const { data } = await qrCodeAPI.getAll({ limit: 100 });
      setQRCodes(data.qrCodes);
      if (qrId) setSelectedQR(qrId);
      else if (data.qrCodes.length > 0) setSelectedQR(data.qrCodes[0]._id);
    } catch (err) {
      toast.error('Failed to load QR codes');
    } finally {
      setLoading(false);
    }
  };

  const fetchAnalytics = async () => {
    setLoading(true);
    try {
      const { data } = await analyticsAPI.getQRAnalytics(selectedQR, days);
      setAnalytics(data);
    } catch (err) {
      toast.error('Failed to load analytics');
    } finally {
      setLoading(false);
    }
  };

  if (loading && !analytics) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-3 border-primary-500/30 border-t-primary-500 rounded-full animate-spin" />
      </div>
    );
  }

  if (qrCodes.length === 0) {
    return (
      <div className="glass-card p-12 text-center fade-in">
        <BarChart3 className="w-16 h-16 mx-auto text-dark-600 mb-4" />
        <h3 className="text-xl font-semibold text-white mb-2">No Analytics Yet</h3>
        <p className="text-dark-400">Create QR codes first to see analytics data</p>
      </div>
    );
  }

  const selectedQRData = qrCodes.find(q => q._id === selectedQR);

  return (
    <div className="space-y-6 fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Analytics</h1>
          <p className="text-dark-400 mt-1">Detailed scan analytics for your QR codes</p>
        </div>
        <div className="flex gap-3">
          <select
            value={selectedQR}
            onChange={(e) => { setSelectedQR(e.target.value); setSearchParams({ qr: e.target.value }); }}
            className="px-4 py-2 bg-dark-800 border border-dark-600 rounded-xl text-sm text-dark-200 focus:outline-none focus:border-primary-500 max-w-[200px]"
          >
            {qrCodes.map(qr => (
              <option key={qr._id} value={qr._id}>{qr.title}</option>
            ))}
          </select>
          <select
            value={days}
            onChange={(e) => setDays(Number(e.target.value))}
            className="px-4 py-2 bg-dark-800 border border-dark-600 rounded-xl text-sm text-dark-200 focus:outline-none focus:border-primary-500"
          >
            <option value={7}>7 days</option>
            <option value={14}>14 days</option>
            <option value={30}>30 days</option>
            <option value={90}>90 days</option>
          </select>
        </div>
      </div>

      {/* Quick stats */}
      {analytics && (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="glass-card p-5">
              <p className="text-dark-400 text-sm">Total Scans</p>
              <p className="text-3xl font-bold text-white mt-1">{analytics.totalScans}</p>
              <p className="text-xs text-dark-400 mt-1">Last {days} days</p>
            </div>
            <div className="glass-card p-5">
              <p className="text-dark-400 text-sm">QR Code</p>
              <p className="text-lg font-semibold text-white mt-1 truncate">{selectedQRData?.title}</p>
              <p className="text-xs text-primary-400 mt-1 truncate">{selectedQRData?.shortUrl}</p>
            </div>
            <div className="glass-card p-5">
              <p className="text-dark-400 text-sm">Avg. Scans/Day</p>
              <p className="text-3xl font-bold text-white mt-1">
                {analytics.totalScans ? (analytics.totalScans / days).toFixed(1) : 0}
              </p>
              <p className="text-xs text-dark-400 mt-1">Average</p>
            </div>
          </div>

          {/* Scans Over Time Chart */}
          <div className="glass-card p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Scans Over Time</h3>
            {analytics.scansPerDay.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={analytics.scansPerDay}>
                  <defs>
                    <linearGradient id="analyticsGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                  <XAxis dataKey="date" stroke="#475569" tick={{ fill: '#64748b', fontSize: 12 }} tickFormatter={(v) => v.slice(5)} />
                  <YAxis stroke="#475569" tick={{ fill: '#64748b', fontSize: 12 }} />
                  <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '12px', color: '#e2e8f0' }} />
                  <Area type="monotone" dataKey="count" stroke="#6366f1" strokeWidth={2} fill="url(#analyticsGrad)" name="Scans" />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-[300px] flex items-center justify-center text-dark-400">No data in this period</div>
            )}
          </div>

          {/* Charts Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Device Breakdown */}
            <div className="glass-card p-6">
              <h3 className="text-base font-semibold text-white mb-4">Devices</h3>
              {analytics.deviceBreakdown.length > 0 ? (
                <>
                  <ResponsiveContainer width="100%" height={180}>
                    <PieChart>
                      <Pie data={analytics.deviceBreakdown} dataKey="count" nameKey="device" cx="50%" cy="50%" outerRadius={70} innerRadius={45} paddingAngle={3} strokeWidth={0}>
                        {analytics.deviceBreakdown.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                      </Pie>
                      <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '12px', color: '#e2e8f0' }} />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="space-y-2">
                    {analytics.deviceBreakdown.map((d, i) => (
                      <div key={d.device} className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[i] }} />
                          <span className="text-dark-300 capitalize">{d.device}</span>
                        </div>
                        <span className="text-white font-medium">{d.count}</span>
                      </div>
                    ))}
                  </div>
                </>
              ) : <p className="text-dark-400 text-sm text-center py-8">No data</p>}
            </div>

            {/* Browser Breakdown */}
            <div className="glass-card p-6">
              <h3 className="text-base font-semibold text-white mb-4">Browsers</h3>
              {analytics.browserBreakdown.length > 0 ? (
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={analytics.browserBreakdown} layout="vertical" margin={{ left: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                    <XAxis type="number" stroke="#475569" tick={{ fill: '#64748b', fontSize: 11 }} />
                    <YAxis dataKey="browser" type="category" stroke="#475569" tick={{ fill: '#94a3b8', fontSize: 11 }} width={80} />
                    <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '12px', color: '#e2e8f0' }} />
                    <Bar dataKey="count" fill="#8b5cf6" radius={[0, 6, 6, 0]} name="Scans" />
                  </BarChart>
                </ResponsiveContainer>
              ) : <p className="text-dark-400 text-sm text-center py-8">No data</p>}
            </div>

            {/* Country Breakdown */}
            <div className="glass-card p-6">
              <h3 className="text-base font-semibold text-white mb-4">Countries</h3>
              {analytics.countryBreakdown.length > 0 ? (
                <div className="space-y-3">
                  {analytics.countryBreakdown.slice(0, 8).map((c, i) => {
                    const max = analytics.countryBreakdown[0].count;
                    return (
                      <div key={c.country}>
                        <div className="flex items-center justify-between text-sm mb-1">
                          <span className="text-dark-300">{c.country}</span>
                          <span className="text-white font-medium">{c.count}</span>
                        </div>
                        <div className="w-full h-2 bg-dark-700 rounded-full overflow-hidden">
                          <div
                            className="h-full rounded-full bg-gradient-to-r from-primary-500 to-violet-500 transition-all duration-500"
                            style={{ width: `${(c.count / max) * 100}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : <p className="text-dark-400 text-sm text-center py-8">No data</p>}
            </div>
          </div>

          {/* Recent Scans */}
          {analytics.recentScans.length > 0 && (
            <div className="glass-card p-6">
              <h3 className="text-base font-semibold text-white mb-4">Recent Scans</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-dark-700/50">
                      <th className="text-left py-2.5 px-3 text-dark-400 font-medium">Time</th>
                      <th className="text-left py-2.5 px-3 text-dark-400 font-medium">Device</th>
                      <th className="text-left py-2.5 px-3 text-dark-400 font-medium">Browser</th>
                      <th className="text-left py-2.5 px-3 text-dark-400 font-medium">OS</th>
                      <th className="text-left py-2.5 px-3 text-dark-400 font-medium">Location</th>
                    </tr>
                  </thead>
                  <tbody>
                    {analytics.recentScans.map((scan) => (
                      <tr key={scan._id} className="border-b border-dark-800/50 hover:bg-dark-800/30">
                        <td className="py-2.5 px-3 text-dark-300">{new Date(scan.createdAt).toLocaleString()}</td>
                        <td className="py-2.5 px-3">
                          <span className="capitalize text-dark-200">{scan.deviceType}</span>
                        </td>
                        <td className="py-2.5 px-3 text-dark-300">{scan.browser}</td>
                        <td className="py-2.5 px-3 text-dark-300">{scan.os}</td>
                        <td className="py-2.5 px-3 text-dark-300">
                          {scan.city !== 'unknown' ? `${scan.city}, ${scan.country}` : scan.country}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
