import React, { useEffect, useRef, useState } from 'react';
import * as faceapi from 'face-api.js';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const FaceLogin = () => {
  const videoRef = useRef(null);
  const [error, setError] = useState('');
  const [loginSuccess, setLoginSuccess] = useState(false);
  const [loginType, setLoginType] = useState('student'); // Default to student
  const navigate = useNavigate();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user) {
      navigate(user.userType === "student" ? "/student" : "/teacher", { replace: true });
    }
  }, [navigate]);
  
  let stream = null; // To store the stream reference

  // Load face-api models and start the webcam
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

    // Cleanup function to stop the stream when component unmounts
    return () => {
      stopCamera();
    };
  }, []);

  // Function to stop the camera
  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      stream = null; // Clear the stream reference
      if (videoRef.current) {
        videoRef.current.srcObject = null; // Remove the stream from the video element
      }
    }
  };

  // Handle face login
  const handleFaceLogin = async () => {
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
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/${loginType}/face-login`, {
        faceDescriptor,
      });

      if (response.data.success) {
        setLoginSuccess(true);
        setError('');
        localStorage.setItem('user', JSON.stringify(response.data)); // Store user data
        stopCamera();
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Error during face login');
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold text-center mb-6">Face Login</h2>
        {error && <p className="text-red-600 text-center mb-4">{error}</p>}
        {loginSuccess ? (
          <div className="text-green-600 text-center text-xl">
            Login Successful! Redirecting...
          </div>
        ) : (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Login As
              </label>
              <select
                value={loginType}
                onChange={(e) => setLoginType(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200"
              >
                <option value="student">Student</option>
                <option value="teacher">Teacher</option>
              </select>
            </div>
            <div className="flex flex-col items-center">
              <video ref={videoRef} autoPlay muted className="w-full mb-4" />
              <button
                onClick={handleFaceLogin}
                className="py-2 px-4 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
              >
                Login with Face
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FaceLogin;