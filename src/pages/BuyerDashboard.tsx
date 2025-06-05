
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Crop, Order } from '@/types';
import { PlaceOrderForm } from '@/components/PlaceOrderForm';
import { ChatWindow } from '@/components/ChatWindow';
import { BuyerStats } from '@/components/buyer/BuyerStats';
import { SearchFilters } from '@/components/buyer/SearchFilters';
import { CropGrid } from '@/components/buyer/CropGrid';
import { RecentOrders } from '@/components/buyer/RecentOrders';

export default function BuyerDashboard() {
  const { user } = useAuth();
  const [crops, setCrops] = useState<Crop[]>([]);
  const [filteredCrops, setFilteredCrops] = useState<Crop[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [priceRange, setPriceRange] = useState('all');
  const [selectedCrop, setSelectedCrop] = useState<Crop | null>(null);
  const [chatWith, setChatWith] = useState<{farmerId: string, farmerName: string, cropName?: string} | null>(null);
  const [myOrders, setMyOrders] = useState<Order[]>([]);
  const [stats, setStats] = useState({
    totalOrders: 0,
    pendingOrders: 0,
    completedOrders: 0
  });

  const loadData = () => {
    // Load approved crops from localStorage
    const allCrops = JSON.parse(localStorage.getItem('crops') || '[]');
    const approvedCrops = allCrops.filter((crop: Crop) => crop.isApproved);
    setCrops(approvedCrops);
    setFilteredCrops(approvedCrops);

    // Load buyer's orders
    const allOrders = JSON.parse(localStorage.getItem('orders') || '[]');
    const buyerOrders = allOrders.filter((order: Order) => order.buyerId === user?.id);
    setMyOrders(buyerOrders);

    // Calculate stats
    const pending = buyerOrders.filter((order: Order) => order.status === 'pending').length;
    const completed = buyerOrders.filter((order: Order) => order.status === 'completed').length;
    
    setStats({
      totalOrders: buyerOrders.length,
      pendingOrders: pending,
      completedOrders: completed
    });
  };

  useEffect(() => {
    loadData();
  }, [user?.id]);

  useEffect(() => {
    // Filter crops based on search term, category, and price range
    let filtered = crops;
    
    if (searchTerm) {
      filtered = filtered.filter(crop => 
        crop.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        crop.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
        crop.farmerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        crop.category.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(crop => crop.category === selectedCategory);
    }

    if (priceRange !== 'all') {
      const [min, max] = priceRange.split('-').map(Number);
      filtered = filtered.filter(crop => {
        if (max) {
          return crop.price >= min && crop.price <= max;
        } else {
          return crop.price >= min;
        }
      });
    }
    
    setFilteredCrops(filtered);
  }, [searchTerm, selectedCategory, priceRange, crops]);

  const categories = ['all', ...Array.from(new Set(crops.map(crop => crop.category)))];

  const handleChatWithFarmer = (crop: Crop) => {
    setChatWith({
      farmerId: crop.farmerId,
      farmerName: crop.farmerName,
      cropName: crop.name
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Buyer Dashboard</h1>
          <p className="text-gray-600 mt-2">Welcome back, {user?.name}! Discover fresh crops from local farmers.</p>
        </div>

        {/* Stats Cards */}
        <BuyerStats stats={stats} />

        {/* Search and Filters */}
        <SearchFilters
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          priceRange={priceRange}
          setPriceRange={setPriceRange}
          categories={categories}
        />

        {/* Results Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">
            {filteredCrops.length} crop{filteredCrops.length !== 1 ? 's' : ''} available
          </h2>
          <div className="text-sm text-gray-500">
            Showing fresh crops from verified farmers
          </div>
        </div>

        {/* Crops Grid */}
        <CropGrid
          crops={filteredCrops}
          onOrderClick={setSelectedCrop}
          onChatClick={handleChatWithFarmer}
        />

        {/* My Recent Orders Section */}
        <RecentOrders orders={myOrders} crops={crops} />
      </div>

      {/* Order Form Modal */}
      {selectedCrop && (
        <PlaceOrderForm
          crop={selectedCrop}
          onClose={() => setSelectedCrop(null)}
          onOrderPlaced={loadData}
        />
      )}

      {/* Chat Modal */}
      {chatWith && (
        <ChatWindow
          farmerId={chatWith.farmerId}
          farmerName={chatWith.farmerName}
          cropName={chatWith.cropName}
          onClose={() => setChatWith(null)}
        />
      )}
    </div>
  );
}
