

const API_URL = 'http:/localhost:8000';


async function send(message) {
    const [tab] = await chrome.tabs.query({ active: true, lastFocusedWindow: true });
    const response = await chrome.tabs.sendMessage(tab.id, message);
    // Optional: do something with response
}


const state = new State();


async function getSavedState(key) {
    let stateValue = null;
    await new Promise(resolve => {
        state.getSavedState(key, function (value) {
            stateValue = value;
            resolve();
        });
    });
    // console.log(overlayDisplay); // now it should log the correct value
    // any other code that depends on overlayDisplay should be here

    return stateValue;
}


const agentAPI = async (slug, data) => {
    const payload = JSON.stringify(data);
    const settings = {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        },
        body: payload
    };
    try {
        const fetchResponse = await fetch(`${API_URL}${slug}`, settings);
        const data = await fetchResponse.json();
        return data;
    } catch (e) {
        if (e instanceof TypeError) {
            console.log("Adblocker or your browser is blocking the API request. Please disable it and try again.");
            return null;
        }

        console.log(`Error at ${slug}: ${e}`);
        console.log(`Payload: ${payload}`);
        return null;
    }    

}

