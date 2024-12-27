import React from 'react';
import { Container, Row, Col, Button, Card } from 'react-bootstrap';
import SearchForm from '../components/SearchForm';
import './HomePage.css';

function HomePage() {
  const cities = [
    { name: 'Bangalore', properties: 3458, image: '/assets/img/explore india/1.png' },
    { name: 'New Delhi', properties: 2657, image: '/assets/img/explore india/2.png' },
    { name: 'Kerala', properties: 3821, image: '/assets/img/explore india/3.png' },
    { name: 'Mumbai', properties: 1523, image: '/assets/img/explore india/4.png' },
    { name: 'Goa', properties: 4231, image: '/assets/img/explore india/5.png' },
    { name: 'Ooty', properties: 866, image: '/assets/img/explore india/6.png' },
  ];

  const propertyTypes = [
    { type: 'Apartments', image: '/assets/img/discover your property type/1.png' },
    { type: 'Hotels', image: '/assets/img/discover your property type/2.png' },
    { type: 'Villas', image: '/assets/img/discover your property type/3.png' },
    { type: 'Resorts', image: '/assets/img/discover your property type/4.png' },
    { type: 'Cabins', image: '/assets/img/discover your property type/5.png' },
  ];

  const reasons = [
    {
      title: 'Convenience and Accessibility',
      description: '24/7 Availability Booking apps allow users to make reservations or appointments at any time, without being restricted to business hours.',
      icon: '/assets/img/index page icons footer/Frame 402.jpg'
    },
    {
      title: 'Time-Saving',
      description: 'Instant Confirmation Many booking websites provide instant confirmation of bookings, reducing uncertainty and the need for follow-up communication.',
      icon: '/assets/img/index page icons footer/Frame 403.jpg'
    },
    {
      title: 'Reviews and Ratings',
      description: 'User Reviews Access to reviews and ratings from other customers provides insights into the quality and service of accommodations and travel services.',
      icon: '/assets/img/index page icons footer/Frame 404.jpg'
    },
    {
      title: 'User-Friendly Interfaces',
      description: 'Intuitive platforms that simplify the booking process, often with step-by-step guidance.',
      icon: '/assets/img/index page icons footer/Frame 405.jpg'
    }
  ];

  return (
    <>
      <div className="hero-section" style={{backgroundImage: "url('/assets/img/Rectangle 377.jpg')"}}>
        <Container className="py-5">
          <h1 className="display-5 fw-bold text-light">Pack the whole toybox</h1>
          <p className="col-md-8 fs-4 text-light">Unwind and stretch out in a vacation home</p>
          <Button variant="danger">Discover Vacation Rentals</Button>
        </Container>
      </div>
      <SearchForm />
      <Container>
        {/* Recent Searches */}
        <div className="recent-search pb-3">
          <h3 className="text-dark">Your recent searches</h3>
          <Row>
            <Col md={5}>
              <Card className="d-flex flex-row p-3 bg-light rounded-3 shadow">
                <Card.Img src="/assets/img/tiruvannamalai.jpg" className="recent-search-img rounded-3" />
                <Card.Body>
                  <Card.Title><b>Tiruvannamalai</b></Card.Title>
                  <Card.Text>May 16-May 17, 2 People</Card.Text>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </div>

        {/* Offers */}
        <div className="offers pb-3">
          <h3 className="text-dark">Offers</h3>
          <p className="text-dark">Promotions, deals, and special offers for you</p>
          <Row>
            <Col md={6}>
              <Card className="mb-3">
                <Row noGutters>
                  <Col md={4}>
                    <Card.Img src="/assets/img/offer index/Rectangle 387 (2).png" className="h-100" />
                  </Col>
                  <Col md={8}>
                    <Card.Body>
                      <Card.Title>We have Family-Special Theme Park Packages for You....</Card.Title>
                      <Card.Text>Book with us & enjoy limitless fun this summer.</Card.Text>
                      <Button variant="danger">Explore Now</Button>
                    </Card.Body>
                  </Col>
                </Row>
              </Card>
            </Col>
            <Col md={6}>
              <Card className="bg-dark text-white">
                <Card.Img src="/assets/img/offer index/Rectangle 388.png" alt="Card image" style={{ height: '200px', objectFit: 'cover' }} />
                <Card.ImgOverlay>
                  <Card.Title>Presenting Long Weekend Homestays Mania:</Card.Title>
                  <Card.Text>Grab up to 30% OFF* on homestays, for wow stays this long weekend</Card.Text>
                  <Button variant="danger">Book Now</Button>
                </Card.ImgOverlay>
              </Card>
            </Col>
          </Row>
        </div>

        {/* Trending Destinations */}
        <div className="trending-destinations pb-3">
          <h3 className="text-dark">Trending destinations</h3>
          <p className="text-dark">Travelers searching for India also booked these</p>
          <Row>
            <Col md={6} className="mb-4">
              <div className="image-container">
                <img src="/assets/img/tending destinations/Kodaikanal 1.jpg" alt="Kodaikanal" className="img-fluid rounded" />
                <div className="overlay-text"><b>Kodaikanal</b></div>
              </div>
            </Col>
            <Col md={6} className="mb-4">
              <div className="image-container">
                <img src="/assets/img/tending destinations/ADIYOGI TEMPLE, COIMBATORE INDIA 1 (1).jpg" alt="Coimbatore" className="img-fluid rounded" />
                <div className="overlay-text"><b>Coimbatore</b></div>
              </div>
            </Col>
            <Col md={4} className="mb-4">
              <div className="image-container">
                <img src="/assets/img/tending destinations/30 Fascinating Things To Do In Bangalore 2.png" alt="Bangalore" className="img-fluid rounded" />
                <div className="overlay-text"><b>Bangalore</b></div>
              </div>
            </Col>
            <Col md={4} className="mb-4">
              <div className="image-container">
                <img src="/assets/img/tending destinations/Cochin 3.png" alt="Kerala" className="img-fluid rounded" />
                <div className="overlay-text"><b>Kerala</b></div>
              </div>
            </Col>
            <Col md={4} className="mb-4">
              <div className="image-container">
                <img src="/assets/img/tending destinations/THE ROYAL ABODE - MYSORE _ best places to visit in india 2.png" alt="Mysore" className="img-fluid rounded" />
                <div className="overlay-text"><b>Mysore</b></div>
              </div>
            </Col>
          </Row>
        </div>

        {/* Explore India */}
        <div className="explore-india pb-3">
          <h3 className="text-dark">Explore India</h3>
          <p className="text-dark">These popular destinations have a lot to offer</p>
          <div className="explore-india-scroll-container">
            <div className="explore-india-card-container">
              {cities.map((city, index) => (
                <div key={index} className="explore-india-card">
                  <img src={city.image} alt={city.name} className="explore-india-image" />
                  <div className="explore-india-info">
                    <p className="explore-india-city"><b>{city.name}</b></p>
                    <p className="explore-india-properties">{city.properties} properties</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Property Types */}
        <div className="property-types pt-3">
          <h3 className="text-dark">Discover Your property type</h3>
          <Row className="row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-5 g-4">
            {propertyTypes.map((property, index) => (
              <Col key={index} className="p-3">
                <Card style={{ border: 'none' }}>
                  <Card.Img variant="top" src={property.image} />
                  <Card.Title className="text-center p-1">{property.type}</Card.Title>
                </Card>
              </Col>
            ))}
          </Row>
        </div>

        {/* Why Book With Us */}
        <div className="why-book-with-us my-5">
          <h1 className="text-center pt-3">Why Book Hotels with YSpot.app?</h1>
          <Row className="justify-content-center align-items-stretch">
            {reasons.map((reason, index) => (
              <Col key={index} xs={12} lg={3} md={6} className="pb-4">
                <Card className="text-center border-danger h-100">
                  <div className="card-img-wrapper">
                    <Card.Img variant="top" src={reason.icon} alt={reason.title} className="card-img-circle" />
                  </div>
                  <Card.Body>
                    <Card.Title><b>{reason.title}</b></Card.Title>
                    <Card.Text>{reason.description}</Card.Text>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </div>
      </Container>
    </>
  );
}

export default HomePage;

