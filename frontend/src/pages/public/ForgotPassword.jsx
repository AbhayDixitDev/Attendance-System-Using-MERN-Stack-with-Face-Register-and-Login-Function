import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom'; // Assuming React Router is used

const ForgotPassword = () => {
  const [stage, setStage] = useState(1);
  const [formData, setFormData] = useState({
    email: '',
    captcha: '',
    otp: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [captchaText, setCaptchaText] = useState('');
  const canvasRef = useRef(null);
  const navigate = useNavigate(); // For navigation

  // Generate captcha with all symbols and mixed case
  const generateCaptchaText = () => {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+-=[]{}|;:,.<>?';
    let result = '';
    for (let i = 0; i < 6; i++) {
      result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
  };

  // Draw captcha on canvas
  const drawCaptcha = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const newCaptcha = generateCaptchaText();
    setCaptchaText(newCaptcha);
    setFormData({ ...formData, captcha: '' });
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#f3f4f6';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    for (let i = 0; i < 5; i++) {
      ctx.beginPath();
      ctx.moveTo(Math.random() * canvas.width, Math.random() * canvas.height);
      ctx.lineTo(Math.random() * canvas.width, Math.random() * canvas.height);
      ctx.strokeStyle = `hsl(${Math.random() * 360}, 50%, 70%)`;
      ctx.stroke();
    }

    ctx.font = 'bold 24px Arial';
    ctx.textBaseline = 'middle';
    for (let i = 0; i < newCaptcha.length; i++) {
      ctx.save();
      ctx.translate(20 + i * 30, 30 + Math.random() * 10 - 5);
      ctx.rotate((Math.random() - 0.5) * 0.4);
      ctx.fillStyle = `hsl(${Math.random() * 360}, 70%, 50%)`;
      ctx.fillText(newCaptcha[i], 0, 0);
      ctx.restore();
    }
  };

  useEffect(() => {
    drawCaptcha();
  }, []);

  const validateEmail = (email) => {
    return /\S+@\S+\.\S+/.test(email);
  };

  const validateField = (name, value) => {
    const newErrors = { ...errors };
    
    switch (name) {
      case 'email':
        if (!value) newErrors.email = 'Email is required';
        else if (!validateEmail(value)) newErrors.email = 'Invalid email';
        else delete newErrors.email;
        break;
      case 'captcha':
        if (!value) newErrors.captcha = 'Captcha is required';
        else if (value !== captchaText) newErrors.captcha = 'Captcha incorrect';
        else delete newErrors.captcha;
        break;
      case 'otp':
        if (!value) newErrors.otp = 'OTP is required';
        else delete newErrors.otp;
        break;
      case 'newPassword':
        if (!value) newErrors.newPassword = 'Password is required';
        else if (value.length < 6) newErrors.newPassword = 'Password must be 6+ characters';
        else delete newErrors.newPassword;
        break;
      case 'confirmPassword':
        if (value !== formData.newPassword) newErrors.confirmPassword = 'Passwords must match';
        else delete newErrors.confirmPassword;
        break;
      default:
        break;
    }
    
    setErrors(newErrors);
  };

  const validateForm = () => {
    const newErrors = {};
    if (stage === 1 || stage === 2) {
      if (!formData.email) newErrors.email = 'Email is required';
      else if (!validateEmail(formData.email)) newErrors.email = 'Invalid email';
      
      if (!formData.captcha) newErrors.captcha = 'Captcha is required';
      else if (formData.captcha !== captchaText) newErrors.captcha = 'Captcha incorrect';
    }
    
    if (stage === 2) {
      if (!formData.otp) newErrors.otp = 'OTP is required';
    }
    
    if (stage === 3) {
      if (!formData.newPassword) newErrors.newPassword = 'Password is required';
      else if (formData.newPassword.length < 6) newErrors.newPassword = 'Password must be 6+ characters';
      if (formData.newPassword !== formData.confirmPassword) newErrors.confirmPassword = 'Passwords must match';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    validateField(name, value);
  };

  const handleCaptchaPaste = (e) => {
    e.preventDefault();
    return false;
  };

  const handleGoBack = () => {
    setStage((prevStage) => prevStage - 1);
    setErrors({});
  };

  const handleGoHome = () => {
    navigate('/'); // Navigate to home page
  };

  const handleStep1 = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      setLoading(true);
      try {
        const response = await fetch('http://localhost:8000/public/forget-password/step-1', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: formData.email })
        });
        if (response.ok) setStage(2);
      } catch (error) {
        setErrors({ api: 'Something went wrong' });
      }
      setLoading(false);
    }
  };

  const handleStep2 = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      setLoading(true);
      try {
        const response = await fetch('http://localhost:8000/public/forget-password/step-2', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            email: formData.email,
            otp: formData.otp 
          })
        });
        if (response.ok) {
          setStage(3);
        } else {
          setErrors({ ...errors, otp: 'Invalid OTP' });
          drawCaptcha();
        }
      } catch (error) {
        setErrors({ api: 'Something went wrong' });
      }
      setLoading(false);
    }
  };

  const handleStep3 = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      setLoading(true);
      try {
        const response = await fetch('http://localhost:8000/public/forget-password/step-3', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            email: formData.email,
            newPassword: formData.newPassword 
          })
        });
        if (response.ok) {
          alert('Password changed successfully!');
          navigate('/'); // Navigate to home after success
        }
      } catch (error) {
        setErrors({ api: 'Something went wrong' });
      }
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold text-center mb-6">Forgot Password</h2>

        {/* Stage 1: Email + Captcha */}
        {stage === 1 && (
          <form onSubmit={handleStep1} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200"
              />
              {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Captcha</label>
              <div className="flex items-center space-x-2">
                <canvas
                  ref={canvasRef}
                  width="200"
                  height="60"
                  className="mt-1 border border-gray-300 rounded-md select-none"
                  style={{ userSelect: 'none' }}
                />
                <button
                  type="button"
                  onClick={drawCaptcha}
                  className="mt-1 p-2 bg-gray-200 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  title="Refresh Captcha"
                >
                  <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9H0m0 0v5m20-10v5h-.582m-15.356 2A8.001 8.001 0 0119.418 15H24m0 0v-5" />
                  </svg>
                </button>
              </div>
              <input
                type="text"
                name="captcha"
                value={formData.captcha}
                onChange={handleChange}
                onPaste={handleCaptchaPaste}
                className="mt-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200"
              />
              {errors.captcha && <p className="mt-1 text-sm text-red-600">{errors.captcha}</p>}
            </div>

            <div className="flex space-x-4">
              <button
                type="button"
                onClick={handleGoHome}
                className="w-1/2 py-2 px-4 bg-green-600 text-white rounded-md hover:bg-green-700"
              >
                Go to Home
              </button>
              <button
                type="submit"
                disabled={loading}
                className="w-1/2 py-2 px-4 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:bg-indigo-400"
              >
                {loading ? 'Sending...' : 'Send OTP'}
              </button>
            </div>
          </form>
        )}

        {/* Stage 2: Email + OTP + Captcha */}
        {stage === 2 && (
          <form onSubmit={handleStep2} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <input
                type="email"
                value={formData.email}
                disabled
                className="mt-1 block w-full rounded-md border-gray-300 bg-gray-100"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">OTP</label>
              <input
                type="text"
                name="otp"
                value={formData.otp}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200"
              />
              {errors.otp && <p className="mt-1 text-sm text-red-600">{errors.otp}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Captcha</label>
              <div className="flex items-center space-x-2">
                <canvas
                  ref={canvasRef}
                  width="200"
                  height="60"
                  className="mt-1 border border-gray-300 rounded-md select-none"
                  style={{ userSelect: 'none' }}
                />
                <button
                  type="button"
                  onClick={drawCaptcha}
                  className="mt-1 p-2 bg-gray-200 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  title="Refresh Captcha"
                >
                  <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9H0m0 0v5m20-10v5h-.582m-15.356 2A8.001 8.001 0 0119.418 15H24m0 0v-5" />
                  </svg>
                </button>
              </div>
              <input
                type="text"
                name="captcha"
                value={formData.captcha}
                onChange={handleChange}
                onPaste={handleCaptchaPaste}
                className="mt-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200"
              />
              {errors.captcha && <p className="mt-1 text-sm text-red-600">{errors.captcha}</p>}
            </div>

            <div className="flex space-x-4">
              <button
                type="button"
                onClick={handleGoBack}
                className="w-1/3 py-2 px-4 bg-gray-600 text-white rounded-md hover:bg-gray-700"
              >
                Go Back
              </button>
              <button
                type="button"
                onClick={handleGoHome}
                className="w-1/3 py-2 px-4 bg-green-600 text-white rounded-md hover:bg-green-700"
              >
                Go to Home
              </button>
              <button
                type="submit"
                disabled={loading}
                className="w-1/3 py-2 px-4 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:bg-indigo-400"
              >
                {loading ? 'Verifying...' : 'Verify OTP'}
              </button>
            </div>
          </form>
        )}

        {/* Stage 3: New Password + Confirm Password */}
        {stage === 3 && (
          <form onSubmit={handleStep3} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">New Password</label>
              <input
                type="password"
                name="newPassword"
                value={formData.newPassword}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200"
              />
              {errors.newPassword && <p className="mt-1 text-sm text-red-600">{errors.newPassword}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Confirm Password</label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200"
              />
              {errors.confirmPassword && <p className="mt-1 text-sm text-red-600">{errors.confirmPassword}</p>}
            </div>

            <div className="flex space-x-4">
              <button
                type="button"
                onClick={handleGoBack}
                className="w-1/3 py-2 px-4 bg-gray-600 text-white rounded-md hover:bg-gray-700"
              >
                Go Back
              </button>
              <button
                type="button"
                onClick={handleGoHome}
                className="w-1/3 py-2 px-4 bg-green-600 text-white rounded-md hover:bg-green-700"
              >
                Go to Home
              </button>
              <button
                type="submit"
                disabled={loading}
                className="w-1/3 py-2 px-4 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:bg-indigo-400"
              >
                {loading ? 'Changing...' : 'Change Password'}
              </button>
            </div>
          </form>
        )}

        {errors.api && <p className="mt-4 text-center text-sm text-red-600">{errors.api}</p>}
      </div>
    </div>
  );
};

export default ForgotPassword;