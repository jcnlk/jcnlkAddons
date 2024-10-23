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
            if (!this.messageStr) {
                showDebugMessage("Empty message received", 'warning');
                return;
            }

            // For Great Spook specific messages
            if (this.messageStr.includes("Click HERE to sign")) {
                const match = this.messageStr.match(/run_command:\/([^}]+)/);
                if (match) {
                    this.clickableContent = {
                        text: "Click HERE to sign",
                        command: `/${match[1].trim()}`,
                        hover: "Click to sign"
                    };
                    return;
                }
            }

            // General clickable content parsing
            const clickEventMatch = this.messageStr.match(/clickEvent=ClickEvent\{action=([^,]+),\s*value='([^']+)'\}/);
            if (clickEventMatch && clickEventMatch[1] === 'RUN_COMMAND') {
                const command = clickEventMatch[2];
                const textMatch = this.messageStr.match(/text='([^']+)'/);
                const hoverMatch = this.messageStr.match(/hoverEvent=HoverEvent\{[^}]*value='([^']+)'\}/);

                this.clickableContent = {
                    text: textMatch ? textMatch[1] : '',
                    command: command,
                    hover: hoverMatch ? hoverMatch[1] : null
                };
            }
        } catch (error) {
            showDebugMessage(`Error parsing clickable message: ${error}`, 'error');
        }
    }

    /**
     * Checks if the message contains a clickable command
     * @returns {boolean}
     */
    hasClickableCommand() {
        return this.clickableContent !== null && this.clickableContent.command !== null;
    }

    /**
     * Gets the command from the clickable content
     * @returns {string|null}
     */
    getCommand() {
        return this.clickableContent?.command || null;
    }

    /**
     * Gets the hover text from the clickable content
     * @returns {string|null}
     */
    getHoverText() {
        return this.clickableContent?.hover || null;
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
            if (command) {
                message.setClick("run_command", command);
            }
            if (hoverText) {
                message.setHover("show_text", hoverText);
            }
            return message;
        } catch (error) {
            showDebugMessage(`Error creating clickable message: ${error}`, 'error');
            return new TextComponent(text);
        }
    }
}

export default ClickableMessageContent;