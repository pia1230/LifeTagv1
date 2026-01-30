import React, { useState, useEffect } from 'react';
import { useAuth } from '../components/context/AuthContext';
import { useNavigate } from 'react-router-dom';
import apiClient from '../api';
import './PageWrapper.css';

const ProfilePage = () => {
  const { auth } = useAuth();
  const navigate = useNavigate();

  const [profile, setProfile] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!auth) return;

    const url = auth.role === 'patient' ? '/users/profile' : '/doctors/profile';

    const fetchProfile = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await apiClient.get(url);
        // Handle both flat and nested response formats
        const data = response.data.patient || response.data.doctor || response.data;
        setProfile(data);
      } catch (err) {
        console.error('Error fetching profile:', err);
        setError(err.response?.data?.message || 'Failed to fetch profile.');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [auth]);

  if (loading) {
    return (
      <div className="page-wrapper">
        <div className="glass-card">
          <p>Loading profile...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="page-wrapper">
        <div className="glass-card">
          <p className="error-message">{error}</p>
        </div>
      </div>
    );
  }

  if (!profile) return null;

  return (
    <div className="page-wrapper center-content">
      <div className="glass-card" style={{ textAlign: 'left', maxWidth: '700px' }}>
        <h3 style={{ textAlign: 'center', marginTop: 0 }}>My Profile</h3>

        {/* Common fields */}
        <p><strong>Name:</strong> {profile.fullName}</p>
        <p><strong>Email:</strong> {profile.email}</p>

        {/* Patient-specific fields */}
        {auth.role === 'patient' && (
          <>
            <p><strong>Age:</strong> {profile.age || 'N/A'}</p>
            <p><strong>Gender:</strong> {profile.gender || 'N/A'}</p>
            <p><strong>Patient ID:</strong> {profile.patientTagId}</p>

            {/* Aadhaar Verification */}
            <div style={{ marginTop: '1rem', padding: '1rem', borderRadius: '12px',
              background: '#f6f1ff' }}>
              
              <p><strong>Aadhaar Status:</strong></p>

              {profile.aadhaarVerified ? (
                <p style={{ color: 'green', fontWeight: 700 }}>
                  ✔ Verified (XXXX-{profile.aadhaarLast4})
                </p>
              ) : (
                <>
                  <p style={{ color: 'red', fontWeight: 700 }}>❌ Not Verified</p>
                  <button
                    className="primary-button glossy-btn"
                    onClick={() => navigate("/verify-aadhaar")}
                  >
                    Verify Aadhaar
                  </button>
                </>
              )}
            </div>
          </>
        )}

        {/* Doctor-specific fields */}
        {auth.role === 'doctor' && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginTop: '1rem' }}>
            {/* Basic Information */}
            <div style={{ padding: '1rem', borderRadius: '12px', background: '#f0f8ff' }}>
              <h4 style={{ margin: '0 0 0.5rem 0', color: '#2c5aa0' }}>👨⚕️ Professional Information</h4>
              <p><strong>Title:</strong> {profile.medicalTitle || 'Dr.'}</p>
              <p><strong>Degree:</strong> {profile.degree}</p>
              <p><strong>Specialization:</strong> {profile.specialization}</p>
              <p><strong>Department:</strong> {profile.department || 'N/A'}</p>
              <p><strong>Experience:</strong> {profile.yearsOfExperience ? `${profile.yearsOfExperience} years` : 'N/A'}</p>
              <p><strong>Hospital/Clinic:</strong> {profile.hospital || 'N/A'}</p>
              <p><strong>Doctor ID:</strong> {profile.id}</p>
            </div>

            {/* Education & Credentials */}
            <div style={{ padding: '1rem', borderRadius: '12px', background: '#f0fff4' }}>
              <h4 style={{ margin: '0 0 0.5rem 0', color: '#16a34a' }}>🎓 Education & Credentials</h4>
              {profile.university && <p><strong>University:</strong> {profile.university}</p>}
              {profile.certifications && (
                <div>
                  <strong>Certifications:</strong>
                  <ul style={{ margin: '0.5rem 0', paddingLeft: '1.5rem' }}>
                    {profile.certifications.map((cert, idx) => <li key={idx}>{cert}</li>)}
                  </ul>
                </div>
              )}
              {profile.medicalCouncilReg && <p><strong>Medical Council Reg:</strong> {profile.medicalCouncilReg}</p>}
            </div>

            {/* Expertise */}
            <div style={{ padding: '1rem', borderRadius: '12px', background: '#fff7ed' }}>
              <h4 style={{ margin: '0 0 0.5rem 0', color: '#ea580c' }}>🔬 Expertise</h4>
              {profile.conditionsTreated && (
                <div>
                  <strong>Conditions Treated:</strong>
                  <ul style={{ margin: '0.5rem 0', paddingLeft: '1.5rem' }}>
                    {profile.conditionsTreated.map((condition, idx) => <li key={idx}>{condition}</li>)}
                  </ul>
                </div>
              )}
              {profile.keyProcedures && (
                <div>
                  <strong>Key Procedures:</strong>
                  <ul style={{ margin: '0.5rem 0', paddingLeft: '1.5rem' }}>
                    {profile.keyProcedures.map((procedure, idx) => <li key={idx}>{procedure}</li>)}
                  </ul>
                </div>
              )}
              {profile.specialInterests && (
                <div>
                  <strong>Special Interests:</strong>
                  <ul style={{ margin: '0.5rem 0', paddingLeft: '1.5rem' }}>
                    {profile.specialInterests.map((interest, idx) => <li key={idx}>{interest}</li>)}
                  </ul>
                </div>
              )}
            </div>

            {/* Patient Care */}
            <div style={{ padding: '1rem', borderRadius: '12px', background: '#f3e8ff' }}>
              <h4 style={{ margin: '0 0 0.5rem 0', color: '#7c3aed' }}>💙 Patient Care</h4>
              {profile.consultationType && <p><strong>Consultation Type:</strong> {profile.consultationType}</p>}
              {profile.languagesSpoken && (
                <div>
                  <strong>Languages Spoken:</strong>
                  <span style={{ marginLeft: '0.5rem' }}>{profile.languagesSpoken.join(', ')}</span>
                </div>
              )}
              {profile.carePhilosophy && (
                <div>
                  <strong>Care Philosophy:</strong>
                  <p style={{ fontStyle: 'italic', margin: '0.5rem 0', color: '#6b46c1' }}>"{profile.carePhilosophy}"</p>
                </div>
              )}
              {/* Achievements moved here */}
              {(profile.awards || profile.publications || profile.memberships) && (
                <div style={{ marginTop: '1rem' }}>
                  {profile.awards && (
                    <div>
                      <strong>Awards:</strong>
                      <ul style={{ margin: '0.5rem 0', paddingLeft: '1.5rem' }}>
                        {profile.awards.map((award, idx) => <li key={idx}>{award}</li>)}
                      </ul>
                    </div>
                  )}
                  {profile.publications && (
                    <div>
                      <strong>Publications:</strong>
                      <ul style={{ margin: '0.5rem 0', paddingLeft: '1.5rem' }}>
                        {profile.publications.map((pub, idx) => <li key={idx}>{pub}</li>)}
                      </ul>
                    </div>
                  )}
                  {profile.memberships && (
                    <div>
                      <strong>Memberships:</strong>
                      <ul style={{ margin: '0.5rem 0', paddingLeft: '1.5rem' }}>
                        {profile.memberships.map((membership, idx) => <li key={idx}>{membership}</li>)}
                      </ul>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Report buttons */}
        {auth.role === 'patient' && (
          <button
            className="primary-button glossy-btn"
            onClick={() => navigate('/report-user?targetRole=doctor')}
            style={{ marginTop: '1rem', width: '100%' }}
          >
            Report a Doctor
          </button>
        )}


      </div>
    </div>
  );
};

export default ProfilePage;