import { useState, useEffect, useCallback } from 'react';
import { qrCodeAPI } from '../services/api';
import {
  Plus, Search, Download, Edit3, Trash2, ExternalLink, Copy, X, Check,
  QrCode, Link2, Tag, Clock, Shield, ShieldOff, ChevronLeft, ChevronRight,
  MoreVertical, Eye, ArrowRight
} from 'lucide-react';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { QRCodeThumbnail } from '../components/QRCodeDisplay';

function Skeleton({ className = '', h = 'h-4' }) {
  return <div className={`shimmer ${h} ${className}`} />;
}

export default function QRCodesPage() {
  const [qrCodes, setQRCodes] = useState([]);
  const [pagination, setPagination] = useState({ total: 0, page: 1, pages: 1 });
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingQR, setEditingQR] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);
  const navigate = useNavigate();

  const fetchQRCodes = useCallback(async (page = 1) => {
    setLoading(true);
    try {
      const { data } = await qrCodeAPI.getAll({ page, search, status: statusFilter });
      setQRCodes(data.qrCodes);
      setPagination(data.pagination);
    } catch (err) {
      toast.error('Failed to load QR codes');
    } finally {
      setLoading(false);
    }
  }, [search, statusFilter]);

  useEffect(() => {
    const timer = setTimeout(() => fetchQRCodes(), 300);
    return () => clearTimeout(timer);
  }, [fetchQRCodes]);

  const handleDelete = async (id) => {
    try {
      await qrCodeAPI.delete(id);
      toast.success('QR Code deleted');
      setShowDeleteConfirm(null);
      fetchQRCodes(pagination.page);
    } catch (err) {
      toast.error('Failed to delete');
    }
  };

  const handleToggleActive = async (qr) => {
    try {
      await qrCodeAPI.update(qr._id, { isActive: !qr.isActive });
      toast.success(qr.isActive ? 'Deactivated' : 'Activated');
      fetchQRCodes(pagination.page);
    } catch (err) {
      toast.error('Failed to update');
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard!');
  };

  return (
    <div className="space-y-6 fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">QR Codes</h1>
          <p className="text-dark-400 mt-0.5 text-sm">{pagination.total} total QR codes</p>
        </div>
        <button
          id="create-qr-btn"
          onClick={() => setShowCreateModal(true)}
          className="btn-shine flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-primary-600 to-primary-500 hover:from-primary-500 hover:to-primary-400 text-white font-semibold rounded-xl transition-all duration-300 shadow-lg shadow-primary-500/20 hover:shadow-primary-500/30 hover:-translate-y-0.5 active:translate-y-0 text-sm"
        >
          <Plus className="w-4 h-4" />
          Create QR Code
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 group">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-[18px] h-[18px] text-dark-500 group-focus-within:text-primary-400 transition-colors" />
          <input
            id="search-qrcodes"
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by title, URL, or alias..."
            className="w-full pl-11 pr-4 py-2.5 bg-dark-800/40 border border-dark-600/50 rounded-xl text-white placeholder-dark-500 focus:outline-none focus:border-primary-500/60 focus:shadow-[0_0_0_3px_rgba(99,102,241,0.06)] transition-all text-sm"
          />
        </div>
        <div className="flex items-center gap-1 bg-dark-800/40 border border-dark-600/50 rounded-xl p-1">
          {[{ v: '', l: 'All' }, { v: 'active', l: 'Active' }, { v: 'inactive', l: 'Inactive' }, { v: 'expired', l: 'Expired' }].map(({ v, l }) => (
            <button
              key={v}
              onClick={() => setStatusFilter(v)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                statusFilter === v ? 'bg-primary-500/15 text-primary-400' : 'text-dark-400 hover:text-dark-200'
              }`}
            >
              {l}
            </button>
          ))}
        </div>
      </div>

      {/* QR Code List */}
      {loading ? (
        <div className="space-y-4 stagger">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="glass-card p-5 flex items-center gap-5 fade-in-up">
              <Skeleton h="h-[76px]" className="w-[76px] rounded-xl flex-shrink-0" />
              <div className="flex-1 space-y-2">
                <Skeleton h="h-5" className="w-48" />
                <Skeleton h="h-3.5" className="w-72" />
                <Skeleton h="h-3.5" className="w-56" />
              </div>
              <Skeleton h="h-12" className="w-16 rounded-xl" />
            </div>
          ))}
        </div>
      ) : qrCodes.length === 0 ? (
        <div className="glass-card p-16 text-center fade-in-up">
          <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-dark-800/60 flex items-center justify-center">
            <QrCode className="w-7 h-7 text-dark-500" />
          </div>
          <h3 className="text-lg font-bold text-white mb-1.5">No QR Codes Yet</h3>
          <p className="text-dark-400 text-sm mb-6 max-w-sm mx-auto">Create your first QR code to start tracking and managing your links</p>
          <button
            onClick={() => setShowCreateModal(true)}
            className="btn-shine inline-flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-primary-600 to-primary-500 text-white font-semibold rounded-xl shadow-lg shadow-primary-500/20 hover:-translate-y-0.5 transition-all text-sm"
          >
            <Plus className="w-4 h-4" />
            Create QR Code
          </button>
        </div>
      ) : (
        <div className="space-y-3 stagger">
          {qrCodes.map((qr) => (
            <QRCodeCard
              key={qr._id}
              qr={qr}
              onEdit={() => setEditingQR(qr)}
              onDelete={() => setShowDeleteConfirm(qr._id)}
              onToggle={() => handleToggleActive(qr)}
              onCopy={copyToClipboard}
              onViewAnalytics={() => navigate(`/dashboard/analytics?qr=${qr._id}`)}
            />
          ))}
        </div>
      )}

      {/* Pagination */}
      {pagination.pages > 1 && (
        <div className="flex items-center justify-center gap-2 pt-2">
          <button onClick={() => fetchQRCodes(pagination.page - 1)} disabled={pagination.page <= 1} className="p-2 rounded-lg bg-dark-800/50 text-dark-400 hover:text-white disabled:opacity-30 transition-colors"><ChevronLeft className="w-4 h-4" /></button>
          {[...Array(pagination.pages)].map((_, i) => (
            <button key={i} onClick={() => fetchQRCodes(i + 1)} className={`w-8 h-8 rounded-lg text-xs font-semibold transition-all ${pagination.page === i + 1 ? 'bg-primary-500/15 text-primary-400' : 'text-dark-400 hover:text-dark-200 hover:bg-dark-800/50'}`}>{i + 1}</button>
          ))}
          <button onClick={() => fetchQRCodes(pagination.page + 1)} disabled={pagination.page >= pagination.pages} className="p-2 rounded-lg bg-dark-800/50 text-dark-400 hover:text-white disabled:opacity-30 transition-colors"><ChevronRight className="w-4 h-4" /></button>
        </div>
      )}

      {/* Create/Edit Modal */}
      {(showCreateModal || editingQR) && (
        <QRCodeModal
          qr={editingQR}
          onClose={() => { setShowCreateModal(false); setEditingQR(null); }}
          onSuccess={() => { setShowCreateModal(false); setEditingQR(null); fetchQRCodes(pagination.page); }}
        />
      )}

      {/* Delete Confirmation */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-[2px] flex items-center justify-center z-50 p-4 modal-overlay" onClick={() => setShowDeleteConfirm(null)}>
          <div className="glass-card p-8 max-w-sm w-full text-center modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-danger-500/10 flex items-center justify-center">
              <Trash2 className="w-6 h-6 text-danger-400" />
            </div>
            <h3 className="text-lg font-bold text-white mb-1.5">Delete QR Code?</h3>
            <p className="text-dark-400 text-sm mb-6">This action cannot be undone. All analytics data will be permanently lost.</p>
            <div className="flex gap-3">
              <button onClick={() => setShowDeleteConfirm(null)} className="flex-1 px-4 py-2.5 bg-dark-700/50 text-dark-200 rounded-xl hover:bg-dark-600/50 transition-colors font-medium text-sm">Cancel</button>
              <button onClick={() => handleDelete(showDeleteConfirm)} className="flex-1 px-4 py-2.5 bg-danger-500 text-white rounded-xl hover:bg-danger-600 transition-colors font-medium text-sm">Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── QR Code Card ───
function QRCodeCard({ qr, onEdit, onDelete, onToggle, onCopy, onViewAnalytics }) {
  const [showActions, setShowActions] = useState(false);
  const isExpired = qr.isExpired || (qr.expiresAt && new Date() > new Date(qr.expiresAt));

  const statusConfig = !qr.isActive
    ? { color: 'bg-dark-600/30 text-dark-400', dot: 'bg-dark-500', label: 'Inactive' }
    : isExpired
    ? { color: 'bg-warning-500/10 text-warning-400', dot: 'bg-warning-400', label: 'Expired' }
    : { color: 'bg-accent-500/10 text-accent-400', dot: 'bg-accent-400', label: 'Active' };

  return (
    <div className="glass-card p-5 hover:border-primary-500/15 transition-all fade-in-up group">
      <div className="flex items-start gap-4">
        {/* QR Code Image */}
        <QRCodeThumbnail url={qr.shortUrl} size={64} title={qr.title} />

        {/* Info */}
        <div className="flex-1 min-w-0 py-0.5">
          <div className="flex items-center gap-2.5 mb-2">
            <h3 className="text-white font-bold text-[15px] truncate">{qr.title}</h3>
            <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] font-semibold ${statusConfig.color}`}>
              <span className={`pulse-dot ${statusConfig.dot}`} style={{ width: 6, height: 6 }} />
              {statusConfig.label}
            </span>
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-2 text-[13px]">
              <Link2 className="w-3.5 h-3.5 text-dark-500 flex-shrink-0" />
              <span className="text-dark-300 truncate">{qr.destinationUrl}</span>
            </div>
            <div className="flex items-center gap-2 text-[13px]">
              <ExternalLink className="w-3.5 h-3.5 text-primary-400 flex-shrink-0" />
              <span className="text-primary-400 truncate font-medium">{qr.shortUrl}</span>
              <button
                onClick={() => onCopy(qr.shortUrl)}
                className="p-0.5 hover:bg-dark-700 rounded text-dark-500 hover:text-white transition-colors tooltip-hover"
                data-tip="Copy link"
              >
                <Copy className="w-3 h-3" />
              </button>
            </div>
            {qr.customAlias && (
              <div className="flex items-center gap-2 text-[13px]">
                <Tag className="w-3.5 h-3.5 text-violet-400 flex-shrink-0" />
                <span className="text-violet-400 font-medium">/{qr.customAlias}</span>
              </div>
            )}
          </div>
        </div>

        {/* Scans + actions */}
        <div className="flex items-center gap-4 flex-shrink-0">
          <div className="text-center px-3">
            <p className="text-2xl font-extrabold text-white leading-tight">{qr.totalScans}</p>
            <p className="text-[10px] text-dark-500 uppercase tracking-wider font-medium">Scans</p>
          </div>

          <div className="flex items-center gap-0.5 border-l border-dark-700/30 pl-3">
            <button onClick={onViewAnalytics} className="p-2 rounded-lg text-dark-500 hover:text-cyan-400 hover:bg-dark-800/50 transition-all tooltip-hover" data-tip="Analytics">
              <Eye className="w-4 h-4" />
            </button>
            <button onClick={onEdit} className="p-2 rounded-lg text-dark-500 hover:text-primary-400 hover:bg-dark-800/50 transition-all tooltip-hover" data-tip="Edit">
              <Edit3 className="w-4 h-4" />
            </button>
            <div className="relative">
              <button onClick={() => setShowActions(!showActions)} className="p-2 rounded-lg text-dark-500 hover:text-white hover:bg-dark-800/50 transition-all">
                <MoreVertical className="w-4 h-4" />
              </button>
              {showActions && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setShowActions(false)} />
                  <div className="absolute right-0 top-full mt-1 w-48 bg-dark-800 border border-dark-600/60 rounded-xl shadow-2xl z-50 overflow-hidden py-1 scale-in">
                    <button onClick={() => { onToggle(); setShowActions(false); }} className="w-full flex items-center gap-2.5 px-4 py-2 text-xs text-dark-200 hover:bg-dark-700/60 transition-colors">
                      {qr.isActive ? <ShieldOff className="w-3.5 h-3.5" /> : <Shield className="w-3.5 h-3.5" />}
                      {qr.isActive ? 'Deactivate' : 'Activate'}
                    </button>
                    <hr className="border-dark-700/40 my-1" />
                    <button onClick={() => { onDelete(); setShowActions(false); }} className="w-full flex items-center gap-2.5 px-4 py-2 text-xs text-danger-400 hover:bg-dark-700/60 transition-colors">
                      <Trash2 className="w-3.5 h-3.5" /> Delete
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Create/Edit Modal ───
function QRCodeModal({ qr, onClose, onSuccess }) {
  const [formData, setFormData] = useState({
    title: qr?.title || '',
    destinationUrl: qr?.destinationUrl || '',
    customAlias: qr?.customAlias || '',
    expiresAt: qr?.expiresAt ? new Date(qr.expiresAt).toISOString().slice(0, 16) : '',
    tags: qr?.tags?.join(', ') || '',
    redirectRules: qr?.redirectRules || []
  });
  const [loading, setLoading] = useState(false);
  const [showRules, setShowRules] = useState((qr?.redirectRules?.length || 0) > 0);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = {
        title: formData.title,
        destinationUrl: formData.destinationUrl,
        customAlias: formData.customAlias || undefined,
        expiresAt: formData.expiresAt || undefined,
        tags: formData.tags ? formData.tags.split(',').map(t => t.trim()).filter(Boolean) : [],
        redirectRules: showRules ? formData.redirectRules : []
      };
      if (qr) {
        await qrCodeAPI.update(qr._id, payload);
        toast.success('QR Code updated!');
      } else {
        await qrCodeAPI.create(payload);
        toast.success('QR Code created!');
      }
      onSuccess();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Operation failed');
    } finally {
      setLoading(false);
    }
  };

  const addRedirectRule = () => {
    setFormData(prev => ({
      ...prev,
      redirectRules: [...prev.redirectRules, { condition: 'device', value: 'mobile', destinationUrl: '' }]
    }));
  };

  const updateRule = (index, field, value) => {
    setFormData(prev => ({
      ...prev,
      redirectRules: prev.redirectRules.map((r, i) => i === index ? { ...r, [field]: value } : r)
    }));
  };

  const removeRule = (index) => {
    setFormData(prev => ({
      ...prev,
      redirectRules: prev.redirectRules.filter((_, i) => i !== index)
    }));
  };

  const inputClass = "w-full px-4 py-2.5 bg-dark-800/40 border border-dark-600/50 rounded-xl text-white placeholder-dark-500 focus:outline-none focus:border-primary-500/60 focus:shadow-[0_0_0_3px_rgba(99,102,241,0.06)] transition-all text-sm";

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-[2px] flex items-start justify-center z-50 p-4 overflow-y-auto modal-overlay" onClick={onClose}>
      <div className="glass-card w-full max-w-lg my-8 modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="p-6 border-b border-dark-700/30 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-white">{qr ? 'Edit QR Code' : 'Create QR Code'}</h2>
            <p className="text-xs text-dark-500 mt-0.5">{qr ? 'Update your QR code settings' : 'Configure your new dynamic QR code'}</p>
          </div>
          <button onClick={onClose} className="p-2 text-dark-500 hover:text-white rounded-lg hover:bg-dark-700/50 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* QR Preview for existing codes */}
        {qr && qr.shortUrl && (
          <div className="px-6 pt-5 flex justify-center">
            <div className="flex flex-col items-center gap-2">
              <QRCodeThumbnail url={qr.shortUrl} size={100} title={qr.title} />
              <p className="text-[11px] text-dark-500">Click to enlarge & download</p>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-medium text-dark-300 mb-1.5 uppercase tracking-wider">Title *</label>
            <input id="qr-title" type="text" value={formData.title} onChange={(e) => setFormData(p => ({ ...p, title: e.target.value }))} className={inputClass} placeholder="e.g., Restaurant Menu" required />
          </div>

          <div>
            <label className="block text-xs font-medium text-dark-300 mb-1.5 uppercase tracking-wider">Destination URL *</label>
            <input id="qr-url" type="url" value={formData.destinationUrl} onChange={(e) => setFormData(p => ({ ...p, destinationUrl: e.target.value }))} className={inputClass} placeholder="https://example.com/menu" required />
          </div>

          <div>
            <label className="block text-xs font-medium text-dark-300 mb-1.5 uppercase tracking-wider">Custom Alias (optional)</label>
            <div className="flex">
              <span className="px-3 py-2.5 bg-dark-700/60 border border-r-0 border-dark-600/50 rounded-l-xl text-xs text-dark-400 flex items-center">/r/</span>
              <input id="qr-alias" type="text" value={formData.customAlias} onChange={(e) => setFormData(p => ({ ...p, customAlias: e.target.value }))} className={`${inputClass} rounded-l-none`} placeholder="restaurant-menu" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-dark-300 mb-1.5 uppercase tracking-wider">Expires</label>
              <input id="qr-expiry" type="datetime-local" value={formData.expiresAt} onChange={(e) => setFormData(p => ({ ...p, expiresAt: e.target.value }))} className={inputClass} />
            </div>
            <div>
              <label className="block text-xs font-medium text-dark-300 mb-1.5 uppercase tracking-wider">Tags</label>
              <input type="text" value={formData.tags} onChange={(e) => setFormData(p => ({ ...p, tags: e.target.value }))} className={inputClass} placeholder="food, menu" />
            </div>
          </div>

          {/* Redirect Rules */}
          <div className="border-t border-dark-700/30 pt-4">
            <div className="flex items-center justify-between mb-3">
              <label className="text-xs font-medium text-dark-300 uppercase tracking-wider">Multi-Destination Rules</label>
              <button type="button" onClick={() => setShowRules(!showRules)} className="text-[11px] text-primary-400 hover:text-primary-300 font-semibold">
                {showRules ? 'Hide' : 'Configure'}
              </button>
            </div>
            {showRules && (
              <div className="space-y-2.5">
                {formData.redirectRules.map((rule, i) => (
                  <div key={i} className="p-3 bg-dark-800/30 rounded-xl border border-dark-700/30 space-y-2">
                    <div className="flex items-center gap-2">
                      <select value={rule.condition} onChange={(e) => updateRule(i, 'condition', e.target.value)} className="px-2.5 py-1.5 bg-dark-700/60 border border-dark-600/40 rounded-lg text-[11px] text-dark-200">
                        <option value="device">Device</option>
                        <option value="time">Time Range</option>
                      </select>
                      <input type="text" value={rule.value} onChange={(e) => updateRule(i, 'value', e.target.value)} placeholder={rule.condition === 'device' ? 'mobile' : '9-17'} className="flex-1 px-2.5 py-1.5 bg-dark-700/60 border border-dark-600/40 rounded-lg text-[11px] text-white placeholder-dark-500" />
                      <button type="button" onClick={() => removeRule(i)} className="p-1 text-danger-400 hover:bg-dark-700/50 rounded transition-colors">
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <input type="url" value={rule.destinationUrl} onChange={(e) => updateRule(i, 'destinationUrl', e.target.value)} placeholder="https://mobile-url.com" className="w-full px-2.5 py-1.5 bg-dark-700/60 border border-dark-600/40 rounded-lg text-[11px] text-white placeholder-dark-500" />
                  </div>
                ))}
                <button type="button" onClick={addRedirectRule} className="w-full py-2 border border-dashed border-dark-600/50 rounded-xl text-xs text-dark-400 hover:text-primary-400 hover:border-primary-500/30 transition-colors">
                  + Add Rule
                </button>
              </div>
            )}
          </div>

          {/* Submit */}
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="flex-1 px-4 py-2.5 bg-dark-700/40 text-dark-300 rounded-xl hover:bg-dark-600/40 transition-colors font-medium text-sm">Cancel</button>
            <button
              id="qr-submit" type="submit" disabled={loading}
              className="btn-shine flex-1 px-4 py-2.5 bg-gradient-to-r from-primary-600 to-primary-500 text-white rounded-xl hover:from-primary-500 hover:to-primary-400 transition-all font-semibold disabled:opacity-50 flex items-center justify-center gap-2 text-sm shadow-lg shadow-primary-500/15"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <Check className="w-4 h-4" />
                  {qr ? 'Update' : 'Create'}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
