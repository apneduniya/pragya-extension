class ActionAgent {
    /*
    * Contains all the basic methods used to interact with the browser.
    */
    constructor() {
        this.goalAchieved = false;
        this.state = new State();
    }

    _type(xpath, text) {
        const element = document.evaluate(xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
        if (element) {
            element.value = `${text}`;
            element.dispatchEvent(new Event('input', { bubbles: true })); // Trigger input event
            element.dispatchEvent(new Event('change', { bubbles: true })); // Trigger change event

            // Ensure that the input field is focused
            element.blur();
            element.focus();

            // Create and dispatch a keypress event for the Enter key
            const eventKeyDown = new KeyboardEvent('keypress', {
                key: 'Enter',
                keyCode: 13,
                which: 13,
                bubbles: true
            });
            element.dispatchEvent(eventKeyDown);
        }
    }

    _googleSearch(text) {
        const link = `https://www.google.com/search?q=${text}`;
        window.location.href = link;
    }

    _goToUrl(url) {

        if (!url.startsWith("https")) {
            url = "https://" + url;
        }

        window.location.href = url;
    }

    _click(xpath) {
        const element = document.evaluate(xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
        if (element) {
            element.click();
        }
    }

    _scrollUp() {
        window.scrollBy(0, -window.innerHeight + 200);
    }

    _scrollDown() {
        window.scrollBy(0, window.innerHeight - 200);
    }

    _goBack() {
        window.history.back();
    }

    _setGoalAchieved() {
        this.goalAchieved = true;
    }

    _wait(seconds = 2) {
        return new Promise(resolve => setTimeout(resolve, seconds * 1000)); // wait for said seconds, default is 2 seconds
    }

    async _temp_save(title, data) {
        const temp = await getSavedState("temp") || [];
        let tempData = {};
        tempData[title] = data;
        temp.push(tempData);
        await this.state.saveState("temp", temp);
    }

    async _temp_load() {
        return await getSavedState("temp");
    }

    async _temp_get(id) {
        const temp = await getSavedState("temp");
        return temp[id];
    }

    // Below functions will be used by us

    async temp_clear() {
        await this.state.saveState("temp", []);
    }

    currentUrl() {
        return window.location.href;
    }

    getGoalAchieved() {
        return this.goalAchieved;
    }

    async execute(action, ...args) {
        console.log(`\n\nEXECUTING: this.${action}(${args.join(', ')})\n\n`);
        await this[action](...args);
    }
}


const actionAgent = new ActionAgent();

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    switch (message.action) {
        case "execute":
            actionAgent.execute(message.method, ...message.args);
            break;
        case "setGoalAchieved":
            actionAgent._setGoalAchieved();
            break;
        case "getGoalAchieved":
            sendResponse(actionAgent.getGoalAchieved());
            break;
        default:
            break;
    }
});


