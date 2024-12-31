import React, { useState } from 'react';

const PaymentPage = () => {
  const [paymentData, setPaymentData] = useState({
    guest: 'jk',
    reservationDate: '24-12-2024',
    contactDetails: '8438438413',
    totalPrice: '2185.0',
    paymentMethod: 'Check-In Pay',
    paymentStatus: 'Pending'
  });

  const handleStatusChange = (e) => {
    setPaymentData(prev => ({
      ...prev,
      paymentStatus: e.target.value
    }));
  };

  const handleSave = () => {
    console.log('Saving payment details:', paymentData);
    // Add your save logic here
  };

  return (
    <div className="guest-details-container p-lg-3  ">
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
          }
          
          .payment-header {
            background: #ff0000;
            color: white;
            padding: 1rem;
            position: relative;
            margin-bottom: 1rem;
          }
          
          .payment-content {
            padding: 1.5rem;
          }
          
          .payment-field {
            margin-bottom: 1.25rem;
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
              padding: 0;
            }
            
            .payment-card {
              border-radius: 0;
            }
            
            .payment-content {
              padding: 1rem;
            }
          }
        `}
      </style>
      
      <div className="container-fluid p-0  ">
        <div className="row g-0">
          <div className="col-12  ">
            <div className="card payment-card">
              <div className="payment-header mt-5 mt-lg-0 ">
                <h2 className="mb-0  ">Payment Details</h2>
              </div>
              
              <div className="payment-content">
                <div className="payment-field">
                  <span className="payment-label">Guest:</span>
                  <span className="payment-value">{paymentData.guest}</span>
                </div>
                
                <div className="payment-field">
                  <span className="payment-label">Reservation Date:</span>
                  <span className="payment-value">{paymentData.reservationDate}</span>
                </div>
                
                <div className="payment-field">
                  <span className="payment-label">Contact Details:</span>
                  <span className="payment-value">{paymentData.contactDetails}</span>
                </div>
                
                <div className="payment-field">
                  <span className="payment-label">Total Price:</span>
                  <span className="payment-value">{paymentData.totalPrice}</span>
                </div>
                
                <div className="payment-field">
                  <span className="payment-label">Payment Method:</span>
                  <span className="payment-value">{paymentData.paymentMethod}</span>
                </div>
                
                <div className="payment-field">
                  <span className="payment-label">Payment Status:</span>
                  <select 
                    className="status-select"
                    value={paymentData.paymentStatus}
                    onChange={handleStatusChange}
                  >
                    <option value="Pending">Pending</option>
                    <option value="Paid">Paid</option>
                  </select>
                </div>
                
                <button className="save-button" onClick={handleSave}>
                  Save
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentPage;