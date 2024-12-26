import React from 'react';
import { Container, Button } from 'react-bootstrap';
import SearchForm from '../components/SearchForm';
import RecentSearches from '../components/RecentSearches';
import Offers from '../components/Offers';
import TrendingDestinations from '../components/TrendingDestinations';
import ExploreIndia from '../components/ExploreIndia';
import PropertyTypes from '../components/PropertyTypes';
import WhyBookWithUs from '../components/WhyBookWithUs';

function HomePage() {
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
        <RecentSearches />
        <Offers />
        <TrendingDestinations />
        <ExploreIndia />
        <PropertyTypes />
        <WhyBookWithUs />
      </Container>
    </>
  );
}

export default HomePage;

