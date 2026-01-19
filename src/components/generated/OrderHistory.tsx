import React, { useState } from 'react';
import { Package, MapPin, Clock, ChevronRight, Calendar, Filter, CheckCircle2, XCircle, Search, ArrowLeft, Users } from 'lucide-react';
import { motion } from 'framer-motion';
interface Order {
  id: string;
  date: string;
  time: string;
  pickup: string;
  dropoff: string;
  status: 'completed' | 'cancelled' | 'in_progress';
  amount: number;
  itemType: string;
  riderName: string;
  riderAvatar: string;
  riders?: Array<{
    name: string;
    avatar: string;
    segment: number;
  }>;
  isMultiRider?: boolean;
}
const MOCK_ORDERS: Order[] = [{
  id: 'ORD-2024-001',
  date: 'Jan 15, 2024',
  time: '14:30',
  pickup: '123 Main St, Downtown',
  dropoff: '456 Oak Ave, Uptown',
  status: 'completed',
  amount: 12.50,
  itemType: 'Document',
  riderName: 'James Wilson',
  riderAvatar: 'https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=100&h=100&fit=crop'
}, {
  id: 'ORD-2024-002',
  date: 'Jan 14, 2024',
  time: '10:15',
  pickup: '789 Elm St, Midtown',
  dropoff: '321 Pine Rd, Far Suburb',
  status: 'completed',
  amount: 25.25,
  itemType: 'Electronics',
  riderName: '',
  riderAvatar: '',
  isMultiRider: true,
  riders: [{
    name: 'James Wilson',
    avatar: 'https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=100&h=100&fit=crop',
    segment: 1
  }, {
    name: 'Sarah Chen',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop',
    segment: 2
  }, {
    name: 'Marcus Rodriguez',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop',
    segment: 3
  }]
}, {
  id: 'ORD-2024-003',
  date: 'Jan 13, 2024',
  time: '16:45',
  pickup: '555 Broadway, Central',
  dropoff: '888 Market St, East',
  status: 'cancelled',
  amount: 0,
  itemType: 'Electronics',
  riderName: '',
  riderAvatar: ''
}, {
  id: 'ORD-2024-004',
  date: 'Jan 12, 2024',
  time: '09:20',
  pickup: '222 Lake View, North',
  dropoff: '999 River Rd, South District',
  status: 'completed',
  amount: 18.50,
  itemType: 'Fragile',
  riderName: '',
  riderAvatar: '',
  isMultiRider: true,
  riders: [{
    name: 'Sarah Chen',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop',
    segment: 1
  }, {
    name: 'Marcus Rodriguez',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop',
    segment: 2
  }]
}, {
  id: 'ORD-2024-005',
  date: 'Jan 11, 2024',
  time: '13:00',
  pickup: '111 West St, City Center',
  dropoff: '777 East Blvd, Harbor',
  status: 'completed',
  amount: 15.25,
  itemType: 'Clothing',
  riderName: 'James Wilson',
  riderAvatar: 'https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=100&h=100&fit=crop'
}];
export const OrderHistory = () => {
  const [filter, setFilter] = useState<'all' | 'completed' | 'cancelled'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const filteredOrders = MOCK_ORDERS.filter(order => {
    const matchesFilter = filter === 'all' || order.status === filter;
    const matchesSearch = order.pickup.toLowerCase().includes(searchQuery.toLowerCase()) || order.dropoff.toLowerCase().includes(searchQuery.toLowerCase()) || order.id.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });
  const getStatusConfig = (status: Order['status']) => {
    switch (status) {
      case 'completed':
        return {
          icon: <CheckCircle2 className="w-4 h-4" />,
          label: 'Completed',
          color: 'bg-green-500/20 text-green-400 border-green-500/30'
        };
      case 'cancelled':
        return {
          icon: <XCircle className="w-4 h-4" />,
          label: 'Cancelled',
          color: 'bg-red-500/20 text-red-400 border-red-500/30'
        };
      case 'in_progress':
        return {
          icon: <Clock className="w-4 h-4" />,
          label: 'In Progress',
          color: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'
        };
    }
  };
  return <div className="min-h-screen bg-black text-white p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Order History</h1>
          <p className="text-gray-400">Track all your past deliveries</p>
        </div>

        {/* Search & Filters */}
        <div className="mb-6 space-y-4">
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input type="text" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} placeholder="Search by order ID or location..." className="w-full pl-12 pr-4 py-3 bg-[#1f1f1f] border border-gray-800 rounded-2xl focus:ring-2 focus:ring-green-500 focus:outline-none transition-all text-white placeholder-gray-500" />
          </div>

          {/* Filter Buttons */}
          <div className="flex gap-3 overflow-x-auto pb-2">
            {[{
            value: 'all',
            label: 'All Orders',
            icon: <Package className="w-4 h-4" />
          }, {
            value: 'completed',
            label: 'Completed',
            icon: <CheckCircle2 className="w-4 h-4" />
          }, {
            value: 'cancelled',
            label: 'Cancelled',
            icon: <XCircle className="w-4 h-4" />
          }].map(filterOption => <button key={filterOption.value} onClick={() => setFilter(filterOption.value as any)} className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium text-sm transition-all whitespace-nowrap ${filter === filterOption.value ? 'bg-gradient-to-r from-pink-600 to-pink-500 text-white shadow-lg shadow-pink-900/50' : 'bg-[#1f1f1f] text-gray-400 border border-gray-800 hover:border-gray-700'}`}>
                {filterOption.icon}
                {filterOption.label}
              </button>)}
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <div className="bg-[#1f1f1f] p-4 rounded-2xl border border-gray-800">
            <p className="text-xs text-gray-400 uppercase font-bold mb-1">Total Orders</p>
            <p className="text-2xl font-bold text-white">{MOCK_ORDERS.length}</p>
          </div>
          <div className="bg-[#1f1f1f] p-4 rounded-2xl border border-gray-800">
            <p className="text-xs text-gray-400 uppercase font-bold mb-1">Completed</p>
            <p className="text-2xl font-bold text-green-400">
              {MOCK_ORDERS.filter(o => o.status === 'completed').length}
            </p>
          </div>
          <div className="bg-[#1f1f1f] p-4 rounded-2xl border border-gray-800">
            <p className="text-xs text-gray-400 uppercase font-bold mb-1">Total Spent</p>
            <p className="text-2xl font-bold text-white">
              ${MOCK_ORDERS.reduce((sum, o) => sum + o.amount, 0).toFixed(2)}
            </p>
          </div>
        </div>

        {/* Orders List */}
        <div className="space-y-4">
          {filteredOrders.length === 0 ? <div className="bg-[#1f1f1f] p-12 rounded-3xl border border-gray-800 text-center">
              <Package className="w-16 h-16 text-gray-600 mx-auto mb-4" />
              <p className="text-gray-400 text-lg font-medium">No orders found</p>
              <p className="text-gray-600 text-sm mt-2">Try adjusting your filters or search query</p>
            </div> : filteredOrders.map((order, index) => {
          const statusConfig = getStatusConfig(order.status);
          return <motion.div key={order.id} initial={{
            opacity: 0,
            y: 20
          }} animate={{
            opacity: 1,
            y: 0
          }} transition={{
            delay: index * 0.05
          }} className="bg-[#1f1f1f] p-5 rounded-3xl border border-gray-800 hover:border-gray-700 transition-all cursor-pointer group">
                  {/* Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <p className="font-bold text-white text-lg">{order.id}</p>
                        <span className={`flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-bold border ${statusConfig.color}`}>
                          {statusConfig.icon}
                          {statusConfig.label}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-400">
                        <Calendar className="w-4 h-4" />
                        <span>{order.date}</span>
                        <span>•</span>
                        <Clock className="w-4 h-4" />
                        <span>{order.time}</span>
                      </div>
                    </div>
                    {order.status === 'completed' && <div className="text-right">
                        <p className="text-2xl font-bold text-green-400">${order.amount.toFixed(2)}</p>
                        <p className="text-xs text-gray-500 uppercase font-bold">Paid</p>
                      </div>}
                  </div>

                  {/* Route Info */}
                  <div className="space-y-3 mb-4">
                    <div className="flex items-start gap-3">
                      <div className="mt-1 p-1.5 bg-green-500/20 rounded-lg">
                        <MapPin className="w-4 h-4 text-green-400" />
                      </div>
                      <div className="flex-1">
                        <p className="text-xs text-gray-500 font-bold uppercase mb-1">Pickup</p>
                        <p className="text-sm text-white font-medium">{order.pickup}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="mt-1 p-1.5 bg-pink-500/20 rounded-lg">
                        <MapPin className="w-4 h-4 text-pink-400" />
                      </div>
                      <div className="flex-1">
                        <p className="text-xs text-gray-500 font-bold uppercase mb-1">Drop-off</p>
                        <p className="text-sm text-white font-medium">{order.dropoff}</p>
                      </div>
                    </div>
                  </div>

                  {/* Footer */}
                  <div className="flex items-center justify-between pt-4 border-t border-gray-800">
                    {order.isMultiRider && order.riders ? <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <Users className="w-4 h-4 text-pink-400" />
                          <p className="text-xs text-pink-400 uppercase font-bold">Multi-Rider Delivery</p>
                        </div>
                        <div className="flex items-center gap-2">
                          {order.riders.map((rider, idx) => <div key={idx} className="relative group">
                              <img src={rider.avatar} className="w-8 h-8 rounded-full border-2 border-gray-700" alt={rider.name} style={{
                      marginLeft: idx > 0 ? '-8px' : '0'
                    }} />
                              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-[#1f1f1f] border border-gray-700 rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                                <p className="text-xs text-white font-bold">{rider.name}</p>
                                <p className="text-[10px] text-gray-400">Segment {rider.segment}</p>
                              </div>
                            </div>)}
                          <span className="text-xs text-gray-400 ml-2">
                            {order.riders.length} riders
                          </span>
                        </div>
                      </div> : <div className="flex items-center gap-3">
                        {order.riderAvatar && <>
                            <img src={order.riderAvatar} className="w-8 h-8 rounded-full border-2 border-gray-700" alt={order.riderName} />
                            <div>
                              <p className="text-xs text-gray-500 uppercase font-bold">Rider</p>
                              <p className="text-sm text-white font-medium">{order.riderName}</p>
                            </div>
                          </>}
                        <div className="ml-4 px-3 py-1 bg-[#2a2a2a] rounded-lg border border-gray-700">
                          <p className="text-xs text-gray-400 font-bold">{order.itemType}</p>
                        </div>
                      </div>}
                    <button className="p-2 hover:bg-[#2a2a2a] rounded-xl transition-colors text-gray-400 group-hover:text-pink-400">
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </div>
                </motion.div>;
        })}
        </div>
      </div>
    </div>;
};