import React, { useState, useEffect } from 'react';
import { Bike, Star, MapPin, Clock, CheckCircle2, Loader2, Navigation } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
export interface BroadcastRider {
  id: string;
  name: string;
  rating: number;
  trips: number;
  avatar: string;
  distance: string;
  phone: string;
  vehicle: string;
  licensePlate: string;
  estimatedArrival: string;
  pricePerSegment: number;
}
export interface RouteSegmentInfo {
  segmentNumber: number;
  startPoint: string;
  endPoint: string;
  distance: string;
  estimatedTime: string;
}
export interface RiderBroadcastProps {
  availableRiders: BroadcastRider[];
  routeSegments: RouteSegmentInfo[];
  requiredRiders: number;
  onRidersAccepted: (acceptedRiders: BroadcastRider[], segments: RouteSegmentInfo[]) => void;
  onCancel: () => void;
}
export const RiderBroadcast: React.FC<RiderBroadcastProps> = ({
  availableRiders,
  routeSegments,
  requiredRiders,
  onRidersAccepted,
  onCancel
}) => {
  const [isBroadcasting, setIsBroadcasting] = useState(true);
  const [acceptedRiders, setAcceptedRiders] = useState<BroadcastRider[]>([]);
  const [showingRiders, setShowingRiders] = useState<BroadcastRider[]>([]);
  useEffect(() => {
    // Simulate riders accepting the order one by one
    const acceptanceTimers: NodeJS.Timeout[] = [];
    availableRiders.slice(0, requiredRiders).forEach((rider, index) => {
      const timer = setTimeout(() => {
        setShowingRiders(prev => [...prev, rider]);

        // After showing, accept after a short delay
        setTimeout(() => {
          setAcceptedRiders(prev => {
            const updated = [...prev, rider];

            // If all riders accepted, finish broadcasting
            if (updated.length === requiredRiders) {
              setIsBroadcasting(false);
              setTimeout(() => {
                onRidersAccepted(updated, routeSegments);
              }, 1500);
            }
            return updated;
          });
        }, 1000);
      }, (index + 1) * 2000); // Stagger the acceptance

      acceptanceTimers.push(timer);
    });
    return () => {
      acceptanceTimers.forEach(timer => clearTimeout(timer));
    };
  }, [availableRiders, requiredRiders, routeSegments, onRidersAccepted]);
  const totalPrice = routeSegments.reduce((sum, _, index) => {
    const rider = acceptedRiders[index];
    return sum + (rider?.pricePerSegment || 0);
  }, 0);
  return <motion.div initial={{
    opacity: 0,
    y: 20
  }} animate={{
    opacity: 1,
    y: 0
  }} exit={{
    opacity: 0,
    y: -20
  }} className="bg-[#1f1f1f] p-6 rounded-3xl border border-gray-800">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-xl font-bold text-white">Finding Riders</h2>
          {isBroadcasting && <div className="flex items-center gap-2">
              <Loader2 className="w-5 h-5 text-green-400 animate-spin" />
              <span className="text-sm text-green-400 font-bold">Broadcasting...</span>
            </div>}
        </div>
        <p className="text-gray-400 text-sm">
          Your order requires {requiredRiders} riders. Waiting for acceptance...
        </p>
      </div>

      {/* Route Overview */}
      <div className="bg-[#2a2a2a] p-4 rounded-2xl border border-gray-700 mb-6">
        <p className="text-xs text-gray-400 uppercase font-bold mb-3">Route Segments</p>
        <div className="space-y-2">
          {routeSegments.map((segment, index) => <div key={index} className="flex items-center gap-3">
              <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${acceptedRiders[index] ? 'bg-green-500 text-white' : 'bg-gray-700 text-gray-400'}`}>
                {acceptedRiders[index] ? <CheckCircle2 className="w-4 h-4" /> : index + 1}
              </div>
              <div className="flex-1">
                <p className="text-sm text-white font-medium">
                  {segment.startPoint} → {segment.endPoint}
                </p>
                <p className="text-xs text-gray-500">{segment.distance} • {segment.estimatedTime}</p>
              </div>
              {acceptedRiders[index] && <span className="px-2 py-1 bg-green-500/20 text-green-400 rounded-lg text-xs font-bold">
                  Accepted
                </span>}
            </div>)}
        </div>
      </div>

      {/* Riders Accepting */}
      <div className="space-y-3">
        <div className="flex items-center justify-between mb-2">
          <p className="text-sm font-bold text-gray-400 uppercase">
            Riders ({acceptedRiders.length}/{requiredRiders})
          </p>
          {!isBroadcasting && <span className="px-3 py-1 bg-green-500/20 text-green-400 border border-green-500/30 rounded-full text-xs font-bold">
              All Riders Confirmed
            </span>}
        </div>

        <AnimatePresence>
          {showingRiders.map((rider, index) => {
          const isAccepted = acceptedRiders.includes(rider);
          const segment = routeSegments[index];
          return <motion.div key={rider.id} initial={{
            opacity: 0,
            x: -20,
            scale: 0.95
          }} animate={{
            opacity: 1,
            x: 0,
            scale: 1
          }} transition={{
            type: 'spring',
            damping: 20,
            stiffness: 300
          }} className={`p-4 rounded-2xl border transition-all ${isAccepted ? 'bg-green-600/10 border-green-500/30' : 'bg-[#2a2a2a] border-yellow-500/30'}`}>
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <img src={rider.avatar} className="w-14 h-14 rounded-full ring-2 ring-gray-700" alt={rider.name} />
                    {isAccepted && <motion.div initial={{
                  scale: 0
                }} animate={{
                  scale: 1
                }} className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full flex items-center justify-center ring-2 ring-[#1f1f1f]">
                        <CheckCircle2 className="w-3 h-3 text-white" />
                      </motion.div>}
                  </div>

                  <div className="flex-1">
                    <p className="font-bold text-white">{rider.name}</p>
                    <div className="flex items-center gap-2 text-sm text-gray-400 mb-1">
                      <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                      <span>{rider.rating}</span>
                      <span>•</span>
                      <span>{rider.distance} away</span>
                    </div>
                    <p className="text-xs text-gray-500">{rider.vehicle} • {rider.licensePlate}</p>
                  </div>

                  <div className="text-right">
                    {isAccepted ? <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-500/20 text-green-400 rounded-lg text-xs font-bold">
                        <CheckCircle2 className="w-3 h-3" />
                        Accepted
                      </span> : <div className="flex items-center gap-1 text-yellow-400">
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span className="text-xs font-bold">Waiting...</span>
                      </div>}
                  </div>
                </div>

                {/* Segment Assignment */}
                {isAccepted && segment && <motion.div initial={{
              opacity: 0,
              height: 0
            }} animate={{
              opacity: 1,
              height: 'auto'
            }} className="mt-3 pt-3 border-t border-gray-700">
                    <p className="text-xs text-gray-400 uppercase font-bold mb-2">
                      Assigned Segment {segment.segmentNumber}
                    </p>
                    <div className="flex items-center gap-2 text-sm">
                      <MapPin className="w-4 h-4 text-green-400" />
                      <span className="text-gray-300">{segment.startPoint}</span>
                      <Navigation className="w-4 h-4 text-gray-500" />
                      <span className="text-gray-300">{segment.endPoint}</span>
                    </div>
                    <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                      <span>{segment.distance}</span>
                      <span>•</span>
                      <span>{segment.estimatedTime}</span>
                      <span>•</span>
                      <span className="text-green-400 font-bold">${rider.pricePerSegment.toFixed(2)}</span>
                    </div>
                  </motion.div>}
              </motion.div>;
        })}
        </AnimatePresence>
      </div>

      {/* Pricing & Actions */}
      <div className="mt-6 pt-6 border-t border-gray-800">
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-xs text-gray-400 uppercase font-bold mb-1">Total Delivery Cost</p>
            <p className="text-2xl font-bold text-white">${totalPrice.toFixed(2)}</p>
          </div>
          {acceptedRiders.length > 0 && <div className="text-right">
              <p className="text-xs text-gray-400 uppercase font-bold mb-1">Est. Total Time</p>
              <p className="text-lg font-bold text-green-400">
                {routeSegments.reduce((sum, seg) => sum + parseInt(seg.estimatedTime), 0)} mins
              </p>
            </div>}
        </div>

        {isBroadcasting ? <button onClick={onCancel} className="w-full py-3 bg-[#2a2a2a] border border-gray-700 text-gray-400 hover:text-white hover:border-gray-600 font-bold rounded-2xl transition-all">
            Cancel Broadcast
          </button> : <div className="flex items-center justify-center gap-2 text-green-400">
            <CheckCircle2 className="w-5 h-5" />
            <span className="font-bold">Starting delivery...</span>
          </div>}
      </div>
    </motion.div>;
};