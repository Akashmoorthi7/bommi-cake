import React, { useState, useEffect } from 'react';
import { X, User, Lock, Eye, EyeOff, Sparkles, ArrowRight, ShieldCheck, AlertCircle, CheckCircle2, UserPlus, LogIn } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { playPopSound, playPowSound } from '../utils/sound';

export const AuthModal = () => {
  const {
    isLoginModalOpen,
    initialModalMode,
    closeLogin,
    loginWithCredentials,
    registerUser,
    registeredUsers,
  } = useAuth();

  // Mode: 'login' | 'register'
  const [mode, setMode] = useState(initialModalMode || 'login');

  // Login form state
  const [loginUsername, setLoginUsername] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [loginError, setLoginError] = useState(null); // { type: 'USER_NOT_FOUND' | 'INVALID_PASSWORD', message: '' }

  // Register form state
  const [regUsername, setRegUsername] = useState('');
  const [regDisplayName, setRegDisplayName] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirmPassword, setRegConfirmPassword] = useState('');
  const [showRegPassword, setShowRegPassword] = useState(false);
  const [regError, setRegError] = useState('');
  const [selectedAvatar, setSelectedAvatar] = useState('🦸‍♂️');

  // Reset form errors when switching modes or opening
  useEffect(() => {
    if (initialModalMode) {
      setMode(initialModalMode);
    }
  }, [initialModalMode, isLoginModalOpen]);

  useEffect(() => {
    setLoginError(null);
    setRegError('');
  }, [mode]);

  if (!isLoginModalOpen) return null;

  // Real-time security rules verification for registration password
  const hasMinLength = regPassword.length >= 6;
  const hasLetter = /[a-zA-Z]/.test(regPassword);
  const hasNumber = /[0-9]/.test(regPassword);
  const passwordsMatch = regPassword && regPassword === regConfirmPassword;
  
  // Real-time check if username is available
  const isUsernameTaken = regUsername.trim().length >= 3 && registeredUsers.some(
    (u) => u.username.toLowerCase() === regUsername.trim().toLowerCase()
  );

  // Handle Login submission
  const handleLoginSubmit = (e) => {
    e.preventDefault();
    setLoginError(null);

    if (!loginUsername.trim()) {
      setLoginError({ type: 'GENERAL', message: 'Please enter your username!' });
      return;
    }
    if (!loginPassword.trim()) {
      setLoginError({ type: 'GENERAL', message: 'Please enter your password!' });
      return;
    }

    playPowSound();
    const result = loginWithCredentials(loginUsername, loginPassword);

    if (!result.success) {
      setLoginError({
        type: result.error,
        message: result.message,
        suggestedUsername: loginUsername.trim(),
      });
    }
  };

  // Switch to Register with the attempted username pre-filled
  const handleSwitchToCreateAccount = (prefilledUsername = '') => {
    playPopSound();
    setMode('register');
    setLoginError(null);
    if (prefilledUsername) {
      setRegUsername(prefilledUsername);
      setRegDisplayName(prefilledUsername);
    }
  };

  // Handle Register submission
  const handleRegisterSubmit = (e) => {
    e.preventDefault();
    setRegError('');

    if (!regUsername.trim()) {
      setRegError('Please choose a username.');
      return;
    }

    if (isUsernameTaken) {
      setRegError(`The username "${regUsername}" is already taken. Please pick another!`);
      return;
    }

    if (!hasMinLength || !hasLetter || !hasNumber) {
      setRegError('Password does not meet required security rules (min 6 characters with letters and numbers).');
      return;
    }

    if (regPassword !== regConfirmPassword) {
      setRegError('Passwords do not match. Please re-type your confirm password.');
      return;
    }

    playPowSound();
    const result = registerUser({
      username: regUsername.trim(),
      password: regPassword,
      name: regDisplayName.trim() || regUsername.trim(),
      avatar: selectedAvatar,
    });

    if (!result.success) {
      setRegError(result.message);
    }
  };

  // 1-Click Fast Fill for existing demo accounts
  const handleFillDemo = (username, password) => {
    playPopSound();
    setMode('login');
    setLoginUsername(username);
    setLoginPassword(password);
    setLoginError(null);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="relative w-full max-w-md bg-white border-4 border-black rounded-3xl shadow-comic-xl overflow-hidden animate-pop my-6">
        
        {/* Comic Modal Header */}
        <div className="bg-comic-yellow border-b-4 border-black p-4 text-center relative">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-8 h-8 bg-comic-red text-white text-base rounded-lg border-2 border-black flex items-center justify-center font-comic shadow-comic-sm">
                🎂
              </span>
              <span className="font-comic text-xl text-black tracking-wider">
                BOMMI CAKE HQ
              </span>
            </div>

            <button
              onClick={() => { playPopSound(); closeLogin(); }}
              className="w-8 h-8 bg-white hover:bg-comic-red hover:text-white border-2 border-black rounded-full flex items-center justify-center font-black transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <h2 className="text-2xl sm:text-3xl font-comic tracking-wide text-black mt-2 leading-none uppercase">
            {mode === 'login' ? 'WELCOME BACK, HERO!' : 'JOIN THE CAKE LEAGUE!'}
          </h2>
          <p className="text-xs font-bold text-gray-700 mt-1">
            {mode === 'login'
              ? 'Enter your username & password to access your super account'
              : 'Create your unique superhero account for express cake ordering'}
          </p>
        </div>

        {/* Mode Selector Tabs: [Login] / [Create Account] */}
        <div className="grid grid-cols-2 bg-comic-cream border-b-3 border-black p-1.5 gap-2">
          <button
            type="button"
            onClick={() => { playPopSound(); setMode('login'); }}
            className={`comic-btn py-2 text-xs sm:text-sm rounded-xl flex items-center justify-center gap-1.5 transition-all ${
              mode === 'login'
                ? 'bg-comic-red text-white shadow-comic'
                : 'bg-white text-black hover:bg-comic-yellowLight'
            }`}
          >
            <LogIn className="w-4 h-4" />
            <span>LOGIN</span>
          </button>

          <button
            type="button"
            onClick={() => { playPopSound(); setMode('register'); }}
            className={`comic-btn py-2 text-xs sm:text-sm rounded-xl flex items-center justify-center gap-1.5 transition-all ${
              mode === 'register'
                ? 'bg-comic-blue text-white shadow-comic'
                : 'bg-white text-black hover:bg-comic-yellowLight'
            }`}
          >
            <UserPlus className="w-4 h-4" />
            <span>CREATE ACCOUNT</span>
          </button>
        </div>

        {/* Modal Form Body */}
        <div className="p-5 sm:p-6 space-y-4">

          {/* ======================= LOGIN VIEW ======================= */}
          {mode === 'login' && (
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              
              {/* Username Field */}
              <div>
                <label className="block text-xs font-comic text-gray-700 uppercase tracking-wider mb-1">
                  USERNAME
                </label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    value={loginUsername}
                    onChange={(e) => {
                      setLoginUsername(e.target.value);
                      if (loginError) setLoginError(null);
                    }}
                    placeholder="Enter your registered username"
                    className="w-full pl-10 pr-4 py-2.5 bg-white border-2 border-black rounded-xl text-xs sm:text-sm font-bold shadow-comic-sm focus:outline-none focus:ring-2 focus:ring-comic-red"
                  />
                  <User className="w-4 h-4 text-gray-500 absolute left-3.5 top-3" />
                </div>
              </div>

              {/* Password Field */}
              <div>
                <label className="block text-xs font-comic text-gray-700 uppercase tracking-wider mb-1">
                  PASSWORD
                </label>
                <div className="relative">
                  <input
                    type={showLoginPassword ? 'text' : 'password'}
                    required
                    value={loginPassword}
                    onChange={(e) => {
                      setLoginPassword(e.target.value);
                      if (loginError) setLoginError(null);
                    }}
                    placeholder="Enter your password"
                    className="w-full pl-10 pr-10 py-2.5 bg-white border-2 border-black rounded-xl text-xs sm:text-sm font-bold shadow-comic-sm focus:outline-none focus:ring-2 focus:ring-comic-red"
                  />
                  <Lock className="w-4 h-4 text-gray-500 absolute left-3.5 top-3" />
                  <button
                    type="button"
                    onClick={() => setShowLoginPassword(!showLoginPassword)}
                    className="absolute right-3 top-3 text-gray-500 hover:text-black"
                  >
                    {showLoginPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Error Message & Prompt to Create Account if not registered */}
              {loginError && (
                <div className="bg-red-50 border-2 border-comic-red rounded-xl p-3 text-xs space-y-2 animate-pop">
                  <div className="flex items-start gap-2 text-comic-red font-bold">
                    <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                    <span>{loginError.message}</span>
                  </div>

                  {/* If user not found, prominent button to create account */}
                  {loginError.type === 'USER_NOT_FOUND' && (
                    <div className="pt-1">
                      <button
                        type="button"
                        onClick={() => handleSwitchToCreateAccount(loginError.suggestedUsername)}
                        className="w-full comic-btn bg-comic-yellow hover:bg-comic-yellowLight text-black py-1.5 px-3 rounded-lg text-xs font-comic flex items-center justify-center gap-1 shadow-comic-sm"
                      >
                        <UserPlus className="w-3.5 h-3.5" />
                        <span>CREATE A NEW ACCOUNT WITH "{loginError.suggestedUsername}"</span>
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* Login Button */}
              <button
                type="submit"
                className="w-full comic-btn bg-comic-red hover:bg-comic-redDark text-white py-3 rounded-xl text-base shadow-comic flex items-center justify-center gap-2 cursor-pointer"
              >
                <Sparkles className="w-4 h-4 text-comic-yellow" />
                <span>LOGIN</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              {/* Option to Switch to Create Account */}
              <div className="text-center pt-1">
                <span className="text-xs font-bold text-gray-600">
                  New to Bommi Cake?{' '}
                </span>
                <button
                  type="button"
                  onClick={() => handleSwitchToCreateAccount()}
                  className="text-xs font-comic text-comic-blueDark underline hover:text-comic-red font-bold"
                >
                  Create an Account
                </button>
              </div>

              {/* Demo Credentials Helper Box */}
              <div className="bg-comic-cream border-2 border-dashed border-black rounded-xl p-3 text-xs space-y-1.5">
                <span className="font-comic text-[11px] text-gray-600 uppercase tracking-wider block">
                  💡 TEST WITH REGISTERED DEMO ACCOUNTS:
                </span>
                <div className="flex flex-col sm:flex-row gap-2">
                  <button
                    type="button"
                    onClick={() => handleFillDemo('Techwithakash', '123456789')}
                    className="flex-1 bg-white hover:bg-comic-yellow p-1.5 rounded-lg border border-black text-left text-[11px] font-bold"
                  >
                    <span className="text-comic-red block font-comic">🦸‍♀️ Techwithakash</span>
                    <span className="text-gray-500 font-normal">Pass: 123456789</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleFillDemo('alex_baker', 'ComicCake@2026')}
                    className="flex-1 bg-white hover:bg-comic-yellow p-1.5 rounded-lg border border-black text-left text-[11px] font-bold"
                  >
                    <span className="text-comic-blueDark block font-comic">🦸‍♂️ alex_baker</span>
                    <span className="text-gray-500 font-normal">Pass: ComicCake@2026</span>
                  </button>
                </div>
              </div>

            </form>
          )}

          {/* ======================= CREATE ACCOUNT VIEW ======================= */}
          {mode === 'register' && (
            <form onSubmit={handleRegisterSubmit} className="space-y-3.5">
              
              {/* Choose Avatar */}
              <div>
                <label className="block text-xs font-comic text-gray-700 uppercase tracking-wider mb-1">
                  CHOOSE SUPERHERO AVATAR
                </label>
                <div className="flex items-center gap-2">
                  {['🦸‍♂️', '🦸‍♀️', '🦹', '🧙', '👑', '🎂'].map((av) => (
                    <button
                      type="button"
                      key={av}
                      onClick={() => { playPopSound(); setSelectedAvatar(av); }}
                      className={`text-xl p-1.5 rounded-xl border-2 transition-transform ${
                        selectedAvatar === av
                          ? 'bg-comic-yellow border-black scale-110 shadow-comic-sm'
                          : 'bg-gray-50 border-gray-300 hover:bg-gray-100'
                      }`}
                    >
                      {av}
                    </button>
                  ))}
                </div>
              </div>

              {/* Username Field with Uniqueness Indicator */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-comic text-gray-700 uppercase tracking-wider">
                    NEW USERNAME *
                  </label>
                  {regUsername.trim().length >= 3 && (
                    <span className={`text-[10px] font-bold ${isUsernameTaken ? 'text-comic-red' : 'text-green-700'}`}>
                      {isUsernameTaken ? '✗ Username taken' : '✓ Username available!'}
                    </span>
                  )}
                </div>
                <div className="relative">
                  <input
                    type="text"
                    required
                    value={regUsername}
                    onChange={(e) => setRegUsername(e.target.value.replace(/\s+/g, '_'))}
                    placeholder="e.g. superhero_sam"
                    className={`w-full pl-10 pr-4 py-2 bg-white border-2 rounded-xl text-xs sm:text-sm font-bold shadow-comic-sm focus:outline-none ${
                      isUsernameTaken
                        ? 'border-comic-red ring-1 ring-comic-red'
                        : 'border-black focus:ring-2 focus:ring-comic-blue'
                    }`}
                  />
                  <User className="w-4 h-4 text-gray-500 absolute left-3.5 top-2.5" />
                </div>
              </div>

              {/* Display / Full Name Field */}
              <div>
                <label className="block text-xs font-comic text-gray-700 uppercase tracking-wider mb-1">
                  YOUR NAME / NICKNAME
                </label>
                <input
                  type="text"
                  value={regDisplayName}
                  onChange={(e) => setRegDisplayName(e.target.value)}
                  placeholder="e.g. Sam Wilson"
                  className="w-full px-3.5 py-2 bg-white border-2 border-black rounded-xl text-xs sm:text-sm font-bold shadow-comic-sm focus:outline-none focus:ring-2 focus:ring-comic-blue"
                />
              </div>

              {/* Password Field */}
              <div>
                <label className="block text-xs font-comic text-gray-700 uppercase tracking-wider mb-1">
                  PASSWORD *
                </label>
                <div className="relative">
                  <input
                    type={showRegPassword ? 'text' : 'password'}
                    required
                    value={regPassword}
                    onChange={(e) => setRegPassword(e.target.value)}
                    placeholder="Create a strong password"
                    className="w-full pl-10 pr-10 py-2 bg-white border-2 border-black rounded-xl text-xs sm:text-sm font-bold shadow-comic-sm focus:outline-none focus:ring-2 focus:ring-comic-blue"
                  />
                  <Lock className="w-4 h-4 text-gray-500 absolute left-3.5 top-2.5" />
                  <button
                    type="button"
                    onClick={() => setShowRegPassword(!showRegPassword)}
                    className="absolute right-3 top-2.5 text-gray-500 hover:text-black"
                  >
                    {showRegPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>

                {/* Password Security Rules Checklist */}
                <div className="mt-2 bg-gray-50 border border-black/20 rounded-lg p-2 text-[11px] font-bold space-y-1">
                  <span className="text-[10px] text-gray-500 font-comic uppercase block">
                    Security Rules:
                  </span>
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className={`w-3 h-3 ${hasMinLength ? 'text-green-600' : 'text-gray-400'}`} />
                    <span className={hasMinLength ? 'text-green-800' : 'text-gray-600'}>
                      At least 6 characters
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className={`w-3 h-3 ${hasLetter ? 'text-green-600' : 'text-gray-400'}`} />
                    <span className={hasLetter ? 'text-green-800' : 'text-gray-600'}>
                      Contains at least one letter (a-z, A-Z)
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className={`w-3 h-3 ${hasNumber ? 'text-green-600' : 'text-gray-400'}`} />
                    <span className={hasNumber ? 'text-green-800' : 'text-gray-600'}>
                      Contains at least one number (0-9)
                    </span>
                  </div>
                </div>
              </div>

              {/* Confirm Password Field */}
              <div>
                <label className="block text-xs font-comic text-gray-700 uppercase tracking-wider mb-1">
                  CONFIRM PASSWORD *
                </label>
                <div className="relative">
                  <input
                    type="password"
                    required
                    value={regConfirmPassword}
                    onChange={(e) => setRegConfirmPassword(e.target.value)}
                    placeholder="Re-enter your password"
                    className="w-full pl-10 pr-4 py-2 bg-white border-2 border-black rounded-xl text-xs sm:text-sm font-bold shadow-comic-sm focus:outline-none focus:ring-2 focus:ring-comic-blue"
                  />
                  <Lock className="w-4 h-4 text-gray-500 absolute left-3.5 top-2.5" />
                </div>
                {regConfirmPassword && (
                  <p className={`text-[10px] font-bold mt-1 ${passwordsMatch ? 'text-green-700' : 'text-comic-red'}`}>
                    {passwordsMatch ? '✓ Passwords match!' : '✗ Passwords do not match'}
                  </p>
                )}
              </div>

              {/* Registration Error Display */}
              {regError && (
                <div className="bg-red-50 border-2 border-comic-red rounded-xl p-2.5 text-xs text-comic-red font-bold flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{regError}</span>
                </div>
              )}

              {/* Create Account Button */}
              <button
                type="submit"
                className="w-full comic-btn bg-comic-blue hover:bg-comic-blueDark text-white py-3 rounded-xl text-base shadow-comic flex items-center justify-center gap-2 cursor-pointer mt-1"
              >
                <UserPlus className="w-4 h-4" />
                <span>CREATE ACCOUNT & START ORDERING</span>
              </button>

              {/* Switch back to Login */}
              <div className="text-center pt-1">
                <span className="text-xs font-bold text-gray-600">
                  Already have an account?{' '}
                </span>
                <button
                  type="button"
                  onClick={() => { playPopSound(); setMode('login'); }}
                  className="text-xs font-comic text-comic-red underline hover:text-black font-bold"
                >
                  Login here
                </button>
              </div>

            </form>
          )}

          <div className="flex items-center justify-center gap-1.5 text-[11px] font-bold text-gray-500 pt-1 border-t border-gray-200">
            <ShieldCheck className="w-3.5 h-3.5 text-comic-green" />
            <span>Secure Superhero Credential Vault • Bommi Cake</span>
          </div>

        </div>

      </div>
    </div>
  );
};
