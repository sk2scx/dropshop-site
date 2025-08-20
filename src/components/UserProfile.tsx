import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';

interface UserProfileProps {
  onClose?: () => void;
}

const UserProfile: React.FC<UserProfileProps> = ({ onClose }) => {
  const { state, logout, updateProfile } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    firstName: state.user?.firstName || '',
    lastName: state.user?.lastName || '',
    phone: state.user?.phone || '',
  });
  const [isUpdating, setIsUpdating] = useState(false);

  if (!state.user) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUpdating(true);
    
    try {
      await updateProfile(formData);
      setIsEditing(false);
    } catch (error) {
      alert('Erreur lors de la mise à jour du profil');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleLogout = () => {
    logout();
    if (onClose) {
      onClose();
    }
  };

  return (
    <div className="user-profile">
      <div className="profile-header">
        <div className="profile-avatar">
          <img src={state.user.avatar} alt={`${state.user.firstName} ${state.user.lastName}`} />
        </div>
        <div className="profile-info">
          <h3>{state.user.firstName} {state.user.lastName}</h3>
          <p>{state.user.email}</p>
          {!state.user.isEmailVerified && (
            <span className="email-status">Email non vérifié</span>
          )}
        </div>
      </div>

      {isEditing ? (
        <form onSubmit={handleSubmit} className="profile-edit-form">
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="firstName">Prénom</label>
              <input
                type="text"
                id="firstName"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="lastName">Nom</label>
              <input
                type="text"
                id="lastName"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                required
              />
            </div>
          </div>
          
          <div className="form-group">
            <label htmlFor="phone">Téléphone</label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
            />
          </div>

          <div className="profile-actions">
            <button
              type="submit"
              className="btn btn-primary"
              disabled={isUpdating}
            >
              {isUpdating ? 'Mise à jour...' : 'Sauvegarder'}
            </button>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => setIsEditing(false)}
            >
              Annuler
            </button>
          </div>
        </form>
      ) : (
        <div className="profile-details">
          <div className="detail-item">
            <label>Nom complet:</label>
            <span>{state.user.firstName} {state.user.lastName}</span>
          </div>
          
          <div className="detail-item">
            <label>Email:</label>
            <span>{state.user.email}</span>
          </div>
          
          <div className="detail-item">
            <label>Téléphone:</label>
            <span>{state.user.phone || 'Non renseigné'}</span>
          </div>
          
          <div className="detail-item">
            <label>Membre depuis:</label>
            <span>{new Date(state.user.createdAt).toLocaleDateString('fr-FR')}</span>
          </div>

          <div className="profile-actions">
            <button
              className="btn btn-primary"
              onClick={() => setIsEditing(true)}
            >
              Modifier le profil
            </button>
            <button
              className="btn btn-danger"
              onClick={handleLogout}
            >
              Se déconnecter
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserProfile;
