import $ from "jquery";
import {checkOptions, getHelp, helpflag, error} from "./commands/commandUtils";
import { search } from "./commands/search";
import { access } from "./commands/access";
import { manual } from "./commands/manual";
import { help } from "./commands/help";
import { exit } from "./commands/exit";
import { clear } from "./commands/clear";

const termwindow = $("#window");

const echo = async (args: any[]) => {
    checkOptions(args, null, 2);
    if (helpflag) {
        getHelp("echo");
        return;
    }
    if (!error) {
        termwindow.append(`${args}\n`);
    }
}
const security = (args: any[]) => {
    checkOptions(args, null, 1);
    if (helpflag) {
        getHelp("security");
        return;
    }
    if (!error) {
        termwindow.append("security level not available\n");
    }
}

const test = async (args: any[]) => {
    const op = ["-t"];
    checkOptions(args, op, 1);
    if (helpflag) {
        getHelp("test");
        return;
    }
    if (!error) {
        termwindow.append("test");
    }
}

const commands_ = [
    {
        "name": "search",
        "usage": "search [flags]",
        "args": ["-s", "-e", "-k", "-t", "-j"],
        "argsd": ["safe scps", "euclid scps", "keter scps", "thaumiel scps", "joke scps"],
        "description": "search - Lists all scps or filtered scps set by flags",
        "function": search
    },
    {
        "name": "exit",
        "description": "exit - exits the app",
        "usage": "exit",
        "function": exit
    },
    {
        "name": "help",
        "description": "help - brings up help command",
        "usage": "help || [command] -help",
        "function": help
    },
    {
        "name": "echo",
        "description": "echo - A test command",
        "usage": "echo [message]",
        "function": echo
    },
    {
        "name": "manual",
        "description": "manual - Displays the help menu",
        "usage": "manual",
        "function": manual
    },
    {
        "name": "access",
        "description": "access - Access a scp file",
        "usage": "access [scp] [flags]",
        "args": ["-rnd"],
        "argsd": ["Displays a random scp file"],
        "function": access
    },
    {
        "name": "security",
        "description": "security - Displays security level of a scp file",
        "usage": "security [scp] [options]",
        "function": security
    },
    {
        "name": "test",
        "description": "test - test command",
        "usage": "test [whatever shit your testing idk]",
        "function": test
    },
    {
        "name": "clear",
        "description": "clear - Clears the terminal",
        "usage": "clear",
        "function": clear
    }
]

exports.cmdlist = commands_;

export {
    commands_
}