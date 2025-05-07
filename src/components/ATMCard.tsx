import React from 'react';
import { ATM } from '../types';
import { MapPin, AlertCircle, CheckCircle, XCircle } from 'lucide-react';

interface ATMCardProps {
  atm: ATM;
  onClick?: () => void;
}

const ATMCard: React.FC<ATMCardProps> = ({ atm, onClick }) => {
  const getStatusIcon = () => {
    switch (atm.status) {
      case 'Working':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'No Cash':
        return <AlertCircle className="w-5 h-5 text-yellow-500" />;
      case 'Out of Service':
        return <XCircle className="w-5 h-5 text-red-500" />;
      default:
        return null;
    }
  };

  const getStatusColor = () => {
    switch (atm.status) {
      case 'Working':
        return 'bg-green-100 text-green-800';
      case 'No Cash':
        return 'bg-yellow-100 text-yellow-800';
      case 'Out of Service':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div 
      className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow cursor-pointer"
      onClick={onClick}
    >
      <div className="flex justify-between items-start">
        <h3 className="text-lg font-semibold text-gray-800">{atm.name}</h3>
        <span className={`px-2 py-1 rounded-full text-xs font-medium flex items-center ${getStatusColor()}`}>
          {getStatusIcon()}
          <span className="ml-1">{atm.status}</span>
        </span>
      </div>
      
      <div className="mt-2 flex items-start text-gray-600">
        <MapPin className="w-4 h-4 mt-1 mr-1 flex-shrink-0" />
        <p className="text-sm">{atm.location.address}</p>
      </div>
      
      {atm.distance !== undefined && (
        <p className="mt-2 text-sm text-gray-500">
          {atm.distance < 1 
            ? `${(atm.distance * 1000).toFixed(0)} meters away` 
            : `${atm.distance.toFixed(1)} km away`}
        </p>
      )}
      
      <div className="mt-3 flex justify-between items-center">
        <span className="text-sm font-medium text-blue-600">
          {atm.availableSlots?.filter(slot => !slot.isBooked).length || 0} slots available
        </span>
        <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
          View Details
        </button>
      </div>
    </div>
  );
};

export default ATMCard;