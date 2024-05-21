 // Wait for the DOM content to be fully loaded
            document.addEventListener("DOMContentLoaded", function() {
              // Target the #dates input field and initialize Flatpickr
              flatpickr("#dates", {
                // Set the date format as desired (e.g., "Y-m-d" for YYYY-MM-DD)
                dateFormat: "Y-m-d",
                // Enable selecting a range of dates (for check-in and check-out)
                mode: "range",
                // Optional: You can add more options as needed
              });
            });
        
        
              
              document.addEventListener('DOMContentLoaded', function () {
      document.getElementById('guests').addEventListener('click', function () {
          var dropdown = document.getElementById('guestsDropdown');
          if (dropdown.style.display === "none") {
              dropdown.style.display = "block";
          } else {
              dropdown.style.display = "none";
          }
      });
  });
  
          //   </script>
         
              // Increment and decrement functions for Adults
              document.getElementById('adults-plus').addEventListener('click', function() {
                  document.getElementById('adults').stepUp();
                  updateGuests();
              });
          
              document.getElementById('adults-minus').addEventListener('click', function() {
                  document.getElementById('adults').stepDown();
                  updateGuests();
              });
          
              // Increment and decrement functions for Children
              document.getElementById('children-plus').addEventListener('click', function() {
                  document.getElementById('children').stepUp();
                  updateGuests();
              });
          
              document.getElementById('children-minus').addEventListener('click', function() {
                  document.getElementById('children').stepDown();
                  updateGuests();
              });
          
              // Increment and decrement functions for Rooms
              document.getElementById('rooms-plus').addEventListener('click', function() {
                  document.getElementById('rooms').stepUp();
                  updateGuests();
              });
          
              document.getElementById('rooms-minus').addEventListener('click', function() {
                  document.getElementById('rooms').stepDown();
                  updateGuests();
              });
          
              // Function to update the "Adults, Children & Rooms" input
              function updateGuests() {
                  var adults = document.getElementById('adults').value;
                  var children = document.getElementById('children').value;
                  var rooms = document.getElementById('rooms').value;
                  var guests = "Adults: " + adults + ", Children: " + children + ", Rooms: " + rooms;
                  document.getElementById('guests').value = guests;
              }