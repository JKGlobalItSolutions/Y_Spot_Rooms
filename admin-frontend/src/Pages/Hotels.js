import React, { useState, useEffect } from 'react';
import { doc, getDoc, setDoc, updateDoc, arrayUnion } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { auth, db, storage } from '../firebase/config';

const HotelManagement = () => {
  const [formData, setFormData] = useState({
    hotelName: '',
    hotelAddress: '',
    numRooms: '',
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

  useEffect(() => {
    const fetchHotelDetails = async () => {
      if (auth.currentUser) {
        try {
          const docRef = doc(db, 'hotels', auth.currentUser.uid);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            const hotelData = docSnap.data();
            setFormData({
              hotelName: hotelData.hotelName || '',
              hotelAddress: hotelData.hotelAddress || '',
              numRooms: hotelData.numRooms || '',
              about: hotelData.About || '',
              map: '',
              parking: hotelData.Parking || '',
              internet: hotelData.Internet || '',
              checkInTime: hotelData.CheckinTime || '',
              checkOutTime: hotelData.CheckoutTime || '',
              additionalNotes: hotelData.AdditionalNotes || '',
              nearbyPlaces: hotelData.Nearby_Iconic_Places || '',
              transportation: hotelData.Transportation || '',
              hotelImages: hotelData.hotelImages || []
            });
            setSelectedFacilities(hotelData.accommodationDetails || []);
          }
        } catch (error) {
          console.error("Error fetching hotel details: ", error);
        }
      }
    };

    fetchHotelDetails();
  }, []);

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
    if (!selectedFacilities.includes(value)) {
      setSelectedFacilities(prev => [...prev, value]);
    }
  };

  const removeFacility = (facility) => {
    setSelectedFacilities(prev => prev.filter(f => f !== facility));
  };

  const removeImage = async (index) => {
    if (typeof formData.hotelImages[index] === 'string') {
      // It's an existing image URL
      try {
        const imageRef = ref(storage, formData.hotelImages[index]);
        await deleteObject(imageRef);
        const updatedImages = formData.hotelImages.filter((_, i) => i !== index);
        setFormData(prev => ({ ...prev, hotelImages: updatedImages }));
        await updateDoc(doc(db, 'hotels', auth.currentUser.uid), {
          hotelImages: updatedImages
        });
      } catch (error) {
        console.error("Error deleting image: ", error);
      }
    } else {
      // It's a newly added File object
      setFormData(prev => ({
        ...prev,
        hotelImages: prev.hotelImages.filter((_, i) => i !== index)
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (auth.currentUser) {
      try {
        const hotelRef = doc(db, 'hotels', auth.currentUser.uid);
        await setDoc(hotelRef, {
          hotelName: formData.hotelName,
          hotelAddress: formData.hotelAddress,
          numRooms: formData.numRooms,
          About: formData.about,
          Nearby_Iconic_Places: formData.nearbyPlaces,
          Transportation: formData.transportation,
          Internet: formData.internet,
          Parking: formData.parking,
          CheckinTime: formData.checkInTime,
          CheckoutTime: formData.checkOutTime,
          AdditionalNotes: formData.additionalNotes,
          accommodationDetails: selectedFacilities
        }, { merge: true });

        // Upload new images
        const newImages = formData.hotelImages.filter(img => !(typeof img === 'string'));
        const uploadPromises = newImages.map(file => {
          const fileRef = ref(storage, `hotelImages/${auth.currentUser.uid}/${file.name}`);
          return uploadBytes(fileRef, file).then(() => getDownloadURL(fileRef));
        });

        const uploadedUrls = await Promise.all(uploadPromises);
        const existingUrls = formData.hotelImages.filter(img => typeof img === 'string');
        const allImageUrls = [...existingUrls, ...uploadedUrls];

        await updateDoc(hotelRef, {
          hotelImages: allImageUrls
        });

        alert("Hotel details saved successfully!");
      } catch (error) {
        console.error("Error saving hotel details: ", error);
        alert("Error saving hotel details: " + error.message);
      }
    }
  };

  return (
    <div className="hotel-management-container p-lg-3 p-0 ">
      <style>
        {`
          .hotel-management-container {
            margin-left: 250px; /* Adjust based on your sidebar width */
            margin-top: 60px; /* Adjust based on your navbar height */
          
            max-width: calc(100% - 250px); /* Adjust based on your sidebar width */
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
                      <label className="form-label" htmlFor="numRooms">Number of Rooms</label>
                      <input
                        type="number"
                        id="numRooms"
                        name="numRooms"
                        value={formData.numRooms}
                        onChange={handleInputChange}
                        className="form-control"
                        required
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label" htmlFor="about">About</label>
                      <input
                        type="text"
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
                        <option value="WiFi">WiFi</option>
                        <option value="Food">Food</option>
                        <option value="Parking">Parking</option>
                        <option value="AC">AC</option>
                        <option value="Water Heater">Water Heater</option>
                        <option value="Restaurant">Restaurant</option>
                      </select>
                      <div className="d-flex flex-wrap gap-2 mt-2">
                        {selectedFacilities.map((facility, index) => (
                          <span key={index} className="badge bg-light text-dark">
                            {facility}
                            <button type="button" className="btn-close ms-2" onClick={() => removeFacility(facility)}></button>
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
                              <select
                                id="checkInTime"
                                name="checkInTime"
                                value={formData.checkInTime}
                                onChange={handleInputChange}
                                className="form-select"
                                required
                              >
                                <option value="">Select time</option>
                                {[...Array(24)].map((_, i) => (
                                  <option key={i} value={`${i}:00`}>{`${i}:00`}</option>
                                ))}
                              </select>
                            </div>
                            <div className="col-md-6">
                              <label className="form-label" htmlFor="checkOutTime">Check-out Time</label>
                              <select
                                id="checkOutTime"
                                name="checkOutTime"
                                value={formData.checkOutTime}
                                onChange={handleInputChange}
                                className="form-select"
                                required
                              >
                                <option value="">Select time</option>
                                {[...Array(24)].map((_, i) => (
                                  <option key={i} value={`${i}:00`}>{`${i}:00`}</option>
                                ))}
                              </select>
                            </div>
                            <div className="col-12">
                              <label className="form-label" htmlFor="additionalNotes">Additional Notes</label>
                              <input
                                type="text"
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
                            <input
                              type="text"
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
                            <input
                              type="text"
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
                    <button type="submit" className="btn btn-danger px-5">Save Changes</button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HotelManagement;

