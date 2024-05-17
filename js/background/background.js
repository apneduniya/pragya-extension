chrome.runtime.onInstalled.addListener(function () {
    const date = new Date();

    // Converting to IST timezone (UTC+5:30)
    date.setHours(date.getHours() + 5); // Add 5 hours for IST
    date.setMinutes(date.getMinutes() + 30); // Add 30 minutes for IST

    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-based
    const year = date.getFullYear();

    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');

    const formattedTimestamp = `${day}-${month}-${year} ${hours}:${minutes}:${seconds}`;
    console.log("Pragya has been installed at: " + formattedTimestamp);
});


// Listen for messages from content scripts to update the state
chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
    if (message.action === 'updateState') {
        setState(message.state);
    }
});


