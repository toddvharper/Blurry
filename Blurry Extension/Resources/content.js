// Send a message to the background script
browser.runtime.sendMessage({ greeting: "hello" }).then((response) => {
    console.log("Received response: ", response);
});

// Listen for messages from the background script
browser.runtime.onMessage.addListener((request, sender, sendResponse) => {
    console.log("Received request: ", request);
    console.log("Received sender: ", sender);
    console.log("Received sendResponse: ", sendResponse);

    console.log("Message received.");
});

document.addEventListener('mouseover', (event) => {
    event.target.style.border = '2px solid lightblue';
    event.target.style.borderRadius = '5px';
});

document.addEventListener('mouseout', (event) => {
    event.target.style.border = '';
    event.target.style.borderRadius = '';
});

document.addEventListener('click', (event) => {
    if (event.target.style.filter.includes('blur(')) {
        event.target.style.filter = 'none';
    } else {
        event.target.style.filter = 'blur(10px)';
    }
});

// Get the intensity of the blur from the background script
browser.runtime.sendMessage({ action: "getBlurIntensity" }).then((intensity) => {
    // Convert the intensity to a valid CSS filter value
    const blurValue = `blur(${intensity}px)`;
});

let blurOnClick = false;

// Function to blur elements on click
function blurOnClickFunction(event) {
    if (event.target.style.filter === "blur(10px)") {
        event.target.style.filter = "none";
    } else {
        event.target.style.filter = "blur(10px)";
    }
}


safari.self.addListener("message", handleMessage);

function handleMessage(event) {
    if (event.name === "blur") {
        const data = event.message;
        console.log('Received data: ', data);
    }
}