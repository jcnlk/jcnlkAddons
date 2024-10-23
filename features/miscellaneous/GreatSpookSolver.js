import { showDebugMessage, showGeneralJAMessage } from "../../utils/ChatUtils";
import Config from "../../config";
import ClickableMessageContent from "../../utils/ClickableMessageContent";

let lastCalculatedResult = null;
let mathSolved = false;
let publicSpeakingActive = false;
let lastPublicSpeakingTrigger = 0;
let commitmentPhobiaActive = false;

// Timing variables
let mathStartTime = null;
let publicSpeakingStartTime = null;
let commitmentPhobiaStartTime = null;

function formatTime(ms) {
    return `${ms}ms`;
}

function evaluateExpression(expression) {
    try {
        expression = expression.replace(/x/g, '*');
        showDebugMessage(`Evaluating expression: ${expression}`, 'debug');
        const result = eval(expression);
        showDebugMessage(`Evaluation result: ${result}`, 'debug');
        return result;
    } catch (error) {
        showDebugMessage(`Error evaluating expression: ${error}`, 'error');
        return null;
    }
}

function createClickableMessage(result) {
    const message = new TextComponent(`§7[§3Click to answer§7]`);
    message.setClick("run_command", `/greatspookanswer`);
    message.setHover("show_text", `§eClick to send: ${result}`);
    return message;
}

function solveMath(equation) {
    if (!Config.enableMathTeacherSolver) return;
    
    mathStartTime = Date.now();
    showDebugMessage(`Math Teacher started at: ${mathStartTime}`, 'info');

    showDebugMessage(`Solving equation: ${equation}`, 'info');
    
    const result = evaluateExpression(equation);
    if (result !== null) {
        lastCalculatedResult = result;
        mathSolved = false;
        const response = `The answer is: ${result}`;
        showDebugMessage(`Solved equation. ${response}`, 'info');
        
        showGeneralJAMessage(`${response} `);
        ChatLib.chat(createClickableMessage(result));
        
        if (Config.autoSendMathTeacherAnswer) {
            ChatLib.say(result.toString());
            showDebugMessage('Auto-sent answer to chat', 'info');
        }
    } else {
        showGeneralJAMessage("Unable to solve the equation.");
        showDebugMessage("Failed to solve equation", 'error');
    }
}

function getRandomPublicSpeakingResponse() {
    const responses = [
        "This message is for the Public Speaking Demon. Other players can ignore it.",
        "Responding to the Public Speaking Demon. Feel free to disregard this message.",
        "Addressing the Public Speaking Demon challenge. No need for others to respond.",
        "This is for a Spooky Event mob. Other players can ignore this message.",
        "Talking to the Public Speaking Demon. Please ignore if you're not the mob.",
        "Message for the Spooky Event. Other players can continue as normal.",
        "Responding to a game event. No action needed from other players.",
        "This is part of the Public Speaking challenge. Others can disregard.",
        "Interacting with the Public Speaking Demon. No need for player responses.",
        "Spooky Event message. Please ignore unless you're the Public Speaking Demon."
    ];
    return responses[Math.floor(Math.random() * responses.length)];
}

function handlePublicSpeaking(playerName) {
    if (!Config.enablePublicSpeakingDemonSolver) return;

    publicSpeakingStartTime = Date.now();
    showDebugMessage(`Public Speaking started at: ${publicSpeakingStartTime}`, 'info');

    const currentTime = Date.now();
    if (currentTime - lastPublicSpeakingTrigger < 5000) {
        showDebugMessage('Public Speaking Demon triggered too quickly. Ignoring.', 'info');
        return;
    }
    lastPublicSpeakingTrigger = currentTime;

    publicSpeakingActive = true;
    showGeneralJAMessage(`Public Speaking Demon activated! Say something in chat (not too short)!`);
    
    const response = getRandomPublicSpeakingResponse();
    const suggestion = new TextComponent(`§7[§3Click for a suggestion§7]`);
    suggestion.setClick("run_command", "/ac " + response);
    suggestion.setHover("show_text", "§eClick to send suggestion in chat");
    ChatLib.chat(suggestion);

    if (Config.autoSendPublicSpeakingResponse) {
        ChatLib.say(response);
        showDebugMessage('Auto-sent public speaking response', 'info');
    }
}

