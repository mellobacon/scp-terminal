import { checkOptions, getHelp, helpflag, error } from "./commandUtils";
import $ from "jquery";
import { scphistory, scrollPage, h3 } from "../util";

const termwindow = $("#window");

const scp_history = (args: any[]) => {
    const options = ["-n"];
    checkOptions(args, options, 2);
    if (helpflag) {
        getHelp("scp-history");
        return;
    }
    let count = 50;
    if (args[0] === "-n") {
        if (!args[1]) {
            termwindow.append(`Scp History count set at: ${count}\n`);
            return;
        }
        else {
            count = args[1];
        }
    }
    if (!error) {
        let num = 0;
        termwindow.append(h3("SCP HISTORY"));
        termwindow.append("<hr>");
        if (scphistory.length == 0) return;
        for (const scp of scphistory) {
            if (count === num) break;
            termwindow.append(`${scp}\n`);
            num++;
        }
        scrollPage();
    }
}

export {
    scp_history
}