
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { useAuth } from '@/contexts/AuthContext';
import { Crop, Order } from '@/types';
import { toast } from '@/hooks/use-toast';
import { X, ShoppingCart } from 'lucide-react';

interface PlaceOrderFormProps {
  crop: Crop;
  onClose: () => void;
  onOrderPlaced: () => void;
}

export function PlaceOrderForm({ crop, onClose, onOrderPlaced }: PlaceOrderFormProps) {
  const { user } = useAuth();
  const [quantity, setQuantity] = useState(1);
  const [notes, setNotes] = useState('');

  const totalPrice = quantity * crop.price;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (quantity <= 0 || quantity > crop.quantity) {
      toast({
        title: "Error",
        description: `Please enter a valid quantity (1-${crop.quantity})`,
        variant: "destructive"
      });
      return;
    }

    const newOrder: Order = {
      id: Date.now().toString(),
      farmerId: crop.farmerId,
      buyerId: user?.id || '',
      cropId: crop.id,
      quantity,
      totalPrice,
      status: 'pending',
      paymentStatus: 'pending',
      createdAt: new Date().toISOString()
    };

    // Save order
    const existingOrders = JSON.parse(localStorage.getItem('orders') || '[]');
    existingOrders.push(newOrder);
    localStorage.setItem('orders', JSON.stringify(existingOrders));

    toast({
      title: "Success",
      description: "Order placed successfully! The farmer will be notified."
    });

    onOrderPlaced();
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Place Order</CardTitle>
              <CardDescription>Order {crop.name} from {crop.farmerName}</CardDescription>
            </div>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="bg-gray-50 p-3 rounded-lg">
              <h4 className="font-medium">{crop.name}</h4>
              <p className="text-sm text-gray-600">{crop.description}</p>
              <p className="text-sm"><span className="font-medium">Price:</span> ₹{crop.price}/{crop.unit}</p>
              <p className="text-sm"><span className="font-medium">Available:</span> {crop.quantity} {crop.unit}</p>
              <p className="text-sm"><span className="font-medium">Location:</span> {crop.location}</p>
            </div>

            <div>
              <Label htmlFor="quantity">Quantity ({crop.unit}) *</Label>
              <Input
                id="quantity"
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(Number(e.target.value))}
                min="1"
                max={crop.quantity}
                required
              />
              <p className="text-xs text-gray-500 mt-1">Max available: {crop.quantity} {crop.unit}</p>
            </div>

            <div>
              <Label htmlFor="notes">Special Instructions (Optional)</Label>
              <Textarea
                id="notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Any special requirements or delivery instructions..."
                rows={3}
              />
            </div>

            <div className="bg-green-50 p-3 rounded-lg border border-green-200">
              <div className="flex justify-between items-center">
                <span className="font-medium">Total Amount:</span>
                <span className="text-xl font-bold text-green-600">₹{totalPrice.toLocaleString()}</span>
              </div>
              <p className="text-sm text-gray-600 mt-1">
                {quantity} {crop.unit} × ₹{crop.price} = ₹{totalPrice}
              </p>
            </div>

            <div className="flex gap-2">
              <Button type="submit" className="flex-1 bg-green-600 hover:bg-green-700">
                <ShoppingCart className="h-4 w-4 mr-2" />
                Place Order
              </Button>
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
