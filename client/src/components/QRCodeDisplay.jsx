import { useState, useRef, useCallback } from 'react';
import { QRCodeSVG, QRCodeCanvas } from 'qrcode.react';
import { Download, X, Maximize2, Copy, Check, Image, FileCode } from 'lucide-react';
import toast from 'react-hot-toast';

/**
 * Inline QR code thumbnail — click to open full preview modal
 */
export function QRCodeThumbnail({ url, size = 64, title = '' }) {
  const [showPreview, setShowPreview] = useState(false);

  return (
    <>
      <button
        onClick={() => setShowPreview(true)}
        className="relative group flex-shrink-0 rounded-xl overflow-hidden border border-dark-600/40 hover:border-primary-500/30 transition-all duration-300 bg-white p-2 hover:shadow-lg hover:shadow-primary-500/8"
        title="Click to enlarge"
        style={{ width: size + 16, height: size + 16 }}
      >
        <QRCodeSVG value={url} size={size} level="M" bgColor="#ffffff" fgColor="#0f172a" />
        <div className="absolute inset-0 bg-dark-950/0 group-hover:bg-dark-950/25 transition-all duration-300 flex items-center justify-center rounded-xl">
          <div className="opacity-0 group-hover:opacity-100 transition-all duration-300 bg-dark-900/80 p-1.5 rounded-lg backdrop-blur-sm">
            <Maximize2 className="w-3.5 h-3.5 text-white" />
          </div>
        </div>
      </button>

      {showPreview && (
        <QRCodePreviewModal url={url} title={title} onClose={() => setShowPreview(false)} />
      )}
    </>
  );
}

/**
 * Full-screen QR code preview modal with download options
 */
export function QRCodePreviewModal({ url, title, onClose }) {
  const canvasRef = useRef(null);
  const [copied, setCopied] = useState(false);

  const handleDownloadPNG = useCallback(() => {
    const canvas = canvasRef.current?.querySelector('canvas');
    if (!canvas) return;
    const link = document.createElement('a');
    link.download = `qr-${title || 'code'}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
    toast.success('PNG downloaded!');
  }, [title]);

  const handleDownloadSVG = useCallback(() => {
    const svgEl = document.getElementById('qr-preview-svg');
    if (!svgEl) return;
    const svgData = new XMLSerializer().serializeToString(svgEl);
    const blob = new Blob([svgData], { type: 'image/svg+xml' });
    const link = document.createElement('a');
    link.download = `qr-${title || 'code'}.svg`;
    link.href = URL.createObjectURL(blob);
    link.click();
    URL.revokeObjectURL(link.href);
    toast.success('SVG downloaded!');
  }, [title]);

  const handleCopyLink = useCallback(() => {
    navigator.clipboard.writeText(url);
    setCopied(true);
    toast.success('Link copied!');
    setTimeout(() => setCopied(false), 2000);
  }, [url]);

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4 modal-overlay" onClick={onClose}>
      <div className="glass-card max-w-md w-full modal-content" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-dark-700/30">
          <div className="min-w-0">
            <h3 className="text-base font-bold text-white truncate">{title || 'QR Code'}</h3>
            <p className="text-[11px] text-dark-500 mt-0.5 truncate font-mono">{url}</p>
          </div>
          <button onClick={onClose} className="p-2 text-dark-500 hover:text-white rounded-lg hover:bg-dark-700/50 transition-colors flex-shrink-0">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* QR Code Display */}
        <div className="p-8 flex flex-col items-center">
          <div className="bg-white rounded-2xl p-6 shadow-2xl shadow-primary-500/8 ring-1 ring-dark-600/10">
            <QRCodeSVG id="qr-preview-svg" value={url} size={220} level="H" bgColor="#ffffff" fgColor="#0f172a" includeMargin={false} />
          </div>
          {/* Hidden canvas for PNG export */}
          <div ref={canvasRef} className="hidden">
            <QRCodeCanvas value={url} size={800} level="H" bgColor="#ffffff" fgColor="#0f172a" includeMargin={true} />
          </div>
        </div>

        {/* Actions */}
        <div className="p-5 border-t border-dark-700/30 space-y-3">
          <button
            onClick={handleCopyLink}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-dark-800/50 border border-dark-600/40 rounded-xl text-sm text-dark-200 hover:bg-dark-700/50 hover:text-white transition-all"
          >
            {copied ? <Check className="w-4 h-4 text-accent-400" /> : <Copy className="w-4 h-4" />}
            {copied ? 'Copied!' : 'Copy Short Link'}
          </button>

          <div className="flex gap-3">
            <button
              onClick={handleDownloadPNG}
              className="btn-shine flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-primary-600 to-primary-500 hover:from-primary-500 hover:to-primary-400 text-white font-semibold rounded-xl transition-all text-sm shadow-lg shadow-primary-500/15"
            >
              <Image className="w-4 h-4" />
              PNG
            </button>
            <button
              onClick={handleDownloadSVG}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-dark-700/50 hover:bg-dark-600/50 text-dark-200 font-semibold rounded-xl transition-all text-sm"
            >
              <FileCode className="w-4 h-4" />
              SVG
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default QRCodeThumbnail;
