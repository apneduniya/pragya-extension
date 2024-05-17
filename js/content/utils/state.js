

class State {
    /*
    * State class to store the state of the extension
    */

    constructor() {
        this.state = {};
    }

    get(key) {
        return this.state[key];
    }

    set(key, value) {
        this.state[key] = value;
    }

    saveState(key, value) {
        chrome.storage.local.set({ [key]: value }, function () {
            // console.log('Value is set to ' + value);
        });
    }

    getSavedState(key, callback) {
        try {
            chrome.storage.local.get([key], function (result) {
                // console.log('Value currently is ' + result[key]);
                callback(result[key]);
            });
        } catch (e) {
            console.log(`Error in getting state of "${key}": ${e}`);
        }
    }
}


// Implementations of the State class

// const state = new State();

// state.set('goalAchieved', false);
// state.get('goalAchieved'); // false
// state.saveState('goalAchieved', true);
// state.getSavedState('goalAchieved').then(value => console.log(value)); // true