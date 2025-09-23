import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/authContext';
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';
import A1ES from '../assets/auth/A1ES.svg';
import students from '../assets/auth/students.png';
import alapan_fb from '../assets/auth/fb.svg';
import languagee from '../assets/auth/language.svg';

const AuthPage = () => {
  const { login, signup } = useContext(AuthContext);
  const [isLogin, setIsLogin] = useState(true);
  const [language, setLanguage] = useState('en');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [lrn, setLrn] = useState('');
  const [email, setEmail] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    const trimmedUsername = username.trim();
    const trimmedPassword = password.trim();
    console.log('Sending login:', { trimmedUsername, password: '****' });
    try {
      const result = await login(trimmedUsername, trimmedPassword);
      console.log('Full login response:', JSON.stringify(result, null, 2));
      if (!result.success) {
        console.error('Login error details:', result.debug || 'No additional details');
        setError(result.message || 'Unknown error occurred');
      }
    } catch (err) {
      console.error('Login request failed:', err.message, err);
      setError('Failed to connect to server. Please try again.');
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setError('');
    if (password !== confirmPassword) {
      console.error('Signup error: Passwords do not match');
      setError('Passwords do not match');
      return;
    }
    const trimmedFirstName = firstName.trim();
    const trimmedLastName = lastName.trim();
    const trimmedLrn = lrn.trim();
    const trimmedEmail = email.trim();
    const trimmedPassword = password.trim();
    try {
      const result = await signup(trimmedFirstName, trimmedLastName, trimmedLrn, trimmedEmail, trimmedPassword);
      console.log('Signup response:', result);
      if (!result.success) {
        console.error('Signup error details:', result.debug || 'No additional details');
        setError(result.message);
      } else {
        setIsLogin(true);
        setError('Signup successful! Please verify your email and log in.');
      }
    } catch (err) {
      console.error('Signup failed:', err.message);
      setError('An unexpected error occurred');
    }
  };

  const handleToggle = () => {
    setIsLogin(!isLogin);
    setError('');
    setUsername('');
    setPassword('');
    setFirstName('');
    setLastName('');
    setLrn('');
    setEmail('');
    setConfirmPassword('');
    setShowPassword(false);
    setShowConfirmPassword(false);
  };

  const handleLanguageChange = (e) => {
    setLanguage(e.target.value);
  };

  return (
    <div className="flex h-screen font-sans">
      <div className="hidden md:flex md:w-1/2 bg-gray-100 items-center justify-center overflow-hidden">
        <img src={students} alt="Students" className="w-full h-full object-cover" />
      </div>
      <div className="w-full md:w-1/2 flex flex-col p-6 md:p-8">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-3">
            <img src={A1ES} alt="Alapan 1 Elementary School Logo" className="w-12 h-12" />
            <span className="text-lg font-semibold">Alapan 1 Elementary School</span>
          </div>
          <div className="relative">
            <div className="flex items-center p-2 bg-gray-100 rounded-lg text-base cursor-pointer hover:bg-gray-300 transition-colors">
              <img src={languagee} alt="Language Selector Logo" className="w-5 h-5 mr-2" />
              <span>{language === 'en' ? 'English' : 'Filipino'}</span>
            </div>
            <select
              value={language}
              onChange={handleLanguageChange}
              className="absolute inset-0 opacity-0 cursor-pointer"
            >
              <option value="en">English</option>
              <option value="fil">Filipino</option>
            </select>
          </div>
        </div>
        <div className="flex-grow flex items-center">
          <div className="w-full max-w-md mx-auto">
            <h2 className="text-3xl font-bold mb-20 text-center">
              {isLogin ? (
                <>
                  Welcome to<br />Literacy and Numeracy
                </>
              ) : (
                'Get Started'
              )}
            </h2>
            {error && (
              <div className="mb-4 p-3 bg-red-100 border-red-400 text-red-700 text-sm rounded-lg flex items-center">
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
            <form className="space-y-5" onSubmit={isLogin ? handleLogin : handleSignup}>
              {isLogin ? (
                <>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="LRN/Email"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      className="w-full p-3 bg-gray-100 rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-blue-300"
                    />
                  </div>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full p-3 bg-gray-100 rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-blue-300"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    >
                      {showPassword ? (
                        <EyeSlashIcon className="h-5 w-5 text-gray-500" />
                      ) : (
                        <EyeIcon className="h-5 w-5 text-gray-500" />
                      )}
                    </button>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <label className="flex items-center">
                      <input type="checkbox" className="mr-2 w-4 h-4" /> Remember me
                    </label>
                    <a href="#" className="text-blue-600">Forgot password?</a>
                  </div>
                  <button
                    type="submit"
                    className="w-full p-3 bg-blue-300 text-white rounded-lg text-base"
                  >
                    Login
                  </button>
                  <p className="text-center text-sm mt-3">
                    Don't have an account?{' '}
                    <a href="#" onClick={handleToggle} className="text-blue-600">
                      Sign Up
                    </a>
                  </p>
                </>
              ) : (
                <>
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      placeholder="First Name"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      className="w-1/2 p-3 bg-gray-100 rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-blue-300"
                    />
                    <input
                      type="text"
                      placeholder="Last Name"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      className="w-1/2 p-3 bg-gray-100 rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-blue-300"
                    />
                  </div>
                  <input
                    type="text"
                    placeholder="LRN"
                    value={lrn}
                    onChange={(e) => setLrn(e.target.value)}
                    className="w-full p-3 bg-gray-100 rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-blue-300"
                  />
                  <input
                    type="email"
                    placeholder="Email Address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full p-3 bg-gray-100 rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-blue-300"
                  />
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full p-3 bg-gray-100 rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-blue-300"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    >
                      {showPassword ? (
                        <EyeSlashIcon className="h-5 w-5 text-gray-500" />
                      ) : (
                        <EyeIcon className="h-5 w-5 text-gray-500" />
                      )}
                    </button>
                  </div>
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      placeholder="Confirm Password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full p-3 bg-gray-100 rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-blue-300"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    >
                      {showConfirmPassword ? (
                        <EyeSlashIcon className="h-5 w-5 text-gray-500" />
                      ) : (
                        <EyeIcon className="h-5 w-5 text-gray-500" />
                      )}
                    </button>
                  </div>
                  <p className="text-xs text-blue-600">
                    By clicking the Sign Up button, you therefore agree to the Privacy Policy. For more information, read about privacy{' '}
                    <a href="#" className="underline">here</a>.
                  </p>
                  <button
                    type="submit"
                    className="w-full p-3 bg-blue-300 text-white rounded-lg text-base"
                  >
                    Sign Up
                  </button>
                  <p className="text-center text-sm mt-3">
                    Already have an account?{' '}
                    <a href="#" onClick={handleToggle} className="text-blue-600">
                      Sign In
                    </a>
                  </p>
                </>
              )}
            </form>
          </div>
        </div>
        <div className="text-center text-xs mt-6">
          <a
            href="https://www.facebook.com/DepEdTayoAlapan1ES"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center w-full"
          >
            <img src={alapan_fb} alt="DepEd Icon" className="w-4 h-4 mr-2" />
            DepEd Tayo Alapan 1 ES - Imus City
          </a>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;