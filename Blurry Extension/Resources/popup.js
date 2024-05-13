// Description: This script is executed when the popup is opened.
// It sets up the event listeners for the popup.

browser.tabs.query({ active: true, currentWindow: true }, function(tabs) {
    const tab = tabs[0];
    browser.tabs.sendMessage(tab.id, { action: "createTestDiv" });
});



// Get the blur intensity slider and the value element
const blurIntensity = document.querySelector("#blur-intensity");
const blurNumericDisplay = document.querySelector("#blur-numeric-display");

// Set the initial value of the blur numveric display
browser.tabs.query({ active: true, currentWindow: true }, function(tabs) {
    const tab = tabs[0];
    browser.tabs.sendMessage(tab.id, { action: "getBlurIntensity" }).then((response) => {
        if (response.intensity) {
            blurIntensity.value = response.intensity;
            blurNumericDisplay.textContent = response.intensity;
        }
    });
});

// Listen for changes to the blur intensity slider
blurIntensity.addEventListener("input", (event) => {

    // Update the value element with the new value
    blurNumericDisplay.textContent = event.target.value;

    // Send a message to the content script with the new value
    browser.tabs.query({ active: true, currentWindow: true }, function(tabs) {
        const tab = tabs[0];
        browser.tabs.sendMessage(tab.id, { blurIntensity: event.target.value });
    });
});
/*
// Create a test div to drag around
document.querySelector("#make-div").addEventListener("click", () => {
    browser.tabs.query({ active: true, currentWindow: true }, function(tabs) {
        const tab = tabs[0];
        browser.tabs.sendMessage(tab.id, { action: "createTestDiv" });
    });
});
*/
/*document.getElementById("apply-blur").addEventListener("click", function () {
    let blurIntensity = document.getElementById("blur-intensity").value;
    console.log("Applying blur with intensity: ", blurIntensity);
    // Send a message to the background script
    safari.extension.dispatchMessage("blur", { intensity: blurIntensity });
}); */
/*
let blurOnClick = false;

document.getElementById("toggle-blur").addEventListener("click", function () {
    blurOnClick = !blurOnClick;
    // Send a message to the background script
    safari.extension.dispatchMessage("toggleBlurOnClick", {
        state: blurOnClick,
    });
});
*/
/*
function addMouseOverListener() {
    document.addEventListener('mouseover', (event) => {
        event.target.style.border = '2px solid lightblue';
        event.target.style.borderRadius = '5px';
    });
}

function addMouseOutListener() {
    document.addEventListener('mouseout', (event) => {
        event.target.style.border = '';
        event.target.style.borderRadius = '';
    });
}
*/
/*
document.getElementById("apply-blur-intensity").addEventListener("click", (e) => {
    browser.tabs.query({ active: true, currentWindow: true }, function(tabs) {
        const tab = tabs[0];
        browser.tabs.sendMessage(tab.id, {blurIntensity: blurIntensity.value});
        browser.scripting.executeScript({
            target: { tabId: tab.id },
            files: ["content.js"],
            func: "updateBlurIntensity",
            args: [blurIntensity]
        });
    });
});
*/


/*
    const tab = tabs[0];
        chrome.scripting.executeScript({
            target: { tabId: tab.id },
            func:   getCellValues
        }).then(() => console.log('Injected a function!'));
*/
    /*function applyBlur(tabs) {
        let tab = tabs[0];
        command = "applyBlur";
        browser.tabs.sendMessage(tab.id, { command: command });
    }

    function reportError(error) {
        console.error(`Could not blur: ${error}`);
    }

    browser.tabs.query({ active: true, currentWindow: true })
        .then(applyBlur)
        .catch(reportError);
    
});
*/
/*function reportExecuteScriptError(error) {
    console.error(`Failed to execute content script: ${error.message}`);
}

browser.tabs.executeScript({ file: "/content.js" })
    .then(listenForClicks)
    .catch(reportExecuteScriptError);*/