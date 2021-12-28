import { checkOptions, getHelp, helpflag, error } from "./commandUtils";

const termwindow_ = document.querySelector("#window")!;

/**
 * Clears the terminal
 * @param args the command arguments
 */
const clear = (args: any[]) => {
    checkOptions(args, null, 1);
    if (helpflag) {
        getHelp("clear");
        return;
    }
    if (!error) {
        termwindow_.textContent = "";
    }
}

export {
    clear
}