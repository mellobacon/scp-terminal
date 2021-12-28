import { ipcRenderer } from "electron";
import {checkOptions, getHelp, helpflag, error} from "./commandUtils";

/**
 * Exits the app
 */
const exit = (args: any[]) => {
    checkOptions(args, null, 1);
    if (helpflag) {
        getHelp("exit");
        return;
    }
    if (!error) {
        ipcRenderer.send("exit");
    }
}

export {
    exit
}