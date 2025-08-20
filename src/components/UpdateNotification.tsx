import React, { useState, useEffect } from 'react';
import { useNetworkStatus } from '../hooks/useOfflineCache';

interface UpdateNotificationProps {
  isUpdateAvailable: boolean;
  onUpdate: () => void;
}

const UpdateNotification: React.FC<UpdateNotificationProps> = ({
  isUpdateAvailable,
  onUpdate
}) => {
  const [showNotification, setShowNotification] = useState(false);
  const { isOnline } = useNetworkStatus();

  useEffect(() => {
    if (isUpdateAvailable) {
      setShowNotification(true);
    }
  }, [isUpdateAvailable]);

  const handleUpdate = () => {
    onUpdate();
    setShowNotification(false);
  };

  const handleDismiss = () => {
    setShowNotification(false);
  };

  if (!showNotification || !isUpdateAvailable) {
    return null;
  }

  return (
    <div className="update-notification">
      <div className="update-content">
        <h4>🎉 Mise à jour disponible !</h4>
        <p>Une nouvelle version de l'application est disponible.</p>
        <div className="update-actions">
          <button onClick={handleUpdate} className="update-btn">
            Mettre à jour
          </button>
          <button onClick={handleDismiss} className="dismiss-btn">
            Plus tard
          </button>
        </div>
      </div>
    </div>
  );
};

// Composant pour l'indicateur hors ligne
export const OfflineIndicator: React.FC = () => {
  const { isOnline } = useNetworkStatus();
  const [showOffline, setShowOffline] = useState(false);

  useEffect(() => {
    if (!isOnline) {
      setShowOffline(true);
    } else {
      // Délai pour masquer l'indicateur après reconnexion
      const timer = setTimeout(() => {
        setShowOffline(false);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [isOnline]);

  return (
    <div className={`offline-indicator ${showOffline && !isOnline ? 'show' : ''}`}>
      {!isOnline ? (
        <span>📡 Vous êtes hors ligne - Certaines fonctionnalités peuvent être limitées</span>
      ) : (
        <span>✅ Connexion rétablie</span>
      )}
    </div>
  );
};

export default UpdateNotification;
