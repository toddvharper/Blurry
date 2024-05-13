browser.runtime.onMessage.addListener((request, sender, sendResponse) => {
    console.log("Received request: ", request);

    if (request.greeting === "hello")
        sendResponse({ farewell: "goodbye" });
});

browser.action.onClicked.addListener((tab) => {
    browser.tabs.sendMessage(tab.id, { action: "extensionButtonClicked" });
});