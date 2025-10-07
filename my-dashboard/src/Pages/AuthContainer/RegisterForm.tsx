import React, { useState } from 'react';
import { EyeIcon, EyeOffIcon } from './Icons';

interface RegisterFormProps {
    onToggleMode: () => void;
}

const RegisterForm: React.FC<RegisterFormProps> = ({ onToggleMode }) => {
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
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
        console.log('Register attempt:', formData);
        // Handle registration logic here
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    return (
        <div className="auth-form">
        <form onSubmit={handleSubmit} className="form-fields">
            <div className="input-row">
                <div className="input-group">
                    <label htmlFor="firstName">First Name</label>
                    <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    placeholder="eg. John"
                    value={formData.firstName}
                    onChange={handleChange}
                    required
                    />
                </div>
            
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
                <div className="password-hint">
                    Must be at least 8 characters.
                </div>
            </div>

            <button type="submit" className="submit-btn">
                Sign Up
            </button>
        </form>

            <div className="auth-toggle">
                Already have an account? 
                <button onClick={onToggleMode} className="toggle-btn">
                Log in
                </button>
            </div>
        </div>
    );
    };

export default RegisterForm;