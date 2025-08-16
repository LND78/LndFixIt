function loadImageForColorPicker(event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function(e) {
        const img = new Image();
        img.onload = function() {
            const canvas = document.getElementById('colorPickerCanvas');
            const ctx = canvas.getContext('2d');
            canvas.width = img.width;
            canvas.height = img.height;
            ctx.drawImage(img, 0, 0);

            canvas.addEventListener('click', function(e) {
                const x = e.offsetX;
                const y = e.offsetY;
                const pixel = ctx.getImageData(x, y, 1, 1).data;
                const rgb = `rgb(${pixel[0]}, ${pixel[1]}, ${pixel[2]})`;
                const hex = `#${('000000' + ((pixel[0] << 16) | (pixel[1] << 8) | pixel[2]).toString(16)).slice(-6)}`;

                const resultDiv = document.getElementById('colorPickerResult');
                resultDiv.innerHTML = `
                    <div style="display: flex; align-items: center; justify-content: center; gap: 20px;">
                        <div style="width: 50px; height: 50px; background-color: ${rgb}; border: 1px solid #fff;"></div>
                        <div>
                            <p>RGB: ${rgb}</p>
                            <p>HEX: ${hex}</p>
                        </div>
                    </div>
                `;
            });
        }
        img.src = e.target.result;
    }
    reader.readAsDataURL(file);
}
