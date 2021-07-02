
/**
* list -objectclass
* access -scpnumber
* security -scpnumber
* close
* close -all
* exit
*/

import { app } from "electron";

let error = false;
let helpflag = false;

/**
 * Proccesses the options in a command
 * @param args the command args
 * @param flags the command flags. can be null
 * @param count number of args required
 */
const checkOptions = (args: any[], flags: string | any[] | null, count: number) => {
    error = false;
    if (args) {
        // valid options will start with `-`
        const options = args.map(i => {
            if (i.startsWith("-")) {
                return i;
            }
        })
        // make sure there arent too many options being supplied
        if (options.length > count) {
            error = true;
            termwindow.append(span("status-fail", "Error: Command has too many args.\n"));
            return;
        }
        // the help flag is available to any command
        if (options[0] === "-help") {
            helpflag = true;
            return;
        }
        else {
            if (flags === null && options.length > 0 && !options.includes(undefined)){
                error = true;
                termwindow.append(span("status-fail", `'${options[0]}' does not match the supported flags.\n`));
                return;
            }
            if (flags){
                for (const f of flags){
                    for (const p of options) {
                        if (f === p){
                            error = false;
                            return;
                        }
                        else {
                            error = true;
                        }
                    }
                }
                if (error){
                    termwindow.append(span("status-fail", `'${options[0]}' does not match the supported flags.\n`));
                }
            }
        }
    }
}

/**
 * Prints the usage of a given command
 * @param command the command to get help for
 */
const getHelp = (command: string) => {
    commands_.forEach(cmd => {
        if (command === cmd.name) {
            
            // print the usage with options if it has any
            if (cmd.args) {
                termwindow.append(`${cmd.description}\nUsage:\n ${cmd.usage}\nOptions\n `);
                let descs : string[] = [...cmd.argsd]; // gotta copy the array because ref types are dumb
                for (const arg of cmd.args) {
                    termwindow.append(`${arg} : `);
                    for(const d of descs){
                        termwindow.append(`${d}\n `);
                        descs.shift();
                        break;
                    }
                }
            }
            else {
                termwindow.append(`${cmd.description}\nUsage: \n ${cmd.usage}\n`);
            }
        }
    })
    helpflag = false;
}

const manual = (args: any[]) => {
    checkOptions(args, null, 1);
    if (helpflag) {
        getHelp("manual");
        return;
    }
    if (!error){
        showMainMenu();
    }
}

const list = (args: any[]) => {
    let options = ["-s", "-e", "-k", "-t"];
    checkOptions(args, options, 2);
    if (helpflag) {
        getHelp("list");
        return;
    }
    if (!error) {
        termwindow.append("e\n");
    }
}
const close_ = (args: any[]) => {
    checkOptions(args, null, 1);
    if (helpflag) {
        getHelp("close");
        return;
    }
    if (!error) {
        termwindow.append("h\n");
    }
}
const exit = (args: any[]) => {
    checkOptions(args, null, 1);
    if (helpflag) {
        getHelp("exit");
        return;
    }
    if (!error) {
        app.quit();
    }
}
const help = (args: any[]) => {
    checkOptions(args, null, 1);
    if (helpflag) {
        getHelp("help");
        return;
    }
    if (!error) {
        commands_.forEach(cmd => {
            termwindow.append(`${cmd.description}\nUsage:\n ${cmd.usage}\n\n`);
        })
    }
}
const echo = (args: any[]) => {
    checkOptions(args, null, 2);
    if (helpflag) {
        getHelp("echo");
        return;
    }
    if (!error) {
        termwindow.append(`${args}\n`);
    }
}

const commands_ = [
    {
        "name": "list",
        "usage": "list [options]",
        "args": ["-s", "-e", "-k", "-t"],
        "argsd": ["safe scps", "euclid scps", "keter scps", "thaumiel scps"],
        "description": "lists the scps",
        "function": list
    },
    {
        "name": "exit",
        "description": "exits the app",
        "usage": "exit [options]",
        "function": exit
    },
    {
        "name": "help",
        "description": "brings up help command",
        "usage": "help [options]",
        "function": help
    },
    {
        "name": "echo",
        "description": "A test command",
        "usage": "echo [options] [message]",
        "function": echo
    },
    {
        "name": "close",
        "description": "Closes things idk yet",
        "usage": "close [options]",
        "function": close_
    },
    {
        "name": "manual",
        "description": "Displays the help menu",
        "usage": "manual [options]",
        "function": manual
    }
]
exports.cmdlist = commands_;