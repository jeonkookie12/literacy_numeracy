import React, { useState, useContext, useRef } from 'react';
import { AuthContext } from '../context/authContext';
import { EyeIcon, EyeSlashIcon, CheckIcon } from '@heroicons/react/24/outline';
import ReCAPTCHA from 'react-google-recaptcha';
import A1ES from '../assets/auth/A1ES.svg';
import students from '../assets/auth/students.png';
import alapan_fb from '../assets/auth/fb.svg';
import languagee from '../assets/auth/language.svg';
import { useNavigate } from 'react-router-dom';

const AuthPage = () => {
  const { login, signup } = useContext(AuthContext);
  const [isLogin, setIsLogin] = useState(true);
  const [isLrnStep, setIsLrnStep] = useState(true);
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
  const [fieldErrors, setFieldErrors] = useState({
    firstName: '',
    lastName: '',
    lrn: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const recaptchaRef = useRef(null);
  const navigate = useNavigate();

  const RECAPTCHA_SITE_KEY = '6LcRcdMrAAAAANuoo8JqmjPQCBz7VWFYA3Ggc2y3';

  // Password validation logic
  const passwordValidations = {
    length: password.length >= 8,
    lowercase: /[a-z]/.test(password),
    uppercase: /[A-Z]/.test(password),
    specialChar: /[!@#$%^&*(),.?":{}|<>]/.test(password)
  };

  // Validation functions
  const validateName = (name) => {
    if (!name) return 'This field is required';
    if (!/^[A-Za-z\s]+$/.test(name)) return 'Only letters and spaces are allowed';
    return '';
  };

  const validateLrn = (lrn) => {
    if (!lrn) return 'This field is required';
    if (!/^\d+$/.test(lrn)) return 'Characters not allowed, numbers only';
    if (!/^\d{12}$/.test(lrn)) return 'Must be exactly 12 digits';
    return '';
  };

  const validateEmail = (email) => {
    if (!email) return 'This field is required';
    if (!/^[^\s@]+@(gmail\.com|yahoo\.com)$/.test(email)) return 'Only gmail.com or yahoo.com emails are allowed';
    return '';
  };

  const validatePassword = (password) => {
    if (!password) return 'This field is required';
    return '';
  };

  const validateConfirmPassword = (confirmPassword, password) => {
    if (!confirmPassword) return 'This field is required';
    if (confirmPassword !== password) return 'Passwords do not match';
    return '';
  };

  // Handle input changes with real-time validation
  const handleInputChange = (field, value, setter) => {
    setter(value);
    let error = '';
    if (field === 'firstName' || field === 'lastName') {
      error = validateName(value);
    } else if (field === 'lrn') {
      error = validateLrn(value);
    } else if (field === 'email') {
      error = validateEmail(value);
    } else if (field === 'password') {
      error = validatePassword(value);
    } else if (field === 'confirmPassword') {
      error = validateConfirmPassword(value, password);
    }
    setFieldErrors((prev) => ({ ...prev, [field]: error }));
  };

  const executeRecaptcha = async () => {
    if (!recaptchaRef.current) {
      console.error('reCAPTCHA ref is not initialized');
      setError('reCAPTCHA not initialized. Please refresh the page.');
      return null;
    }
    try {
      console.log('Executing reCAPTCHA...');
      const token = await recaptchaRef.current.executeAsync();
      console.log('reCAPTCHA token generated:', token ? 'Valid token' : 'No token');
      return token;
    } catch (err) {
      console.error('reCAPTCHA execution failed:', err.message || err);
      if (err.message === 'Timeout') {
        console.log('Retrying reCAPTCHA due to timeout...');
        resetRecaptcha();
        return await executeRecaptcha();
      }
      setError('Failed to verify reCAPTCHA. Please try again.');
      return null;
    }
  };

  const resetRecaptcha = () => {
    if (recaptchaRef.current) {
      console.log('Resetting reCAPTCHA');
      recaptchaRef.current.reset();
    }
  };

  const handleLrnVerification = async (e) => {
    e.preventDefault();
    setError('');
    const lrnError = validateLrn(lrn);
    setFieldErrors((prev) => ({ ...prev, lrn: lrnError }));
    if (lrnError) return;

    const token = await executeRecaptcha();
    if (!token) {
      setError('Please complete the reCAPTCHA verification');
      return;
    }

    try {
      console.log('Sending LRN for verification:', lrn.trim());
      const response = await fetch('http://localhost/literacynumeracy/verify_lrn.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ lrn: lrn.trim(), recaptchaToken: token }),
        credentials: 'include'
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const result = await response.json();
      console.log('LRN verification response:', result);
      if (result.success) {
        setIsLrnStep(false); // Proceed to the signup form
      } else {
        setError(result.message || 'Failed to verify LRN. Please try again.');
        setLrn(''); // Clear LRN field
        setFieldErrors((prev) => ({ ...prev, lrn: '' }));
        resetRecaptcha();
      }
    } catch (err) {
      console.error('LRN verification failed:', err.message);
      setError('Failed to connect to server. Please try again.');
      resetRecaptcha();
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    console.log('Starting login process...');
    const token = await executeRecaptcha();
    if (!token) {
      setError('Please complete the reCAPTCHA verification');
      return;
    }
    const trimmedUsername = username.trim();
    const trimmedPassword = password.trim();
    console.log('Sending login:', { trimmedUsername, password: '****', recaptchaToken: token });
    try {
      const result = await login(trimmedUsername, trimmedPassword, token);
      console.log('Full login response:', JSON.stringify(result, null, 2));
      if (!result.success) {
        console.error('Login error details:', result.debug || 'No additional details');
        setError(result.message || 'Unknown error occurred');
        resetRecaptcha();
      }
    } catch (err) {
      console.error('Login request failed:', err.message, err);
      setError('Failed to connect to server. Please try again.');
      resetRecaptcha();
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setError('');

    // Validate all fields
    const errors = {
      firstName: validateName(firstName),
      lastName: validateName(lastName),
      lrn: validateLrn(lrn),
      email: validateEmail(email),
      password: validatePassword(password),
      confirmPassword: validateConfirmPassword(confirmPassword, password)
    };

    setFieldErrors(errors);

    // Check if any validation errors exist
    if (Object.values(errors).some((error) => error !== '')) {
      return;
    }

    // Check password validations
    if (!Object.values(passwordValidations).every((valid) => valid)) {
      setError('Password does not meet all requirements');
      return;
    }

    console.log('Starting signup process...');
    const token = await executeRecaptcha();
    if (!token) {
      setError('Please complete the reCAPTCHA verification');
      return;
    }
    const trimmedFirstName = firstName.trim();
    const trimmedLastName = lastName.trim();
    const trimmedLrn = lrn.trim();
    const trimmedEmail = email.trim();
    const trimmedPassword = password.trim();
    try {
      const result = await signup(
        trimmedFirstName,
        trimmedLastName,
        trimmedLrn,
        trimmedEmail,
        trimmedPassword,
        token
      );
      console.log('Signup response:', result);
      if (!result.success) {
        console.error('Signup error details:', result.message, result.debug || 'No additional details');
        setError(result.message || 'An unexpected error occurred');
        resetRecaptcha();
      } else {
        setFirstName('');
        setLastName('');
        setLrn('');
        setEmail('');
        setPassword('');
        setConfirmPassword('');
        setFieldErrors({
          firstName: '',
          lastName: '',
          lrn: '',
          email: '',
          password: '',
          confirmPassword: ''
        });
        setShowPassword(false);
        setShowConfirmPassword(false);
        setError('Signup successful! Please check your email for the verification code.');
        resetRecaptcha();
        navigate('/verify-email');
      }
    } catch (err) {
      console.error('Signup failed:', err.message);
      setError('Failed to connect to server. Please try again.');
      resetRecaptcha();
    }
  };

  const handleToggle = () => {
    setIsLogin(!isLogin);
    setIsLrnStep(true);
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
    setFieldErrors({
      firstName: '',
      lastName: '',
      lrn: '',
      email: '',
      password: '',
      confirmPassword: ''
    });
    resetRecaptcha();
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
            <div className="flex items-center p-2 bg-gray-200 rounded-lg text-base cursor-pointer hover:bg-gray-300 transition-colors">
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
                isLrnStep ? 'Verify Your LRN' : 'Get Started'
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
            <form className="space-y-5" onSubmit={isLogin ? handleLogin : isLrnStep ? handleLrnVerification : handleSignup}>
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
                        className="absolute inset-y-0 right-0 pr-3 flex items-center z-10"
                      >
                        {showPassword ? (
                          <EyeSlashIcon className="h-5 w-5 text-gray-500" />
                        ) : (
                          <EyeIcon className="h-5 w-5 text-gray-500" />
                        )}
                      </button>
                    </div>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <label className="flex items-center">
                      <input type="checkbox" className="mr-2 w-4 h-4" /> Remember me
                    </label>
                    <a href="#" className="text-blue-600">Forgot password?</a>
                  </div>
                  <ReCAPTCHA
                    ref={recaptchaRef}
                    sitekey={RECAPTCHA_SITE_KEY}
                    size="invisible"
                    badge="bottomright"
                    onErrored={() => {
                      console.error('reCAPTCHA errored');
                      setError('reCAPTCHA failed to load. Please try again.');
                      resetRecaptcha();
                    }}
                    onExpired={() => {
                      console.log('reCAPTCHA token expired');
                      resetRecaptcha();
                      executeRecaptcha();
                    }}
                    hl={language === 'en' ? 'en' : 'fil'}
                  />
                  <button
                    type="submit"
                    className="w-full p-3 bg-blue-500 text-white rounded-lg text-base hover:bg-blue-600 transition-colors"
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
              ) : isLrnStep ? (
                <>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="LRN"
                      value={lrn}
                      onChange={(e) => handleInputChange('lrn', e.target.value, setLrn)}
                      className={`w-full p-3 bg-gray-100 rounded-lg text-base focus:outline-none focus:ring-2 ${
                        fieldErrors.lrn ? 'border-red-500 border-2' : 'focus:ring-blue-300'
                      }`}
                    />
                    {fieldErrors.lrn && (
                      <p className="text-red-500 text-xs mt-1">{fieldErrors.lrn}</p>
                    )}
                  </div>
                  <ReCAPTCHA
                    ref={recaptchaRef}
                    sitekey={RECAPTCHA_SITE_KEY}
                    size="invisible"
                    badge="bottomright"
                    onErrored={() => {
                      console.error('reCAPTCHA errored');
                      setError('reCAPTCHA failed to load. Please try again.');
                      resetRecaptcha();
                    }}
                    onExpired={() => {
                      console.log('reCAPTCHA token expired');
                      resetRecaptcha();
                      executeRecaptcha();
                    }}
                    hl={language === 'en' ? 'en' : 'fil'}
                  />
                  <button
                    type="submit"
                    className="w-full p-3 bg-blue-500 text-white rounded-lg text-base hover:bg-blue-600 transition-colors"
                  >
                    Continue
                  </button>
                  <p className="text-center text-sm mt-3">
                    Already have an account?{' '}
                    <a href="#" onClick={handleToggle} className="text-blue-600">
                      Sign In
                    </a>
                  </p>
                </>
              ) : (
                <>
                  <div className="flex space-x-2">
                    <div className="w-1/2 relative">
                      <input
                        type="text"
                        placeholder="First Name"
                        value={firstName}
                        onChange={(e) => handleInputChange('firstName', e.target.value, setFirstName)}
                        className={`w-full p-3 bg-gray-100 rounded-lg text-base focus:outline-none focus:ring-2 ${
                          fieldErrors.firstName ? 'border-red-500 border-2' : 'focus:ring-blue-300'
                        }`}
                      />
                      {fieldErrors.firstName && (
                        <p className="text-red-500 text-xs mt-1">{fieldErrors.firstName}</p>
                      )}
                    </div>
                    <div className="w-1/2 relative">
                      <input
                        type="text"
                        placeholder="Last Name"
                        value={lastName}
                        onChange={(e) => handleInputChange('lastName', e.target.value, setLastName)}
                        className={`w-full p-3 bg-gray-100 rounded-lg text-base focus:outline-none focus:ring-2 ${
                          fieldErrors.lastName ? 'border-red-500 border-2' : 'focus:ring-blue-300'
                        }`}
                      />
                      {fieldErrors.lastName && (
                        <p className="text-red-500 text-xs mt-1">{fieldErrors.lastName}</p>
                      )}
                    </div>
                  </div>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="LRN"
                      value={lrn}
                      onChange={(e) => handleInputChange('lrn', e.target.value, setLrn)}
                      className={`w-full p-3 bg-gray-100 rounded-lg text-base focus:outline-none focus:ring-2 ${
                        fieldErrors.lrn ? 'border-red-500 border-2' : 'focus:ring-blue-300'
                      }`}
                      disabled
                    />
                    {fieldErrors.lrn && (
                      <p className="text-red-500 text-xs mt-1">{fieldErrors.lrn}</p>
                    )}
                  </div>
                  <div className="relative">
                    <input
                      type="email"
                      placeholder="Email Address"
                      value={email}
                      onChange={(e) => handleInputChange('email', e.target.value, setEmail)}
                      className={`w-full p-3 bg-gray-100 rounded-lg text-base focus:outline-none focus:ring-2 ${
                        fieldErrors.email ? 'border-red-500 border-2' : 'focus:ring-blue-300'
                      }`}
                    />
                    {fieldErrors.email && (
                      <p className="text-red-500 text-xs mt-1">{fieldErrors.email}</p>
                    )}
                  </div>
                  <div className="relative">
                    <div className="relative">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        placeholder="Password"
                        value={password}
                        onChange={(e) => handleInputChange('password', e.target.value, setPassword)}
                        className={`w-full p-3 bg-gray-100 rounded-lg text-base focus:outline-none focus:ring-2 ${
                          fieldErrors.password ? 'border-red-500 border-2' : 'focus:ring-blue-300'
                        }`}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center z-10"
                      >
                        {showPassword ? (
                          <EyeSlashIcon className="h-5 w-5 text-gray-500" />
                        ) : (
                          <EyeIcon className="h-5 w-5 text-gray-500" />
                        )}
                      </button>
                    </div>
                    {fieldErrors.password && (
                      <p className="text-red-500 text-xs mt-1">{fieldErrors.password}</p>
                    )}
                    {password && (
                      <div className="text-sm mt-2 ml-1 space-y-1">
                        {[
                          { label: 'Must be at least 8 characters', valid: passwordValidations.length },
                          { label: 'Must have at least one lowercase letter', valid: passwordValidations.lowercase },
                          { label: 'Must have at least one uppercase letter', valid: passwordValidations.uppercase },
                          { label: 'Must have at least one special character', valid: passwordValidations.specialChar }
                        ].map((item, index) => (
                          <div key={index} className="flex items-center space-x-2 text-sm text-gray-700">
                            <div
                              className={`w-3 h-3 rounded-full flex items-center justify-center ${
                                item.valid ? 'bg-green-600' : 'bg-gray-300'
                              }`}
                            >
                              {item.valid && <CheckIcon className="w-3 h-3 text-white" />}
                            </div>
                            <span>{item.label}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  <div className="relative">
                    <div className="relative">
                      <input
                        type={showConfirmPassword ? 'text' : 'password'}
                        placeholder="Confirm Password"
                        value={confirmPassword}
                        onChange={(e) => handleInputChange('confirmPassword', e.target.value, setConfirmPassword)}
                        className={`w-full p-3 bg-gray-100 rounded-lg text-base focus:outline-none focus:ring-2 ${
                          fieldErrors.confirmPassword ? 'border-red-500 border-2' : 'focus:ring-blue-300'
                        }`}
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center z-10"
                      >
                        {showConfirmPassword ? (
                          <EyeSlashIcon className="h-5 w-5 text-gray-500" />
                        ) : (
                          <EyeIcon className="h-5 w-5 text-gray-500" />
                        )}
                      </button>
                    </div>
                    {fieldErrors.confirmPassword && (
                      <p className="text-red-500 text-xs mt-1">{fieldErrors.confirmPassword}</p>
                    )}
                  </div>
                  <ReCAPTCHA
                    ref={recaptchaRef}
                    sitekey={RECAPTCHA_SITE_KEY}
                    size="invisible"
                    badge="bottomright"
                    onErrored={() => {
                      console.error('reCAPTCHA errored');
                      setError('reCAPTCHA failed to load. Please try again.');
                      resetRecaptcha();
                    }}
                    onExpired={() => {
                      console.log('reCAPTCHA token expired');
                      resetRecaptcha();
                      executeRecaptcha();
                    }}
                    hl={language === 'en' ? 'en' : 'fil'}
                  />
                  <p className="text-xs text-blue-600">
                    By clicking the Sign Up button, you therefore agree to the Privacy Policy. For more information, read about privacy{' '}
                    <a href="#" className="underline">here</a>.
                  </p>
                  <button
                    type="submit"
                    className="w-full p-3 bg-blue-500 text-white rounded-lg text-base hover:bg-blue-600 transition-colors"
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