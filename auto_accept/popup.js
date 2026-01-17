const toggle = document.getElementById('toggle');
const statusDiv = document.getElementById('status');

// Initialize state
chrome.storage.sync.get('enabled', (result) => {
    const isEnabled = result.enabled !== undefined ? result.enabled : true;
    toggle.checked = isEnabled;
    updateStatus(isEnabled);
});

toggle.addEventListener('change', () => {
    const isEnabled = toggle.checked;
    chrome.storage.sync.set({ enabled: isEnabled });
    updateStatus(isEnabled);
});

function updateStatus(isEnabled) {
    statusDiv.textContent = isEnabled ? 'Active' : 'Inactive';
    statusDiv.style.color = isEnabled ? 'green' : 'gray';
}
