import $ from "jquery";
import { commands_ } from "../commands";
import {checkOptions, getHelp, helpflag, error} from "./commandUtils";
import {h3} from "../util";

const termwindow = $("#window");

/**
 * Display help for a command/commands
 */
const help = (args: any[]) => {
    checkOptions(args, null, 1);
    if (helpflag) {
        getHelp("help");
        return;
    }
    if (!error) {
        termwindow.append(h3("Commands"));
        termwindow.append("For help on a specific command, type [command] -help.\n");
        termwindow.append("<hr>");
        commands_.forEach((cmd: { description: any; usage: any; }) => {
            termwindow.append(`\n${cmd.description}\nUsage:\n ${cmd.usage}\n\n`);
        });
        termwindow.append("<hr>");
    }
}

export {
    help
}