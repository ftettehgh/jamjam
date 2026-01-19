import React from 'react';
import { MapPin, Navigation, Bike, CheckCircle2, Clock, Star, Phone, MessageSquare, User } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
export interface RouteSegment {
  id: string;
  segmentNumber: number;
  startPoint: string;
  endPoint: string;
  distance: string;
  estimatedTime: string;
  status: 'pending' | 'in_progress' | 'completed' | 'handover';
}
export interface MultiRider {
  id: string;
  name: string;
  rating: number;
  trips: number;
  avatar: string;
  phone: string;
  vehicle: string;
  licensePlate: string;
  segment: RouteSegment;
  acceptedAt: string;
  pricePerSegment: number;
}
export interface MultiRiderTrackerProps {
  riders: MultiRider[];
  currentSegment: number;
  pickupLocation: string;
  dropoffLocation: string;
  onCallRider: (riderId: string) => void;
  onChatRider: (riderId: string) => void;
}
export const MultiRiderTracker: React.FC<MultiRiderTrackerProps> = ({
  riders,
  currentSegment,
  pickupLocation,
  dropoffLocation,
  onCallRider,
  onChatRider
}) => {
  const activeRider = riders.find(r => r.segment.segmentNumber === currentSegment);
  const completedSegments = riders.filter(r => r.segment.status === 'completed').length;
  const totalSegments = riders.length;
  return <div className="space-y-6">
      {/* Progress Overview */}
      <div className="bg-[#2a2a2a] p-5 rounded-2xl border border-gray-700">
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-xs text-gray-400 uppercase font-bold mb-1">Multi-Rider Delivery</p>
            <p className="text-lg font-bold text-white">
              Segment {currentSegment} of {totalSegments}
            </p>
          </div>
          <div className="text-right">
            <p className="text-xs text-gray-400 uppercase font-bold mb-1">Progress</p>
            <p className="text-lg font-bold text-green-400">
              {Math.round(completedSegments / totalSegments * 100)}%
            </p>
          </div>
        </div>
        
        {/* Progress Bar */}
        <div className="relative h-2 bg-[#1f1f1f] rounded-full overflow-hidden">
          <motion.div className="absolute left-0 top-0 h-full bg-gradient-to-r from-green-500 to-green-400" initial={{
          width: 0
        }} animate={{
          width: `${completedSegments / totalSegments * 100}%`
        }} transition={{
          duration: 0.5
        }} />
        </div>
      </div>

      {/* Active Rider Card */}
      {activeRider && <motion.div initial={{
      opacity: 0,
      y: 20
    }} animate={{
      opacity: 1,
      y: 0
    }} className="bg-gradient-to-br from-green-600/20 to-green-500/10 p-5 rounded-2xl border-2 border-green-500/30">
          <div className="flex items-center gap-3 mb-4">
            <div className="relative">
              <div className="absolute inset-0 bg-green-500 blur-md opacity-50 animate-pulse" />
              <div className="relative p-2 bg-green-500/20 rounded-xl">
                <Bike className="w-5 h-5 text-green-400" />
              </div>
            </div>
            <div>
              <p className="text-xs text-green-400 uppercase font-bold">Currently Active</p>
              <p className="text-sm font-bold text-white">Segment {activeRider.segment.segmentNumber}</p>
            </div>
          </div>

          <div className="flex items-center gap-4 mb-4">
            <img src={activeRider.avatar} className="w-14 h-14 rounded-full ring-2 ring-green-500" alt={activeRider.name} />
            <div className="flex-1">
              <p className="font-bold text-white text-lg">{activeRider.name}</p>
              <div className="flex items-center gap-2 text-sm text-gray-400">
                <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                <span>{activeRider.rating}</span>
                <span>•</span>
                <span>{activeRider.trips} trips</span>
              </div>
              <p className="text-xs text-gray-500">{activeRider.vehicle} • {activeRider.licensePlate}</p>
            </div>
            <div className="flex gap-2">
              <button onClick={() => onCallRider(activeRider.id)} className="p-2 bg-green-500/20 text-green-400 border border-green-500/30 rounded-xl hover:bg-green-500/30 transition-all">
                <Phone className="w-4 h-4" />
              </button>
              <button onClick={() => onChatRider(activeRider.id)} className="p-2 bg-green-500/20 text-green-400 border border-green-500/30 rounded-xl hover:bg-green-500/30 transition-all">
                <MessageSquare className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Active Route Segment */}
          <div className="bg-[#1f1f1f]/50 p-4 rounded-xl border border-green-500/20">
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs text-gray-400 uppercase font-bold">Current Route</p>
              <p className="text-xs text-green-400 font-bold">{activeRider.segment.distance} • {activeRider.segment.estimatedTime}</p>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-green-400" />
                <p className="text-sm text-white font-medium">{activeRider.segment.startPoint}</p>
              </div>
              <div className="ml-2 h-4 border-l-2 border-dashed border-gray-600" />
              <div className="flex items-center gap-2">
                <Navigation className="w-4 h-4 text-pink-400" />
                <p className="text-sm text-white font-medium">{activeRider.segment.endPoint}</p>
              </div>
            </div>
          </div>
        </motion.div>}

      {/* All Riders Timeline */}
      <div className="bg-[#1f1f1f] p-5 rounded-2xl border border-gray-800">
        <h3 className="text-lg font-bold text-white mb-4">Delivery Timeline</h3>
        <div className="space-y-4 relative ml-4 border-l-2 border-gray-700 pl-6">
          {/* Pickup Location */}
          <div className="relative">
            <div className="absolute -left-[29px] top-1 w-4 h-4 rounded-full bg-green-500 border-2 border-green-500" />
            <div>
              <p className="text-xs text-gray-400 uppercase font-bold mb-1">Pickup Location</p>
              <p className="text-sm text-white font-medium">{pickupLocation}</p>
            </div>
          </div>

          {/* Rider Segments */}
          {riders.map((rider, index) => {
          const isCompleted = rider.segment.status === 'completed';
          const isActive = rider.segment.segmentNumber === currentSegment;
          const isPending = rider.segment.status === 'pending';
          return <React.Fragment key={rider.id}>
                {/* Rider Segment */}
                <motion.div initial={{
              opacity: 0,
              x: -20
            }} animate={{
              opacity: 1,
              x: 0
            }} transition={{
              delay: index * 0.1
            }} className="relative">
                  <div className={`absolute -left-[33px] top-2 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-500 ${isCompleted ? 'bg-green-500 border-green-500' : isActive ? 'bg-pink-600 border-pink-600 animate-pulse' : 'bg-[#2a2a2a] border-gray-600'}`}>
                    {isCompleted ? <CheckCircle2 className="w-3 h-3 text-white" /> : isActive ? <Bike className="w-3 h-3 text-white" /> : <Clock className="w-3 h-3 text-gray-500" />}
                  </div>

                  <div className={`p-4 rounded-xl border transition-all ${isActive ? 'bg-pink-600/10 border-pink-500/30' : isCompleted ? 'bg-green-600/10 border-green-500/30' : 'bg-[#2a2a2a] border-gray-700'}`}>
                    <div className="flex items-center gap-3 mb-2">
                      <img src={rider.avatar} className="w-10 h-10 rounded-full ring-2 ring-gray-700" alt={rider.name} />
                      <div className="flex-1">
                        <p className="text-sm font-bold text-white">{rider.name}</p>
                        <p className="text-xs text-gray-400">
                          Segment {rider.segment.segmentNumber} • {rider.segment.distance}
                        </p>
                      </div>
                      <span className={`px-2 py-1 rounded-lg text-xs font-bold ${isCompleted ? 'bg-green-500/20 text-green-400' : isActive ? 'bg-pink-500/20 text-pink-400' : 'bg-gray-700 text-gray-400'}`}>
                        {isCompleted ? 'Completed' : isActive ? 'Active' : 'Waiting'}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500">
                      {rider.segment.startPoint} → {rider.segment.endPoint}
                    </p>
                  </div>
                </motion.div>

                {/* Handover Point */}
                {index < riders.length - 1 && <div className="relative">
                    <div className={`absolute -left-[29px] top-1 w-4 h-4 rounded-full border-2 ${isCompleted ? 'bg-orange-500 border-orange-500' : 'bg-[#2a2a2a] border-gray-600'}`} />
                    <div>
                      <p className="text-xs text-orange-400 uppercase font-bold mb-1">
                        Handover Point {index + 1}
                      </p>
                      <p className="text-sm text-gray-400">{rider.segment.endPoint}</p>
                      {isCompleted && <p className="text-xs text-green-400 mt-1">✓ Package transferred</p>}
                    </div>
                  </div>}
              </React.Fragment>;
        })}

          {/* Final Delivery Location */}
          <div className="relative">
            <div className={`absolute -left-[29px] top-1 w-4 h-4 rounded-full border-2 ${completedSegments === totalSegments ? 'bg-pink-500 border-pink-500' : 'bg-[#2a2a2a] border-gray-600'}`} />
            <div>
              <p className="text-xs text-gray-400 uppercase font-bold mb-1">Final Destination</p>
              <p className="text-sm text-white font-medium">{dropoffLocation}</p>
              {completedSegments === totalSegments && <p className="text-xs text-green-400 mt-1">✓ Delivered successfully</p>}
            </div>
          </div>
        </div>
      </div>

      {/* Riders Summary */}
      <div className="bg-[#1f1f1f] p-5 rounded-2xl border border-gray-800">
        <h3 className="text-sm font-bold text-gray-400 uppercase mb-3">All Riders on This Delivery</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {riders.map(rider => <div key={rider.id} className="flex items-center gap-3 p-4 bg-[#2a2a2a] border border-gray-700 rounded-xl min-w-0">
              <img src={rider.avatar} className="w-12 h-12 rounded-full ring-2 ring-gray-700 flex-shrink-0" alt={rider.name} />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-white truncate mb-1">{rider.name}</p>
                <div className="flex items-center gap-2">
                  <p className="text-xs text-gray-400 whitespace-nowrap">Segment {rider.segment.segmentNumber}</p>
                  <div className="flex items-center gap-1">
                    <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                    <span className="text-xs text-gray-400">{rider.rating}</span>
                  </div>
                </div>
              </div>
            </div>)}
        </div>
      </div>
    </div>;
};