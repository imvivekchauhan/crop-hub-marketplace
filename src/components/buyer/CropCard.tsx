
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Crop } from '@/types';
import { ShoppingCart, MapPin, MessageCircle, Heart } from 'lucide-react';

interface CropCardProps {
  crop: Crop;
  onOrderClick: (crop: Crop) => void;
  onChatClick: (crop: Crop) => void;
}

export function CropCard({ crop, onOrderClick, onChatClick }: CropCardProps) {
  return (
    <Card className="hover:shadow-lg transition-all duration-300 group">
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
              onClick={() => onOrderClick(crop)}
            >
              <ShoppingCart className="h-4 w-4 mr-2" />
              Order Now
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => onChatClick(crop)}
            >
              <MessageCircle className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="sm">
              <Heart className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
