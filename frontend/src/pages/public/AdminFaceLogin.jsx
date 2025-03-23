import React, { useEffect, useRef, useState } from 'react';
import * as faceapi from 'face-api.js';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AdminFaceLogin = () => {
  const videoRef = useRef(null);
  const [error, setError] = useState('');
  const [loginSuccess, setLoginSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  let stream = null;

  useEffect(() => {
    const loadModelsAndStartVideo = async () => {
      try {
        await Promise.all([
          faceapi.nets.ssdMobilenetv1.loadFromUri('/models'),
          faceapi.nets.faceLandmark68Net.loadFromUri('/models'),
          faceapi.nets.faceRecognitionNet.loadFromUri('/models'),
        ]);
        stream = await navigator.mediaDevices.getUserMedia({ video: {} });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (err) {
        setError('Failed to load models or access webcam');
        console.error(err);
      }
    };
    loadModelsAndStartVideo();

    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      stream = null;
      if (videoRef.current) {
        videoRef.current.srcObject = null;
      }
    }
  };

  const handleFaceLogin = async () => {
    setLoading(true);
    try {
      const video = videoRef.current;
      const detections = await faceapi
        .detectSingleFace(video)
        .withFaceLandmarks()
        .withFaceDescriptor();

      if (!detections) {
        setError('No face detected. Please ensure your face is visible.');
        setLoading(false);
        return;
      }

      const faceDescriptor = Array.from(detections.descriptor);
      const response = await axios.post(
        'http://localhost:8000/api/admin/face-login',
        { faceDescriptor },
        { headers: { 'Content-Type': 'application/json' } }
      );

      if (response.data.success) {
        setLoginSuccess(true);
        setError('');
        localStorage.setItem('user', JSON.stringify(response.data));
        stopCamera();
        setTimeout(() => navigate('/admin', { replace: true }), 2000);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Error during face login');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold text-center mb-6">Admin Face Login</h2>
        {error && <p className="text-red-600 text-center mb-4">{error}</p>}
        {loginSuccess ? (
          <div className="text-green-600 text-center text-xl">
            Login Successful! Redirecting...
          </div>
        ) : (
          <div className="space-y-6">
            <div className="flex flex-col items-center">
              <video ref={videoRef} autoPlay muted className="w-full mb-4 rounded-md" />
              <button
                onClick={handleFaceLogin}
                disabled={loading}
                className="py-2 px-4 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:bg-indigo-400"
              >
                {loading ? 'Processing...' : 'Login with Face'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminFaceLogin;