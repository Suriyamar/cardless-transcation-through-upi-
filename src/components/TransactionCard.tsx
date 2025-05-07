import React from 'react';
import { Transaction } from '../types';
import { ArrowUpRight, ArrowDownLeft, AlertCircle, CheckCircle, Clock } from 'lucide-react';

interface TransactionCardProps {
  transaction: Transaction;
}

const TransactionCard: React.FC<TransactionCardProps> = ({ transaction }) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  const getTransactionIcon = () => {
    switch (transaction.type) {
      case 'Withdrawal':
        return <ArrowUpRight className="w-5 h-5 text-red-500" />;
      case 'Deposit':
        return <ArrowDownLeft className="w-5 h-5 text-green-500" />;
      case 'Transfer':
        return <ArrowUpRight className="w-5 h-5 text-blue-500" />;
      default:
        return null;
    }
  };

  const getStatusIcon = () => {
    switch (transaction.status) {
      case 'Completed':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'Failed':
        return <AlertCircle className="w-4 h-4 text-red-500" />;
      case 'Pending':
        return <Clock className="w-4 h-4 text-yellow-500" />;
      default:
        return null;
    }
  };

  const getStatusColor = () => {
    switch (transaction.status) {
      case 'Completed':
        return 'bg-green-100 text-green-800';
      case 'Failed':
        return 'bg-red-100 text-red-800';
      case 'Pending':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getAmountColor = () => {
    switch (transaction.type) {
      case 'Withdrawal':
        return 'text-red-600';
      case 'Deposit':
        return 'text-green-600';
      case 'Transfer':
        return 'text-blue-600';
      default:
        return 'text-gray-800';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-100">
      <div className="flex justify-between items-start">
        <div className="flex items-center">
          <div className="bg-gray-100 p-2 rounded-full mr-3">
            {getTransactionIcon()}
          </div>
          <div>
            <h3 className="text-md font-medium text-gray-800">{transaction.type}</h3>
            <p className="text-xs text-gray-500">
              {formatDate(transaction.timestamp)}
            </p>
          </div>
        </div>
        <div className="text-right">
          <p className={`text-md font-semibold ${getAmountColor()}`}>
            {transaction.type === 'Deposit' ? '+' : '-'}${transaction.amount.toFixed(2)}
          </p>
          <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor()}`}>
            {getStatusIcon()}
            <span className="ml-1">{transaction.status}</span>
          </span>
        </div>
      </div>
      <div className="mt-2 flex justify-between text-xs text-gray-500">
        <span>Method: {transaction.method}</span>
        <span>ATM ID: {transaction.atmId}</span>
      </div>
    </div>
  );
};

export default TransactionCard;