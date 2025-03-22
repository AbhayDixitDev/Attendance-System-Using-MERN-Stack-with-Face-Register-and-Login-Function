import React, { useEffect, useRef, useState } from 'react';
import * as faceapi from 'face-api.js';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';

const FaceRegistration = () => {
  const videoRef = useRef(null);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const { userId, userType } = location.state || {};

  useEffect(() => {
    const loadModelsAndStartVideo = async () => {
      try {
        await Promise.all([
          faceapi.nets.ssdMobilenetv1.loadFromUri('/models'),
          faceapi.nets.faceLandmark68Net.loadFromUri('/models'),
          faceapi.nets.faceRecognitionNet.loadFromUri('/models'),
        ]);
        const stream = await navigator.mediaDevices.getUserMedia({ video: {} });
        videoRef.current.srcObject = stream;
      } catch (err) {
        setError('Failed to load models or access webcam');
        console.error(err);
      }
    };
    loadModelsAndStartVideo();
  }, []);

  const handleRegisterFace = async () => {
    try {
      const video = videoRef.current;
      const detections = await faceapi
        .detectSingleFace(video)
        .withFaceLandmarks()
        .withFaceDescriptor();

      if (!detections) {
        setError('No face detected. Please ensure your face is visible.');
        return;
      }

      const faceDescriptor = Array.from(detections.descriptor);
      const response = await axios.post(`http://localhost:8000/api/${userType}/register-face`, {
        userId,
        faceDescriptor,
      });

      if (response.data.success) {
        setSuccessMessage('Face registered successfully! Please check your email to verify your account.');
        setError('');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Error registering face');
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold text-center mb-6">Register Your Face</h2>
        {error && <p className="text-red-600 text-center mb-4">{error}</p>}
        {successMessage ? (
          <div>
            <p className="text-green-600 text-center mb-4">{successMessage}</p>
            <button
              onClick={() => navigate('/login')}
              className="w-full py-2 px-4 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
            >
              Go to Login
            </button>
          </div>
        ) : (
          <div className="flex flex-col items-center">
            <video ref={videoRef} autoPlay muted className="w-full mb-4" />
            <button
              onClick={handleRegisterFace}
              className="py-2 px-4 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
            >
              Register Face
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default FaceRegistration;