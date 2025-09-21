import React, { useState } from 'react';
import { EyeIcon, EyeOffIcon } from './Icons';

interface LoginFormProps {
    onToggleMode: () => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ onToggleMode }) => {
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [showPassword, setShowPassword] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
        ...formData,
        [e.target.name]: e.target.value
    });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log('Login attempt:', formData);
        // Handle login logic here
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    return (
    <div className="auth-form">
        <h2 className="form-title">Sign In Account</h2>
        <p className="form-subtitle">Enter your credentials to access your account.</p>

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
                    />
                    <button
                        type="button"
                        className="password-toggle"
                        onClick={togglePasswordVisibility}
                        >
                        {showPassword ? <EyeOffIcon /> : <EyeIcon />}
                    </button>
                </div>
            </div>

            <button type="submit" className="submit-btn">
            Sign In
            </button>
        </form>

        <div className="auth-toggle">
            Don't have an account? 
            <button onClick={onToggleMode} className="toggle-btn">
            Sign Up
            </button>
        </div>
    </div>
    );
};

export default LoginForm;