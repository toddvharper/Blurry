let blurIntensity = 5;

// Listen for messages from the background script
browser.runtime.onMessage.addListener((request, sender, sendResponse) => {

    if (request.action === "extensionButtonClicked") {
        const draggableDiv = document.getElementById('blurry-draggable-div');
        if (draggableDiv) {
            closeExtension(draggableDiv);
        } else {
            openExtension();
        }
    }
});

// Functions to perform when the extension is opened
function openExtension() {
    appendHeadCode();
    addBlurryListeners();
    drawExtensionWindow();
}

// Functions to perform when the extension is closed
function closeExtension(div) {
    removeExtensionWindow(div);
    removeBlurryListeners();
    removeHeadCode();
}

// Append scripts and CSS to the page's head code as needed
function appendHeadCode() {
    
    // Append the Font Awesome script to the head
    const script = document.createElement("script");
    script.src = "https://kit.fontawesome.com/1ea4dc5d95.js";
    script.crossOrigin = "anonymous";
    document.head.appendChild(script);

    // Append the CSS to the head
    const style = document.createElement("style");
    style.innerHTML = `
        .blurry-extension-window .paragraph {
            margin: 0;
            padding: 0;
        }

        #blurry-draggable-div {
            padding: 0;
            margin: 0;
            font-family: system-ui;
            font-size: 16px;
            color: black;
            background-color: white;
            height: 100px;
            width: 600px;
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
            align-content: center;
        }

        #blurry-draggable-div-handle {
            display: flex;
            justify-content: center;
            align-items: center;
            align-content: center;
            cursor: move;
            width: 10%;
            height: 100%;
            border-radius: 50px 0 0 50px;
        }

        #blurry-draggable-div-content {
            display: flex;
            flex-flow: row nowrap;
            justify-content: space-around;
            gap: 15px;
            width: 90%;
            align-items: center;
        }

        #blurry-draggable-div-intensity-slider-group {
            display: flex;
            flex-flow: column nowrap;
            justify-content: center;
            align-items: center;
        }

        #blurry-blur-intensity-slider {
            display: flex;
            flex-flow: row nowrap;
            gap: 10px;
        }

        #blurry-draggable-div-blur-toggle-group {
            display: flex;
            flex-flow: column nowrap;
            justify-content: center;
            align-items: center;
        }
    `;
    document.head.appendChild(style);
}

// Remove scripts and CSS from the page's head code as needed
function removeHeadCode() {
    const script = document.querySelector("script[src='https://kit.fontawesome.com/1ea4dc5d95.js']");
    script.remove();
}

// Create a div that can be dragged around
function drawExtensionWindow() {
    const blurryExtensionWindow = document.createElement("div");
    blurryExtensionWindow.id = "blurry-draggable-div";
    blurryExtensionWindow.classList.add("blurry-extension-window");
    document.body.appendChild(blurryExtensionWindow);
    // Append an HTML file as a child to the div
    let controlsHTML = `
    <div id="blurry-draggable-div-handle">
        <i class="fa-solid fa-ellipsis-vertical fa-2x"></i>
    </div>
    <div id="blurry-draggable-div-content">
        <div id="blurry-draggable-div-intensity-slider-group">
            <label for="blurry-blur-intensity">Blur Intensity:</label>
            <div id="blurry-blur-intensity-slider">
                <div class="paragraph">-</div>
                <input type="range" id="blurry-blur-intensity" name="blurry-blur-intensity" min="1" max="20" value="${blurIntensity}">
                <div class="paragraph">+</div>
            </div>
            <div class="paragraph">
                <output id="blurry-blur-numeric-display">${blurIntensity}</output>
            </div>
        </div>
        <div id="blurry-draggable-div-blur-toggle-group">
            <label for="blurry-toggle-blur">Toggle Existing Blurs:</label>
            <input type="checkbox" id="blurry-toggle-blur">
        </div>
        <i class="fa-solid fa-check fa-1x"></i>
    </div>
    `;
    document.getElementById("blurry-draggable-div").innerHTML = controlsHTML;
    console.log("Extension window created");

    // Make the DIV element draggable:
    dragElement(document.getElementById("blurry-draggable-div"));
    console.log("Extension window draggable.");

    // Add an event listener to the slider
    console.log("Adding event listener to slider.")
    document.getElementById("blurry-blur-intensity").addEventListener("input", (event) => {
        blurIntensity = event.target.value;
        document.getElementById("blurry-blur-numeric-display").textContent = blurIntensity;

    });
}

function removeExtensionWindow(div) {
    div.remove();
}

function dragElement(elmnt) {
    var pos1 = 0,
        pos2 = 0,
        pos3 = 0,
        pos4 = 0;
    if (document.getElementById("blurry-draggable-div-handle")) {
        // if present, the header is where you move the DIV from:
        document.getElementById("blurry-draggable-div-handle").onmousedown =
            dragMouseDown;
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
        elmnt.style.top = elmnt.offsetTop - pos2 + "px";
        elmnt.style.left = elmnt.offsetLeft - pos1 + "px";
    }

    function closeDragElement() {
        // stop moving when mouse button is released:
        document.onmouseup = null;
        document.onmousemove = null;
    }
}

function addBlurryListeners() {
    document.addEventListener("click", blurOnClick);
    document.addEventListener("mouseover", borderOnMouseOver);
    document.addEventListener("mouseout", borderOnMouseOut);
}

function removeBlurryListeners() {
    document.removeEventListener("click", blurOnClick);
    document.removeEventListener("mouseover", borderOnMouseOver);
    document.removeEventListener("mouseout", borderOnMouseOut);
}

function blurOnClick(event) {
    const extensionWindow = document.getElementById("blurry-draggable-div");
    if (event.target.classList.contains("blurry-element") && event.target.style.filter.includes(`blur(${blurIntensity}px)`)) {
        event.target.style.filter = 'none';
        event.target.classList.remove("blurry-element");
    } else if (event.target.classList.contains("blurry-element")) {
        event.target.style.filter = `blur(${blurIntensity}px)`;
    } else if (event.target !== extensionWindow && !extensionWindow.contains(event.target)) {
        event.target.style.filter = `blur(${blurIntensity}px)`;
        event.target.classList.add("blurry-element");
    }
}

function borderOnMouseOver(event) {
    const extensionWindow = document.getElementById("blurry-draggable-div");
    if (event.target !== extensionWindow && !extensionWindow.contains(event.target)) {
        event.target.style.border = "2px solid lightblue";
        event.target.style.borderRadius = "5px";
    }
}

function borderOnMouseOut(event) {
    event.target.style.border = "";
    event.target.style.borderRadius = "";
}