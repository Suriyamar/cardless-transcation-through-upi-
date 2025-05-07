import React, { useState } from 'react';
import { CreditCard, QrCode, CheckCircle, AlertCircle, Loader } from 'lucide-react';
import { useApp } from '../context/AppContext';

const CardlessWithdrawal: React.FC = () => {
  const { atms, generateQRCode, verifyUPITransaction, addTransaction } = useApp();
  const [selectedATM, setSelectedATM] = useState('');
  const [amount, setAmount] = useState('');
  const [step, setStep] = useState(1);
  const [qrCode, setQrCode] = useState('');
  const [otp, setOtp] = useState('');
  const [verifying, setVerifying] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const workingATMs = atms.filter(atm => atm.status === 'Working');

  const handleGenerateQR = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedATM || !amount || isNaN(Number(amount)) || Number(amount) <= 0) {
      setError('Please select an ATM and enter a valid amount');
      return;
    }
    
    const generatedQR = generateQRCode(selectedATM, Number(amount));
    setQrCode(generatedQR);
    setStep(2);
    setError('');
  };

  const handleVerifyTransaction = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!otp) {
      setError('Please enter the OTP');
      return;
    }
    
    setVerifying(true);
    setError('');
    
    try {
      const result = await verifyUPITransaction(qrCode, otp);
      
      if (result) {
        // Transaction successful
        addTransaction({
          atmId: selectedATM,
          amount: Number(amount),
          type: 'Withdrawal',
          method: 'UPI',
          status: 'Completed'
        });
        
        setSuccess(true);
        setStep(3);
      } else {
        // Transaction failed
        setError('Invalid OTP. Transaction failed.');
        addTransaction({
          atmId: selectedATM,
          amount: Number(amount),
          type: 'Withdrawal',
          method: 'UPI',
          status: 'Failed'
        });
      }
    } catch (err) {
      setError('An error occurred during verification.');
    } finally {
      setVerifying(false);
    }
  };

  const resetForm = () => {
    setSelectedATM('');
    setAmount('');
    setQrCode('');
    setOtp('');
    setStep(1);
    setSuccess(false);
    setError('');
  };

  return (
    <div className="container mx-auto max-w-2xl">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
          <CreditCard className="w-6 h-6 mr-2 text-blue-600" />
          Cardless Withdrawal
        </h1>
        
        {/* Step indicators */}
        <div className="flex items-center mb-8">
          <div className={`flex items-center justify-center w-8 h-8 rounded-full ${step >= 1 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'}`}>
            1
          </div>
          <div className={`flex-1 h-1 mx-2 ${step >= 2 ? 'bg-blue-600' : 'bg-gray-200'}`}></div>
          <div className={`flex items-center justify-center w-8 h-8 rounded-full ${step >= 2 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'}`}>
            2
          </div>
          <div className={`flex-1 h-1 mx-2 ${step >= 3 ? 'bg-blue-600' : 'bg-gray-200'}`}></div>
          <div className={`flex items-center justify-center w-8 h-8 rounded-full ${step >= 3 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'}`}>
            3
          </div>
        </div>
        
        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md flex items-center">
            <AlertCircle className="w-5 h-5 mr-2" />
            {error}
          </div>
        )}
        
        {step === 1 && (
          <form onSubmit={handleGenerateQR} className="space-y-4">
            <div>
              <label htmlFor="atm" className="block text-sm font-medium text-gray-700 mb-1">
                Select ATM
              </label>
              <select
                id="atm"
                value={selectedATM}
                onChange={(e) => setSelectedATM(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                required
              >
                <option value="">Select an ATM</option>
                {workingATMs.map((atm) => (
                  <option key={atm.id} value={atm.id}>
                    {atm.name} - {atm.location.address}
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-1">
                Amount (rupees)
              </label>
              <input
                type="number"
                id="amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                min="1"
                step="1"
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter amount"
                required
              />
            </div>
            
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Generate QR Code
            </button>
          </form>
        )}
        
        {step === 2 && (
          <div className="text-center">
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-2">Scan QR Code</h2>
              <p className="text-gray-600 mb-4">
                Scan this QR code with your UPI app to initiate the withdrawal of rupees{amount}
              </p>
              
              <div className="bg-gray-100 p-6 rounded-lg inline-block mb-4">
                <QrCode className="w-48 h-48 text-blue-600 mx-auto" />
                <p className="mt-2 text-sm text-gray-500 break-all">{qrCode}</p>
              </div>
            </div>
            
            <form onSubmit={handleVerifyTransaction} className="space-y-4">
              <div>
                <label htmlFor="otp" className="block text-sm font-medium text-gray-700 mb-1">
                  Enter OTP
                </label>
                <input
                  type="text"
                  id="otp"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter the OTP sent to your phone"
                  required
                />
                <p className="text-xs text-gray-500 mt-1">
                  For demo purposes, use "123456" as the OTP
                </p>
              </div>
              
              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 flex justify-center items-center"
                disabled={verifying}
              >
                {verifying ? (
                  <>
                    <Loader className="w-5 h-5 mr-2 animate-spin" />
                    Verifying...
                  </>
                ) : (
                  'Verify OTP'
                )}
              </button>
              
              <button
                type="button"
                onClick={() => setStep(1)}
                className="w-full bg-gray-100 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 mt-2"
              >
                Back
              </button>
            </form>
          </div>
        )}
        
        {step === 3 && (
          <div className="text-center">
            <div className="mb-6">
              <div className="bg-green-100 p-4 rounded-full inline-block mb-4">
                <CheckCircle className="w-16 h-16 text-green-600 mx-auto" />
              </div>
              
              <h2 className="text-xl font-semibold text-gray-800 mb-2">Transaction Successful!</h2>
              <p className="text-gray-600">
                Your cardless withdrawal of rupees{amount} has been processed successfully.
              </p>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-lg mb-6">
              <div className="flex justify-between mb-2">
                <span className="text-gray-600">Amount:</span>
                <span className="font-semibold">rupees{amount}</span>
              </div>
              <div className="flex justify-between mb-2">
                <span className="text-gray-600">ATM:</span>
                <span className="font-semibold">
                  {workingATMs.find(atm => atm.id === selectedATM)?.name}
                </span>
              </div>
              <div className="flex justify-between mb-2">
                <span className="text-gray-600">Transaction ID:</span>
                <span className="font-semibold">TX-{Date.now().toString().substring(5, 13)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Date & Time:</span>
                <span className="font-semibold">{new Date().toLocaleString()}</span>
              </div>
            </div>
            
            <p className="text-sm text-gray-600 mb-4">
              Please collect your cash from the ATM. A receipt has been sent to your email.
            </p>
            
            <button
              type="button"
              onClick={resetForm}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Make Another Withdrawal
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CardlessWithdrawal;