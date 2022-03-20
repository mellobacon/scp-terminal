import { checkOptions, getHelp, helpflag, error } from "./commandUtils";
import { clearScpHistory, scrollPage } from "../util";
import $ from "jquery";

const termwindow = $("#window")!;

/**
 * Clears scp history
 * @param args the command arguments
 */
const clear_history = (args: any[]) => {
    checkOptions(args, null, 1);
    if (helpflag) {
        getHelp("clear-history");
        return;
    }
    if (!error) {
        clearScpHistory();
        termwindow.append("SCP History cleared.\n");
        scrollPage();
    }
}

export {
    clear_history
}