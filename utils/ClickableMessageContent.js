import { showDebugMessage } from "./ChatUtils";
import config from "../config";

class ClickableMessageContent {
    /**
     * Creates a new instance to handle clickable message content
     * @param {Message} message - The chat message to analyze
     */
    constructor(message) {
        this.message = message;
        this.messageStr = message ? message.toString() : '';
        this.clickableContent = null;
        this.parseMessage();
    }

    /**
     * Parses the message to extract clickable content
     * @private
     */
    parseMessage() {
        try {
            if (!this.messageStr || !this.messageStr.includes('clickEvent')) {
                return;
            }

            // Extract clickEvent information
            const clickEventMatch = this.messageStr.match(/clickEvent=ClickEvent{action=([^,]+), value='([^']+)'}/);
            if (!clickEventMatch || clickEventMatch[1] !== 'RUN_COMMAND') {
                return;
            }

            // Extract main text
            const textMatch = this.messageStr.match(/text='([^']+)'/);
            const text = textMatch ? textMatch[1] : '';

            // Extract hover text
            const hoverMatch = this.messageStr.match(/hoverEvent=HoverEvent{[^}]*value='([^']+)'}/);
            const hoverText = hoverMatch ? hoverMatch[1] : null;

            this.clickableContent = {
                text: text,
                command: clickEventMatch[2],
                hover: hoverText
            };
        } catch (error) {
            showDebugMessage(`Error parsing clickable message: ${error}`, 'error');
        }
    }

    /**
     * Checks if the message contains a clickable command
     * @returns {boolean}
     */
    hasClickableCommand() {
        return this.clickableContent !== null;
    }

    /**
     * Gets the command from the clickable content
     * @returns {string|null}
     */
    getCommand() {
        return this.clickableContent?.command || null;
    }

    /**
     * Creates a new clickable message component
     * @param {string} text - The text to display
     * @param {string} command - The command to run when clicked
     * @param {string} hoverText - The text to show when hovering
     * @returns {TextComponent} The created text component
     */
    static createClickableMessage(text, command, hoverText) {
        try {
            const message = new TextComponent(text);
            message.setClick("run_command", command);
            if (hoverText) {
                message.setHover("show_text", hoverText);
            }
            return message;
        } catch (error) {
            showDebugMessage(`Error creating clickable message: ${error}`, 'error');
            return new TextComponent(text);
        }
    }

    /**
     * Static method to check if a message contains clickable content
     * @param {Message} message - The message to check
     * @returns {boolean}
     */
    static isClickable(message) {
        if (!message) return false;
        const messageStr = message.toString();
        return messageStr.includes('clickEvent') && messageStr.includes('RUN_COMMAND');
    }
}

// Debug chat trigger
let isWaitingForMessage = false;

register("chat", (event) => {
    if (!config.debugMode && !isWaitingForMessage) return;

    try {
        const content = new ClickableMessageContent(event.message);
        if (content.hasClickableCommand()) {
            showDebugMessage(`Command: ${content.getCommand()}`, 'info');
        }
        isWaitingForMessage = false;
    } catch (error) {
        showDebugMessage(`Error processing clickable message: ${error}`, 'error');
    }
});

// Command to check next message
register("command", () => {
    isWaitingForMessage = true;
    showDebugMessage("Waiting for next chat message...", 'info');
}).setName("checkclick");

export default ClickableMessageContent;