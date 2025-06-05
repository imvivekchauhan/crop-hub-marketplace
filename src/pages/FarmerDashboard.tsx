
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Crop } from '@/types';
import { Plus, Eye, Edit, Trash2, TrendingUp, ShoppingBag, Settings, Bell } from 'lucide-react';
import { AddCropForm } from '@/components/AddCropForm';
import { MarketPrices } from '@/components/MarketPrices';
import { OrderManagement } from '@/components/OrderManagement';
import { toast } from '@/hooks/use-toast';

export default function FarmerDashboard() {
  const { user } = useAuth();
  const [crops, setCrops] = useState<Crop[]>([]);
  const [stats, setStats] = useState({
    totalCrops: 0,
    approvedCrops: 0,
    pendingCrops: 0,
    totalRevenue: 0,
    pendingOrders: 0
  });
  const [showAddForm, setShowAddForm] = useState(false);
  const [showMarketPrices, setShowMarketPrices] = useState(false);
  const [showOrders, setShowOrders] = useState(false);
  const [editingCrop, setEditingCrop] = useState<Crop | undefined>();

  const loadData = () => {
    // Load farmer's crops from localStorage
    const allCrops = JSON.parse(localStorage.getItem('crops') || '[]');
    const farmerCrops = allCrops.filter((crop: Crop) => crop.farmerId === user?.id);
    setCrops(farmerCrops);
    
    // Load orders
    const allOrders = JSON.parse(localStorage.getItem('orders') || '[]');
    const farmerOrders = allOrders.filter((order: any) => order.farmerId === user?.id);
    const pendingOrders = farmerOrders.filter((order: any) => order.status === 'pending').length;
    
    // Calculate stats
    const approved = farmerCrops.filter((crop: Crop) => crop.isApproved).length;
    const pending = farmerCrops.filter((crop: Crop) => !crop.isApproved).length;
    
    setStats({
      totalCrops: farmerCrops.length,
      approvedCrops: approved,
      pendingCrops: pending,
      totalRevenue: farmerCrops.reduce((sum: number, crop: Crop) => sum + (crop.price * crop.quantity), 0),
      pendingOrders
    });
  };

  useEffect(() => {
    loadData();
  }, [user?.id]);

  const handleDeleteCrop = (cropId: string) => {
    const allCrops = JSON.parse(localStorage.getItem('crops') || '[]');
    const updatedCrops = allCrops.filter((crop: Crop) => crop.id !== cropId);
    localStorage.setItem('crops', JSON.stringify(updatedCrops));
    
    toast({
      title: "Success",
      description: "Crop deleted successfully"
    });
    
    loadData();
  };

  const handleEditCrop = (crop: Crop) => {
    setEditingCrop(crop);
    setShowAddForm(true);
  };

  const handleCloseForm = () => {
    setShowAddForm(false);
    setEditingCrop(undefined);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Farmer Dashboard</h1>
          <p className="text-gray-600 mt-2">Welcome back, {user?.name}! Manage your farm business.</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Total Crops</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">{stats.totalCrops}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Approved</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{stats.approvedCrops}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Pending</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">{stats.pendingCrops}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Est. Revenue</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">₹{stats.totalRevenue.toLocaleString()}</div>
            </CardContent>
          </Card>

          <Card className="relative">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">New Orders</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-600">{stats.pendingOrders}</div>
              {stats.pendingOrders > 0 && (
                <div className="absolute -top-1 -right-1">
                  <span className="flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                  </span>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Button 
            className="bg-green-600 hover:bg-green-700 h-auto py-4"
            onClick={() => setShowAddForm(true)}
          >
            <div className="flex flex-col items-center">
              <Plus className="h-6 w-6 mb-2" />
              <span>Add New Crop</span>
            </div>
          </Button>
          
          <Button 
            variant="outline" 
            className="h-auto py-4"
            onClick={() => setShowMarketPrices(true)}
          >
            <div className="flex flex-col items-center">
              <TrendingUp className="h-6 w-6 mb-2" />
              <span>Market Prices</span>
            </div>
          </Button>

          <Button 
            variant="outline" 
            className="h-auto py-4 relative"
            onClick={() => setShowOrders(true)}
          >
            <div className="flex flex-col items-center">
              <ShoppingBag className="h-6 w-6 mb-2" />
              <span>Orders</span>
              {stats.pendingOrders > 0 && (
                <Badge className="absolute -top-1 -right-1 px-1 min-w-5 h-5 text-xs">
                  {stats.pendingOrders}
                </Badge>
              )}
            </div>
          </Button>

          <Button variant="outline" className="h-auto py-4">
            <div className="flex flex-col items-center">
              <Settings className="h-6 w-6 mb-2" />
              <span>Settings</span>
            </div>
          </Button>
        </div>

        {/* Crops List */}
        <Card>
          <CardHeader>
            <CardTitle>My Crop Listings</CardTitle>
            <CardDescription>Manage your crop listings and track their status</CardDescription>
          </CardHeader>
          <CardContent>
            {crops.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">🌾</div>
                <p className="text-gray-500 mb-4 text-lg">You haven't listed any crops yet.</p>
                <p className="text-gray-400 mb-6">Start by adding your first crop to reach potential buyers.</p>
                <Button 
                  className="bg-green-600 hover:bg-green-700"
                  onClick={() => setShowAddForm(true)}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Your First Crop
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {crops.map((crop) => (
                  <Card key={crop.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex items-center gap-3">
                          <h3 className="text-lg font-semibold text-gray-900">{crop.name}</h3>
                          <Badge variant={crop.isApproved ? "default" : "secondary"}>
                            {crop.isApproved ? "Live" : "Under Review"}
                          </Badge>
                        </div>
                        <div className="text-right">
                          <p className="text-lg font-bold text-green-600">₹{crop.price}/{crop.unit}</p>
                        </div>
                      </div>
                      
                      <p className="text-gray-600 mb-3 text-sm line-clamp-2">{crop.description}</p>
                      
                      <div className="grid grid-cols-2 gap-4 mb-4 text-sm text-gray-600">
                        <div>
                          <p><span className="font-medium">Category:</span> {crop.category}</p>
                          <p><span className="font-medium">Quantity:</span> {crop.quantity} {crop.unit}</p>
                        </div>
                        <div>
                          <p><span className="font-medium">Location:</span> {crop.location}</p>
                          <p><span className="font-medium">Available:</span> {crop.availableTo ? new Date(crop.availableTo).toLocaleDateString() : 'Ongoing'}</p>
                        </div>
                      </div>

                      {crop.deliveryOptions.length > 0 && (
                        <div className="mb-4">
                          <p className="text-xs font-medium text-gray-600 mb-1">Delivery Options:</p>
                          <div className="flex flex-wrap gap-1">
                            {crop.deliveryOptions.map((option, index) => (
                              <Badge key={index} variant="outline" className="text-xs">
                                {option}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}
                      
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" className="flex-1">
                          <Eye className="h-4 w-4 mr-1" />
                          View
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="flex-1"
                          onClick={() => handleEditCrop(crop)}
                        >
                          <Edit className="h-4 w-4 mr-1" />
                          Edit
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleDeleteCrop(crop.id)}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Modals */}
      {showAddForm && (
        <AddCropForm 
          onClose={handleCloseForm} 
          onCropAdded={loadData}
          editCrop={editingCrop}
        />
      )}
      
      {showMarketPrices && (
        <MarketPrices onClose={() => setShowMarketPrices(false)} />
      )}

      {showOrders && (
        <OrderManagement onClose={() => setShowOrders(false)} />
      )}
    </div>
  );
}
