import React from 'react';
import { Container } from 'react-bootstrap';
import './ExploreIndia.css'; // We'll create this CSS file

function ExploreIndia() {
  const cities = [
    { name: 'Bangalore', properties: 3458, image: '/assets/img/explore india/1.png' },
    { name: 'New Delhi', properties: 2657, image: '/assets/img/explore india/2.png' },
    { name: 'Kerala', properties: 3821, image: '/assets/img/explore india/3.png' },
    { name: 'Mumbai', properties: 1523, image: '/assets/img/explore india/4.png' },
    { name: 'Goa', properties: 4231, image: '/assets/img/explore india/5.png' },
    { name: 'Ooty', properties: 866, image: '/assets/img/explore india/6.png' },
  ];

  return (
    <Container className="explore-india-container pb-3">
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
    </Container>
  );
}

export default ExploreIndia;

