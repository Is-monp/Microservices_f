import React, { useState } from 'react';
import { EyeIcon, EyeOffIcon } from './Icons';

interface RegisterFormProps {
  onToggleMode: () => void;
}

const RegisterForm: React.FC<RegisterFormProps> = ({ onToggleMode }) => {
  const [formData, setFormData] = useState({
    firstName: '',
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    if (error) setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccess(null);

    try {
      if (!formData.firstName || !formData.email || !formData.password) {
        throw new Error('Todos los campos son obligatorios');
      }

      const payload = {
        name: formData.firstName.trim(),
        email: formData.email.trim(),
        password: formData.password,
      };

      const API_URL = `${import.meta.env.VITE_API_URL}/auth/signup`;

      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const textResponse = await response.text();
      console.log('Respuesta del backend (signup):', textResponse);

      if (!response.ok) {
        let errorMsg = `Error ${response.status}`;
        try {
          const json = JSON.parse(textResponse);
          errorMsg = json.message || json.error || errorMsg;
        } catch {
          errorMsg = textResponse || errorMsg;
        }
        throw new Error(errorMsg);
      }

      setSuccess('Cuenta creada con éxito. Ahora puedes iniciar sesión.');
      setFormData({ firstName: '', email: '', password: '' });
    } catch (err) {
      console.error('Error en registro:', err);
      setError(err instanceof Error ? err.message : 'Error desconocido');
    } finally {
      setIsLoading(false);
    }
  };

  const togglePasswordVisibility = () => setShowPassword(!showPassword);

  return (
    <div className="auth-form">
      <h2 className="form-title">Sign Up</h2>
      <p className="form-subtitle">Create your account to get started.</p>

      {error && (
        <div
          style={{
            color: 'red',
            backgroundColor: '#ffe6e6',
            padding: '10px',
            borderRadius: '4px',
            marginBottom: '15px',
            border: '1px solid red',
          }}
        >
          {error}
        </div>
      )}

      {success && (
        <div
          style={{
            color: 'green',
            backgroundColor: '#eaffea',
            padding: '10px',
            borderRadius: '4px',
            marginBottom: '15px',
            border: '1px solid green',
          }}
        >
          {success}
        </div>
      )}

      <form onSubmit={handleSubmit} className="form-fields">
        <div className="input-group">
          <label htmlFor="firstName">Name</label>
          <input
            type="text"
            id="firstName"
            name="firstName"
            placeholder="eg. John"
            value={formData.firstName}
            onChange={handleChange}
            required
            disabled={isLoading}
          />
        </div>

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
          <div className="password-hint">Must be at least 8 characters.</div>
        </div>

        <button type="submit" className="submit-btn" disabled={isLoading}>
          {isLoading ? 'Creating Account...' : 'Sign Up'}
        </button>
      </form>

      <div className="auth-toggle">
        Already have an account?
        <button onClick={onToggleMode} className="toggle-btn" disabled={isLoading}>
          Log in
        </button>
      </div>
    </div>
  );
};

export default RegisterForm;
