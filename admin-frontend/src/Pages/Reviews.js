import React, { useState, useEffect } from 'react';
import { ThumbsUp, ThumbsDown, Filter, Minus } from 'lucide-react';
import { collection, query, onSnapshot } from 'firebase/firestore';
import { auth, db } from '../firebase/config';

const Reviews = () => {
  const [reviews, setReviews] = useState([]);
  const [filterType, setFilterType] = useState('All');
  const [showFilter, setShowFilter] = useState(false);

  useEffect(() => {
    const user = auth.currentUser;
    if (!user) {
      console.error('No user logged in');
      return;
    }

    const reviewsRef = collection(db, 'Hotels', user.uid, 'Reviews');
    const q = query(reviewsRef);

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const reviewsData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setReviews(reviewsData);
    });

    return () => unsubscribe();
  }, []);

  const calculateOverallRating = (review) => {
    const { amenities, luxury, price, staffReview } = review;
    return ((amenities + luxury + price + staffReview) / 4) * 2;
  };

  const getFilteredReviews = () => {
    switch (filterType) {
      case 'Good':
        return reviews.filter(review => calculateOverallRating(review) >= 7);
      case 'Average':
        return reviews.filter(review => calculateOverallRating(review) === 6);
      case 'Bad':
        return reviews.filter(review => calculateOverallRating(review) <= 4);
      default:
        return reviews;
    }
  };

  const formatDate = (timestamp) => {
    if (!timestamp) return 'No Date';
    const date = timestamp.toDate();
    return date.toLocaleDateString('en-GB'); // Format as dd/mm/yyyy
  };

  const filteredReviews = getFilteredReviews();

  return (
    <div className="guest-details-container p-lg-3">
      <style>
        {`
          .guest-details-container {
            margin-left: 250px;
            margin-top: 60px;
            max-width: calc(100% - 250px);
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
            font-size: 1.2rem;
            margin-bottom: 1rem;
          }

          .review-type.good { color: #4CAF50; }
          .review-type.average { color: #FFA500; }
          .review-type.bad { color: #f44336; }

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
            .review-card {
              border-radius: 0;
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
            <div className="filter-container mt-3 mt-lg-0">  
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

            <h1 className="reviews-header mt-0">All Reviews</h1>
            
            {filteredReviews.map(review => {
              const overallRating = calculateOverallRating(review);
              let reviewType, ReviewIcon;
              if (overallRating >= 7) {
                reviewType = 'good';
                ReviewIcon = ThumbsUp;
              } else if (overallRating === 6) {
                reviewType = 'average';
                ReviewIcon = Minus;
              } else {
                reviewType = 'bad';
                ReviewIcon = ThumbsDown;
              }

              return (
                <div key={review.id} className="review-card">
                  <div className={`review-type ${reviewType}`}>
                    <ReviewIcon size={24} />
                    <span>{reviewType.charAt(0).toUpperCase() + reviewType.slice(1)}</span>
                  </div>

                  <div className="review-info">
                    <div className="review-field">
                      <span className="review-label">Guest Name</span>
                      <div className="review-value">{review.username || 'Anonymous'}</div>
                    </div>

                    <div className="review-field">
                      <span className="review-label">Review Date</span>
                      <div className="review-value">{formatDate(review.timestamp)}</div>
                    </div>

                    <div className="review-field">
                      <span className="review-label">Rating</span>
                      <div className="review-value">{overallRating.toFixed(1)}</div>
                    </div>
                  </div>

                  <div className="review-comments">
                    <span className="review-label">Comments</span>
                    <div className="review-field">
                      {review.comments || 'No comments'}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reviews;

