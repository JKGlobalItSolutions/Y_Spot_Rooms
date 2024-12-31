import React, { useState, useEffect } from 'react';
import { collection, doc, getDocs, setDoc, deleteDoc, updateDoc, getDoc } from 'firebase/firestore';
import { auth, db } from '../firebase/config';

const RoomManagement = () => {
  const [rooms, setRooms] = useState([]);
  const [formData, setFormData] = useState({
    totalRooms: '',
    PerNightPrice: '',
    bedType: '',
    roomType: '',
    PerAdultPrice: '',
    PerChildPrice: '',
    Discount: '',
    MaxGuestsAllow: '',
    RoomSize: '',
    accommodationFacilities: [],
    availability: false
  });

  useEffect(() => {
    const fetchRooms = async () => {
      if (auth.currentUser) {
        const hotelId = auth.currentUser.uid;
        const roomsCollection = collection(db, 'hotels', hotelId, 'rooms');
        const roomsSnapshot = await getDocs(roomsCollection);
        const roomsList = roomsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setRooms(roomsList);
      }
    };

    fetchRooms();
  }, []);

  const handleInputChange = (e, index) => {
    const { name, value } = e.target;
    const updatedRooms = [...rooms];
    updatedRooms[index] = {
      ...updatedRooms[index],
      [name]: value
    };
    setRooms(updatedRooms);
  };

  const handleFacilitySelect = (e, index) => {
    const value = e.target.value;
    if (value && !rooms[index].accommodationFacilities?.includes(value)) {
      const updatedRooms = [...rooms];
      updatedRooms[index] = {
        ...updatedRooms[index],
        accommodationFacilities: [...(updatedRooms[index].accommodationFacilities || []), value]
      };
      setRooms(updatedRooms);
    }
  };

  const handleFacilityRemove = (facility, index) => {
    const updatedRooms = [...rooms];
    updatedRooms[index] = {
      ...updatedRooms[index],
      accommodationFacilities: updatedRooms[index].accommodationFacilities.filter(f => f !== facility)
    };
    setRooms(updatedRooms);
  };

  const handleAvailabilityChange = (e, index) => {
    const updatedRooms = [...rooms];
    updatedRooms[index] = {
      ...updatedRooms[index],
      availability: e.target.checked
    };
    setRooms(updatedRooms);
  };

  const handleSubmit = async (e, index) => {
    e.preventDefault();
    const room = rooms[index];
    const hotelId = auth.currentUser.uid;
    const roomRef = doc(db, 'hotels', hotelId, 'rooms', room.id || doc(collection(db, 'hotels', hotelId, 'rooms')).id);

    const totalMaxGuests = parseInt(room.totalRooms) * parseInt(room.MaxGuestsAllow);

    try {
      await setDoc(roomRef, {
        ...room,
        PerNightPrice: parseFloat(room.PerNightPrice),
        totalMaxGuests
      }, { merge: true });

      const hotelRef = doc(db, 'hotels', hotelId);
      const hotelDoc = await getDoc(hotelRef);
      const hotelData = hotelDoc.data() || {};
      const existingMaxGuests = hotelData.totalMaxGuests || 0;
      const updatedMaxGuests = existingMaxGuests + totalMaxGuests;

      await updateDoc(hotelRef, { totalMaxGuests: updatedMaxGuests });

      alert('Room details saved successfully');
      // Refresh the rooms list
      const roomsCollection = collection(db, 'hotels', hotelId, 'rooms');
      const roomsSnapshot = await getDocs(roomsCollection);
      const roomsList = roomsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setRooms(roomsList);
    } catch (error) {
      console.error('Error saving room details:', error);
      alert('Failed to save room details');
    }
  };

  const addRoom = () => {
    setRooms([...rooms, { ...formData }]);
  };

  const removeRoom = async (index) => {
    if (rooms.length > 1) {
      const roomToDelete = rooms[index];
      const hotelId = auth.currentUser.uid;

      if (roomToDelete.id) {
        try {
          const roomRef = doc(db, 'hotels', hotelId, 'rooms', roomToDelete.id);
          await deleteDoc(roomRef);

          const hotelRef = doc(db, 'hotels', hotelId);
          const hotelDoc = await getDoc(hotelRef);
          const hotelData = hotelDoc.data() || {};
          const existingMaxGuests = hotelData.totalMaxGuests || 0;
          const updatedMaxGuests = existingMaxGuests - (roomToDelete.totalMaxGuests || 0);

          await updateDoc(hotelRef, { totalMaxGuests: updatedMaxGuests });

          alert('Room deleted successfully');
        } catch (error) {
          console.error('Error deleting room:', error);
          alert('Failed to delete room');
          return;
        }
      }

      const updatedRooms = rooms.filter((_, i) => i !== index);
      setRooms(updatedRooms);
    }
  };

  const RoomCard = ({ room, index, onSubmit, onRemove }) => (
    <div className="card shadow-sm mb-4">
      <div className="card-body">
        <h2 className="card-title mb-4">Room Management</h2>
        <form onSubmit={(e) => onSubmit(e, index)}>
          <div className="row g-3">
            <div className="col-md-4">
              <div className="form-group">
                <label htmlFor={`totalRooms-${index}`} className="form-label">Total Room:</label>
                <input 
                  type="number" 
                  className="form-control" 
                  id={`totalRooms-${index}`} 
                  name="totalRooms"
                  value={room.totalRooms || ''}
                  onChange={(e) => handleInputChange(e, index)}
                  required
                />
              </div>
            </div>
            <div className="col-md-4">
              <div className="form-group">
                <label htmlFor={`PerNightPrice-${index}`} className="form-label">Per Night Price:</label>
                <input 
                  type="number" 
                  className="form-control" 
                  id={`PerNightPrice-${index}`} 
                  name="PerNightPrice"
                  value={room.PerNightPrice || ''}
                  onChange={(e) => handleInputChange(e, index)}
                  required
                />
              </div>
            </div>
            <div className="col-md-4">
              <div className="form-group">
                <label htmlFor={`bedType-${index}`} className="form-label">Select Bed Type:</label>
                <select 
                  className="form-select" 
                  id={`bedType-${index}`} 
                  name="bedType"
                  value={room.bedType || ''}
                  onChange={(e) => handleInputChange(e, index)}
                  required
                >
                  <option value="" disabled>Select your options</option>
                  <option value="Single Bed">Single Bed</option>
                  <option value="Twin Bed">Twin Bed</option>
                  <option value="Double Bed">Double Bed</option>
                  <option value="King Bed">King Bed</option>
                  <option value="Queen Bed">Queen Bed</option>
                </select>
              </div>
            </div>
            <div className="col-md-4">
              <div className="form-group">
                <label htmlFor={`roomType-${index}`} className="form-label">Room Type:</label>
                <input 
                  type="text" 
                  className="form-control" 
                  id={`roomType-${index}`} 
                  name="roomType"
                  value={room.roomType || ''}
                  onChange={(e) => handleInputChange(e, index)}
                  required
                />
              </div>
            </div>
            <div className="col-md-4">
              <div className="form-group">
                <label htmlFor={`PerAdultPrice-${index}`} className="form-label">Per Adult Price:</label>
                <input 
                  type="number" 
                  className="form-control" 
                  id={`PerAdultPrice-${index}`} 
                  name="PerAdultPrice"
                  value={room.PerAdultPrice || ''}
                  onChange={(e) => handleInputChange(e, index)}
                  required
                />
              </div>
            </div>
            <div className="col-md-4">
              <div className="form-group">
                <label htmlFor={`PerChildPrice-${index}`} className="form-label">Per Child Price:</label>
                <input 
                  type="number" 
                  className="form-control" 
                  id={`PerChildPrice-${index}`} 
                  name="PerChildPrice"
                  value={room.PerChildPrice || ''}
                  onChange={(e) => handleInputChange(e, index)}
                  required
                />
              </div>
            </div>
            <div className="col-md-4">
              <div className="form-group">
                <label htmlFor={`Discount-${index}`} className="form-label">Discount(%):</label>
                <input 
                  type="number" 
                  className="form-control" 
                  id={`Discount-${index}`} 
                  name="Discount"
                  value={room.Discount || ''}
                  onChange={(e) => handleInputChange(e, index)}
                  required
                />
              </div>
            </div>
            <div className="col-md-4">
              <div className="form-group">
                <label htmlFor={`MaxGuestsAllow-${index}`} className="form-label">Max Guests Allow:</label>
                <input 
                  type="number" 
                  className="form-control" 
                  id={`MaxGuestsAllow-${index}`} 
                  name="MaxGuestsAllow"
                  value={room.MaxGuestsAllow || ''}
                  onChange={(e) => handleInputChange(e, index)}
                  required
                />
              </div>
            </div>
            <div className="col-md-4">
              <div className="form-group">
                <label htmlFor={`RoomSize-${index}`} className="form-label">Room Size(sq ft):</label>
                <input 
                  type="number" 
                  className="form-control" 
                  id={`RoomSize-${index}`} 
                  name="RoomSize"
                  value={room.RoomSize || ''}
                  onChange={(e) => handleInputChange(e, index)}
                  required
                />
              </div>
            </div>
          </div>
          <div className="row align-items-center mt-3">
            <div className="col-lg-6">
              <div className="form-group">
                <label htmlFor={`accommodationFacilities-${index}`} className="form-label">Accommodation Facilities</label>
                <select 
                  className="form-select" 
                  id={`accommodationFacilities-${index}`} 
                  name="accommodationFacilities"
                  onChange={(e) => handleFacilitySelect(e, index)}
                  value=""
                >
                  <option value="" disabled>Select your options</option>
                  <option value="WiFi">WiFi</option>
                  <option value="Food">Food</option>
                  <option value="Mini Fridge">Mini Fridge</option>
                  <option value="Telephone">Telephone</option>
                  <option value="Flat-Screen Tv">Flat-Screen Tv</option>
                  <option value="24 Hour Room Service">24 Hour Room Service</option>
                  <option value="Laundry">Laundry</option>
                  <option value="Air Conditioning">Air Conditioning</option>
                  <option value="Attached Bathroom">Attached Bathroom</option>
                  <option value="Public Bathroom">Public Bathroom</option>
                </select>
                <div className="d-flex flex-wrap gap-2 mt-2">
                  {room.accommodationFacilities?.map((facility, facilityIndex) => (
                    <span key={facilityIndex} className="badge bg-light text-dark">
                      {facility}
                      <button 
                        type="button" 
                        className="btn-close ms-2"
                        onClick={() => handleFacilityRemove(facility, index)}
                        aria-label="Remove facility"
                      ></button>
                    </span>
                  ))}
                </div>
              </div>
            </div>
            <div className="col-lg-6 mt-4">
              <div className="form-group">
                <label className="form-label d-flex align-items-center">
                  <span className="me-3">Availability:</span>
                  <div className="form-check form-switch">
                    <input 
                      className="form-check-input"
                      type="checkbox"
                      id={`availabilityToggle-${index}`}
                      checked={room.availability || false}
                      onChange={(e) => handleAvailabilityChange(e, index)}
                    />
                    <label className="form-check-label" htmlFor={`availabilityToggle-${index}`}>
                      {room.availability ? 'Available' : 'Not Available'}
                    </label>
                  </div>
                </label>
              </div>
            </div>
          </div>
          <div className="col-12 text-center mt-4">
            <button type="submit" className="btn btn-danger px-5">Save</button>
            {index > 0 && (
              <button type="button" className="btn btn-secondary px-5 ms-3" onClick={() => onRemove(index)}>Remove</button>
            )}
          </div>
        </form>
      </div>
    </div>
  );

  return (
    <div className="room-management-container p-lg-3">
      <style>
        {`
          .room-management-container {
            margin-left: 250px;
            margin-top: 60px;
            max-width: calc(100% - 250px);
          }
          @media (max-width: 768px) {
            .room-management-container {
              margin-left: 0;
              max-width: 100%;
            }
          }
        `}
      </style>
      <div className="container-fluid p-0">
        <div className="row g-0">
          <div className="col-12">
            {rooms.map((room, index) => (
              <RoomCard 
                key={index} 
                room={room}
                index={index} 
                onSubmit={handleSubmit} 
                onRemove={removeRoom}
              />
            ))}
            <div className="text-center mt-4">
              <button onClick={addRoom} className="btn btn-primary px-5">Add Room</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoomManagement;

