import React, { useState, useEffect, useMemo } from 'react';
import { MapPin, Package, Search, Clock, CreditCard, User, Star, Navigation, CheckCircle2, ChevronRight, Bike, Phone, MessageSquare, History, Menu, X, Plus, Send, Home, ShoppingBag, Info, Wallet, Smartphone, Banknote } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

declare global {
  interface Window {
    PaystackPop: any;
  }
}
import { OrderHistory } from './OrderHistory';
import { ProfilePage } from './ProfilePage';
import { RiderBroadcast, BroadcastRider, RouteSegmentInfo } from './RiderBroadcast';
import { MultiRiderTracker, MultiRider, RouteSegment } from './MultiRiderTracker';
import { AuthModal } from './AuthModal';
import { LoginPage } from './LoginPage';
import { DeliveryPartnerPage } from './DeliveryPartnerPage';
import { ConfettiCelebration } from './ConfettiCelebration';
import { AboutPage } from './AboutPage';
import { useCompletionSound } from './useCompletionSound';
import { AnnouncementBar } from './AnnouncementBar';

// --- Types & Constants ---

type DeliveryStatus = 'searching' | 'assigned' | 'picked_up' | 'in_transit' | 'delivered' | 'idle';
type PageView = 'home' | 'history' | 'partner' | 'profile' | 'login' | 'about';
type PaymentMethod = 'cash' | 'momo' | 'card';
interface Rider {
  id: string;
  name: string;
  rating: number;
  trips: number;
  avatar: string;
  distance: string;
  phone: string;
}
interface OrderDetails {
  pickup: string;
  dropoff: string;
  itemType: string;
  weight: string;
  price: number;
}
interface ChatMessage {
  id: string;
  sender: 'user' | 'rider';
  text: string;
  time: string;
}
const AVAILABLE_RIDERS: BroadcastRider[] = [{
  id: '1',
  name: 'James Wilson',
  rating: 4.9,
  trips: 1240,
  avatar: 'https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=100&h=100&fit=crop',
  distance: '1.2 km',
  phone: '+233 55 234 5678',
  vehicle: 'Yamaha MT-07',
  licensePlate: 'ABC 123',
  estimatedArrival: '5 mins',
  pricePerSegment: 8.50
}, {
  id: '2',
  name: 'Sarah Chen',
  rating: 4.8,
  trips: 856,
  avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop',
  distance: '0.8 km',
  phone: '+233 55 876 5432',
  vehicle: 'Honda CBR 650R',
  licensePlate: 'XYZ 789',
  estimatedArrival: '3 mins',
  pricePerSegment: 9.00
}, {
  id: '3',
  name: 'Marcus Rodriguez',
  rating: 4.7,
  trips: 520,
  avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop',
  distance: '2.5 km',
  phone: '+233 55 345 6789',
  vehicle: 'Kawasaki Ninja 400',
  licensePlate: 'DEF 456',
  estimatedArrival: '8 mins',
  pricePerSegment: 7.75
}, {
  id: '4',
  name: 'Emily Watson',
  rating: 4.9,
  trips: 1050,
  avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop',
  distance: '1.5 km',
  phone: '+233 55 567 8901',
  vehicle: 'Suzuki GSX-R750',
  licensePlate: 'GHI 012',
  estimatedArrival: '6 mins',
  pricePerSegment: 8.25
}];
const WEIGHT_OPTIONS = [{
  value: 'small',
  label: 'Small (0-3 kg)',
  examples: 'Document, Phone, Dress, Food, Medicine'
}, {
  value: 'medium',
  label: 'Medium (3-7 kg)',
  examples: 'Shoes, Laptop, Small Appliance, Backpack'
}, {
  value: 'large',
  label: 'Large (7-15 kg)',
  examples: 'Microwave, Grocery Bag, Office Printer, Big Rice Bag'
}, {
  value: 'extra-large',
  label: 'Extra Large (15-30 kg)',
  examples: 'Gas Cylinder, Water Container, Heavy Boxes'
}, {
  value: 'very-heavy',
  label: 'Very Heavy (>30 kg)',
  examples: 'Furniture, Refrigerator, Washing Machine'
}] as any[];

// --- Sub-components (Helpers) ---

const StatusBadge = ({
  status
}: {
  status: DeliveryStatus;
}) => {
  const config = {
    searching: {
      color: 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30',
      label: 'Finding Riders'
    },
    assigned: {
      color: 'bg-blue-500/20 text-blue-400 border border-blue-500/30',
      label: 'Riders Assigned'
    },
    picked_up: {
      color: 'bg-green-500/20 text-green-400 border border-green-500/30',
      label: 'Item Picked Up'
    },
    in_transit: {
      color: 'bg-purple-500/20 text-purple-400 border border-purple-500/30',
      label: 'In Transit'
    },
    delivered: {
      color: 'bg-green-500/20 text-green-400 border border-green-500/30',
      label: 'Delivered'
    },
    idle: {
      color: 'bg-gray-500/20 text-gray-400 border border-gray-500/30',
      label: 'Not Started'
    }
  };
  const {
    color,
    label
  } = config[status];
  return <span className={`px-3 py-1 rounded-full text-xs font-medium ${color}`}>{label}</span>;
};

// Helper function to determine if multi-rider is needed
let searchCount = 0; // Track number of searches to alternate
const requiresMultipleRiders = (pickup: string, dropoff: string, weight: string): number => {
  // Alternate between 2 and 3 riders for each search
  searchCount++;
  return searchCount % 2 === 1 ? 2 : 3; // First search: 2 riders, second: 3 riders, third: 2 riders, etc.
};

// Generate route segments based on pickup and dropoff
const generateRouteSegments = (pickup: string, dropoff: string, numRiders: number): RouteSegmentInfo[] => {
  if (numRiders === 1) {
    return [{
      segmentNumber: 1,
      startPoint: pickup,
      endPoint: dropoff,
      distance: '8.5 km',
      estimatedTime: '15 min'
    }];
  }

  // Multi-rider segments with handover points
  const segments: RouteSegmentInfo[] = [];
  const handoverPoints = ['Central Hub Station', 'West Side Transfer Point', 'North Gateway Plaza'];
  for (let i = 0; i < numRiders; i++) {
    segments.push({
      segmentNumber: i + 1,
      startPoint: i === 0 ? pickup : handoverPoints[i - 1],
      endPoint: i === numRiders - 1 ? dropoff : handoverPoints[i],
      distance: `${(6 + Math.random() * 4).toFixed(1)} km`,
      estimatedTime: `${Math.floor(12 + Math.random() * 8)} min`
    });
  }
  return segments;
};

