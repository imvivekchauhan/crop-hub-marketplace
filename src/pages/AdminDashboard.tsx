
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { User, Crop } from '@/types';
import { Users, Package, CheckCircle, XCircle, Eye } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function AdminDashboard() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [users, setUsers] = useState<User[]>([]);
  const [crops, setCrops] = useState<Crop[]>([]);
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalFarmers: 0,
    totalBuyers: 0,
    totalCrops: 0,
    approvedCrops: 0,
    pendingCrops: 0
  });

  useEffect(() => {
    // Load users and crops from localStorage
    const allUsers = JSON.parse(localStorage.getItem('users') || '[]');
    const allCrops = JSON.parse(localStorage.getItem('crops') || '[]');
    
    setUsers(allUsers);
    setCrops(allCrops);
    
    // Calculate stats
    const farmers = allUsers.filter((u: User) => u.role === 'farmer').length;
    const buyers = allUsers.filter((u: User) => u.role === 'buyer').length;
    const approved = allCrops.filter((c: Crop) => c.isApproved).length;
    const pending = allCrops.filter((c: Crop) => !c.isApproved).length;
    
    setStats({
      totalUsers: allUsers.length,
      totalFarmers: farmers,
      totalBuyers: buyers,
      totalCrops: allCrops.length,
      approvedCrops: approved,
      pendingCrops: pending
    });
  }, []);

  const handleApproveCrop = (cropId: string) => {
    const updatedCrops = crops.map(crop => 
      crop.id === cropId ? { ...crop, isApproved: true } : crop
    );
    setCrops(updatedCrops);
    localStorage.setItem('crops', JSON.stringify(updatedCrops));
    
    toast({
      title: "Crop approved",
      description: "The crop listing has been approved successfully.",
    });
  };

  const handleRejectCrop = (cropId: string) => {
    const updatedCrops = crops.filter(crop => crop.id !== cropId);
    setCrops(updatedCrops);
    localStorage.setItem('crops', JSON.stringify(updatedCrops));
    
    toast({
      title: "Crop rejected",
      description: "The crop listing has been rejected and removed.",
      variant: "destructive",
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-600 mt-2">Manage users, crops, and platform operations</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Total Users</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">{stats.totalUsers}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Farmers</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{stats.totalFarmers}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Buyers</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">{stats.totalBuyers}</div>
            </CardContent>
          </Card>
          
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
        </div>

        {/* Main Content */}
        <Tabs defaultValue="crops" className="space-y-6">
          <TabsList>
            <TabsTrigger value="crops">Crop Management</TabsTrigger>
            <TabsTrigger value="users">User Management</TabsTrigger>
          </TabsList>
          
          <TabsContent value="crops">
            <Card>
              <CardHeader>
                <CardTitle>Crop Listings</CardTitle>
                <CardDescription>Review and manage crop listings</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {crops.map((crop) => (
                    <div key={crop.id} className="border rounded-lg p-4">
                      <div className="flex flex-col md:flex-row md:items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-lg font-semibold">{crop.name}</h3>
                            <Badge variant={crop.isApproved ? "default" : "secondary"}>
                              {crop.isApproved ? "Approved" : "Pending"}
                            </Badge>
                          </div>
                          <p className="text-gray-600 mb-2">{crop.description}</p>
                          <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                            <span>Farmer: {crop.farmerName}</span>
                            <span>Quantity: {crop.quantity} {crop.unit}</span>
                            <span>Price: ₹{crop.price}/{crop.unit}</span>
                            <span>Location: {crop.location}</span>
                          </div>
                        </div>
                        {!crop.isApproved && (
                          <div className="flex gap-2 mt-4 md:mt-0">
                            <Button 
                              size="sm" 
                              onClick={() => handleApproveCrop(crop.id)}
                              className="bg-green-600 hover:bg-green-700"
                            >
                              <CheckCircle className="h-4 w-4 mr-1" />
                              Approve
                            </Button>
                            <Button 
                              variant="destructive" 
                              size="sm"
                              onClick={() => handleRejectCrop(crop.id)}
                            >
                              <XCircle className="h-4 w-4 mr-1" />
                              Reject
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="users">
            <Card>
              <CardHeader>
                <CardTitle>User Management</CardTitle>
                <CardDescription>View and manage registered users</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {users.map((userData) => (
                    <div key={userData.id} className="border rounded-lg p-4">
                      <div className="flex flex-col md:flex-row md:items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-lg font-semibold">{userData.name}</h3>
                            <Badge variant="outline" className="capitalize">
                              {userData.role}
                            </Badge>
                          </div>
                          <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                            <span>Email: {userData.email}</span>
                            <span>Phone: {userData.phone}</span>
                            <span>Location: {userData.location}</span>
                            <span>Joined: {new Date(userData.createdAt).toLocaleDateString()}</span>
                          </div>
                        </div>
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4 mr-1" />
                          View Details
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
