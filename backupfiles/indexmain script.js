<script src="https://cdn.jsdelivr.net/npm/flatpickr"></script>
<script>
    document.addEventListener("DOMContentLoaded", function() {
        // Initialize Flatpickr for date selection
        var dateRangePicker = flatpickr("#dates", {
            mode: "range",
            dateFormat: "d, F Y",
            minDate: "today", // Disable past dates
            defaultDate: [new Date(), new Date()], // Default check-in and check-out to today
            onClose: function(selectedDates) {
                if (selectedDates.length === 2) {
                    sessionStorage.setItem('checkin', selectedDates[0].toLocaleDateString());
                    sessionStorage.setItem('checkout', selectedDates[1].toLocaleDateString());
                }
            }
        });

        // Retrieve data from sessionStorage and set it in the form
        var location = sessionStorage.getItem('location') || 'Tiruvannamalai';
        var checkin = sessionStorage.getItem('checkin');
        var checkout = sessionStorage.getItem('checkout');
        var adults = sessionStorage.getItem('adults') || 1;
        var children = sessionStorage.getItem('children') || 0;
        var rooms = sessionStorage.getItem('rooms') || 1;

        document.getElementById('location').value = location;
        if (checkin && checkout) {
            dateRangePicker.setDate([new Date(checkin), new Date(checkout)]);
        } else {
            dateRangePicker.setDate([new Date(), new Date()]);
        }
        document.getElementById('adults').value = adults;
        document.getElementById('children').value = children;
        document.getElementById('rooms').value = rooms;
        updateGuests();
        updateButtonsState();

        // Toggle guests dropdown visibility
        document.getElementById('guests').addEventListener('click', function(event) {
            var dropdown = document.getElementById('guestsDropdown');
            dropdown.classList.toggle('show');
            event.stopPropagation();
        });

        // Close dropdown if clicking outside
        document.addEventListener('click', function(event) {
            var dropdown = document.getElementById('guestsDropdown');
            if (!event.target.closest('#guestsDropdown') && !event.target.closest('#guests')) {
                dropdown.classList.remove('show');
            }
        });

        // Add event listeners for incrementing and decrementing adults, children, and rooms
        document.getElementById('adults-plus').addEventListener('click', function() { incrementValue('adults', 30); });
        document.getElementById('adults-minus').addEventListener('click', function() { decrementValue('adults', 1); });
        document.getElementById('children-plus').addEventListener('click', function() { incrementValue('children', 10); });
        document.getElementById('children-minus').addEventListener('click', function() { decrementValue('children', 0); });
        document.getElementById('rooms-plus').addEventListener('click', function() { incrementValue('rooms', 30); });
        document.getElementById('rooms-minus').addEventListener('click', function() { decrementValue('rooms', 1); });

        // Done button to close the dropdown
        document.getElementById('guests-done').addEventListener('click', function() {
            document.getElementById('guestsDropdown').classList.remove('show');
            updateGuests();
        });

        // Function to increment the input value
        function incrementValue(inputId, maxValue) {
            var input = document.getElementById(inputId);
            var currentValue = parseInt(input.value);
            if (currentValue < maxValue) {
                input.value = currentValue + 1;
                updateGuests();
                updateButtonsState();
            }
        }

        // Function to decrement the input value with a minimum value
        function decrementValue(inputId, minValue) {
            var input = document.getElementById(inputId);
            var currentValue = parseInt(input.value);
            if (currentValue > minValue) {
                input.value = currentValue - 1;
                updateGuests();
                updateButtonsState();
            }
        }

        // Function to update the "Adults, Children & Rooms" input
        function updateGuests() {
            var adults = document.getElementById('adults').value;
            var children = document.getElementById('children').value;
            var rooms = document.getElementById('rooms').value;
            var guests = `${adults} Adults, ${children} Children, ${rooms} Rooms`;
            document.getElementById('guests').value = guests;

            // Save updated values to sessionStorage
            sessionStorage.setItem('adults', adults);
            sessionStorage.setItem('children', children);
            sessionStorage.setItem('rooms', rooms);
        }

        // Function to update the plus and minus buttons state
        function updateButtonsState() {
            var adults = parseInt(document.getElementById('adults').value);
            var children = parseInt(document.getElementById('children').value);
            var rooms = parseInt(document.getElementById('rooms').value);

            updateButtonState('adults-plus', 'adults-minus', adults, 30);
            updateButtonState('children-plus', 'children-minus', children, 10);
            updateButtonState('rooms-plus', 'rooms-minus', rooms, 30);
        }

        function updateButtonState(plusId, minusId, value, maxValue) {
            var plusButton = document.getElementById(plusId);
            var minusButton = document.getElementById(minusId);

            plusButton.style.backgroundColor = value >= maxValue ? 'gray' : 'red';
            minusButton.style.backgroundColor = value <= (plusId === 'rooms-plus' ? 1 : 0) ? 'gray' : 'gray';

            plusButton.style.color = 'white';
            minusButton.style.color = 'white';
        }

        // Submit event for booking form
        document.getElementById('bookingForm').addEventListener('submit', function(e) {
            e.preventDefault(); // Prevent the default form submission

            // Get form data
            var location = document.getElementById('location').value;
            var dateRange = document.getElementById('dates').value;
            var adults = document.getElementById('adults').value;
            var children = document.getElementById('children').value;
            var rooms = document.getElementById('rooms').value;

            // Split date range into check-in and check-out dates
            var dateParts = dateRange.split(" to ");
            var checkin = dateParts[0];
            var checkout = dateParts[1];

            // Save data to sessionStorage
            sessionStorage.setItem('location', location);
            sessionStorage.setItem('checkin', checkin);
            sessionStorage.setItem('checkout', checkout);
            sessionStorage.setItem('adults', adults);
            sessionStorage.setItem('children', children);
            sessionStorage.setItem('rooms', rooms);

            // Redirect to the details page
            window.location.href = './details-page/details.html';
        });

        // Prevent manual input in the guest inputs
        ['adults', 'children', 'rooms'].forEach(id => {
            document.getElementById(id).readOnly = true;
        });
    });
</script>