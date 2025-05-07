import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Calendar, Clock, Lock, Check } from 'lucide-react';
import { format, addHours, parse, isAfter, isBefore } from 'date-fns';

const SlotBooking: React.FC = () => {
  const { atms, bookSlot } = useApp();
  const [selectedATM, setSelectedATM] = useState('');
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);

  const workingATMs = atms.filter(atm => atm.status === 'Working');
  const selectedATMData = workingATMs.find(atm => atm.id === selectedATM);

  const handleBookSlot = () => {
    if (selectedATM && selectedSlot) {
      bookSlot(selectedATM, selectedSlot);
      setSelectedSlot(null);
    }
  };

  const getTimeSlots = () => {
    if (!selectedATMData?.availableSlots) return { availableSlots: [], bookedSlots: [] };

    const now = new Date();
    const fourHoursLater = addHours(now, 4);

    const slots = selectedATMData.availableSlots
      .filter(slot => {
        const slotDateTime = parse(
          `${slot.date} ${slot.time}`,
          'yyyy-MM-dd HH:mm',
          new Date()
        );
        
        return isAfter(slotDateTime, now) && isBefore(slotDateTime, fourHoursLater);
      })
      .sort((a, b) => a.time.localeCompare(b.time));

    return {
      availableSlots: slots.filter(slot => !slot.isBooked),
      bookedSlots: slots.filter(slot => slot.isBooked)
    };
  };

  const { availableSlots, bookedSlots } = getTimeSlots();

  return (
    <div className="container mx-auto">
      <h1 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
        <Calendar className="w-6 h-6 mr-2 text-blue-600" />
        Book ATM Slot
      </h1>

      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Select ATM
          </label>
          <select
            value={selectedATM}
            onChange={(e) => setSelectedATM(e.target.value)}
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">Choose an ATM</option>
            {workingATMs.map((atm) => (
              <option key={atm.id} value={atm.id}>
                {atm.name} - {atm.location.address}
              </option>
            ))}
          </select>
        </div>

        {selectedATM && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-800 flex items-center">
                <Clock className="w-5 h-5 mr-2 text-blue-600" />
                Time Slots
              </h2>
              <span className="text-sm text-gray-500">
                Next {format(new Date(), 'HH:mm')} - {format(addHours(new Date(), 4), 'HH:mm')}
              </span>
            </div>

            <div className="mb-4">
              <div className="flex space-x-4 text-sm">
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-blue-50 rounded-full mr-2"></div>
                  <span>Available</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-gray-100 rounded-full mr-2"></div>
                  <span>Booked</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-blue-600 rounded-full mr-2"></div>
                  <span>Selected</span>
                </div>
              </div>
            </div>

            {availableSlots.length === 0 && bookedSlots.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <Clock className="w-12 h-12 mx-auto mb-2 text-gray-400" />
                <p>No slots available in the next 4 hours.</p>
                <p className="text-sm">Please try again later.</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3 mb-6">
                {[...availableSlots, ...bookedSlots]
                  .sort((a, b) => a.time.localeCompare(b.time))
                  .map((slot) => (
                    <button
                      key={slot.id}
                      onClick={() => !slot.isBooked && setSelectedSlot(slot.id)}
                      disabled={slot.isBooked}
                      className={`
                        p-3 rounded-md text-center relative
                        ${slot.isBooked 
                          ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                          : slot.id === selectedSlot
                            ? 'bg-blue-600 text-white'
                            : 'bg-blue-50 text-blue-600 hover:bg-blue-100'
                        }
                      `}
                    >
                      {slot.time}
                      {slot.isBooked && (
                        <Lock className="w-3 h-3 absolute top-1 right-1 text-gray-400" />
                      )}
                    </button>
                  ))}
              </div>
            )}

            {selectedSlot && (
              <div className="space-y-4">
                <div className="bg-blue-50 p-4 rounded-md">
                  <p className="text-sm text-blue-700">
                    Selected slot will be held for 1 hour after confirmation.
                  </p>
                </div>
                <button
                  onClick={handleBookSlot}
                  className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                  Confirm Booking
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default SlotBooking;