const html = `
<div class="pragya-doorhanger-container">
    <div class="pragya-overlay">
        <div id="pragya-chat-container"></div>
        <div class="pragya-prompt-button-container">
            <input type="text" id="pragya-prompt" placeholder="Type your prompt here..." />
            <button id="pragya-submit-button">
                <svg width="26" height="26" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path fill-rule="evenodd" clip-rule="evenodd" d="M19.2111 2.06722L3.70001 5.94499C1.63843 6.46039 1.38108 9.28612 3.31563 10.1655L8.09467 12.3378C9.07447 12.7831 10.1351 12.944 11.1658 12.8342C11.056 13.8649 11.2168 14.9255 11.6622 15.9053L13.8345 20.6843C14.7139 22.6189 17.5396 22.3615 18.055 20.3L21.9327 4.78886C22.3437 3.14517 20.8548 1.6563 19.2111 2.06722ZM8.92228 10.517C9.85936 10.943 10.9082 10.9755 11.8474 10.6424C12.2024 10.5165 12.5417 10.3383 12.8534 10.1094C12.8968 10.0775 12.9397 10.0446 12.982 10.0108L15.2708 8.17974C15.6351 7.88831 16.1117 8.36491 15.8202 8.7292L13.9892 11.018C13.9553 11.0603 13.9225 11.1032 13.8906 11.1466C13.6617 11.4583 13.4835 11.7976 13.3576 12.1526C13.0244 13.0918 13.057 14.1406 13.4829 15.0777L15.6552 19.8567C15.751 20.0673 16.0586 20.0393 16.1147 19.8149L19.9925 4.30379C20.0372 4.12485 19.8751 3.96277 19.6962 4.00751L4.18509 7.88528C3.96065 7.94138 3.93264 8.249 4.14324 8.34473L8.92228 10.517Z" fill="#fff"/>
                </svg>
            </button>
        </div>
    </div>
</div>
`


const styles = `
@import url('https://fonts.googleapis.com/css2?family=Quicksand:wght@300..700&display=swap');

.pragya-doorhanger-container * {
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
}

.pragya-doorhanger-container {
    --pragya-height: 496px;
    --pragya-width: 400px;
    padding: 20px;
    margin: 0;
    position: fixed;
    right: 10px;
    bottom: 10px;
    height: var(--pragya-height);
    width: var(--pragya-width);
    overflow-x: hidden;
    outline: none !important;
    -webkit-tap-highlight-color: transparent;
    -webkit-touch-callout: none;
    z-index:2147483647;
    transition: all 250ms ease-in-out 0s;
    transform: translateY(150%);

    background: rgba( 255, 255, 255, 0.68 );
    box-shadow: 0 0px 8px 0 rgba( 31, 38, 135, 0.37 );
    backdrop-filter: blur( 40px );
    -webkit-backdrop-filter: blur( 15px );
    border-radius: 32px;
    border: 1px solid rgba( 255, 255, 255, 0.40 );

}

.pragya-doorhanger-open {
    transform: translateY(0px) !important;
}

.pragya-overlay {
    height: 100%;
    width: 100%;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    gap: 16px;
}

#pragya-chat-container {
    height: calc(var(--pragya-height) - 80px);
    width: 100%;
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    gap: 16px;

    --sb-track-color: #4FA7E7;
    --sb-thumb-color: transparent;
    --sb-size: 5px;
    --sb-thumb-border-radius: 20px;
}

#pragya-chat-container::-webkit-scrollbar {
    width: var(--sb-size);
}

#pragya-chat-container::-webkit-scrollbar-track {
    background: var(--sb-track-color);
    border-radius: var(--sb-thumb-border-radius);
}

#pragya-chat-container::-webkit-scrollbar-thumb {
    background: var(--sb-thumb-color);
    border-radius: var(--sb-thumb-border-radius);
}

.pragya-msg {
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
    padding: 12px 16px;
    border-radius: 16px;
    font-size: 16px;
    width: 70%;
    max-width: fit-content;
}

.pragya-agent-msg {
    background: rgba( 255, 255, 255, 0.68 );
    color: #0d0c22;
    border-bottom-left-radius: 0;
    margin-right: auto;
}

.pragya-user-msg {
    background: #4FA7E7;
    color: white;
    border-bottom-right-radius: 0;
    margin-left: auto;
}

.pragya-prompt-button-container {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    gap: 16px;
}

#pragya-prompt {
    border: none;
    /* border: 1.5px solid #e7e7e9; */
    border-bottom: 3.4px solid #4FA7E7;
    border-top-left-radius: 10px;
    border-top-right-radius: 10px;
    font-size: 16px;
    font-weight: 400;
    line-height: 28px;
    height: 48px;
    width: calc(100% - 56px);
    padding: 8px 20px;
    transition: background-color 200ms ease, outline 200ms ease, color 200ms ease, box-shadow 200ms ease, -webkit-box-shadow 200ms ease;
    outline: none;
    color: #0d0c22;
    background: rgba( 255, 255, 255, 0.68 );
    font-family: "Quicksand", sans-serif;
    font-optical-sizing: auto;
    font-weight: 400;
    font-style: normal;
}

#pragya-submit-button {
    background: #4FA7E7;
    border: none;
    border-radius: 12px;
    cursor: pointer;
    height: 48px;
    width: 48px;
    display: flex;
    justify-content: center;
    align-items: center;
    transition: all 200ms ease;
}

`

