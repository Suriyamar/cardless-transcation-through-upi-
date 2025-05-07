import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import Layout from './components/Layout';
import Home from './pages/Home';
import CardlessWithdrawal from './pages/CardlessWithdrawal';
import ATMLocator from './pages/ATMLocator';
import SlotBooking from './pages/SlotBooking';
import MyBookings from './pages/MyBookings';
import Transactions from './pages/Transactions';

function App() {
  return (
    <AppProvider>
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/cardless-withdrawal" element={<CardlessWithdrawal />} />
            <Route path="/atm-locator" element={<ATMLocator />} />
            <Route path="/slot-booking" element={<SlotBooking />} />
            <Route path="/my-bookings" element={<MyBookings />} />
            <Route path="/transactions" element={<Transactions />} />
          </Routes>
        </Layout>
      </Router>
    </AppProvider>
  );
}

export default App;