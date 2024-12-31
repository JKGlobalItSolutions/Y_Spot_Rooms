import React, { useState } from 'react';
import { ThumbsUp, ThumbsDown, Filter } from 'lucide-react';

const Reviews = () => {
  const [paymentData, setPaymentData] = useState({
    guest: 'jk',
    reservationDate: '24-12-2024',
    contactDetails: '8438438413',
    totalPrice: '2185.0',
    paymentMethod: 'Check-In Pay',
    paymentStatus: 'Pending'
  });

  const [filterType, setFilterType] = useState('All');
  const [showFilter, setShowFilter] = useState(false);
  
  const reviews = [
    {
      id: 1,
      guestName: 'Jkglobalitsolution',
      reviewDate: '04-11-2024',
      rating: 7.8,
      comment: 'hum',
      type: 'Good'
    },
    {
      id: 2,
      guestName: 'Jkglobalitsolution',
      reviewDate: '04-11-2024',
      rating: 3.8,
      comment: '',
      type: 'Bad'
    }
  ];

  const filteredReviews = filterType === 'All' 
    ? reviews
    : reviews.filter(review => review.type === filterType);

  const handleStatusChange = (e) => {
    setPaymentData(prev => ({
      ...prev,
      paymentStatus: e.target.value
    }));
  };

  const handleSave = () => {
    console.log('Saving payment details:', paymentData);
  };

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
          
          .filter-container {
            position: relative;
            display: flex;
            justify-content: flex-end;
            margin-bottom: 1rem;
          }

          .filter-button {
            background: none;
            border: none;
            cursor: pointer;
            padding: 0.5rem;
            display: flex;
            align-items: center;
            gap: 0.5rem;
            color: #ff0000;
            font-weight: bold;
          }

          .filter-dropdown {
            position: absolute;
            top: 100%;
            right: 0;
            background: white;
            border-radius: 8px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            padding: 0.5rem 0;
            min-width: 150px;
            z-index: 1001;
          }

          .filter-option {
            padding: 0.5rem 1rem;
            cursor: pointer;
            color: #333;
          }

          .filter-option:hover {
            background-color: #f5f5f5;
          }

          .reviews-header {
            font-size: 2rem;
            color: #ff0000;
            margin: 1rem 0;
          }

          .review-card {
            background: white;
            border-radius: 10px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
            padding: 1.5rem;
            margin-bottom: 1rem;
          }

          .review-type {
            display: flex;
            align-items: center;
            gap: 0.5rem;
            color: #4CAF50;
            font-size: 1.2rem;
            margin-bottom: 1rem;
          }

          .review-type.bad {
            color: #f44336;
          }

          .review-info {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 1rem;
            margin-bottom: 1rem;
          }

          .review-field {
            background: #f5f5f5;
            padding: 0.5rem 1rem;
            border-radius: 5px;
          }

          .review-label {
            font-weight: 500;
            margin-bottom: 0.25rem;
            display: block;
          }

          .review-value {
            font-size: 1rem;
          }

          .review-comments {
            margin-top: 1rem;
          }
          
          @media (max-width: 1024px) {
            .guest-details-container {
              margin-left: 0;
              max-width: 100%;
              padding: 60px 1rem 1rem;
            }
            
            .filter-container {
              position: fixed;
              top: 60px;
              right: 1rem;
              z-index: 1000;
              margin-bottom: 0;
            }

            .filter-button {
              background-color: white;
              padding: 0.5rem 1rem;
              border-radius: 0 0 8px 8px;
              box-shadow: 0 2px 4px rgba(0,0,0,0.1);
            }

            .filter-dropdown {
              top: calc(100% - 8px);
              right: 0;
              width: auto;
              min-width: 150px;
            }

            .reviews-header {
              margin-top: 3rem;
            }
          }
          
          @media (max-width: 768px) {
            .payment-card {
              border-radius: 0;
            }
            
            .payment-content {
              padding: 1rem;
            }

            .review-info {
              grid-template-columns: 1fr;
            }
          }
        `}
      </style>
      
      <div className="container-fluid p-0">
        <div className="row g-0">
          <div className="col-12">
            <div className="filter-container mt-3 mt-lg-0 ">  
              <button className="filter-button" onClick={() => setShowFilter(!showFilter)}>
                <Filter size={24} />
                Filter
              </button>
              {showFilter && (
                <div className="filter-dropdown">
                  {['All', 'Good', 'Average', 'Bad'].map(type => (
                    <div 
                      key={type}
                      className="filter-option"
                      onClick={() => {
                        setFilterType(type);
                        setShowFilter(false);
                      }}
                    >
                      {type}
                    </div>
                  ))}
                </div>
              )}
            </div>

            <h1 className="reviews-header mt-0 ">All Reviews</h1>
            
            {filteredReviews.map(review => (
              <div key={review.id} className="review-card">
                <div className={`review-type ${review.type.toLowerCase()}`}>
                  {review.type === 'Good' ? (
                    <>
                      <ThumbsUp size={24} />
                      <span>Good</span>
                    </>
                  ) : (
                    <>
                      <ThumbsDown size={24} />
                      <span>Bad</span>
                    </>
                  )}
                </div>

                <div className="review-info">
                  <div className="review-field">
                    <span className="review-label">Guest Name</span>
                    <div className="review-value">{review.guestName}</div>
                  </div>

                  <div className="review-field">
                    <span className="review-label">Review Date</span>
                    <div className="review-value">{review.reviewDate}</div>
                  </div>

                  <div className="review-field">
                    <span className="review-label">Rating</span>
                    <div className="review-value">{review.rating}</div>
                  </div>
                </div>

                <div className="review-comments">
                  <span className="review-label">Comments</span>
                  <div className="review-field">
                    {review.comment || 'No comments'}
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

export default Reviews;