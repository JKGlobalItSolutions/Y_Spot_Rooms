const imageInput = document.getElementById('imageInput');
const imagePreview = document.getElementById('imagePreview');

document.getElementById('imagePreview').addEventListener('click', function() {
    imageInput.click();
});

imageInput.addEventListener('change', function(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            imagePreview.src = e.target.result;
        }
        reader.readAsDataURL(file);
    }
});