// @component: DeliveryApp
export const DeliveryApp = () => {
  const [currentPage, setCurrentPage] = useState<PageView>('home');
  const [step, setStep] = useState<number>(1); // 1: Booking, 2: Broadcast/Riders, 3: Pricing, 4: Payment, 5: Tracking
  const [status, setStatus] = useState<DeliveryStatus>('idle');
  const [pickup, setPickup] = useState('');
  const [dropoff, setDropoff] = useState('');
  const [weight, setWeight] = useState('small');
  const [packageType, setPackageType] = useState<'fragile' | 'food' | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [selectedRider, setSelectedRider] = useState<Rider | null>(null);
  const [showChat, setShowChat] = useState(false);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([{
    id: '1',
    sender: 'rider',
    text: "Hi! I'm on my way to the pickup location.",
    time: '14:22'
  }, {
    id: '2',
    sender: 'user',
    text: 'Great! How long will you take?',
    time: '14:23'
  }, {
    id: '3',
    sender: 'rider',
    text: "About 5 minutes. I'm close by!",
    time: '14:23'
  }]);
  const [newMessage, setNewMessage] = useState('');

  // Multi-rider specific state
  const [isMultiRider, setIsMultiRider] = useState(false);
  const [requiredRiders, setRequiredRiders] = useState(1);
  const [routeSegments, setRouteSegments] = useState<RouteSegmentInfo[]>([]);
  const [multiRiders, setMultiRiders] = useState<MultiRider[]>([]);
  const [currentSegment, setCurrentSegment] = useState(1);

  // Pricing & Payment state
  const [totalPrice, setTotalPrice] = useState(0);
  const [basePrice, setBasePrice] = useState(0); // Store base price for calculations
  const [deliveryOption, setDeliveryOption] = useState<'express' | 'standard' | 'economy' | null>(null);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<PaymentMethod | null>(null);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);

  // Who Pays state
  const [whoPays, setWhoPays] = useState<'me' | 'recipient' | null>(null);

  // Collect Cash state (independent)
  const [collectCash, setCollectCash] = useState(false);

  // Collect Cash details state
  const [collectCashAmount, setCollectCashAmount] = useState('');
  const [collectCashPaymentDetails, setCollectCashPaymentDetails] = useState('John Doe\nMobile Money: +233 24 123 4567 (MTN)');

  // Contact Details state
  const [senderNumber, setSenderNumber] = useState('');
  const [recipientNumber, setRecipientNumber] = useState('');
  const [recipientBackupNumber, setRecipientBackupNumber] = useState('');

  // Insurance state
  const [hasInsurance, setHasInsurance] = useState(false);
  const [productPrice, setProductPrice] = useState('');
  const [insuranceCost, setInsuranceCost] = useState(0);

  // Auth state
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<'login' | 'signup'>('signup');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);

  // Celebration state
  const [showCelebration, setShowCelebration] = useState(false);

  // Completion sound hook
  const {
    playCompletionSound
  } = useCompletionSound();

  // Prefill sender number with user's profile phone on page load
  useEffect(() => {
    if (currentUser?.phone) {
      setSenderNumber(currentUser.phone);
    } else {
      // Default fallback if no user
      setSenderNumber('+233 24 123 4567');
    }
  }, [currentUser]);

  // Scroll to top when page changes
  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }, [currentPage]);

  // Simulate multi-rider status progression
  useEffect(() => {
    if (!isMultiRider || status !== 'in_transit') return;
    const timer = setTimeout(() => {
      setCurrentSegment(prev => {
        const next = prev + 1;

        // Update segment statuses
        setMultiRiders(prevRiders => prevRiders.map(rider => {
          if (rider.segment.segmentNumber < next) {
            return {
              ...rider,
              segment: {
                ...rider.segment,
                status: 'completed' as const
              }
            };
          } else if (rider.segment.segmentNumber === next) {
            return {
              ...rider,
              segment: {
                ...rider.segment,
                status: 'in_progress' as const
              }
            };
          }
          return rider;
        }));

        // Check if all segments complete
        if (next > requiredRiders) {
          setStatus('delivered');
          playCompletionSound(); // Play sound when delivered
          setShowCelebration(true); // Show celebration when delivered
          return requiredRiders; // Cap at requiredRiders instead of exceeding it
        }
        return next;
      });
    }, 8000); // Progress to next segment every 8 seconds

    return () => clearTimeout(timer);
  }, [status, currentSegment, isMultiRider, requiredRiders]);

  // Single rider status progression (existing logic)
  useEffect(() => {
    if (isMultiRider) return; // Skip if multi-rider

    let timer: NodeJS.Timeout;
    if (status === 'searching') {
      timer = setTimeout(() => {
        setStatus('assigned');
        setSelectedRider(AVAILABLE_RIDERS[Math.floor(Math.random() * AVAILABLE_RIDERS.length)]);
      }, 3000);
    } else if (status === 'assigned') {
      timer = setTimeout(() => setStatus('picked_up'), 5000);
    } else if (status === 'picked_up') {
      timer = setTimeout(() => setStatus('in_transit'), 5000);
    } else if (status === 'in_transit') {
      timer = setTimeout(() => {
        setStatus('delivered');
        playCompletionSound(); // Play sound when delivered
        setShowCelebration(true); // Show celebration when delivered
      }, 8000);
    }
    return () => clearTimeout(timer);
  }, [status, isMultiRider]);
  const handleCreateOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pickup || !dropoff) return;

    // Move to contact details instead of rider selection
    setStep(1.5); // New step for contact details right after booking
  };
  const handleRidersAccepted = (acceptedRiders: BroadcastRider[], segments: RouteSegmentInfo[]) => {
    // Convert to MultiRider format
    const riders: MultiRider[] = acceptedRiders.map((rider, index) => ({
      ...rider,
      acceptedAt: new Date().toISOString(),
      segment: {
        id: `seg-${index + 1}`,
        segmentNumber: index + 1,
        startPoint: segments[index].startPoint,
        endPoint: segments[index].endPoint,
        distance: segments[index].distance,
        estimatedTime: segments[index].estimatedTime,
        status: index === 0 ? 'in_progress' : 'pending'
      }
    }));
    setMultiRiders(riders);

    // Calculate base price
    const price = acceptedRiders.reduce((sum, rider) => sum + rider.pricePerSegment, 0);
    setBasePrice(price);

    // Move to delivery options step
    setStep(3);
  };
  const handleRiderConfirm = () => {
    // For single rider, calculate base price
    const rider = AVAILABLE_RIDERS[0];
    setBasePrice(rider.pricePerSegment);
    setStep(3); // Go to delivery options step
  };
  const handleDeliveryOptionSelect = (option: 'express' | 'standard' | 'economy') => {
    setDeliveryOption(option);

    // Calculate final price based on option
    let finalPrice = basePrice;
    if (option === 'express') {
      finalPrice = basePrice * 2; // Double price for 30 min delivery
    } else if (option === 'standard') {
      finalPrice = basePrice; // Standard price for 8 hours
    } else if (option === 'economy') {
      finalPrice = basePrice * 0.5; // Half price for 24 hours
    }

    // Add insurance cost if insurance is selected
    if (hasInsurance && insuranceCost > 0) {
      finalPrice += insuranceCost;
    }
    setTotalPrice(finalPrice);
  };
  const handleContactDetailsSubmit = () => {
    if (!senderNumber || !recipientNumber) return;

    // Determine if multi-rider is needed
    const numRiders = requiresMultipleRiders(pickup, dropoff, weight);
    const segments = generateRouteSegments(pickup, dropoff, numRiders);
    setRequiredRiders(numRiders);
    setRouteSegments(segments);
    setIsMultiRider(numRiders > 1);
    setStep(2); // Now go to rider selection
  };
  const handleContinueFromOptions = () => {
    // Go directly to who pays step
    setStep(3.5);
  };
  const handleCancelBroadcast = () => {
    setStep(1); // Go back to booking
    setIsMultiRider(false);
    setRequiredRiders(1);
    setRouteSegments([]);
    setBasePrice(0);
    setDeliveryOption(null);
  };
  const handlePaymentMethodSelect = (method: PaymentMethod) => {
    setSelectedPaymentMethod(method);
  };
  const handlePaymentSuccess = () => {
    setIsProcessingPayment(false);
    setStep(5);
    setStatus('searching');

    if (!isMultiRider) {
      setTimeout(() => {
        setStatus('assigned');
        setSelectedRider(AVAILABLE_RIDERS[0]);
      }, 2000);
    } else {
      setTimeout(() => {
        setStatus('picked_up');
        setCurrentSegment(1);
        setTimeout(() => {
          setStatus('in_transit');
        }, 3000);
      }, 2000);
    }
  };

  const handlePaymentConfirm = () => {
    if (!selectedPaymentMethod) return;
    setIsProcessingPayment(true);

    if (selectedPaymentMethod === 'card') {
      const paystackKey = import.meta.env.VITE_PAYSTACK_PUBLIC_KEY;
      
      if (!paystackKey) {
        alert('Payment configuration error. Please contact support.');
        setIsProcessingPayment(false);
        return;
      }

      const paystack = new window.PaystackPop();
      paystack.newTransaction({
        key: paystackKey,
        email: 'customer@jamjam.delivery',
        amount: Math.round(totalPrice * 100),
        currency: 'GHS',
        ref: 'JJ_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9),
        onSuccess: (transaction: any) => {
          console.log('Payment successful:', transaction.reference);
          handlePaymentSuccess();
        },
        onCancel: () => {
          console.log('Payment cancelled');
          setIsProcessingPayment(false);
        }
      });
    } else {
      setTimeout(() => {
        handlePaymentSuccess();
      }, 2000);
    }
  };
  const resetOrder = () => {
    setStep(1);
    setStatus('idle');
    setPickup('');
    setDropoff('');
    setWeight('small');
    setPackageType(null);
    setSelectedRider(null);
    setShowChat(false);
    setIsMultiRider(false);
    setRequiredRiders(1);
    setRouteSegments([]);
    setMultiRiders([]);
    setCurrentSegment(1);
    setTotalPrice(0);
    setBasePrice(0);
    setDeliveryOption(null);
    setSelectedPaymentMethod(null);
    setIsProcessingPayment(false);
    setWhoPays(null);
    setCollectCash(false);
    setCollectCashAmount('');
    setCollectCashPaymentDetails('');
    setSenderNumber('');
    setRecipientNumber('');
    setRecipientBackupNumber('');
    setHasInsurance(false);
    setProductPrice('');
    setInsuranceCost(0);
    setChatMessages([{
      id: '1',
      sender: 'rider',
      text: "Hi! I'm on my way to the pickup location.",
      time: '14:22'
    }, {
      id: '2',
      sender: 'user',
      text: 'Great! How long will you take?',
      time: '14:23'
    }, {
      id: '3',
      sender: 'rider',
      text: "About 5 minutes. I'm close by!",
      time: '14:23'
    }]);
  };
  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;
    const now = new Date();
    const timeString = `${now.getHours()}:${now.getMinutes().toString().padStart(2, '0')}`;
    setChatMessages([...chatMessages, {
      id: Date.now().toString(),
      sender: 'user',
      text: newMessage,
      time: timeString
    }]);
    setNewMessage('');
    setTimeout(() => {
      setChatMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        sender: 'rider',
        text: 'Got it! Thanks for letting me know.',
        time: timeString
      }]);
    }, 2000);
  };
  const handleCallRider = (riderId: string) => {
    const rider = multiRiders.find(r => r.id === riderId);
    if (rider) {
      window.location.href = `tel:${rider.phone}`;
    }
  };
  const handleChatRider = (riderId: string) => {
    setShowChat(true);
  };
  const handleAuthSuccess = (user: any) => {
    setIsAuthenticated(true);
    setCurrentUser(user);
    console.log('User authenticated:', user);

    // If user selected "Become A Delivery Partner", navigate to partner page
    if (user.becomeDeliveryPartner) {
      setCurrentPage('partner');
    }
  };
  const handleLogout = () => {
    setIsAuthenticated(false);
    setCurrentUser(null);
  };
  const handleCelebrationClose = () => {
    setShowCelebration(false);
  };

  // @return
  return <div className="min-h-screen bg-black flex flex-col font-sans text-white">
      {/* Announcement Bar */}
      <AnnouncementBar />

      {/* Confetti Celebration */}
      <ConfettiCelebration isVisible={showCelebration} onClose={handleCelebrationClose} title="Congratulations!" message={isMultiRider ? `Your item has been successfully delivered! Segment ${requiredRiders} of ${requiredRiders} completed. Thank you for using JamJam.` : "Your item has been delivered successfully! Thank you for using JamJam."} />

      {/* Header */}
      <header className="sticky top-0 z-40 w-full bg-black border-b border-gray-800 px-4 md:px-8 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button onClick={() => setIsSidebarOpen(true)} className="p-2 hover:bg-gray-800 rounded-lg md:hidden">
            <Menu className="w-6 h-6" />
          </button>
          <button onClick={() => {
          if (status === 'delivered' && step === 5) {
            resetOrder();
          }
          setCurrentPage('home');
        }} className="flex items-center gap-3 hover:opacity-80 transition-opacity">
            <div className="bg-gradient-to-br from-pink-600 to-pink-500 p-2 rounded-xl">
              <Bike className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-xl font-bold tracking-tight text-white">JamJam</h1>
          </button>
        </div>
        
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-400">
          <button onClick={() => {
          if (status === 'delivered' && step === 5) {
            resetOrder();
          }
          setCurrentPage('home');
        }} className={currentPage === 'home' ? 'text-white' : 'hover:text-white'}>Book Delivery</button>
          <button onClick={() => setCurrentPage('history')} className={currentPage === 'history' ? 'text-white' : 'hover:text-white'}>Order History</button>
          <button onClick={() => setCurrentPage('partner')} className={currentPage === 'partner' ? 'text-white' : 'hover:text-white'}>Delivery Partner</button>
          <button onClick={() => setCurrentPage('profile')} className={currentPage === 'profile' ? 'text-white' : 'hover:text-white'}>Profile</button>
          <button onClick={() => setCurrentPage('about')} className={currentPage === 'about' ? 'text-white' : 'hover:text-white'}>About JamJam</button>
        </nav>

        {isAuthenticated && currentUser ? <div className="flex items-center gap-4">
            <div className="hidden sm:block text-right">
              <p className="text-xs text-gray-400 font-medium">Hello, {currentUser.name || 'John'}</p>
              <p className="text-sm font-bold text-white">GH₵ 124.50</p>
            </div>
            <div className="w-10 h-10 rounded-full bg-gray-700 border-2 border-gray-600 overflow-hidden cursor-pointer">
              <img src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop" alt="User" />
            </div>
          </div> : <div className="flex items-center gap-3">
            <button onClick={() => {
          setCurrentPage('login');
        }} className="px-4 py-2 text-sm font-medium text-gray-400 hover:text-white transition-colors">
              Login
            </button>
            <button onClick={() => {
          setAuthModalMode('signup');
          setIsAuthModalOpen(true);
        }} className="px-4 py-2 text-sm font-bold bg-gradient-to-r from-pink-600 to-pink-500 hover:from-pink-700 hover:to-pink-600 text-white rounded-xl shadow-lg shadow-pink-900/30 transition-all">
              Sign Up
            </button>
          </div>}
      </header>

      {/* Auth Modal */}
      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} onSuccess={handleAuthSuccess} initialMode={authModalMode} onModeChange={setAuthModalMode} />

      {/* Sidebar Mobile Navigation */}
      <AnimatePresence>
        {isSidebarOpen && <>
            <motion.div initial={{
          opacity: 0
        }} animate={{
          opacity: 1
        }} exit={{
          opacity: 0
        }} onClick={() => setIsSidebarOpen(false)} className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50" />
            <motion.div initial={{
          x: '-100%'
        }} animate={{
          x: 0
        }} exit={{
          x: '-100%'
        }} transition={{
          type: 'spring',
          damping: 25,
          stiffness: 200
        }} className="fixed left-0 top-0 h-full w-72 bg-[#1a1a1a] z-[60] p-6 shadow-2xl border-r border-gray-800">
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-lg font-bold text-white">Menu</h2>
                <button onClick={() => setIsSidebarOpen(false)} className="p-2 hover:bg-gray-800 rounded-full">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="space-y-4">
                {[{
              icon: <Plus className="w-5 h-5" />,
              label: 'Book Delivery',
              page: 'home' as PageView
            }, {
              icon: <History className="w-5 h-5" />,
              label: 'Order History',
              page: 'history' as PageView
            }, {
              icon: <Bike className="w-5 h-5" />,
              label: 'Delivery Partner',
              page: 'partner' as PageView
            }, {
              icon: <User className="w-5 h-5" />,
              label: 'Profile',
              page: 'profile' as PageView
            }, {
              icon: <Info className="w-5 h-5" />,
              label: 'About JamJam',
              page: 'about' as PageView
            }].map((item, idx) => <button key={idx} onClick={() => {
              setCurrentPage(item.page);
              setIsSidebarOpen(false);
            }} className={`flex items-center gap-4 w-full p-3 rounded-xl transition-colors group ${currentPage === item.page ? 'bg-pink-600 text-white' : 'hover:bg-gray-800 text-gray-300'}`}>
                    <span className={currentPage === item.page ? 'text-white' : 'text-gray-400 group-hover:text-pink-500'}>
                      {item.icon}
                    </span>
                    <span className="font-medium">{item.label}</span>
                  </button>)}
              </div>
            </motion.div>
          </>}
      </AnimatePresence>

      {/* Main Content - Conditional Rendering Based on Current Page */}
      {currentPage !== 'home' ? <div className="flex-1">
          {currentPage === 'history' && <OrderHistory />}
          {currentPage === 'about' && <AboutPage onNavigateToSendItem={() => setCurrentPage('home')} onNavigateToDeliveryPartner={() => setCurrentPage('partner')} />}
          {currentPage === 'partner' && <DeliveryPartnerPage />}
          {currentPage === 'profile' && <ProfilePage />}
          {currentPage === 'login' && <LoginPage onLoginSuccess={user => {
        handleAuthSuccess(user);
        setCurrentPage('home');
      }} onNavigateToSignup={() => {
        setAuthModalMode('signup');
        setIsAuthModalOpen(true);
        setCurrentPage('home');
      }} />}
        </div> : <main className="flex-1 flex flex-col md:flex-row gap-4 p-4 md:p-6 max-w-7xl mx-auto w-full relative">
          {/* Clickable overlay when delivered - click anywhere to go home */}
          {status === 'delivered' && step === 5 && <div onClick={resetOrder} className="absolute inset-0 z-[5] cursor-pointer" title="Click anywhere to return home" />}

          {/* Left Side: Forms / Details */}
          <div className="w-full md:w-2/5 flex flex-col gap-4 relative z-10">
            <AnimatePresence mode="wait">
              {step === 1 && <motion.div key="booking" initial={{
            opacity: 0,
            y: 20
          }} animate={{
            opacity: 1,
            y: 0
          }} exit={{
            opacity: 0,
            y: -20
          }} className="bg-[#1f1f1f] p-4 rounded-3xl border border-gray-800">
                  <div className="mb-4">
                    <h2 className="text-2xl font-bold mb-1 text-white">Book A Delivery</h2>
                    <p className="text-gray-400 text-sm">Our system will assign the best riders for your route</p>
                  </div>

                  <form onSubmit={handleCreateOrder} className="space-y-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Pickup Location</label>
                      <div className="relative">
                        <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-green-500" />
                        <input required type="text" value={pickup} onChange={e => setPickup(e.target.value)} placeholder="Current address, building..." className="w-full pl-10 pr-4 py-3.5 bg-[#2a2a2a] border border-gray-700 rounded-xl focus:ring-2 focus:ring-green-500 focus:outline-none transition-all text-white placeholder-gray-500" />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Drop-off Location</label>
                      <div className="relative">
                        <Navigation className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-pink-500" />
                        <input required type="text" value={dropoff} onChange={e => setDropoff(e.target.value)} placeholder="Delivery destination..." className="w-full pl-10 pr-4 py-3.5 bg-[#2a2a2a] border border-gray-700 rounded-xl focus:ring-2 focus:ring-green-500 focus:outline-none transition-all text-white placeholder-gray-500" />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Package Weight</label>
                      <select value={weight} onChange={e => setWeight(e.target.value)} className="w-full p-2.5 bg-[#2a2a2a] border border-gray-700 rounded-xl focus:ring-2 focus:ring-green-500 focus:outline-none text-white text-sm">
                        {WEIGHT_OPTIONS.map(opt => <option key={opt.value} value={opt.value}>
                            {opt.label} • {opt.examples}
                          </option>)}
                      </select>
                      <p className="text-[10px] text-gray-500 mt-0.5 pl-1">
                        📦 Select the weight category that best matches your item
                      </p>
                    </div>

                    {/* Package Type: Fragile/Perishable/Food */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Package Type (Optional)</label>
                      <div className="flex gap-2">
                        <button type="button" onClick={() => setPackageType(packageType === 'fragile' ? null : 'fragile')} className={`flex-1 px-3 py-2 rounded-lg text-xs font-medium transition-all ${packageType === 'fragile' ? 'bg-orange-500/20 text-orange-400 border-2 border-orange-500' : 'bg-[#2a2a2a] text-gray-400 border border-gray-700 hover:border-orange-500/50'}`}>
                          Fragile (eg. glass)
                        </button>
                        <button type="button" onClick={() => setPackageType(packageType === 'food' ? null : 'food')} className={`flex-1 px-3 py-2 rounded-lg text-xs font-medium transition-all ${packageType === 'food' ? 'bg-green-500/20 text-green-400 border-2 border-green-500' : 'bg-[#2a2a2a] text-gray-400 border border-gray-700 hover:border-green-500/50'}`}>
                          Food
                        </button>
                      </div>
                    </div>

                    <div className="pt-3">
                      <button type="submit" className="w-full bg-gradient-to-r from-pink-600 to-pink-500 hover:from-pink-700 hover:to-pink-600 text-white font-bold py-3 rounded-2xl shadow-lg shadow-pink-900/50 transition-all active:scale-[0.98] flex items-center justify-center gap-2">
                        Find Riders <ChevronRight className="w-5 h-5" />
                      </button>
                    </div>
                  </form>
                </motion.div>}

              {/* STEP 1.5: Contact Details (moved right after booking) */}
              {step === 1.5 && <motion.div key="contact-details-early" initial={{
            opacity: 0,
            y: 20
          }} animate={{
            opacity: 1,
            y: 0
          }} exit={{
            opacity: 0,
            y: -20
          }} className="bg-[#1f1f1f] p-6 rounded-3xl border border-gray-800">
                  <div className="mb-6">
                    <h2 className="text-2xl font-bold mb-1 text-white">Contact Details</h2>
                    <p className="text-gray-400 text-sm">Provide contact information for delivery coordination</p>
                  </div>

                  <form onSubmit={e => {
              e.preventDefault();
              handleContactDetailsSubmit();
            }} className="space-y-5 mb-6">
                    {/* Sender Phone Number */}
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                        Sender Phone Number
                      </label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-pink-500" />
                        <input required type="tel" value={senderNumber} onChange={e => setSenderNumber(e.target.value)} placeholder="e.g., 0551234567" className="w-full pl-10 pr-4 py-2.5 bg-[#2a2a2a] border border-gray-700 rounded-xl focus:ring-2 focus:ring-pink-500 focus:outline-none transition-all text-white placeholder-gray-500" />
                      </div>
                    </div>

                    {/* Recipient Phone Number */}
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                        Recipient Phone Number
                      </label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-pink-500" />
                        <input required type="tel" value={recipientNumber} onChange={e => setRecipientNumber(e.target.value)} placeholder="e.g., 0241234567" className="w-full pl-10 pr-4 py-2.5 bg-[#2a2a2a] border border-gray-700 rounded-xl focus:ring-2 focus:ring-pink-500 focus:outline-none transition-all text-white placeholder-gray-500" />
                      </div>
                    </div>

                    {/* Recipient Backup Number (Optional) */}
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                        Recipient Backup Number <span className="text-gray-500 normal-case">(Recommended)</span>
                      </label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                        <input type="tel" value={recipientBackupNumber} onChange={e => setRecipientBackupNumber(e.target.value)} placeholder="e.g., 0201234567" className="w-full pl-10 pr-4 py-2.5 bg-[#2a2a2a] border border-gray-700 rounded-xl focus:ring-2 focus:ring-pink-500 focus:outline-none transition-all text-white placeholder-gray-500" />
                      </div>
                      <p className="text-xs text-gray-500 pl-1">
                        Alternative contact in case recipient is unreachable
                      </p>
                    </div>

                    <div className="space-y-3">
                      <button type="submit" disabled={!senderNumber || !recipientNumber} className="w-full bg-gradient-to-r from-pink-600 to-pink-500 hover:from-pink-700 hover:to-pink-600 text-white font-bold py-4 rounded-2xl shadow-lg shadow-pink-900/50 transition-all active:scale-[0.98] flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed">
                        Continue <ChevronRight className="w-5 h-5" />
                      </button>
                      <button type="button" onClick={() => {
                  setStep(1);
                }} className="w-full bg-[#2a2a2a] text-gray-300 font-medium py-3 rounded-2xl hover:bg-[#333] transition-all border border-gray-700">
                        Back
                      </button>
                    </div>
                  </form>
                </motion.div>}

              {step === 2 && isMultiRider && <RiderBroadcast availableRiders={AVAILABLE_RIDERS} routeSegments={routeSegments} requiredRiders={requiredRiders} onRidersAccepted={handleRidersAccepted} onCancel={handleCancelBroadcast} />}

              {/* STEP 3: Delivery Options Selection */}
              {step === 3 && <motion.div key="delivery-options" initial={{
            opacity: 0,
            y: 20
          }} animate={{
            opacity: 1,
            y: 0
          }} exit={{
            opacity: 0,
            y: -20
          }} className="bg-[#1f1f1f] p-5 rounded-3xl border border-gray-800">
                  <div className="mb-3.5">
                    <h2 className="text-xl font-bold mb-1 text-white">Select Price</h2>
                    <p className="text-gray-400 text-xs">Choose your preferred delivery speed</p>
                  </div>

                  <div className="space-y-3 mb-6">
                    {/* Express Option - 30 min, Double Price */}
                    <button type="button" onClick={() => handleDeliveryOptionSelect('express')} className={`w-full p-2.5 rounded-2xl border-2 transition-all group ${deliveryOption === 'express' ? 'border-pink-500/30 bg-pink-500/10' : 'border-gray-700 bg-[#2a2a2a] hover:border-pink-500/50 hover:bg-pink-500/5'}`}>
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-3">
                          <div className={`p-2.5 rounded-xl transition-colors ${deliveryOption === 'express' ? 'bg-pink-500/30' : 'bg-pink-500/20'}`}>
                            <Clock className="w-5 h-5 text-pink-400" />
                          </div>
                          <div className="text-left">
                            <p className="font-bold text-white text-base mb-0.5">Express Delivery</p>
                            <p className="text-xs text-gray-400">Arrives in 30 minutes</p>
                          </div>
                        </div>
                        <ChevronRight className="w-5 h-5 text-gray-500" />
                      </div>
                      <div className="border-t border-gray-700 pt-2 flex items-center justify-between">
                        <div>
                          <p className="text-xs font-bold text-pink-400 uppercase mb-0.5 flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3" />
                            FASTEST
                          </p>
                          <p className="text-xs text-gray-500">Delivery</p>
                        </div>
                        <p className="text-2xl font-bold text-pink-400">GH₵ {(basePrice * 2).toFixed(2)}</p>
                      </div>
                    </button>

                    {/* Standard Option - 8 hours, Main Price */}
                    <button type="button" onClick={() => handleDeliveryOptionSelect('standard')} className={`w-full p-2.5 rounded-2xl border-2 transition-all group ${deliveryOption === 'standard' ? 'border-green-500/30' : 'border-gray-700 bg-[#2a2a2a] hover:border-green-500/50 hover:bg-green-500/5'}`}>
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-3">
                          <div className={`p-2.5 rounded-xl transition-colors ${deliveryOption === 'standard' ? 'bg-green-500/30' : 'bg-green-500/20'}`}>
                            <Bike className="w-5 h-5 text-green-400" />
                          </div>
                          <div className="text-left">
                            <p className="font-bold text-white text-base mb-0.5">Standard Delivery</p>
                            <p className="text-xs text-gray-400">Arrives in 8 hours</p>
                          </div>
                        </div>
                        <ChevronRight className="w-5 h-5 text-gray-500" />
                      </div>
                      <div className="border-t border-gray-700 pt-2 flex items-center justify-between">
                        <div>
                          <p className="text-xs font-bold text-green-400 uppercase mb-0.5 flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3" />
                            RECOMMENDED
                          </p>
                          <p className="text-xs text-gray-500">Delivery</p>
                        </div>
                        <p className="text-2xl font-bold text-green-400">GH₵ {basePrice.toFixed(2)}</p>
                      </div>
                    </button>

                    {/* Economy Option - 24 hours, Half Price */}
                    <button type="button" onClick={() => handleDeliveryOptionSelect('economy')} className={`w-full p-2.5 rounded-2xl border-2 transition-all group ${deliveryOption === 'economy' ? 'border-blue-500/30' : 'border-gray-700 bg-[#2a2a2a] hover:border-blue-500/50 hover:bg-blue-500/5'}`}>
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-3">
                          <div className={`p-2.5 rounded-xl transition-colors ${deliveryOption === 'economy' ? 'bg-blue-500/30' : 'bg-blue-500/20'}`}>
                            <Package className="w-5 h-5 text-blue-400" />
                          </div>
                          <div className="text-left">
                            <p className="font-bold text-white text-base mb-0.5">Economy Delivery</p>
                            <p className="text-xs text-gray-400">Arrives in 24 hours</p>
                          </div>
                        </div>
                        <ChevronRight className="w-5 h-5 text-gray-500" />
                      </div>
                      <div className="border-t border-gray-700 pt-2 flex items-center justify-between">
                        <div>
                          <p className="text-xs font-bold text-blue-400 uppercase mb-0.5 flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3" />
                            AFFORDABLE
                          </p>
                          <p className="text-xs text-gray-500">Delivery</p>
                        </div>
                        <p className="text-2xl font-bold text-blue-400">GH₵ {(basePrice * 0.5).toFixed(2)}</p>
                      </div>
                    </button>
                  </div>

                  <div className="space-y-2">
                    <button type="button" onClick={handleContinueFromOptions} disabled={!deliveryOption} className="w-full bg-gradient-to-r from-pink-600 to-pink-500 hover:from-pink-700 hover:to-pink-600 text-white font-bold py-3 rounded-xl shadow-lg shadow-pink-900/50 transition-all active:scale-[0.98] flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:from-gray-700 disabled:to-gray-700 disabled:shadow-none">
                      Continue <ChevronRight className="w-5 h-5" />
                    </button>
                    <button type="button" onClick={() => {
                setStep(2);
              }} className="w-full bg-[#2a2a2a] text-gray-300 font-medium py-2.5 rounded-xl hover:bg-[#333] transition-all border border-gray-700">
                      Back
                    </button>
                  </div>
                </motion.div>}

              {/* STEP 3.3: Updated Delivery Options with Insurance */}
              {step === 3.3 && <motion.div key="delivery-options-insurance" initial={{
            opacity: 0,
            y: 20
          }} animate={{
            opacity: 1,
            y: 0
          }} exit={{
            opacity: 0,
            y: -20
          }} className="bg-[#1f1f1f] p-6 rounded-3xl border border-gray-800">
                  <div className="mb-6">
                    <h2 className="text-2xl font-bold mb-1 text-white">Select Option</h2>
                    <p className="text-gray-400 text-sm">Insurance coverage included</p>
                  </div>

                  {/* Insurance Summary Badge */}
                  <div className="mb-4 bg-purple-500/10 border border-purple-500/30 rounded-2xl p-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="p-1.5 bg-purple-500/20 rounded-lg">
                          <ShoppingBag className="w-5 h-5 text-purple-400" />
                        </div>
                        <div>
                          <p className="text-xs font-bold text-white">Insurance Active</p>
                          <p className="text-xs text-gray-400">Item value: GH₵ {parseFloat(productPrice).toFixed(2)}</p>
                        </div>
                      </div>
                      <p className="text-sm font-bold text-purple-400">+GH₵ {insuranceCost.toFixed(2)}</p>
                    </div>
                  </div>

                  <div className="space-y-3 mb-6">
                    {/* Express Option with Insurance */}
                    <button onClick={() => {
                setDeliveryOption('express');
                setTotalPrice(basePrice * 2 + insuranceCost);
                setStep(3.5);
              }} className="w-full p-4 rounded-2xl border-2 border-gray-700 bg-[#2a2a2a] hover:border-pink-500 hover:bg-pink-500/5 transition-all group">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-pink-500/20 rounded-xl group-hover:bg-pink-500/30 transition-colors">
                            <Clock className="w-5 h-5 text-pink-400" />
                          </div>
                          <div className="text-left">
                            <p className="font-bold text-white text-base mb-0.5">Express Delivery</p>
                            <p className="text-xs text-gray-400">Arrives in 30 minutes</p>
                          </div>
                        </div>
                        <ChevronRight className="w-4 h-4 text-gray-500 group-hover:text-pink-400 transition-colors" />
                      </div>
                      <div className="flex items-center justify-between pt-2 border-t border-gray-700">
                        <div className="flex flex-col gap-0.5">
                          <span className="text-xs font-bold text-pink-400 uppercase flex items-center gap-1.5">
                            <CheckCircle2 className="w-3 h-3" />
                            Fastest
                          </span>
                          <span className="text-xs text-gray-500">Delivery + Insurance</span>
                        </div>
                        <span className="text-xl font-bold text-pink-400">GH₵ {(basePrice * 2 + insuranceCost).toFixed(2)}</span>
                      </div>
                    </button>

                    {/* Standard Option with Insurance */}
                    <button onClick={() => {
                setDeliveryOption('standard');
                setTotalPrice(basePrice + insuranceCost);
                setStep(3.5);
              }} className="w-full p-4 rounded-2xl border-2 border-green-500/50 bg-green-500/5 hover:border-green-500 hover:bg-green-500/10 transition-all group">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-green-500/20 rounded-xl group-hover:bg-green-500/30 transition-colors">
                            <Bike className="w-5 h-5 text-green-400" />
                          </div>
                          <div className="text-left">
                            <p className="font-bold text-white text-base mb-0.5">Standard Delivery</p>
                            <p className="text-xs text-gray-400">Arrives in 8 hours</p>
                          </div>
                        </div>
                        <ChevronRight className="w-4 h-4 text-gray-500 group-hover:text-green-400 transition-colors" />
                      </div>
                      <div className="flex items-center justify-between pt-2 border-t border-green-500/30">
                        <div className="flex flex-col gap-0.5">
                          <span className="text-xs font-bold text-green-400 uppercase flex items-center gap-1.5">
                            <CheckCircle2 className="w-3 h-3" />
                            Recommended
                          </span>
                          <span className="text-xs text-gray-500">Delivery + Insurance</span>
                        </div>
                        <span className="text-xl font-bold text-green-400">GH₵ {(basePrice + insuranceCost).toFixed(2)}</span>
                      </div>
                    </button>

                    {/* Economy Option with Insurance */}
                    <button onClick={() => {
                setDeliveryOption('economy');
                setTotalPrice(basePrice * 0.5 + insuranceCost);
                setStep(3.5);
              }} className="w-full p-4 rounded-2xl border-2 border-gray-700 bg-[#2a2a2a] hover:border-blue-500 hover:bg-blue-500/5 transition-all group">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-blue-500/20 rounded-xl group-hover:bg-blue-500/30 transition-colors">
                            <Package className="w-5 h-5 text-blue-400" />
                          </div>
                          <div className="text-left">
                            <p className="font-bold text-white text-base mb-0.5">Economy Delivery</p>
                            <p className="text-xs text-gray-400">Arrives in 24 hours</p>
                          </div>
                        </div>
                        <ChevronRight className="w-4 h-4 text-gray-500 group-hover:text-blue-400 transition-colors" />
                      </div>
                      <div className="flex items-center justify-between pt-2 border-t border-gray-700">
                        <div className="flex flex-col gap-0.5">
                          <span className="text-xs font-bold text-blue-400 uppercase">Affordable</span>
                          <span className="text-xs text-gray-500">Delivery + Insurance</span>
                        </div>
                        <span className="text-xl font-bold text-blue-400">GH₵ {(basePrice * 0.5 + insuranceCost).toFixed(2)}</span>
                      </div>
                    </button>
                  </div>

                  <button onClick={() => setStep(3.2)} className="w-full bg-[#2a2a2a] text-gray-300 font-medium py-3 rounded-2xl hover:bg-[#333] transition-all border border-gray-700">
                    Back
                  </button>
                </motion.div>}

              {/* STEP 3.5: Who Pays For Delivery */}
              {step === 3.5 && <motion.div key="who-pays" initial={{
            opacity: 0,
            y: 20
          }} animate={{
            opacity: 1,
            y: 0
          }} exit={{
            opacity: 0,
            y: -20
          }} className="bg-[#1f1f1f] p-6 rounded-3xl border border-gray-800">
                  <div className="mb-6">
                    <h2 className="text-2xl font-bold mb-1 text-white">Who Pays For Delivery?</h2>
                    <p className="text-gray-400 text-sm">Select who will be responsible for payment</p>
                  </div>

                  <div className="space-y-3 mb-6">
                    {/* Recipient Option */}
                    <button onClick={() => setWhoPays('recipient')} className={`w-full p-4 rounded-2xl border-2 transition-all group ${whoPays === 'recipient' ? 'border-pink-500 bg-pink-500/10' : 'border-gray-700 bg-[#2a2a2a] hover:border-pink-500/50 hover:bg-pink-500/5'}`}>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className={`p-2 rounded-xl transition-colors ${whoPays === 'recipient' ? 'bg-pink-500/20' : 'bg-gray-700/50 group-hover:bg-pink-500/10'}`}>
                            <User className={`w-5 h-5 ${whoPays === 'recipient' ? 'text-pink-400' : 'text-gray-400 group-hover:text-pink-400'}`} />
                          </div>
                          <div className="text-left">
                            <p className={`font-bold text-base mb-0.5 ${whoPays === 'recipient' ? 'text-white' : 'text-gray-300'}`}>Recipient</p>
                            <p className="text-sm text-gray-400">Recipient will pay for delivery</p>
                          </div>
                        </div>
                        {whoPays === 'recipient' && <CheckCircle2 className="w-5 h-5 text-pink-500" />}
                      </div>
                    </button>

                    {/* Me Option */}
                    <button onClick={() => setWhoPays('me')} className={`w-full p-4 rounded-2xl border-2 transition-all group ${whoPays === 'me' ? 'border-pink-500 bg-pink-500/10' : 'border-gray-700 bg-[#2a2a2a] hover:border-pink-500/50 hover:bg-pink-500/5'}`}>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className={`p-2 rounded-xl transition-colors ${whoPays === 'me' ? 'bg-pink-500/20' : 'bg-gray-700/50 group-hover:bg-pink-500/10'}`}>
                            <Wallet className={`w-5 h-5 ${whoPays === 'me' ? 'text-pink-400' : 'text-gray-400 group-hover:text-pink-400'}`} />
                          </div>
                          <div className="text-left">
                            <p className={`font-bold text-base mb-0.5 ${whoPays === 'me' ? 'text-white' : 'text-gray-300'}`}>Me</p>
                            <p className="text-sm text-gray-400">I will pay for the delivery</p>
                          </div>
                        </div>
                        {whoPays === 'me' && <CheckCircle2 className="w-5 h-5 text-pink-500" />}
                      </div>
                    </button>
                  </div>

                  {/* Separator Line */}
                  <div className="relative mb-6">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-gray-700"></div>
                    </div>
                    <div className="relative flex justify-center">
                      <span className="bg-[#1f1f1f] px-4 text-xs text-gray-500 uppercase tracking-wider"></span>
                    </div>
                  </div>

                  {/* Collect Cash For Me Option (Optional) */}
                  <div className="mb-6">
                    <button onClick={() => {
                setStep(3.6); // Navigate to cash collection questions
              }} className={`w-full p-3 rounded-2xl border-2 transition-all group ${collectCash ? 'border-pink-500 bg-pink-500/10' : 'border-gray-700 bg-[#2a2a2a] hover:border-pink-500/50 hover:bg-pink-500/5'}`}>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className={`p-2 rounded-xl transition-colors ${collectCash ? 'bg-pink-500/20' : 'bg-gray-700/50 group-hover:bg-pink-500/10'}`}>
                            <Banknote className={`w-5 h-5 ${collectCash ? 'text-pink-400' : 'text-gray-400 group-hover:text-pink-400'}`} />
                          </div>
                          <div className="text-left flex-1">
                            <p className={`font-bold text-base mb-0.5 ${collectCash ? 'text-white' : 'text-gray-300'}`}>Collect Cash For Me</p>
                            <p className="text-xs text-gray-400">Payment On Delivery - Rider ensures you receive your money</p>
                          </div>
                        </div>
                        {collectCash && <CheckCircle2 className="w-5 h-5 text-pink-500" />}
                      </div>
                    </button>
                  </div>

                  <div className="space-y-2">
                    <button onClick={() => {
                if (whoPays === 'me' || whoPays === 'recipient') {
                  // If recipient pays, go to tracking since contact details already collected
                  if (whoPays === 'recipient') {
                    setStep(5); // Go directly to tracking
                    setStatus('searching');

                    // Auto-progress to tracking for single rider
                    if (!isMultiRider) {
                      setTimeout(() => {
                        setStatus('assigned');
                        setSelectedRider(AVAILABLE_RIDERS[0]);
                      }, 2000);
                    } else {
                      // For multi-rider, auto-progress
                      setTimeout(() => {
                        setStatus('picked_up');
                        setCurrentSegment(1);
                        setTimeout(() => {
                          setStatus('in_transit');
                        }, 3000);
                      }, 2000);
                    }
                  } else {
                    // If sender pays, go to payment step
                    setStep(4);
                  }
                }
              }} disabled={!whoPays} className="w-full bg-gradient-to-r from-pink-600 to-pink-500 hover:from-pink-700 hover:to-pink-600 text-white font-bold py-3 rounded-xl shadow-lg shadow-pink-900/50 transition-all active:scale-[0.98] flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:from-gray-700 disabled:to-gray-700 disabled:shadow-none">
                      {whoPays === 'recipient' ? 'Continue' : 'Proceed to Payment'} <ChevronRight className="w-5 h-5" />
                    </button>
                    <button onClick={() => {
                // Go back to the correct previous step
                if (hasInsurance && productPrice) {
                  setStep(3.3); // Go back to delivery options with insurance
                } else {
                  setStep(3); // Go back to delivery options without insurance
                }
              }} className="w-full bg-[#2a2a2a] text-gray-300 font-medium py-2.5 rounded-xl hover:bg-[#333] transition-all border border-gray-700">
                      Back
                    </button>
                  </div>
                </motion.div>}

              {/* STEP 3.6: Collect Cash Questions */}
              {step === 3.6 && <motion.div key="collect-cash" initial={{
            opacity: 0,
            y: 20
          }} animate={{
            opacity: 1,
            y: 0
          }} exit={{
            opacity: 0,
            y: -20
          }} className="bg-[#1f1f1f] p-6 rounded-3xl border border-gray-800">
                  <div className="mb-6">
                    <h2 className="text-2xl font-bold mb-1 text-white">Collect Cash For Me</h2>
                    <p className="text-gray-400 text-sm">Provide details for cash collection</p>
                  </div>

                  <form onSubmit={e => {
              e.preventDefault();
              if (collectCashAmount) {
                setCollectCash(true);
                setStep(3.5); // Go back to who pays step
              }
            }} className="space-y-5 mb-6">
                    {/* Question 1: Amount */}
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                        How much is the customer supposed to send you?
                      </label>
                      <div className="relative">
                        <Banknote className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-pink-500" />
                        <input required type="number" step="0.01" min="0" value={collectCashAmount} onChange={e => setCollectCashAmount(e.target.value)} placeholder="Enter amount in GH₵..." className="w-full pl-10 pr-4 py-3 bg-[#2a2a2a] border border-gray-700 rounded-xl focus:ring-2 focus:ring-pink-500 focus:outline-none transition-all text-white placeholder-gray-500" />
                      </div>
                    </div>

                    {/* Info Box */}
                    <div className="bg-pink-500/10 border border-pink-500/30 rounded-2xl p-4">
                      <div className="flex items-start gap-3">
                        <div className="p-2 bg-pink-500/20 rounded-lg">
                          <Banknote className="w-5 h-5 text-pink-400" />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-bold text-white mb-1">How it works</p>
                          <ul className="text-xs text-gray-400 space-y-1">
                            <li>• Rider will collect the specified amount from the customer</li>
                            <li>• Customer will send payment to us</li>
                            <li>• You can withdraw the money</li>
                            <li>• Ensure the customer is aware so they prepare money on their wallet</li>
                            <li>• Payment on delivery costs 1.5% to cover charges and extra delivery time spent</li>
                          </ul>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <button type="submit" disabled={!collectCashAmount} className="w-full bg-gradient-to-r from-pink-600 to-pink-500 hover:from-pink-700 hover:to-pink-600 text-white font-bold py-4 rounded-2xl shadow-lg shadow-pink-900/50 transition-all active:scale-[0.98] flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed">
                        Continue <ChevronRight className="w-5 h-5" />
                      </button>
                      <button type="button" onClick={() => {
                  setStep(3.5);
                  setCollectCashAmount('');
                  setCollectCashPaymentDetails('');
                  setCollectCash(false);
                }} className="w-full bg-[#2a2a2a] text-gray-300 font-medium py-3 rounded-2xl hover:bg-[#333] transition-all border border-gray-700">
                        Back
                      </button>
                    </div>
                  </form>
                </motion.div>}

              {/* STEP 4: Payment Method Selection */}
              {step === 4 && <motion.div key="payment" initial={{
            opacity: 0,
            y: 20
          }} animate={{
            opacity: 1,
            y: 0
          }} exit={{
            opacity: 0,
            y: -20
          }} className="bg-[#1f1f1f] p-6 rounded-3xl border border-gray-800">
                  <div className="mb-6">
                    <h2 className="text-2xl font-bold mb-1 text-white">Payment Method</h2>
                    <p className="text-gray-400 text-sm">Choose how you'd like to pay</p>
                  </div>

                  <div className="space-y-3 mb-6">
                    {/* Mobile Money */}
                    <button onClick={() => handlePaymentMethodSelect('momo')} className={`w-full p-4 rounded-2xl border-2 transition-all ${selectedPaymentMethod === 'momo' ? 'border-pink-500/30' : 'border-gray-700 bg-[#2a2a2a] hover:border-gray-600'}`}>
                      <div className="flex items-center gap-4">
                        <div className={`p-3 rounded-xl ${selectedPaymentMethod === 'momo' ? 'bg-pink-500/20' : 'bg-gray-700/50'}`}>
                          <Smartphone className={`w-5 h-5 ${selectedPaymentMethod === 'momo' ? 'text-pink-400' : 'text-gray-400'}`} />
                        </div>
                        <div className="flex-1 text-left">
                          <p className={`font-bold ${selectedPaymentMethod === 'momo' ? 'text-white' : 'text-gray-300'}`}>Mobile Money</p>
                          <p className="text-xs text-gray-500">MTN, Vodafone, AirtelTigo</p>
                        </div>
                        {selectedPaymentMethod === 'momo' && <CheckCircle2 className="w-6 h-6 text-pink-500" />}
                      </div>
                    </button>

                    {/* Card Payment */}
                    <button onClick={() => handlePaymentMethodSelect('card')} className={`w-full p-4 rounded-2xl border-2 transition-all ${selectedPaymentMethod === 'card' ? 'border-pink-500/30' : 'border-gray-700 bg-[#2a2a2a] hover:border-gray-600'}`}>
                      <div className="flex items-center gap-4">
                        <div className={`p-3 rounded-xl ${selectedPaymentMethod === 'card' ? 'bg-pink-500/20' : 'bg-gray-700/50'}`}>
                          <CreditCard className={`w-5 h-5 ${selectedPaymentMethod === 'card' ? 'text-pink-400' : 'text-gray-400'}`} />
                        </div>
                        <div className="flex-1 text-left">
                          <p className={`font-bold ${selectedPaymentMethod === 'card' ? 'text-white' : 'text-gray-300'}`}>Card Payment</p>
                          <p className="text-xs text-gray-500">Visa, Mastercard</p>
                        </div>
                        {selectedPaymentMethod === 'card' && <CheckCircle2 className="w-6 h-6 text-pink-500" />}
                      </div>
                    </button>

                    {/* Cash */}
                    <button onClick={() => handlePaymentMethodSelect('cash')} className={`w-full p-4 rounded-2xl border-2 transition-all ${selectedPaymentMethod === 'cash' ? 'border-pink-500/30' : 'border-gray-700 bg-[#2a2a2a] hover:border-gray-600'}`}>
                      <div className="flex items-center gap-4">
                        <div className={`p-3 rounded-xl ${selectedPaymentMethod === 'cash' ? 'bg-pink-500/20' : 'bg-gray-700/50'}`}>
                          <Banknote className={`w-5 h-5 ${selectedPaymentMethod === 'cash' ? 'text-pink-400' : 'text-gray-400'}`} />
                        </div>
                        <div className="flex-1 text-left">
                          <p className={`font-bold ${selectedPaymentMethod === 'cash' ? 'text-white' : 'text-gray-300'}`}>Cash</p>
                          <p className="text-xs text-gray-500">Pay on delivery</p>
                        </div>
                        {selectedPaymentMethod === 'cash' && <CheckCircle2 className="w-6 h-6 text-pink-500" />}
                      </div>
                    </button>
                  </div>

                  <div className="bg-[#2a2a2a] p-4 rounded-2xl border border-gray-700 mb-6">
                    <div className="flex items-center justify-between">
                      <p className="text-sm text-gray-400">Amount to Pay</p>
                      <p className="text-2xl font-bold text-pink-400">GH₵ {totalPrice.toFixed(2)}</p>
                    </div>
                  </div>

                  <button onClick={handlePaymentConfirm} disabled={!selectedPaymentMethod || isProcessingPayment} className="w-full bg-gradient-to-r from-pink-600 to-pink-500 hover:from-pink-700 hover:to-pink-600 text-white font-bold py-3 rounded-xl shadow-lg shadow-pink-900/50 transition-all active:scale-[0.98] flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed">
                    {isProcessingPayment ? <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        Processing...
                      </> : <>
                        Confirm Payment <CheckCircle2 className="w-5 h-5" />
                      </>}
                  </button>
                  <button onClick={() => setStep(3.5)} disabled={isProcessingPayment} className="w-full mt-3 bg-[#2a2a2a] text-gray-300 font-medium py-2.5 rounded-xl hover:bg-[#333] transition-all border border-gray-700 disabled:opacity-50">
                    Back
                  </button>
                </motion.div>}

              {/* STEP 5: Tracking (existing tracking code) */}
              {step === 5 && isMultiRider && <motion.div key="multi-tracking" initial={{
            opacity: 0,
            scale: 0.95
          }} animate={{
            opacity: 1,
            scale: 1
          }} className="bg-[#1f1f1f] p-4 rounded-3xl border border-gray-800">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-green-500/20 text-green-400 rounded-lg">
                        <Clock className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Est. Total Time</p>
                        <p className="text-lg font-bold text-white">
                          {routeSegments.reduce((sum, seg) => sum + parseInt(seg.estimatedTime), 0)} mins
                        </p>
                      </div>
                    </div>
                    <StatusBadge status={status} />
                  </div>

                  <MultiRiderTracker riders={multiRiders} currentSegment={currentSegment} pickupLocation={pickup} dropoffLocation={dropoff} onCallRider={handleCallRider} onChatRider={handleChatRider} />

                  {/* Chat Section */}
                  <AnimatePresence>
                    {showChat && <motion.div initial={{
                height: 0,
                opacity: 0
              }} animate={{
                height: 'auto',
                opacity: 1
              }} exit={{
                height: 0,
                opacity: 0
              }} className="mt-4 overflow-hidden">
                        <div className="bg-[#2a2a2a] rounded-2xl p-4 border border-gray-700">
                          <div className="flex items-center justify-between mb-3">
                            <h3 className="text-sm font-bold text-white">Chat with Active Rider</h3>
                            <button onClick={() => setShowChat(false)} className="text-gray-400 hover:text-white">
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                          
                          <div className="space-y-3 mb-3 max-h-48 overflow-y-auto">
                            {chatMessages.map(msg => <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                                <div className={`max-w-[80%] ${msg.sender === 'user' ? 'bg-pink-600 text-white' : 'bg-[#333] border border-gray-700 text-white'} rounded-2xl px-4 py-2`}>
                                  <p className="text-sm">{msg.text}</p>
                                  <p className={`text-[10px] mt-1 ${msg.sender === 'user' ? 'text-pink-200' : 'text-gray-500'}`}>
                                    {msg.time}
                                  </p>
                                </div>
                              </div>)}
                          </div>

                          <form onSubmit={handleSendMessage} className="flex gap-2">
                            <input type="text" value={newMessage} onChange={e => setNewMessage(e.target.value)} placeholder="Type a message..." className="flex-1 px-4 py-2 bg-[#333] border border-gray-700 rounded-xl text-sm focus:ring-2 focus:ring-green-500 focus:outline-none text-white placeholder-gray-500" />
                            <button type="submit" className="p-2 bg-pink-600 text-white rounded-xl hover:bg-pink-700 transition-colors">
                              <Send className="w-4 h-4" />
                            </button>
                          </form>
                        </div>
                      </motion.div>}
                  </AnimatePresence>

                  {status === 'delivered' && <div className="mt-4 space-y-2">
                      <button onClick={resetOrder} className="w-full py-3 bg-pink-600 text-white font-bold rounded-xl hover:bg-pink-700 transition-all shadow-lg shadow-pink-900/50 relative z-10">
                        Rate & Review Riders (Optional)
                      </button>
                      <button onClick={resetOrder} className="w-full py-2 bg-[#2a2a2a] text-gray-300 font-medium rounded-xl hover:bg-[#333] transition-all border border-gray-700 relative z-10">
                        Go Back to Home
                      </button>
                      <p className="text-xs text-center text-gray-500 pt-1">
                        Tap anywhere to return home
                      </p>
                    </div>}
                </motion.div>}

              {step === 5 && !isMultiRider && <motion.div key="tracking" initial={{
            opacity: 0,
            scale: 0.95
          }} animate={{
            opacity: 1,
            scale: 1
          }} className="bg-[#1f1f1f] p-4 rounded-3xl border border-gray-800">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-green-500/20 text-green-400 rounded-lg">
                        <Clock className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Estimated Arrival</p>
                        <p className="text-lg font-bold text-white">14:45 (24 mins)</p>
                      </div>
                    </div>
                    <StatusBadge status={status} />
                  </div>

                  {selectedRider && <div className="p-3 bg-[#2a2a2a] rounded-2xl mb-4 border border-gray-700">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <img src={selectedRider.avatar} className="w-12 h-12 rounded-full ring-2 ring-gray-700" alt="" />
                          <div>
                            <p className="font-bold text-sm text-white">{selectedRider.name}</p>
                            <p className="text-xs text-gray-400">Yamaha MT-07 • ABC 123</p>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <a href={`tel:${selectedRider.phone}`} className="px-3 py-1.5 bg-green-500/20 text-green-400 border border-green-500/30 rounded-lg hover:bg-green-500/30 transition-all text-xs font-bold flex items-center gap-1">
                            <Phone className="w-3 h-3" />
                            Call
                          </a>
                          <a href={`https://wa.me/${selectedRider.phone.replace(/\\D/g, '')}`} target="_blank" rel="noopener noreferrer" className="px-3 py-1.5 bg-green-500/20 text-green-400 border border-green-500/30 rounded-lg hover:bg-green-500/30 transition-all text-xs font-bold flex items-center gap-1">
                            <MessageSquare className="w-3 h-3" />
                            WhatsApp
                          </a>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between pt-2 border-t border-gray-700">
                        <div className="flex items-center gap-2 text-xs text-gray-400">
                          <Phone className="w-3 h-3" />
                          <span className="font-mono">{selectedRider.phone}</span>
                        </div>
                        <div className="flex gap-2">
                          <a href={`tel:${selectedRider.phone}`} className="px-3 py-1.5 bg-green-500/20 text-green-400 border border-green-500/30 rounded-lg hover:bg-green-500/30 transition-all text-xs font-bold flex items-center gap-1">
                            <Phone className="w-3 h-3" />
                            Call
                          </a>
                          <a href={`https://wa.me/${selectedRider.phone.replace(/\\D/g, '')}`} target="_blank" rel="noopener noreferrer" className="px-3 py-1.5 bg-green-500/20 text-green-400 border border-green-500/30 rounded-lg hover:bg-green-500/30 transition-all text-xs font-bold flex items-center gap-1">
                            <MessageSquare className="w-3 h-3" />
                            WhatsApp
                          </a>
                        </div>
                      </div>
                    </div>}

                  <div className="space-y-4 relative ml-4 border-l-2 border-gray-800 pl-6 pb-2">
                    {[{
                state: 'searching',
                icon: <Search />,
                label: 'Order Confirmed',
                time: '14:20'
              }, {
                state: 'assigned',
                icon: <User />,
                label: 'Rider Assigned',
                time: '14:22'
              }, {
                state: 'picked_up',
                icon: <Package />,
                label: 'Item Collected',
                time: '--:--'
              }, {
                state: 'delivered',
                icon: <CheckCircle2 />,
                label: 'Delivered',
                time: '--:--'
              }].map((stepItem, idx) => {
                const isCompleted = ['searching', 'assigned', 'picked_up', 'in_transit', 'delivered'].indexOf(status) >= ['searching', 'assigned', 'picked_up', 'in_transit', 'delivered'].indexOf(stepItem.state as any);
                return <div key={idx} className="relative">
                          <div className={`absolute -left-[33px] top-0 w-5 h-5 rounded-full border-2 ${isCompleted ? 'bg-green-500 border-green-500' : 'bg-[#2a2a2a] border-gray-700'} flex items-center justify-center transition-colors duration-500`}>
                            {isCompleted && <CheckCircle2 className="w-3 h-3 text-white" />}
                          </div>
                          <div className="flex justify-between items-start">
                            <div>
                              <p className={`font-bold text-sm ${isCompleted ? 'text-white' : 'text-gray-500'}`}>
                                {stepItem.label}
                              </p>
                              <p className="text-xs text-gray-600">Status update automatically</p>
                            </div>
                            <p className="text-xs font-medium text-gray-500">{stepItem.time}</p>
                          </div>
                        </div>;
              })}
                  </div>

                  {status === 'delivered' && <div className="mt-4 space-y-2">
                      <button onClick={resetOrder} className="w-full py-3 bg-pink-600 text-white font-bold rounded-xl hover:bg-pink-700 transition-all shadow-lg shadow-pink-900/50 relative z-10">
                        Rate & Review (Optional)
                      </button>
                      <button onClick={resetOrder} className="w-full py-2 bg-[#2a2a2a] text-gray-300 font-medium rounded-xl hover:bg-[#333] transition-all border border-gray-700 relative z-10">
                        Go Back to Home
                      </button>
                      <p className="text-xs text-center text-gray-500 pt-1">
                        Tap anywhere to return home
                      </p>
                    </div>}
                </motion.div>}
            </AnimatePresence>

            <div className="bg-gradient-to-br from-pink-600 to-pink-500 text-white p-5 rounded-3xl overflow-hidden relative">
              <div className="relative z-10">
                <h3 className="font-bold text-lg mb-2">Invite Friends!</h3>
                <p className="text-pink-100 text-sm mb-4">Help friends with long distance delivery (Eg. Accra-Kumasi)</p>
                <button className="px-4 py-2 bg-white text-pink-600 font-bold text-sm rounded-lg hover:bg-pink-50 transition-colors">
                  Share Link
                </button>
              </div>
              <Bike className="absolute -right-4 -bottom-4 w-32 h-32 opacity-10 rotate-12" />
            </div>
          </div>

          {/* Right Side: Visual Map Area */}
          <div className="flex-1 min-h-[500px] md:min-h-0 bg-[#1a1a1a] rounded-[2.5rem] overflow-hidden relative border border-gray-800">
            {/* Mock Map Background */}
            <div className="absolute inset-0 bg-[#111] opacity-60">
              <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <pattern id="grid" width="80" height="80" patternUnits="userSpaceOnUse">
                    <path d="M 80 0 L 0 0 0 80" fill="none" stroke="#222" strokeWidth="2" />
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#grid)" />
              </svg>
            </div>

            {/* Animated Route Line */}
            <svg className="absolute inset-0 w-full h-full p-12 overflow-visible pointer-events-none">
              <motion.path d={isMultiRider ? "M 150 150 C 200 200, 250 250, 300 300 C 350 350, 450 400, 550 450 C 600 500, 650 550, 700 600" : "M 150 150 C 300 150, 400 450, 600 500"} fill="none" stroke="#22c55e" strokeWidth="4" strokeDasharray="10,10" initial={{
            pathLength: 0,
            opacity: 0
          }} animate={{
            pathLength: step >= 2 ? 1 : 0,
            opacity: step >= 2 ? 1 : 0
          }} transition={{
            duration: 2,
            ease: 'easeInOut'
          }} />
            </svg>

            {/* Location Markers */}
            <div className="absolute top-[140px] left-[140px] z-10">
              <div className="relative group">
                <div className="absolute inset-0 bg-green-500/20 rounded-full blur-xl opacity-20 scale-150 animate-pulse" />
                <div className="relative bg-[#1f1f1f] p-1 rounded-full shadow-lg border-2 border-green-500">
                  <MapPin className="w-5 h-5 text-green-500" />
                </div>
                <div className="absolute left-full ml-2 top-0 bg-[#1f1f1f] px-3 py-1 rounded-lg shadow-sm border border-gray-700 whitespace-nowrap hidden md:block">
                  <p className="text-[10px] font-bold text-green-400 uppercase">Pickup</p>
                  <p className="text-xs font-bold text-white">{pickup || 'Awaiting address...'}</p>
                </div>
              </div>
            </div>

            {/* Handover Points for Multi-Rider */}
            {isMultiRider && step >= 2 && routeSegments.slice(0, -1).map((segment, index) => {
          const positions = [{
            top: '300px',
            left: '290px'
          }, {
            top: '450px',
            left: '540px'
          }];
          return <motion.div key={index} initial={{
            opacity: 0,
            scale: 0
          }} animate={{
            opacity: 1,
            scale: 1
          }} transition={{
            delay: 0.5 + index * 0.3
          }} className="absolute z-10" style={positions[index]}>
                  <div className="relative group">
                    <div className="absolute inset-0 bg-orange-500/20 rounded-full blur-xl opacity-20 scale-150 animate-pulse" />
                    <div className="relative bg-[#1f1f1f] p-1 rounded-full shadow-lg border-2 border-orange-500">
                      <MapPin className="w-4 h-4 text-orange-500" />
                    </div>
                    <div className="absolute right-full mr-2 top-0 bg-[#1f1f1f] px-2 py-1 rounded-lg shadow-sm border border-gray-700 text-right whitespace-nowrap hidden lg:block">
                      <p className="text-[9px] font-bold text-orange-400 uppercase">Handover {index + 1}</p>
                      <p className="text-[10px] font-bold text-white">{segment.endPoint}</p>
                    </div>
                  </div>
                </motion.div>;
        })}

            {/* Drop-off Location Marker */}
            {(dropoff || pickup) && <div className="absolute bottom-[100px] right-[150px] z-10">
              <div className="relative group">
                <div className="absolute inset-0 bg-pink-500/20 rounded-full blur-xl opacity-20 scale-150 animate-pulse" />
                <div className="relative bg-[#1f1f1f] p-1 rounded-full shadow-lg border-2 border-pink-500">
                  <Navigation className="w-5 h-5 text-pink-500" />
                </div>
                <div className="absolute right-full mr-2 top-0 bg-[#1f1f1f] px-3 py-1 rounded-lg shadow-sm border border-gray-700 text-right whitespace-nowrap hidden md:block">
                  <p className="text-[10px] font-bold text-pink-400 uppercase">Drop-off</p>
                  <p className="text-xs font-bold text-white">{dropoff || 'Awaiting destination...'}</p>
                </div>
              </div>
            </div>}

            {/* Animated Rider Marker(s) */}
            {status !== 'idle' && step === 5 && (isMultiRider && multiRiders.length > 0 ?
        // Multi-rider markers
        multiRiders.map((rider, index) => {
          if (rider.segment.status === 'pending') return null;
          const positions = [{
            top: '150px',
            left: '150px'
          }, {
            top: '300px',
            left: '290px'
          }, {
            top: '450px',
            left: '540px'
          }, {
            top: '600px',
            left: '650px'
          }];
          const pos = positions[index];
          return <motion.div key={rider.id} className="absolute z-20" initial={pos} animate={pos} transition={{
            duration: 5,
            ease: 'linear'
          }}>
                  <div className="relative">
                    <div className="absolute inset-0 bg-green-500/20 rounded-full blur-md opacity-30 animate-pulse" />
                    <div className="bg-[#1f1f1f] p-2 rounded-2xl shadow-xl border-2 border-green-500 flex items-center gap-2">
                      <div className="bg-green-500/20 p-1.5 rounded-lg text-green-400">
                        <Bike className="w-5 h-5" />
                      </div>
                      <div className="pr-1">
                        <p className="text-[10px] font-bold text-gray-400 uppercase leading-none mb-1">
                          Rider {index + 1}
                        </p>
                        <p className="text-xs font-bold leading-none text-white">
                          {rider.name.split(' ')[0]}
                        </p>
                      </div>
                    </div>
                  </div>
                </motion.div>;
        }) :
        // Single rider marker
        <motion.div className="absolute z-20" initial={{
          top: '150px',
          left: '150px'
        }} animate={status === 'picked_up' ? {
          top: '300px',
          left: '350px'
        } : status === 'in_transit' ? {
          top: '450px',
          left: '550px'
        } : status === 'delivered' ? {
          top: '490px',
          left: '590px'
        } : {
          top: '150px',
          left: '150px'
        }} transition={{
          duration: 5,
          ease: 'linear'
        }}>
                  <div className="relative">
                    <div className="absolute inset-0 bg-green-500/20 rounded-full blur-md opacity-30 animate-pulse" />
                    <div className="bg-[#1f1f1f] p-2 rounded-2xl shadow-xl border-2 border-green-500 flex items-center gap-2">
                      <div className="bg-green-500/20 p-1.5 rounded-lg text-green-400">
                        <Bike className="w-5 h-5" />
                      </div>
                      <div className="pr-1">
                        <p className="text-[10px] font-bold text-gray-400 uppercase leading-none mb-1">Rider</p>
                        <p className="text-xs font-bold leading-none text-white">
                          {selectedRider?.name || 'Assigned Rider'}
                        </p>
                      </div>
                    </div>
                  </div>
                </motion.div>)}

            {/* Floating Controls */}
            <div className="absolute bottom-6 right-6 flex flex-col gap-2">
              <button className="w-12 h-12 bg-[#2a2a2a] rounded-2xl shadow-lg border border-gray-700 flex items-center justify-center text-gray-400 hover:text-green-400 transition-colors">
                <Search className="w-5 h-5" />
              </button>
              <button className="w-12 h-12 bg-[#2a2a2a] rounded-2xl shadow-lg border border-gray-700 flex items-center justify-center text-gray-400 hover:text-green-400 transition-colors">
                <Navigation className="w-5 h-5" />
              </button>
              <div className="mt-2 flex flex-col items-center gap-2 bg-[#2a2a2a] p-2 rounded-2xl shadow-lg border border-gray-700">
                <button className="w-8 h-8 rounded-lg hover:bg-[#333] flex items-center justify-center font-bold text-gray-400">+</button>
                <div className="w-6 h-[1px] bg-gray-700" />
                <button className="w-8 h-8 rounded-lg hover:bg-[#333] flex items-center justify-center font-bold text-gray-400">−</button>
              </div>
            </div>
          </div>
        </main>}

      {/* Footer Mobile View */}
      <footer className="md:hidden sticky bottom-0 z-40 w-full bg-black border-t border-gray-800 px-6 py-3 flex items-center justify-between">
        {[{
        icon: <Home className="w-5 h-5" />,
        label: 'Home',
        page: 'home' as PageView
      }, {
        icon: <History className="w-5 h-5" />,
        label: 'History',
        page: 'history' as PageView
      }, {
        icon: <User className="w-5 h-5" />,
        label: 'Profile',
        page: 'profile' as PageView
      }].map((item, idx) => <button key={idx} onClick={() => setCurrentPage(item.page)} className={`p-3 rounded-2xl transition-all ${currentPage === item.page ? 'bg-pink-600 text-white shadow-lg shadow-pink-900/50' : 'text-gray-400'}`}>
            {item.icon}
          </button>)}
      </footer>
    </div>;
};