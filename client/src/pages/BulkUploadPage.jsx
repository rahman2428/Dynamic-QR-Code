import { useState, useRef } from 'react';
import { qrCodeAPI } from '../services/api';
import { Upload, FileText, CheckCircle, AlertCircle, Download, X } from 'lucide-react';
import toast from 'react-hot-toast';

export default function BulkUploadPage() {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [dragOver, setDragOver] = useState(false);
  const fileRef = useRef(null);

  const handleFileDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile && (droppedFile.type === 'text/csv' || droppedFile.name.endsWith('.csv'))) {
      setFile(droppedFile);
      setResult(null);
    } else {
      toast.error('Only CSV files are accepted');
    }
  };

  const handleFileSelect = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setResult(null);
    }
  };

  const handleUpload = async () => {
    if (!file) return;
    setLoading(true);
    try {
      const { data } = await qrCodeAPI.bulkUpload(file);
      setResult(data);
      toast.success(`${data.created} QR codes created!`);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Upload failed');
    } finally {
      setLoading(false);
    }
  };

  const downloadTemplate = () => {
    const csv = 'title,destinationUrl,customAlias,expiresAt,tags\nExample Menu,https://example.com/menu,my-menu,,restaurant;food\nExample Event,https://example.com/event,my-event,2026-12-31T23:59,event;marketing';
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'qr-codes-template.csv';
    a.click();
    URL.revokeObjectURL(url);
    toast.success('Template downloaded!');
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 fade-in">
      <div>
        <h1 className="text-2xl font-bold text-white">Bulk QR Code Upload</h1>
        <p className="text-dark-400 mt-1">Upload a CSV file to create multiple QR codes at once</p>
      </div>

      {/* Template download */}
      <div className="glass-card p-5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <FileText className="w-5 h-5 text-primary-400" />
          <div>
            <p className="text-sm font-medium text-white">CSV Template</p>
            <p className="text-xs text-dark-400">Download the template to see the required format</p>
          </div>
        </div>
        <button
          onClick={downloadTemplate}
          className="flex items-center gap-2 px-4 py-2 bg-dark-700 text-dark-200 rounded-xl hover:bg-dark-600 transition-colors text-sm font-medium"
        >
          <Download className="w-4 h-4" />
          Download
        </button>
      </div>

      {/* Drop Zone */}
      <div
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleFileDrop}
        onClick={() => fileRef.current?.click()}
        className={`
          glass-card p-12 text-center cursor-pointer transition-all duration-300
          ${dragOver ? 'border-primary-500 bg-primary-500/5' : 'hover:border-dark-500'}
          ${file ? 'border-accent-500/30' : ''}
        `}
      >
        <input
          ref={fileRef}
          type="file"
          accept=".csv"
          onChange={handleFileSelect}
          className="hidden"
        />
        
        {file ? (
          <div>
            <CheckCircle className="w-12 h-12 text-accent-400 mx-auto mb-3" />
            <p className="text-white font-medium">{file.name}</p>
            <p className="text-dark-400 text-sm mt-1">{(file.size / 1024).toFixed(1)} KB</p>
            <button
              onClick={(e) => { e.stopPropagation(); setFile(null); setResult(null); }}
              className="mt-3 text-sm text-danger-400 hover:text-danger-300"
            >
              Remove file
            </button>
          </div>
        ) : (
          <div>
            <Upload className={`w-12 h-12 mx-auto mb-3 ${dragOver ? 'text-primary-400' : 'text-dark-500'}`} />
            <p className="text-white font-medium">Drop your CSV file here</p>
            <p className="text-dark-400 text-sm mt-1">or click to browse</p>
          </div>
        )}
      </div>

      {/* Upload Button */}
      {file && !result && (
        <button
          onClick={handleUpload}
          disabled={loading}
          className="w-full py-3 px-6 bg-gradient-to-r from-primary-600 to-primary-500 hover:from-primary-500 hover:to-primary-400 text-white font-semibold rounded-xl transition-all duration-300 shadow-lg shadow-primary-500/20 disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Processing...
            </>
          ) : (
            <>
              <Upload className="w-5 h-5" />
              Upload & Create QR Codes
            </>
          )}
        </button>
      )}

      {/* Results */}
      {result && (
        <div className="glass-card p-6 space-y-4">
          <div className="flex items-center gap-3">
            <CheckCircle className="w-6 h-6 text-accent-400" />
            <h3 className="text-lg font-semibold text-white">Upload Complete</h3>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-accent-500/10 rounded-xl text-center">
              <p className="text-2xl font-bold text-accent-400">{result.created}</p>
              <p className="text-sm text-dark-300">Created</p>
            </div>
            <div className="p-4 bg-danger-500/10 rounded-xl text-center">
              <p className="text-2xl font-bold text-danger-400">{result.errors?.length || 0}</p>
              <p className="text-sm text-dark-300">Errors</p>
            </div>
          </div>

          {result.errors?.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-sm font-medium text-dark-300">Error Details:</h4>
              {result.errors.map((err, i) => (
                <div key={i} className="flex items-start gap-2 p-3 bg-danger-500/5 rounded-lg border border-danger-500/10">
                  <AlertCircle className="w-4 h-4 text-danger-400 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-dark-300">
                    <span className="text-white font-medium">Row {err.row}:</span> {err.message}
                  </p>
                </div>
              ))}
            </div>
          )}

          <button
            onClick={() => { setFile(null); setResult(null); }}
            className="w-full py-2.5 bg-dark-700 text-dark-200 rounded-xl hover:bg-dark-600 transition-colors font-medium"
          >
            Upload Another File
          </button>
        </div>
      )}

      {/* Format Instructions */}
      <div className="glass-card p-6">
        <h3 className="text-base font-semibold text-white mb-3">CSV Format Guide</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-dark-700/50">
                <th className="text-left py-2 px-3 text-dark-400">Column</th>
                <th className="text-left py-2 px-3 text-dark-400">Required</th>
                <th className="text-left py-2 px-3 text-dark-400">Description</th>
              </tr>
            </thead>
            <tbody className="text-dark-300">
              <tr className="border-b border-dark-800/50">
                <td className="py-2 px-3 text-primary-400 font-mono text-xs">title</td>
                <td className="py-2 px-3"><span className="text-accent-400">Yes</span></td>
                <td className="py-2 px-3">Name of the QR code</td>
              </tr>
              <tr className="border-b border-dark-800/50">
                <td className="py-2 px-3 text-primary-400 font-mono text-xs">destinationUrl</td>
                <td className="py-2 px-3"><span className="text-accent-400">Yes</span></td>
                <td className="py-2 px-3">Target URL for redirect</td>
              </tr>
              <tr className="border-b border-dark-800/50">
                <td className="py-2 px-3 text-primary-400 font-mono text-xs">customAlias</td>
                <td className="py-2 px-3"><span className="text-dark-500">No</span></td>
                <td className="py-2 px-3">Custom short link alias</td>
              </tr>
              <tr className="border-b border-dark-800/50">
                <td className="py-2 px-3 text-primary-400 font-mono text-xs">expiresAt</td>
                <td className="py-2 px-3"><span className="text-dark-500">No</span></td>
                <td className="py-2 px-3">ISO date (e.g., 2026-12-31T23:59)</td>
              </tr>
              <tr>
                <td className="py-2 px-3 text-primary-400 font-mono text-xs">tags</td>
                <td className="py-2 px-3"><span className="text-dark-500">No</span></td>
                <td className="py-2 px-3">Semicolon-separated tags</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
