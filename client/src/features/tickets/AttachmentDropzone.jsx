import { useState, useRef } from 'react';

/**
 * UI-only drag-and-drop file attachment area.
 * Stores and manages file names without uploading binary payloads.
 *
 * @param {Object} props
 * @param {string[]} props.attachments List of file names
 * @param {Function} props.onChange Callback with updated file names array
 */
export function AttachmentDropzone({ attachments = [], onChange }) {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);

  const handleFiles = (files) => {
    if (!files || files.length === 0) return;
    const newNames = Array.from(files).map((f) => f.name);
    // Deduplicate against existing file names
    const merged = Array.from(new Set([...attachments, ...newNames]));
    onChange(merged);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    handleFiles(e.dataTransfer.files);
  };

  const handleRemove = (index) => {
    const updated = attachments.filter((_, i) => i !== index);
    onChange(updated);
  };

  return (
    <div className="w-full space-y-2">
      <label className="block text-xs font-semibold text-charcoal-light uppercase tracking-wider mb-1">
        Attachments (Optional)
      </label>

      {/* Drop area */}
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`border-2 border-dashed rounded-2xl p-5 text-center cursor-pointer transition-colors duration-150 ${
          isDragging
            ? 'border-terracotta bg-terracotta-light/30'
            : 'border-card-border bg-cream-light/60 hover:border-terracotta/50'
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          className="hidden"
          onChange={(e) => handleFiles(e.target.files)}
        />
        <svg
          className="w-7 h-7 mx-auto text-charcoal-muted mb-1.5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.5"
            d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
          />
        </svg>
        <p className="text-xs font-medium text-charcoal">
          Drag and drop files here, or <span className="text-terracotta underline">browse</span>
        </p>
        <p className="text-[11px] text-charcoal-muted mt-0.5">
          Attach receipts, proof documents, or screenshots (file names stored)
        </p>
      </div>

      {/* Selected file names pills */}
      {attachments.length > 0 && (
        <div className="flex flex-wrap gap-2 pt-1">
          {attachments.map((name, idx) => (
            <span
              key={`${name}-${idx}`}
              className="inline-flex items-center gap-1.5 px-3 py-1 bg-card border border-card-border rounded-pill text-xs text-charcoal"
            >
              <span className="truncate max-w-[200px]">{name}</span>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleRemove(idx);
                }}
                className="text-charcoal-muted hover:text-terracotta font-bold leading-none p-0.5"
                title="Remove attachment"
              >
                ×
              </button>
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

export default AttachmentDropzone;