function handleCommitmentPhobia(message) {
    commitmentPhobiaStartTime = Date.now();
    showDebugMessage(`Commitment Phobia started at: ${commitmentPhobiaStartTime}`, 'info');

    try {
        if (!message) {
            showDebugMessage("Received null message in handleCommitmentPhobia", 'warning');
            return;
        }

        const messageContent = new ClickableMessageContent(message);
        
        if (messageContent.hasClickableCommand()) {
            const command = messageContent.getCommand();
            if (!command) {
                showDebugMessage("No valid command found in clickable message", 'warning');
                return;
            }

            showDebugMessage(`Detected Commitment Phobia command: ${command}`, 'info');
            commitmentPhobiaActive = true;
            
            if (Config.autoSendCommitmentPhobiaResponse) {
                setTimeout(() => {
                    ChatLib.say(command);
                    showDebugMessage('Auto-executed commitment command', 'info');
                }, 250);
            } else {
                const clickableMessage = ClickableMessageContent.createClickableMessage(
                    "§7[§3Click to sign§7]",
                    command,
                    "§eClick to sign the document"
                );
                
                showGeneralJAMessage("Commitment Phobia detected! ");
                ChatLib.chat(clickableMessage);
            }
        }
    } catch (error) {
        showDebugMessage(`Error in handleCommitmentPhobia: ${error}`, 'error');
    }
}

// Chat Triggers for Math Teacher
register("chat", (equation) => {
    showDebugMessage("QUICK MATHS triggered with equation: " + equation, 'info');
    solveMath(equation);
}).setChatCriteria("QUICK MATHS! Solve: ${equation}");

register("chat", (player, time) => {
    if (player === Player.getName() && !mathSolved && mathStartTime) {
        const solveTime = Date.now() - mathStartTime;
        showGeneralJAMessage(`Sucessfully solved Math Teacher in ${formatTime(solveTime)}!`);
        mathSolved = true;
        mathStartTime = null;
    }
}).setChatCriteria("QUICK MATHS! ${player} answered correctly in ${time}!");

// Chat Triggers for Public Speaking Demon
register("chat", (playerName) => {
    if (playerName === Player.getName()) {
        handlePublicSpeaking(playerName);
    }
}).setChatCriteria("[FEAR] Public Speaking Demon: Speak ${playerName}!");

register("chat", () => {
    if (publicSpeakingActive && publicSpeakingStartTime) {
        const solveTime = Date.now() - publicSpeakingStartTime;
        showGeneralJAMessage(`Successfully solved Public Speaking Demon in ${formatTime(solveTime)}!`);
        publicSpeakingActive = false;
        publicSpeakingStartTime = null;
    }
}).setChatCriteria("[FEAR] Public Speaking Demon: Woohoo! Thank you for speaking out loud!");

register("chat", () => {
    if (publicSpeakingActive) {
        showGeneralJAMessage("Your message was too short. Try saying something longer!");
    }
}).setChatCriteria("[FEAR] Public Speaking Demon: Too short! Say more!");

// Chat Trigger for Commitment Phobia
register("chat", (message, event) => {
    const textContent = ChatLib.removeFormatting(message);
    if (textContent.includes("Click HERE to sign")) {
        showDebugMessage("Commitment Phobia message detected", 'info');
        handleCommitmentPhobia(event.message);
    }
}).setChatCriteria("${message}");

// Chat Trigger for Commitment Phobia completion
register("chat", (message) => {
    if (commitmentPhobiaActive && commitmentPhobiaStartTime) {
        const solveTime = Date.now() - commitmentPhobiaStartTime;
        showGeneralJAMessage(`Successfully solved Commitment Phobia in ${formatTime(solveTime)}!`);
        commitmentPhobiaActive = false;
        commitmentPhobiaStartTime = null;
    }
}).setChatCriteria("[FEAR] Commitment Phobia: ${message}");

// Command for sending Great Spook answer
register("command", () => {
    if (lastCalculatedResult !== null && !mathSolved) {
        ChatLib.say(lastCalculatedResult.toString());
        showDebugMessage(`Sent Great Spook answer: ${lastCalculatedResult}`, 'info');
    } else if (mathSolved) {
        showGeneralJAMessage("The Math question has already been solved.");
    } else {
        showDebugMessage("No recent Math answer to send", 'warning');
    }
}).setName("greatspookanswer");

export { solveMath, handleCommitmentPhobia };