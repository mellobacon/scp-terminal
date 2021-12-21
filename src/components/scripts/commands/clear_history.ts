import { checkOptions, getHelp, helpflag, error } from "./commandUtils";
import { scrollPage } from "../util";
import $ from "jquery";

const termwindow = $("#window")!;
const scphistory = document.querySelector("#scp-list ul")!;

const clear_history = (args: any[]) => {
    checkOptions(args, null, 1);
    if (helpflag) {
        getHelp("clear-history");
        return;
    }
    if (!error) {
        scphistory.textContent = "";
        termwindow.append("SCP History cleared.\n");
        scrollPage();
    }
}

export {
    clear_history
}