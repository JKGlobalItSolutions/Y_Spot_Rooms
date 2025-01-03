import React, { useState, useEffect, useCallback } from 'react';
import { collection, doc, getDocs, setDoc, deleteDoc, updateDoc, getDoc } from 'firebase/firestore';
import { auth, db } from '../firebase/config';
import { toast } from 'react-toastify';

const RoomManagement = () => {
  const [rooms, setRooms] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);

  const facilityOptions = [
    { name: 'Wi-Fi', icon: 'wifi' },
    { name: 'Food', icon: 'restaurant' },
    { name: 'Mini Fridge', icon: 'kitchen' },
    { name: 'Telephone', icon: 'phone' },
    { name: 'Flat-screen TV', icon: 'tv' },
    { name: '24-hour Room Service', icon: 'room_service' },
    { name: 'Laundry', icon: 'local_laundry_service' },
    { name: 'Air Conditioning', icon: 'ac_unit' },
    { name: 'Attached Bathroom', icon: 'bathtub' },
    { name: 'Public Bathroom', icon: 'wc' },
    { name: 'Sofa', icon: 'chair' },
    { name: 'Living Room', icon: 'weekend' },
    { name: 'Mountain view', icon: 'landscape' },
    { name: 'Balcony', icon: 'balcony' },
  ];

  const bedTypes = ['Single Bed', 'Twin Bed', 'Double Bed', 'King Bed', 'Queen Bed'];

  const fetchRooms = useCallback(async () => {
    setIsLoading(true);
    if (auth.currentUser) {
      const homestayId = auth.currentUser.uid;
      const roomsCollection = collection(db, 'Hotels', homestayId, 'Rooms');
      const roomsSnapshot = await getDocs(roomsCollection);
      const roomsList = roomsSnapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          maxGuestsAllow: data.maxGuestsAllow || data.maxguestAllowed || '' // Handle both possible field names
        };
      });
      setRooms(roomsList);
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    fetchRooms();
  }, [fetchRooms]);

  const handleInputChange = (e, index) => {
    const { name, value } = e.target;
    const updatedRooms = [...rooms];
    updatedRooms[index] = {
      ...updatedRooms[index],
      [name]: value
    };
    setRooms(updatedRooms);
  };

  const handleFacilitySelect = (index, facility) => {
    const updatedRooms = [...rooms];
    if (!updatedRooms[index].facilities) {
      updatedRooms[index].facilities = [];
    }
    if (!updatedRooms[index].facilities.some(f => f.name === facility.name)) {
      updatedRooms[index].facilities.push(facility);
      setRooms(updatedRooms);
    }
  };

  const handleFacilityRemove = (index, facilityName) => {
    const updatedRooms = [...rooms];
    updatedRooms[index].facilities = updatedRooms[index].facilities.filter(f => f.name !== facilityName);
    setRooms(updatedRooms);
  };

  const handleAvailabilityChange = (e, index) => {
    const updatedRooms = [...rooms];
    updatedRooms[index].availability = e.target.value;
    setRooms(updatedRooms);
  };

  const validateRoomDetails = () => {
    for (let room of rooms) {
      if (!room.totalRooms || !room.roomPrice || !room.perAdultPrice || !room.perChildPrice ||
          !room.discount || !room.maxGuestsAllow || !room.roomType || !room.roomSize ||
          !room.bedType || !room.availability || !room.facilities || room.facilities.length === 0) {
        toast.error('Please fill in all the fields before saving.');
        return false;
      }
    }
    return true;
  };

  const handleSubmit = async (e, index) => {
    e.preventDefault();
    if (!validateRoomDetails()) return;

    setIsUploading(true);
    const homestayId = auth.currentUser.uid;
    const room = rooms[index];
    const roomRef = doc(db, 'Hotels', homestayId, 'Rooms', room.id || doc(collection(db, 'Hotels', homestayId, 'Rooms')).id);

    try {
      await setDoc(roomRef, {
        ...room,
        roomPrice: parseFloat(room.roomPrice),
        perAdultPrice: parseFloat(room.perAdultPrice),
        perChildPrice: parseFloat(room.perChildPrice),
        discount: parseFloat(room.discount),
        totalRooms: parseInt(room.totalRooms),
        maxGuestsAllow: parseInt(room.maxGuestsAllow),
        roomSize: parseFloat(room.roomSize),
      }, { merge: true });

      await calculateAndStoreMaxGuests();

      toast.success('Room details saved successfully');
      fetchRooms();
    } catch (error) {
      console.error('Error saving room details:', error);
      toast.error('Failed to save room details');
    } finally {
      setIsUploading(false);
    }
  };

  const addRoom = () => {
    setRooms([...rooms, {
      totalRooms: '',
      roomPrice: '',
      bedType: '',
      roomType: '',
      perAdultPrice: '',
      perChildPrice: '',
      discount: '',
      maxGuestsAllow: '',
      roomSize: '',
      availability: 'Yes',
      facilities: []
    }]);
  };

  const removeRoom = async (index) => {
    const homestayId = auth.currentUser.uid;
    const roomToDelete = rooms[index];

    if (roomToDelete.id) {
      try {
        await deleteDoc(doc(db, 'Hotels', homestayId, 'Rooms', roomToDelete.id));
        toast.success('Room deleted successfully');
      } catch (error) {
        console.error('Error deleting room:', error);
        toast.error('Failed to delete room');
        return;
      }
    }

    const updatedRooms = rooms.filter((_, i) => i !== index);
    setRooms(updatedRooms);
    await calculateAndStoreMaxGuests();
  };

  const calculateAndStoreMaxGuests = async () => {
    const homestayId = auth.currentUser.uid;
    let totalMaxGuests = 0;

    for (let room of rooms) {
      totalMaxGuests += parseInt(room.totalRooms) * parseInt(room.maxGuestsAllow);
    }

    try {
      await updateDoc(doc(db, 'Hotels', homestayId), { totalMaxGuests });
    } catch (error) {
      console.error('Error updating total max guests:', error);
    }
  };

  const RoomCard = ({ room, index, onSubmit, onRemove }) => (
    <div className="card shadow-sm mb-4">
      <div className="card-body">
        <h2 className="card-title mb-4">Room {index + 1}</h2>
        <form onSubmit={(e) => onSubmit(e, index)}>
          <div className="row g-3">
            <div className="col-md-6">
              <label htmlFor={`totalRooms-${index}`} className="form-label">Total Rooms:</label>
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
            <div className="col-md-6">
              <label htmlFor={`roomPrice-${index}`} className="form-label">Per Night Price:</label>
              <input 
                type="number" 
                className="form-control" 
                id={`roomPrice-${index}`} 
                name="roomPrice"
                value={room.roomPrice || ''}
                onChange={(e) => handleInputChange(e, index)}
                required
              />
            </div>
            <div className="col-md-6">
              <label htmlFor={`bedType-${index}`} className="form-label">Bed Type:</label>
              <select 
                className="form-select" 
                id={`bedType-${index}`} 
                name="bedType"
                value={room.bedType || ''}
                onChange={(e) => handleInputChange(e, index)}
                required
              >
                <option value="">Select bed type</option>
                {bedTypes.map((type, i) => (
                  <option key={i} value={type}>{type}</option>
                ))}
              </select>
            </div>
            <div className="col-md-6">
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
            <div className="col-md-6">
              <label htmlFor={`perAdultPrice-${index}`} className="form-label">Per Adult Price:</label>
              <input 
                type="number" 
                className="form-control" 
                id={`perAdultPrice-${index}`} 
                name="perAdultPrice"
                value={room.perAdultPrice || ''}
                onChange={(e) => handleInputChange(e, index)}
                required
              />
            </div>
            <div className="col-md-6">
              <label htmlFor={`perChildPrice-${index}`} className="form-label">Per Child Price:</label>
              <input 
                type="number" 
                className="form-control" 
                id={`perChildPrice-${index}`} 
                name="perChildPrice"
                value={room.perChildPrice || ''}
                onChange={(e) => handleInputChange(e, index)}
                required
              />
            </div>
            <div className="col-md-6">
              <label htmlFor={`discount-${index}`} className="form-label">Discount(%):</label>
              <input 
                type="number" 
                className="form-control" 
                id={`discount-${index}`} 
                name="discount"
                value={room.discount || ''}
                onChange={(e) => handleInputChange(e, index)}
                required
              />
            </div>
            <div className="col-md-6">
              <label htmlFor={`maxGuestsAllow-${index}`} className="form-label">Max Guests Allow:</label>
              <input 
                type="number" 
                className="form-control" 
                id={`maxGuestsAllow-${index}`} 
                name="maxGuestsAllow"
                value={room.maxGuestsAllow || ''}
                onChange={(e) => handleInputChange(e, index)}
                required
              />
            </div>
            <div className="col-md-6">
              <label htmlFor={`roomSize-${index}`} className="form-label">Room Size(sq ft):</label>
              <input 
                type="number" 
                className="form-control" 
                id={`roomSize-${index}`} 
                name="roomSize"
                value={room.roomSize || ''}
                onChange={(e) => handleInputChange(e, index)}
                required
              />
            </div>
            <div className="col-md-6">
              <label htmlFor={`availability-${index}`} className="form-label">Availability:</label>
              <select
                className="form-select"
                id={`availability-${index}`}
                name="availability"
                value={room.availability || 'Yes'}
                onChange={(e) => handleAvailabilityChange(e, index)}
                required
              >
                <option value="Yes">Yes</option>
                <option value="No">No</option>
              </select>
            </div>
          </div>
          <div className="mt-3">
            <label className="form-label">Facilities:</label>
            <select
              className="form-select mb-2"
              onChange={(e) => handleFacilitySelect(index, JSON.parse(e.target.value))}
              value=""
            >
              <option value="">Select facility</option>
              {facilityOptions.map((facility, i) => (
                <option key={i} value={JSON.stringify(facility)}>{facility.name}</option>
              ))}
            </select>
            <div className="d-flex flex-wrap gap-2 mt-2">
              {room.facilities?.map((facility, facilityIndex) => (
                <span key={facilityIndex} className="badge bg-light text-dark">
                  {facility.name}
                  <button 
                    type="button" 
                    className="btn-close ms-2"
                    onClick={() => handleFacilityRemove(index, facility.name)}
                    aria-label="Remove facility"
                  ></button>
                </span>
              ))}
            </div>
          </div>
          <div className="mt-4 d-flex justify-content-between">
            <button type="submit" className="btn btn-primary" disabled={isUploading}>
              {isUploading ? 'Saving...' : 'Save'}
            </button>
            {index > 0 && (
              <button type="button" className="btn btn-danger" onClick={() => onRemove(index)}>Remove Room</button>
            )}
          </div>
        </form>
      </div>
    </div>
  );

  if (isLoading) {
    return <div>Loading...</div>;
  }

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
            <div className="text-center mt-4 mb-5">
              <button onClick={addRoom} className="btn btn-success">Add New Room</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoomManagement;

