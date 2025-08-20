import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';

interface LoginFormProps {
  onSuccess?: () => void;
  onSwitchToRegister?: () => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ onSuccess, onSwitchToRegister }) => {
  const { state, login, clearError } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (state.error) {
      clearError();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      await login(formData.email, formData.password);
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      // Error is handled by the context
    }
  };

  return (
    <div className="auth-form">
      <h2>Connexion</h2>
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            placeholder="votre@email.com"
          />
        </div>

        <div className="form-group">
          <label htmlFor="password">Mot de passe</label>
          <div className="password-input">
            <input
              type={showPassword ? 'text' : 'password'}
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              placeholder="Votre mot de passe"
            />
            <button
              type="button"
              className="password-toggle"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? '👁️' : '👁️‍🗨️'}
            </button>
          </div>
        </div>

        {state.error && (
          <div className="error-message">
            {state.error}
          </div>
        )}

        <button
          type="submit"
          className="auth-submit-btn"
          disabled={state.isLoading}
        >
          {state.isLoading ? 'Connexion...' : 'Se connecter'}
        </button>
      </form>

      <div className="auth-demo">
        <p><strong>Compte de démonstration :</strong></p>
        <p>Email: demo@dropshop.com</p>
        <p>Mot de passe: demo123</p>
      </div>

      <div className="auth-switch">
        <p>
          Pas encore de compte ?{' '}
          <button
            type="button"
            className="link-button"
            onClick={onSwitchToRegister}
          >
            S'inscrire
          </button>
        </p>
      </div>
    </div>
  );
};

export default LoginForm;
