import { span, h5 } from "../util";
import $ from "jquery";
import {commands_} from "../commands";
let error = false;
let helpflag = false;
const termwindow = $("#window");

type commandObject = ({
    name: string;
    usage: string;
    args: string[];
    argsd: string[];
    description: string;
} | {
    name: string;
    description: string;
    usage: string;
    args?: undefined;
    argsd?: undefined;
});

/**
 * Checks if supplied flags are valid
 * @param args args from a command
 * @param flags valid flags
 * @param count number of flags
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
            // uh...ig...just checks for stuff...idk i wrote this a while ago sue me
            if (flags === null && options.length > 0 && !options.includes(undefined)) {
                error = true;
                termwindow.append(span("status-fail", `'${options[0]}' does not match the supported flags.\n`));
                return;
            }
            // this is a mess and i dont remember what its doing
            if (flags) {
                for (const f of flags) {
                    for (const p of options) {
                        if (f === p) {
                            error = false;
                            return;
                        }
                        else {
                            error = true;
                        }
                    }
                }
                if (error) {
                    termwindow.append(span("status-fail", `'${options[0]}' does not match the supported flags2.\n`));
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
    commands_.forEach((cmd: commandObject) => {
        if (command === cmd.name) {
            termwindow.append(h5(cmd.name));
            termwindow.append(`<hr>`);
            // print the usage with options if it has any
            if (cmd.args) {
                termwindow.append(`${cmd.description}\nUsage:\n ${cmd.usage}\nOptions\n `);
                const descs: string[] = [...cmd.argsd]; // gotta copy the array because ref types are dumb
                for (const arg of cmd.args) {
                    termwindow.append(`${arg} : `);
                    for (const d of descs) {
                        termwindow.append(`${d}\n `);
                        descs.shift();
                        break;
                    }
                }
            }
            else {
                termwindow.append(`${cmd.description}\nUsage: \n ${cmd.usage}\n`);
            }
            termwindow.append(`<hr>`);
        }
    })
    helpflag = false;
}

export {
    checkOptions,
    getHelp,
    error,
    helpflag,
}