import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase/config';
import { Container, Row, Col, Carousel, Button } from 'react-bootstrap';

const HotelDetails = () => {
  const [hotel, setHotel] = useState(null);
  const { id } = useParams();

  useEffect(() => {
    const fetchHotel = async () => {
      const docRef = doc(db, 'Hotels', id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setHotel({ id: docSnap.id, ...docSnap.data() });
      } else {
        console.log("No such document!");
      }
    };

    fetchHotel();
  }, [id]);

  if (!hotel) {
    return <div>Loading...</div>;
  }

  return (
    <Container>
      <h1>{hotel['Property Name']}</h1>
      <Row>
        <Col md={8}>
          <Carousel>
            {hotel['Property Images'].map((image, index) => (
              <Carousel.Item key={index}>
                <img
                  className="d-block w-100"
                  src={image}
                  alt={`Slide ${index}`}
                />
              </Carousel.Item>
            ))}
          </Carousel>
        </Col>
        <Col md={4}>
          <p>{hotel['Property Address']}</p>
          <p>Rating: {hotel.overallRating}</p>
          <Button variant="primary">Book Now</Button>
        </Col>
      </Row>
      {/* Add more details as needed */}
    </Container>
  );
};

export default HotelDetails;

