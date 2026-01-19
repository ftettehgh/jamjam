import React, { useState } from 'react';
import { User, Mail, Phone, MapPin, Edit2, Camera, LogOut, Bell, Shield, CreditCard, Heart, ChevronRight, Star, Package, Award, DollarSign, TrendingUp, Plus, Trash2, HelpCircle, MessageSquare, Send, CheckCircle2, Wallet, ArrowUpRight, ArrowDownLeft, Search, Clock, Phone as PhoneIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';

// --- Types ---

interface UserProfile {
  name: string;
  email: string;
  phone: string;
  backupPhone: string;
  address: string;
  avatar: string;
  memberSince: string;
  totalOrders: number;
  rating: number;
}
interface PaymentMethod {
  id: string;
  type: 'card' | 'mobile_money';
  provider: string;
  maskedIdentifier: string;
  isDefault: boolean;
}
interface Transaction {
  id: string;
  amount: number;
  description: string;
  date: string;
  time: string;
}
interface FAQItem {
  question: string;
  answer: string;
  category: string;
}

// --- Mock Data ---

const MOCK_USER: UserProfile = {
  name: 'John Doe',
  email: 'john.doe@email.com',
  phone: '+233 24 123 4567',
  backupPhone: '+233 20 987 6543',
  address: '15 Airport Road, Accra, Ghana',
  avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop',
  memberSince: 'Jan 2023',
  totalOrders: 47,
  rating: 4.8
};
const MOCK_PAYMENT_METHODS: PaymentMethod[] = [{
  id: '1',
  type: 'card',
  provider: 'Visa',
  maskedIdentifier: '4532 •••• •••• 8790',
  isDefault: true
}, {
  id: '2',
  type: 'mobile_money',
  provider: 'M-Pesa',
  maskedIdentifier: '+254 7** *** 678',
  isDefault: false
}, {
  id: '3',
  type: 'mobile_money',
  provider: 'MTN MoMo',
  maskedIdentifier: '+256 7** *** 123',
  isDefault: false
}];
const SPENDING_TREND_DATA = [{
  month: 'Jul',
  amount: 45
}, {
  month: 'Aug',
  amount: 62
}, {
  month: 'Sep',
  amount: 58
}, {
  month: 'Oct',
  amount: 75
}, {
  month: 'Nov',
  amount: 88
}, {
  month: 'Dec',
  amount: 95
}, {
  month: 'Jan',
  amount: 124.50
}];
const CATEGORY_SPENDING = [{
  category: 'Food',
  amount: 45.50,
  percentage: 36
}, {
  category: 'Documents',
  amount: 28.00,
  percentage: 22
}, {
  category: 'Electronics',
  amount: 35.00,
  percentage: 28
}, {
  category: 'Other',
  amount: 16.00,
  percentage: 14
}];
const RECENT_TRANSACTIONS: Transaction[] = [{
  id: 'TXN-001',
  amount: 12.50,
  description: 'Delivery to 456 Oak Ave',
  date: 'Jan 15',
  time: '14:30'
}, {
  id: 'TXN-002',
  amount: 18.75,
  description: 'Delivery to 321 Pine Rd',
  date: 'Jan 14',
  time: '10:15'
}, {
  id: 'TXN-003',
  amount: 24.00,
  description: 'Delivery to 999 River Rd',
  date: 'Jan 12',
  time: '09:20'
}];
const FAQ_ITEMS: FAQItem[] = [{
  category: 'Orders',
  question: 'How do I track my order?',
  answer: 'You can track your order in real-time on the main tracking screen. You\'ll receive updates as your rider picks up and delivers your item.'
}, {
  category: 'Payment',
  question: 'What payment methods do you accept?',
  answer: 'We accept credit/debit cards (Visa, Mastercard), and African Mobile Money providers including M-Pesa, MTN MoMo, Airtel Money, and Orange Money.'
}, {
  category: 'Delivery',
  question: 'How long does delivery take?',
  answer: 'Delivery times vary based on distance and rider availability, typically ranging from 15-45 minutes. You\'ll see an estimated time when booking.'
}, {
  category: 'Account',
  question: 'How do I update my payment methods?',
  answer: 'Navigate to the Payment Methods section in your profile to add, edit, or remove payment options.'
}];

// --- Component ---

export const ProfilePage = () => {
  const [user, setUser] = useState<UserProfile>(MOCK_USER);
  const [activeTab, setActiveTab] = useState<'overview' | 'spending' | 'payments' | 'support'>('overview');
  const [paymentMethods, setPaymentMethods] = useState(MOCK_PAYMENT_METHODS);
  const [showAddPayment, setShowAddPayment] = useState(false);
  const [newPaymentType, setNewPaymentType] = useState<'card' | 'mobile_money'>('card');
  const [expandedFAQ, setExpandedFAQ] = useState<number | null>(null);
  const totalSpent = 124.50;
  const thisMonthSpent = 55.25;
  const averagePerOrder = (totalSpent / user.totalOrders).toFixed(2);
  const handleDeletePaymentMethod = (id: string) => {
    setPaymentMethods(paymentMethods.filter(pm => pm.id !== id));
  };
  const handleSetDefault = (id: string) => {
    setPaymentMethods(paymentMethods.map(pm => ({
      ...pm,
      isDefault: pm.id === id
    })));
  };
  return <div className="min-h-screen bg-black text-white p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header with Profile Card */}
        <motion.div initial={{
        opacity: 0,
        y: 20
      }} animate={{
        opacity: 1,
        y: 0
      }} className="bg-gradient-to-br from-pink-600 to-pink-500 p-6 md:p-8 rounded-3xl mb-6 relative overflow-hidden">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <pattern id="dots" width="20" height="20" patternUnits="userSpaceOnUse">
                  <circle cx="2" cy="2" r="1" fill="white" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#dots)" />
            </svg>
          </div>

          <div className="relative z-10 flex flex-col md:flex-row items-center gap-6">
            {/* Avatar */}
            <div className="relative">
              <img src={user.avatar} alt={user.name} className="w-24 h-24 md:w-28 md:h-28 rounded-full border-4 border-white/30 shadow-xl" />
              <button className="absolute bottom-0 right-0 p-2 bg-white text-pink-600 rounded-full shadow-lg hover:scale-110 transition-transform">
                <Camera className="w-4 h-4" />
              </button>
            </div>

            {/* User Info */}
            <div className="flex-1 text-center md:text-left">
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-1">{user.name}</h2>
              <p className="text-pink-100 text-sm mb-4">Member since {user.memberSince}</p>
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 md:gap-4">
                <div className="flex items-center gap-2 bg-white/20 px-3 py-1.5 rounded-lg backdrop-blur-sm">
                  <Package className="w-4 h-4" />
                  <span className="text-sm font-bold">{user.totalOrders} Orders</span>
                </div>
                <div className="flex items-center gap-2 bg-white/20 px-3 py-1.5 rounded-lg backdrop-blur-sm">
                  <Star className="w-4 h-4 fill-yellow-300 text-yellow-300" />
                  <span className="text-sm font-bold">{user.rating} Rating</span>
                </div>
                <div className="flex items-center gap-2 bg-white/20 px-3 py-1.5 rounded-lg backdrop-blur-sm">
                  <Award className="w-4 h-4" />
                  <span className="text-sm font-bold">Gold Member</span>
                </div>
              </div>
            </div>

            <button className="px-5 py-2.5 bg-white text-pink-600 font-bold rounded-xl hover:bg-pink-50 transition-colors shadow-lg flex items-center gap-2">
              <Edit2 className="w-4 h-4" />
              Edit Profile
            </button>
          </div>
        </motion.div>

        {/* Tab Navigation */}
        <div className="mb-6 flex gap-2 overflow-x-auto pb-2">
          {[{
          id: 'overview',
          label: 'Overview',
          icon: <User className="w-4 h-4" />
        }, {
          id: 'spending',
          label: 'Spending',
          icon: <TrendingUp className="w-4 h-4" />
        }, {
          id: 'payments',
          label: 'Payment Methods',
          icon: <CreditCard className="w-4 h-4" />
        }, {
          id: 'support',
          label: 'Support',
          icon: <HelpCircle className="w-4 h-4" />
        }].map(tab => <button key={tab.id} onClick={() => setActiveTab(tab.id as any)} className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium text-sm transition-all whitespace-nowrap ${activeTab === tab.id ? 'bg-gradient-to-r from-pink-600 to-pink-500 text-white shadow-lg shadow-pink-900/50' : 'bg-[#1f1f1f] text-gray-400 border border-gray-800 hover:border-gray-700'}`}>
              {tab.icon}
              {tab.label}
            </button>)}
        </div>

        {/* Tab Content */}
        <AnimatePresence mode="wait">
          {/* Overview Tab */}
          {activeTab === 'overview' && <motion.div key="overview" initial={{
          opacity: 0,
          y: 20
        }} animate={{
          opacity: 1,
          y: 0
        }} exit={{
          opacity: 0,
          y: -20
        }} className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Contact Information */}
              <div className="bg-[#1f1f1f] p-6 rounded-3xl border border-gray-800">
                <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <User className="w-5 h-5 text-pink-400" />
                  Contact Information
                </h3>
                <div className="space-y-4">
                  <div className="flex items-start gap-4">
                    <div className="p-2 bg-[#2a2a2a] rounded-lg border border-gray-700">
                      <Mail className="w-5 h-5 text-gray-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-gray-500 uppercase font-bold mb-1">Email Address</p>
                      <p className="text-white font-medium truncate">{user.email}</p>
                    </div>
                    <button className="p-2 hover:bg-[#2a2a2a] rounded-lg transition-colors text-gray-400 hover:text-pink-400 flex-shrink-0">
                      <Edit2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="p-2 bg-[#2a2a2a] rounded-lg border border-gray-700">
                      <Phone className="w-5 h-5 text-gray-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-gray-500 uppercase font-bold mb-1">Phone Number</p>
                      <p className="text-white font-medium">{user.phone}</p>
                    </div>
                    <button className="p-2 hover:bg-[#2a2a2a] rounded-lg transition-colors text-gray-400 hover:text-pink-400 flex-shrink-0">
                      <Edit2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="p-2 bg-[#2a2a2a] rounded-lg border border-gray-700">
                      <Phone className="w-5 h-5 text-gray-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-gray-500 uppercase font-bold mb-1">Backup Phone Number</p>
                      <p className="text-white font-medium">{user.backupPhone}</p>
                    </div>
                    <button className="p-2 hover:bg-[#2a2a2a] rounded-lg transition-colors text-gray-400 hover:text-pink-400 flex-shrink-0">
                      <Edit2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="p-2 bg-[#2a2a2a] rounded-lg border border-gray-700">
                      <MapPin className="w-5 h-5 text-gray-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-gray-500 uppercase font-bold mb-1">Default Address</p>
                      <p className="text-white font-medium">{user.address}</p>
                    </div>
                    <button className="p-2 hover:bg-[#2a2a2a] rounded-lg transition-colors text-gray-400 hover:text-pink-400 flex-shrink-0">
                      <Edit2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Quick Stats */}
              <div className="bg-[#1f1f1f] p-6 rounded-3xl border border-gray-800">
                <h3 className="text-xl font-bold mb-4">Account Settings</h3>
                <div className="space-y-3">
                  {[{
                icon: <Bell className="w-5 h-5" />,
                label: 'Notifications',
                description: 'Manage your notification preferences',
                color: 'text-yellow-400'
              }, {
                icon: <Shield className="w-5 h-5" />,
                label: 'Privacy & Security',
                description: 'Control your data and security settings',
                color: 'text-green-400'
              }, {
                icon: <Heart className="w-5 h-5" />,
                label: 'Saved Addresses',
                description: 'Quick access to frequent locations',
                color: 'text-pink-400'
              }].map((option, index) => <button key={index} className="w-full flex items-center gap-4 p-4 bg-[#2a2a2a] hover:bg-[#333] border border-gray-700 hover:border-gray-600 rounded-2xl transition-all group">
                      <div className={`p-2 bg-[#1f1f1f] rounded-xl border border-gray-700 ${option.color} flex-shrink-0`}>
                        {option.icon}
                      </div>
                      <div className="flex-1 text-left min-w-0">
                        <p className="font-bold text-white group-hover:text-pink-400 transition-colors">
                          {option.label}
                        </p>
                        <p className="text-xs text-gray-500 truncate">{option.description}</p>
                      </div>
                      <ChevronRight className="w-5 h-5 text-gray-600 group-hover:text-pink-400 transition-colors flex-shrink-0" />
                    </button>)}
                </div>

                <div className="mt-6 p-4 bg-red-500/10 border border-red-500/30 rounded-2xl">
                  <h4 className="text-red-400 font-bold mb-2 text-sm">Danger Zone</h4>
                  <p className="text-gray-400 text-xs mb-3">
                    Permanently delete your account and all associated data.
                  </p>
                  <button className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white font-bold rounded-xl transition-colors text-sm flex items-center gap-2">
                    <Trash2 className="w-4 h-4" />
                    Delete Account
                  </button>
                </div>
              </div>
            </motion.div>}

          {/* Spending Tab */}
          {activeTab === 'spending' && <motion.div key="spending" initial={{
          opacity: 0,
          y: 20
        }} animate={{
          opacity: 1,
          y: 0
        }} exit={{
          opacity: 0,
          y: -20
        }} className="space-y-6">
              {/* Total Spent Card */}
              <div className="bg-gradient-to-br from-pink-600 via-pink-500 to-orange-500 p-6 md:p-8 rounded-3xl relative overflow-hidden">
                <div className="absolute inset-0 opacity-20">
                  <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
                    <defs>
                      <pattern id="spend-pattern" width="40" height="40" patternUnits="userSpaceOnUse">
                        <circle cx="20" cy="20" r="1" fill="white" />
                      </pattern>
                    </defs>
                    <rect width="100%" height="100%" fill="url(#spend-pattern)" />
                  </svg>
                </div>

                <div className="relative z-10">
                  <div className="flex items-center gap-2 mb-4">
                    <DollarSign className="w-6 h-6 text-white" />
                    <p className="text-white/80 text-sm font-bold uppercase tracking-wider">Total Spent</p>
                  </div>
                  <div className="flex items-end justify-between mb-6">
                    <div>
                      <p className="text-5xl font-bold text-white mb-2">${totalSpent.toFixed(2)}</p>
                      <p className="text-white/80 text-sm">Lifetime delivery spending</p>
                    </div>
                  </div>

                  {/* Quick Stats */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-white/10 backdrop-blur-sm p-4 rounded-xl border border-white/20">
                      <p className="text-white/80 text-xs uppercase font-bold mb-1">This Month</p>
                      <p className="text-2xl font-bold text-white">${thisMonthSpent.toFixed(2)}</p>
                    </div>
                    <div className="bg-white/10 backdrop-blur-sm p-4 rounded-xl border border-white/20">
                      <p className="text-white/80 text-xs uppercase font-bold mb-1">Avg per Order</p>
                      <p className="text-2xl font-bold text-white">${averagePerOrder}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid lg:grid-cols-2 gap-6">
                {/* Spending Trend Chart */}
                <div className="bg-[#1f1f1f] p-6 rounded-3xl border border-gray-800">
                  <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-green-400" />
                    Spending Trend
                  </h3>
                  <ResponsiveContainer width="100%" height={250}>
                    <AreaChart data={SPENDING_TREND_DATA}>
                      <defs>
                        <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#ec4899" stopOpacity={0.3} />
                          <stop offset="95%" stopColor="#ec4899" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                      <XAxis dataKey="month" stroke="#666" />
                      <YAxis stroke="#666" />
                      <Tooltip contentStyle={{
                    backgroundColor: '#1f1f1f',
                    border: '1px solid #333',
                    borderRadius: '12px',
                    color: '#fff'
                  }} />
                      <Area type="monotone" dataKey="amount" stroke="#ec4899" strokeWidth={2} fillOpacity={1} fill="url(#colorAmount)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>

                {/* Category Breakdown */}
                <div className="bg-[#1f1f1f] p-6 rounded-3xl border border-gray-800">
                  <h3 className="text-xl font-bold mb-6">Spending by Category</h3>
                  <div className="space-y-4">
                    {CATEGORY_SPENDING.map((cat, index) => <div key={index}>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium text-white">{cat.category}</span>
                          <span className="text-sm font-bold text-pink-400">${cat.amount.toFixed(2)}</span>
                        </div>
                        <div className="w-full bg-[#2a2a2a] rounded-full h-2 overflow-hidden">
                          <motion.div initial={{
                      width: 0
                    }} animate={{
                      width: `${cat.percentage}%`
                    }} transition={{
                      duration: 1,
                      delay: index * 0.1
                    }} className="h-full bg-gradient-to-r from-pink-600 to-pink-500" />
                        </div>
                      </div>)}
                  </div>
                </div>
              </div>

              {/* Spending Insights */}
              <div className="bg-[#1f1f1f] p-6 rounded-3xl border border-gray-800">
                <h3 className="text-xl font-bold mb-6">Insights</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 bg-[#2a2a2a] rounded-2xl border border-gray-700">
                    <p className="text-xs text-gray-400 uppercase font-bold mb-2">Most Active Day</p>
                    <p className="text-2xl font-bold text-white">Monday</p>
                  </div>
                  <div className="p-4 bg-[#2a2a2a] rounded-2xl border border-gray-700">
                    <p className="text-xs text-gray-400 uppercase font-bold mb-2">Favorite Category</p>
                    <p className="text-2xl font-bold text-white">Food</p>
                  </div>
                  <div className="p-4 bg-[#2a2a2a] rounded-2xl border border-gray-700">
                    <p className="text-xs text-gray-400 uppercase font-bold mb-2">Total Orders</p>
                    <p className="text-2xl font-bold text-green-400">{user.totalOrders}</p>
                  </div>
                </div>
              </div>

              {/* Recent Transactions */}
              <div className="bg-[#1f1f1f] p-6 rounded-3xl border border-gray-800">
                <h3 className="text-xl font-bold mb-6">Recent Transactions</h3>
                <div className="space-y-3">
                  {RECENT_TRANSACTIONS.map((transaction, index) => <motion.div key={transaction.id} initial={{
                opacity: 0,
                y: 10
              }} animate={{
                opacity: 1,
                y: 0
              }} transition={{
                delay: index * 0.05
              }} className="p-4 bg-[#2a2a2a] rounded-2xl border border-gray-700 hover:border-gray-600 transition-all">
                      <div className="flex items-center gap-4">
                        <div className="p-3 rounded-xl bg-red-500/20 text-red-400">
                          <ArrowUpRight className="w-5 h-5" />
                        </div>
                        <div className="flex-1">
                          <p className="font-bold text-white text-sm mb-1">{transaction.description}</p>
                          <div className="flex items-center gap-2 text-xs text-gray-400">
                            <span>{transaction.date}</span>
                            <span>•</span>
                            <span>{transaction.time}</span>
                          </div>
                        </div>
                        <p className="text-lg font-bold text-red-400">-${transaction.amount.toFixed(2)}</p>
                      </div>
                    </motion.div>)}
                </div>
              </div>
            </motion.div>}

          {/* Payments Tab */}
          {activeTab === 'payments' && <motion.div key="payments" initial={{
          opacity: 0,
          y: 20
        }} animate={{
          opacity: 1,
          y: 0
        }} exit={{
          opacity: 0,
          y: -20
        }} className="space-y-6">
              <div className="bg-[#1f1f1f] p-6 rounded-3xl border border-gray-800">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold">Payment Methods</h3>
                  <button onClick={() => setShowAddPayment(!showAddPayment)} className="flex items-center gap-2 px-4 py-2 bg-pink-600 hover:bg-pink-700 text-white font-bold rounded-xl transition-colors">
                    <Plus className="w-4 h-4" />
                    Add Payment
                  </button>
                </div>

                {/* Add Payment Form */}
                <AnimatePresence>
                  {showAddPayment && <motion.div initial={{
                height: 0,
                opacity: 0
              }} animate={{
                height: 'auto',
                opacity: 1
              }} exit={{
                height: 0,
                opacity: 0
              }} className="mb-6 overflow-hidden">
                      <div className="p-4 bg-[#2a2a2a] rounded-2xl border border-gray-700">
                        <h4 className="font-bold mb-4">Add New Payment Method</h4>
                        
                        {/* Payment Type Selection */}
                        <div className="flex gap-2 mb-4">
                          <button onClick={() => setNewPaymentType('card')} className={`flex-1 py-2 px-4 rounded-lg font-medium transition-all ${newPaymentType === 'card' ? 'bg-pink-600 text-white' : 'bg-[#1f1f1f] text-gray-400 border border-gray-700'}`}>
                            Credit/Debit Card
                          </button>
                          <button onClick={() => setNewPaymentType('mobile_money')} className={`flex-1 py-2 px-4 rounded-lg font-medium transition-all ${newPaymentType === 'mobile_money' ? 'bg-pink-600 text-white' : 'bg-[#1f1f1f] text-gray-400 border border-gray-700'}`}>
                            Mobile Money
                          </button>
                        </div>

                        {newPaymentType === 'card' ? <div className="space-y-3">
                            <input type="text" placeholder="Card Number" className="w-full px-4 py-2 bg-[#1f1f1f] border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:ring-2 focus:ring-pink-500 focus:outline-none" />
                            <div className="grid grid-cols-2 gap-3">
                              <input type="text" placeholder="MM/YY" className="px-4 py-2 bg-[#1f1f1f] border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:ring-2 focus:ring-pink-500 focus:outline-none" />
                              <input type="text" placeholder="CVV" className="px-4 py-2 bg-[#1f1f1f] border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:ring-2 focus:ring-pink-500 focus:outline-none" />
                            </div>
                          </div> : <div className="space-y-3">
                            <select className="w-full px-4 py-2 bg-[#1f1f1f] border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-pink-500 focus:outline-none">
                              <option>Select Provider</option>
                              <option>M-Pesa (Kenya)</option>
                              <option>MTN MoMo (Uganda/Ghana)</option>
                              <option>Airtel Money</option>
                              <option>Orange Money</option>
                            </select>
                            <input type="tel" placeholder="Phone Number (e.g., +254 712 345 678)" className="w-full px-4 py-2 bg-[#1f1f1f] border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:ring-2 focus:ring-pink-500 focus:outline-none" />
                          </div>}

                        <div className="flex gap-3 mt-4">
                          <button className="flex-1 py-2 bg-pink-600 hover:bg-pink-700 text-white font-bold rounded-lg transition-colors">
                            Add Method
                          </button>
                          <button onClick={() => setShowAddPayment(false)} className="px-4 py-2 bg-[#1f1f1f] hover:bg-[#333] text-gray-400 font-bold rounded-lg transition-colors">
                            Cancel
                          </button>
                        </div>
                      </div>
                    </motion.div>}
                </AnimatePresence>

                {/* Payment Methods List */}
                <div className="space-y-3">
                  {paymentMethods.map((method, index) => <motion.div key={method.id} initial={{
                opacity: 0,
                y: 10
              }} animate={{
                opacity: 1,
                y: 0
              }} transition={{
                delay: index * 0.05
              }} className={`p-4 rounded-2xl border transition-all ${method.isDefault ? 'bg-[#2a2a2a] border-green-500' : 'bg-[#2a2a2a] border-gray-700 hover:border-gray-600'}`}>
                      <div className="flex items-center gap-4">
                        <div className="p-3 bg-[#1f1f1f] rounded-xl border border-gray-700">
                          {method.type === 'card' ? <CreditCard className="w-6 h-6 text-pink-400" /> : <PhoneIcon className="w-6 h-6 text-green-400" />}
                        </div>
                        <div className="flex-1">
                          <p className="font-bold text-white mb-1">{method.maskedIdentifier}</p>
                          <div className="flex items-center gap-2 text-xs text-gray-400">
                            <span>{method.provider}</span>
                            {method.isDefault && <>
                                <span>•</span>
                                <span className="flex items-center gap-1 text-green-400 font-bold">
                                  <CheckCircle2 className="w-3 h-3" />
                                  Default
                                </span>
                              </>}
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {!method.isDefault && <button onClick={() => handleSetDefault(method.id)} className="px-3 py-1.5 text-xs font-bold bg-[#1f1f1f] hover:bg-green-500/20 text-gray-400 hover:text-green-400 rounded-lg transition-all border border-gray-700 hover:border-green-500/30">
                              Set Default
                            </button>}
                          <button onClick={() => handleDeletePaymentMethod(method.id)} className="p-2 hover:bg-[#1f1f1f] rounded-lg transition-colors text-red-400 hover:text-red-300">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </motion.div>)}
                </div>
              </div>

              {/* Payment Info */}
              <div className="bg-[#1f1f1f] p-6 rounded-3xl border border-gray-800">
                <h3 className="text-lg font-bold mb-4">Payment Information</h3>
                <div className="space-y-3 text-sm text-gray-400">
                  <p>• All payments are processed securely through our payment partners</p>
                  <p>• We support major credit cards and African Mobile Money providers</p>
                  <p>• Your payment information is encrypted and never stored on our servers</p>
                  <p>• You will be charged only after successful delivery completion</p>
                </div>
              </div>
            </motion.div>}

          {/* Support Tab */}
          {activeTab === 'support' && <motion.div key="support" initial={{
          opacity: 0,
          y: 20
        }} animate={{
          opacity: 1,
          y: 0
        }} exit={{
          opacity: 0,
          y: -20
        }} className="space-y-6">
              {/* Contact Support */}
              <div className="bg-gradient-to-br from-pink-600 to-pink-500 p-6 rounded-3xl relative overflow-hidden">
                <div className="absolute inset-0 opacity-10">
                  <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
                    <defs>
                      <pattern id="support-pattern" width="40" height="40" patternUnits="userSpaceOnUse">
                        <circle cx="20" cy="20" r="1" fill="white" />
                      </pattern>
                    </defs>
                    <rect width="100%" height="100%" fill="url(#support-pattern)" />
                  </svg>
                </div>

                <div className="relative z-10">
                  <h3 className="text-2xl font-bold text-white mb-2">Need Help?</h3>
                  <p className="text-pink-100 mb-6">Our support team is here 24/7 to assist you</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <button className="flex items-center gap-3 px-4 py-3 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-xl transition-all border border-white/30">
                      <MessageSquare className="w-5 h-5" />
                      <div className="text-left">
                        <p className="font-bold text-sm">Live Chat</p>
                        <p className="text-xs text-pink-100">Start conversation</p>
                      </div>
                    </button>
                    <button className="flex items-center gap-3 px-4 py-3 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-xl transition-all border border-white/30">
                      <Mail className="w-5 h-5" />
                      <div className="text-left">
                        <p className="font-bold text-sm">Email Us</p>
                        <p className="text-xs text-pink-100">support@jamjam.delivery</p>
                      </div>
                    </button>
                  </div>
                </div>
              </div>

              {/* FAQ Section */}
              <div className="bg-[#1f1f1f] p-6 rounded-3xl border border-gray-800">
                <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                  <HelpCircle className="w-5 h-5 text-pink-400" />
                  Frequently Asked Questions
                </h3>

                <div className="space-y-3">
                  {FAQ_ITEMS.map((faq, index) => <motion.div key={index} initial={{
                opacity: 0,
                y: 10
              }} animate={{
                opacity: 1,
                y: 0
              }} transition={{
                delay: index * 0.03
              }} className="bg-[#2a2a2a] border border-gray-700 rounded-2xl overflow-hidden">
                      <button onClick={() => setExpandedFAQ(expandedFAQ === index ? null : index)} className="w-full p-4 flex items-center justify-between hover:bg-[#333] transition-colors">
                        <div className="flex items-center gap-3 flex-1 text-left">
                          <div className="p-2 bg-[#1f1f1f] rounded-lg border border-gray-700">
                            <HelpCircle className="w-4 h-4 text-pink-400" />
                          </div>
                          <div>
                            <p className="font-bold text-white">{faq.question}</p>
                            <p className="text-xs text-gray-500 mt-1">{faq.category}</p>
                          </div>
                        </div>
                        <motion.div animate={{
                    rotate: expandedFAQ === index ? 90 : 0
                  }} transition={{
                    duration: 0.2
                  }}>
                          <ChevronRight className="w-5 h-5 text-gray-400" />
                        </motion.div>
                      </button>
                      <motion.div initial={false} animate={{
                  height: expandedFAQ === index ? 'auto' : 0,
                  opacity: expandedFAQ === index ? 1 : 0
                }} transition={{
                  duration: 0.2
                }} className="overflow-hidden">
                        <div className="px-4 pb-4 pt-2 text-gray-300 text-sm leading-relaxed border-t border-gray-700">
                          {faq.answer}
                        </div>
                      </motion.div>
                    </motion.div>)}
                </div>
              </div>

              {/* Contact Form */}
              <div className="bg-[#1f1f1f] p-6 rounded-3xl border border-gray-800">
                <h3 className="text-xl font-bold mb-4">Send us a message</h3>
                <p className="text-gray-400 text-sm mb-6">We'll get back to you within 24 hours</p>
                <form className="space-y-4">
                  <div>
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-2">
                      Subject
                    </label>
                    <input type="text" placeholder="What do you need help with?" className="w-full px-4 py-3 bg-[#2a2a2a] border border-gray-700 rounded-xl focus:ring-2 focus:ring-pink-500 focus:outline-none transition-all text-white placeholder-gray-500" />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-2">
                      Message
                    </label>
                    <textarea rows={5} placeholder="Describe your issue in detail..." className="w-full px-4 py-3 bg-[#2a2a2a] border border-gray-700 rounded-xl focus:ring-2 focus:ring-pink-500 focus:outline-none transition-all text-white placeholder-gray-500 resize-none" />
                  </div>
                  <button type="submit" className="w-full py-4 bg-gradient-to-r from-pink-600 to-pink-500 hover:from-pink-700 hover:to-pink-600 text-white font-bold rounded-2xl shadow-lg shadow-pink-900/50 transition-all flex items-center justify-center gap-2">
                    <Send className="w-5 h-5" />
                    Send Message
                  </button>
                </form>
              </div>
            </motion.div>}
        </AnimatePresence>

        {/* Logout Button */}
        <div className="mt-6 flex justify-center">
          <button className="flex items-center gap-2 px-6 py-3 bg-[#1f1f1f] border border-gray-800 rounded-xl hover:border-red-500 hover:text-red-400 transition-all text-gray-400">
            <LogOut className="w-5 h-5" />
            <span className="font-medium">Logout</span>
          </button>
        </div>
      </div>
    </div>;
};