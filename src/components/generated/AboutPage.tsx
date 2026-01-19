"use client";

import React from 'react';
import { Bike, Package, TrendingUp, Users, MapPin, CheckCircle2, ArrowRight, Star, Shield, Zap } from 'lucide-react';
import { motion } from 'framer-motion';
export interface AboutPageProps {
  onNavigateToSendItem?: () => void;
  onNavigateToDeliveryPartner?: () => void;
}
export const AboutPage = ({
  onNavigateToSendItem,
  onNavigateToDeliveryPartner
}: AboutPageProps) => {
  const handleNavigateToDeliveryPartner = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
    onNavigateToDeliveryPartner?.();
  };
  return <div className="min-h-screen bg-black text-white">
      {/* Hero Section */}
      <div className="py-8 px-4 md:px-8 text-center relative overflow-hidden">
        <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-8 py-12 md:py-16">
          <motion.div initial={{
          opacity: 0,
          y: 20
        }} animate={{
          opacity: 1,
          y: 0
        }} transition={{
          duration: 0.6
        }} className="text-center">
            <div className="inline-flex items-center gap-3 mb-6">
              <div className="bg-pink-600/20 p-3 rounded-xl backdrop-blur-sm border border-pink-500/20">
                <Bike className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-4xl md:text-6xl font-bold text-white">JamJam</h1>
            </div>
            <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
              Revolutionizing long distance and regional deliveries by connecting multiple riders and delivery companies
            </p>
          </motion.div>
        </div>
      </div>

      {/* Benefits Section - Two Boxes Side by Side */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-8 md:py-12">
        <h2 className="text-3xl md:text-4xl font-bold text-center text-white mb-12">
          Built for Everyone
        </h2>

        <div className="grid md:grid-cols-2 gap-6 lg:gap-8">
          {/* Vendors/Businesses Benefit Box */}
          <motion.div initial={{
          opacity: 0,
          x: -20
        }} animate={{
          opacity: 1,
          x: 0
        }} transition={{
          duration: 0.6,
          delay: 0.3
        }} className="bg-gradient-to-br from-pink-600/20 to-pink-500/10 border-2 border-pink-600/30 rounded-3xl p-8 relative overflow-hidden group hover:border-pink-500/50 transition-all">
            <div className="absolute top-0 right-0 w-32 h-32 bg-pink-500/10 rounded-full blur-3xl" />
            
            <div className="relative z-10">
              <div className="inline-flex items-center gap-3 mb-6">
                <div className="bg-pink-600 p-3 rounded-xl">
                  <Package className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-white">For Vendors</h3>
              </div>

              <p className="text-gray-300 mb-6 leading-relaxed">
                Expand your delivery reach without the complexity. Fulfill orders outside your region effortlessly.
              </p>

              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="bg-pink-600/20 p-2 rounded-lg mt-0.5">
                    <CheckCircle2 className="w-5 h-5 text-pink-400" />
                  </div>
                  <div>
                    <h4 className="font-bold text-white mb-1">Expand Your Market</h4>
                    <p className="text-sm text-gray-400">
                      Deliver to customers in distant regions without setting up new infrastructure
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="bg-pink-600/20 p-2 rounded-lg mt-0.5">
                    <CheckCircle2 className="w-5 h-5 text-pink-400" />
                  </div>
                  <div>
                    <h4 className="font-bold text-white mb-1">Simple Integration</h4>
                    <p className="text-sm text-gray-400">
                      One platform, unlimited reach. No need to manage multiple delivery partners
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="bg-pink-600/20 p-2 rounded-lg mt-0.5">
                    <CheckCircle2 className="w-5 h-5 text-pink-400" />
                  </div>
                  <div>
                    <h4 className="font-bold text-white mb-1">Cost Effective</h4>
                    <p className="text-sm text-gray-400">
                      Competitive pricing through optimized multi-rider coordination
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="bg-pink-600/20 p-2 rounded-lg mt-0.5">
                    <CheckCircle2 className="w-5 h-5 text-pink-400" />
                  </div>
                  <div>
                    <h4 className="font-bold text-white mb-1">Real-Time Tracking</h4>
                    <p className="text-sm text-gray-400">
                      Monitor every segment of the journey with complete transparency
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="bg-pink-600/20 p-2 rounded-lg mt-0.5">
                    <CheckCircle2 className="w-5 h-5 text-pink-400" />
                  </div>
                  <div>
                    <h4 className="font-bold text-white mb-1">Happy Customers</h4>
                    <p className="text-sm text-gray-400">
                      Fulfill more orders and grow your customer base beyond boundaries
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Delivery Partners Benefit Box */}
          <motion.div initial={{
          opacity: 0,
          x: 20
        }} animate={{
          opacity: 1,
          x: 0
        }} transition={{
          duration: 0.6,
          delay: 0.4
        }} className="bg-gradient-to-br from-green-600/20 to-green-500/10 border-2 border-green-600/30 rounded-3xl p-8 relative overflow-hidden group hover:border-green-500/50 transition-all">
            <div className="absolute top-0 right-0 w-32 h-32 bg-green-500/10 rounded-full blur-3xl" />
            
            <div className="relative z-10">
              <div className="inline-flex items-center gap-3 mb-6">
                <div className="bg-green-600 p-3 rounded-xl">
                  <Bike className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-white">For Delivery Partners</h3>
              </div>

              <p className="text-gray-300 mb-6 leading-relaxed">
                Focus on your most profitable routes while earning from coordinated regional deliveries.
              </p>

              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="bg-green-600/20 p-2 rounded-lg mt-0.5">
                    <CheckCircle2 className="w-5 h-5 text-green-400" />
                  </div>
                  <div>
                    <h4 className="font-bold text-white mb-1">Maximize Profitability</h4>
                    <p className="text-sm text-gray-400">
                      Focus on your zone's most profitable routes without losing long-distance orders
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="bg-green-600/20 p-2 rounded-lg mt-0.5">
                    <CheckCircle2 className="w-5 h-5 text-green-400" />
                  </div>
                  <div>
                    <h4 className="font-bold text-white mb-1">Reduce Operational Costs</h4>
                    <p className="text-sm text-gray-400">
                      Save on fuel and time by working within your optimal delivery zone
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="bg-green-600/20 p-2 rounded-lg mt-0.5">
                    <CheckCircle2 className="w-5 h-5 text-green-400" />
                  </div>
                  <div>
                    <h4 className="font-bold text-white mb-1">More Earning Opportunities</h4>
                    <p className="text-sm text-gray-400">
                      Access segment-based deliveries and collaborate with other riders
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="bg-green-600/20 p-2 rounded-lg mt-0.5">
                    <CheckCircle2 className="w-5 h-5 text-green-400" />
                  </div>
                  <div>
                    <h4 className="font-bold text-white mb-1">Flexible Schedule</h4>
                    <p className="text-sm text-gray-400">
                      Choose deliveries that fit your route and schedule perfectly
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="bg-green-600/20 p-2 rounded-lg mt-0.5">
                    <CheckCircle2 className="w-5 h-5 text-green-400" />
                  </div>
                  <div>
                    <h4 className="font-bold text-white mb-1">Network Growth</h4>
                    <p className="text-sm text-gray-400">
                      Join a growing network of delivery partners and access more business
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* How It Works */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-16 md:py-20">
        <h2 className="text-3xl md:text-4xl font-bold text-center text-white mb-12">
          How JamJam Works
        </h2>

        <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
          <motion.div initial={{
          opacity: 0,
          y: 20
        }} animate={{
          opacity: 1,
          y: 0
        }} transition={{
          duration: 0.6,
          delay: 0.5
        }} className="bg-[#1f1f1f] border border-gray-800 rounded-2xl p-6 text-center">
            <div className="w-16 h-16 bg-pink-600/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <MapPin className="w-8 h-8 text-pink-400" />
            </div>
            <h3 className="text-xl font-bold text-white mb-3">Smart Routing</h3>
            <p className="text-gray-400">
              Our algorithm analyzes the delivery distance and automatically divides the route into optimal segments
            </p>
          </motion.div>

          <motion.div initial={{
          opacity: 0,
          y: 20
        }} animate={{
          opacity: 1,
          y: 0
        }} transition={{
          duration: 0.6,
          delay: 0.6
        }} className="bg-[#1f1f1f] border border-gray-800 rounded-2xl p-6 text-center">
            <div className="w-16 h-16 bg-green-600/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Users className="w-8 h-8 text-green-400" />
            </div>
            <h3 className="text-xl font-bold text-white mb-3">Multi-Rider Coordination</h3>
            <p className="text-gray-400">
              Multiple delivery partners are matched to each segment, working in their most efficient zones
            </p>
          </motion.div>

          <motion.div initial={{
          opacity: 0,
          y: 20
        }} animate={{
          opacity: 1,
          y: 0
        }} transition={{
          duration: 0.6,
          delay: 0.7
        }} className="bg-[#1f1f1f] border border-gray-800 rounded-2xl p-6 text-center">
            <div className="w-16 h-16 bg-blue-600/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Zap className="w-8 h-8 text-blue-400" />
            </div>
            <h3 className="text-xl font-bold text-white mb-3">Seamless Handoffs</h3>
            <p className="text-gray-400">
              Smooth handover points between riders ensure your package reaches its destination quickly and safely
            </p>
          </motion.div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="bg-[#1f1f1f] border-y border-gray-800 py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-pink-500 mb-2">500+</div>
              <div className="text-gray-400 text-sm">Delivery Partners</div>
            </div>
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-green-500 mb-2">1,200+</div>
              <div className="text-gray-400 text-sm">Vendors Served</div>
            </div>
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-blue-500 mb-2">50K+</div>
              <div className="text-gray-400 text-sm">Deliveries Completed</div>
            </div>
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-yellow-500 mb-2">4.8</div>
              <div className="text-gray-400 text-sm">Average Rating</div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-16 md:py-20">
        <motion.div initial={{
        opacity: 0,
        y: 20
      }} animate={{
        opacity: 1,
        y: 0
      }} transition={{
        duration: 0.6,
        delay: 0.8
      }} className="bg-gradient-to-br from-pink-600 to-pink-500 rounded-3xl p-8 md:p-12 text-center relative overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <pattern id="cta-pattern" width="30" height="30" patternUnits="userSpaceOnUse">
                  <circle cx="3" cy="3" r="1.5" fill="white" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#cta-pattern)" />
            </svg>
          </div>
          
          <div className="relative z-10">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Ready to Transform Your Deliveries?
            </h2>
            <p className="text-pink-100 text-lg mb-8 max-w-2xl mx-auto">
              Join thousands of vendors and delivery partners already using JamJam
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button onClick={onNavigateToSendItem} className="px-8 py-4 bg-white text-pink-600 font-bold rounded-xl hover:bg-pink-50 transition-all shadow-lg flex items-center justify-center gap-2 group">
                Get Started as Vendor
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
              <button onClick={handleNavigateToDeliveryPartner} className="px-8 py-4 bg-black/30 backdrop-blur-sm text-white font-bold rounded-xl hover:bg-black/50 transition-all border-2 border-white/30 flex items-center justify-center gap-2">
                Become a Delivery Partner
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>;
};