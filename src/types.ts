export interface ATM {
  id: string;
  name: string;
  location: {
    address: string;
    latitude: number;
    longitude: number;
  };
  status: 'Working' | 'Out of Service' | 'No Cash';
  distance?: number; // in kilometers
  availableSlots?: TimeSlot[];
}

export interface TimeSlot {
  id: string;
  atmId: string;
  time: string;
  date: string;
  isBooked: boolean;
}

export interface BookedSlot extends TimeSlot {
  userName: string;
  bookingId: string;
  confirmationTime?: string;
}

export interface Transaction {
  id: string;
  userId: string;
  atmId: string;
  amount: number;
  type: 'Withdrawal' | 'Deposit' | 'Transfer';
  method: 'Card' | 'UPI' | 'Other';
  timestamp: string;
  status: 'Completed' | 'Failed' | 'Pending';
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  bookedSlots: BookedSlot[];
  transactions: Transaction[];
}