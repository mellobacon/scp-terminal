import $ from "jquery";
import {checkOptions, getHelp, helpflag, error} from "./commands/commandUtils";
import { search } from "./commands/search";
import { access } from "./commands/access";
import { manual } from "./commands/manual";
import { help } from "./commands/help";
import { exit } from "./commands/exit";
import { clear } from "./commands/clear";
import { clear_history } from "./commands/clear_history";
import { scp_history } from "./commands/scp_history";

const termwindow = $("#window");

const test = async (args: any[]) => {
    const op = ["-t"];
    checkOptions(args, op, 1);
    if (helpflag) {
        getHelp("test");
        return;
    }
    if (!error) {
        // e
    }
}
const commands_ = [
    {
        "name": "access",
        "description": "access - Access a scp file",
        "usage": "access [scp or 'random'] : Example: access scp-173 or access random",
        "function": access
    },
    {
        "name": "clear",
        "description": "clear - Clears the terminal",
        "usage": "clear",
        "function": clear
    },
    {
        "name": "clear-history",
        "description": "clear-history - Clears the scp history",
        "usage": "clear-history",
        "function": clear_history
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
        "usage": "help or [command] -help : Example: manual -help",
        "function": help
    },
    {
        "name": "manual",
        "description": "manual - Displays the help menu",
        "usage": "manual",
        "function": manual
    },
    {
        "name": "search",
        "usage": "search [flags] : Example: search -k",
        "args": ["-s", "-e", "-k", "-t", "-j"],
        "argsd": ["safe scps", "euclid scps", "keter scps", "thaumiel scps", "joke scps"],
        "description": "search (May be buggy) - Lists all scps or filtered scps set by flags\n\t Type 'search -help' for more info on valid flags",
        "function": search
    },
    {
        "name": "scp-history",
        "usage": "scp-history [flags] : Example: search -n 100",
        "args": ["-n"],
        "argsd": ["number of history items to show. Default is set at 50"],
        "description": "scp-history - Lists history of accessed scps and links",
        "function": scp_history
    },
    /*
    {
        "name": "test",
        "description": "test - test command",
        "usage": "test [whatever shit your testing idk]",
        "function": test
    },
    */
]

exports.cmdlist = commands_;

export {
    commands_
}