const script = `
`

let inject = false;

// const state = new State();
// async function getOverlayDisplay() {
//     let overlayDisplay;
//     await new Promise(resolve => {
//         state.getSavedState('overlayDisplay', function (value) {
//             overlayDisplay = value;
//             resolve();
//         });
//     });
//     // console.log(overlayDisplay); // now it should log the correct value
//     // any other code that depends on overlayDisplay should be here

//     return overlayDisplay;
// }

if (!getSavedState("overlayDisplay")) {
    state.saveState('overlayDisplay', false);
    // console.log("Overlay display state set to false");
}


async function injectOverlay() {

    if (inject && await getSavedState("overlayDisplay")) {
        /*
        * If it is injected and displayed, then lets remove it :)........It happens when we click to `hide` the overlay
        */

        // remove overlay
        // const overlay = document.getElementById("pragya-overlay-container");

        const doorhanger = document.querySelector(".pragya-doorhanger-container");
        doorhanger.classList.remove("pragya-doorhanger-open");

        // after animation, remove overlay
        // setTimeout(() => {
        //     overlay.remove();
        // }, 250);

        // inject = false;
        // overlayDisplay = false;
        state.saveState('overlayDisplay', false);
        // console.log("Overlay removed");

        clearAllAgentState();
        clearChat();
        console.log("Inject: 1...Hide Overlay Block");


        return;
    }

    else if (inject && !await getSavedState("overlayDisplay")) {
        /*
        * If it is injected but not displayed, then lets display it ;).....It happens when we `show` the overlay
        */

        const doorhanger = document.querySelector(".pragya-doorhanger-container");
        doorhanger.classList.add("pragya-doorhanger-open");

        // overlayDisplay = true;
        state.saveState('overlayDisplay', true);
        // console.log("Overlay displayed");

        const chat = await getSavedState("chat") || [];
        if (chat.length === 0) {
            await sendMsg("agent", "Hello! How can I help you today?");
        }

        console.log("Inject: 2...Show Overlay Block");

        return;
    }

    else if (!inject && await getSavedState("overlayDisplay")) {
        /*
        * If it is not injected but displayed, then lets inject and display it....It happens when the page is `reloaded`
        */

        const style = document.createElement("style");
        style.innerHTML = styles;
        document.head.appendChild(style);

        // inject overlay html
        const createOverlay = document.createElement("div");
        createOverlay.id = "pragya-overlay-container";
        createOverlay.innerHTML = html;
        document.body.appendChild(createOverlay);

        inject = true;

        const doorhanger = document.querySelector(".pragya-doorhanger-container");
        setTimeout(() => {
            doorhanger.classList.add("pragya-doorhanger-open");
        }, 10);

        const submitButton = document.getElementById("pragya-submit-button");
        const promptInput = document.getElementById("pragya-prompt");
        submitButton.addEventListener("click", handlePromptSubmit);
        promptInput.addEventListener("keypress", function (event) {
            if (event.key === "Enter") {
                handlePromptSubmit();
            }
        });
        promptInput.addEventListener("change", function (event) {
            state.saveState("prompt", event.target.value);
        });
        promptInput.focus();

        const prompt = await getSavedState("prompt");
        if (prompt) {
            const promptInput = document.getElementById("pragya-prompt");
            promptInput.value = prompt;
        }

        await loadChat();
        const chat = await getSavedState("chat") || [];
        if (chat.length === 0) {
            clearAllAgentState();
            await sendMsg("agent", "Hello! How can I help you today?");
        }

        console.log("Inject: 3...Reloaded Page Block");

        return;
    }

    /*
    * If it is not injected, then lets inject it FIRST!!....It happens when the extension is `installed` or `enabled`
    */

    // inject script
    // const script = document.createElement("script");
    // script.innerHTML = script;
    // document.head.appendChild(script);
    // inject style


    const style = document.createElement("style");
    style.innerHTML = styles;
    document.head.appendChild(style);

    // inject overlay html
    const createOverlay = document.createElement("div");
    createOverlay.id = "pragya-overlay-container";
    createOverlay.innerHTML = html;
    document.body.appendChild(createOverlay);

    // Add .pragya-overlay-open class
    // const doorhanger = document.querySelector(".pragya-doorhanger-container");

    // Add a small delay before adding the class
    // setTimeout(() => {
    //     doorhanger.classList.add("pragya-doorhanger-open");
    // }, 10);

    inject = true;
    // overlayDisplay = true;

    const submitButton = document.getElementById("pragya-submit-button");
    const promptInput = document.getElementById("pragya-prompt");
    submitButton.addEventListener("click", handlePromptSubmit);
    promptInput.addEventListener("keypress", function (event) {
        if (event.key === "Enter") {
            handlePromptSubmit();
        }
    });
    promptInput.addEventListener("change", function (event) {
        state.saveState("prompt", event.target.value);
    });
    promptInput.focus();

    clearAllAgentState();
    clearChat();
    await sendMsg("agent", "Hello! How can I help you today?");

    console.log("Inject: 4...First Time Inject or just Started Block");

}


injectOverlay(); // Inject overlay on page load

document.addEventListener("keydown", function (event) {
    if (event.key === "Escape") {
        injectOverlay();
    }
});


