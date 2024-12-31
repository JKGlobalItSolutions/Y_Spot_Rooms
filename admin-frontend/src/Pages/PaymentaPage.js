import React, { useState, useEffect } from 'react';
import { doc, getDoc, setDoc, updateDoc, arrayUnion } from 'firebase/firestore';
import { auth, db, storage } from '../firebase/config';

const PaymentPage = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPayments();
  }, []);

  const fetchPayments = async () => {
    const user = auth.currentUser;
    if (!user) {
      console.error('No user logged in');
      setLoading(false);
      return;
    }

    try {
      const hotelDocRef = doc(db, 'Hotels', user.uid);
      const hotelDocSnap = await getDoc(hotelDocRef);

      if (hotelDocSnap.exists()) {
        const hotelData = hotelDocSnap.data();
        const guestDetails = hotelData.guestDetails || [];
        
        const pendingPayments = guestDetails.filter(payment => 
          payment.Status !== 'Cancelled' && payment['Payment Status'] === 'Pending'
        ).sort((a, b) => b['Check-In Date'].toDate() - a['Check-In Date'].toDate());

        setPayments(pendingPayments);
      }
    } catch (error) {
      console.error('Error fetching payments:', error);
    }

    setLoading(false);
  };

  const handleStatusChange = async (paymentIndex, newStatus) => {
    const user = auth.currentUser;
    if (!user) {
      console.error('No user logged in');
      return;
    }

    try {
      const hotelDocRef = doc(db, 'Hotels', user.uid);
      const updatedPayments = [...payments];
      updatedPayments[paymentIndex]['Payment Status'] = newStatus;

      await updateDoc(hotelDocRef, {
        guestDetails: updatedPayments
      });

      setPayments(updatedPayments);
      console.log('Payment status updated successfully');
    } catch (error) {
      console.error('Error updating payment status:', error);
    }
  };

  const formatDate = (timestamp) => {
    if (!timestamp) return 'No Date';
    const date = timestamp.toDate();
    return date.toLocaleDateString('en-GB'); // Format as dd/mm/yyyy
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="guest-details-container p-lg-3">
      <style>
        {`
          .guest-details-container {
            margin-left: 250px;
            margin-top: 60px;
            max-width: calc(100% - 250px);
          }
          
          .payment-card {
            background: white;
            border-radius: 10px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
            margin-bottom: 1rem;
          }
          
          .payment-header {
            background: #ff0000;
            color: white;
            padding: 1rem;
            border-top-left-radius: 10px;
            border-top-right-radius: 10px;
          }
          
          .payment-content {
            padding: 1.5rem;
          }
          
          .payment-field {
            margin-bottom: 1rem;
          }
          
          .payment-label {
            font-weight: 500;
            margin-bottom: 0.5rem;
            display: block;
          }
          
          .payment-value {
            font-size: 1.1rem;
          }
          
          .save-button {
            background: #ff0000;
            color: white;
            border: none;
            padding: 0.75rem 2rem;
            border-radius: 5px;
            cursor: pointer;
            font-size: 1rem;
            transition: background-color 0.2s;
          }
          
          .save-button:hover {
            background: #e60000;
          }
          
          .status-select {
            width: 100%;
            padding: 0.5rem;
            border: 1px solid #ddd;
            border-radius: 5px;
            font-size: 1rem;
          }
          
          @media (max-width: 768px) {
            .guest-details-container {
              margin-left: 0;
              margin-top: 0;
              max-width: 100%;
              padding: 1rem;
            }
            
            .payment-card {
              border-radius: 0;
            }
          }
        `}
      </style>
      
      <div className="container-fluid p-0">
        <div className="row g-0">
          <div className="col-12">
            <h2 className="mb-4">Payment Details</h2>
            {payments.map((payment, index) => (
              <div key={index} className="payment-card">
                <div className="payment-header">
                  <h3 className="mb-0">Guest: {payment['Full Name']}</h3>
                </div>
                <div className="payment-content">
                  <div className="payment-field">
                    <span className="payment-label">Reservation Date:</span>
                    <span className="payment-value">{formatDate(payment['Check-In Date'])}</span>
                  </div>
                  <div className="payment-field">
                    <span className="payment-label">Contact Details:</span>
                    <span className="payment-value">{payment['Phone Number']}</span>
                  </div>
                  <div className="payment-field">
                    <span className="payment-label">Total Price:</span>
                    <span className="payment-value">{payment['Total Price']}</span>
                  </div>
                  <div className="payment-field">
                    <span className="payment-label">Payment Method:</span>
                    <span className="payment-value">{payment['Payment Method']}</span>
                  </div>
                  <div className="payment-field">
                    <span className="payment-label">Payment Status:</span>
                    <select 
                      className="status-select"
                      value={payment['Payment Status']}
                      onChange={(e) => handleStatusChange(index, e.target.value)}
                    >
                      <option value="Pending">Pending</option>
                      <option value="Paid">Paid</option>
                    </select>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentPage;