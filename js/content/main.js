

const TRIALS = 3;
const WAIT_AFTER_ACTION = 5;


function createMsg(type, message) {
    const chatContainer = document.getElementById("pragya-chat-container");

    if (type === "user") {
        chatContainer.innerHTML += `
        <div class="pragya-user-msg pragya-msg">
            <span>${message}</span>
        </div>
      `;
    } else {
        chatContainer.innerHTML += `
        <div class="pragya-agent-msg pragya-msg">
            <span>${message}</span>
        </div>
      `;
    }
}


async function sendMsg(type, message) {
    const chat = {
        "type": type,
        "message": message
    };

    const chatState = await getSavedState("chat") || [];
    chatState.push(chat);
    state.saveState("chat", chatState);

    createMsg(type, message);
}

function clearChat() {
    state.saveState("chat", []);

    const chatContainer = document.getElementById("pragya-chat-container");
    chatContainer.innerHTML = "";
}


function clearAllAgentState() {
    state.saveState("finalGoal", null);
    state.saveState("instructionSteps", []);
    state.saveState("currentStep", null);
    state.saveState("chat", []);
}


async function goalAchieved() {
    clearAllAgentState();
    clearChat();

    await sendMsg("agent", "Congratulations! We have achieved the goal.");
}


async function run(prompt = null) { // prompt will be null only when the goal is already set in state
    const agent = new ActionAgent();
    let trial_left = TRIALS;
    let error = null;
    let goal = await getSavedState("finalGoal") || null;
    let instructionSteps = await getSavedState("instructionSteps") || [];

    if (!prompt) {
        if (!goal) {
            throw new Error("Prompt and Goal (in state) both are null");
        }

        //  C O N T I N U E  B Y  S K I P P I N G  F I R S T  S T E P

        // Then it means the page is reloaded after performing an action, and we need to observe the action's result

        agent._wait(WAIT_AFTER_ACTION);

    } else {

        //  F I R S T   S T E P

        while (trial_left > 0) {
            try {
                const currentStep = instructionSteps[0];
                state.saveState("currentStep", currentStep);

                const firstStepResponse = await agentAPI("/next-step", {
                    "goal": goal,
                    "current_step": currentStep,
                });

                console.log("First Step: ", firstStepResponse);
                await sendMsg("agent", "Let's start with the first step.");
                agent.execute(firstStepResponse.command.action, ...firstStepResponse.command.args);
                agent._wait(WAIT_AFTER_ACTION);

                trial_left = TRIALS;
                error = null;

                break;
            } catch (e) {
                console.log(`Error: ${e}`);
                error = e;
                trial_left--;
                console.log(`\nTRIALS LEFT: ${trial_left}times\n`);
            }
        }
    }


    //  O B S E R V A T I O N 

    while (trial_left > 0) {
        try {

            const currentStep = await getSavedState("currentStep") || null;
            const currentElements = await getCurrentElements();

            const observationResponse = await agentAPI("/observation", {
                "goal": goal,
                "current_step": currentStep,
                "current_url": agent.currentUrl(),
                "current_page_elements": currentElements,
            });

            console.log("Observation: ", observationResponse);
            if (observationResponse.completed_current_step) {
                await sendMsg("agent", "Looks like we are going good.");

                instructionSteps.shift();
                state.saveState("instructionSteps", instructionSteps);
            }


            trial_left = TRIALS;
            error = null;

            break;
        } catch (e) {
            console.log(`Error: ${e}`);
            error = e;
            trial_left--;
            console.log(`\nTRIALS LEFT: ${trial_left}times\n`);
        }
    }


    //  N E X T  S T E P  A N D  O B S E R V A T I O N  L O O P

    while (!agent.goalAchieved && trial_left > 0) {
        try {

            // N E X T   S T E P

            const currentStep = instructionSteps[0];
            state.saveState("currentStep", currentStep);

            const nextStepResponse = await agentAPI("/next-step", {
                "goal": goal,
                "current_step": currentStep,
            });

            console.log("Next Step: ", nextStepResponse);
            await sendMsg("agent", "Let's move to the next step.");
            agent.execute(nextStepResponse.command.action, ...nextStepResponse.command.args);
            agent._wait(WAIT_AFTER_ACTION);

            trial_left = TRIALS;
            error = null;

        } catch (e) {
            console.log(`Error: ${e}`);
            error = e;
            trial_left--;
            console.log(`\nTRIALS LEFT: ${trial_left}times\n`);
        }


        // O B S E R V A T I O N

        try {

            const currentStep = await getSavedState("currentStep") || null;
            const currentElements = await getCurrentElements();

            const observationResponse = await agentAPI("/observation", {
                "goal": goal,
                "current_step": currentStep,
                "current_url": agent.currentUrl(),
                "current_page_elements": currentElements,
            });

            console.log("Observation: ", observationResponse);
            if (observationResponse.completed_current_step) {
                await sendMsg("agent", "Looks like we are going good.");

                instructionSteps.shift();
                state.saveState("instructionSteps", instructionSteps);
            }


            trial_left = TRIALS;
            error = null;

            // break;
        } catch (e) {
            console.log(`Error: ${e}`);
            error = e;
            trial_left--;
            console.log(`\nTRIALS LEFT: ${trial_left}times\n`);
        }
    }


    await goalAchieved();

}

// clearAllAgentState();


async function checkPastState() {
    const goal = await getSavedState("finalGoal") || null;
    console.log("Goal: ", goal);
    if (goal) {
        run();
    } else {
        clearAllAgentState();
    }

}

checkPastState();

