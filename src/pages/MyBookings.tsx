import React from 'react';
import { useApp } from '../context/AppContext';
import BookingCard from '../components/BookingCard';
import { Calendar } from 'lucide-react';

const MyBookings: React.FC = () => {
  const { user, atms } = useApp();

  const getATMName = (atmId: string) => {
    return atms.find(atm => atm.id === atmId)?.name || 'Unknown ATM';
  };

  return (
    <div className="container mx-auto">
      <h1 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
        <Calendar className="w-6 h-6 mr-2 text-blue-600" />
        My Bookings
      </h1>

      {user.bookedSlots.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-6 text-center">
          <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-800 mb-2">No Bookings Yet</h2>
          <p className="text-gray-600">You haven't made any ATM slot bookings yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {user.bookedSlots.map((booking) => (
            <BookingCard
              key={booking.bookingId}
              booking={booking}
              atmName={getATMName(booking.atmId)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default MyBookings;