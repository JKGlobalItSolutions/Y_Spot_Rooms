function toggleFilter() {
    var filterList = document.getElementById("filterList");
    var normalViewFilters = document.querySelectorAll(".d-none.d-lg-block .form-check");

    if (filterList.style.display === "none") {
        filterList.style.display = "block";
        // Clear existing filters in toggle filters section
        filterList.innerHTML = "";
        // Clone and append normal view filters to toggle filters section
        normalViewFilters.forEach(function(filter) {
            filterList.appendChild(filter.cloneNode(true));
        });
    } else {
        filterList.style.display = "none";
    }
}