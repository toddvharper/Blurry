let blurIntensity = 0;
let existingClickListener = false;

// Listen for messages from the background script
browser.runtime.onMessage.addListener((request, sender, sendResponse) => {

    if (request.action === "extensionButtonClicked") {
        const draggableDiv = document.getElementById('draggable-div');
        if (draggableDiv) {
            closeExtension(draggableDiv);
        } else {
            openExtension();
        }
    }

    if (request.action === "getBlurIntensity" && blurIntensity !== 0) {
        sendResponse({ intensity: blurIntensity });
    } else if (request.action === "getBlurIntensity") {
        sendResponse({ intensity: 10 });
    }
});

// Functions to perform when the extension is opened
function openExtension() {
    appendHeadCode();
    drawExtensionWindow();
}

// Functions to perform when the extension is closed
function closeExtension(div) {
    removeDraggableDiv(div);
    removeHeadCode();
}

function appendHeadCode() {
    
    // Append the Font Awesome script to the head
    const script = document.createElement("script");
    script.src = "https://kit.fontawesome.com/1ea4dc5d95.js";
    script.crossOrigin = "anonymous";
    document.head.appendChild(script);

    // Append the CSS to the head
    const style = document.createElement("style");
    style.innerHTML = `
        #draggable-div {
            font-family: system-ui;
            color: black;
            background-color: white;
            height: 100px;
            width: 450px;
            padding: 0 30px 0 10px;
            position: fixed;
            bottom: 50px;
            left: 50%;
            transform: translate(-50%, 0);
            zIndex: 1000;
            border: 2px solid black;
            border-radius: 50px;
            display: flex;
            flex-flow: row nowrap;
            justify-content: space-between;
            align-items: center;
            gap: 20px;
        }

        #draggable-div-handle {
            cursor: move;
        }

        #draggable-div-slider,
        #draggable-div-blur-toggle {
            display: flex;
            flex-flow: column nowrap;
        }

        #blur-intensity-slider {
            display: flex;
            flex-flow: row nowrap;
            gap: 10px;
        }
    `;
    document.head.appendChild(style);
}

function removeHeadCode() {
    const script = document.querySelector("script[src='https://kit.fontawesome.com/1ea4dc5d95.js']");
    script.remove();
}

// Create a div that can be dragged around
function drawExtensionWindow() {
    const testDiv = document.createElement("div");
    testDiv.id = "draggable-div";
    document.body.appendChild(testDiv);
    // Append an HTML file as a child to the div
    let controlsHTML = `
    <script src="https://kit.fontawesome.com/1ea4dc5d95.js" crossorigin="anonymous"></script>
    <div id="draggable-div-handle"><i class="fa-solid fa-ellipsis-vertical fa-2x"></i></div>
    <div id="draggable-div-slider">
        <label for="blur-intensity">Blur Intensity:</label>
        <div id="blur-intensity-slider">
            <p>-</p>
            <input type="range" id="blur-intensity" name="blur-intensity" min="1" max="20" value="10">
            <p>+</p>
        </div>
        <p><output id="blur-numeric-display">10</output></p>
    </div>
    <div id="draggable-div-blur-toggle">
        <input type="checkbox" id="toggle-blur">Toggle Blur On Click</input>
    </div>
    <i class="fa-solid fa-check"></i>
    `;
    document.getElementById("draggable-div").innerHTML = controlsHTML;

    // Make the DIV element draggable:
    dragElement(document.getElementById("draggable-div"));
}

function removeDraggableDiv(div) {
    div.remove();
}

function blurOnClick(event) {
    if (event.target.style.filter.includes('blur(')) {
        event.target.style.filter = 'none';
    } else {
        event.target.style.filter = `blur(${blurIntensity}px)`;
    }
}

function updateBlurIntensity(intensity) {
    blurIntensity = intensity;

    if (existingClickListener) {
        // Remove the existing listener
        document.querySelector('body').removeEventListener('click', blurOnClick);
    }

    document.addEventListener('click', blurOnClick);
    existingClickListener = true;
}

function dragElement(elmnt) {
  var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
  if (document.getElementById("draggable-div-handle")) {
    // if present, the header is where you move the DIV from:
    document.getElementById("draggable-div-handle").onmousedown = dragMouseDown;
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
