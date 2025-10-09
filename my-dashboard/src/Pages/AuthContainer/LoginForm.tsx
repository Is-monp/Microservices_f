import React, { useState } from 'react';
import { EyeIcon, EyeOffIcon } from './Icons';
import { useNavigate } from 'react-router-dom';

interface LoginFormProps {
  onToggleMode: () => void;
}

interface LoginResponse {
  accessToken: string;
  refreshToken: string;
}

const LoginForm: React.FC<LoginFormProps> = ({ onToggleMode }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    if (error) setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      if (!formData.email || !formData.password) {
        throw new Error('Email y contraseña son requeridos');
      }

      const payload = {
        email: formData.email.trim(),
        password: formData.password
      };

      const API_URL = `${import.meta.env.VITE_API_URL}/auth/login`;

      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        let errorMessage = `Error ${response.status}`;
        try {
          const errorData = await response.json();
          errorMessage = errorData.message || errorMessage;
        } catch {
          const errorText = await response.text();
          errorMessage = errorText || errorMessage;
        }
        throw new Error(errorMessage);
      }

      const data: LoginResponse = await response.json();
      console.log('Login exitoso - Tokens recibidos');

      // Guardar tokens en localStorage
      localStorage.setItem('accessToken', data.accessToken);
      localStorage.setItem('refreshToken', data.refreshToken);

      // Formatear y guardar info del usuario
      const formattedName = formData.email.split('@')[0];

      const userInfo = {
        name: formattedName,
        email: formData.email
      };

      localStorage.setItem('user', JSON.stringify(userInfo));

      console.log('Tokens y datos del usuario guardados en localStorage');
      setFormData({ email: '', password: '' });

      navigate('/dashboard');
    } catch (err) {
      console.error('Error completo:', err);
      if (err instanceof TypeError) {
        if (err.message.includes('Failed to fetch')) {
          setError('No se pudo conectar al servidor. Verifica: 1) CORS, 2) Servidor activo, 3) URL correcta');
        } else {
          setError(`Error de red: ${err.message}`);
        }
      } else {
        setError(err instanceof Error ? err.message : 'Error desconocido');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="auth-form">
      <h2 className="form-title">Sign In</h2>
      <p className="form-subtitle">Enter your credentials to access your account.</p>

      {error && (
        <div
          className="error-message"
          style={{
            color: 'red',
            backgroundColor: '#ffe6e6',
            padding: '10px',
            borderRadius: '4px',
            marginBottom: '15px',
            border: '1px solid red'
          }}
        >
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="form-fields">
        <div className="input-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            placeholder="eg. papajohns@gmail.com"
            value={formData.email}
            onChange={handleChange}
            required
            disabled={isLoading}
          />
        </div>

        <div className="input-group">
          <label htmlFor="password">Password</label>
          <div className="password-input">
            <input
              type={showPassword ? 'text' : 'password'}
              id="password"
              name="password"
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleChange}
              required
              disabled={isLoading}
            />
            <button
              type="button"
              className="password-toggle"
              onClick={togglePasswordVisibility}
              disabled={isLoading}
            >
              {showPassword ? <EyeOffIcon /> : <EyeIcon />}
            </button>
          </div>
        </div>

        <button type="submit" className="submit-btn" disabled={isLoading}>
          {isLoading ? 'Signing In...' : 'Sign In'}
        </button>
      </form>

      <div className="auth-toggle">
        Don't have an account?{' '}
        <button onClick={onToggleMode} className="toggle-btn" disabled={isLoading}>
          Sign Up
        </button>
      </div>
    </div>
  );
};

export default LoginForm;
