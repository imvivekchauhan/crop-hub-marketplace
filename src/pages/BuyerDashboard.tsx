
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Crop, Order } from '@/types';
import { Search, ShoppingCart, MapPin, Phone, Heart, Filter, Star } from 'lucide-react';
import { PlaceOrderForm } from '@/components/PlaceOrderForm';

export default function BuyerDashboard() {
  const { user } = useAuth();
  const [crops, setCrops] = useState<Crop[]>([]);
  const [filteredCrops, setFilteredCrops] = useState<Crop[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [priceRange, setPriceRange] = useState('all');
  const [selectedCrop, setSelectedCrop] = useState<Crop | null>(null);
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
  const priceRanges = [
    { value: 'all', label: 'All Prices' },
    { value: '0-500', label: '₹0 - ₹500' },
    { value: '500-1000', label: '₹500 - ₹1000' },
    { value: '1000-2000', label: '₹1000 - ₹2000' },
    { value: '2000', label: '₹2000+' }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Buyer Dashboard</h1>
          <p className="text-gray-600 mt-2">Welcome back, {user?.name}! Discover fresh crops from local farmers.</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Total Orders</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">{stats.totalOrders}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Pending Orders</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">{stats.pendingOrders}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Completed Orders</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{stats.completedOrders}</div>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filters */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="space-y-4">
              <div className="flex flex-col lg:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      placeholder="Search crops, locations, farmers, or categories..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <Button variant="outline" className="lg:w-auto">
                  <Filter className="h-4 w-4 mr-2" />
                  Advanced Filter
                </Button>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                  <label className="text-sm font-medium text-gray-700 mb-2 block">Category</label>
                  <div className="flex gap-2 flex-wrap">
                    {categories.map((category) => (
                      <Button
                        key={category}
                        variant={selectedCategory === category ? "default" : "outline"}
                        size="sm"
                        onClick={() => setSelectedCategory(category)}
                        className="capitalize"
                      >
                        {category}
                      </Button>
                    ))}
                  </div>
                </div>
                
                <div className="sm:w-48">
                  <label className="text-sm font-medium text-gray-700 mb-2 block">Price Range</label>
                  <select
                    value={priceRange}
                    onChange={(e) => setPriceRange(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                  >
                    {priceRanges.map(range => (
                      <option key={range.value} value={range.value}>{range.label}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredCrops.length === 0 ? (
            <div className="col-span-full text-center py-12">
              <div className="text-6xl mb-4">🔍</div>
              <p className="text-gray-500 text-lg mb-2">No crops found</p>
              <p className="text-gray-400">Try adjusting your search criteria or check back later.</p>
            </div>
          ) : (
            filteredCrops.map((crop) => (
              <Card key={crop.id} className="hover:shadow-lg transition-all duration-300 group">
                <CardContent className="p-0">
                  {/* Image placeholder */}
                  <div className="h-48 bg-gradient-to-br from-green-100 to-green-200 flex items-center justify-center rounded-t-lg">
                    <div className="text-4xl">🌾</div>
                  </div>
                  
                  <div className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg text-gray-900 group-hover:text-green-600 transition-colors">
                          {crop.name}
                        </h3>
                        <p className="text-sm text-gray-600 flex items-center">
                          <MapPin className="h-3 w-3 mr-1" />
                          {crop.location}
                        </p>
                      </div>
                      <Badge variant="secondary" className="capitalize text-xs">
                        {crop.category}
                      </Badge>
                    </div>
                    
                    <p className="text-gray-600 text-sm mb-3 line-clamp-2">{crop.description}</p>
                    
                    <div className="space-y-2 mb-4">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Farmer:</span>
                        <span className="font-medium">{crop.farmerName}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Available:</span>
                        <span className="font-medium">{crop.quantity} {crop.unit}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Price:</span>
                        <span className="text-lg font-bold text-green-600">₹{crop.price}/{crop.unit}</span>
                      </div>
                    </div>

                    {/* Delivery options */}
                    {crop.deliveryOptions.length > 0 && (
                      <div className="mb-4">
                        <div className="flex flex-wrap gap-1">
                          {crop.deliveryOptions.slice(0, 2).map((option, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {option}
                            </Badge>
                          ))}
                          {crop.deliveryOptions.length > 2 && (
                            <Badge variant="outline" className="text-xs">
                              +{crop.deliveryOptions.length - 2} more
                            </Badge>
                          )}
                        </div>
                      </div>
                    )}
                    
                    <div className="flex gap-2">
                      <Button 
                        className="flex-1 bg-green-600 hover:bg-green-700"
                        onClick={() => setSelectedCrop(crop)}
                      >
                        <ShoppingCart className="h-4 w-4 mr-2" />
                        Order Now
                      </Button>
                      <Button variant="outline" size="sm">
                        <Phone className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm">
                        <Heart className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>

        {/* My Recent Orders Section */}
        {myOrders.length > 0 && (
          <Card className="mt-8">
            <CardHeader>
              <CardTitle>My Recent Orders</CardTitle>
              <CardDescription>Track your recent crop orders</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {myOrders.slice(0, 3).map((order) => {
                  const crop = crops.find(c => c.id === order.cropId);
                  return (
                    <div key={order.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium">{crop?.name || 'Unknown Crop'}</p>
                        <p className="text-sm text-gray-600">
                          {order.quantity} {crop?.unit} • ₹{order.totalPrice}
                        </p>
                      </div>
                      <Badge className={
                        order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                        order.status === 'accepted' ? 'bg-green-100 text-green-800' :
                        order.status === 'rejected' ? 'bg-red-100 text-red-800' :
                        'bg-blue-100 text-blue-800'
                      }>
                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                      </Badge>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Order Form Modal */}
      {selectedCrop && (
        <PlaceOrderForm
          crop={selectedCrop}
          onClose={() => setSelectedCrop(null)}
          onOrderPlaced={loadData}
        />
      )}
    </div>
  );
}
