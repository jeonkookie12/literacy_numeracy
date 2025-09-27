import React, { useState, useContext, useEffect } from 'react';
import { AuthContext } from '../context/authContext';
import { useNavigate } from 'react-router-dom';
import A1ES from '../assets/auth/A1ES.svg';
import PendingIcon from '../assets/auth/pending.svg'; 

const VerificationPage = () => {
  const { verifyEmail, logout, user } = useContext(AuthContext);
  const [code, setCode] = useState(['', '', '', '', '', '']);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  // Redirect unauthorized users
  useEffect(() => {
    if (!user) {
      navigate('/');
    }
  }, [user, navigate]);

  const handleInputChange = (index, value) => {
    const cleanedValue = value.replace(/[^A-Za-z0-9]/g, '').toUpperCase();
    if (cleanedValue.length <= 1) {
      const newCode = [...code];
      newCode[index] = cleanedValue;
      setCode(newCode);
      if (cleanedValue && index < 5) {
        document.getElementById(`code-input-${index + 1}`).focus();
      }
    }
  };

  const handleKeyDown = (index, e) => {
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
        if (user?.userType.toLowerCase() === 'learner' && !user.enrollmentStatus?.isEnrolled) {
          setSuccess('Your email is verified, but your enrollment is pending admin approval.');
        } else {
          navigate(result.redirect);
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

  // Conditional rendering based on email verification and enrollment status
  const isPending = user?.isEmailVerified && user?.userType.toLowerCase() === 'learner' && !user.enrollmentStatus?.isEnrolled;

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col p-4 sm:p-8">
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center gap-3">
          <img src={A1ES} alt="Alapan 1 Elementary School Logo" className="w-12 h-12" />
          <span className="text-lg font-semibold">Alapan 1 Elementary School</span>
        </div>
        {!isPending && (
          <button
            onClick={handleLogout}
            className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors"
          >
            Logout
          </button>
        )}
      </div>
      <div className="flex-grow flex items-center justify-center">
        {isPending ? (
          <div className="w-full max-w-4xl bg-white p-8 rounded-lg shadow-md sm:p-12">
            <div className="flex flex-col gap-6">
              <img src={PendingIcon} alt="Pending Icon" className="w-16 h-16" />
              <div className="text-left">
                <h2 className="text-2xl font-bold mb-4">Hello Dear Student,</h2>
                <p className="text-lg">
                  Your account is still pending for verification. We'll send further updates to your verified email address.
                </p>
                <p className="text-lg mt-2">
                  If you need further assistance regarding your account, please{' '}
                  <a
                    href="mailto:alapan1es@example.com"
                    className="underline text-blue-600 hover:text-blue-800"
                  >
                    contact us
                  </a>
                  .
                </p>
              </div>
              <div className="flex justify-end">
                <button
                  onClick={handleLogout}
                  className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-colors"
                >
                  Back to Login Page
                </button>
              </div>
            </div>
          </div>
        ) : (
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
        )}
      </div>
    </div>
  );
};

export default VerificationPage;