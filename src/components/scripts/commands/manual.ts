import $ from "jquery";
import { checkOptions, getHelp, helpflag, error } from "./commandUtils";
import { showMainMenu } from "./commandUtils";
import { span } from "../util";

const termwindow = $("#window");

/**
 * Processes the options in a command
 * @param args the command args
 * @param flags the command flags. can be null
 * @param count number of args required
 */
const manual = (args: any[]) => {
    checkOptions(args, null, 1);
    if (helpflag) {
        getHelp("manual");
        return;
    }
    if (!error) {
        //showMainMenu();
        termwindow.append(span("status-fail", "Manual not available at this time.\n"));
    }
}

export {
    manual
}