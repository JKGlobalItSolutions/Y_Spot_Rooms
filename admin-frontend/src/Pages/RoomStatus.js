import React, { useState } from 'react';
import { ThumbsUp, ThumbsDown, Filter, ChevronLeft, ChevronRight, Users, Bed, Calendar, Clock } from 'lucide-react';

const RoomStatus = () => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showFilter, setShowFilter] = useState(false);

  const daysInMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1).getDay();

  const monthNames = ["January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const prevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  };

  const nextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
  };

  const isToday = (date) => {
    const today = new Date();
    return date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear();
  };

  const isSelected = (date) => {
    return date.getDate() === selectedDate.getDate() &&
      date.getMonth() === selectedDate.getMonth() &&
      date.getFullYear() === selectedDate.getFullYear();
  };

  return (
    <div className="guest-details-container">
      <style jsx>{`
        .guest-details-container {
          margin-left: 250px;
          margin-top: 60px;
          max-width: calc(100% - 250px);
          padding: 1rem;
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

        .calendar-container {
          background: white;
          border-radius: 10px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
          padding: 1rem;
          margin-bottom: 1.5rem;
          width: 100%;
          max-width: 350px;
        }

        .calendar-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1rem;
        }

        .calendar-title {
          font-size: 1.25rem;
          font-weight: 500;
        }

        .calendar-nav {
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .calendar-grid {
          display: grid;
          grid-template-columns: repeat(7, 1fr);
          gap: 0.25rem;
        }

        .calendar-day {
          aspect-ratio: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.75rem;
          cursor: pointer;
          border-radius: 50%;
          transition: background-color 0.3s ease;
        }

        .calendar-day:hover {
          background-color: #f0f0f0;
        }

        .calendar-day.selected {
          background-color: #ff0000;
          color: white;
        }

        .calendar-day.today {
          border: 2px solid #ff0000;
        }

        .room-card {
          background: white;
          border-radius: 10px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
          padding: 1.5rem;
          margin-bottom: 1rem;
        }

        .room-title {
          font-size: 1.5rem;
          margin-bottom: 0.5rem;
        }

        .room-type {
          color: #666;
          margin-bottom: 1rem;
        }

        .room-stats {
          display: flex;
          justify-content: space-between;
          margin-top: 1rem;
        }

        .stat {
          text-align: center;
        }

        .stat-occupied {
          color: #f44336;
        }

        .stat-available {
          color: #4CAF50;
        }

        .stat-upcoming {
          color: #FFA000;
        }

        .quick-stats {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 1rem;
          margin-bottom: 1.5rem;
        }

        .stat-card {
          background: white;
          border-radius: 10px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
          padding: 1rem;
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .stat-icon {
          background: #f0f0f0;
          border-radius: 50%;
          padding: 0.5rem;
        }

        .stat-info h3 {
          font-size: 1.25rem;
          margin-bottom: 0.25rem;
        }

        .stat-info p {
          color: #666;
          margin: 0;
        }

        .upcoming-events {
          background: white;
          border-radius: 10px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
          padding: 1.5rem;
          margin-bottom: 1.5rem;
        }

        .upcoming-events h3 {
          font-size: 1.5rem;
          margin-bottom: 1rem;
        }

        .event-list {
          display: grid;
          gap: 1rem;
        }

        .event-item {
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 0.5rem;
          border-radius: 5px;
          background: #f9f9f9;
        }

        .event-icon {
          background: #ff0000;
          color: white;
          border-radius: 50%;
          padding: 0.5rem;
        }

        .event-info h4 {
          margin: 0;
          font-size: 1rem;
        }

        .event-info p {
          margin: 0;
          color: #666;
          font-size: 0.875rem;
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

          .room-status-grid {
            display: flex;
            flex-direction: column;
          }

          .calendar-container {
            margin-left: auto;
            margin-right: auto;
          }
        }
        
        @media (max-width: 768px) {
          .guest-details-container {
            padding: 60px 0.5rem 0.5rem;
          }

          .payment-card, .room-card, .calendar-container, .upcoming-events, .stat-card {
            border-radius: 0;
            margin-left: -0.5rem;
            margin-right: -0.5rem;
            width: calc(100% + 1rem);
          }
          
          .payment-content {
            padding: 1rem;
          }

          .review-info {
            grid-template-columns: 1fr;
          }

          .quick-stats {
            grid-template-columns: 1fr;
          }

          .calendar-container {
            max-width: 100%;
          }

          .calendar-day {
            font-size: 0.7rem;
          }

          .room-title {
            font-size: 1.25rem;
          }

          .room-type {
            font-size: 0.875rem;
          }

          .stat-info h3 {
            font-size: 1rem;
          }

          .stat-info p {
            font-size: 0.875rem;
          }

          .upcoming-events h3 {
            font-size: 1.25rem;
          }

          .event-info h4 {
            font-size: 0.875rem;
          }

          .event-info p {
            font-size: 0.75rem;
          }
        }

        @media (min-width: 1025px) {
          .room-status-grid {
            display: grid;
            grid-template-columns: 350px 1fr;
            gap: 1.5rem;
            align-items: start;
          }

          .calendar-container {
            margin-bottom: 0;
            position: sticky;
            top: 80px;
          }

          .room-cards-container {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 1rem;
          }
        }
      `}</style>
      
      <div className="container-fluid p-0">
        <div className="row g-0">
          <div className="col-12">
            <div className="quick-stats">
              <div className="stat-card">
                <div className="stat-icon">
                  <Users size={24} />
                </div>
                <div className="stat-info">
                  <h3>Total Guests</h3>
                  <p>42</p>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon">
                  <Bed size={24} />
                </div>
                <div className="stat-info">
                  <h3>Rooms Occupied</h3>
                  <p>18 / 30</p>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon">
                  <Calendar size={24} />
                </div>
                <div className="stat-info">
                  <h3>Reservations Today</h3>
                  <p>5</p>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon">
                  <Clock size={24} />
                </div>
                <div className="stat-info">
                  <h3>Avg. Stay Duration</h3>
                  <p>3.2 days</p>
                </div>
              </div>
            </div>

            <div className="room-status-grid">
              <div className="calendar-container">
                <div className="calendar-header">
                  <button onClick={prevMonth} className="btn btn-link text-decoration-none p-0">
                    <ChevronLeft size={20} />
                  </button>
                  <h2 className="calendar-title">{monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}</h2>
                  <button onClick={nextMonth} className="btn btn-link text-decoration-none p-0">
                    <ChevronRight size={20} />
                  </button>
                </div>
                <div className="calendar-grid">
                  {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map(day => (
                    <div key={day} className="calendar-day font-weight-bold">{day}</div>
                  ))}
                  {Array.from({ length: firstDayOfMonth }).map((_, index) => (
                    <div key={`empty-${index}`} className="calendar-day"></div>
                  ))}
                  {Array.from({ length: daysInMonth }).map((_, index) => {
                    const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), index + 1);
                    return (
                      <div
                        key={index}
                        className={`calendar-day ${isSelected(date) ? 'selected' : ''} ${isToday(date) ? 'today' : ''}`}
                        onClick={() => setSelectedDate(date)}
                      >
                        {index + 1}
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="room-cards-container">
                <div className="room-card">
                  <h3 className="room-title">Standard Rooms</h3>
                  <div className="room-type">Bed Type: Single Bed</div>
                  <div className="d-flex justify-content-between align-items-center">
                    <div className="room-stats">
                      <div className="stat  ">
                        <div className="stat-occupied">Occupied: 3</div>
                      </div>
                      <div className="stat">
                        <div className="stat-available">Available: 2</div>
                      </div>
                      <div className="stat">
                        <div className="stat-upcoming">Upcoming: 1</div>
                      </div>
                    </div>
                    <div>Total: 5</div>
                  </div>
                </div>

                <div className="room-card">
                  <h3 className="room-title">Deluxe Room</h3>
                  <div className="room-type">Bed Type: Double Bed</div>
                  <div className="d-flex justify-content-between align-items-center">
                    <div className="room-stats">
                      <div className="stat">
                        <div className="stat-occupied">Occupied: 1</div>
                      </div>
                      <div className="stat">
                        <div className="stat-available">Available: 1</div>
                      </div>
                      <div className="stat">
                        <div className="stat-upcoming">Upcoming: 0</div>
                      </div>
                    </div>
                    <div>Total: 2</div>
                  </div>
                </div>

                <div className="upcoming-events">
                  <h3>Upcoming Events</h3>
                  <div className="event-list">
                    <div className="event-item">
                      <div className="event-icon">
                        <Users size={20} />
                      </div>
                      <div className="event-info">
                        <h4>New Guest Check-in</h4>
                        <p>Room 101 - Standard Room</p>
                      </div>
                    </div>
                    <div className="event-item">
                      <div className="event-icon">
                        <Calendar size={20} />
                      </div>
                      <div className="event-info">
                        <h4>Room Maintenance</h4>
                        <p>Room 205 - Deluxe Room</p>
                      </div>
                    </div>
                    <div className="event-item">
                      <div className="event-icon">
                        <Clock size={20} />
                      </div>
                      <div className="event-info">
                        <h4>Late Check-out</h4>
                        <p>Room 303 - Standard Room</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoomStatus;

