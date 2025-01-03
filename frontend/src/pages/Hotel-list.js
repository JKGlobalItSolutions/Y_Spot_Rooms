import React, { useState, useEffect, useRef } from 'react';
import { FaLocationDot, FaCheck, FaArrowUp } from 'react-icons/fa6';
import { useNavigate } from 'react-router-dom';
import flatpickr from "flatpickr";
import "flatpickr/dist/flatpickr.min.css";

const HotelListing = () => {
  const navigate = useNavigate();
  const [filters, setFilters] = useState({
    airConditioning: false,
    breakfastIncluded: false,
    parking: false,
    swimmingPool: false,
    balcony: false,
    freeCancellation: false,
  });

  const [showBackToTop, setShowBackToTop] = useState(false);
  const [location, setLocation] = useState('Tiruvannamalai');
  const [dates, setDates] = useState('');
  const [guests, setGuests] = useState('1 Adults, 0 Children, 1 Rooms');
  const [showGuestsDropdown, setShowGuestsDropdown] = useState(false);
  const [adults, setAdults] = useState(1);
  const [children, setChildren] = useState(0);
  const [rooms, setRooms] = useState(1);
  const datePickerRef = useRef(null);
  const guestsDropdownRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.pageYOffset > 300);
    };

    window.addEventListener('scroll', handleScroll);

    // Initialize Flatpickr
    const fp = flatpickr(datePickerRef.current, {
      mode: "range",
      dateFormat: "Y-m-d",
      minDate: "today",
      defaultDate: [new Date(), new Date(new Date().setDate(new Date().getDate() + 1))],
      onChange: (selectedDates) => {
        if (selectedDates.length === 2) {
          const [checkin, checkout] = selectedDates.map(date => date.toISOString().split('T')[0]);
          setDates(`${checkin} - ${checkout}`);
        }
      }
    });

    // Close dropdown when clicking outside
    const handleClickOutside = (event) => {
      if (guestsDropdownRef.current && !guestsDropdownRef.current.contains(event.target)) {
        setShowGuestsDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleFilterChange = (filterName) => {
    setFilters(prevFilters => ({
      ...prevFilters,
      [filterName]: !prevFilters[filterName]
    }));
  };

  const updateGuests = (a, c, r) => {
    setGuests(`${a} Adults, ${c} Children, ${r} Rooms`);
  };

  const handleGuestsClick = () => {
    setShowGuestsDropdown(!showGuestsDropdown);
  };

  const incrementValue = (setter, value, maxValue) => {
    if (value < maxValue) {
      setter(value + 1);
    }
  };

  const decrementValue = (setter, value, minValue) => {
    if (value > minValue) {
      setter(value - 1);
    }
  };

  const handleDone = () => {
    setShowGuestsDropdown(false);
    updateGuests(adults, children, rooms);
  };

  const handleSeeAvailability = (hotelId) => {
    navigate(`/hotel-details/${hotelId}`);
  };

  const hotels = [
    {
      id: 1,
      name: 'dhakshuhotels',
      address: 'nethaji nagar tiruvannamalai',
      price: 470,
      originalPrice: 3699,
      rating: 5.2,
      reviewCount: 480,
      image: '/placeholder.svg?height=200&width=300',
    },
    {
      id: 2,
      name: 'Hotel Trishul',
      address: 'Car Street, Tiruvannamalai',
      price: 599,
      originalPrice: 4299,
      rating: 4.8,
      reviewCount: 320,
      image: '/placeholder.svg?height=200&width=300',
    },
    {
      id: 3,
      name: 'Hotel Arunachala',
      address: 'Temple View Road, Tiruvannamalai',
      price: 750,
      originalPrice: 5499,
      rating: 4.9,
      reviewCount: 560,
      image: '/placeholder.svg?height=200&width=300',
    }
  ];

  return (
    <div className="container-fluid px-5 pb-5 pt-3 bg-light">
      <SearchForm
        location={location}
        setLocation={setLocation}
        dates={dates}
        guests={guests}
        datePickerRef={datePickerRef}
        handleGuestsClick={handleGuestsClick}
        showGuestsDropdown={showGuestsDropdown}
        guestsDropdownRef={guestsDropdownRef}
        adults={adults}
        children={children}
        rooms={rooms}
        incrementValue={incrementValue}
        decrementValue={decrementValue}
        setAdults={setAdults}
        setChildren={setChildren}
        setRooms={setRooms}
        handleDone={handleDone}
      />
      <Breadcrumb />
      <div className="container mt-4">
        <div className="row">
          <div className="col-lg-3">
            <Filters filters={filters} onFilterChange={handleFilterChange} />
          </div>
          <div className="col-lg-9">
            <div className="mt-4">
              {hotels.map(hotel => (
                <HotelCard 
                  key={hotel.id} 
                  hotel={hotel} 
                  onSeeAvailability={() => handleSeeAvailability(hotel.id)}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
      <BackToTopButton show={showBackToTop} />
    </div>
  );
};

const SearchForm = ({
  location,
  setLocation,
  dates,
  guests,
  datePickerRef,
  handleGuestsClick,
  showGuestsDropdown,
  guestsDropdownRef,
  adults,
  children,
  rooms,
  incrementValue,
  decrementValue,
  setAdults,
  setChildren,
  setRooms,
  handleDone
}) => (
  <div className="bg-black p-4">
    <div className="container">
      <div className="row g-2">
        <div className="col-md-3">
          <input 
            type="text" 
            className="form-control form-control-lg" 
            placeholder="Enter destination"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          />
        </div>
        <div className="col-md-3">
          <input 
            type="text" 
            className="form-control form-control-lg" 
            placeholder="Check-in - Check-out"
            value={dates}
            ref={datePickerRef}
            readOnly
          />
        </div>
        <div className="col-md-4">
          <div ref={guestsDropdownRef}>
            <input 
              type="text" 
              className="form-control form-control-lg" 
              placeholder="Adults, Children & Rooms" 
              value={guests}
              onClick={handleGuestsClick}
              readOnly
            />
            {showGuestsDropdown && (
              <div className="dropdown-menu show p-3" id="guestsDropdown">
                <div className="form-group">
                  <label htmlFor="adults">Adults</label>
                  <div className="input-group">
                    <button className="btn btn-outline-secondary" type="button" onClick={() => decrementValue(setAdults, adults, 1)} style={{backgroundColor: adults > 1 ? 'red' : 'gray', color: 'white'}}>-</button>
                    <input type="number" className="form-control" id="adults" value={adults} readOnly />
                    <button className="btn btn-outline-secondary" type="button" onClick={() => incrementValue(setAdults, adults, 30)} style={{backgroundColor: adults >= 30 ? 'gray' : 'red', color: 'white'}}>+</button>
                  </div>
                </div>
                <div className="form-group">
                  <label htmlFor="children">Children</label>
                  <div className="input-group">
                    <button className="btn btn-outline-secondary" type="button" onClick={() => decrementValue(setChildren, children, 0)} style={{backgroundColor: children > 0 ? 'red' : 'gray', color: 'white'}}>-</button>
                    <input type="number" className="form-control" id="children" value={children} readOnly />
                    <button className="btn btn-outline-secondary" type="button" onClick={() => incrementValue(setChildren, children, 10)} style={{backgroundColor: children >= 10 ? 'gray' : 'red', color: 'white'}}>+</button>
                  </div>
                </div>
                <div className="form-group">
                  <label htmlFor="rooms">Rooms</label>
                  <div className="input-group">
                    <button className="btn btn-outline-secondary" type="button" onClick={() => decrementValue(setRooms, rooms, 1)} style={{backgroundColor: rooms > 1 ? 'red' : 'gray', color: 'white'}}>-</button>
                    <input type="number" className="form-control" id="rooms" value={rooms} readOnly />
                    <button className="btn btn-outline-secondary" type="button" onClick={() => incrementValue(setRooms, rooms, 30)} style={{backgroundColor: rooms >= 30 ? 'gray' : 'red', color: 'white'}}>+</button>
                  </div>
                </div>
                <button className="btn btn-primary mt-3" onClick={handleDone}>Done</button>
              </div>
            )}
          </div>
        </div>
        <div className="col-md-2">
          <button 
            type="submit" 
            className="btn btn-danger btn-lg w-100 fw-bold"
          >
            Search
          </button>
        </div>
      </div>
    </div>
  </div>
);

const Breadcrumb = () => (
  <nav aria-label="breadcrumb" className="bg-light py-2">
    <div className="container">
      <ol className="breadcrumb mb-0">
        <li className="breadcrumb-item"><a href="/" className="text-decoration-none text-danger">Home</a></li>
        <li className="breadcrumb-item"><a href="/tamil-nadu" className="text-decoration-none text-danger">Tamil Nadu</a></li>
        <li className="breadcrumb-item active" aria-current="page">Tiruvannamalai</li>
      </ol>
    </div>
  </nav>
);

const Filters = ({ filters, onFilterChange }) => (
  <div className="card">
    <div className="card-body">
      <h5 className="card-title">Select Filters</h5>
      <FilterSection title="Recommended for you">
        <FilterCheckbox
          label="Air conditioning"
          checked={filters.airConditioning}
          onChange={() => onFilterChange('airConditioning')}
        />
        <FilterCheckbox
          label="Breakfast included"
          checked={filters.breakfastIncluded}
          onChange={() => onFilterChange('breakfastIncluded')}
        />
        <FilterCheckbox
          label="Parking"
          checked={filters.parking}
          onChange={() => onFilterChange('parking')}
        />
        <FilterCheckbox
          label="Swimming Pool"
          checked={filters.swimmingPool}
          onChange={() => onFilterChange('swimmingPool')}
        />
        <FilterCheckbox
          label="Balcony"
          checked={filters.balcony}
          onChange={() => onFilterChange('balcony')}
        />
        <FilterCheckbox
          label="Free cancellation"
          checked={filters.freeCancellation}
          onChange={() => onFilterChange('freeCancellation')}
        />
      </FilterSection>
      <FilterSection title="Price per night">
        <FilterCheckbox label="₹0 - ₹2000" />
        <FilterCheckbox label="₹2000 - ₹3000" />
        <FilterCheckbox label="₹3000 - ₹6000" />
        <FilterCheckbox label="₹6000 - ₹9000" />
        <FilterCheckbox label="₹9000 - ₹12000" />
        <FilterCheckbox label="₹12000 - ₹15000" />
      </FilterSection>
      <FilterSection title="Star Rating">
        <FilterCheckbox label="5 Star" />
        <FilterCheckbox label="4 Star" />
        <FilterCheckbox label="3 Star" />
        <FilterCheckbox label="2 Star" />
        <FilterCheckbox label="1 Star" />
      </FilterSection>
      <FilterSection title="Property Type">
        <FilterCheckbox label="Hotel" />
        <FilterCheckbox label="Resort" />
        <FilterCheckbox label="Homestay" />
        <FilterCheckbox label="Villa" />
        <FilterCheckbox label="Apartment" />
      </FilterSection>
    </div>
  </div>
);

const FilterSection = ({ title, children }) => (
  <div className="mb-3">
    <h6 className="mb-2">{title}</h6>
    {children}
  </div>
);

const FilterCheckbox = ({ label, checked, onChange }) => (
  <div className="form-check">
    <input
      className="form-check-input"
      type="checkbox"
      checked={checked}
      onChange={onChange}
      id={label}
    />
    <label className="form-check-label" htmlFor={label}>
      {label}
    </label>
  </div>
);

const HotelCard = ({ hotel, onSeeAvailability }) => (
  <div className="card mb-4 shadow-sm">
    <div className="row g-0">
      <div className="col-md-4">
        <img src={hotel.image} className="img-fluid rounded-start h-100 object-fit-cover" alt={hotel.name} />
      </div>
      <div className="col-md-5">
        <div className="card-body">
          <h5 className="card-title">{hotel.name}</h5>
          <p className="card-text">
            <small className="text-muted">
              <FaLocationDot className="text-danger me-1" />
              {hotel.address}
            </small>
          </p>
          <p className="card-text">
            <small className="text-muted">
              <FaCheck className="text-danger me-1" />
              24-hour room service
            </small>
          </p>
          <p className="card-text">
            <small className="text-muted text-decoration-line-through me-2">₹{hotel.originalPrice}</small>
            <span className="fs-4 fw-bold">₹{hotel.price}</span>
          </p>
          <p className="card-text">
            <small className="text-muted">+ ₹{Math.round(hotel.price * 0.18)} TAXES & FEES</small>
          </p>
          <button className="btn btn-danger" onClick={onSeeAvailability}>
            See availability
          </button>
        </div>
      </div>
      <div className="col-md-3">
        <div className="card-body d-flex flex-column justify-content-between h-100">
          <div className="d-flex justify-content-end align-items-center">
            <div className="text-end me-2">
              <div className="text-danger fw-bold">Good</div>
              <small className="text-muted">{hotel.reviewCount} reviews</small>
            </div>
            <div className="bg-danger text-white px-2 py-1 rounded">
              {hotel.rating.toFixed(1)}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

const BackToTopButton = ({ show }) => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <button
      className={`btn btn-danger rounded-circle position-fixed bottom-0 end-0 m-4 ${show ? 'd-block' : 'd-none'}`}
      onClick={scrollToTop}
      style={{ width: '50px', height: '50px' }}
    >
      <FaArrowUp />
    </button>
  );
};

export default HotelListing;