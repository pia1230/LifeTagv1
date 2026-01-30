import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import apiClient from '../api';
import './PageWrapper.css';

const MyRecordsPage = () => {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [viewingRecord, setViewingRecord] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchRecords();
  }, []);

  const fetchRecords = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get('/records/patient');
      setRecords(response.data || []);
      setError(null);
    } catch (err) {
      console.error('Error fetching records:', err);
      setError('Failed to load medical records');
    } finally {
      setLoading(false);
    }
  };

  const viewRecord = async (recordId, fileName) => {
    try {
      const response = await apiClient.get(`/records/view/${recordId}`, {
        responseType: 'blob'
      });
      
      const contentType = response.headers['content-type'] || 'application/octet-stream';
      const blob = new Blob([response.data], { type: contentType });
      const url = window.URL.createObjectURL(blob);
      
      setViewingRecord({ url, fileName, contentType });
    } catch (err) {
      console.error('Error viewing record:', err);
      alert('Failed to open record');
    }
  };

  const closeViewer = () => {
    if (viewingRecord?.url) {
      window.URL.revokeObjectURL(viewingRecord.url);
    }
    setViewingRecord(null);
  };

  if (viewingRecord) {
    return (
      <div className="page-wrapper" style={{ padding: 0 }}>
        <div style={{ 
          position: 'fixed', 
          top: 0, 
          left: 0, 
          right: 0, 
          bottom: 0, 
          background: '#000', 
          zIndex: 1000,
          display: 'flex',
          flexDirection: 'column'
        }}>
          <div style={{
            background: '#333',
            padding: '1rem',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            color: 'white'
          }}>
            <h3 style={{ margin: 0 }}>📄 {viewingRecord.fileName}</h3>
            <button 
              onClick={closeViewer}
              style={{
                background: '#ff4444',
                color: 'white',
                border: 'none',
                padding: '0.5rem 1rem',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              ✕ Close
            </button>
          </div>
          <div style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            {viewingRecord.contentType.startsWith('image/') ? (
              <img 
                src={viewingRecord.url} 
                alt={viewingRecord.fileName}
                style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }}
              />
            ) : viewingRecord.contentType === 'application/pdf' ? (
              <iframe 
                src={viewingRecord.url} 
                style={{ width: '100%', height: '100%', border: 'none' }}
                title={viewingRecord.fileName}
              />
            ) : (
              <div style={{ color: 'white', textAlign: 'center' }}>
                <p>Cannot preview this file type</p>
                <a 
                  href={viewingRecord.url} 
                  download={viewingRecord.fileName}
                  style={{ color: '#4CAF50' }}
                >
                  Download File
                </a>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="page-wrapper">
        <div className="glass-card">
          <p>Loading your medical records...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="page-wrapper">
        <div className="glass-card">
          <p className="error-message">{error}</p>
          <button onClick={fetchRecords} className="primary-button glossy-btn">
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="page-wrapper">
      <div className="glass-card">
        <h3 style={{ textAlign: 'center', marginTop: 0 }}>📋 My Medical Records</h3>
        
        {records.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '2rem' }}>
            <p>No medical records found.</p>
            <p style={{ color: '#666', fontSize: '0.9rem' }}>
              Records uploaded by doctors will appear here.
            </p>
          </div>
        ) : (
          <div style={{ maxHeight: '70vh', overflowY: 'auto' }}>
            {records.map((record) => (
              <div 
                key={record.id} 
                style={{
                  border: '1px solid #e0e0e0',
                  borderRadius: '8px',
                  padding: '1rem',
                  marginBottom: '1rem',
                  background: '#fafafa'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div style={{ flex: 1 }}>
                    <h4 style={{ margin: '0 0 0.5rem 0', color: '#333' }}>
                      📄 {record.fileName}
                    </h4>
                    
                    {record.recordType && (
                      <p style={{ margin: '0.25rem 0', color: '#666' }}>
                        <strong>Type:</strong> {record.recordType}
                      </p>
                    )}
                    
                    {record.doctor && (
                      <p style={{ margin: '0.25rem 0', color: '#666' }}>
                        <strong>Uploaded by:</strong> Dr. {record.doctor.fullName}
                      </p>
                    )}
                    
                    <p style={{ margin: '0.25rem 0', color: '#666', fontSize: '0.9rem' }}>
                      <strong>Date:</strong> {new Date(record.createdAt).toLocaleDateString()}
                    </p>
                    
                    <p style={{ margin: '0.25rem 0', color: '#666', fontSize: '0.9rem' }}>
                      <strong>Storage:</strong> {record.s3Key ? '☁️ Cloud' : '💾 Local'}
                    </p>
                  </div>
                  
                  <button
                    onClick={() => viewRecord(record.id, record.fileName)}
                    className="primary-button glossy-btn"
                    style={{ marginLeft: '1rem' }}
                  >
                    👁️ View
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyRecordsPage;