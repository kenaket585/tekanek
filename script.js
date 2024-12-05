const passwordInput = document.getElementById('password');
const unlockBtn = document.getElementById('unlock-btn');
const lockBtn = document.getElementById('lock-btn');
const authSection = document.getElementById('auth-section');
const mainSection = document.getElementById('main-section');
const uploadArea = document.getElementById('upload-area');
const fileInput = document.getElementById('file-input');
const fileBtn = document.getElementById('file-btn');
const fileList = document.getElementById('file-list');

// Password for the vault
const vaultPassword = 'karasa@123';

// Files stored in memory
let storedFiles = JSON.parse(localStorage.getItem('vaultFiles')) || [];

// Attempt counter
let attemptsLeft = 3;

// Unlock Vault
unlockBtn.addEventListener('click', () => {
  if (passwordInput.value === vaultPassword) {
    authSection.classList.add('hidden');
    mainSection.classList.remove('hidden');
    renderFiles(); // Render previously uploaded files
  } else {
    attemptsLeft--;
    if (attemptsLeft > 0) {
      alert(`Incorrect Password! You have ${attemptsLeft} attempt(s) left.`);
    } else {
      alert('You have reached the maximum number of attempts. Access denied!');
      passwordInput.disabled = true;
      unlockBtn.disabled = true;
    }
  }
});

// Lock Vault
lockBtn.addEventListener('click', () => {
  authSection.classList.remove('hidden');
  mainSection.classList.add('hidden');
  passwordInput.value = '';
  attemptsLeft = 3; // Reset attempts for the next session
  passwordInput.disabled = false;
  unlockBtn.disabled = false;
});

// Drag-and-Drop Upload
uploadArea.addEventListener('dragover', (e) => {
  e.preventDefault();
  uploadArea.classList.add('dragging');
});

uploadArea.addEventListener('dragleave', () => {
  uploadArea.classList.remove('dragging');
});

uploadArea.addEventListener('drop', (e) => {
  e.preventDefault();
  uploadArea.classList.remove('dragging');
  handleFiles(e.dataTransfer.files);
});

// File Browse Button
fileBtn.addEventListener('click', () => fileInput.click());
fileInput.addEventListener('change', () => handleFiles(fileInput.files));

// Handle Files
function handleFiles(files) {
  for (let file of files) {
    const reader = new FileReader();
    reader.onload = () => {
      const fileData = {
        name: file.name,
        content: reader.result,
      };
      storedFiles.push(fileData);
      localStorage.setItem('vaultFiles', JSON.stringify(storedFiles)); // Save to localStorage
      renderFiles();
    };
    reader.readAsDataURL(file);
  }
}

// Render Files
function renderFiles() {
  fileList.innerHTML = ''; // Clear existing list
  storedFiles.forEach((file, index) => {
    const listItem = document.createElement('div');
    listItem.className = 'file-item';
    listItem.innerHTML = `
      <span>${file.name}</span>
      <button onclick="downloadFile(${index})">Download</button>
      <button onclick="deleteFile(${index})">Delete</button>
    `;
    fileList.appendChild(listItem);
  });
}

// Download File
function downloadFile(index) {
  const file = storedFiles[index];
  const a = document.createElement('a');
  a.href = file.content;
  a.download = file.name;
  a.click();
}

// Delete File
function deleteFile(index) {
  storedFiles.splice(index, 1);
  localStorage.setItem('vaultFiles', JSON.stringify(storedFiles)); // Update localStorage
  renderFiles();
}
