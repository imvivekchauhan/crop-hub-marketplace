
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuth } from '@/contexts/AuthContext';
import { Crop } from '@/types';
import { toast } from '@/hooks/use-toast';
import { X, Upload } from 'lucide-react';

interface AddCropFormProps {
  onClose: () => void;
  onCropAdded: () => void;
  editCrop?: Crop;
}

export function AddCropForm({ onClose, onCropAdded, editCrop }: AddCropFormProps) {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    name: editCrop?.name || '',
    category: editCrop?.category || '',
    quantity: editCrop?.quantity || 0,
    price: editCrop?.price || 0,
    unit: editCrop?.unit || '',
    description: editCrop?.description || '',
    location: editCrop?.location || user?.location || '',
    availableFrom: editCrop?.availableFrom || new Date().toISOString().split('T')[0],
    availableTo: editCrop?.availableTo || '',
    deliveryOptions: editCrop?.deliveryOptions || [],
    images: editCrop?.images || []
  });

  const categories = [
    'Vegetables', 'Fruits', 'Grains', 'Pulses', 'Spices', 'Herbs', 'Dairy', 'Other'
  ];

  const units = ['kg', 'quintal', 'tons', 'pieces', 'dozen', 'liters'];
  const deliveryOptionsAvailable = ['Farm Pickup', 'Local Delivery', 'Transport Available'];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.category || !formData.quantity || !formData.price) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    const allCrops = JSON.parse(localStorage.getItem('crops') || '[]');
    
    if (editCrop) {
      // Update existing crop
      const updatedCrops = allCrops.map((crop: Crop) =>
        crop.id === editCrop.id
          ? {
              ...crop,
              ...formData,
              isApproved: false // Reset approval when edited
            }
          : crop
      );
      localStorage.setItem('crops', JSON.stringify(updatedCrops));
      toast({
        title: "Success",
        description: "Crop updated successfully and sent for approval"
      });
    } else {
      // Add new crop
      const newCrop: Crop = {
        id: Date.now().toString(),
        farmerId: user?.id || '',
        farmerName: user?.name || '',
        ...formData,
        isApproved: false,
        createdAt: new Date().toISOString()
      };
      
      allCrops.push(newCrop);
      localStorage.setItem('crops', JSON.stringify(allCrops));
      toast({
        title: "Success",
        description: "Crop added successfully and sent for approval"
      });
    }
    
    onCropAdded();
    onClose();
  };

  const handleDeliveryOptionChange = (option: string, checked: boolean) => {
    if (checked) {
      setFormData(prev => ({
        ...prev,
        deliveryOptions: [...prev.deliveryOptions, option]
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        deliveryOptions: prev.deliveryOptions.filter(opt => opt !== option)
      }));
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>{editCrop ? 'Edit Crop' : 'Add New Crop'}</CardTitle>
              <CardDescription>Fill in the details to list your crop</CardDescription>
            </div>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Crop Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="e.g., Tomatoes, Rice, Wheat"
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="category">Category *</Label>
                <Select 
                  value={formData.category} 
                  onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map(cat => (
                      <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="quantity">Quantity *</Label>
                <Input
                  id="quantity"
                  type="number"
                  value={formData.quantity}
                  onChange={(e) => setFormData(prev => ({ ...prev, quantity: Number(e.target.value) }))}
                  min="0"
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="unit">Unit *</Label>
                <Select 
                  value={formData.unit} 
                  onValueChange={(value) => setFormData(prev => ({ ...prev, unit: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select unit" />
                  </SelectTrigger>
                  <SelectContent>
                    {units.map(unit => (
                      <SelectItem key={unit} value={unit}>{unit}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="price">Price per {formData.unit || 'unit'} (₹) *</Label>
                <Input
                  id="price"
                  type="number"
                  value={formData.price}
                  onChange={(e) => setFormData(prev => ({ ...prev, price: Number(e.target.value) }))}
                  min="0"
                  required
                />
              </div>
            </div>

            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Describe your crop quality, farming methods, etc."
                rows={3}
              />
            </div>

            <div>
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                value={formData.location}
                onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                placeholder="Village, District, State"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="availableFrom">Available From</Label>
                <Input
                  id="availableFrom"
                  type="date"
                  value={formData.availableFrom}
                  onChange={(e) => setFormData(prev => ({ ...prev, availableFrom: e.target.value }))}
                />
              </div>
              
              <div>
                <Label htmlFor="availableTo">Available Until</Label>
                <Input
                  id="availableTo"
                  type="date"
                  value={formData.availableTo}
                  onChange={(e) => setFormData(prev => ({ ...prev, availableTo: e.target.value }))}
                />
              </div>
            </div>

            <div>
              <Label>Delivery Options</Label>
              <div className="flex flex-wrap gap-2 mt-2">
                {deliveryOptionsAvailable.map(option => (
                  <div key={option} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id={option}
                      checked={formData.deliveryOptions.includes(option)}
                      onChange={(e) => handleDeliveryOptionChange(option, e.target.checked)}
                      className="rounded"
                    />
                    <Label htmlFor={option} className="text-sm">{option}</Label>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-2 pt-4">
              <Button type="submit" className="flex-1 bg-green-600 hover:bg-green-700">
                {editCrop ? 'Update Crop' : 'Add Crop'}
              </Button>
              <Button type="button" variant="outline" onClick={onClose} className="flex-1">
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
