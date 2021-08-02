const $ = require('../components/util/jquery.js');
const commands = require("../components/scripts/commands.js").cmdlist;
const path = require("path");

const termwindow = $("#window");
const termwindow_ = document.querySelector("#window")!; // for scrolling to work
const page = $(".page-data");
/**
 * Timeout but better
 * @param ms time in milliseconds
 */
const sleep = (ms: any) => {
    return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Makes a styled prompt box
 * @param message the string to go inside the span
 * @returns a span with the class 'prompt-box' with a string inside
 */
const promptBox = (message: string) => {
    return "<span class=\"prompt-box\">" + message + "</span>";
}

/**
 * Makes a styled path box
 * @param message the string to go inside the span
 * @returns a span with the class 'path-box' with a string inside
 */
const pathBox = (message: string) => {
    return "<span class=\"path-box\">" + message + "</span>";
}

/**
 * Makes a power box. Not styled but good for typing after
 * @param prompt the prompt box
 * @param path the path box
 * @returns a span with the class 'power-box'
 */
const powerBox = (prompt: string, path: string) => {
    return "<span class=\"power-box\">" + prompt + path + "</span>";
}

/**
 * Makes a box for page data; Ideally for displaying scp data.
 * @param content The content to be in the page data box
 * @returns 
 */
const pageData = (...content: any) => {
    return "<div class=\"page-data\">" + content + "</div>";
}

const neofetch = (content: any[]) => {
    for (const item of content) {
        termwindow.append("<div class=\"neofetch\">" + item + "</div>");
    }
}

const h3 = (string: string) => {
    return `<h3 class="title3"> ${string} </h3>`;
}
const h5 = (string: string) => {
    return `<h5 class="title5"> ${string} </h5>`;
}

/**
 * Makes a span element with a custom class. Good for styling
 * @param classname the name of the class
 * @param message the string to go inside span
 * @returns a span with the set class name
 */
const span = (classname: string, message: string) => {
    return "<span class=\"" + classname + "\">" + message + "</span>";
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
    //termwindow.append(`${powerbox_} `);

    //termwindow.append(`┌ root@sudo-user\n`)
    //termwindow.append("└ $ ");
    termwindow.append("root@user:~$ ");
    scroll_();
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

let inMenu = false;
const showMainMenu = () => {
    inMenu = true;
    inManual = false;
    inDatabase = false;
    termwindow.append("Enter a number to choose a topic. To exit, type 'manual'.\n");
    termwindow.append("1. User Manual\n2. Knowledge Base\n");
}

let inManual = false;
const showUserManual = () => {
    inManual = true;
    inMenu = false;
    inDatabase = false;
    termwindow.append("Welcome to the User Manual. If you have any doubts about The Foundation you can resolve them here.\nEnter a number to choose a topic.\n");
    termwindow.append("1. Object Classes\n2. Personnel\n3. Facilities\n4. Task Forces\n5. Exit to previous menu\n")
    //termwindow.append(span("status-fail", "User Manual not found. Type '2' to exit.\n"));
}

let inDatabase = false;
const showDatabase = () => {
    inMenu = false;
    inManual = false;
    inDatabase = true;
    termwindow.append("Welcome to the SCP Foundation Knowledge Base. Enter a number to choose an option. To exit, type 'manual'.\n");
    termwindow.append("1. Groups of Interest\n2. Anomalous Items\n3. Extranormal Events\n4. Unexplained Locations\n5. SCP Database\n6. Back to previous menu.\n");
}

const processCommand = async () => {

    // Divide the command into the name and its arguments
    const args = command.split(" ");
    const typedCommand = commands.find((cmd: { name: string; }) => cmd.name === args[0]);
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
        if (command === "1" || command === "2" || command === "3" || command === "4") {
            termwindow.append(span("status-fail", "Error.\n"));
        }
        else if (command === "5") {
            // go to menu
            showMainMenu();
        }
    }
    else if (inDatabase) {
        if (command === "1" || command === "2" || command === "3" || command === "4" || command === "5") {
            termwindow.append(span("status-fail", "Error. Cannot access database at this time.\n"));
        }
        else if (command === "6") {
            showMainMenu();
        }
    }

    // Execute the command or return error message. Numbers for menu options do not get processed here.
    if (isNaN(parseInt(command))) {
        if (inDatabase || inManual || inMenu) {
            console.log(command);
            if (command === "manual") {
                inManual = false;
                inMenu = false;
                inDatabase = false;
                command = "";
                appendPrompt();
                return;
            }
            termwindow.append(span("status-fail", "Not a supported menu option. To use commands, exit the menu by typing 'manual'\n"));
        }
        else if (typedCommand == null) termwindow.append(span("status-fail", `Command not found: ${command}\n`));
        else await typedCommand.function(args);
    }

    // Clear the command for next input
    command = "";
    appendPrompt();
}

/**
 * Renders things to the terminal on startup
 */
const startTerminal = () => {
    termwindow.append(`SCiPnet Data Network [version 1.3.0] ${span("status-success", "active")}\n\n`);
    termwindow.append(span("status-red-alert", "WARNING. THE SCP FOUNDATION DATABASE IS CLASSIFIED! ACCESS BY UNAUTHORIZED PERSONNEL IS STRICTLY PROHIBITED! PERPETRATORS WILL BE TRACKED, LOCATED, AND DETAINED!\n\n"));

    setLogin();

    termwindow.append("Welcome to SCPnet v 1.3.0. For commands, type 'help'. To exit, type 'exit'. For more info, type 'manual'.\n")
    appendPrompt();
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

// Cursor handling
document.addEventListener("keydown", (e) => {
    termwindow_.classList.add("pause-cursor");
})
document.addEventListener("keyup", (e) => {
    termwindow_.classList.remove("pause-cursor");
})

startTerminal();
