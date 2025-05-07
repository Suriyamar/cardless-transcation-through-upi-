import React, { createContext, useContext, useState, ReactNode } from 'react';
import { ATM, Transaction, User, BookedSlot, TimeSlot } from '../types';
import { mockATMs, mockUser } from '../data/mockData';
import { format } from 'date-fns';

interface AppContextType {
  user: User;
  atms: ATM[];
  filteredAtms: ATM[];
  filterAtms: (status?: string) => void;
  bookSlot: (atmId: string, slotId: string) => void;
  cancelBooking: (bookingId: string) => void;
  addTransaction: (transaction: Omit<Transaction, 'id' | 'timestamp' | 'userId'>) => void;
  notifications: string[];
  dismissNotification: (index: number) => void;
  generateQRCode: (atmId: string, amount: number) => string;
  verifyUPITransaction: (qrCode: string, otp: string) => Promise<boolean>;
  addNewATM: (atm: Omit<ATM, 'id' | 'distance' | 'availableSlots'>) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User>(mockUser);
  const [atms, setAtms] = useState<ATM[]>(mockATMs);
  const [filteredAtms, setFilteredAtms] = useState<ATM[]>(mockATMs);
  const [notifications, setNotifications] = useState<string[]>([
    'Welcome to ATM Management App!',
    'You have a scheduled ATM visit tomorrow at 10:30 AM.'
  ]);

  const filterAtms = (status?: string) => {
    if (!status || status === 'All') {
      setFilteredAtms(atms);
    } else {
      setFilteredAtms(atms.filter(atm => atm.status === status));
    }
  };

  const generateTimeSlots = (atmId: string): TimeSlot[] => {
    const slots: TimeSlot[] = [];
    const date = new Date();
    const dateStr = format(date, 'yyyy-MM-dd');
    
    for (let hour = 9; hour < 17; hour++) {
      for (let minute of [0, 30]) {
        const timeStr = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
        slots.push({
          id: `${atmId}-${dateStr}-${timeStr}`,
          atmId,
          date: dateStr,
          time: timeStr,
          isBooked: false
        });
      }
    }
    
    return slots;
  };

  const addNewATM = (atmData: Omit<ATM, 'id' | 'distance' | 'availableSlots'>) => {
    const newATM: ATM = {
      ...atmData,
      id: `atm-${Date.now()}`,
      distance: 0,
      availableSlots: generateTimeSlots(`atm-${Date.now()}`)
    };

    setAtms(prev => [...prev, newATM]);
    setFilteredAtms(prev => [...prev, newATM]);
    addNotification(`New ATM added: ${atmData.name}`);
  };

  const bookSlot = (atmId: string, slotId: string) => {
    const atm = atms.find(a => a.id === atmId);
    if (!atm || !atm.availableSlots) return;
    
    const slot = atm.availableSlots.find(s => s.id === slotId);
    if (!slot || slot.isBooked) return;
    
    const bookedSlot: BookedSlot = {
      ...slot,
      isBooked: true,
      userName: user.name,
      bookingId: `booking-${Date.now()}`
    };
    
    const updatedAtms = atms.map(a => {
      if (a.id === atmId && a.availableSlots) {
        return {
          ...a,
          availableSlots: a.availableSlots.map(s => 
            s.id === slotId ? { ...s, isBooked: true } : s
          )
        };
      }
      return a;
    });
    
    const updatedUser = {
      ...user,
      bookedSlots: [...user.bookedSlots, bookedSlot]
    };
    
    setAtms(updatedAtms);
    setFilteredAtms(updatedAtms);
    setUser(updatedUser);
    
    addNotification(`You've booked a slot at ${atm.name} for ${slot.time}`);
  };

  const cancelBooking = (bookingId: string) => {
    const booking = user.bookedSlots.find(b => b.bookingId === bookingId);
    if (!booking) return;
    
    const updatedAtms = atms.map(a => {
      if (a.id === booking.atmId && a.availableSlots) {
        return {
          ...a,
          availableSlots: a.availableSlots.map(s => 
            s.id === booking.id ? { ...s, isBooked: false } : s
          )
        };
      }
      return a;
    });
    
    const updatedUser = {
      ...user,
      bookedSlots: user.bookedSlots.filter(b => b.bookingId !== bookingId)
    };
    
    setAtms(updatedAtms);
    setFilteredAtms(updatedAtms);
    setUser(updatedUser);
    
    addNotification(`Your booking has been cancelled`);
  };

  const addTransaction = (transaction: Omit<Transaction, 'id' | 'timestamp' | 'userId'>) => {
    const newTransaction: Transaction = {
      ...transaction,
      id: `tx-${Date.now()}`,
      timestamp: new Date().toISOString(),
      userId: user.id
    };
    
    const updatedUser = {
      ...user,
      transactions: [newTransaction, ...user.transactions]
    };
    
    setUser(updatedUser);
    
    addNotification(`${transaction.type} of $${transaction.amount} ${transaction.status === 'Completed' ? 'completed' : 'failed'}`);
  };

  const addNotification = (message: string) => {
    setNotifications(prev => [message, ...prev]);
  };

  const dismissNotification = (index: number) => {
    setNotifications(prev => prev.filter((_, i) => i !== index));
  };

  const generateQRCode = (atmId: string, amount: number) => {
    return `UPI://pay?pa=atm@bank&pn=ATM-${atmId}&am=${amount}&cu=INR&tn=ATM-Withdrawal`;
  };

  const verifyUPITransaction = async (qrCode: string, otp: string): Promise<boolean> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(otp === "123456");
      }, 1500);
    });
  };

  return (
    <AppContext.Provider value={{
      user,
      atms,
      filteredAtms,
      filterAtms,
      bookSlot,
      cancelBooking,
      addTransaction,
      notifications,
      dismissNotification,
      generateQRCode,
      verifyUPITransaction,
      addNewATM
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};