document.getElementById('attachments').addEventListener('change', function() {
    const fileList = document.getElementById('fileList');
    fileList.innerHTML = ''; // Clear the existing file list
    const files = this.files;

    if (files.length === 0) {
        fileList.innerHTML = '<p>No files selected</p>';
    } else {
        const ul = document.createElement('ul');
        for (let i = 0; i < files.length; i++) {
            const li = document.createElement('li');
            li.textContent = files[i].name;
            ul.appendChild(li);
        }
        fileList.appendChild(ul);
    }
});

//Open popup window
function openAttachment(src) {
    var popup = document.getElementById('attachment-popup');
    var popupImage = document.getElementById('popup-attachment');
    popupImage.src = src;
    popup.style.display = 'flex';
}

//Close popup window
function closeAttachment() {
    var popup = document.getElementById('attachment-popup');
    popup.style.display = 'none';
}





