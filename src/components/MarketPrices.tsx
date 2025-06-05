
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { MarketPrice } from '@/types';
import { Search, TrendingUp, TrendingDown } from 'lucide-react';

interface MarketPricesProps {
  onClose: () => void;
}

export function MarketPrices({ onClose }: MarketPricesProps) {
  const [prices, setPrices] = useState<MarketPrice[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredPrices, setFilteredPrices] = useState<MarketPrice[]>([]);

  useEffect(() => {
    // Mock market prices data
    const mockPrices: MarketPrice[] = [
      {
        crop: 'Tomato',
        state: 'Maharashtra',
        district: 'Pune',
        market: 'Pune Market',
        variety: 'Local',
        grade: 'FAQ',
        minPrice: 800,
        maxPrice: 1200,
        modalPrice: 1000,
        date: new Date().toISOString().split('T')[0]
      },
      {
        crop: 'Onion',
        state: 'Maharashtra',
        district: 'Nashik',
        market: 'Nashik Market',
        variety: 'Local',
        grade: 'FAQ',
        minPrice: 1500,
        maxPrice: 2000,
        modalPrice: 1750,
        date: new Date().toISOString().split('T')[0]
      },
      {
        crop: 'Rice',
        state: 'Punjab',
        district: 'Ludhiana',
        market: 'Ludhiana Mandi',
        variety: 'Basmati',
        grade: 'FAQ',
        minPrice: 2800,
        maxPrice: 3200,
        modalPrice: 3000,
        date: new Date().toISOString().split('T')[0]
      },
      {
        crop: 'Wheat',
        state: 'Rajasthan',
        district: 'Jaipur',
        market: 'Jaipur Mandi',
        variety: 'Dara',
        grade: 'FAQ',
        minPrice: 2100,
        maxPrice: 2300,
        modalPrice: 2200,
        date: new Date().toISOString().split('T')[0]
      },
      {
        crop: 'Potato',
        state: 'Uttar Pradesh',
        district: 'Agra',
        market: 'Agra Market',
        variety: 'Local',
        grade: 'FAQ',
        minPrice: 600,
        maxPrice: 900,
        modalPrice: 750,
        date: new Date().toISOString().split('T')[0]
      }
    ];
    
    setPrices(mockPrices);
    setFilteredPrices(mockPrices);
  }, []);

  useEffect(() => {
    const filtered = prices.filter(price =>
      price.crop.toLowerCase().includes(searchTerm.toLowerCase()) ||
      price.state.toLowerCase().includes(searchTerm.toLowerCase()) ||
      price.district.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredPrices(filtered);
  }, [searchTerm, prices]);

  const getPriceChange = (price: MarketPrice) => {
    // Mock price change calculation
    const change = Math.random() * 200 - 100; // Random change between -100 to +100
    return change;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-6xl max-h-[90vh] overflow-y-auto">
        <CardHeader>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <CardTitle>Market Prices</CardTitle>
              <CardDescription>Latest market rates from various mandis</CardDescription>
            </div>
            <Button variant="outline" onClick={onClose}>Close</Button>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search by crop, state, or district..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredPrices.map((price, index) => {
              const priceChange = getPriceChange(price);
              const isPositive = priceChange > 0;
              
              return (
                <Card key={index} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-semibold text-lg">{price.crop}</h3>
                      <div className={`flex items-center text-xs ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
                        {isPositive ? <TrendingUp className="h-3 w-3 mr-1" /> : <TrendingDown className="h-3 w-3 mr-1" />}
                        {isPositive ? '+' : ''}{priceChange.toFixed(0)}
                      </div>
                    </div>
                    
                    <div className="space-y-2 text-sm text-gray-600">
                      <p><span className="font-medium">Market:</span> {price.market}</p>
                      <p><span className="font-medium">Location:</span> {price.district}, {price.state}</p>
                      <p><span className="font-medium">Variety:</span> {price.variety}</p>
                    </div>
                    
                    <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                      <div className="text-center">
                        <p className="text-xs text-gray-500">Modal Price</p>
                        <p className="text-xl font-bold text-green-600">₹{price.modalPrice}/quintal</p>
                      </div>
                      <div className="flex justify-between mt-2 text-xs text-gray-500">
                        <span>Min: ₹{price.minPrice}</span>
                        <span>Max: ₹{price.maxPrice}</span>
                      </div>
                    </div>
                    
                    <p className="text-xs text-gray-400 mt-2">Updated: {new Date(price.date).toLocaleDateString()}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
          
          {filteredPrices.length === 0 && (
            <div className="text-center py-8">
              <p className="text-gray-500">No market prices found for your search.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
