import React, { useState, useEffect } from 'react';
import { FaLocationDot, FaCheck, FaArrowUp, FaStar } from 'react-icons/fa6';

// Make sure to include Bootstrap 5 CSS in your project
// You can add this to your index.html or import it in your main JS file:
// import 'bootstrap/dist/css/bootstrap.min.css';

const HotelListing = () => {
  const [filters, setFilters] = useState({
    airConditioning: false,
    breakfastIncluded: false,
    parking: false,
    swimmingPool: false,
    balcony: false,
    freeCancellation: false,
  });

  const [showBackToTop, setShowBackToTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.pageYOffset > 300);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleFilterChange = (filterName) => {
    setFilters(prevFilters => ({
      ...prevFilters,
      [filterName]: !prevFilters[filterName]
    }));
  };

  const hotels = [
    {
      id: 1,
      name: 'Shubam hotel',
      address: 'Arunachala nagar, Tiruvannamalai',
      price: 470,
      originalPrice: 4999,
      rating: 5.2,
      reviewCount: 480,
      image: '/placeholder.svg?height=200&width=300',
    },
    // Add more sample hotels as needed
  ];

  return (
    <div className="container-fluid p-0">
      <Breadcrumb />
      <div className="container mt-4">
        <div className="row">
          <div className="col-lg-3">
            <Filters filters={filters} onFilterChange={handleFilterChange} />
          </div>
          <div className="col-lg-9">
            <SearchForm />
            <div className="mt-4">
              {hotels.map(hotel => (
                <HotelCard key={hotel.id} hotel={hotel} />
              ))}
            </div>
          </div>
        </div>
      </div>
      <BackToTopButton show={showBackToTop} />
    </div>
  );
};

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

const SearchForm = () => (
  <div className="bg-dark rounded p-4">
    <form>
      <div className="row g-3">
        <div className="col-md-3">
          <input type="text" className="form-control" placeholder="Enter destination" />
        </div>
        <div className="col-md-3">
          <input type="text" className="form-control" placeholder="Check-in - Check-out" />
        </div>
        <div className="col-md-3">
          <input type="text" className="form-control" placeholder="Adults, Children & Rooms" />
        </div>
        <div className="col-md-3">
          <button type="submit" className="btn btn-danger w-100">Search</button>
        </div>
      </div>
    </form>
  </div>
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
      {/* Add more filter sections as needed */}
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

const HotelCard = ({ hotel }) => (
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
          <button className="btn btn-danger">See availability</button>
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

