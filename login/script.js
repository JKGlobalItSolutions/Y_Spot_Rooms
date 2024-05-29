  // Import the functions you need from the SDKs you need
  import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.1/firebase-app.js";
//   import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.12.1/firebase-analytics.js";
  import { getAuth , GoogleAuthProvider , signInWithPopup } from "https://www.gstatic.com/firebasejs/10.12.1/firebase-auth.js";

  // TODO: Add SDKs for Firebase products that you want to use
  // https://firebase.google.com/docs/web/setup#available-libraries

  // Your web app's Firebase configuration
  // For Firebase JS SDK v7.20.0 and later, measurementId is optional
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
  const app = initializeApp(firebaseConfig);
  const auth = getAuth(app);
  auth.languageCode = 'en';
  const provider = new GoogleAuthProvider();
  const googleLogin = document.getElementById(google-login);
  googleLogin.addEventListener("click", function(){
    alert("hi");
  })
 
//   const analytics = getAnalytics(app);
