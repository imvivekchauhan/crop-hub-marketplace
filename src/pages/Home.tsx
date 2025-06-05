
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';
import { Sprout, ShoppingCart, Users, TrendingUp } from 'lucide-react';

export default function Home() {
  const { user } = useAuth();
  const navigate = useNavigate();

  if (user) {
    // Redirect to appropriate dashboard
    if (user.role === 'farmer') navigate('/farmer-dashboard');
    if (user.role === 'buyer') navigate('/buyer-dashboard');
    if (user.role === 'admin') navigate('/admin-dashboard');
  }

  const features = [
    {
      icon: <Sprout className="h-8 w-8 text-green-600" />,
      title: "For Farmers",
      description: "List your crops, manage inventory, and connect directly with buyers",
      action: "Join as Farmer",
      role: "farmer"
    },
    {
      icon: <ShoppingCart className="h-8 w-8 text-blue-600" />,
      title: "For Buyers",
      description: "Browse fresh crops, compare prices, and order directly from farmers",
      action: "Join as Buyer",
      role: "buyer"
    },
    {
      icon: <TrendingUp className="h-8 w-8 text-purple-600" />,
      title: "Market Insights",
      description: "Get real-time market prices and make informed decisions",
      action: "View Prices",
      role: "market"
    },
    {
      icon: <Users className="h-8 w-8 text-orange-600" />,
      title: "Community",
      description: "Connect with farmers and buyers in your area",
      action: "Join Community",
      role: "community"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              Connect <span className="text-green-600">Farmers</span> with{' '}
              <span className="text-blue-600">Buyers</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto">
              A digital marketplace bringing fresh farm produce directly from farmers to your table
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                onClick={() => navigate('/register')}
                className="bg-green-600 hover:bg-green-700 text-lg px-8 py-3"
              >
                Get Started Today
              </Button>
              <Button 
                variant="outline" 
                size="lg"
                onClick={() => navigate('/marketplace')}
                className="text-lg px-8 py-3"
              >
                Browse Marketplace
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Why Choose FarmConnect?</h2>
          <p className="text-lg text-gray-600">Empowering agriculture through technology</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow duration-300">
              <CardHeader className="text-center">
                <div className="flex justify-center mb-4">
                  {feature.icon}
                </div>
                <CardTitle className="text-xl">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <CardDescription className="mb-4">
                  {feature.description}
                </CardDescription>
                <Button 
                  variant="outline" 
                  onClick={() => feature.role === 'farmer' || feature.role === 'buyer' ? navigate('/register') : navigate('/marketplace')}
                  className="w-full"
                >
                  {feature.action}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Stats Section */}
      <div className="bg-green-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold mb-2">1000+</div>
              <div className="text-green-100">Active Farmers</div>
            </div>
            <div>
              <div className="text-3xl font-bold mb-2">500+</div>
              <div className="text-green-100">Verified Buyers</div>
            </div>
            <div>
              <div className="text-3xl font-bold mb-2">50+</div>
              <div className="text-green-100">Crop Varieties</div>
            </div>
            <div>
              <div className="text-3xl font-bold mb-2">₹10L+</div>
              <div className="text-green-100">Transactions</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
