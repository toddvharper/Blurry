let blurIntensity = 0;
let existingListener = false;

// Send a message to the background script
/*browser.runtime.sendMessage({ greeting: "hello" }).then((response) => {
    console.log("Received response: ", response);
});*/

// Listen for messages from the popup and background scripts
browser.runtime.onMessage.addListener((request, sender, sendResponse) => {

    if (request.blurIntensity) {
        updateBlurIntensity(request.blurIntensity);
    }

    if (request.action === "extensionButtonClicked") {
        // If document contains div #draggable-div
        if (document.getElementById('draggable-div')) {
            document.getElementById('draggable-div').remove();
        } else {
            console.log('Creating test div');
            const testDiv = document.createElement('div');
            testDiv.id = 'draggable-div';
            testDiv.style.width = '300px';
            testDiv.style.height = '100px';
            testDiv.style.backgroundColor = 'red';
            testDiv.style.position = 'fixed';
            testDiv.style.bottom = '50px';
            testDiv.style.left = '50%';
            testDiv.style.transform = 'translate(-50%, 0)';
            testDiv.style.zIndex = '1000';
            testDiv.style.border = '2px solid black';
            testDiv.style.borderRadius = '50px';
            document.body.appendChild(testDiv);
            // Make the DIV element draggable:
            dragElement(document.getElementById("draggable-div"));
        }
    }

    if (request.action === "getBlurIntensity" && blurIntensity !== 0) {
        sendResponse({ intensity: blurIntensity });
    } else if (request.action === "getBlurIntensity") {
        sendResponse({ intensity: 10 });
    }

    if (request.action === "createTestDiv") {

    }
});

function blurOnClick(event) {
    if (event.target.style.filter.includes('blur(')) {
        event.target.style.filter = 'none';
    } else {
        event.target.style.filter = `blur(${blurIntensity}px)`;
    }
}

function updateBlurIntensity(intensity) {
    blurIntensity = intensity;

    if (existingListener) {
        // Remove the existing listener
        document.querySelector('body').removeEventListener('click', blurOnClick);
    }

    document.addEventListener('click', blurOnClick);
    existingListener = true;
}

function dragElement(elmnt) {
  var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
  if (document.getElementById(elmnt.id + "header")) {
    // if present, the header is where you move the DIV from:
    document.getElementById(elmnt.id + "header").onmousedown = dragMouseDown;
  } else {
    // otherwise, move the DIV from anywhere inside the DIV:
    elmnt.onmousedown = dragMouseDown;
  }

  function dragMouseDown(e) {
    e = e || window.event;
    e.preventDefault();
    // get the mouse cursor position at startup:
    pos3 = e.clientX;
    pos4 = e.clientY;
    document.onmouseup = closeDragElement;
    // call a function whenever the cursor moves:
    document.onmousemove = elementDrag;
  }

  function elementDrag(e) {
    e = e || window.event;
    e.preventDefault();
    // calculate the new cursor position:
    pos1 = pos3 - e.clientX;
    pos2 = pos4 - e.clientY;
    pos3 = e.clientX;
    pos4 = e.clientY;
    // set the element's new position:
    elmnt.style.top = (elmnt.offsetTop - pos2) + "px";
    elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";
  }

  function closeDragElement() {
    // stop moving when mouse button is released:
    document.onmouseup = null;
    document.onmousemove = null;
  }
}

/*

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
*/
