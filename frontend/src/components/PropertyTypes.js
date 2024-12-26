import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import './PropertyTypes.css'; // We'll create this CSS file

function PropertyTypes() {
  const propertyTypes = [
    { type: 'Apartments', image: '/assets/img/discover your property type/1.png' },
    { type: 'Hotels', image: '/assets/img/discover your property type/2.png' },
    { type: 'Villas', image: '/assets/img/discover your property type/3.png' },
    { type: 'Resorts', image: '/assets/img/discover your property type/4.png' },
    { type: 'Cabins', image: '/assets/img/discover your property type/5.png' },
  ];

  return (
    <Container className="property-types-container pt-3">
      <h3 className="text-dark">Discover Your property type</h3>
      <div className="property-types-scroll-container">
        <div className="property-types-card-container">
          {propertyTypes.map((property, index) => (
            <div key={index} className="property-types-card">
              <img src={property.image} alt={property.type} className="property-types-image" />
              <p className="property-types-title">{property.type}</p>
            </div>
          ))}
        </div>
      </div>
    </Container>
  );
}

export default PropertyTypes;

