
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Crop } from '@/types';
import { Plus, Eye, Edit, Trash2, TrendingUp } from 'lucide-react';

export default function FarmerDashboard() {
  const { user } = useAuth();
  const [crops, setCrops] = useState<Crop[]>([]);
  const [stats, setStats] = useState({
    totalCrops: 0,
    approvedCrops: 0,
    pendingCrops: 0,
    totalRevenue: 0
  });

  useEffect(() => {
    // Load farmer's crops from localStorage
    const allCrops = JSON.parse(localStorage.getItem('crops') || '[]');
    const farmerCrops = allCrops.filter((crop: Crop) => crop.farmerId === user?.id);
    setCrops(farmerCrops);
    
    // Calculate stats
    const approved = farmerCrops.filter((crop: Crop) => crop.isApproved).length;
    const pending = farmerCrops.filter((crop: Crop) => !crop.isApproved).length;
    
    setStats({
      totalCrops: farmerCrops.length,
      approvedCrops: approved,
      pendingCrops: pending,
      totalRevenue: farmerCrops.reduce((sum: number, crop: Crop) => sum + (crop.price * crop.quantity), 0)
    });
  }, [user?.id]);

  const handleDeleteCrop = (cropId: string) => {
    const allCrops = JSON.parse(localStorage.getItem('crops') || '[]');
    const updatedCrops = allCrops.filter((crop: Crop) => crop.id !== cropId);
    localStorage.setItem('crops', JSON.stringify(updatedCrops));
    
    // Update local state
    const farmerCrops = updatedCrops.filter((crop: Crop) => crop.farmerId === user?.id);
    setCrops(farmerCrops);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Farmer Dashboard</h1>
          <p className="text-gray-600 mt-2">Welcome back, {user?.name}!</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
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
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-4 mb-8">
          <Button className="bg-green-600 hover:bg-green-700">
            <Plus className="h-4 w-4 mr-2" />
            Add New Crop
          </Button>
          <Button variant="outline">
            <TrendingUp className="h-4 w-4 mr-2" />
            Market Prices
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
              <div className="text-center py-8">
                <p className="text-gray-500 mb-4">You haven't listed any crops yet.</p>
                <Button className="bg-green-600 hover:bg-green-700">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Your First Crop
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {crops.map((crop) => (
                  <div key={crop.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex flex-col md:flex-row md:items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-lg font-semibold text-gray-900">{crop.name}</h3>
                          <Badge variant={crop.isApproved ? "default" : "secondary"}>
                            {crop.isApproved ? "Approved" : "Pending"}
                          </Badge>
                        </div>
                        <p className="text-gray-600 mb-2">{crop.description}</p>
                        <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                          <span>Quantity: {crop.quantity} {crop.unit}</span>
                          <span>Price: ₹{crop.price}/{crop.unit}</span>
                          <span>Location: {crop.location}</span>
                        </div>
                      </div>
                      <div className="flex gap-2 mt-4 md:mt-0">
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleDeleteCrop(crop.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
