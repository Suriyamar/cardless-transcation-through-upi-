import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import TransactionCard from '../components/TransactionCard';
import { History, Filter } from 'lucide-react';

const Transactions: React.FC = () => {
  const { user } = useApp();
  const [filter, setFilter] = useState('All');

  const filteredTransactions = user.transactions.filter(tx => 
    filter === 'All' ? true : tx.type === filter
  );

  return (
    <div className="container mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800 flex items-center">
          <History className="w-6 h-6 mr-2 text-blue-600" />
          Transaction History
        </h1>

        <div className="flex items-center space-x-2">
          <Filter className="w-5 h-5 text-gray-500" />
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="border border-gray-300 rounded-md px-3 py-1.5 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="All">All Transactions</option>
            <option value="Withdrawal">Withdrawals</option>
            <option value="Deposit">Deposits</option>
            <option value="Transfer">Transfers</option>
          </select>
        </div>
      </div>

      <div className="space-y-4">
        {filteredTransactions.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <History className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-800 mb-2">No Transactions</h2>
            <p className="text-gray-600">You haven't made any transactions yet.</p>
          </div>
        ) : (
          filteredTransactions.map((transaction) => (
            <TransactionCard key={transaction.id} transaction={transaction} />
          ))
        )}
      </div>
    </div>
  );
};

export default Transactions;