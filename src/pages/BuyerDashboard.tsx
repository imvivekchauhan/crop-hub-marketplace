
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Crop } from '@/types';
import { Search, ShoppingCart, MapPin, Phone } from 'lucide-react';

export default function BuyerDashboard() {
  const { user } = useAuth();
  const [crops, setCrops] = useState<Crop[]>([]);
  const [filteredCrops, setFilteredCrops] = useState<Crop[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  useEffect(() => {
    // Load approved crops from localStorage
    const allCrops = JSON.parse(localStorage.getItem('crops') || '[]');
    const approvedCrops = allCrops.filter((crop: Crop) => crop.isApproved);
    setCrops(approvedCrops);
    setFilteredCrops(approvedCrops);
  }, []);

  useEffect(() => {
    // Filter crops based on search term and category
    let filtered = crops;
    
    if (searchTerm) {
      filtered = filtered.filter(crop => 
        crop.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        crop.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
        crop.farmerName.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(crop => crop.category === selectedCategory);
    }
    
    setFilteredCrops(filtered);
  }, [searchTerm, selectedCategory, crops]);

  const categories = ['all', ...Array.from(new Set(crops.map(crop => crop.category)))];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Buyer Dashboard</h1>
          <p className="text-gray-600 mt-2">Welcome back, {user?.name}! Find fresh crops from local farmers.</p>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search crops, locations, or farmers..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
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
        </div>

        {/* Crops Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCrops.length === 0 ? (
            <div className="col-span-full text-center py-12">
              <p className="text-gray-500 text-lg">No crops found matching your criteria.</p>
            </div>
          ) : (
            filteredCrops.map((crop) => (
              <Card key={crop.id} className="hover:shadow-lg transition-shadow duration-300">
                <CardHeader className="pb-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg">{crop.name}</CardTitle>
                      <CardDescription className="flex items-center mt-1">
                        <MapPin className="h-4 w-4 mr-1" />
                        {crop.location}
                      </CardDescription>
                    </div>
                    <Badge variant="secondary" className="capitalize">
                      {crop.category}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <p className="text-gray-600 text-sm">{crop.description}</p>
                    
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-sm text-gray-500">Farmer</p>
                        <p className="font-medium">{crop.farmerName}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-500">Price</p>
                        <p className="text-lg font-bold text-green-600">₹{crop.price}/{crop.unit}</p>
                      </div>
                    </div>
                    
                    <div className="flex justify-between text-sm text-gray-500">
                      <span>Available: {crop.quantity} {crop.unit}</span>
                      <span>Until: {new Date(crop.availableTo).toLocaleDateString()}</span>
                    </div>
                    
                    <div className="flex gap-2 pt-2">
                      <Button className="flex-1 bg-green-600 hover:bg-green-700">
                        <ShoppingCart className="h-4 w-4 mr-2" />
                        Order Now
                      </Button>
                      <Button variant="outline" size="sm">
                        <Phone className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
