import { checkOptions, error } from "./commandUtils";

const termwindow_ = document.querySelector("#window")!;
const clear = (args: any[]) => {
    checkOptions(args, null, 1);
    if (!error) {
        termwindow_.textContent = "";
    }
}

export {
    clear
}