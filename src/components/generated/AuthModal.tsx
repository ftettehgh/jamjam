"use client";

import React, { useState } from 'react';
import { X, Mail, Lock, Phone, Fingerprint, Apple, Facebook, Chrome, Send, Eye, EyeOff, User, ArrowLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
export interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (user: any) => void;
  initialMode?: 'login' | 'signup';
  onModeChange?: (mode: 'login' | 'signup') => void;
}
type AuthMode = 'initial' | 'email' | 'phone' | 'magic-link';
export const AuthModal = ({
  isOpen,
  onClose,
  onSuccess,
  initialMode = 'signup',
  onModeChange
}: AuthModalProps) => {
  const [mode, setMode] = useState<'login' | 'signup'>(initialMode);
  const [authMethod, setAuthMethod] = useState<AuthMode>('initial');
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: ''
  });
  const [magicLinkSent, setMagicLinkSent] = useState(false);
  const [phoneCodeSent, setPhoneCodeSent] = useState(false);
  const [verificationCode, setVerificationCode] = useState('');
  const [biometricAvailable] = useState(typeof window !== 'undefined' && ('credentials' in navigator || 'PublicKeyCredential' in window));
  const [becomeDeliveryPartner, setBecomeDeliveryPartner] = useState(false);
  const handleSocialLogin = (provider: string) => {
    console.log(`Logging in with ${provider}`);
    // Simulate social login
    setTimeout(() => {
      onSuccess?.({
        provider,
        authenticated: true,
        becomeDeliveryPartner: mode === 'signup' ? becomeDeliveryPartner : false
      });
      onClose();
    }, 1000);
  };
  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Email/Password auth', formData);
    onSuccess?.({
      method: 'email',
      ...formData,
      becomeDeliveryPartner: mode === 'signup' ? becomeDeliveryPartner : false
    });
    onClose();
  };
  const handleMagicLink = (e: React.FormEvent) => {
    e.preventDefault();
    setMagicLinkSent(true);
    console.log('Magic link sent to:', formData.email);
  };
  const handlePhoneSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!phoneCodeSent) {
      setPhoneCodeSent(true);
      console.log('SMS code sent to:', formData.phone);
    } else {
      console.log('Verifying code:', verificationCode);
      onSuccess?.({
        method: 'phone',
        phone: formData.phone,
        becomeDeliveryPartner: mode === 'signup' ? becomeDeliveryPartner : false
      });
      onClose();
    }
  };
  const handleBiometric = async () => {
    try {
      // Simulate biometric authentication
      console.log('Initiating biometric authentication...');
      // In a real implementation, you'd use WebAuthn API
      setTimeout(() => {
        onSuccess?.({
          method: 'biometric',
          authenticated: true,
          becomeDeliveryPartner: mode === 'signup' ? becomeDeliveryPartner : false
        });
        onClose();
      }, 1000);
    } catch (error) {
      console.error('Biometric authentication failed:', error);
    }
  };
  const resetToInitial = () => {
    setAuthMethod('initial');
    setMagicLinkSent(false);
    setPhoneCodeSent(false);
    setVerificationCode('');
  };
  if (!isOpen) return null;
  return <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div initial={{
        opacity: 0
      }} animate={{
        opacity: 1
      }} exit={{
        opacity: 0
      }} onClick={onClose} className="absolute inset-0 bg-black/80 backdrop-blur-sm" />

        {/* Modal */}
        <motion.div initial={{
        opacity: 0,
        scale: 0.95,
        y: 20
      }} animate={{
        opacity: 1,
        scale: 1,
        y: 0
      }} exit={{
        opacity: 0,
        scale: 0.95,
        y: 20
      }} className="relative w-full max-w-md bg-[#1f1f1f] rounded-3xl border border-gray-800 shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto">
          {/* Close Button */}
          <button onClick={onClose} className="absolute top-4 right-4 z-10 p-2 hover:bg-[#2a2a2a] rounded-full transition-colors text-gray-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>

          {/* Header */}
          <div className="bg-gradient-to-br from-pink-600 to-pink-500 p-6 relative overflow-hidden">
            <div className="absolute inset-0 opacity-10">
              <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <pattern id="auth-dots" width="20" height="20" patternUnits="userSpaceOnUse">
                    <circle cx="2" cy="2" r="1" fill="white" />
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#auth-dots)" />
              </svg>
            </div>
            <div className="relative z-10">
              {authMethod !== 'initial' && <button onClick={resetToInitial} className="mb-2 p-1 hover:bg-white/20 rounded-full transition-colors">
                  <ArrowLeft className="w-5 h-5 text-white" />
                </button>}
              <h2 className="text-2xl font-bold text-white mb-1">
                {authMethod === 'initial' ? mode === 'signup' ? 'Create Account' : 'Sign In' : authMethod === 'email' ? mode === 'signup' ? 'Sign Up with Email' : 'Sign In with Email' : authMethod === 'phone' ? mode === 'signup' ? 'Sign Up with Phone' : 'Sign In with Phone' : authMethod === 'magic-link' ? 'Magic Link Sign In' : mode === 'signup' ? 'Create Account' : 'Sign In'}
              </h2>
              <p className="text-pink-100 text-sm">
                {authMethod === 'initial' ? mode === 'signup' ? 'Join JamJam for your regional deliveries needs' : 'Sign in to continue your journey' : authMethod === 'email' ? mode === 'signup' ? 'Create your account with email and password' : 'Enter your credentials to continue' : authMethod === 'phone' ? phoneCodeSent ? 'Enter the verification code sent to your phone' : 'We\'ll send you a verification code' : authMethod === 'magic-link' ? magicLinkSent ? 'Check your email for the magic link' : 'We\'ll send you a passwordless sign-in link' : mode === 'signup' ? 'Join JamJam for your regional deliveries needs' : 'Sign in to continue your journey'}
              </p>
            </div>
          </div>

          {/* Content */}
          <div className="p-6">
            <AnimatePresence mode="wait">
              {/* Initial Mode - Show all auth options */}
              {authMethod === 'initial' && <motion.div key="initial" initial={{
              opacity: 0,
              x: -20
            }} animate={{
              opacity: 1,
              x: 0
            }} exit={{
              opacity: 0,
              x: 20
            }} className="space-y-4">
                  {/* Social Logins */}
                  <div className="space-y-3">
                    <p className="text-xs text-gray-400 uppercase font-bold mb-3">
                      Quick {mode === 'signup' ? 'Sign Up' : 'Login'} with
                    </p>
                    
                    <button onClick={() => handleSocialLogin('Google')} className="w-full flex items-center justify-center gap-3 px-4 py-3 bg-white hover:bg-gray-50 text-gray-800 font-medium rounded-xl transition-all border border-gray-300">
                      <Chrome className="w-5 h-5 text-blue-600" />
                      Continue with Google
                    </button>

                    <button onClick={() => handleSocialLogin('Apple')} className="w-full flex items-center justify-center gap-3 px-4 py-3 bg-black hover:bg-gray-900 text-white font-medium rounded-xl transition-all border border-gray-700">
                      <Apple className="w-5 h-5" />
                      Continue with Apple
                    </button>

                    <button onClick={() => handleSocialLogin('Facebook')} className="w-full flex items-center justify-center gap-3 px-4 py-3 bg-[#1877F2] hover:bg-[#166FE5] text-white font-medium rounded-xl transition-all">
                      <Facebook className="w-5 h-5" />
                      Continue with Facebook
                    </button>
                  </div>

                  {/* Divider */}
                  <div className="relative my-6">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-gray-700"></div>
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                      <span className="bg-[#1f1f1f] px-4 text-gray-400 font-bold">Or</span>
                    </div>
                  </div>

                  {/* Other Auth Methods */}
                  <div className="space-y-3">
                    <button onClick={() => setAuthMethod('email')} className="w-full flex items-center gap-3 px-4 py-3 bg-[#2a2a2a] hover:bg-[#333] text-white font-medium rounded-xl transition-all border border-gray-700">
                      <Mail className="w-5 h-5 text-pink-400" />
                      <span className="flex-1 text-left">Email & Password</span>
                    </button>

                    <button onClick={() => setAuthMethod('phone')} className="w-full flex items-center gap-3 px-4 py-3 bg-[#2a2a2a] hover:bg-[#333] text-white font-medium rounded-xl transition-all border border-gray-700">
                      <Phone className="w-5 h-5 text-green-400" />
                      <span className="flex-1 text-left">Phone Number (SMS)</span>
                    </button>

                    <button onClick={() => setAuthMethod('magic-link')} className="w-full flex items-center gap-3 px-4 py-3 bg-[#2a2a2a] hover:bg-[#333] text-white font-medium rounded-xl transition-all border border-gray-700">
                      <Send className="w-5 h-5 text-blue-400" />
                      <span className="flex-1 text-left">Magic Link (Email)</span>
                    </button>

                    {biometricAvailable && <button onClick={handleBiometric} className="w-full flex items-center gap-3 px-4 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-medium rounded-xl transition-all shadow-lg">
                        <Fingerprint className="w-5 h-5" />
                        <span className="flex-1 text-left">Biometric Authentication</span>
                      </button>}
                  </div>

                  {mode === 'signup' && <div className="mt-6 p-4 bg-[#2a2a2a] border border-gray-700 rounded-xl">
                      <button type="button" onClick={() => setBecomeDeliveryPartner(!becomeDeliveryPartner)} className={`w-full p-4 rounded-xl border-2 transition-all text-left ${becomeDeliveryPartner ? 'bg-[#2a2a2a] border-pink-600' : 'bg-[#2a2a2a] border-gray-700 hover:border-gray-600'}`}>
                        <span className={`font-bold ${becomeDeliveryPartner ? 'text-pink-400' : 'text-gray-300'}`}>
                          Become A Delivery Partner
                        </span>
                        <span className="block text-xs text-gray-500 mt-0.5">
                          Start earning by delivering packages on your schedule
                        </span>
                      </button>
                    </div>}
                </motion.div>}

              {/* Email/Password Form */}
              {authMethod === 'email' && <motion.form key="email" initial={{
              opacity: 0,
              x: -20
            }} animate={{
              opacity: 1,
              x: 0
            }} exit={{
              opacity: 0,
              x: 20
            }} onSubmit={handleEmailSubmit} className="space-y-4">
                  {mode === 'signup' && <div>
                      <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-2">
                        Full Name
                      </label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                        <input type="text" value={formData.name} onChange={e => setFormData({
                    ...formData,
                    name: e.target.value
                  })} placeholder="John Doe" className="w-full pl-10 pr-4 py-3 bg-[#2a2a2a] border border-gray-700 rounded-xl focus:ring-2 focus:ring-pink-500 focus:outline-none text-white placeholder-gray-500" required />
                      </div>
                    </div>}

                  <div>
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-2">
                      Email Address
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                      <input type="email" value={formData.email} onChange={e => setFormData({
                    ...formData,
                    email: e.target.value
                  })} placeholder="john@example.com" className="w-full pl-10 pr-4 py-3 bg-[#2a2a2a] border border-gray-700 rounded-xl focus:ring-2 focus:ring-pink-500 focus:outline-none text-white placeholder-gray-500" required />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-2">
                      Password
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                      <input type={showPassword ? 'text' : 'password'} value={formData.password} onChange={e => setFormData({
                    ...formData,
                    password: e.target.value
                  })} placeholder="••••••••" className="w-full pl-10 pr-12 py-3 bg-[#2a2a2a] border border-gray-700 rounded-xl focus:ring-2 focus:ring-pink-500 focus:outline-none text-white placeholder-gray-500" required />
                      <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300">
                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>

                  {mode === 'signup' && <div>
                      <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-2">
                        Confirm Password
                      </label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                        <input type={showPassword ? 'text' : 'password'} value={formData.confirmPassword} onChange={e => setFormData({
                    ...formData,
                    confirmPassword: e.target.value
                  })} placeholder="••••••••" className="w-full pl-10 pr-4 py-3 bg-[#2a2a2a] border border-gray-700 rounded-xl focus:ring-2 focus:ring-pink-500 focus:outline-none text-white placeholder-gray-500" required />
                      </div>
                    </div>}

                  {mode === 'signup' && <div className="pt-2">
                      <button type="button" onClick={() => setBecomeDeliveryPartner(!becomeDeliveryPartner)} className={`w-full p-4 rounded-xl border-2 transition-all text-left ${becomeDeliveryPartner ? 'bg-[#2a2a2a] border-pink-600' : 'bg-[#2a2a2a] border-gray-700 hover:border-gray-600'}`}>
                        <span className={`font-bold ${becomeDeliveryPartner ? 'text-pink-400' : 'text-gray-300'}`}>
                          Become A Delivery Partner
                        </span>
                        <span className="block text-xs text-gray-500 mt-0.5">
                          Start earning by delivering packages on your schedule
                        </span>
                      </button>
                    </div>}

                  {mode === 'login' && <div className="text-right">
                      <button type="button" onClick={() => setAuthMethod('magic-link')} className="text-sm text-pink-400 hover:text-pink-300 font-medium">
                        Forgot password?
                      </button>
                    </div>}

                  <button type="submit" className="w-full py-3 bg-gradient-to-r from-pink-600 to-pink-500 hover:from-pink-700 hover:to-pink-600 text-white font-bold rounded-xl shadow-lg shadow-pink-900/50 transition-all">
                    {mode === 'signup' ? 'Create Account' : 'Sign In'}
                  </button>
                </motion.form>}

              {/* Phone Number Form */}
              {authMethod === 'phone' && <motion.form key="phone" initial={{
              opacity: 0,
              x: -20
            }} animate={{
              opacity: 1,
              x: 0
            }} exit={{
              opacity: 0,
              x: 20
            }} onSubmit={handlePhoneSubmit} className="space-y-4">
                  {!phoneCodeSent ? <>
                      <div>
                        <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-2">
                          Phone Number
                        </label>
                        <div className="relative">
                          <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                          <input type="tel" value={formData.phone} onChange={e => setFormData({
                      ...formData,
                      phone: e.target.value
                    })} placeholder="+1 (555) 000-0000" className="w-full pl-10 pr-4 py-3 bg-[#2a2a2a] border border-gray-700 rounded-xl focus:ring-2 focus:ring-pink-500 focus:outline-none text-white placeholder-gray-500" required />
                        </div>
                        <p className="text-xs text-gray-500 mt-2">
                          We'll send you a verification code via SMS
                        </p>
                      </div>
                      <button type="submit" className="w-full py-3 bg-gradient-to-r from-pink-600 to-pink-500 hover:from-pink-700 hover:to-pink-600 text-white font-bold rounded-xl shadow-lg shadow-pink-900/50 transition-all">
                        Send Code
                      </button>
                    </> : <>
                      <div className="text-center mb-4">
                        <p className="text-sm text-gray-400">
                          Enter the 6-digit code sent to
                        </p>
                        <p className="text-white font-bold">{formData.phone}</p>
                      </div>
                      <div>
                        <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-2">
                          Verification Code
                        </label>
                        <input type="text" value={verificationCode} onChange={e => setVerificationCode(e.target.value)} placeholder="000000" maxLength={6} className="w-full px-4 py-3 bg-[#2a2a2a] border border-gray-700 rounded-xl focus:ring-2 focus:ring-pink-500 focus:outline-none text-white placeholder-gray-500 text-center text-2xl tracking-widest" required />
                      </div>
                      <button type="submit" className="w-full py-3 bg-gradient-to-r from-pink-600 to-pink-500 hover:from-pink-700 hover:to-pink-600 text-white font-bold rounded-xl shadow-lg shadow-pink-900/50 transition-all">
                        Verify & Continue
                      </button>
                      <button type="button" onClick={() => setPhoneCodeSent(false)} className="w-full text-sm text-gray-400 hover:text-white font-medium">
                        Didn't receive code? Resend
                      </button>
                    </>}
                </motion.form>}

              {/* Magic Link Form */}
              {authMethod === 'magic-link' && <motion.div key="magic-link" initial={{
              opacity: 0,
              x: -20
            }} animate={{
              opacity: 1,
              x: 0
            }} exit={{
              opacity: 0,
              x: 20
            }} className="space-y-4">
                  {!magicLinkSent ? <form onSubmit={handleMagicLink} className="space-y-4">
                      <div>
                        <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-2">
                          Email Address
                        </label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                          <input type="email" value={formData.email} onChange={e => setFormData({
                      ...formData,
                      email: e.target.value
                    })} placeholder="john@example.com" className="w-full pl-10 pr-4 py-3 bg-[#2a2a2a] border border-gray-700 rounded-xl focus:ring-2 focus:ring-pink-500 focus:outline-none text-white placeholder-gray-500" required />
                        </div>
                        <p className="text-xs text-gray-500 mt-2">
                          We'll send you a magic link for passwordless sign-in
                        </p>
                      </div>
                      <button type="submit" className="w-full py-3 bg-gradient-to-r from-pink-600 to-pink-500 hover:from-pink-700 hover:to-pink-600 text-white font-bold rounded-xl shadow-lg shadow-pink-900/50 transition-all flex items-center justify-center gap-2">
                        <Send className="w-5 h-5" />
                        Send Magic Link
                      </button>
                    </form> : <div className="text-center py-6">
                      <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Send className="w-8 h-8 text-green-400" />
                      </div>
                      <h3 className="text-xl font-bold text-white mb-2">Check your email!</h3>
                      <p className="text-gray-400 mb-1">
                        We've sent a magic link to
                      </p>
                      <p className="text-white font-bold mb-4">{formData.email}</p>
                      <p className="text-sm text-gray-500">
                        Click the link in your email to sign in securely without a password.
                      </p>
                      <button onClick={() => setMagicLinkSent(false)} className="mt-6 text-sm text-pink-400 hover:text-pink-300 font-medium">
                        Resend magic link
                      </button>
                    </div>}
                </motion.div>}
            </AnimatePresence>

            {/* Toggle between Login/Signup */}
            {authMethod === 'initial' && <div className="mt-6 text-center">
                <p className="text-gray-400 text-sm">
                  {mode === 'signup' ? 'Already have an account?' : "Don't have an account?"}{' '}
                  <button onClick={() => {
                const newMode = mode === 'signup' ? 'login' : 'signup';
                setMode(newMode);
                onModeChange?.(newMode);
              }} className="text-pink-400 hover:text-pink-300 font-bold">
                    {mode === 'signup' ? 'Sign In' : 'Sign Up'}
                  </button>
                </p>
              </div>}

            {/* Terms & Privacy */}
            {mode === 'signup' && <p className="mt-6 text-xs text-gray-500 text-center">
                By continuing, you agree to our{' '}
                <a href="#" className="text-pink-400 hover:text-pink-300">Terms of Service</a>
                {' '}and{' '}
                <a href="#" className="text-pink-400 hover:text-pink-300">Privacy Policy</a>
              </p>}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>;
};