import { showDebugMessage } from "../../utils/ChatUtils";
import { InSkyblock } from "../../utils/Constants";
import Config from "../../config";

let todos = [];
let isOnHypixel = false;
let justReloaded = true;
let lastTodoDisplay = 0;

/**
 * Loads todos from storage if enabled
 */
function loadTodos() {
    if (!Config.enableTodos || !Config.saveTodos) return;

    try {
        const storedTodos = FileLib.read("jcnlkAddons", "data/Todos.json");
        if (storedTodos) {
            todos = JSON.parse(storedTodos);
            showDebugMessage(`Loaded ${todos.length} todos`);
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
        showDebugMessage(`Saved ${todos.length} todos`);
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
        ChatLib.chat("§cTodos are currently disabled in the config!");
        return false;
    }

    todos.push({
        text: todoText,
        completed: false
    });
    saveTodos();
    showDebugMessage(`Added new todo`);
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
        listTodos();
        showDebugMessage(`Removed todo #${index}`);
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
        listTodos();
        showDebugMessage(`Toggled todo #${index}`);
        return true;
    }
    return false;
}

/**
 * Lists all todos
 */
function listTodos() {
    if (!Config.enableTodos) {
        ChatLib.chat("§cTodos are currently disabled in the config!");
        return;
    }

    // Prevent duplicate displays within 500ms
    const now = Date.now();
    if (now - lastTodoDisplay < 500) {
        showDebugMessage("Prevented duplicate todo list display");
        return;
    }
    lastTodoDisplay = now;

    ChatLib.chat("§6§l═══════ Todos ═══════");

    if (todos.length === 0) {
        ChatLib.chat(new TextComponent("§f[Click to create a todo]")
            .setClick("suggest_command", "/todo add ")
            .setHover("show_text", "§eClick to add a new todo"));
        ChatLib.chat("§6§l══════════════════");
        return;
    }

    todos.forEach((todo, arrayIndex) => {
        const index = arrayIndex + 1;
        const completionSymbol = todo.completed ? "§a[✔]" : "§c[✘]";
        ChatLib.chat(new TextComponent(`§f[${index}] §6${todo.text} ${completionSymbol}`)
            .setClick("run_command", `/todo toggle ${index}`)
            .setHover("show_text", "§eClick to toggle completion"));
    });

    ChatLib.chat(`§6§l══════ §r§7${todos.length} remaining §6§l══════`);
}

/**
 * Handles server join event
 */
register("serverConnect", () => {
    if (!Config.enableTodos) return;

    const serverIP = Server.getIP();
    if (serverIP && serverIP.includes('hypixel')) {
        showDebugMessage("Connected to Hypixel");
        isOnHypixel = true;
        justReloaded = false;
    } else {
        showDebugMessage("Connected to non-Hypixel server");
        isOnHypixel = false;
    }
});

/**
 * Handles world changes (including game mode changes on Hypixel)
 */
register("worldLoad", () => {
    if (!Config.enableTodos || !Config.showTodosOnJoin) return;

    // Check if we're on Hypixel when module starts
    if (justReloaded) {
        const serverIP = Server.getIP();
        if (serverIP && serverIP.includes('hypixel')) {
            showDebugMessage("Module reloaded while on Hypixel");
            isOnHypixel = true;
        } else {
            showDebugMessage("Module reloaded while not on Hypixel");
            isOnHypixel = false;
        }
        return;  // Don't process the world load event during reload
    }

    if (!isOnHypixel) {
        showDebugMessage("World changed but not on Hypixel");
        return;
    }

    // Reduced delay to 100ms
    setTimeout(() => {
        if (InSkyblock()) {
            showDebugMessage("Player joined Skyblock, showing todos");
            listTodos();
        } else {
            showDebugMessage("World changed on Hypixel but not Skyblock");
        }
    }, 100);
});

/**
 * Handles server disconnect
 */
register("serverDisconnect", () => {
    if (!Config.enableTodos) return;

    showDebugMessage("Disconnected from server");
    isOnHypixel = false;
    justReloaded = false;
});

// Register the /todo command
register("command", (action, ...args) => {
    if (!Config.enableTodos) {
        ChatLib.chat("§cTodos are currently disabled in the config!");
        return;
    }

    if (!action) {
        listTodos();
        return;
    }

    switch (action.toLowerCase()) {
        case "add":
            if (args.length === 0) {
                ChatLib.chat("§cUsage: /todo add <text>");
                return;
            }
            addTodo(args.join(" "));
            listTodos();
            break;

        case "toggle":
            if (args.length !== 1 || isNaN(args[0])) {
                ChatLib.chat("§cUsage: /todo toggle <index>");
                return;
            }
            toggleTodo(parseInt(args[0]));
            break;

        case "help":
            ChatLib.chat("§6§l═══════ Todo Help ═══════");
            ChatLib.chat("§6/todo §7- List all todos");
            ChatLib.chat("§6/todo add <text> §7- Add a new todo");
            ChatLib.chat("§6/todo toggle <index> §7- Complete a todo");
            ChatLib.chat("§6/todo help §7- Show this help message");
            ChatLib.chat("§6§l═════════════════════");
            break;

        default:
            ChatLib.chat("§cUnknown action. Use /todo help for usage information.");
    }
}).setName("todo");

// Initialize the module
function initialize() {
    loadTodos();
    showDebugMessage("Todo module initialized");
    justReloaded = true;
}

// Export functions and initialize
export {
    initialize,
    addTodo,
    toggleTodo,
    listTodos
};