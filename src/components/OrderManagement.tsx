
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Order, Crop, User } from '@/types';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';
import { Check, X, Phone, MapPin } from 'lucide-react';

interface OrderManagementProps {
  onClose: () => void;
}

export function OrderManagement({ onClose }: OrderManagementProps) {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [crops, setCrops] = useState<Crop[]>([]);
  const [buyers, setBuyers] = useState<User[]>([]);

  useEffect(() => {
    const allOrders = JSON.parse(localStorage.getItem('orders') || '[]');
    const allCrops = JSON.parse(localStorage.getItem('crops') || '[]');
    const allUsers = JSON.parse(localStorage.getItem('users') || '[]');
    
    // Filter orders for current farmer
    const farmerOrders = allOrders.filter((order: Order) => order.farmerId === user?.id);
    
    setOrders(farmerOrders);
    setCrops(allCrops);
    setBuyers(allUsers.filter((u: User) => u.role === 'buyer'));
  }, [user?.id]);

  const handleOrderAction = (orderId: string, action: 'accept' | 'reject') => {
    const allOrders = JSON.parse(localStorage.getItem('orders') || '[]');
    const updatedOrders = allOrders.map((order: Order) =>
      order.id === orderId
        ? { ...order, status: action === 'accept' ? 'accepted' : 'rejected' }
        : order
    );
    
    localStorage.setItem('orders', JSON.stringify(updatedOrders));
    
    // Update local state
    const farmerOrders = updatedOrders.filter((order: Order) => order.farmerId === user?.id);
    setOrders(farmerOrders);
    
    toast({
      title: "Success",
      description: `Order ${action}ed successfully`
    });
  };

  const getOrderCrop = (cropId: string) => {
    return crops.find(crop => crop.id === cropId);
  };

  const getBuyer = (buyerId: string) => {
    return buyers.find(buyer => buyer.id === buyerId);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'accepted': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      case 'completed': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Order Management</CardTitle>
              <CardDescription>Manage incoming orders from buyers</CardDescription>
            </div>
            <Button variant="outline" onClick={onClose}>Close</Button>
          </div>
        </CardHeader>
        <CardContent>
          {orders.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500">No orders received yet.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {orders.map((order) => {
                const crop = getOrderCrop(order.cropId);
                const buyer = getBuyer(order.buyerId);
                
                return (
                  <Card key={order.id} className="border-l-4 border-l-green-500">
                    <CardContent className="p-4">
                      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
                        <div className="flex-1">
                          <div className="flex flex-wrap items-center gap-2 mb-2">
                            <h3 className="font-semibold text-lg">{crop?.name || 'Unknown Crop'}</h3>
                            <Badge className={getStatusColor(order.status)}>
                              {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                            </Badge>
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                            <div>
                              <p className="text-sm text-gray-600">
                                <span className="font-medium">Buyer:</span> {buyer?.name || 'Unknown'}
                              </p>
                              <p className="text-sm text-gray-600">
                                <span className="font-medium">Phone:</span> {buyer?.phone || 'N/A'}
                              </p>
                              <p className="text-sm text-gray-600 flex items-center">
                                <MapPin className="h-3 w-3 mr-1" />
                                {buyer?.location || 'Location not provided'}
                              </p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-600">
                                <span className="font-medium">Quantity:</span> {order.quantity} {crop?.unit}
                              </p>
                              <p className="text-sm text-gray-600">
                                <span className="font-medium">Total Amount:</span> ₹{order.totalPrice}
                              </p>
                              <p className="text-sm text-gray-600">
                                <span className="font-medium">Order Date:</span> {new Date(order.createdAt).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex flex-col sm:flex-row gap-2 w-full lg:w-auto">
                          {buyer?.phone && (
                            <Button variant="outline" size="sm" className="flex items-center">
                              <Phone className="h-4 w-4 mr-1" />
                              Call
                            </Button>
                          )}
                          
                          {order.status === 'pending' && (
                            <>
                              <Button
                                size="sm"
                                onClick={() => handleOrderAction(order.id, 'accept')}
                                className="bg-green-600 hover:bg-green-700 flex items-center"
                              >
                                <Check className="h-4 w-4 mr-1" />
                                Accept
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleOrderAction(order.id, 'reject')}
                                className="border-red-200 text-red-600 hover:bg-red-50 flex items-center"
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
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
