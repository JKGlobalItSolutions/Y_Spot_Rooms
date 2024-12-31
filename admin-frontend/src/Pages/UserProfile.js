import React, { useState, useEffect } from 'react';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL, listAll, deleteObject } from 'firebase/storage';
import { auth, db, storage } from '../firebase/config';
import { toast } from 'react-toastify';

const UserProfile = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    hotelName: '',
    hotelWebsite: '',
    email: '',
    mobile: '',
    location: '',
    upiId: '',
    documents: null,
    profileImage: null,
    propertyType: ''
  });
  const [documents, setDocuments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (auth.currentUser) {
        await fetchProfileData(auth.currentUser.uid);
        await loadAllDocuments(auth.currentUser.uid);
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const fetchProfileData = async (uid) => {
    try {
      const docRef = doc(db, 'adminProfiles', uid);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        setFormData({
          fullName: data.userName || '',
          hotelName: data.hotelName || '',
          hotelWebsite: data.hotelWebsite || '',
          email: auth.currentUser.email || '',
          mobile: data.mobileNumber || '',
          location: data.address || '',
          upiId: data.upiId || '',
          profileImage: data.profileImage || null,
          propertyType: data.propertyType || ''
        });
      }
    } catch (error) {
      console.error('Error fetching profile data:', error);
      toast.error('Failed to load profile data. Please try again.');
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = async (e) => {
    const { name, files } = e.target;
    if (files[0] && auth.currentUser) {
      if (name === 'profileImage') {
        const storageRef = ref(storage, `adminProfiles/${auth.currentUser.uid}/profileImage`);
        try {
          await uploadBytes(storageRef, files[0]);
          const downloadURL = await getDownloadURL(storageRef);
          setFormData(prev => ({ ...prev, [name]: downloadURL }));
          toast.success('Profile image updated successfully!');
        } catch (error) {
          console.error('Error uploading profile image:', error);
          toast.error('Failed to upload profile image. Please try again.');
        }
      } else if (name === 'documents') {
        const storageRef = ref(storage, `adminProfiles/${auth.currentUser.uid}/hotelDocuments/${files[0].name}`);
        try {
          await uploadBytes(storageRef, files[0]);
          await loadAllDocuments(auth.currentUser.uid);
          toast.success('Document uploaded successfully!');
        } catch (error) {
          console.error('Error uploading document:', error);
          toast.error('Failed to upload document. Please try again.');
        }
      }
    }
  };

  const loadAllDocuments = async (uid) => {
    const storageRef = ref(storage, `adminProfiles/${uid}/hotelDocuments/`);
    try {
      const result = await listAll(storageRef);
      const documentPromises = result.items.map(async (itemRef) => {
        const url = await getDownloadURL(itemRef);
        return { name: itemRef.name, url };
      });
      const documentList = await Promise.all(documentPromises);
      setDocuments(documentList);
    } catch (error) {
      console.error('Error listing documents:', error);
      toast.error('Failed to load documents. Please try again.');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const user = auth.currentUser;
    if (user) {
      try {
        await setDoc(doc(db, 'adminProfiles', user.uid), {
          userName: formData.fullName,
          hotelName: formData.hotelName,
          hotelWebsite: formData.hotelWebsite,
          mobileNumber: formData.mobile,
          address: formData.location,
          upiId: formData.upiId,
          profileImage: formData.profileImage,
          propertyType: formData.propertyType
        }, { merge: true });
        toast.success('Profile updated successfully!');
      } catch (error) {
        console.error('Error updating profile:', error);
        toast.error('Failed to update profile. Please try again.');
      }
    }
  };

  const deleteDocument = async (documentName) => {
    if (window.confirm('Are you sure you want to delete this document?') && auth.currentUser) {
      const documentRef = ref(storage, `adminProfiles/${auth.currentUser.uid}/hotelDocuments/${documentName}`);
      try {
        await deleteObject(documentRef);
        await loadAllDocuments(auth.currentUser.uid);
        toast.success('Document deleted successfully!');
      } catch (error) {
        console.error('Error deleting document:', error);
        toast.error('Failed to delete document. Please try again.');
      }
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="user-profile-container">
      <style>
        {`
          .user-profile-container {
            margin-left: 250px;
            margin-top: 60px;
            max-width: calc(100% - 250px);
          }
          @media (max-width: 768px) {
            .user-profile-container {
              margin-left: 0;
              max-width: 100%;
            }
          }
          .profile-image-container {
            width: 120px;
            height: 120px;
            border-radius: 50%;
            overflow: hidden;
            margin-bottom: 15px;
            border: 2px solid #ff0000;
            cursor: pointer;
          }
          .profile-image {
            width: 100%;
            height: 100%;
            object-fit: cover;
          }
        `}
      </style>
      <div className="container-fluid">
        <div className="row justify-content-center">
          <div className="col-12 col-lg-12">
            <div className="card shadow-sm p-lg-3">
              <div className="card-body">
                <div className="text-center mb-4">
                  <div className="profile-image-container mx-auto">
                    <img
                      src={formData.profileImage || "/placeholder.svg"}
                      alt="Profile"
                      className="profile-image"
                    />
                  </div>
                  <label className="btn btn-outline-danger mt-2">
                    Choose Profile Image
                    <input
                      type="file"
                      name="profileImage"
                      onChange={handleFileChange}
                      className="d-none"
                      accept="image/*"
                    />
                  </label>
                </div>

                <form onSubmit={handleSubmit}>
                  <div className="row g-3">
                    <div className="col-md-6">
                      <label htmlFor="fullName" className="form-label">Full Name</label>
                      <input
                        type="text"
                        className="form-control"
                        id="fullName"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleInputChange}
                        placeholder="Enter your full name"
                      />
                    </div>
                    <div className="col-md-6">
                      <label htmlFor="hotelName" className="form-label">Hotel Name</label>
                      <input
                        type="text"
                        className="form-control"
                        id="hotelName"
                        name="hotelName"
                        value={formData.hotelName}
                        onChange={handleInputChange}
                        placeholder="Enter hotel name"
                      />
                    </div>
                    <div className="col-md-6">
                      <label htmlFor="hotelWebsite" className="form-label">Hotel Website</label>
                      <input
                        type="url"
                        className="form-control"
                        id="hotelWebsite"
                        name="hotelWebsite"
                        value={formData.hotelWebsite}
                        onChange={handleInputChange}
                        placeholder="https://samplehotelwebsite.com"
                      />
                    </div>
                    <div className="col-md-6">
                      <label htmlFor="email" className="form-label">Email address</label>
                      <input
                        type="email"
                        className="form-control"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="email@example.com"
                        readOnly
                      />
                    </div>
                    <div className="col-md-6">
                      <label htmlFor="mobile" className="form-label">Mobile number</label>
                      <input
                        type="tel"
                        className="form-control"
                        id="mobile"
                        name="mobile"
                        value={formData.mobile}
                        onChange={handleInputChange}
                        placeholder="000-000-0000"
                      />
                    </div>
                    <div className="col-md-6">
                      <label htmlFor="location" className="form-label">Location</label>
                      <input
                        type="text"
                        className="form-control"
                        id="location"
                        name="location"
                        value={formData.location}
                        onChange={handleInputChange}
                        placeholder="Enter location"
                      />
                    </div>
                    <div className="col-md-6">
                      <label htmlFor="propertyType" className="form-label">Property Type</label>
                      <select
                        className="form-control"
                        id="propertyType"
                        name="propertyType"
                        value={formData.propertyType}
                        onChange={handleInputChange}
                      >
                        <option value="">Select Property Type</option>
                        <option value="Hotel">Hotel</option>
                        <option value="Homestay">Homestay</option>
                        <option value="Apartment">Apartment</option>
                      </select>
                    </div>
                    <div className="col-md-6">
                      <label htmlFor="documents" className="form-label">Submit your Hotel documents</label>
                      <input
                        type="file"
                        className="form-control"
                        id="documents"
                        name="documents"
                        onChange={handleFileChange}
                        accept=".pdf,.doc,.docx"
                      />
                      <ul className="list-unstyled mt-2">
                        {documents.map((doc, index) => (
                          <li key={index} className="d-flex justify-content-between align-items-center mb-2">
                            <a href={doc.url} target="_blank" rel="noopener noreferrer">{doc.name}</a>
                            <button type="button" className="btn btn-danger btn-sm ml-2" onClick={() => deleteDocument(doc.name)}>Delete</button>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="col-md-6">
                      <label htmlFor="upiId" className="form-label">UPI ID</label>
                      <input
                        type="text"
                        className="form-control"
                        id="upiId"
                        name="upiId"
                        value={formData.upiId}
                        onChange={handleInputChange}
                        placeholder="Enter UPI ID"
                      />
                    </div>
                  </div>

                  <div className="text-center mt-4">
                    <button type="submit" className="btn btn-danger px-5">
                      Save Changes
                    </button>
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

export default UserProfile;

