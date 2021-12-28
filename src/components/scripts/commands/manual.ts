import $ from "jquery";
import { checkOptions, getHelp, helpflag, error } from "./commandUtils";
import { span, pageData } from "../util";

const termwindow = $("#window");

const manual = (args: any[]) => {
    checkOptions(args, null, 1);
    if (helpflag) {
        getHelp("manual");
        return;
    }
    if (!error) {
        termwindow.append(pageData("Welcome to the scp terminal. This is where you can access scps through the command line. Type 'access scp-xxxx' or 'access random' to access an scp. Type 'help' for the list of commands. Type 'search' to get a list of scps in the database*.\n"));
        $(".page-data").addClass("loaded");
        termwindow.append("*Not all scps will be available. This is a limitation of the scp website and other factors.\n");
    }
}

export {
    manual
}