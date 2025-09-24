import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/authContext';
import { useNavigate } from 'react-router-dom';
import A1ES from '../assets/auth/A1ES.svg';

const VerificationPage = () => {
  const { verifyEmail, logout, user } = useContext(AuthContext);
  const [code, setCode] = useState(['', '', '', '', '', '']);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleInputChange = (index, value) => {
    // Allow only alphanumeric characters and convert to uppercase
    const cleanedValue = value.replace(/[^A-Za-z0-9]/g, '').toUpperCase();
    if (cleanedValue.length <= 1) {
      const newCode = [...code];
      newCode[index] = cleanedValue;
      setCode(newCode);

      // Move to next input if a character is entered
      if (cleanedValue && index < 5) {
        document.getElementById(`code-input-${index + 1}`).focus();
      }
    }
  };

  const handleKeyDown = (index, e) => {
    // Move to previous input on backspace if empty
    if (e.key === 'Backspace' && !code[index] && index > 0) {
      document.getElementById(`code-input-${index - 1}`).focus();
    }
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    const verificationCode = code.join('');
    if (verificationCode.length !== 6) {
      setError('Please enter a 6-digit code');
      return;
    }

    try {
      const result = await verifyEmail(verificationCode);
      console.log('Verify email response:', result);
      if (result.success) {
        // Redirect based on userType
        const userType = user?.userType?.toLowerCase();
        console.log('User type for redirect:', userType);
        switch (userType) {
          case 'learner':
            navigate('/learner-dashboard');
            break;
          case 'teacher':
            navigate('/teacher-dashboard');
            break;
          case 'admin':
            navigate('/admin-dashboard');
            break;
          default:
            navigate('/'); // Fallback if userType is undefined
            break;
        }
      } else {
        setError(result.message || 'Invalid verification code');
      }
    } catch (err) {
      console.error('Verification failed:', err.message);
      setError('Failed to connect to server. Please try again.');
    }
  };

  const handleResendCode = async () => {
    setError('');
    setSuccess('');
    try {
      const response = await fetch('http://localhost/literacynumeracy/resend_email.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
      });
      const result = await response.json();
      console.log('Resend email response:', result);
      if (result.success) {
        setSuccess(result.message || 'A new verification code has been sent to your email');
      } else {
        setError(result.message || 'Failed to resend verification code');
      }
    } catch (err) {
      console.error('Resend email failed:', err.message);
      setError('Failed to connect to server. Please try again.');
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col p-4 sm:p-8">
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center gap-3">
          <img src={A1ES} alt="Alapan 1 Elementary School Logo" className="w-12 h-12" />
          <span className="text-lg font-semibold">Alapan 1 Elementary School</span>
        </div>
        <button
          onClick={handleLogout}
          className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors"
        >
          Logout
        </button>
      </div>
      <div className="flex-grow flex items-center justify-center">
        <div className="w-full max-w-md bg-white p-12 rounded-lg shadow-md">
          <h2 className="text-2xl font-bold text-center mb-4">Email Verification</h2>
          <div className="text-center space-y-1 mb-12">
            <p>We have sent a code to your email:</p>
            <p>
              {localStorage.getItem('userEmail')?.replace(/(.{2}).*(.@.*)/, '$1****$2')}
            </p>
          </div>
          {error && (
            <div className="mb-4 p-3 bg-red-100 border-red-400 text-red-700 text-sm rounded-lg text-center flex items-center justify-center">
              <svg
                className="w-5 h-5 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              {error}
            </div>
          )}
          {success && (
            <div className="mb-4 p-3 bg-green-100 border-green-400 text-green-700 text-sm rounded-lg text-center flex items-center justify-center">
              <svg
                className="w-5 h-5 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M5 13l4 4L19 7"
                />
              </svg>
              {success}
            </div>
          )}
          <form onSubmit={handleVerify} className="space-y-6">
            <div className="flex justify-between gap-0.5">
              {code.map((digit, index) => (
                <input
                  key={index}
                  id={`code-input-${index}`}
                  type="text"
                  maxLength="1"
                  value={digit}
                  onChange={(e) => handleInputChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  className="w-12 h-12 text-center text-xl rounded-lg bg-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-300 uppercase"
                />
              ))}
            </div>
            <button
              type="submit"
              className="w-full p-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              Verify
            </button>
          </form>
          <div className="text-center mt-4">
            <p className="text-sm">Didn't receive the code?</p>
            <span
              onClick={handleResendCode}
              className="text-sm font-bold text-blue-600 cursor-pointer hover:text-blue-800 transition-colors"
            >
              Resend Code
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VerificationPage; 