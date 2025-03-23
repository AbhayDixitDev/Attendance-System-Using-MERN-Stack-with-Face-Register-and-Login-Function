import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AdminForgotPassword = () => {
  const [stage, setStage] = useState(1);
  const [formData, setFormData] = useState({
    email: '',
    captcha: '',
    otp: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [captchaText, setCaptchaText] = useState('');
  const canvasRef = useRef(null);
  const navigate = useNavigate();

  const generateCaptchaText = () => {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
    let result = '';
    for (let i = 0; i < 6; i++) {
      result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
  };

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

  const validateForm = () => {
    const newErrors = {};
    if (stage === 1 || stage === 2) {
      if (!formData.email) newErrors.email = 'Email is required';
      else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Invalid email';
      if (!formData.captcha) newErrors.captcha = 'Captcha is required';
      else if (formData.captcha !== captchaText) newErrors.captcha = 'Incorrect captcha';
    }
    if (stage === 2) {
      if (!formData.otp) newErrors.otp = 'OTP is required';
    }
    if (stage === 3) {
      if (!formData.newPassword) newErrors.newPassword = 'New password is required';
      else if (formData.newPassword.length < 6) newErrors.newPassword = 'Password must be at least 6 characters';
      if (formData.newPassword !== formData.confirmPassword) newErrors.confirmPassword = 'Passwords must match';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: '' });
  };

  const handleCaptchaPaste = (e) => {
    e.preventDefault();
  };

  const handleStep1 = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      setLoading(true);
      try {
        const response = await axios.post(
          'http://localhost:8000/api/admin/forget-password/step-1',
          { email: formData.email },
          { headers: { 'Content-Type': 'application/json' } }
        );
        if (response.data.success) {
          setStage(2);
        }
      } catch (err) {
        setErrors({ api: err.response?.data?.message || 'Something went wrong' });
      } finally {
        setLoading(false);
      }
    }
  };

  const handleStep2 = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      setLoading(true);
      try {
        const response = await axios.post(
          'http://localhost:8000/api/admin/forget-password/step-2',
          { email: formData.email, otp: formData.otp },
          { headers: { 'Content-Type': 'application/json' } }
        );
        if (response.data.success) {
          setStage(3);
          drawCaptcha();
        }
      } catch (err) {
        setErrors({ api: err.response?.data?.message || 'Something went wrong' });
        drawCaptcha();
      } finally {
        setLoading(false);
      }
    }
  };

  const handleStep3 = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      setLoading(true);
      try {
        const response = await axios.post(
          'http://localhost:8000/api/admin/forget-password/step-3',
          { email: formData.email, newPassword: formData.newPassword },
          { headers: { 'Content-Type': 'application/json' } }
        );
        if (response.data.success) {
          setTimeout(() => navigate('/admin/login'), 2000);
        }
      } catch (err) {
        setErrors({ api: err.response?.data?.message || 'Something went wrong' });
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold text-center mb-6">Admin Forgot Password</h2>

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
                  className="mt-1 border border-gray-300 rounded-md"
                />
                <button
                  type="button"
                  onClick={drawCaptcha}
                  className="mt-1 p-2 bg-gray-200 rounded-md hover:bg-gray-300"
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
            <button
              type="submit"
              disabled={loading}
              className="w-full py-2 px-4 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:bg-indigo-400"
            >
              {loading ? 'Sending...' : 'Send OTP'}
            </button>
          </form>
        )}

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
                  className="mt-1 border border-gray-300 rounded-md"
                />
                <button
                  type="button"
                  onClick={drawCaptcha}
                  className="mt-1 p-2 bg-gray-200 rounded-md hover:bg-gray-300"
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
                onClick={() => setStage(1)}
                className="w-1/2 py-2 px-4 bg-gray-600 text-white rounded-md hover:bg-gray-700"
              >
                Back
              </button>
              <button
                type="submit"
                disabled={loading}
                className="w-1/2 py-2 px-4 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:bg-indigo-400"
              >
                {loading ? 'Verifying...' : 'Verify OTP'}
              </button>
            </div>
          </form>
        )}

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
                onClick={() => setStage(2)}
                className="w-1/2 py-2 px-4 bg-gray-600 text-white rounded-md hover:bg-gray-700"
              >
                Back
              </button>
              <button
                type="submit"
                disabled={loading}
                className="w-1/2 py-2 px-4 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:bg-indigo-400"
              >
                {loading ? 'Changing...' : 'Reset Password'}
              </button>
            </div>
          </form>
        )}

        {errors.api && <p className="mt-4 text-center text-sm text-red-600">{errors.api}</p>}
        {stage === 3 && !loading && !errors.api && (
          <p className="mt-4 text-center text-sm text-green-600">Password reset successfully! Redirecting...</p>
        )}
      </div>
    </div>
  );
};

export default AdminForgotPassword;