import { ATM, Transaction, User, TimeSlot, BookedSlot } from '../types';
import { addDays, format } from 'date-fns';

// Generate time slots for the next 3 days
const generateTimeSlots = (atmId: string): TimeSlot[] => {
  const slots: TimeSlot[] = [];
  
  for (let day = 0; day < 3; day++) {
    const date = addDays(new Date(), day);
    const dateStr = format(date, 'yyyy-MM-dd');
    
    // Generate slots from 9 AM to 5 PM, every 30 minutes
    for (let hour = 9; hour < 17; hour++) {
      for (let minute of [0, 30]) {
        const timeStr = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
        slots.push({
          id: `${atmId}-${dateStr}-${timeStr}`,
          atmId,
          date: dateStr,
          time: timeStr,
          isBooked: Math.random() > 0.7 // Randomly mark some slots as booked
        });
      }
    }
  }
  
  return slots;
};

// Mock ATMs
export const mockATMs: ATM[] = [
  {
    id: 'atm1',
    name: 'Main Street ATM',
    location: {
      address: '123 Main St, POTHERI',
      latitude: 40.7128,
      longitude: -74.0060
    },
    status: 'Working',
    distance: 0.5,
    availableSlots: generateTimeSlots('atm1')
  },
  {
    id: 'atm2',
    name: 'Central Park ATM',
    location: {
      address: '45 medical block, potheri',
      latitude: 40.7828,
      longitude: -73.9654
    },
    status: 'Working',
    distance: 1.2,
    availableSlots: generateTimeSlots('atm2')
  },
  {
    id: 'atm3',
    name: 'Downtown ATM',
    location: {
      address: '78 Downtown , pillayar',
      latitude: 40.7023,
      longitude: -74.0128
    },
    status: 'No Cash',
    distance: 2.3,
    availableSlots: generateTimeSlots('atm3')
  },
  {
    id: 'atm4',
    name: 'Riverside ATM',
    location: {
      address: '92 River Road, potheri',
      latitude: 40.7589,
      longitude: -73.9851
    },
    status: 'Out of Service',
    distance: 3.1,
    availableSlots: generateTimeSlots('atm4')
  },
  {
    id: 'atm5',
    name: 'Shopping Mall ATM',
    location: {
      address: '150 Mall Circle, GST ROAD',
      latitude: 40.7423,
      longitude: -74.0231
    },
    status: 'Working',
    distance: 1.8,
    availableSlots: generateTimeSlots('atm5')
  }
];

// Mock Transactions
export const mockTransactions: Transaction[] = [
  {
    id: 'tx1',
    userId: 'user1',
    atmId: 'atm1',
    amount: 200,
    type: 'Withdrawal',
    method: 'Card',
    timestamp: '2025-05-01T10:30:00Z',
    status: 'Completed'
  },
  {
    id: 'tx2',
    userId: 'user1',
    atmId: 'atm2',
    amount: 500,
    type: 'Withdrawal',
    method: 'UPI',
    timestamp: '2025-05-03T14:15:00Z',
    status: 'Completed'
  },
  {
    id: 'tx3',
    userId: 'user1',
    atmId: 'atm3',
    amount: 1000,
    type: 'Deposit',
    method: 'Card',
    timestamp: '2025-05-05T16:45:00Z',
    status: 'Completed'
  },
  {
    id: 'tx4',
    userId: 'user1',
    atmId: 'atm1',
    amount: 300,
    type: 'Withdrawal',
    method: 'UPI',
    timestamp: '2025-05-07T09:20:00Z',
    status: 'Failed'
  },
  {
    id: 'tx5',
    userId: 'user1',
    atmId: 'atm5',
    amount: 750,
    type: 'Withdrawal',
    method: 'UPI',
    timestamp: '2025-05-10T11:05:00Z',
    status: 'Completed'
  }
];

// Mock Booked Slots
export const mockBookedSlots: BookedSlot[] = [
  {
    id: 'slot1',
    atmId: 'atm1',
    date: format(addDays(new Date(), 1), 'yyyy-MM-dd'),
    time: '10:30',
    isBooked: true,
    userName: 'Surya Devana',
    bookingId: 'booking1'
  },
  {
    id: 'slot2',
    atmId: 'atm2',
    date: format(addDays(new Date(), 2), 'yyyy-MM-dd'),
    time: '14:00',
    isBooked: true,
    userName: 'Surya Devana',
    bookingId: 'booking2'
  }
];

// Mock User
export const mockUser: User = {
  id: 'user1',
  name: 'Surya Devana',
  email: 'Suryadevana@egmail.com',
  phone: '+1234567890',
  bookedSlots: mockBookedSlots,
  transactions: mockTransactions
};