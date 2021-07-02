const $ = require('../components/util/jquery.js');
const commands = require("../components/scripts/commands.js").cmdlist;

const termwindow = $(".window");
const termwindow_ = document.querySelector(".window")!; // for scrolling to work

/**
 * Makes a styled prompt box
 * @param message the string to go inside the span
 * @returns a span with the class 'prompt-box' with a string inside
 */
const promptBox = (message: string) => {
    return "<span class=\"prompt-box\">" + message + "</span>"
}

/**
 * Makes a styled path box
 * @param message the string to go inside the span
 * @returns a span with the class 'path-box' with a string inside
 */
const pathBox = (message: string) => {
    return "<span class=\"path-box\">" + message + "</span>"
}

/**
 * Makes a power box. Not styled but good for typing after
 * @param prompt the prompt box
 * @param path the path box
 * @returns a span with the class 'power-box'
 */
const powerBox = (prompt: string, path: string) => {
    return "<span class=\"power-box\">" + prompt + path + "</span>"
}

/**
 * Makes a span element with a custom class. Good for styling
 * @param classname the name of the class
 * @param message the string to go inside span
 * @returns a span with the set class name
 */
const span = (classname: string, message: string) => {
    return "<span class=\"" + classname + "\">" + message + "</span>"
}

/**
 * Enables smooth scrolling down the window
 */
const scroll_ = () => {
    termwindow_.scrollBy({
        top: termwindow_.scrollHeight,
        behavior: "smooth"
    })
}

let command = "";
/**
 * Appends a command to the terminal window
 * @param str the command to append
 */
const appendCommand = (str: string) => {
    termwindow.append(str);
    command += str;
}

/**
 * Erases text from the terminal
 * @param n the number of letters to erase
 */
const erase = (n: number) => {
    command = command.slice(0, -n);
    termwindow.html(termwindow.html().slice(0, -n));
}

const prompt_ = promptBox(`@bright`);
let path_ = pathBox("scp.net");
const powerbox_ = powerBox(prompt_, path_);
/**
 * Appends the prompt to the terminal window
 */
const appendPrompt = () => {
    termwindow.append(`${powerbox_} `);
    scroll_();
}

/**
 * Renders login prompt (no functionality yet)
 */
const setLogin = () => {
    termwindow.append("Enter login credentials\n");
    termwindow.append("Id: \n");
    termwindow.append("Password: \n");
    termwindow.append("Login successful.\n");
}

let inMenu = false;
const showMainMenu = () => {
    inMenu = true;
    inManual = false;
    inDatabase = false;
    termwindow.append("Enter a number to choose a topic. For commands, type 'help'. To exit, type 'exit'.\n");
    termwindow.append("1. User Manual\n2. Knowledge Base\n");
}

let inManual = false;
const showUserManual = () => {
    inManual = true;
    inMenu = false;
    inDatabase = false;
    termwindow.append("Welcome to the User Manual. If you have any doubts about The Foundation you can resolve them here.\nEnter a number to choose a topic.\n");
    termwindow.append("1. Object Classes\n2.Personnel\n3.Facilities\n4.Task Forces\n5. Exit to previous menu\n")
    //termwindow.append(span("status-fail", "User Manual not found. Type '2' to exit.\n"));
}

let inDatabase = false;
const showDatabase = () => {
    inMenu = false;
    inManual = false;
    inDatabase = true;
    termwindow.append("Welcome to the SCP Foundation Knowledge Base. Enter a number to choose an option. For commands, type 'help'. To exit, type 'exit'.\n");
    termwindow.append("1. Search database\n2. Back to previous menu.\n");
}

const processCommand = () => {

    // Divide the command into the name and its arguments
    let args = command.split(" ");
    let typedCommand = commands.find((cmd: { name: string; }) => cmd.name === args[0]);
    args.shift();

    if (inMenu) {
        if (command === "1") {
            // go to user manual
            showUserManual();
        }
        else if (command === "2") {
            // go to database
            showDatabase();
        }
    }
    else if (inManual) {
        if (command === "1") {
            termwindow.append(span("status-fail", "Error.\n"));
        }
        else if (command === "2") {
            // go to menu
            showMainMenu();
        }
    }
    else if (inDatabase) {
        if (command === "1") {
            termwindow.append(span("status-fail", "Error. Cannot access database at this time.\n"));
        }
        else if (command === "2") {
            showMainMenu();
        }
    }

    // Execute the command or return error message. Numbers for menu options do not get processed here.
    if (isNaN(parseInt(command))) {
        if (typedCommand == null) termwindow.append(span("status-fail", `Command not found: ${command}\n`)); // "Command not found: " + command + "\n"
        else typedCommand.function(args);
    }

    // Clear the command for next input
    command = "";
    appendPrompt();
}

/**
 * Renders things to the terminal on startup
 */
const startTerminal = () => {
    termwindow.append("SCPnet v1.3.0 active\n");
    setLogin();
    termwindow.append("Welcome to SCPnet v 1.3.0. For commands, type 'help'. To exit, type 'exit'. For more info, type 'manual'.\n")
    appendPrompt();
}

// Allows typing
document.addEventListener("keypress", (e) => {
    let key = e.which;
    switch (key) {
        case 13: // enter
            termwindow.append("\n");
            if (command.trim().length !== 0) {
                processCommand();
            }
            else {
                appendPrompt();
            }
            scroll_();
            break;
        default:
            e.preventDefault();
            appendCommand(String.fromCharCode(key));
            scroll_();
    }
})

// Allows backspacing
document.addEventListener("keydown", (e) => {
    const key = e.which;
    if (key == 8) { // backspace
        e.preventDefault();
        if (command !== "" && command !== "\n") {
            erase(1);
        }
        scroll_();
    }
})

startTerminal();