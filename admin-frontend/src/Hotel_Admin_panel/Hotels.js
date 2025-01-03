import React, { useState, useEffect, useCallback } from 'react';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { db, storage } from '../firebase/config';
import { useAuth } from '../auth/AuthContext';
import { toast } from 'react-toastify';

const HotelManagement = () => {
  const { user, loading } = useAuth();
  const [formData, setFormData] = useState({
    hotelName: '',
    hotelAddress: '',
    hotelContact: '',
    about: '',
    map: '',
    parking: '',
    internet: '',
    checkInTime: '',
    checkOutTime: '',
    additionalNotes: '',
    nearbyPlaces: '',
    transportation: '',
    hotelImages: []
  });

  const [selectedFacilities, setSelectedFacilities] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const facilityOptions = [
    { name: 'Wi-Fi', icon: 'wifi' },
    { name: 'Parking', icon: 'local_parking' },
    { name: 'Pool', icon: 'pool' },
    { name: 'Gym', icon: 'fitness_center' },
    { name: 'Restaurant', icon: 'restaurant' },
    { name: 'Spa', icon: 'spa' },
    { name: 'Bar', icon: 'local_bar' },
    { name: 'Room Service', icon: 'room_service' },
    { name: 'Family Room', icon: 'family_restroom' },
    { name: 'Laundry', icon: 'local_laundry_service' },
    { name: 'Air Conditioning', icon: 'ac_unit' },
    { name: 'CCTV', icon: 'videocam' },
    { name: 'Facility for Disabled guests', icon: 'wheelchair_pickup' },
    { name: 'Lift/Elevator', icon: 'elevator' },
    { name: 'Non-Smoking Area', icon: 'smoke_free' },
    { name: 'Smoke Free Area', icon: 'smoking_rooms' },
  ];

  const fetchHotelDetails = useCallback(async (uid) => {
    setIsLoading(true);
    setError(null);
    try {
      const docRef = doc(db, 'Hotels', uid);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const hotelData = docSnap.data();
        setFormData({
          hotelName: hotelData['Property Name'] || '',
          hotelAddress: hotelData['Property Address'] || '',
          hotelContact: hotelData['Property contact'] || '',
          about: hotelData.About || '',
          map: hotelData.map || '',
          parking: hotelData.Parking || '',
          internet: hotelData.Internet || '',
          checkInTime: hotelData['Check-in Time'] || '',
          checkOutTime: hotelData['Check-out Time'] || '',
          additionalNotes: hotelData['Additional Notes'] || '',
          nearbyPlaces: hotelData['Nearby Iconic Places'] || '',
          transportation: hotelData.Transportation || '',
          hotelImages: hotelData['Property Images'] || []
        });
        setSelectedFacilities(hotelData['Accommodation Facilities'] || []);
      } else {
        console.log('No such document!');
        setError('No hotel data found. Please fill in your hotel details.');
      }
    } catch (error) {
      console.error('Error fetching hotel details:', error);
      setError('Failed to load hotel details. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!loading && user) {
      fetchHotelDetails(user.uid);
    } else if (!loading && !user) {
      setIsLoading(false);
      setError('Please log in to manage your hotel details.');
    }
  }, [user, loading, fetchHotelDetails]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setFormData(prev => ({
      ...prev,
      hotelImages: [...prev.hotelImages, ...files]
    }));
  };

  const handleFacilityChange = (e) => {
    const value = e.target.value;
    const facility = facilityOptions.find(f => f.name === value);
    if (facility && !selectedFacilities.some(f => f.name === facility.name)) {
      setSelectedFacilities(prev => [...prev, facility]);
    }
  };

  const removeFacility = (facilityName) => {
    setSelectedFacilities(prev => prev.filter(f => f.name !== facilityName));
  };

  const removeImage = async (index) => {
    if (user) {
      if (typeof formData.hotelImages[index] === 'string') {
        try {
          const imageRef = ref(storage, formData.hotelImages[index]);
          await deleteObject(imageRef);
          const updatedImages = formData.hotelImages.filter((_, i) => i !== index);
          setFormData(prev => ({ ...prev, hotelImages: updatedImages }));
          await updateDoc(doc(db, 'Hotels', user.uid), {
            'Property Images': updatedImages
          });
          toast.success('Image deleted successfully!');
        } catch (error) {
          console.error("Error deleting image: ", error);
          toast.error('Failed to delete image. Please try again.');
        }
      } else {
        setFormData(prev => ({
          ...prev,
          hotelImages: prev.hotelImages.filter((_, i) => i !== index)
        }));
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (user) {
      setIsUploading(true);
      try {
        const hotelRef = doc(db, 'Hotels', user.uid);
        
        // Upload new images
        const newImages = formData.hotelImages.filter(img => !(typeof img === 'string'));
        const uploadPromises = newImages.map(file => {
          const fileRef = ref(storage, `hotelImages/${user.uid}/${file.name}`);
          return uploadBytes(fileRef, file).then(() => getDownloadURL(fileRef));
        });

        const uploadedUrls = await Promise.all(uploadPromises);
        const existingUrls = formData.hotelImages.filter(img => typeof img === 'string');
        const allImageUrls = [...existingUrls, ...uploadedUrls];

        await setDoc(hotelRef, {
          'Property Name': formData.hotelName,
          'Property Address': formData.hotelAddress,
          'Property contact': formData.hotelContact,
          About: formData.about,
          'Nearby Iconic Places': formData.nearbyPlaces,
          Transportation: formData.transportation,
          Internet: formData.internet,
          Parking: formData.parking,
          'Check-in Time': formData.checkInTime,
          'Check-out Time': formData.checkOutTime,
          'Additional Notes': formData.additionalNotes,
          'Accommodation Facilities': selectedFacilities,
          'Property Images': allImageUrls
        }, { merge: true });

        toast.success("Hotel details saved successfully!");
      } catch (error) {
        console.error("Error saving hotel details: ", error);
        toast.error("Error saving hotel details: " + error.message);
      } finally {
        setIsUploading(false);
      }
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div className="alert alert-danger">{error}</div>;
  }

  if (!user) {
    return <div className="alert alert-warning">Please log in to manage your hotel details.</div>;
  }

  return (
    <div className="hotel-management-container p-lg-3 p-0 ">
      <style>
        {`
          .hotel-management-container {
            margin-left: 250px;
            margin-top: 60px;
            max-width: calc(100% - 250px);
          }
          @media (max-width: 768px) {
            .hotel-management-container {
              margin-left: 0;
              max-width: 100%;
            }
          }
        `}
      </style>
      <div className="container-fluid">
        <div className="row">
          <div className="col-12">
            <div className="card shadow-sm">
              <div className="card-body">
                <h2 className="card-title mb-4">Hotel Management</h2>
                <form onSubmit={handleSubmit}>
                  <div className="mb-3">
                    <label className="form-label" htmlFor="hotelImages">Hotel Images</label>
                    <input
                      type="file"
                      id="hotelImages"
                      name="hotelImages"
                      accept="image/*"
                      multiple
                      onChange={handleFileChange}
                      className="form-control"
                    />
                    <div className="d-flex flex-wrap gap-2 mt-2">
                      {formData.hotelImages.map((image, index) => (
                        <div key={index} className="position-relative" style={{width: '100px', height: '100px'}}>
                          <img 
                            src={typeof image === 'string' ? image : URL.createObjectURL(image)} 
                            alt={`Preview ${index}`} 
                            className="img-fluid rounded" 
                            style={{width: '100%', height: '100%', objectFit: 'cover'}} 
                          />
                          <button type="button" className="btn btn-danger btn-sm position-absolute top-0 end-0" onClick={() => removeImage(index)}>×</button>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="row g-3">
                    <div className="col-md-6">
                      <label className="form-label" htmlFor="hotelName">Hotel Name</label>
                      <input
                        type="text"
                        id="hotelName"
                        name="hotelName"
                        value={formData.hotelName}
                        onChange={handleInputChange}
                        className="form-control"
                        required
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label" htmlFor="hotelAddress">Hotel Address</label>
                      <input
                        type="text"
                        id="hotelAddress"
                        name="hotelAddress"
                        value={formData.hotelAddress}
                        onChange={handleInputChange}
                        className="form-control"
                        required
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label" htmlFor="hotelContact">Hotel Contact</label>
                      <input
                        type="tel"
                        id="hotelContact"
                        name="hotelContact"
                        value={formData.hotelContact}
                        onChange={handleInputChange}
                        className="form-control"
                        required
                        pattern="[0-9]{10}"
                        title="Please enter a 10-digit phone number"
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label" htmlFor="about">About</label>
                      <textarea
                        id="about"
                        name="about"
                        value={formData.about}
                        onChange={handleInputChange}
                        className="form-control"
                        required
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label" htmlFor="facilities">Accommodation Facilities</label>
                      <select
                        id="facilities"
                        name="facilities"
                        onChange={handleFacilityChange}
                        className="form-select"
                      >
                        <option value="">Select your options</option>
                        {facilityOptions.map((facility, index) => (
                          <option key={index} value={facility.name}>{facility.name}</option>
                        ))}
                      </select>
                      <div className="d-flex flex-wrap gap-2 mt-2">
                        {selectedFacilities.map((facility, index) => (
                          <span key={index} className="badge bg-light text-dark">
                            {facility.name}
                            <button type="button" className="btn-close ms-2" onClick={() => removeFacility(facility.name)}></button>
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="col-md-6">
                      <label className="form-label" htmlFor="map">Map</label>
                      <input
                        type="text"
                        id="map"
                        name="map"
                        value={formData.map}
                        onChange={handleInputChange}
                        className="form-control"
                      />
                    </div>
                    <div className="col-md-6">
                      <div className="card">
                        <div className="card-body">
                          <h5 className="card-title">Policies & Rules</h5>
                          <div className="row g-3">
                            <div className="col-md-6">
                              <label className="form-label" htmlFor="parking">Parking</label>
                              <select
                                id="parking"
                                name="parking"
                                value={formData.parking}
                                onChange={handleInputChange}
                                className="form-select"
                              >
                                <option value="">Select your options</option>
                                <option value="Free Parking">Free Parking</option>
                                <option value="Paid Parking">Paid Parking</option>
                              </select>
                            </div>
                            <div className="col-md-6">
                              <label className="form-label" htmlFor="internet">Internet</label>
                              <select
                                id="internet"
                                name="internet"
                                value={formData.internet}
                                onChange={handleInputChange}
                                className="form-select"
                              >
                                <option value="">Select your options</option>
                                <option value="Free Internet">Free Internet</option>
                                <option value="Paid Internet">Paid Internet</option>
                              </select>
                            </div>
                            <div className="col-md-6">
                              <label className="form-label" htmlFor="checkInTime">Check-in Time</label>
                              <input
                                type="text"
                                id="checkInTime"
                                name="checkInTime"
                                value={formData.checkInTime}
                                onChange={handleInputChange}
                                className="form-control"
                                placeholder="e.g. 1:00 PM"
                                required
                              />
                            </div>
                            <div className="col-md-6">
                              <label className="form-label" htmlFor="checkOutTime">Check-out Time</label>
                              <input
                                type="text"
                                id="checkOutTime"
                                name="checkOutTime"
                                value={formData.checkOutTime}
                                onChange={handleInputChange}
                                className="form-control"
                                placeholder="e.g. 11:00 AM"
                                required
                              />
                            </div>
                            <div className="col-12">
                              <label className="form-label" htmlFor="additionalNotes">Additional Notes</label>
                              <textarea
                                id="additionalNotes"
                                name="additionalNotes"
                                value={formData.additionalNotes}
                                onChange={handleInputChange}
                                className="form-control"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="card">
                        <div className="card-body">
                          <h5 className="card-title">Surrounding Environments</h5>
                          <div className="mb-3">
                            <label className="form-label" htmlFor="nearbyPlaces">Nearby Iconic Place With Distance</label>
                            <textarea
                              id="nearbyPlaces"
                              name="nearbyPlaces"
                              value={formData.nearbyPlaces}
                              onChange={handleInputChange}
                              className="form-control"
                              required
                            />
                          </div>
                          <div className="mb-3">
                            <label className="form-label" htmlFor="transportation">Transportation With Distance</label>
                            <textarea
                              id="transportation"
                              name="transportation"
                              value={formData.transportation}
                              onChange={handleInputChange}
                              className="form-control"
                              required
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="text-center mt-4">
                    <button type="submit" className="btn btn-danger px-5" disabled={isUploading}>
                      {isUploading ? 'Saving...' : 'Save Changes'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
      {isUploading && (
        <div className="position-fixed top-0 start-0 w-100 h-100 d-flex justify-content-center align-items-center" style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)', zIndex: 9999 }}>
          <div className="spinner-border text-light" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default HotelManagement;

