'use client';

import { useState, useCallback } from 'react';
import { Upload, X, AlertCircle, CheckCircle2 } from 'lucide-react';

interface UploadedFile {
  id: string;
  filename: string;
  url: string;
  mimeType: string;
  size: number;
}

interface MediaUploaderProps {
  onUploadComplete?: (files: UploadedFile[]) => void;
  maxFiles?: number;
  accept?: string;
  className?: string;
}

interface FileWithProgress {
  file: File;
  progress: number;
  status: 'pending' | 'uploading' | 'success' | 'error';
  error?: string;
  result?: UploadedFile;
}

export default function MediaUploader({
  onUploadComplete,
  maxFiles = 10,
  accept = 'image/*,video/*,application/pdf',
  className = '',
}: MediaUploaderProps) {
  const [files, setFiles] = useState<FileWithProgress[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const droppedFiles = Array.from(e.dataTransfer.files);
    addFiles(droppedFiles);
  }, []);

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files);
      addFiles(selectedFiles);
    }
  }, []);

  const addFiles = (newFiles: File[]) => {
    const filesToAdd = newFiles.slice(0, maxFiles - files.length);
    
    setFiles(prev => [
      ...prev,
      ...filesToAdd.map(file => ({
        file,
        progress: 0,
        status: 'pending' as const,
      })),
    ]);
  };

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  const uploadFiles = async () => {
    const pendingFiles = files.filter(f => f.status === 'pending');
    if (pendingFiles.length === 0) return;

    setIsUploading(true);

    const formData = new FormData();
    pendingFiles.forEach(({ file }) => {
      formData.append('files', file);
    });

    // Mark all as uploading
    setFiles(prev =>
      prev.map(f =>
        f.status === 'pending' ? { ...f, status: 'uploading' as const, progress: 10 } : f
      )
    );

    try {
      const response = await fetch('/api/media', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Upload failed');
      }

      const { media } = await response.json();

      // Update file statuses
      setFiles(prev =>
        prev.map((f, index) => {
          if (f.status === 'uploading') {
            const uploadedFile = media[index - (prev.length - pendingFiles.length)];
            return uploadedFile
              ? { ...f, status: 'success' as const, progress: 100, result: uploadedFile }
              : { ...f, status: 'error' as const, error: 'Upload failed' };
          }
          return f;
        })
      );

      if (onUploadComplete) {
        onUploadComplete(media);
      }
    } catch (error) {
      setFiles(prev =>
        prev.map(f =>
          f.status === 'uploading'
            ? { ...f, status: 'error' as const, error: (error as Error).message }
            : f
        )
      );
    } finally {
      setIsUploading(false);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const clearCompleted = () => {
    setFiles(prev => prev.filter(f => f.status !== 'success'));
  };

  return (
    <div className={className}>
      {/* Drop Zone */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-colors ${
          isDragging
            ? 'border-black bg-gray-50'
            : 'border-gray-300 hover:border-gray-400'
        }`}
      >
        <input
          type="file"
          multiple
          accept={accept}
          onChange={handleFileSelect}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />
        <Upload className="w-10 h-10 mx-auto mb-3 text-gray-500" />
        <p className="text-gray-700 font-medium">
          Glissez-déposez vos fichiers ici
        </p>
        <p className="text-sm text-gray-600 mt-1">
          ou cliquez pour sélectionner
        </p>
        <p className="text-xs text-gray-500 mt-2">
          Images, vidéos, PDF • Max 50MB par fichier
        </p>
      </div>

      {/* File List */}
      {files.length > 0 && (
        <div className="mt-4 space-y-2">
          {files.map((fileData, index) => (
            <div
              key={index}
              className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg"
            >
              {/* Preview */}
              <div className="w-12 h-12 bg-gray-200 rounded flex-shrink-0 overflow-hidden">
                {fileData.file.type.startsWith('image/') ? (
                  <img
                    src={URL.createObjectURL(fileData.file)}
                    alt=""
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-500 text-xs">
                    {fileData.file.type.split('/')[1]?.toUpperCase() || 'FILE'}
                  </div>
                )}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {fileData.file.name}
                </p>
                <p className="text-xs text-gray-600">
                  {formatFileSize(fileData.file.size)}
                </p>
                
                {/* Progress bar */}
                {fileData.status === 'uploading' && (
                  <div className="mt-1 h-1 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-black transition-all duration-300"
                      style={{ width: `${fileData.progress}%` }}
                    />
                  </div>
                )}
                
                {/* Error message */}
                {fileData.status === 'error' && (
                  <p className="text-xs text-red-500 mt-1">{fileData.error}</p>
                )}
              </div>

              {/* Status / Actions */}
              <div className="flex-shrink-0">
                {fileData.status === 'pending' && (
                  <button
                    onClick={() => removeFile(index)}
                    className="p-1 hover:bg-gray-200 rounded transition-colors"
                  >
                    <X className="w-4 h-4 text-gray-600" />
                  </button>
                )}
                {fileData.status === 'uploading' && (
                  <div className="w-5 h-5 border-2 border-gray-300 border-t-black rounded-full animate-spin" />
                )}
                {fileData.status === 'success' && (
                  <CheckCircle2 className="w-5 h-5 text-green-500" />
                )}
                {fileData.status === 'error' && (
                  <AlertCircle className="w-5 h-5 text-red-500" />
                )}
              </div>
            </div>
          ))}

          {/* Actions */}
          <div className="flex items-center justify-between pt-2">
            <button
              onClick={clearCompleted}
              className="text-sm text-gray-600 hover:text-gray-800"
            >
              Effacer les fichiers terminés
            </button>
            
            {files.some(f => f.status === 'pending') && (
              <button
                onClick={uploadFiles}
                disabled={isUploading}
                className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium"
              >
                {isUploading ? 'Envoi en cours...' : 'Envoyer les fichiers'}
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
