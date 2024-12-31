import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../firebase/config';
import { FaLocationDot, FaCheck, FaArrowUp } from 'react-icons/fa6';
import flatpickr from "flatpickr";
import "flatpickr/dist/flatpickr.min.css";

const HotelList = () => {
  const [hotels, setHotels] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  const [searchParams, setSearchParams] = useState({
    location: '',
    dates: '',
    guests: '',
    adults: 1,
    children: 0,
    rooms: 1
  });

  const [showGuestsDropdown, setShowGuestsDropdown] = useState(false);
  const datePickerRef = useRef(null);
  const guestsDropdownRef = useRef(null);
  const flatpickrInstance = useRef(null);

  useEffect(() => {
    fetchHotels();
    loadSessionData();
    return () => {
      if (flatpickrInstance.current) {
        flatpickrInstance.current.destroy();
      }
    };
  }, []);

  useEffect(() => {
    if (datePickerRef.current) {
      initializeFlatpickr();
    }
  }, [datePickerRef.current]);

  const fetchHotels = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const hotelsRef = collection(db, 'hotels');
      let q = query(hotelsRef);
      
      // Add filters based on searchParams if needed
      if (searchParams.location) {
        q = query(q, where('city', '==', searchParams.location));
      }
      
      const querySnapshot = await getDocs(q);
      
      if (querySnapshot.empty) {
        setError('No hotels found.');
        setHotels([]);
      } else {
        const hotelList = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setHotels(hotelList);
      }
    } catch (error) {
      console.error('Error fetching hotels:', error);
      setError('An error occurred while fetching hotels. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const initializeFlatpickr = () => {
    if (datePickerRef.current && !flatpickrInstance.current) {
      flatpickrInstance.current = flatpickr(datePickerRef.current, {
        mode: "range",
        dateFormat: "Y-m-d",
        minDate: "today",
        defaultDate: [new Date(), new Date(new Date().setDate(new Date().getDate() + 1))],
        onChange: (selectedDates) => {
          if (selectedDates.length === 2) {
            const [checkin, checkout] = selectedDates.map(date => date.toISOString().split('T')[0]);
            setSearchParams(prev => ({ ...prev, dates: `${checkin} - ${checkout}` }));
          }
        }
      });
    }
  };

  const loadSessionData = () => {
    const storedLocation = sessionStorage.getItem('location') || '';
    const storedCheckin = sessionStorage.getItem('checkin');
    const storedCheckout = sessionStorage.getItem('checkout');
    const storedAdults = parseInt(sessionStorage.getItem('adults') || '1');
    const storedChildren = parseInt(sessionStorage.getItem('children') || '0');
    const storedRooms = parseInt(sessionStorage.getItem('rooms') || '1');

    setSearchParams({
      location: storedLocation,
      dates: storedCheckin && storedCheckout ? `${storedCheckin} - ${storedCheckout}` : '',
      guests: `${storedAdults} Adults, ${storedChildren} Children, ${storedRooms} Rooms`,
      adults: storedAdults,
      children: storedChildren,
      rooms: storedRooms
    });

    if (storedCheckin && storedCheckout && flatpickrInstance.current) {
      flatpickrInstance.current.setDate([new Date(storedCheckin), new Date(storedCheckout)]);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSearchParams(prev => ({ ...prev, [name]: value }));
  };

  const handleGuestsClick = () => {
    setShowGuestsDropdown(!showGuestsDropdown);
  };

  const updateGuests = () => {
    const { adults, children, rooms } = searchParams;
    setSearchParams(prev => ({
      ...prev,
      guests: `${adults} Adults, ${children} Children, ${rooms} Rooms`
    }));
  };

  const incrementValue = (field) => {
    setSearchParams(prev => {
      const newValue = prev[field] + 1;
      const maxValues = { adults: 30, children: 10, rooms: 30 };
      return { ...prev, [field]: Math.min(newValue, maxValues[field]) };
    });
    updateGuests();
  };

  const decrementValue = (field) => {
    setSearchParams(prev => {
      const newValue = prev[field] - 1;
      const minValues = { adults: 1, children: 0, rooms: 1 };
      return { ...prev, [field]: Math.max(newValue, minValues[field]) };
    });
    updateGuests();
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const { location, dates, adults, children, rooms } = searchParams;
    const [checkIn, checkOut] = dates.split(' - ');
    
    const params = new URLSearchParams({
      location,
      checkIn,
      checkOut,
      guests: `${adults + children}`,
      rooms: rooms.toString()
    });
    
    navigate(`/hotels?${params.toString()}`);
    fetchHotels(); // Re-fetch hotels based on new search criteria
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (guestsDropdownRef.current && !guestsDropdownRef.current.contains(event.target)) {
        setShowGuestsDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  if (isLoading) {
    return <div className="container mt-5 text-center">Loading hotels...</div>;
  }

  if (error) {
    return <div className="container mt-5 text-center text-danger">{error}</div>;
  }

  return (
    <div className="container-fluid p-0">
      <div className="container bg-dark custom-container rounded mt-4" id="move2">
        <div className="container py-3">
          <form id="bookingForm" onSubmit={handleSubmit}>
            <div className="row g-2 align-items-center">
              <div className="col-lg">
                <input 
                  type="text" 
                  className="form-control" 
                  id="location" 
                  name="location" 
                  placeholder="Enter destination" 
                  required
                  value={searchParams.location}
                  onChange={handleInputChange}
                  style={{ height: "50px" }} 
                />
              </div>
              <div className="col-lg">
                <input 
                  type="text" 
                  className="form-control" 
                  id="dates" 
                  name="dates" 
                  placeholder="Check-in - Check-out" 
                  required
                  value={searchParams.dates}
                  ref={datePickerRef}
                  style={{ height: "50px" }} 
                />
              </div>
              <div className="col-lg">
                <div ref={guestsDropdownRef}>
                  <input 
                    type="text" 
                    className="form-control" 
                    id="guests" 
                    name="guests" 
                    placeholder="Adults, Children & Rooms" 
                    required
                    value={searchParams.guests}
                    onClick={handleGuestsClick}
                    readOnly 
                    style={{ height: "50px" }} 
                  />
                  {showGuestsDropdown && (
                    <div className="dropdown-menu show p-3" id="guestsDropdown">
                      <div className="form-group">
                        <label htmlFor="adults">Adults</label>
                        <div className="input-group">
                          <button className="btn btn-outline-secondary" type="button" onClick={() => decrementValue('adults')} style={{backgroundColor: searchParams.adults > 1 ? 'red' : 'gray', color: 'white'}}>-</button>
                          <input type="number" className="form-control" id="adults" value={searchParams.adults} readOnly />
                          <button className="btn btn-outline-secondary" type="button" onClick={() => incrementValue('adults')} style={{backgroundColor: searchParams.adults >= 30 ? 'gray' : 'red', color: 'white'}}>+</button>
                        </div>
                      </div>
                      <div className="form-group">
                        <label htmlFor="children">Children</label>
                        <div className="input-group">
                          <button className="btn btn-outline-secondary" type="button" onClick={() => decrementValue('children')} style={{backgroundColor: searchParams.children > 0 ? 'red' : 'gray', color: 'white'}}>-</button>
                          <input type="number" className="form-control" id="children" value={searchParams.children} readOnly />
                          <button className="btn btn-outline-secondary" type="button" onClick={() => incrementValue('children')} style={{backgroundColor: searchParams.children >= 10 ? 'gray' : 'red', color: 'white'}}>+</button>
                        </div>
                      </div>
                      <div className="form-group">
                        <label htmlFor="rooms">Rooms</label>
                        <div className="input-group">
                          <button className="btn btn-outline-secondary" type="button" onClick={() => decrementValue('rooms')} style={{backgroundColor: searchParams.rooms > 1 ? 'red' : 'gray', color: 'white'}}>-</button>
                          <input type="number" className="form-control" id="rooms" value={searchParams.rooms} readOnly />
                          <button className="btn btn-outline-secondary" type="button" onClick={() => incrementValue('rooms')} style={{backgroundColor: searchParams.rooms >= 30 ? 'gray' : 'red', color: 'white'}}>+</button>
                        </div>
                      </div>
                      <button className="btn btn-primary mt-3" onClick={() => setShowGuestsDropdown(false)}>Done</button>
                    </div>
                  )}
                </div>
              </div>
              <div className="col-lg-auto">
                <button type="submit" className="btn text-light w-100" id="search" style={{backgroundColor: "#FF1717", height: "50px"}}>Search</button>
              </div>
            </div>
          </form>
        </div>
      </div>

      <div className="bg-white border-bottom mt-4">
        <div className="container py-2">
          <div className="d-flex justify-content-between align-items-center">
            <h5 className="mb-0">
              {searchParams.location || 'All Locations'} / 
              {searchParams.dates.split(' - ')[0] || 'Check-in'} - 
              {searchParams.dates.split(' - ')[1] || 'Check-out'}
            </h5>
          </div>
        </div>
      </div>

      <div className="container mt-3">
        <div className="row">
          {hotels.map((hotel) => (
            <div key={hotel.id} className="col-12 mb-3">
              <div className="card shadow-0 border rounded-3 shadow-sm">
                <div className="card-body">
                  <div className="row">
                    <div className="col-12 col-md-4 col-lg-3 mb-4 mb-lg-0 d-flex justify-content-center align-items-center">
                      <div className="bg-image hover-zoom ripple rounded ripple-surface w-100 h-100 d-flex justify-content-center align-items-center">
                        <img src={hotel.hotelImages[0]} alt={hotel.hotelName} className="img-fluid rounded object-fit-cover" style={{maxWidth: '100%', height: 'auto'}} />
                      </div>
                    </div>
                    <div className="col-12 col-md-5 col-lg-6">
                      <h5>{hotel.hotelName}</h5>
                      <div className="mt-1 mb-0 text-muted small">
                        <div className="textright">
                          <FaLocationDot style={{color: 'red'}} />
                          <span>{hotel.hotelAddress}</span>
                        </div>
                      </div>
                      <div className="mb-2 text-muted small">
                        <FaCheck style={{color: 'red'}} />
                        <span>24-room service</span>
                      </div>
                      <div className="d-flex flex-row align-items-center mb-1">
                        <span className="pe-2 text-secondary"><s>₹{Math.round(hotel.roomPrice * 1.2)}</s></span>
                        <h4 className="mb-1 me-1">₹{hotel.roomPrice}</h4>
                      </div>
                      <p style={{fontSize: '15px'}}>+ ₹{Math.round(hotel.roomPrice * 0.18)} TAXES & FEES</p>
                      <button className="btn text-light btn-sm" style={{width: '126px', backgroundColor: 'red'}} type="button">See availability</button>
                    </div>
                    <div className="col-12 col-md-3 col-lg-3 border-sm-start-none">
                      <div className="d-flex justify-content-end">
                        <div className="align-items-end">
                          <h4 className="text-danger mt-2 ps-4 me-2 text-end" style={{fontSize: '16px'}}>Good <br />
                            <span className="" style={{fontSize: '12px', color: 'gray'}}>{hotel.reviewCount} reviews</span>
                          </h4>
                        </div>
                        <div className="right rounded-1">
                          <div style={{fontSize:'15px'}}><b>{hotel.rating.toFixed(1)}</b></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <button id="backToTop" className="btn" style={{backgroundColor: "#ff0000", position: "fixed", bottom: "90px", right: "40px", display: "none", zIndex: 100}} onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
        <FaArrowUp className="text-light" />
      </button>
    </div>
  );
};

export default HotelList;

