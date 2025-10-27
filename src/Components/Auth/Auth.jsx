import React, { useState } from 'react';
// Import the SASS file
import "../../Styles/Auth/Auth.sass"; 

const AuthPage = () => {
    const [isFlipped, setIsFlipped] = useState(false);
    
    // Combined state for both Login and Register form data
    const [formData, setFormData] = useState({
        loginEmail: '',
        loginPassword: '',
        registerName: '',
        registerEmail: '',
        registerPassword: '',
        registerConfirmPassword: '',
    });

    // Universal change handler for all form fields
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevData => ({
            ...prevData,
            [name]: value
        }));
    };

    const toggleFlip = () => {
        setIsFlipped(!isFlipped);
    };

    const handleLoginSubmit = (e) => {
        e.preventDefault();
        // In a real app, you would send this data to your backend API
        const { loginEmail, loginPassword } = formData;
        console.log('Login Submitted:', { loginEmail, loginPassword });
        alert(`Login attempt for: ${loginEmail}`);
    };

    const handleRegisterSubmit = (e) => {
        e.preventDefault();
        // Basic validation check (Pass/Confirm must match)
        if (formData.registerPassword !== formData.registerConfirmPassword) {
            alert('Error: Passwords do not match!');
            return;
        }

        // Send data to backend API
        const { registerName, registerEmail, registerPassword } = formData;
        console.log('Register Submitted:', { registerName, registerEmail, registerPassword });
        alert(`Registration successful for: ${registerName}`);
    };

    return (
        <div className="auth-page-container">
            <div className="split-screen-container">
                
                {/* 1. LEFT SIDE: Message/Branding Panel (Stays Static) */}
                <div className="side-container message-panel">
                    <div className="message-content">
                        <h2 className="welcome-heading">
                            {isFlipped ? "Become a Learner" : "Welcome Back"}
                        </h2>
                        <p className="tagline">
                            {isFlipped 
                                ? "Register now to access your assigned forms and submit your valuable responses." 
                                : "Sign in to manage your forms (Admin) or submit your responses (Learner)."
                            }
                        </p>
                        {/* You can add an image tag here: <img src="..." alt="Illustration" /> */}
                    </div>
                </div>
                
                {/* 2. RIGHT SIDE: Flip Card Panel */}
                <div className="side-container form-flipper-panel">
                    <div 
                        className={`form-flipper ${isFlipped ? 'flipped' : ''}`}
                    >
                        
                        {/* === FRONT FACE: LOGIN FORM === */}
                        <div className="form-face form-login">
                            <form onSubmit={handleLoginSubmit}>
                                <h3>Portal Login</h3>
                                <input 
                                    type="email"
                                    name="loginEmail"
                                    placeholder="Email Address"
                                    value={formData.loginEmail}
                                    onChange={handleInputChange}
                                    required
                                />
                                <input 
                                    type="password"
                                    name="loginPassword"
                                    placeholder="Password"
                                    value={formData.loginPassword}
                                    onChange={handleInputChange}
                                    required
                                />
                                <button type="submit" className="primary-btn">Log In</button>
                                
                                <p className="switch-prompt">
                                    Only Learners need an account? 
                                    <span onClick={toggleFlip} className="switch-link">Register</span>
                                </p>
                            </form>
                        </div>
                        
                        {/* === BACK FACE: REGISTER FORM === */}
                        <div className="form-face form-register">
                            <form onSubmit={handleRegisterSubmit}>
                                <h3>Learner Registration</h3>
                                <input 
                                    type="text"
                                    name="registerName"
                                    placeholder="Full Name"
                                    value={formData.registerName}
                                    onChange={handleInputChange}
                                    required
                                />
                                <input 
                                    type="email"
                                    name="registerEmail"
                                    placeholder="Email Address"
                                    value={formData.registerEmail}
                                    onChange={handleInputChange}
                                    required
                                />
                                <input 
                                    type="password"
                                    name="registerPassword"
                                    placeholder="Password"
                                    value={formData.registerPassword}
                                    onChange={handleInputChange}
                                    required
                                />
                                <input 
                                    type="password"
                                    name="registerConfirmPassword"
                                    placeholder="Confirm Password"
                                    value={formData.registerConfirmPassword}
                                    onChange={handleInputChange}
                                    required
                                />
                                <button type="submit" className="primary-btn">Sign Up</button>
                                
                                <p className="switch-prompt">
                                    Already Registered? 
                                    <span onClick={toggleFlip} className="switch-link">Login</span>
                                </p>
                            </form>
                        </div>
                        
                    </div>
                </div>
                
            </div>
        </div>
    );
};

export default AuthPage;