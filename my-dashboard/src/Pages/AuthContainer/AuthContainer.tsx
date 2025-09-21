import React, { useState } from 'react';
import LoginForm from './LoginForm';
import RegisterForm from './RegisterForm';
import './AuthContainer.scss';

const AuthContainer: React.FC = () => {
    const [isLogin, setIsLogin] = useState(true);

    const toggleMode = () => {
        setIsLogin(!isLogin);
    };

    return (
        <div className="auth-container">
        <div className="auth-card">
            <div className="auth-left">
            <div className="auth-branding">
                <div className="logo">
                    <div className="logo-icon">M</div>
                    <span className="logo-text">MicroManager</span>
                </div>
                <h1 className="auth-title">
                    {isLogin ? 'Welcome Back' : 'Get Started with Us'}
                </h1>
                <p className="auth-subtitle">
                {isLogin 
                    ? 'Manage. Visualize. All in one place' 
                    : 'Complete these easy steps to register your account'
                }
                </p>
                {!isLogin && (
                <div className="steps-list">
                    <div className="step active">
                        <span className="step-number">1</span>
                        <span className="step-text">Sign up your account</span>
                    </div>
                    <div className="step">
                        <span className="step-number">2</span>
                        <span className="step-text">Set up your workspace</span>
                    </div>
                    <div className="step">
                        <span className="step-number">3</span>
                        <span className="step-text">Manage your microservices</span>
                    </div>
                </div>
                )}
            </div>
            </div>
            
            <div className="auth-right">
            <div className="auth-form-container">
                {isLogin ? (
                <LoginForm onToggleMode={toggleMode} />
                ) : (
                <RegisterForm onToggleMode={toggleMode} />
                )}
            </div>
            </div>
        </div>
        </div>
    );
};

export default AuthContainer;