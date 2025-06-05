
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Order, Crop } from '@/types';

interface RecentOrdersProps {
  orders: Order[];
  crops: Crop[];
}

export function RecentOrders({ orders, crops }: RecentOrdersProps) {
  if (orders.length === 0) {
    return null;
  }

  return (
    <Card className="mt-8">
      <CardHeader>
        <CardTitle>My Recent Orders</CardTitle>
        <CardDescription>Track your recent crop orders</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {orders.slice(0, 3).map((order) => {
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
  );
}
