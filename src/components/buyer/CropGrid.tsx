
import React from 'react';
import { Crop } from '@/types';
import { CropCard } from './CropCard';

interface CropGridProps {
  crops: Crop[];
  onOrderClick: (crop: Crop) => void;
  onChatClick: (crop: Crop) => void;
}

export function CropGrid({ crops, onOrderClick, onChatClick }: CropGridProps) {
  if (crops.length === 0) {
    return (
      <div className="col-span-full text-center py-12">
        <div className="text-6xl mb-4">🔍</div>
        <p className="text-gray-500 text-lg mb-2">No crops found</p>
        <p className="text-gray-400">Try adjusting your search criteria or check back later.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {crops.map((crop) => (
        <CropCard
          key={crop.id}
          crop={crop}
          onOrderClick={onOrderClick}
          onChatClick={onChatClick}
        />
      ))}
    </div>
  );
}
