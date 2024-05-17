async function send(message) {
    const [tab] = await chrome.tabs.query({ active: true, lastFocusedWindow: true });
    const response = await chrome.tabs.sendMessage(tab.id, message);
    // Optional: do something with response
}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.finishedDoingSomething) {
        p.textContent = "All done doing something.";
    }
    // Optional: sendResponse({message: "goodbye"});
});


send({ showPopup: true });
window.close();

