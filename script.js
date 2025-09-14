// Inisialisasi data di localStorage
if (!localStorage.getItem('aspirasiSmaneka')) {
    localStorage.setItem('aspirasiSmaneka', JSON.stringify([]));
}

// Variabel untuk menyimpan gambar yang diupload
let uploadedImage = null;

// Fungsi untuk menangani upload gambar
document.getElementById('file-input').addEventListener('change', function(event) {
    const file = event.target.files[0];
    if (file) {
        // Validasi ukuran file (maksimal 2MB)
        if (file.size > 2 * 1024 * 1024) {
            alert('Ukuran file terlalu besar. Maksimal 2MB.');
            this.value = '';
            return;
        }
        
        // Validasi tipe file (hanya gambar)
        if (!file.type.match('image.*')) {
            alert('Hanya file gambar yang diizinkan.');
            this.value = '';
            return;
        }
        
        const reader = new FileReader();
        reader.onload = function(e) {
            const previewContainer = document.getElementById('preview-container');
            const imagePreview = document.getElementById('image-preview');
            
            imagePreview.src = e.target.result;
            previewContainer.style.display = 'block';
            
            // Simpan gambar untuk dikirim
            uploadedImage = e.target.result;
        };
        reader.readAsDataURL(file);
    }
});

// Fungsi untuk menghapus gambar
function removeImage() {
    const previewContainer = document.getElementById('preview-container');
    const fileInput = document.getElementById('file-input');
    
    previewContainer.style.display = 'none';
    fileInput.value = '';
    uploadedImage = null;
}

// Fungsi untuk mengirim pesan
function sendMessage() {
    const category = document.getElementById('category').value;
    const message = document.getElementById('message-text').value.trim();
    const urgency = document.getElementById('urgency').value;
    const statusDiv = document.getElementById('send-status');
    
    if (!category) {
        statusDiv.innerHTML = `
            <div class="error">
                <i class="fas fa-exclamation-circle"></i> Silakan pilih kategori laporan
            </div>
        `;
        return;
    }
    
    if (!message) {
        statusDiv.innerHTML = `
            <div class="error">
                <i class="fas fa-exclamation-circle"></i> Silakan tulis detail laporan Anda
            </div>
        `;
        return;
    }
    
    if (message.length < 10) {
        statusDiv.innerHTML = `
            <div class="error">
                <i class="fas fa-exclamation-circle"></i> Mohon jelaskan laporan Anda lebih detail
            </div>
        `;
        return;
    }
    
    if (message.length > 1000) {
        statusDiv.innerHTML = `
            <div class="error">
                <i class="fas fa-exclamation-circle"></i> Laporan terlalu panjang. Maksimal 1000 karakter.
            </div>
        `;
        return;
    }
    
    // Simpan pesan
    const messages = JSON.parse(localStorage.getItem('aspirasiSmaneka'));
    
    messages.push({
        id: Date.now(),
        category: category,
        text: message,
        urgency: urgency,
        image: uploadedImage, // Simpan gambar sebagai base64
        timestamp: new Date().toISOString(),
        status: 'baru'
    });
    
    localStorage.setItem('aspirasiSmaneka', JSON.stringify(messages));
    
    // Tampilkan status berhasil
    statusDiv.innerHTML = `
        <div class="success">
            <i class="fas fa-check-circle"></i> Laporan Anda berhasil dikirim! OSIS/MPK akan menindaklanjuti segera.
        </div>
    `;
    
    // Reset form
    document.getElementById('category').selectedIndex = 0;
    document.getElementById('message-text').value = '';
    document.getElementById('urgency').selectedIndex = 0;
    removeImage(); // Hapus preview gambar
    
    // Hapus status setelah 5 detik
    setTimeout(() => {
        statusDiv.innerHTML = '';
    }, 5000);
}

// Tambahkan drag and drop functionality
const fileUploadLabel = document.querySelector('.file-upload-label');

fileUploadLabel.addEventListener('dragover', function(e) {
    e.preventDefault();
    this.style.borderColor = '#ff5722';
    this.style.background = 'rgba(255, 255, 255, 0.1)';
});

fileUploadLabel.addEventListener('dragleave', function(e) {
    e.preventDefault();
    this.style.borderColor = 'rgba(255, 255, 255, 0.3)';
    this.style.background = 'transparent';
});

fileUploadLabel.addEventListener('drop', function(e) {
    e.preventDefault();
    this.style.borderColor = 'rgba(255, 255, 255, 0.3)';
    this.style.background = 'transparent';
    
    const file = e.dataTransfer.files[0];
    if (file) {
        const fileInput = document.getElementById('file-input');
        // Create a new FileList object (not directly possible, so we use DataTransfer)
        const dataTransfer = new DataTransfer();
        dataTransfer.items.add(file);
        fileInput.files = dataTransfer.files;
        
        // Trigger change event
        const event = new Event('change');
        fileInput.dispatchEvent(event);
    }
});

// Event listeners untuk tombol
document.getElementById('send-button').addEventListener('click', sendMessage);
document.getElementById('remove-image-btn').addEventListener('click', removeImage);
