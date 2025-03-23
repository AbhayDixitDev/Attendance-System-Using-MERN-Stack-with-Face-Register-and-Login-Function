import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

// Fixed values for class, section, subject, and subject code
const classOptions = ['LKG', 'UKG', '1st', '2nd', '3rd', '4th', '5th', '6th', '7th', '8th', '9th', '10th', '11th', '12th'];
const sectionOptions = ['No Section', 'A', 'B', 'C', 'D'];
const subjectOptions = ['Math', 'Science', 'Social', 'English', 'Hindi', 'History', 'Geography', 'Art', 'Music', 'Sports', 'Physics', 'Chemistry', 'Biology', 'Sanskrit', 'Other'];
const subjectCodeOptions = ['MATH', 'SCI', 'SOC', 'ENG', 'HIN', 'HIS', 'GEO', 'ART', 'MUS', 'SPO', 'PHY', 'CHE', 'BIO', 'SANS', 'OTH'];

const Signup = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    dob: '',
    password: '',
    confirmPassword: '',
    userType: 'student',
    class: '',
    section: '',
    subjects: [{ name: '', code: '' }],
    classes: [{ class: '', section: '' }],
  });
  const [errors, setErrors] = useState({});
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const validateForm = () => {
    let tempErrors = {};
    if (!formData.name) tempErrors.name = 'Name is required';
    if (!formData.email) tempErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) tempErrors.email = 'Email is invalid';
    if (!formData.dob) tempErrors.dob = 'Date of Birth is required';
    if (!formData.password) tempErrors.password = 'Password is required';
    else if (formData.password.length < 6) tempErrors.password = 'Password must be at least 6 characters';
    if (formData.password !== formData.confirmPassword) tempErrors.confirmPassword = 'Passwords do not match';
    
    if (formData.userType === 'student') {
      if (!formData.class) tempErrors.class = 'Class is required';
      if (!formData.section) tempErrors.section = 'Section is required';
    } else if (formData.userType === 'teacher') {
      if (!formData.subjects.length || formData.subjects.some(sub => !sub.name || !sub.code)) {
        tempErrors.subjects = 'At least one subject with name and code is required';
      }
      if (!formData.classes.length || formData.classes.some(cls => !cls.class || !cls.section)) {
        tempErrors.classes = 'At least one class with class and section is required';
      }
    }

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      setLoading(true);
      try {
        const payload = {
          name: formData.name,
          email: formData.email,
          dob: formData.dob,
          password: formData.password,
        };

        if (formData.userType === 'student') {
          payload.class = formData.class;
          payload.section = formData.section;
        } else if (formData.userType === 'teacher') {
          payload.subjects = formData.subjects;
          payload.classes = formData.classes;
        }

        const response = await axios.post(
          `${import.meta.env.VITE_API_URL}/api/${formData.userType}/signup`,
          payload,
          { headers: { 'Content-Type': 'application/json' } }
        );

        if (response.data.success) {
          setShowSuccessModal(true);
          setTimeout(() => {
            setShowSuccessModal(false);
            // Redirect to face-registration with userId and userType
            navigate('/face-registration', {
              state: {
                userId: response.data.userId, // Assuming backend returns userId
                userType: formData.userType,
                email: formData.email, // Pass email as fallback
              },
            });
          }, 3000);
        }
      } catch (error) {
        setShowErrorModal(true);
        setErrors({ api: error.response?.data?.message || 'Something went wrong during signup!' });
      } finally {
        setLoading(false);
      }
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: '' });
  };

  const handleSubjectChange = (index, field, value) => {
    const newSubjects = [...formData.subjects];
    newSubjects[index][field] = value;
    setFormData({ ...formData, subjects: newSubjects });
    setErrors({ ...errors, subjects: '' });
  };

  const handleClassChange = (index, field, value) => {
    const newClasses = [...formData.classes];
    newClasses[index][field] = value;
    setFormData({ ...formData, classes: newClasses });
    setErrors({ ...errors, classes: '' });
  };

  const addSubject = () => {
    setFormData({ ...formData, subjects: [...formData.subjects, { name: '', code: '' }] });
  };

  const addClass = () => {
    setFormData({ ...formData, classes: [{ class: '', section: '' }] });
  };

  return (
    <div className="bg-gray-100 min-h-screen flex items-center justify-center py-4 px-2 sm:px-4 lg:px-8">
      <div className="bg-white p-4 rounded-lg shadow-md w-full max-w-4xl">
        <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <h2 className="text-2xl font-bold text-center col-span-full mb-2">Sign Up</h2>

          <div>
            <label className="block text-sm font-medium text-gray-700">User Type</label>
            <select
              name="userType"
              value={formData.userType}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 text-sm"
            >
              <option value="student">Student</option>
              <option value="teacher">Teacher</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 text-sm"
            />
            {errors.name && <p className="mt-1 text-xs text-red-600">{errors.name}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 text-sm"
            />
            {errors.email && <p className="mt-1 text-xs text-red-600">{errors.email}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Date of Birth</label>
            <input
              type="date"
              name="dob"
              value={formData.dob}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 text-sm"
            />
            {errors.dob && <p className="mt-1 text-xs text-red-600">{errors.dob}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 text-sm"
            />
            {errors.password && <p className="mt-1 text-xs text-red-600">{errors.password}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Confirm Password</label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 text-sm"
            />
            {errors.confirmPassword && <p className="mt-1 text-xs text-red-600">{errors.confirmPassword}</p>}
          </div>

          {formData.userType === 'student' && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700">Class</label>
                <select
                  name="class"
                  value={formData.class}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 text-sm"
                >
                  <option value="">Select Class</option>
                  {classOptions.map((cls) => (
                    <option key={cls} value={cls}>
                      {cls}
                    </option>
                  ))}
                </select>
                {errors.class && <p className="mt-1 text-xs text-red-600">{errors.class}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Section</label>
                <select
                  name="section"
                  value={formData.section}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 text-sm"
                >
                  <option value="">Select Section</option>
                  {sectionOptions.map((sec) => (
                    <option key={sec} value={sec}>
                      {sec}
                    </option>
                  ))}
                </select>
                {errors.section && <p className="mt-1 text-xs text-red-600">{errors.section}</p>}
              </div>
            </>
          )}

          {formData.userType === 'teacher' && (
            <>
              <div className="col-span-full">
                <label className="block text-sm font-medium text-gray-700">Subjects</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-1">
                  {formData.subjects.map((subject, index) => (
                    <div key={index} className="flex space-x-2">
                      <select
                        value={subject.name}
                        onChange={(e) => handleSubjectChange(index, 'name', e.target.value)}
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 text-sm"
                      >
                        <option value="">Select Subject</option>
                        {subjectOptions.map((sub) => (
                          <option key={sub} value={sub}>
                            {sub}
                          </option>
                        ))}
                      </select>
                      <select
                        value={subject.code}
                        onChange={(e) => handleSubjectChange(index, 'code', e.target.value)}
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 text-sm"
                      >
                        <option value="">Select Code</option>
                        {subjectCodeOptions.map((code) => (
                          <option key={code} value={code}>
                            {code}
                          </option>
                        ))}
                      </select>
                    </div>
                  ))}
                </div>
                <button
                  type="button"
                  onClick={addSubject}
                  className="mt-2 text-indigo-600 hover:text-indigo-800 text-sm"
                >
                  + Add Subject
                </button>
                {errors.subjects && <p className="mt-1 text-xs text-red-600">{errors.subjects}</p>}
              </div>

              <div className="col-span-full">
                <label className="block text-sm font-medium text-gray-700">Classes</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-1">
                  {formData.classes.map((cls, index) => (
                    <div key={index} className="flex space-x-2">
                      <select
                        value={cls.class}
                        onChange={(e) => handleClassChange(index, 'class', e.target.value)}
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 text-sm"
                      >
                        <option value="">Select Class</option>
                        {classOptions.map((clsOpt) => (
                          <option key={clsOpt} value={clsOpt}>
                            {clsOpt}
                          </option>
                        ))}
                      </select>
                      <select
                        value={cls.section}
                        onChange={(e) => handleClassChange(index, 'section', e.target.value)}
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 text-sm"
                      >
                        <option value="">Select Section</option>
                        {sectionOptions.map((sec) => (
                          <option key={sec} value={sec}>
                            {sec}
                          </option>
                        ))}
                      </select>
                    </div>
                  ))}
                </div>
                <button
                  type="button"
                  onClick={addClass}
                  className="mt-2 text-indigo-600 hover:text-indigo-800 text-sm"
                >
                  + Add Class
                </button>
                {errors.classes && <p className="mt-1 text-xs text-red-600">{errors.classes}</p>}
              </div>
            </>
          )}

          <div className="col-span-full text-center">
            <Link to="/login" className="text-indigo-600 hover:text-indigo-800 text-sm">
              Already have an account? Login
            </Link>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="col-span-full w-full py-2 px-4 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:bg-indigo-400 text-sm"
          >
            {loading ? 'Signing up...' : 'Sign Up'}
          </button>
        </form>
      </div>

      {showSuccessModal && (
        <div className="fixed inset-0 flex items-center justify-center backdrop-blur-sm z-50">
          <div className="bg-white p-4 rounded-lg shadow-lg w-full max-w-sm">
            <h3 className="text-lg font-medium text-green-600">Success</h3>
            <p className="mt-2 text-gray-600">Signup successful! Redirecting to face registration...</p>
          </div>
        </div>
      )}

      {showErrorModal && (
        <div className="fixed inset-0 flex items-center justify-center backdrop-blur-sm z-50">
          <div className="bg-white p-4 rounded-lg shadow-lg w-full max-w-sm">
            <h3 className="text-lg font-medium text-red-600">Error</h3>
            <p className="mt-2 text-gray-600">{errors.api}</p>
            <button
              onClick={() => setShowErrorModal(false)}
              className="mt-4 w-full py-2 px-4 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 text-sm"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Signup;