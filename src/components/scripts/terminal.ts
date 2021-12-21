import $ from "jquery";
const commands = require("../components/scripts/commands.js").cmdlist;
const { span, scrollPage, scrollToLink, getVersion, appendPrompt } = require("../components/scripts/util.js");

const termwindow = $("#window");
let input : JQuery<HTMLElement>;

let command = "";
const commandHistory = [''];
let historyIndex = 0;
/**
 * Appends a command to the terminal window
 * @param str the command to append
 */
const appendCommand = (str: string) => {
    switch(str){
        case "<":
            input.append('&lt;');
            break;
        case ">":
            input.append('&gt;');
            break;
        case "&":
            input.append('&amp;');
            break;
        default:
            input.append(str);
            break;    
    }
    command += str;
}

/**
 * Erases text from the terminal
 * @param n the number of letters to erase
 */
const erase = (n: number) => {
    command = command.slice(0, -n);
    input.html(input.text().slice(0, -n));
}

function clearCommand(){
    if (command.length > 0){
        erase(command.length);
    }
}

/**
 * Renders login prompt (no functionality yet)
 */
const setLogin = () => {
    termwindow.append("Accessing classified information. Enter login credentials:\n");
    termwindow.append("Please enter Foundation ID:\n > ********** \n");
    termwindow.append("Please enter password:\n > ******************** \n\n");
    termwindow.append("Password accepted. Validating...\n");
    termwindow.append(span("status-success", "Clearance granted. ") + "Welcome authorized personnel.\n\n");
}

const processCommand = async () => {
    // Divide the command into the name and its arguments
    const args = command.split(" ");
    const typedCommand = commands.find((cmd: { name: string; }) => cmd.name === args[0]);
    args.shift();

    // Execute the command or return error message.
    if (typedCommand == null) {
        termwindow.append(span("status-fail", `Command not found: ${command}\n`));
    }
    else await typedCommand.function(args);

    // Clear the command for next input
    commandHistory.splice(1, 0, command);
    command = "";
    historyIndex = 0;
    commandHistory[0] = "";
    appendPrompt();
    updateInput();
    if (typedCommand != null) {
        if (typedCommand.name == "access") {
            scrollToLink();
        }
    }
    else scrollPage();
}

const updateInput = () => {
    input.removeClass("current cursor-block");
    termwindow.append(span("cmd-input cursor-block current", ""));
    input = $(".current");
}

/**
 * Renders things to the terminal on startup
 */
const startTerminal = async () => {
    termwindow.append(`SCiPnet Data Network [version ${await getVersion()}] ${span("status-success", "active")}\n\n`);
    termwindow.append(span("status-red-alert", "WARNING. THE SCP FOUNDATION DATABASE IS CLASSIFIED! ACCESS BY UNAUTHORIZED PERSONNEL IS STRICTLY PROHIBITED! PERPETRATORS WILL BE TRACKED, LOCATED, AND DETAINED!\n\n"));

    setLogin();

    termwindow.append(`Welcome to SCiPnet v${await getVersion()}. For commands, type 'help'. To exit, type 'exit'. For more info, type 'manual'.\n`)
    appendPrompt();
    termwindow.append(span("cmd-input cursor-block current", ""));
    input = $(".current");
}

// Allows typing
document.addEventListener("keypress", async (e) => {
    const key = e.which;
    switch (key) {
        case 13: // enter
            termwindow.append("\n");
            if (command.trim().length !== 0) {
                processCommand();
            }
            else {
                appendPrompt();
                scrollPage();
                updateInput();
            }
            break;
        default:
            e.preventDefault();
            appendCommand(String.fromCharCode(key));
            scrollPage();
    }
})

document.addEventListener("keydown", (e) => {
    // Allows backspacing
    const key = e.which;
    if (key == 8) { // backspace
        e.preventDefault();
        if (command !== "" && command !== "\n") {
            erase(1);
        }
        scrollPage();
    }
    // Allows moving through command history
	if (key === 38 || key === 40) {
        e.preventDefault();
        
        // Up key
        if (key === 38) {
            if (historyIndex < commandHistory.length - 1) historyIndex++;
        } 
        // Down key
        else if (key === 40) {
            if (historyIndex > 0) historyIndex--;
        }

        // Get command and append it to the terminal
        const cmd = (historyIndex >= 0) ? commandHistory[historyIndex] : '';
        if (cmd != undefined) {
            clearCommand();
            appendCommand(cmd);
        }
        scrollPage();
    }
    // Allows tab completion for commands
    if (key === 9) {
        e.preventDefault();
        const args = command.split(" ");
        const typedCommand = args[0];
        const commandslist = commands; // copying it so we dont filter the actual list. something something safety
        const suggestedCommands = commandslist.filter(((cmd: { name: string; }) => cmd.name.startsWith(typedCommand)));
        let suggestion = suggestedCommands.find((cmd: { name: string }) => cmd.name.startsWith(typedCommand));
        if (suggestion != undefined) {
            clearCommand();
            appendCommand(suggestion.name);
        }
        scrollPage();
    }
})

// Cursor handling
document.addEventListener("keydown", (e) => {
    input.addClass("pause-cursor");
})
document.addEventListener("keyup", (e) => {
    input.removeClass("pause-cursor");
})

startTerminal();