
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Crop, User, Order } from '@/types';
import { Check, X, Search, Users, Package, ShoppingBag, TrendingUp, Eye, AlertTriangle } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

export default function AdminDashboard() {
  const { user } = useAuth();
  const [crops, setCrops] = useState<Crop[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('overview');
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalFarmers: 0,
    totalBuyers: 0,
    totalCrops: 0,
    pendingApprovals: 0,
    totalOrders: 0,
    pendingOrders: 0,
    totalRevenue: 0
  });

  const loadData = () => {
    // Load all data
    const allCrops = JSON.parse(localStorage.getItem('crops') || '[]');
    const allUsers = JSON.parse(localStorage.getItem('users') || '[]');
    const allOrders = JSON.parse(localStorage.getItem('orders') || '[]');

    setCrops(allCrops);
    setUsers(allUsers);
    setOrders(allOrders);

    // Calculate stats
    const farmers = allUsers.filter((u: User) => u.role === 'farmer');
    const buyers = allUsers.filter((u: User) => u.role === 'buyer');
    const pendingCrops = allCrops.filter((c: Crop) => !c.isApproved);
    const pendingOrders = allOrders.filter((o: Order) => o.status === 'pending');
    const totalRevenue = allOrders
      .filter((o: Order) => o.status === 'completed')
      .reduce((sum: number, o: Order) => sum + o.totalPrice, 0);

    setStats({
      totalUsers: allUsers.length,
      totalFarmers: farmers.length,
      totalBuyers: buyers.length,
      totalCrops: allCrops.length,
      pendingApprovals: pendingCrops.length,
      totalOrders: allOrders.length,
      pendingOrders: pendingOrders.length,
      totalRevenue
    });
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleApproveCrop = (cropId: string, approved: boolean) => {
    const allCrops = JSON.parse(localStorage.getItem('crops') || '[]');
    const updatedCrops = allCrops.map((crop: Crop) =>
      crop.id === cropId ? { ...crop, isApproved: approved } : crop
    );
    
    localStorage.setItem('crops', JSON.stringify(updatedCrops));
    loadData();
    
    toast({
      title: "Success",
      description: `Crop ${approved ? 'approved' : 'rejected'} successfully`
    });
  };

  const handleDeleteUser = (userId: string) => {
    const allUsers = JSON.parse(localStorage.getItem('users') || '[]');
    const updatedUsers = allUsers.filter((user: User) => user.id !== userId);
    localStorage.setItem('users', JSON.stringify(updatedUsers));
    loadData();
    
    toast({
      title: "Success",
      description: "User deleted successfully"
    });
  };

  const filteredCrops = crops.filter(crop =>
    crop.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    crop.farmerName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const tabs = [
    { id: 'overview', label: 'Overview', icon: TrendingUp },
    { id: 'crops', label: 'Crop Approvals', icon: Package },
    { id: 'users', label: 'User Management', icon: Users },
    { id: 'orders', label: 'Order Monitoring', icon: ShoppingBag }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-600 mt-2">Welcome back, {user?.name}! Manage the FarmConnect platform.</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Total Users</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">{stats.totalUsers}</div>
              <p className="text-xs text-gray-500">
                {stats.totalFarmers} farmers, {stats.totalBuyers} buyers
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Total Crops</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{stats.totalCrops}</div>
              <p className="text-xs text-gray-500">
                {stats.pendingApprovals} pending approval
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Total Orders</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">{stats.totalOrders}</div>
              <p className="text-xs text-gray-500">
                {stats.pendingOrders} pending
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Platform Revenue</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-600">₹{stats.totalRevenue.toLocaleString()}</div>
              <p className="text-xs text-gray-500">From completed orders</p>
            </CardContent>
          </Card>
        </div>

        {/* Tab Navigation */}
        <div className="bg-white rounded-lg shadow-sm mb-8">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6" aria-label="Tabs">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`${
                      activeTab === tab.id
                        ? 'border-green-500 text-green-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center`}
                  >
                    <Icon className="h-4 w-4 mr-2" />
                    {tab.label}
                    {(tab.id === 'crops' && stats.pendingApprovals > 0) && (
                      <Badge className="ml-2 bg-red-100 text-red-800">{stats.pendingApprovals}</Badge>
                    )}
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {activeTab === 'overview' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Recent Activity</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex items-center text-sm">
                          <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                          <span>New farmer registered: John Doe</span>
                        </div>
                        <div className="flex items-center text-sm">
                          <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                          <span>Crop approved: Organic Tomatoes</span>
                        </div>
                        <div className="flex items-center text-sm">
                          <div className="w-2 h-2 bg-yellow-500 rounded-full mr-3"></div>
                          <span>Order placed: 50kg Rice</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Platform Health</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex justify-between items-center">
                          <span className="text-sm">System Status</span>
                          <Badge className="bg-green-100 text-green-800">Healthy</Badge>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm">Active Users (24h)</span>
                          <span className="font-medium">{Math.floor(stats.totalUsers * 0.3)}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm">Orders Today</span>
                          <span className="font-medium">{Math.floor(stats.totalOrders * 0.1)}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            )}

            {activeTab === 'crops' && (
              <div>
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
                  <h3 className="text-lg font-medium">Crop Approvals</h3>
                  <div className="relative w-full sm:w-auto mt-4 sm:mt-0">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      placeholder="Search crops..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 w-full sm:w-64"
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  {filteredCrops.map((crop) => (
                    <Card key={crop.id} className={`${!crop.isApproved ? 'border-l-4 border-l-yellow-500' : ''}`}>
                      <CardContent className="p-4">
                        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <h4 className="font-semibold text-lg">{crop.name}</h4>
                              <Badge variant={crop.isApproved ? "default" : "secondary"}>
                                {crop.isApproved ? "Approved" : "Pending"}
                              </Badge>
                              {!crop.isApproved && (
                                <AlertTriangle className="h-4 w-4 text-yellow-600" />
                              )}
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm text-gray-600">
                              <div>
                                <span className="font-medium">Farmer:</span> {crop.farmerName}
                              </div>
                              <div>
                                <span className="font-medium">Category:</span> {crop.category}
                              </div>
                              <div>
                                <span className="font-medium">Quantity:</span> {crop.quantity} {crop.unit}
                              </div>
                              <div>
                                <span className="font-medium">Price:</span> ₹{crop.price}/{crop.unit}
                              </div>
                            </div>
                            <p className="text-gray-600 mt-2 text-sm">{crop.description}</p>
                          </div>
                          
                          <div className="flex gap-2 w-full lg:w-auto">
                            <Button variant="outline" size="sm" className="flex-1 lg:flex-none">
                              <Eye className="h-4 w-4 mr-1" />
                              View
                            </Button>
                            {!crop.isApproved && (
                              <>
                                <Button
                                  size="sm"
                                  onClick={() => handleApproveCrop(crop.id, true)}
                                  className="bg-green-600 hover:bg-green-700 flex-1 lg:flex-none"
                                >
                                  <Check className="h-4 w-4 mr-1" />
                                  Approve
                                </Button>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleApproveCrop(crop.id, false)}
                                  className="border-red-200 text-red-600 hover:bg-red-50 flex-1 lg:flex-none"
                                >
                                  <X className="h-4 w-4 mr-1" />
                                  Reject
                                </Button>
                              </>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'users' && (
              <div>
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
                  <h3 className="text-lg font-medium">User Management</h3>
                  <div className="relative w-full sm:w-auto mt-4 sm:mt-0">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      placeholder="Search users..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 w-full sm:w-64"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  {filteredUsers.map((user) => (
                    <Card key={user.id}>
                      <CardContent className="p-4">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <h4 className="font-semibold">{user.name}</h4>
                              <Badge variant="outline" className="capitalize">
                                {user.role}
                              </Badge>
                            </div>
                            <div className="space-y-1 text-sm text-gray-600">
                              <p><span className="font-medium">Email:</span> {user.email}</p>
                              {user.phone && <p><span className="font-medium">Phone:</span> {user.phone}</p>}
                              {user.location && <p><span className="font-medium">Location:</span> {user.location}</p>}
                              <p><span className="font-medium">Joined:</span> {new Date(user.createdAt).toLocaleDateString()}</p>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm">
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleDeleteUser(user.id)}
                              className="text-red-600 hover:text-red-700 hover:bg-red-50"
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'orders' && (
              <div>
                <h3 className="text-lg font-medium mb-6">Order Monitoring</h3>
                
                <div className="space-y-4">
                  {orders.map((order) => {
                    const crop = crops.find(c => c.id === order.cropId);
                    const farmer = users.find(u => u.id === order.farmerId);
                    const buyer = users.find(u => u.id === order.buyerId);
                    
                    return (
                      <Card key={order.id}>
                        <CardContent className="p-4">
                          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-2">
                                <h4 className="font-semibold">{crop?.name || 'Unknown Crop'}</h4>
                                <Badge className={
                                  order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                  order.status === 'accepted' ? 'bg-green-100 text-green-800' :
                                  order.status === 'rejected' ? 'bg-red-100 text-red-800' :
                                  'bg-blue-100 text-blue-800'
                                }>
                                  {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                                </Badge>
                              </div>
                              
                              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
                                <div>
                                  <p><span className="font-medium">Farmer:</span> {farmer?.name || 'Unknown'}</p>
                                  <p><span className="font-medium">Buyer:</span> {buyer?.name || 'Unknown'}</p>
                                </div>
                                <div>
                                  <p><span className="font-medium">Quantity:</span> {order.quantity} {crop?.unit}</p>
                                  <p><span className="font-medium">Amount:</span> ₹{order.totalPrice}</p>
                                </div>
                                <div>
                                  <p><span className="font-medium">Order Date:</span> {new Date(order.createdAt).toLocaleDateString()}</p>
                                  <p><span className="font-medium">Payment:</span> {order.paymentStatus}</p>
                                </div>
                              </div>
                            </div>
                            
                            <Button variant="outline" size="sm">
                              <Eye className="h-4 w-4 mr-1" />
                              View Details
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
