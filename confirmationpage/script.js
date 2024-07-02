
document.addEventListener("DOMContentLoaded", function() {
  const fetchContent = async (url) => {
    const response = await fetch(url);
    if (!response.ok) throw new Error('Network response was not ok');
    return response.text();
  };

  const loadContent = async () => {
    try {
      const [headerData, footerData] = await Promise.all([
        fetchContent('../includes/insideheader.html'),
        fetchContent('../includes/insidefooter.html')
      ]);

      document.getElementById('included-insideheader').innerHTML = headerData;
      document.getElementById('included-insidefooter').innerHTML = footerData;
    } catch (error) {
      console.error('Error fetching content:', error);
    }
  };

  loadContent();
});
