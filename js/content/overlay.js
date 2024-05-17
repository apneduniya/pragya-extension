

// const state = new State();


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
  await state.saveState("chat", chatState);

  createMsg(type, message);
}


async function loadChat() {
  const chat = await getSavedState("chat") || [];
  console.log("Chat: ", chat);
  chat.forEach(msg => {
    createMsg(msg.type, msg.message);
  });
}

function clearChat() {
  state.saveState("chat", []);

  const chatContainer = document.getElementById("pragya-chat-container");
  chatContainer.innerHTML = "";
}


async function handlePromptSubmit() {
  const prompt = document.getElementById("pragya-prompt").value;
  document.getElementById("pragya-prompt").value = "";
  sendMsg("user", prompt);

  /*
  * Final Goal
  */
  const finalGoalResponse = await agentAPI("/final-goal", {
    "user_objective": prompt
  });
  console.log("Final Goal: ", finalGoalResponse);
  const finalGoal = finalGoalResponse.goal;
  await state.saveState("finalGoal", finalGoal);
  await sendMsg("agent", "Goal set successfully!");

  /*
  * Instructions
  */
  const instructionResponse = await agentAPI("/instructions", {
    "goal": finalGoal
  });
  console.log("Instruction: ", instructionResponse);
  const instructionSteps = instructionResponse.steps;
  await state.saveState("instructionSteps", instructionSteps);
  await sendMsg("agent", "Generated instructions successfully!");


  await run(prompt);
}



