function compressImage() {
    const fileInput = document.getElementById('compressFileInput');
    const quality = parseFloat(document.getElementById('compressQuality').value);
    const resultDiv = document.getElementById('compressResult');

    if (!fileInput.files[0]) {
        resultDiv.innerHTML = '<p>Please select an image file.</p>';
        return;
    }

    const file = fileInput.files[0];
    const reader = new FileReader();

    reader.onload = function(e) {
        const img = new Image();
        img.onload = function() {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');

            canvas.width = img.width;
            canvas.height = img.height;

            ctx.drawImage(img, 0, 0);

            const compressedUrl = canvas.toDataURL('image/jpeg', quality);

            resultDiv.innerHTML = `
                <h4>Compressed Image</h4>
                <img src="${compressedUrl}" style="max-width: 100%;" alt="Compressed image">
                <a href="${compressedUrl}" download="compressed_image.jpg" class="download-btn">Download</a>
            `;
        };
        img.src = e.target.result;
    };

    reader.readAsDataURL(file);
}
