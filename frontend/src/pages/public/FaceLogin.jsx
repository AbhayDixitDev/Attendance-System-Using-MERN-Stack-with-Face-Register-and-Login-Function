import React, { useEffect, useRef, useState } from 'react';
import * as faceapi from 'face-api.js';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const FaceLogin = () => {
  const videoRef = useRef(null);
  const [error, setError] = useState('');
  const [loginType, setLoginType] = useState('student'); // Added loginType state
  const navigate = useNavigate();

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

  const handleLogin = async () => {
    try {
      const video = videoRef.current;
      const detections = await faceapi
        .detectSingleFace(video)
        .withFaceLandmarks()
        .withFaceDescriptor();

      if (!detections) {
        setError('No face detected');
        return;
      }

      const faceDescriptor = Array.from(detections.descriptor);
      const response = await axios.post(`http://localhost:8000/api/${loginType}/face-login`, {
        faceDescriptor,
      });

      if (response.data.success) {
        alert('Login successful!');
        localStorage.setItem("user", loginType); // Store user type
        localStorage.setItem("userName", response.data.userName);
        navigate('/');
      } else {
        setError('Face not recognized');
      }
    } catch (err) {
      setError('Error during login');
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold text-center mb-6">Login with Face</h2>
        {error && <p className="text-red-600 text-center mb-4">{error}</p>}
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Login Type
            </label>
            <select
              value={loginType}
              onChange={(e) => setLoginType(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            >
              <option value="student">Student</option>
              <option value="teacher">Teacher</option>
            </select>
          </div>
          <div className="flex flex-col items-center">
            <video ref={videoRef} autoPlay muted className="w-full mb-4" />
            <button
              onClick={handleLogin}
              className="py-2 px-4 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
            >
              Login
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FaceLogin;