"use client";

import React, { useState } from 'react';
import { DollarSign, Clock, Shield, TrendingUp, User, Building2, Mail, Phone, MapPin, ChevronRight, Bike, Car, Truck, FileText, Plus, Minus, ShoppingBag } from 'lucide-react';
import { motion } from 'framer-motion';
import { ConfettiCelebration } from './ConfettiCelebration';
export const DeliveryPartnerPage = () => {
  const [selectedType, setSelectedType] = useState<'individual' | 'company'>('individual');
  const [formStep, setFormStep] = useState(1);

  // Step 1 Form state
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [address, setAddress] = useState('');

  // OTP Verification state
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);

  // Step 2 Form state
  const [vehicleQuantities, setVehicleQuantities] = useState<Record<string, number>>({});
  const [experience, setExperience] = useState('');
  const [licenseNumber, setLicenseNumber] = useState('');
  const [coverageArea, setCoverageArea] = useState('');
  const [coverageType, setCoverageType] = useState<'region-to-region' | 'door-to-door' | ''>('');
  const [regionToRegion, setRegionToRegion] = useState<Array<{
    region: string;
    twoWay: boolean;
  }>>([{
    region: '',
    twoWay: false
  }, {
    region: '',
    twoWay: false
  }]);
  const [doorToDoor, setDoorToDoor] = useState<string[]>(['']);
  const [hasAPI, setHasAPI] = useState<'yes' | 'no' | ''>('');
  const [apiDetails, setApiDetails] = useState('');
  const [deliversToAllCapitals, setDeliversToAllCapitals] = useState(false);

  // Step 3 Form state
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  // Celebration state
  const [showCelebration, setShowCelebration] = useState(false);

  // Function to scroll to the application form
  const scrollToApplication = () => {
    const applicationSection = document.getElementById('partner-application');
    if (applicationSection) {
      applicationSection.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  };
  const vehicleOptions = [{
    id: 'motorcycle',
    label: 'Motorcycle',
    icon: '🏍️'
  }, {
    id: 'bicycle',
    label: 'Bicycle',
    icon: '🚲'
  }, {
    id: 'car',
    label: 'Car',
    icon: '🚗'
  }, {
    id: 'van',
    label: 'Van',
    icon: '🚐'
  }, {
    id: 'truck',
    label: 'Truck',
    icon: '🚚'
  }];
  const experienceOptions = [{
    id: 'beginner',
    label: 'Beginner',
    subtitle: '0-1 years'
  }, {
    id: 'intermediate',
    label: 'Intermediate',
    subtitle: '1-3 years'
  }, {
    id: 'experienced',
    label: 'Experienced',
    subtitle: '3-5 years'
  }, {
    id: 'expert',
    label: 'Expert',
    subtitle: '5+ years'
  }];

  // Get selected vehicles (vehicles with quantity > 0)
  const selectedVehicles = Object.keys(vehicleQuantities).filter(id => vehicleQuantities[id] > 0);
  const toggleVehicle = (vehicleId: string) => {
    setVehicleQuantities(prev => {
      const currentQuantity = prev[vehicleId] || 0;
      if (currentQuantity > 0) {
        // Remove vehicle
        const newQuantities = {
          ...prev
        };
        delete newQuantities[vehicleId];
        return newQuantities;
      } else {
        // Add vehicle
        // For individual riders, only allow one vehicle selection
        if (selectedType === 'individual') {
          return {
            [vehicleId]: 1
          };
        }
        // For companies, allow multiple vehicles
        return {
          ...prev,
          [vehicleId]: 1
        };
      }
    });
  };
  const handleContinueStep1 = () => {
    // Validate step 1 fields - email is optional for individual riders
    const isValid = fullName && phoneNumber && address && (selectedType === 'company' ? email : true);
    if (isValid) {
      // Show OTP modal for phone verification
      setShowOtpModal(true);
      setOtpSent(true);
      // In a real app, trigger OTP send to phone number here
      console.log('OTP sent to:', phoneNumber);
    }
  };
  const handleVerifyOtp = () => {
    // In a real app, verify OTP with backend
    if (otp.length === 6) {
      setOtpVerified(true);
      setShowOtpModal(false);
      setFormStep(2);
      console.log('OTP verified:', otp);
    }
  };
  const handleCloseOtpModal = () => {
    setShowOtpModal(false);
    setOtp('');
  };
  const handleContinueStep2 = () => {
    // Validate step 2 fields
    if (selectedVehicles.length > 0) {
      if (selectedType === 'company' && hasAPI === '') {
        return; // Require API selection for companies
      }
      setFormStep(3);
    }
  };
  const handleBackToStep1 = () => {
    setFormStep(1);
  };
  const handleBackToStep2 = () => {
    setFormStep(2);
  };
  const handleSubmit = () => {
    if (agreedToTerms) {
      // Handle form submission
      console.log('Application submitted');
      setShowCelebration(true);
    }
  };
  const handleCelebrationClose = () => {
    setShowCelebration(false);
    // Reset form
    setFormStep(1);
    setFullName('');
    setEmail('');
    setPhoneNumber('');
    setAddress('');
    setVehicleQuantities({});
    setExperience('');
    setLicenseNumber('');
    setCoverageArea('');
    setCoverageType('');
    setRegionToRegion([{
      region: '',
      twoWay: false
    }, {
      region: '',
      twoWay: false
    }]);
    setDoorToDoor(['']);
    setHasAPI('');
    setApiDetails('');
    setAgreedToTerms(false);
    setOtpVerified(false);
    setOtp('');
    setOtpSent(false);
    setDeliversToAllCapitals(false);
  };

  // Functions to manage region-to-region pairs
  const addRegionPair = () => {
    setRegionToRegion([...regionToRegion, {
      region: '',
      twoWay: false
    }]);
  };
  const removeRegionPair = (index: number) => {
    if (regionToRegion.length > 1) {
      setRegionToRegion(regionToRegion.filter((_, i) => i !== index));
    }
  };
  const updateRegionPair = (index: number, field: 'region' | 'twoWay', value: string | boolean) => {
    const updated = [...regionToRegion];
    if (field === 'region') {
      updated[index][field] = value as string;
    } else {
      updated[index][field] = value as boolean;
    }
    setRegionToRegion(updated);
  };

  // Functions to manage door-to-door areas
  const addDoorToDoorArea = () => {
    setDoorToDoor([...doorToDoor, '']);
  };
  const removeDoorToDoorArea = (index: number) => {
    if (doorToDoor.length > 1) {
      setDoorToDoor(doorToDoor.filter((_, i) => i !== index));
    }
  };
  const updateDoorToDoorArea = (index: number, value: string) => {
    const updated = [...doorToDoor];
    updated[index] = value;
    setDoorToDoor(updated);
  };
  return <div className="min-h-screen bg-black text-white">
      {/* Confetti Celebration */}
      <ConfettiCelebration isVisible={showCelebration} onClose={handleCelebrationClose} title="Congratulations!" message="Your application to become a JamJam Delivery Partner has been submitted successfully! We'll review it and get back to you within 72 hours." />

      {/* OTP Verification Modal */}
      {showOtpModal && <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <motion.div initial={{
        opacity: 0,
        scale: 0.9
      }} animate={{
        opacity: 1,
        scale: 1
      }} className="bg-[#1f1f1f] p-8 rounded-3xl border border-gray-800 max-w-md w-full">
            <h3 className="text-2xl font-bold mb-2">Verify Phone Number</h3>
            <p className="text-gray-400 text-sm mb-6">
              We've sent a 6-digit code to {phoneNumber}
            </p>
            
            <div className="mb-6">
              <label className="text-sm font-medium text-gray-300 mb-2 block">
                Enter OTP Code
              </label>
              <input type="text" value={otp} onChange={e => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))} placeholder="000000" maxLength={6} className="w-full px-4 py-4 bg-[#2a2a2a] border border-gray-700 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent focus:outline-none transition-all text-white placeholder-gray-500 text-center text-2xl tracking-widest" />
            </div>

            <div className="flex gap-3">
              <button onClick={handleCloseOtpModal} className="flex-1 px-6 py-3 bg-[#2a2a2a] text-gray-300 rounded-xl hover:bg-[#333333] transition-all font-medium">
                Cancel
              </button>
              <button onClick={handleVerifyOtp} disabled={otp.length !== 6} className={`flex-1 px-6 py-3 rounded-xl font-bold transition-all ${otp.length === 6 ? 'bg-gradient-to-r from-[#4a5568] to-[#2d3748] hover:from-[#5a6578] hover:to-[#3d4758] text-white' : 'bg-[#2a2a2a] text-gray-600 cursor-not-allowed'}`}>
                Verify
              </button>
            </div>
          </motion.div>
        </div>}

      {/* Hero Section */}
      <div className="py-8 px-4 md:px-8 text-center relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="hero-pattern" width="40" height="40" patternUnits="userSpaceOnUse">
                <circle cx="20" cy="20" r="1" fill="white" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#hero-pattern)" />
          </svg>
        </div>

        <div className="relative z-10 max-w-4xl mx-auto">
          {/* Become a Delivery Partner Button */}
          <motion.div initial={{
          opacity: 0,
          y: -20
        }} animate={{
          opacity: 1,
          y: 0
        }} className="inline-flex items-center gap-2 px-6 py-3 mb-6 bg-pink-600/20 border border-pink-600/50 text-pink-400 rounded-full text-base font-semibold">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            Become a Delivery Partner
          </motion.div>

          <motion.h1 initial={{
          opacity: 0,
          y: 20
        }} animate={{
          opacity: 1,
          y: 0
        }} transition={{
          delay: 0.1
        }} className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
            Earn Money Delivering with JamJam
          </motion.h1>

          <motion.p initial={{
          opacity: 0,
          y: 20
        }} animate={{
          opacity: 1,
          y: 0
        }} transition={{
          delay: 0.2
        }} className="text-gray-400 text-lg mb-8 max-w-2xl mx-auto leading-relaxed">
            Join our network of delivery partners and start earning on your own schedule.
          </motion.p>
        </div>
      </div>

      {/* Application Form Section */}
      <div id="partner-application" className="py-8 px-4 md:px-8 pb-20">
        <div className="max-w-4xl mx-auto">
          <div className="bg-[#1f1f1f] p-6 md:p-10 rounded-3xl border border-gray-800">
            {/* Header */}
            <div className="mb-8">
              <h2 className="text-2xl md:text-3xl font-bold mb-2">Partner Application</h2>
              <p className="text-gray-400 text-sm">
                {formStep === 1 && 'Tell us about yourself'}
                {formStep === 2 && 'Your delivery capabilities'}
                {formStep === 3 && 'Review and submit'}
              </p>
            </div>

            {/* Step Indicators */}
            <div className="flex items-center justify-end gap-3 mb-8">
              {[1, 2, 3].map(step => <div key={step} className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all ${step < formStep ? 'bg-pink-600 text-white' : step === formStep ? 'bg-pink-600 text-white' : 'bg-[#2a2a2a] text-gray-600 border border-gray-700'}`}>
                  {step < formStep ? '✓' : step}
                </div>)}
            </div>

            {/* Step 1: Basic Information */}
            {formStep === 1 && <div>
                {/* Registration Type Selection */}
                <div className="mb-8">
                  <label className="text-sm font-medium text-gray-400 mb-3 block">
                    I am registering as:
                  </label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <button onClick={() => setSelectedType('individual')} className={`p-5 rounded-2xl border-2 transition-all flex items-center gap-4 ${selectedType === 'individual' ? 'bg-[#2a2a2a] border-pink-600' : 'bg-[#2a2a2a] border-gray-700 hover:border-gray-600'}`}>
                      <User className={`w-6 h-6 ${selectedType === 'individual' ? 'text-pink-400' : 'text-gray-500'}`} />
                      <span className={`font-medium ${selectedType === 'individual' ? 'text-white' : 'text-gray-400'}`}>
                        Individual Rider
                      </span>
                    </button>

                    <button onClick={() => setSelectedType('company')} className={`p-5 rounded-2xl border-2 transition-all flex items-center gap-4 ${selectedType === 'company' ? 'bg-[#2a2a2a] border-pink-600' : 'bg-[#2a2a2a] border-gray-700 hover:border-gray-600'}`}>
                      <Building2 className={`w-6 h-6 ${selectedType === 'company' ? 'text-pink-400' : 'text-gray-500'}`} />
                      <span className={`font-medium ${selectedType === 'company' ? 'text-white' : 'text-gray-400'}`}>
                        Delivery Company
                      </span>
                    </button>
                  </div>
                </div>

                {/* Form Fields */}
                <div className="space-y-5">
                  {/* Full Name / Company Name */}
                  <div>
                    <label className="text-sm font-medium text-gray-300 mb-2 block">
                      {selectedType === 'individual' ? 'Full Name' : 'Company Name'}
                    </label>
                    <div className="relative">
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                      <input type="text" value={fullName} onChange={e => setFullName(e.target.value)} placeholder={selectedType === 'individual' ? 'Enter your full name' : 'Enter company name'} className="w-full pl-12 pr-4 py-4 bg-[#2a2a2a] border border-gray-700 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent focus:outline-none transition-all text-white placeholder-gray-500" />
                    </div>
                  </div>

                  {/* Email and Phone Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    {/* Email Address */}
                    <div>
                      <label className="text-sm font-medium text-gray-300 mb-2 block">
                        Email Address {selectedType === 'individual' && <span className="text-gray-500">(Optional)</span>}
                      </label>
                      <div className="relative">
                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                        <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="your@email.com" className="w-full pl-12 pr-4 py-4 bg-[#2a2a2a] border border-gray-700 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent focus:outline-none transition-all text-white placeholder-gray-500" />
                      </div>
                    </div>

                    {/* Phone Number */}
                    <div>
                      <label className="text-sm font-medium text-gray-300 mb-2 block">
                        Phone Number
                      </label>
                      <div className="relative">
                        <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                        <input type="tel" value={phoneNumber} onChange={e => setPhoneNumber(e.target.value)} placeholder="+233 24 123 4567" className="w-full pl-12 pr-4 py-4 bg-[#2a2a2a] border border-gray-700 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent focus:outline-none transition-all text-white placeholder-gray-500" />
                      </div>
                    </div>
                  </div>

                  {/* Address */}
                  <div>
                    <label className="text-sm font-medium text-gray-300 mb-2 block">
                      Address <span className="text-gray-500">
                        ({selectedType === 'individual' ? 'Where you usually work from' : 'Your head office'})
                      </span>
                    </label>
                    <div className="relative">
                      <MapPin className="absolute left-4 top-4 w-5 h-5 text-gray-500" />
                      <input type="text" value={address} onChange={e => setAddress(e.target.value)} placeholder="eg. Lapaz Tema Station, Accra, Ghana" className="w-full pl-12 pr-4 py-4 bg-[#2a2a2a] border border-gray-700 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent focus:outline-none transition-all text-white placeholder-gray-500" />
                    </div>
                  </div>
                </div>

                {/* Continue Button */}
                <div className="mt-8 flex justify-end">
                  <button onClick={handleContinueStep1} disabled={!fullName || !phoneNumber || !address || selectedType === 'company' && !email} className={`px-8 py-4 font-bold rounded-xl shadow-lg transition-all flex items-center gap-2 ${fullName && phoneNumber && address && (selectedType === 'company' ? email : true) ? 'bg-gradient-to-r from-[#4a5568] to-[#2d3748] hover:from-[#5a6578] hover:to-[#3d4758] text-white' : 'bg-[#2a2a2a] text-gray-600 cursor-not-allowed'}`}>
                    Continue
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              </div>}

            {/* Step 2: Delivery Capabilities */}
            {formStep === 2 && <div>
                {/* Vehicle Types */}
                <div className="mb-6">
                  <label className="text-sm font-medium text-gray-300 mb-3 block">
                    Vehicle Type(s)
                  </label>
                  <div className="grid grid-cols-5 gap-3">
                    {vehicleOptions.map(vehicle => {
                  const isSelected = selectedVehicles.includes(vehicle.id);
                  return <button key={vehicle.id} onClick={() => toggleVehicle(vehicle.id)} className={`p-4 rounded-2xl border-2 transition-all flex flex-col items-center gap-2 ${isSelected ? 'bg-[#2a2a2a] border-pink-600' : 'bg-[#2a2a2a] border-gray-700 hover:border-gray-600'}`}>
                          <span className="text-3xl">{vehicle.icon}</span>
                          <span className={`text-sm font-medium ${isSelected ? 'text-white' : 'text-gray-400'}`}>
                            {vehicle.label}
                          </span>
                        </button>;
                })}
                  </div>
                </div>

                {/* Number of Vehicles */}
                {selectedVehicles.length > 0 && selectedType === 'company' && <div className="mb-6">
                    <label className="text-sm font-medium text-gray-300 mb-3 block">
                      Number of Vehicles
                    </label>
                    <div className="space-y-3">
                      {selectedVehicles.map(vId => {
                  const vehicle = vehicleOptions.find(v => v.id === vId);
                  const quantity = vehicleQuantities[vId] || 1;
                  return <div key={vId} className="bg-[#2a2a2a] p-4 rounded-xl border border-gray-700 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <span className="text-2xl">{vehicle?.icon}</span>
                              <span className="text-white font-medium">{vehicle?.label}</span>
                            </div>
                            <div className="flex items-center gap-3">
                              <button onClick={() => {
                        if (quantity > 1) {
                          setVehicleQuantities(prev => ({
                            ...prev,
                            [vId]: quantity - 1
                          }));
                        }
                      }} disabled={quantity <= 1} className={`w-9 h-9 rounded-lg flex items-center justify-center transition-all ${quantity > 1 ? 'bg-[#1a1a1a] hover:bg-pink-600/20 text-gray-400 hover:text-pink-400 border border-gray-600 hover:border-pink-600' : 'bg-[#1a1a1a] text-gray-700 border border-gray-800 cursor-not-allowed'}`}>
                                <Minus className="w-4 h-4" />
                              </button>
                              <span className="text-white font-bold text-lg min-w-[2rem] text-center">
                                {quantity}
                              </span>
                              <button onClick={() => {
                        setVehicleQuantities(prev => ({
                          ...prev,
                          [vId]: quantity + 1
                        }));
                      }} className="w-9 h-9 rounded-lg bg-[#1a1a1a] hover:bg-pink-600/20 text-gray-400 hover:text-pink-400 border border-gray-600 hover:border-pink-600 flex items-center justify-center transition-all">
                                <Plus className="w-4 h-4" />
                              </button>
                            </div>
                          </div>;
                })}
                    </div>
                  </div>}

                {/* Delivery Experience - Box Selection */}
                {selectedType === 'individual' && <div className="mb-6">
                    <label className="text-sm font-medium text-gray-300 mb-3 block">
                      Delivery Experience
                    </label>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      {experienceOptions.map(exp => {
                  const isSelected = experience === exp.id;
                  return <button key={exp.id} onClick={() => setExperience(exp.id)} className={`p-4 rounded-2xl border-2 transition-all flex flex-col items-center gap-1 ${isSelected ? 'bg-[#2a2a2a] border-pink-600' : 'bg-[#2a2a2a] border-gray-700 hover:border-gray-600'}`}>
                            <span className={`text-base font-bold ${isSelected ? 'text-white' : 'text-gray-400'}`}>
                              {exp.label}
                            </span>
                            <span className={`text-xs ${isSelected ? 'text-gray-300' : 'text-gray-500'}`}>
                              {exp.subtitle}
                            </span>
                          </button>;
                })}
                    </div>
                  </div>}

                {/* Driver's License Number */}
                <div className="mb-6">
                  <label className="text-sm font-medium text-gray-300 mb-2 block">
                    {selectedType === 'individual' ? "Driver's License Number" : 'Coverage Area'}
                  </label>
                  {selectedType === 'individual' ? <div className="relative">
                      <FileText className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                      <input type="text" value={licenseNumber} onChange={e => setLicenseNumber(e.target.value)} placeholder="Enter your license number" className="w-full pl-12 pr-4 py-4 bg-[#2a2a2a] border border-gray-700 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent focus:outline-none transition-all text-white placeholder-gray-500" />
                    </div> : <div className="space-y-4">
                      {/* Coverage Type Selection */}
                      <div className="grid grid-cols-2 gap-4">
                        <button onClick={() => setCoverageType('region-to-region')} className={`p-4 rounded-xl border-2 transition-all ${coverageType === 'region-to-region' ? 'bg-[#2a2a2a] border-pink-600 text-white' : 'bg-[#2a2a2a] border-gray-700 text-gray-400 hover:border-gray-600'}`}>
                          <div className="flex items-center gap-2 justify-center">
                            <MapPin className="w-5 h-5" />
                            <span className="font-medium">Region to Region</span>
                          </div>
                        </button>
                        <button onClick={() => setCoverageType('door-to-door')} className={`p-4 rounded-xl border-2 transition-all ${coverageType === 'door-to-door' ? 'bg-[#2a2a2a] border-pink-600 text-white' : 'bg-[#2a2a2a] border-gray-700 text-gray-400 hover:border-gray-600'}`}>
                          <div className="flex items-center gap-2 justify-center">
                            <ShoppingBag className="w-5 h-5" />
                            <span className="font-medium">Door to Door</span>
                          </div>
                        </button>
                      </div>

                      {/* Region to Region Inputs */}
                      {coverageType === 'region-to-region' && <div className="space-y-3">
                          <p className="text-sm text-gray-400">Select regions you deliver from:</p>
                          {regionToRegion.map((item, index) => <div key={index} className="bg-[#0a0a0a] p-4 rounded-xl border border-gray-800">
                              <div className="flex gap-3 mb-3">
                                <div className="flex-1">
                                  <label className="text-xs text-gray-400 mb-1 block">From Region</label>
                                  <input type="text" value={item.region} onChange={e => updateRegionPair(index, 'region', e.target.value)} placeholder={index === 0 ? "Accra" : "Accra"} className="w-full px-3 py-2 bg-[#2a2a2a] border border-gray-700 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent focus:outline-none transition-all text-white placeholder-gray-500 text-sm" />
                                </div>
                                <div className="flex-1">
                                  <label className="text-xs text-gray-400 mb-1 block">To Region</label>
                                  <input type="text" value={regionToRegion[index === 0 ? 1 : 0]?.region || ''} onChange={e => updateRegionPair(index === 0 ? 1 : 0, 'region', e.target.value)} placeholder={index === 0 ? "Kumasi" : "Takoradi"} className="w-full px-3 py-2 bg-[#2a2a2a] border border-gray-700 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent focus:outline-none transition-all text-white placeholder-gray-500 text-sm" />
                                </div>
                                <div className="w-40">
                                  <label className="text-xs text-gray-400 mb-1 block">Two-way Delivery</label>
                                  <button type="button" onClick={() => updateRegionPair(index, 'twoWay', !item.twoWay)} className={`w-full h-[38px] rounded-lg border-2 transition-all text-sm font-medium ${item.twoWay ? 'bg-[#2a2a2a] border-pink-600 text-white' : 'bg-[#2a2a2a] border-gray-700 text-gray-400 hover:border-gray-600'}`}>
                                    {item.twoWay ? '✓ Yes' : 'No'}
                                  </button>
                                </div>
                              </div>
                              {regionToRegion.length > 1 && <button onClick={() => removeRegionPair(index)} className="text-xs text-red-400 hover:text-red-300 flex items-center gap-1">
                                  <Minus className="w-3 h-3" />
                                  Remove
                                </button>}
                            </div>)}
                          <button onClick={addRegionPair} className="w-full p-3 bg-[#2a2a2a] border border-gray-700 rounded-xl text-gray-400 hover:text-white hover:border-pink-600 transition-all flex items-center justify-center gap-2">
                            <Plus className="w-4 h-4" />
                            Add More Regions
                          </button>
                          <div className="pt-2">
                            <p className="text-xs text-gray-400 mb-2">Quick Option:</p>
                            <button type="button" onClick={() => setDeliversToAllCapitals(!deliversToAllCapitals)} className={`w-full p-4 rounded-xl border-2 transition-all flex items-center justify-center gap-2 ${deliversToAllCapitals ? 'bg-[#2a2a2a] border-pink-600 text-white' : 'bg-[#2a2a2a] border-gray-700 text-gray-400 hover:border-gray-600'}`}>
                              <MapPin className="w-5 h-5" />
                              <span className="font-medium">
                                Delivers To All Regional Capitals
                              </span>
                            </button>
                          </div>
                        </div>}

                      {/* Door to Door Inputs */}
                      {coverageType === 'door-to-door' && <div className="space-y-3">
                          <p className="text-sm text-gray-400">Select areas you deliver door-to-door within:</p>
                          {doorToDoor.map((area, index) => <div key={index} className="bg-[#0a0a0a] p-4 rounded-xl border border-gray-800">
                              <div className="mb-2">
                                <label className="text-xs text-gray-400 mb-1 block">Area</label>
                                <input type="text" value={area} onChange={e => updateDoorToDoorArea(index, e.target.value)} placeholder="e.g., East Legon, Accra" className="w-full px-3 py-2 bg-[#2a2a2a] border border-gray-700 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent focus:outline-none transition-all text-white placeholder-gray-500 text-sm" />
                              </div>
                              {doorToDoor.length > 1 && <button onClick={() => removeDoorToDoorArea(index)} className="text-xs text-red-400 hover:text-red-300 flex items-center gap-1">
                                  <Minus className="w-3 h-3" />
                                  Remove
                                </button>}
                            </div>)}
                          <button onClick={addDoorToDoorArea} className="w-full p-3 bg-[#2a2a2a] border border-gray-700 rounded-xl text-gray-400 hover:text-white hover:border-pink-600 transition-all flex items-center justify-center gap-2">
                            <Plus className="w-4 h-4" />
                            Add More Areas
                          </button>
                        </div>}
                    </div>}
                </div>

                {/* API Integration for Delivery Companies */}
                {selectedType === 'company' && <div className="mb-6">
                    <label className="text-sm font-medium text-gray-300 mb-3 block">
                      Do you have an API you want to integrate?
                    </label>
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <button onClick={() => setHasAPI('yes')} className={`p-4 rounded-xl border-2 transition-all ${hasAPI === 'yes' ? 'bg-[#2a2a2a] border-pink-600 text-white' : 'bg-[#2a2a2a] border-gray-700 text-gray-400 hover:border-gray-600'}`}>
                        Yes, I have an API
                      </button>
                      <button onClick={() => {
                  setHasAPI('no');
                  setApiDetails('');
                }} className={`p-4 rounded-xl border-2 transition-all ${hasAPI === 'no' ? 'bg-[#2a2a2a] border-pink-600 text-white' : 'bg-[#2a2a2a] border-gray-700 text-gray-400 hover:border-gray-600'}`}>
                        No API
                      </button>
                    </div>

                    {hasAPI === 'yes' && <div>
                        <label className="text-sm font-medium text-gray-300 mb-2 block">
                          API Details / Documentation URL
                        </label>
                        <textarea value={apiDetails} onChange={e => setApiDetails(e.target.value)} placeholder="Please provide API documentation URL or details about your API" rows={3} className="w-full px-4 py-4 bg-[#2a2a2a] border border-gray-700 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent focus:outline-none transition-all text-white placeholder-gray-500 resize-none" />
                      </div>}
                  </div>}

                {/* Navigation Buttons */}
                <div className="mt-8 flex justify-between">
                  <button onClick={handleBackToStep1} className="px-8 py-4 text-gray-400 hover:text-white font-medium transition-all">
                    Back
                  </button>
                  <button onClick={handleContinueStep2} disabled={selectedVehicles.length === 0 || selectedType === 'company' && hasAPI === ''} className={`px-8 py-4 font-bold rounded-xl shadow-lg transition-all flex items-center gap-2 ${selectedVehicles.length > 0 && (selectedType === 'individual' || hasAPI !== '') ? 'bg-gradient-to-r from-[#4a5568] to-[#2d3748] hover:from-[#5a6578] hover:to-[#3d4758] text-white' : 'bg-[#2a2a2a] text-gray-600 cursor-not-allowed'}`}>
                    Continue
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              </div>}

            {/* Step 3: Review and Submit */}
            {formStep === 3 && <div>
                <div className="bg-[#0a0a0a] p-6 rounded-2xl border border-gray-800 mb-6">
                  <h3 className="text-xl font-bold mb-6">Application Summary</h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Left Column */}
                    <div className="space-y-4">
                      <div>
                        <p className="text-gray-400 text-sm mb-1">Partner Type:</p>
                        <p className="text-white font-medium">
                          {selectedType === 'individual' ? 'Individual' : 'Delivery Company'}
                        </p>
                      </div>

                      <div>
                        <p className="text-gray-400 text-sm mb-1">
                          {selectedType === 'individual' ? 'Name:' : 'Company Name:'}
                        </p>
                        <p className="text-white font-medium">{fullName}</p>
                      </div>

                      <div>
                        <p className="text-gray-400 text-sm mb-1">Email:</p>
                        <p className="text-white font-medium">{email}</p>
                      </div>

                      <div>
                        <p className="text-gray-400 text-sm mb-1">Phone:</p>
                        <p className="text-white font-medium">{phoneNumber}</p>
                      </div>

                      <div>
                        <p className="text-gray-400 text-sm mb-1">Address:</p>
                        <p className="text-white font-medium">{address}</p>
                      </div>
                    </div>

                    {/* Right Column */}
                    <div className="space-y-4">
                      <div>
                        <p className="text-gray-400 text-sm mb-1">Vehicles:</p>
                        <div className="space-y-1">
                          {selectedVehicles.map(vId => {
                        const vehicle = vehicleOptions.find(v => v.id === vId);
                        return <p key={vId} className="text-white font-medium">
                                {vehicle?.label}
                              </p>;
                      })}
                        </div>
                      </div>

                      {selectedType === 'individual' && <div>
                        <p className="text-gray-400 text-sm mb-1">Experience:</p>
                        <p className="text-white font-medium">
                          {experience ? experience.charAt(0).toUpperCase() + experience.slice(1) : 'Not Specified'}
                        </p>
                      </div>}

                      {selectedType === 'individual' && licenseNumber && <div>
                          <p className="text-gray-400 text-sm mb-1">License Number:</p>
                          <p className="text-white font-medium">{licenseNumber}</p>
                        </div>}

                      {selectedType === 'company' && coverageArea && <div>
                          <p className="text-gray-400 text-sm mb-1">Coverage Area:</p>
                          <p className="text-white font-medium">{coverageArea}</p>
                        </div>}

                      {selectedType === 'company' && coverageType && <div>
                          <p className="text-gray-400 text-sm mb-1">Coverage Type:</p>
                          <p className="text-white font-medium capitalize">
                            {coverageType === 'region-to-region' ? 'Region to Region' : 'Door to Door'}
                          </p>
                          {coverageType === 'region-to-region' && <>
                              {deliversToAllCapitals && <div className="mt-2">
                                  <p className="text-sm text-pink-400 font-medium">
                                    ✓ Delivers To All Regional Capitals
                                  </p>
                                </div>}
                              <div className="mt-2 space-y-1">
                                {regionToRegion.filter(item => item.region).map((item, idx) => <p key={idx} className="text-sm text-gray-300">
                                    {item.region} {item.twoWay && '↔'} {item.twoWay ? '(Two-way)' : '(One-way)'}
                                  </p>)}
                              </div>
                            </>}
                          {coverageType === 'door-to-door' && <div className="mt-2 space-y-1">
                              {doorToDoor.filter(area => area).map((area, idx) => <p key={idx} className="text-sm text-gray-300">
                                  {area}
                                </p>)}
                            </div>}
                        </div>}

                      {selectedType === 'company' && <div>
                          <p className="text-gray-400 text-sm mb-1">API Integration:</p>
                          <p className="text-white font-medium">
                            {hasAPI === 'yes' ? 'Yes' : 'No'}
                          </p>
                          {hasAPI === 'yes' && apiDetails && <p className="text-gray-400 text-sm mt-1">{apiDetails}</p>}
                        </div>}
                    </div>
                  </div>
                </div>

                {/* Terms and Conditions */}
                <div className="mb-6">
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input type="checkbox" checked={agreedToTerms} onChange={e => setAgreedToTerms(e.target.checked)} className="mt-1 w-5 h-5 bg-[#2a2a2a] border-gray-700 rounded focus:ring-2 focus:ring-pink-500 cursor-pointer" />
                    <span className="text-sm text-gray-300">
                      I agree to the{' '}
                      <span className="text-pink-500 hover:text-pink-400 cursor-pointer">
                        Terms of Service
                      </span>{' '}
                      and{' '}
                      <span className="text-pink-500 hover:text-pink-400 cursor-pointer">
                        Partner Agreement
                      </span>
                      . I confirm that the information provided is accurate and I have the legal
                      right to work as a delivery partner.
                    </span>
                  </label>
                </div>

                {/* Navigation Buttons */}
                <div className="flex justify-between">
                  <button onClick={handleBackToStep2} className="px-8 py-4 text-gray-400 hover:text-white font-medium transition-all">
                    Back
                  </button>
                  <button onClick={handleSubmit} disabled={!agreedToTerms} className={`px-8 py-4 font-bold rounded-xl shadow-lg transition-all flex items-center gap-2 ${agreedToTerms ? 'bg-gradient-to-r from-[#4a5568] to-[#2d3748] hover:from-[#5a6578] hover:to-[#3d4758] text-white' : 'bg-[#2a2a2a] text-gray-600 cursor-not-allowed'}`}>
                    Submit Application
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              </div>}
          </div>
        </div>
      </div>
    </div>;
};