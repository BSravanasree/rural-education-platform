import React, { useState } from 'react';
import axiosClient from '../api/axiosClient';
import { UploadCloud, CheckCircle, AlertCircle, FileText } from 'lucide-react';

const FileUploader = ({ onUploadSuccess, folder = 'materials', allowedTypes = '.pdf,.png,.jpg,.jpeg,.mp4' }) => {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const handleFileChange = (e) => {
    setError('');
    setSuccessMsg('');
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;

    // Frontend validation: File size check (max 50MB)
    if (selectedFile.size > 50 * 1024 * 1024) {
      setError('File exceeds maximum 50MB limit.');
      return;
    }

    setFile(selectedFile);
  };

  const handleUpload = async () => {
    if (!file) {
      setError('Please select a file first.');
      return;
    }

    setUploading(true);
    setError('');
    const formData = new FormData();
    formData.append('file', file);
    formData.append('folder', folder);

    try {
      const res = await axiosClient.post('/files/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setSuccessMsg('File uploaded successfully!');
      if (onUploadSuccess) onUploadSuccess(res.data.fileUrl);
    } catch (err) {
      setError(err.response?.data?.message || 'File upload failed!');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="file-uploader-box">
      <div className="uploader-input-group">
        <input 
          type="file" 
          accept={allowedTypes} 
          onChange={handleFileChange}
          id="file-input"
          className="file-input-hidden"
        />
        <label htmlFor="file-input" className="file-input-label">
          <UploadCloud size={20} />
          <span>{file ? file.name : 'Choose File (PDF, Image, Video)'}</span>
        </label>
        
        <button 
          type="button" 
          onClick={handleUpload} 
          disabled={!file || uploading} 
          className="upload-btn"
        >
          {uploading ? 'Uploading...' : 'Upload'}
        </button>
      </div>

      {error && (
        <div className="uploader-alert error">
          <AlertCircle size={14} /> {error}
        </div>
      )}

      {successMsg && (
        <div className="uploader-alert success">
          <CheckCircle size={14} /> {successMsg}
        </div>
      )}
    </div>
  );
};

export default FileUploader;
