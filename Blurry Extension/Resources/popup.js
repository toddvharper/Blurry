document.getElementById("apply-blur").addEventListener("click", function () {
    let blurIntensity = document.getElementById("blur-intensity").value;
    console.log("Applying blur with intensity: ", blurIntensity);
    // Send a message to the background script
    safari.extension.dispatchMessage("blur", { intensity: blurIntensity });
});
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