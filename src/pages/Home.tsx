import React from 'react';
import { Link } from 'react-router-dom';
import { CreditCard, MapPin, Calendar, History } from 'lucide-react';
import { useApp } from '../context/AppContext';

const Home: React.FC = () => {
  const { user, atms } = useApp();
  
  const workingAtms = atms.filter(atm => atm.status === 'Working').length;
  const upcomingBookings = user.bookedSlots.length;
  const recentTransactions = user.transactions.filter(tx => 
    new Date(tx.timestamp) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
  ).length;

  return (
    <div className="container mx-auto">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Welcome, {user.name}</h1>
      
      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-lg shadow-md p-5">
          <div className="flex items-center">
            <div className="bg-blue-100 p-3 rounded-full">
              <CreditCard className="w-6 h-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <h2 className="text-sm font-medium text-gray-500">Cardless Withdrawals</h2>
              <p className="text-xl font-semibold text-gray-800">
                {user.transactions.filter(tx => tx.method === 'UPI').length}
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-5">
          <div className="flex items-center">
            <div className="bg-green-100 p-3 rounded-full">
              <MapPin className="w-6 h-6 text-green-600" />
            </div>
            <div className="ml-4">
              <h2 className="text-sm font-medium text-gray-500">Working ATMs Nearby</h2>
              <p className="text-xl font-semibold text-gray-800">{workingAtms}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-5">
          <div className="flex items-center">
            <div className="bg-purple-100 p-3 rounded-full">
              <Calendar className="w-6 h-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <h2 className="text-sm font-medium text-gray-500">Upcoming Bookings</h2>
              <p className="text-xl font-semibold text-gray-800">{upcomingBookings}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-5">
          <div className="flex items-center">
            <div className="bg-orange-100 p-3 rounded-full">
              <History className="w-6 h-6 text-orange-600" />
            </div>
            <div className="ml-4">
              <h2 className="text-sm font-medium text-gray-500">Recent Transactions</h2>
              <p className="text-xl font-semibold text-gray-800">{recentTransactions}</p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Quick Actions */}
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Quick Actions</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Link to="/cardless-withdrawal" className="bg-white rounded-lg shadow-md p-5 hover:shadow-lg transition-shadow">
          <div className="flex flex-col items-center text-center">
            <div className="bg-blue-100 p-4 rounded-full mb-3">
              <CreditCard className="w-8 h-8 text-blue-600" />
            </div>
            <h3 className="font-medium text-gray-800">Cardless Withdrawal</h3>
            <p className="text-sm text-gray-500 mt-1">Withdraw cash using UPI</p>
          </div>
        </Link>
        
        <Link to="/atm-locator" className="bg-white rounded-lg shadow-md p-5 hover:shadow-lg transition-shadow">
          <div className="flex flex-col items-center text-center">
            <div className="bg-green-100 p-4 rounded-full mb-3">
              <MapPin className="w-8 h-8 text-green-600" />
            </div>
            <h3 className="font-medium text-gray-800">Find ATM</h3>
            <p className="text-sm text-gray-500 mt-1">Locate nearest working ATM</p>
          </div>
        </Link>
        
        <Link to="/slot-booking" className="bg-white rounded-lg shadow-md p-5 hover:shadow-lg transition-shadow">
          <div className="flex flex-col items-center text-center">
            <div className="bg-purple-100 p-4 rounded-full mb-3">
              <Calendar className="w-8 h-8 text-purple-600" />
            </div>
            <h3 className="font-medium text-gray-800">Book Slot</h3>
            <p className="text-sm text-gray-500 mt-1">Reserve ATM time slot</p>
          </div>
        </Link>
        
        <Link to="/transactions" className="bg-white rounded-lg shadow-md p-5 hover:shadow-lg transition-shadow">
          <div className="flex flex-col items-center text-center">
            <div className="bg-orange-100 p-4 rounded-full mb-3">
              <History className="w-8 h-8 text-orange-600" />
            </div>
            <h3 className="font-medium text-gray-800">Transactions</h3>
            <p className="text-sm text-gray-500 mt-1">View transaction history</p>
          </div>
        </Link>
      </div>
      
      {/* Recent Activity */}
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Recent Activity</h2>
      <div className="bg-white rounded-lg shadow-md p-5 mb-8">
        {user.transactions.slice(0, 3).map((transaction, index) => (
          <div key={transaction.id} className={`flex justify-between items-center py-3 ${index !== 0 ? 'border-t border-gray-100' : ''}`}>
            <div>
              <h3 className="font-medium text-gray-800">{transaction.type}</h3>
              <p className="text-sm text-gray-500">
                {new Date(transaction.timestamp).toLocaleDateString()} • {transaction.method}
              </p>
            </div>
            <div className="text-right">
              <p className={`font-semibold ${transaction.type === 'Deposit' ? 'text-green-600' : 'text-red-600'}`}>
                {transaction.type === 'Deposit' ? '+' : '-'}${transaction.amount}
              </p>
              <p className={`text-xs ${
                transaction.status === 'Completed' ? 'text-green-600' : 
                transaction.status === 'Failed' ? 'text-red-600' : 'text-yellow-600'
              }`}>
                {transaction.status}
              </p>
            </div>
          </div>
        ))}
        <div className="mt-3 text-center">
          <Link to="/transactions" className="text-blue-600 hover:text-blue-800 text-sm font-medium">
            View All Transactions
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Home;