// Configuration
const KEYWORDS = [
    "accept", "approve", "run", "confirm", "yes",
    "승인", "실행", "확인", "예", "허용"
];

let isEnabled = true;

// Load settings
chrome.storage.sync.get(['enabled', 'keywords'], (result) => {
    if (result.enabled !== undefined) isEnabled = result.enabled;
    if (result.keywords) {
        // If user added custom keywords
        KEYWORDS.push(...result.keywords);
    }
});

// Update settings on change
chrome.storage.onChanged.addListener((changes, namespace) => {
    if (changes.enabled) {
        isEnabled = changes.enabled.newValue;
    }
});

function isTargetButton(element) {
    if (element.tagName !== 'BUTTON' && element.tagName !== 'A' && element.getAttribute('role') !== 'button') {
        return false;
    }

    const text = element.innerText.toLowerCase().trim();
    if (!text) return false;

    return KEYWORDS.some(keyword => text === keyword || text.includes(keyword));
}

function clickButton(button) {
    if (!isEnabled) return;

    console.log("Auto Accept: Clicking button", button);
    button.click();

    // Visual feedback
    const originalColor = button.style.backgroundColor;
    button.style.backgroundColor = '#4CAF50';
    setTimeout(() => {
        button.style.backgroundColor = originalColor;
    }, 500);
}

// Observer for new elements
const observer = new MutationObserver((mutations) => {
    if (!isEnabled) return;

    for (const mutation of mutations) {
        for (const node of mutation.addedNodes) {
            if (node.nodeType === 1) { // Element
                // Check the node itself
                if (isTargetButton(node)) {
                    clickButton(node);
                }
                // Check descendants
                const buttons = node.querySelectorAll('button, a, [role="button"]');
                buttons.forEach(btn => {
                    if (isTargetButton(btn)) {
                        clickButton(btn);
                    }
                });
            }
        }
    }
});

// Start observing
observer.observe(document.body, {
    childList: true,
    subtree: true
});

// Initial check
document.querySelectorAll('button, a, [role="button"]').forEach(btn => {
    if (isTargetButton(btn)) {
        clickButton(btn);
    }
});

console.log("Auto Accept Extension Loaded");
