import { showDebugMessage, showGeneralJAMessage } from "../../utils/ChatUtils";
import { InSkyblock } from "../../utils/Constants";
import Config from "../../config";
import { 
    BLACK, 
    DARK_BLUE, 
    DARK_GREEN, 
    DARK_AQUA, 
    DARK_RED, 
    DARK_PURPLE, 
    GOLD, 
    GRAY, 
    DARK_GRAY, 
    BLUE, 
    GREEN, 
    AQUA, 
    RED, 
    LIGHT_PURPLE, 
    YELLOW, 
    WHITE,
    OBFUSCATED, 
    BOLD, 
    STRIKETHROUGH, 
    UNDERLINE, 
    ITALIC, 
    RESET   } from "../../utils/Constants";

let todos = [];
let isOnHypixel = false;
let justReloaded = true;
let lastTodoDisplay = 0;
let inSkyblock = false;

/**
 * Loads todos from storage if enabled
 */
function loadTodos() {
    if (!Config.enableTodos || !Config.saveTodos) return;

    try {
        const storedTodos = FileLib.read("jcnlkAddons", "data/Todos.json");
        if (storedTodos) {
            todos = JSON.parse(storedTodos);
            showDebugMessage(`Loaded ${todos.length} todos`, 'info');
        }
    } catch (error) {
        showDebugMessage(`Error loading todos: ${error}`, 'error');
    }
}

/**
 * Saves todos to storage if enabled
 */
function saveTodos() {
    if (!Config.enableTodos || !Config.saveTodos) return;

    try {
        FileLib.write("jcnlkAddons", "data/Todos.json", JSON.stringify(todos));
        showDebugMessage(`Saved ${todos.length} todos`, 'info');
    } catch (error) {
        showDebugMessage(`Error saving todos: ${error}`, 'error');
    }
}

/**
 * Adds a new todo
 * @param {string} todoText - The todo text to add
 * @returns {boolean} - Whether the todo was successfully added
 */
function addTodo(todoText) {
    if (!Config.enableTodos) {
        showGeneralJAMessage("Todos are currently disabled in the config!", 'error');
        return false;
    }

    todos.push({
        text: todoText,
        completed: false
    });
    saveTodos();
    showDebugMessage(`Added new todo`, 'info');
    return true;
}

/**
 * Removes a todo
 * @param {number} index - The index of the todo to remove (1-based)
 * @returns {boolean} - Whether the todo was successfully removed
 */
function removeTodo(index) {
    if (!Config.enableTodos) return false;

    if (index > 0 && index <= todos.length) {
        todos.splice(index - 1, 1);
        saveTodos();
        showDebugMessage(`Removed todo #${index}`, 'info');
        return true;
    }
    return false;
}

/**
 * Toggles the completion status of a todo
 * @param {number} index - The index of the todo to toggle (1-based)
 * @returns {boolean} - Whether the todo was successfully toggled
 */
function toggleTodo(index) {
    if (!Config.enableTodos) return false;

    if (index > 0 && index <= todos.length) {
        todos[index - 1].completed = !todos[index - 1].completed;
        
        // Remove if completed and clearCompletedTodos is enabled
        if (todos[index - 1].completed && Config.clearCompletedTodos) {
            todos.splice(index - 1, 1);
        }
        
        saveTodos();
        showDebugMessage(`Toggled todo #${index}`, 'info');
        return true;
    }
    return false;
}

/**
 * Lists all todos
 */
function listTodos() {
    if (!Config.enableTodos) {
        showGeneralJAMessage("Todos are currently disabled in the config!", 'error');
        return;
    }

    // Prevent duplicate displays within 500ms
    const now = Date.now();
    if (now - lastTodoDisplay < 500) {
        showDebugMessage("Prevented duplicate todo list display", 'warning');
        return;
    }
    lastTodoDisplay = now;

    ChatLib.chat(`${GOLD}${BOLD}═══════ Todos ═══════`);

    if (todos.length === 0) {
        ChatLib.chat(new TextComponent(`${WHITE}[Click to create a todo]`)
            .setClick("suggest_command", "/todo add ")
            .setHover("show_text", "§eClick to add a new todo"));
        ChatLib.chat(`${GOLD}${BOLD}══════════════════${RESET}`);
        return;
    }

    todos.forEach((todo, arrayIndex) => {
        const index = arrayIndex + 1;
        const completionSymbol = todo.completed ? `${GREEN}✔${RESET}` : `${RED}✘${RESET}`;
        ChatLib.chat(new TextComponent(`${completionSymbol} ${WHITE}${todo.text} ${DARK_GRAY}[${index}]`)
            .setClick("run_command", `/todo toggle ${index}`)
            .setHover("show_text", `${YELLOW}Click to toggle completion`));
    });

    ChatLib.chat(`${GOLD}${BOLD}══════${RESET} ${GRAY}${todos.length} remaining ${GOLD}${BOLD}══════${RESET}`);
}

