import React, { useState, useEffect } from 'react';
import apiClient from '../api';
import DoctorProfileView from '../components/DoctorProfileView';
import './PageWrapper.css';
import '../components/PatientRequests.css';

const FindDoctorsPage = () => {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedDoctorId, setSelectedDoctorId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        setLoading(true);
        const response = await apiClient.get('/admin/users?role=doctor');
        // Only show verified doctors to patients
        const verifiedDoctors = response.data.users.filter(doctor => doctor.regVerified && !doctor.isBlocked);
        setDoctors(verifiedDoctors);
      } catch (err) {
        console.error('Error fetching doctors:', err);
        setError('Failed to load doctors');
      } finally {
        setLoading(false);
      }
    };

    fetchDoctors();
  }, []);

  const filteredDoctors = doctors.filter(doctor => 
    doctor.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    doctor.specialization.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (doctor.hospital && doctor.hospital.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (doctor.department && doctor.department.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  if (loading) {
    return (
      <div className="page-wrapper">
        <div className="glass-card" style={{ padding: '2rem', textAlign: 'center' }}>
          <p>Loading doctors...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="page-wrapper">
        <div className="glass-card" style={{ padding: '2rem', textAlign: 'center' }}>
          <p style={{ color: 'red' }}>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="page-wrapper">
      <div className="glass-card" style={{ marginBottom: '1rem' }}>
        <h3 style={{ margin: '0 0 1rem 0', color: '#111' }}>👨⚕️ Find Doctors ({filteredDoctors.length} available)</h3>
        
        <input
          type="text"
          placeholder="Search by name, specialization, hospital, or department..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{
            width: '100%',
            padding: '0.75rem',
            borderRadius: '8px',
            border: '1px solid #ddd',
            fontSize: '1rem',
            marginBottom: '1rem'
          }}
        />
      </div>

      <div className="glass-card">
        {filteredDoctors.length === 0 ? (
          <p style={{ color: '#555', textAlign: 'center' }}>
            {searchTerm ? 'No doctors found matching your search.' : 'No verified doctors available.'}
          </p>
        ) : (
          <div className="requests-list">
            {filteredDoctors.map(doctor => {
              const languagesSpoken = doctor.languagesSpoken || [];
              const specialInterests = doctor.specialInterests || [];
              
              return (
                <div key={doctor.id} className="request-item">
                  <div className="request-details">
                    <strong>{doctor.medicalTitle || 'Dr.'} {doctor.fullName}</strong>
                    <span>{doctor.degree} - {doctor.specialization}</span>
                    {doctor.department && <span>Department: {doctor.department}</span>}
                    {doctor.yearsOfExperience && <span>Experience: {doctor.yearsOfExperience} years</span>}
                    <span>Hospital: {doctor.hospital || 'N/A'}</span>
                    {doctor.consultationType && <span>Consultation: {doctor.consultationType}</span>}
                    {languagesSpoken.length > 0 && (
                      <span>Languages: {languagesSpoken.join(', ')}</span>
                    )}
                    {specialInterests.length > 0 && (
                      <span>Special Interests: {specialInterests.slice(0, 3).join(', ')}{specialInterests.length > 3 ? '...' : ''}</span>
                    )}
                    {doctor.carePhilosophy && (
                      <span style={{ fontStyle: 'italic', color: '#6b46c1' }}>
                        "{doctor.carePhilosophy.substring(0, 100)}{doctor.carePhilosophy.length > 100 ? '...' : ''}"
                      </span>
                    )}
                    <span className="notes">✅ Verified Doctor</span>
                  </div>
                  <div className="request-actions">
                    <button 
                      className="action-button approve"
                      onClick={() => setSelectedDoctorId(doctor.id)}
                    >
                      👁️ View Full Profile
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {selectedDoctorId && (
        <DoctorProfileView 
          doctorId={selectedDoctorId} 
          onClose={() => setSelectedDoctorId(null)} 
        />
      )}
    </div>
  );
};

export default FindDoctorsPage;