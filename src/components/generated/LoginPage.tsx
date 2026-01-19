"use client";

import React, { useState } from 'react';
import { Mail, Lock, Eye, EyeOff, User, Apple, Facebook, Chrome, Send, Phone, Fingerprint, ArrowLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
export interface LoginPageProps {
  onLoginSuccess?: (user: any) => void;
  onNavigateToSignup?: () => void;
}
type AuthMode = 'initial' | 'email' | 'phone' | 'magic-link';
export const LoginPage = ({
  onLoginSuccess,
  onNavigateToSignup
}: LoginPageProps) => {
  const [authMethod, setAuthMethod] = useState<AuthMode>('initial');
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    phone: '',
    password: ''
  });
  const [magicLinkSent, setMagicLinkSent] = useState(false);
  const [phoneCodeSent, setPhoneCodeSent] = useState(false);
  const [verificationCode, setVerificationCode] = useState('');
  const [biometricAvailable] = useState(typeof window !== 'undefined' && ('credentials' in navigator || 'PublicKeyCredential' in window));
  const handleSocialLogin = (provider: string) => {
    console.log(`Logging in with ${provider}`);
    setTimeout(() => {
      onLoginSuccess?.({
        provider,
        authenticated: true
      });
    }, 1000);
  };
  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Email/Password login', formData);
    onLoginSuccess?.({
      method: 'email',
      ...formData
    });
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
      onLoginSuccess?.({
        method: 'phone',
        phone: formData.phone
      });
    }
  };
  const handleBiometric = async () => {
    try {
      console.log('Initiating biometric authentication...');
      setTimeout(() => {
        onLoginSuccess?.({
          method: 'biometric',
          authenticated: true
        });
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
  return <div className="min-h-screen bg-black text-white flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <motion.div initial={{
        opacity: 0,
        scale: 0.95,
        y: 20
      }} animate={{
        opacity: 1,
        scale: 1,
        y: 0
      }} className="bg-[#1f1f1f] rounded-3xl border border-gray-800 shadow-2xl overflow-hidden">
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
              <h2 className="text-2xl font-bold text-white mb-1">Welcome Back</h2>
              <p className="text-pink-100 text-sm">Sign in to continue your journey</p>
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
                      Quick Login with
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

                  <div className="text-right">
                    <button type="button" onClick={() => setAuthMethod('magic-link')} className="text-sm text-pink-400 hover:text-pink-300 font-medium">
                      Forgot password?
                    </button>
                  </div>

                  <button type="submit" className="w-full py-3 bg-gradient-to-r from-pink-600 to-pink-500 hover:from-pink-700 hover:to-pink-600 text-white font-bold rounded-xl shadow-lg shadow-pink-900/50 transition-all">
                    Sign In
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
                        <p className="text-sm text-gray-400">Enter the 6-digit code sent to</p>
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
                      <p className="text-gray-400 mb-1">We've sent a magic link to</p>
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

            {/* Toggle to Signup */}
            {authMethod === 'initial' && <div className="mt-6 text-center">
                <p className="text-gray-400 text-sm">
                  Don't have an account?{' '}
                  <button onClick={onNavigateToSignup} className="text-pink-400 hover:text-pink-300 font-bold">
                    Sign Up
                  </button>
                </p>
              </div>}
          </div>
        </motion.div>
      </div>
    </div>;
};