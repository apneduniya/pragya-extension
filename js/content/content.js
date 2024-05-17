console.log("Pragya's content script is running.");


// markPage();
// actionAgent._googleSearch("example search query");


chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.finishedDoingSomething) {
        p.textContent = "All done doing something.";
    }
    if (message.showPopup) {
        injectOverlay(); // Toogle overlay

    }
    // Optional: sendResponse({message: "goodbye"});
});

// markPage();

