import React, { useEffect, useState } from 'react';
import { BookedSlot } from '../types';
import { Calendar, Clock, MapPin, X } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { format, differenceInSeconds, parse, isAfter, addHours } from 'date-fns';

interface BookingCardProps {
  booking: BookedSlot;
  atmName: string;
}

const BookingCard: React.FC<BookingCardProps> = ({ booking, atmName }) => {
  const { cancelBooking } = useApp();
  const [timeLeft, setTimeLeft] = useState<string>('');
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [isExpired, setIsExpired] = useState(false);

  const handleCancel = () => {
    if (window.confirm('Are you sure you want to cancel this booking?')) {
      cancelBooking(booking.bookingId);
    }
  };

  const handleConfirm = () => {
    setIsConfirmed(true);
    const now = new Date();
    booking.confirmationTime = now.toISOString();
  };

  useEffect(() => {
    if (!isConfirmed) {
      // Check if booking time has passed
      const bookingDateTime = parse(
        `${booking.date} ${booking.time}`,
        'yyyy-MM-dd HH:mm',
        new Date()
      );
      
      if (isAfter(new Date(), bookingDateTime)) {
        setIsExpired(true);
        cancelBooking(booking.bookingId);
        return;
      }
    }

    if (isConfirmed && booking.confirmationTime) {
      const timer = setInterval(() => {
        const now = new Date();
        const bookingDateTime = parse(
          `${booking.date} ${booking.time}`,
          'yyyy-MM-dd HH:mm',
          new Date()
        );
        
        // Calculate time remaining until booking time
        const secondsLeft = differenceInSeconds(bookingDateTime, now);

        if (secondsLeft <= 0) {
          clearInterval(timer);
          setIsExpired(true);
          cancelBooking(booking.bookingId);
          return;
        }

        // Format time remaining
        const hours = Math.floor(secondsLeft / 3600);
        const minutes = Math.floor((secondsLeft % 3600) / 60);
        const seconds = secondsLeft % 60;

        if (hours > 0) {
          setTimeLeft(`${hours}h ${minutes}m ${seconds}s`);
        } else {
          setTimeLeft(`${minutes}m ${seconds}s`);
        }
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [isConfirmed, booking.confirmationTime, booking.date, booking.time, booking.bookingId, cancelBooking]);

  return (
    <div className="bg-white rounded-lg shadow-md p-4 border border-gray-200">
      <div className="flex justify-between items-start">
        <h3 className="text-lg font-semibold text-gray-800">{atmName}</h3>
        <button 
          onClick={handleCancel}
          className="text-gray-400 hover:text-red-500 p-1"
          aria-label="Cancel booking"
        >
          <X className="w-5 h-5" />
        </button>
      </div>
      
      <div className="mt-3 space-y-2">
        <div className="flex items-center text-gray-600">
          <Calendar className="w-4 h-4 mr-2" />
          <span>{format(new Date(booking.date), 'PPP')}</span>
        </div>
        
        <div className="flex items-center text-gray-600">
          <Clock className="w-4 h-4 mr-2" />
          <span>{booking.time}</span>
        </div>
        
        <div className="flex items-center text-gray-600">
          <MapPin className="w-4 h-4 mr-2" />
          <span>ATM ID: {booking.atmId}</span>
        </div>
      </div>
      
      <div className="mt-4 pt-3 border-t border-gray-100">
        {!isConfirmed ? (
          <button
            onClick={handleConfirm}
            className="w-full px-3 py-2 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700"
          >
            Confirm Booking
          </button>
        ) : isExpired ? (
          <div className="text-center text-red-600 font-medium">
            Booking Expired
          </div>
        ) : (
          <div className="text-center">
            <p className="text-sm font-medium text-gray-600">Time Remaining</p>
            <p className="text-lg font-bold text-blue-600">{timeLeft}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default BookingCard;