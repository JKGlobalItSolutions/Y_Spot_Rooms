import React, { useState, useEffect } from 'react';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL, listAll, deleteObject } from 'firebase/storage';
import { auth, db, storage } from '../firebase/config';

const AdminProfile = () => {
  const [profileData, setProfileData] = useState({
    userName: '',
    hotelName: '',
    hotelWebsite: '',
    email: '',
    mobileNumber: '',
    address: '',
    upiId: '',
    profileImage: 'https://via.placeholder.com/150'
  });
  const [documents, setDocuments] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      if (auth.currentUser) {
        await fetchProfileData(auth.currentUser.uid);
        await loadAllDocuments(auth.currentUser.uid);
      }
    };
    fetchData();
  }, []);

  const fetchProfileData = async (uid) => {
    try {
      const docRef = doc(db, 'adminProfiles', uid);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setProfileData({ ...docSnap.data(), email: auth.currentUser.email });
      }
    } catch (error) {
      console.error('Error fetching profile data:', error);
    }
  };

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setProfileData(prevData => ({ ...prevData, [id]: value }));
  };

  const handleProfileImageChange = async (e) => {
    const file = e.target.files[0];
    if (file && auth.currentUser) {
      const storageRef = ref(storage, `adminProfiles/${auth.currentUser.uid}/profileImage`);
      try {
        await uploadBytes(storageRef, file);
        const downloadURL = await getDownloadURL(storageRef);
        setProfileData(prevData => ({ ...prevData, profileImage: downloadURL }));
      } catch (error) {
        console.error('Error uploading profile image:', error);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const user = auth.currentUser;
    if (user) {
      try {
        await setDoc(doc(db, 'adminProfiles', user.uid), profileData, { merge: true });
        alert('Profile updated successfully!');
      } catch (error) {
        console.error('Error updating profile:', error);
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
    }
  };

  const handleDocumentUpload = async (e) => {
    const file = e.target.files[0];
    if (file && auth.currentUser) {
      const storageRef = ref(storage, `adminProfiles/${auth.currentUser.uid}/hotelDocuments/${file.name}`);
      try {
        await uploadBytes(storageRef, file);
        await loadAllDocuments(auth.currentUser.uid);
      } catch (error) {
        console.error('Error uploading document:', error);
      }
    }
  };

  const deleteDocument = async (documentName) => {
    if (window.confirm('Are you sure you want to delete this document?') && auth.currentUser) {
      const documentRef = ref(storage, `adminProfiles/${auth.currentUser.uid}/hotelDocuments/${documentName}`);
      try {
        await deleteObject(documentRef);
        await loadAllDocuments(auth.currentUser.uid);
      } catch (error) {
        console.error('Error deleting document:', error);
      }
    }
  };

  return (
    <div className="container-fluid">
      <div className="border shadow-sm rounded-3 p-3">
        <div className="rounded bg-white mb-2">
          <form onSubmit={handleSubmit}>
            <div className="text-center mt-2">
              <div>
                <input
                  type="file"
                  id="profileImage"
                  accept="image/*"
                  style={{ display: 'none' }}
                  onChange={handleProfileImageChange}
                />
                <div className="preview-container">
                  <h4 className="mt-2" style={{ color: '#ff1717' }} id="image">
                    <b>Click to choose an image</b>
                  </h4>
                  <img
                    id="profileImagePreview"
                    style={{ borderRadius: '50%', height: '150px', width: '150px', cursor: 'pointer' }}
                    src={profileData.profileImage}
                    alt="Profile Image Preview"
                    onClick={() => document.getElementById('profileImage').click()}
                  />
                </div>
              </div>
            </div>
            <div className="row justify-content-center d-flex align-items-center">
              <div className="col-md-12">
                <div className="p-1 py-1">
                  <div className="row mt-2 d-flex align-items-center justify-content-center">
                    <div className="col-lg-5">
                      <label className="labels"><b>Full Name</b></label>
                      <input id="userName" type="text" className="form-control" placeholder="Full Name" value={profileData.userName} onChange={handleInputChange} />
                    </div>
                    <div className="col-lg-5">
                      <label className="labels"><b>Hotel Name</b></label>
                      <input id="hotelName" type="text" className="form-control" placeholder="Hotel Name" value={profileData.hotelName} onChange={handleInputChange} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="row justify-content-center d-flex align-items-center">
              <div className="col-md-12">
                <div className="p-1 py-1">
                  <div className="row mt-2 d-flex align-items-center justify-content-center">
                    <div className="col-lg-5">
                      <label className="labels"><b>Hotel Website</b></label>
                      <input id="hotelWebsite" type="text" className="form-control" placeholder="Hotel Website" value={profileData.hotelWebsite} onChange={handleInputChange} />
                    </div>
                    <div className="col-lg-5">
                      <label className="labels"><b>Email address</b></label>
                      <input id="email" type="text" className="form-control" placeholder="Email address" value={profileData.email} onChange={handleInputChange} readOnly />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="row justify-content-center d-flex align-items-center">
              <div className="col-md-12">
                <div className="p-1 py-1">
                  <div className="row mt-2 d-flex align-items-center justify-content-center">
                    <div className="col-lg-5">
                      <label className="labels"><b>Mobile number</b></label>
                      <input id="mobileNumber" type="text" className="form-control" placeholder="Mobile number" value={profileData.mobileNumber} onChange={handleInputChange} />
                    </div>
                    <div className="col-lg-5">
                      <label className="labels"><b>Location</b></label>
                      <input id="address" type="text" className="form-control" placeholder="Location" value={profileData.address} onChange={handleInputChange} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="row justify-content-center d-flex align-items-center">
              <div className="col-md-12">
                <div className="p-1 py-1">
                  <div className="row mt-2 d-flex align-items-center justify-content-center">
                    <div className="col-lg-5">
                      <label className="labels"><b>Submit your Hotel documents</b></label>
                      <input id="hotelDocuments" type="file" className="form-control" onChange={handleDocumentUpload} />
                      <ul id="documentsList" className="list-unstyled mt-2">
                        {documents.map((doc, index) => (
                          <li key={index} className="d-flex justify-content-between align-items-center mb-2">
                            <a href={doc.url} target="_blank" rel="noopener noreferrer">{doc.name}</a>
                            <button className="btn btn-danger btn-sm ml-2" onClick={() => deleteDocument(doc.name)}>Delete</button>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="col-lg-5">
                      <label className="labels"><b>UPI ID</b></label>
                      <input id="upiId" type="text" className="form-control" placeholder="UPI ID" value={profileData.upiId} onChange={handleInputChange} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="row justify-content-center d-flex align-items-center">
              <div className="col-md-12">
                <div className="p-1 py-1">
                  <div className="row mt-2 d-flex align-items-center justify-content-center">
                    <div className="text-center col-12 mt-4">
                      <button id="saveChangesBtn" style={{ backgroundColor: '#ff1717', color: '#fff' }} className="btn profile-button" type="submit">Save Changes</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AdminProfile;

