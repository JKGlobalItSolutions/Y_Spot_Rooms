   // Firebase configuration
   const firebaseConfig = {
    apiKey: "AIzaSyCp2e7CNo83HwDx_HAVgY_IDh0_KW2Y0HI",
    authDomain: "y-spot-e84ca.firebaseapp.com",
    databaseURL: "https://y-spot-e84ca-default-rtdb.firebaseio.com",
    projectId: "y-spot-e84ca",
    storageBucket: "y-spot-e84ca.appspot.com",
    messagingSenderId: "783996806068",
    appId: "1:783996806068:web:298ca1ddb4dfb7e758c8e1",
    measurementId: "G-TSH2JVYJHR"
  };
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);
  // Reference to the database service
  const database = firebase.database();
  const storage = firebase.storage();
  // Create or Update User
  function createOrUpdateUser() {
    const userId = document.getElementById('userId').value;
    const userName = document.getElementById('userName').value;
    const userAge = document.getElementById('userAge').value;
    const userImage = document.getElementById('userImage').files[0];
  
    if (userImage) {
      const storageRef = storage.ref('images/' + userImage.name);
      storageRef.put(userImage).then(() => {
        storageRef.getDownloadURL().then((url) => {
          database.ref('users/' + userId).set({
            username: userName,
            age: userAge,
            imageUrl: url
          }, (error) => {
            if (error) {
              console.error("Error writing data:", error);
            } else {
              alert("Data saved successfully!");
              readUser();
            }
          });
        });
      });
    } else {
      database.ref('users/' + userId).set({
        username: userName,
        age: userAge
      }, (error) => {
        if (error) {
          console.error("Error writing data:", error);
        } else {
          alert("Data saved successfully!");
          readUser();
        }
      });
    }
  }
  // Read User
  function readUser() {
    const userId = document.getElementById('userId').value;
    database.ref('users/' + userId).once('value').then((snapshot) => {
      const data = snapshot.val();
      if (data) {
        document.getElementById('userName').value = data.username;
        document.getElementById('userAge').value = data.age;
        document.getElementById('userDetails').innerHTML = `
          <p>Name: ${data.username}</p>
          <p>Age: ${data.age}</p>
          ${data.imageUrl ? `<img src="${data.imageUrl}" alt="User Image">` : ''}
        `;
      } else {
        document.getElementById('userDetails').innerHTML = `<p>No data available</p>`;
      }
    }).catch((error) => {
      console.error("Error reading data:", error);
    });
  } 
  // Delete User
  function deleteUser() {
    const userId = document.getElementById('userId').value;
    database.ref('users/' + userId).remove((error) => {
      if (error) {
        console.error("Error deleting data:", error);
      } else {
        alert("Data deleted successfully!");
        document.getElementById('userName').value = '';
        document.getElementById('userAge').value = '';
        document.getElementById('userImage').value = '';
        document.getElementById('userDetails').innerHTML = '';
      }
    });
  }