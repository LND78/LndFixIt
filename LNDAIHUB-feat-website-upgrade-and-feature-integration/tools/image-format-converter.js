function convertImageFormat() {
    const fileInput = document.getElementById('convertFileInput');
    const format = document.getElementById('convertFormat').value;
    const resultDiv = document.getElementById('convertResult');

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

            const mimeType = 'image/' + format;
            const convertedUrl = canvas.toDataURL(mimeType);

            resultDiv.innerHTML = `
                <h4>Converted Image</h4>
                <img src="${convertedUrl}" style="max-width: 100%;" alt="Converted image">
                <a href="${convertedUrl}" download="converted_image.${format}" class="download-btn">Download</a>
            `;
        };
        img.src = e.target.result;
    };

    reader.readAsDataURL(file);
}
