// Description: Background script for the extension.

// Listen for the extension button being clicked
browser.action.onClicked.addListener((tab) => {
    // Send a message to the content script
    browser.tabs.sendMessage(tab.id, { action: "extensionButtonClicked" });
});