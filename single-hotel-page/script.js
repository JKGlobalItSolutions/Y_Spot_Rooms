function scrollCarousel(direction) {
    const container = document.getElementById('carouselContainer');
    const scrollAmount = 270; // Adjust scroll amount as needed
    container.scrollBy({ left: direction * scrollAmount, behavior: 'smooth' });
  }