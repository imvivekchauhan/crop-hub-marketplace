
export interface User {
  id: string;
  email: string;
  role: 'farmer' | 'buyer' | 'admin';
  name: string;
  phone?: string;
  aadhaar?: string;
  location?: string;
  createdAt: string;
}

export interface Crop {
  id: string;
  farmerId: string;
  farmerName: string;
  name: string;
  category: string;
  quantity: number;
  price: number;
  unit: string;
  images: string[];
  description: string;
  location: string;
  availableFrom: string;
  availableTo: string;
  deliveryOptions: string[];
  isApproved: boolean;
  createdAt: string;
}

export interface Order {
  id: string;
  farmerId: string;
  buyerId: string;
  cropId: string;
  quantity: number;
  totalPrice: number;
  status: 'pending' | 'accepted' | 'rejected' | 'completed';
  paymentStatus: 'pending' | 'paid' | 'failed';
  createdAt: string;
}

export interface MarketPrice {
  crop: string;
  state: string;
  district: string;
  market: string;
  variety: string;
  grade: string;
  minPrice: number;
  maxPrice: number;
  modalPrice: number;
  date: string;
}

export interface Message {
  id: string;
  chatId: string;
  senderId: string;
  senderName: string;
  recipientId: string;
  content: string;
  timestamp: string;
  isRead: boolean;
}