/**
 * Handles server join event
 */
register("serverConnect", () => {
    if (!Config.enableTodos) return;

    const serverIP = Server.getIP();
    if (serverIP && serverIP.includes('hypixel')) {
        showDebugMessage("Connected to Hypixel", 'info');
        isOnHypixel = true;
        justReloaded = false;
    } else {
        showDebugMessage("Connected to non-Hypixel server", 'warning');
        isOnHypixel = false;
    }
});

/**
 * Handles world changes (including game mode changes on Hypixel)
 */
register("worldLoad", () => {
    if (!Config.enableTodos || !Config.showTodosOnJoin) return;

    if (justReloaded) {
        const serverIP = Server.getIP();
        if (serverIP && serverIP.includes('hypixel')) {
            showDebugMessage("Module reloaded while on Hypixel", 'warning');
            isOnHypixel = true;
        } else {
            showDebugMessage("Module reloaded while not on Hypixel", 'warning');
            isOnHypixel = false;
        }
        justReloaded = false;
        return;
    }

    if (!isOnHypixel) {
        showDebugMessage("World changed but not on Hypixel", 'warning');
        return;
    }

    // Check if player is entering Skyblock for the first time
    setTimeout(() => {
        const nowInSkyblock = InSkyblock();
        // Only show todos if we weren't in Skyblock before and are now
        if (nowInSkyblock && !inSkyblock && !justReloaded) {
            showDebugMessage("Player entered Skyblock for the first time, showing todos", 'info');
            listTodos();
        } else if (nowInSkyblock && inSkyblock) {
            showDebugMessage("World change within Skyblock, not showing todos", 'info');
        }
        inSkyblock = nowInSkyblock;
    }, 100);
});

/**
 * Handles server disconnect
 */
register("serverDisconnect", () => {
    if (!Config.enableTodos) return;

    showDebugMessage("Disconnected from server", 'warning');
    isOnHypixel = false;
    justReloaded = false;
    inSkyblock = false;
});

// Register the /todo command
register("command", (action, ...args) => {
    if (!Config.enableTodos) {
        showGeneralJAMessage("Todos are currently disabled in the config!", 'error');
        return;
    }

    if (!action) {
        listTodos();
        return;
    }

    switch (action.toLowerCase()) {
        case "add":
            if (args.length === 0) {
                showGeneralJAMessage("Usage: /todo add <text>", 'info');
                return;
            }
            addTodo(args.join(" "));
            listTodos();
            break;

        case "toggle":
            if (args.length !== 1 || isNaN(args[0])) {
                showGeneralJAMessage("Usage: /todo toggle <index>", 'info');
                return;
            }
            toggleTodo(parseInt(args[0]));
            listTodos();
            break;

        case "help":
            ChatLib.chat(`${GOLD}${BOLD}═══════ Todo Help ═══════${RESET}`);
            ChatLib.chat(`${GOLD}/todo ${GRAY}- List all todos${RESET}`);
            ChatLib.chat(`${GOLD}/todo add <text> ${GRAY}- Add a new todo${RESET}`);
            ChatLib.chat(`${GOLD}/todo toggle <index> ${GRAY}- Complete a todo${RESET}`);
            ChatLib.chat(`${GOLD}/todo help ${GRAY}- Show this help message${RESET}`);
            ChatLib.chat(`${GOLD}§l═════════════════════${RESET}`);
            break;

        default:
            showGeneralJAMessage("Unknown action. Use /todo help for usage information.", 'error');
    }
}).setName("todo");

/**
 * Initialize the module and set correct initial states
 */
function initialize() {
    loadTodos();
    justReloaded = true;
    
    // Check if we're already in Skyblock when module loads
    if (Server.getIP()?.includes('hypixel')) {
        isOnHypixel = true;
        // Set initial Skyblock state
        inSkyblock = InSkyblock();
        showDebugMessage(`Module initialized while ${inSkyblock ? 'in' : 'not in'} Skyblock`, 'info');
    }
}

// Export functions and initialize
export {
    initialize,
    addTodo,
    toggleTodo,
    listTodos
};