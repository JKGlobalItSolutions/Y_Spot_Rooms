import React, { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase/config';

const MapScreen = () => {
  const [hotels, setHotels] = useState([]);
  const [map, setMap] = useState(null);

  useEffect(() => {
    const fetchHotels = async () => {
      const hotelsCollection = collection(db, 'Hotels');
      const hotelSnapshot = await getDocs(hotelsCollection);
      const hotelList = hotelSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setHotels(hotelList);
    };

    fetchHotels();
  }, []);

  useEffect(() => {
    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyAba8Pvzm4uXVQs3VKdlqW-JqavRU1yIEs&callback=initMap`;
    script.async = true;
    document.body.appendChild(script);

    window.initMap = () => {
      const mapInstance = new window.google.maps.Map(document.getElementById("map"), {
        center: { lat: 12.2253, lng: 79.0747 },
        zoom: 10,
      });
      setMap(mapInstance);
    };

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  useEffect(() => {
    if (map && hotels.length > 0) {
      hotels.forEach((hotel) => {
        new window.google.maps.Marker({
          position: { lat: hotel.latitude, lng: hotel.longitude },
          map: map,
          title: hotel['Property Name'],
        });
      });
    }
  }, [map, hotels]);

  return <div id="map" style={{ width: '100%', height: '400px' }}></div>;
};

export default MapScreen;

