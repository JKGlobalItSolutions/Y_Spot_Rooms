    import { initializeApp } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-app.js";
    import { getDatabase } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-database.js";
    import { getAuth, GoogleAuthProvider, signInWithPopup, onAuthStateChanged, signInWithEmailAndPassword, signOut } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-auth.js";

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

    const app = initializeApp(firebaseConfig);
    const auth = getAuth();
    const db = getDatabase();
    const provider = new GoogleAuthProvider();
    const emailInp = document.getElementById("floatingInput");
    const passwordInp = document.getElementById("floatingPassword");
    const signInButton = document.getElementById("signInButton");
    const emailSignInButton = document.getElementById("emailSignInButton");
    const signOutButton = document.getElementById("signOutButton");
    const message = document.getElementById("message");
    const userName = document.getElementById("userName");
    const userEmail = document.getElementById("userEmail");

    signOutButton.style.display = "none";
    message.style.display = "none";

    const validateEmail = (email) => {
      const re = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
      return re.test(email);
    };

    const validateForm = () => {
      const email = emailInp.value;
      const password = passwordInp.value;
      let valid = true;

      if (!email) {
        alert("Email is required.");
        valid = false;
      } else if (!validateEmail(email)) {
        alert("Please enter a valid email address.");
        valid = false;
      }

      if (!password) {
        alert("Password is required.");
        valid = false;
      }

      return valid;
    };

    const userSignIn = async () => {
      signInWithPopup(auth, provider)
        .then((result) => {
          const user = result.user;
          // Fetching user details
          const displayName = user.displayName;
          const email = user.email;
          const photoURL = user.photoURL;

          // Display user details
          userName.textContent = displayName;
          userEmail.textContent = email;
          console.log('User details:', { displayName, email, photoURL });

          window.location.href = "../index.html"; // Redirect to index page after sign-in
        })
        .catch((error) => {
          const errorCode = error.code;
          const errorMessage = error.message;
          console.error(errorCode, errorMessage);
        });
    };

    const emailSignIn = async () => {
      if (!validateForm()) return; // Validate form before signing in

      const email = emailInp.value;
      const password = passwordInp.value;

      try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        console.log("User signed in:", user);
        window.location.href = "../index.html"; // Redirect to index page after sign-in
      } catch (error) {
        console.error("Error signing in with email and password:", error);
        alert("Error signing in with email and password. Please check your credentials and try again.");
      }
    };

    const userSignOut = async () => {
      try {
        await signOut(auth);
        console.log("User signed out");
      } catch (error) {
        console.error("Error signing out:", error);
      }
    };

    onAuthStateChanged(auth, (user) => {
      if (user) {
        signOutButton.style.display = "block";
        message.style.display = "block";
        userName.innerHTML = user.displayName || "User";
        userEmail.innerHTML = user.email;
      } else {
        signOutButton.style.display = "none";
        message.style.display = "none";
      }
    });

    signInButton.addEventListener('click', (event) => {
      event.preventDefault();  // Prevent the default link behavior
      userSignIn();
    });

    emailSignInButton.addEventListener('click', (event) => {
      event.preventDefault();  // Prevent the default button behavior
      emailSignIn();
    });

    signOutButton.addEventListener('click', (event) => {
      event.preventDefault();  // Prevent the default button behavior
      userSignOut();
    });
