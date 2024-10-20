import { showDebugMessage, showGeneralJAMessage } from "../../utils/ChatUtils";
import Config from "../../config";

let lastCalculatedResult = null;
let mathSolved = false;
let publicSpeakingActive = false;
let lastPublicSpeakingTrigger = 0;

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

    const currentTime = Date.now();
    if (currentTime - lastPublicSpeakingTrigger < 5000) {
        showDebugMessage('Public Speaking Demon triggered too quickly. Ignoring.', 'info');
        return;
    }
    lastPublicSpeakingTrigger = currentTime;

    publicSpeakingActive = true;
    showGeneralJAMessage(`Public Speaking Demon activated! Say something in chat (not too short)!`);
    
    const suggestion = new TextComponent(`§7[§3Click for a suggestion§7]`);
    suggestion.setClick("run_command", "/ac " + getRandomPublicSpeakingResponse());
    suggestion.setHover("show_text", "§eClick to send suggetion in chat");
    ChatLib.chat(suggestion);

    if (Config.autoSendPublicSpeakingResponse) {
        ChatLib.say(`/ac getRandomPublicSpeakingResponse`);
        showDebugMessage('Auto-sent public speaking response', 'info');
    }
}

register("chat", (equation) => {
    showDebugMessage("QUICK MATHS triggered with equation: " + equation, 'info');
    solveMath(equation);
}).setChatCriteria("QUICK MATHS! Solve: ${equation}");

register("chat", (player, time) => {
    if (player === Player.getName() && !mathSolved) {
        showGeneralJAMessage(`Great job! You solved the equation in ${time}!`);
        mathSolved = true;
    }
}).setChatCriteria("QUICK MATHS! ${player} answered correctly in ${time}!");

register("chat", (playerName) => {
    if (playerName === Player.getName()) {
        handlePublicSpeaking(playerName);
    }
}).setChatCriteria("[FEAR] Public Speaking Demon: Speak ${playerName}!");

register("chat", () => {
    if (publicSpeakingActive) {
        showGeneralJAMessage("Great job! You've overcome the Public Speaking Demon!");
        publicSpeakingActive = false;
    }
}).setChatCriteria("[FEAR] Public Speaking Demon: Woohoo! Thank you for speaking out loud!");

register("chat", () => {
    if (publicSpeakingActive) {
        showGeneralJAMessage("Your message was too short. Try saying something longer!");
    }
}).setChatCriteria("[FEAR] Public Speaking Demon: Too short! Say more!");

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


export { solveMath };