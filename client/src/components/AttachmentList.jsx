import { useState } from "react";
import { Download, Eye, FileText, Minus, Plus, RotateCcw, Trash2, X } from "lucide-react";
import { API_ORIGIN } from "../services/api";
import Button from "./Button";

function fileUrl(file) {
  if (!file?.path) return "";
  if (/^https?:\/\//.test(file.path)) return file.path;
  return `${API_ORIGIN}${file.path}`;
}

function previewUrl(file) {
  if (!file?.previewPath) return fileUrl(file);
  if (/^https?:\/\//.test(file.previewPath)) return file.previewPath;
  return `${API_ORIGIN}${file.previewPath}`;
}

function formatBytes(size = 0) {
  if (!size) return "未知大小";
  if (size < 1024) return `${size} B`;
  if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)} KB`;
  return `${(size / 1024 / 1024).toFixed(1)} MB`;
}

function canPreview(file) {
  return Boolean(file?.previewPath) || file?.type?.startsWith("image/") || file?.type === "application/pdf" || file?.type === "text/plain";
}

function typeLabel(file) {
  if (!file?.type) return "附件";
  if (file.type.startsWith("image/")) return "图片";
  if (file.type === "application/pdf") return "PDF";
  if (file.type.includes("presentation")) return "PPT";
  if (file.type.includes("word")) return "Word";
  if (file.type === "text/plain") return "文本";
  return "附件";
}

export default function AttachmentList({ files = [], editable = false, onRemove }) {
  const [preview, setPreview] = useState(null);
  const [imageZoom, setImageZoom] = useState(1);

  function openPreview(file) {
    setPreview(file);
    setImageZoom(1);
  }

  function closePreview() {
    setPreview(null);
    setImageZoom(1);
  }

  function changeZoom(delta) {
    setImageZoom((value) => Math.min(3, Math.max(0.5, Number((value + delta).toFixed(1)))));
  }

  if (!files.length) return <div className="empty compact-empty">暂无附件</div>;

  return (
    <>
      <div className="attachment-list">
        {files.map((file, index) => (
          <div className="attachment-card" key={file.fileName || `${file.originalName}-${index}`}>
            <div className="attachment-icon"><FileText size={20} /></div>
            <div className="attachment-info">
              <strong title={file.originalName}>{file.originalName || file.fileName}</strong>
              <span>{typeLabel(file)} · {formatBytes(file.size)}</span>
            </div>
            <div className="attachment-actions">
              {canPreview(file) && (
                <Button type="button" variant="ghost" className="icon-only" onClick={() => openPreview(file)} title="预览附件">
                  <Eye size={16} />
                </Button>
              )}
              <Button as="a" variant="ghost" className="icon-only" href={fileUrl(file)} target="_blank" rel="noreferrer" title="打开或下载">
                <Download size={16} />
              </Button>
              {editable && (
                <Button type="button" variant="ghost" className="icon-only danger-text" onClick={() => onRemove?.(index)} title="移除附件">
                  <Trash2 size={16} />
                </Button>
              )}
            </div>
          </div>
        ))}
      </div>

      {preview && (
        <div className="preview-backdrop" role="dialog" aria-modal="true">
          <div className="preview-modal">
            <div className="preview-header">
              <div>
                <strong>{preview.originalName || preview.fileName}</strong>
                <span>{typeLabel(preview)} · {formatBytes(preview.size)}</span>
              </div>
              <div className="preview-actions">
                {preview.type?.startsWith("image/") && !preview.previewPath && (
                  <div className="image-zoom-controls" aria-label="图片缩放">
                    <Button type="button" variant="ghost" className="icon-only" onClick={() => changeZoom(-0.1)} title="缩小图片" disabled={imageZoom <= 0.5}>
                      <Minus size={16} />
                    </Button>
                    <span>{Math.round(imageZoom * 100)}%</span>
                    <Button type="button" variant="ghost" className="icon-only" onClick={() => changeZoom(0.1)} title="放大图片" disabled={imageZoom >= 3}>
                      <Plus size={16} />
                    </Button>
                    <Button type="button" variant="ghost" className="icon-only" onClick={() => setImageZoom(1)} title="重置缩放">
                      <RotateCcw size={16} />
                    </Button>
                  </div>
                )}
                <Button type="button" variant="ghost" className="icon-only" onClick={closePreview} title="关闭预览">
                  <X size={18} />
                </Button>
              </div>
            </div>
            <div className={`preview-body ${preview.type?.startsWith("image/") && !preview.previewPath ? "preview-body-image" : ""}`}>
              {preview.type?.startsWith("image/") && !preview.previewPath ? (
                <img
                  src={previewUrl(preview)}
                  alt={preview.originalName || "附件预览"}
                  style={{ width: `${imageZoom * 100}%` }}
                />
              ) : (
                <iframe title={preview.originalName || "附件预览"} src={previewUrl(preview)} />
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
