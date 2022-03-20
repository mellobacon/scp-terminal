import axios from "axios";
import cheerio from 'cheerio';
import $ from "jquery";
import { pageData, getRandomInt, span, listItem, appendPrompt, scrollToLink, scpinfo } from "../util";
import { checkOptions, getHelp, helpflag, error } from "./commandUtils";
import { ipcRenderer, shell } from "electron";
import { scpjson } from "../../util/acs-database";

const termwindow = $("#window");
const scphistory = $("#scp-list ul");

let accessfail = false;
/**
 * Get info on an scp and display it in the terminal
 * @param args command arguments
 */
const access = async (args: any[]) => {
    accessfail = false;

    // Make sure the correct options are supplied
    checkOptions(args, null, 1);

    // Display info on the command when `-help` is an argument
    if (helpflag) {
        getHelp("access");
        return;
    }

    // Process the args given
    if (!error) {
        // Will fail if there is no arguments supplied
        if (!args[0]) {
            termwindow.append(span("status-fail", "Error: Invalid format. Type 'access -help' for help.\n"));
            accessfail = true;
            return;
        }

        termwindow.append("Loading...\n");
        let url = "";
        let scp = args[0];

        // Fetches the correct link based on the scp supplied. Unless the arg is 'random' or starts with the prefix 'scp-', the command will fail. 
        if (!args[0].startsWith("scp-")) {
            if (args[0] === "random") {
                // Get a random scp to display
                const num = getRandomInt(0, 6999);
                const scpnum = new Intl.NumberFormat('en-US', { minimumIntegerDigits: 3 }).format(num).toString().replace(",", "");
                scp = `scp-${scpnum}`;

                // Fetch the link for the random scp
                url = `http://scp-wiki.wikidot.com/scp-${scpnum}`;
            }
            else {
                termwindow.append(span("status-fail", "Error: Invalid format. Type 'access -help' for help.\n"));
                accessfail = true;
            }
        }
        else {
            // Fetch the link for the scp supplied in the command
            url = `http://scp-wiki.wikidot.com/${args[0]}`;
        }

        // Attempt to display info on the scp
        if (!accessfail) {
            await getUrl(url, scp);
        }
    }
}

/**
 * Process what happens when a valid element is clicked on in the scp page
 */
const handleClick = async () => {
    // (had a lot of trouble getting this to work lmao). Enables clicking links in the scp pages
    let pages = document.getElementsByClassName("page-data");
    let page = pages[pages.length - 1];
    page.querySelectorAll("a").forEach((link) => {
        link.addEventListener("click", (e) => {
            e.preventDefault();
            accessLink(link);
        })
    });

    // yea i uh got lazy lol. this is stolen from terminal.ts
    const updateInput = () => {
        let input = $(".current");
        input.removeClass("current cursor-block");
        termwindow.append(span("cmd-input cursor-block current", ""));
    }

    // Process what happens when the link is clicked. Either displays in the terminal or opens the link in a browser. Fails if neither
    function accessLink(link: Element) {
        if (link.hasAttribute("href")) {
            // The href link looks like '/scp-000' and that messes with getting the link. So I'm removing it (with regex because ftw)
            let scp = link.getAttribute("href")?.replace(/^\//gm, "")!;

            // Jank but checks if the link is valid...should probably use handle() but meh
            ipcRenderer.send("execute", scp);
            ipcRenderer.once("view", (_, output) => {
                let status = output[0];
                let url = output[1];
                let isvalid = true; // checks if the url is valid and/or if the data can be displayed in the terminal
                
                if (status == 200) {
                    // if the link isnt part of the scp wiki domain its an external link which just opens in the default browser
                    let wiki = /(^(https)|(http)):\/\/((scp-wiki)|(www\.scp-wiki))/gm;
                    if (!wiki.test(url)) {
                        termwindow.append("\nOpened external site\n");
                        isvalid = false;
                    }
                    // Proccess the link
                    getUrl(url, scp, isvalid).then(() => {
                        appendPrompt();
                        updateInput();
                        if (isvalid) scrollToLink();
                        return;
                    })
                }
                else {
                    accessfail = true;
                    termwindow.append(span("status-fail", `Link:${url} not available.\n`));
                    return;
                }
            })
        }
    }

    // Toggles what is displayed based on if the block is folded or unfolded
    $(".collapsible-block").each((_, block) => {
        let foldedblock = $(block).children()[0];
        let unfoldedblock = $(block).children()[1];

        foldedblock.addEventListener("click", () => {
            foldedblock.style.display = "none";
            unfoldedblock.style.display = "block";
        })
        unfoldedblock.addEventListener("click", () => {
            unfoldedblock.style.display = "none";
            foldedblock.style.display = "block";
        })
    })
}

/**
 * Process the provided url
 * @param url The url to access
 * @param scp The scp to access. Optional.
 * @param valid Whether the supplied link is valid or not. Optional.
 * @returns 
 */
const getUrl = async (url: string, scp: string, valid: boolean = true) => {
    // Opens the link in an external browser on your computer
    if (!valid) {
        shell.openExternal(url);
        return;
    }

    // Create and process a request for the scp page data from the url. Will fail if it cant be accessed
    const a = axios.create();
    await a.get(url).then((html: { data: any; }) => {
        // get the page content
        const data = html.data;
        const content = cheerio.load(data);
        const scp_page = content("#page-content");

        // remove unneeded content
        const rating = content(".page-rate-widget-box");
        const footer = content(".footer-wikiwalk-nav");
        const license = content(".licensebox");
        const mobileexit = content(".mobile-exit");
        const info = content(".info-container");
        rating.remove();
        footer.remove();
        license.remove();
        mobileexit.remove();
        info.remove();
        content(".collapsible-block-link").removeAttr("href");

        // get and load scp info for special formats (ACS) if applicable
        if (content(".anom-bar-container") || content(".acs-hybrid-text-bar")) {
            let classname = content(".anom-bar-container") ? ".anom-bar-container" : ".acs-hybrid-text-bar";
            for (let index = 0; index < scpjson.length; index++) {
                const data = scpjson[index];
                if (data.itemNumber === scp.toUpperCase()) {
                    setScpInfo(content(classname), data.itemNumber, data.clearance, data.clearance, data.contain, data.secondary, data.risk, data.disrupt);
                }
            }
        }

        // append the data to the terminal and add the accessed scp to history
        termwindow.append(pageData(scp_page.html()?.trim()));
        scphistory.append(listItem(scp.toUpperCase()));
    }).catch((e) => {
        console.log(e);
        accessfail = true;
        termwindow.append(span("status-fail", `${scp} not available.\n`));
        return;
    })

    // just a placeholder until iframes get fixed somehow. its wonky in electron.
    $("iframe").replaceWith(`<div class="error-placeholder"><h4>Error loading data</h4></div>`);
    // gonna add a loading thingy later
    $(".page-data").addClass("loaded");
    handleClick();
}

const setScpInfo = (content: any, scp: string, level: string, clear: string, containment: string, secondary:string , risk:string , disrupt:string) => {
    switch (level) {
        case "1":
            clear = "UNRESTRICTED";
            break;
        case "2":
            clear = "RESTRICTED";
            break;
        case "3":
            clear = "CONFIDENTIAL";
            break;
        case "4":
            clear = "SECRET";
            break;
        case "5":
            clear = "TOP SECRET";
            break;
        case "6":
            clear = "COSMIC TOP SECRET";
            break;    
        default:
            clear = "N/A";
            break;
    }
    // if data has something like ${risk} etc, then it doesnt exist
    if (secondary.startsWith("{")) {
        secondary = "NONE";
    }
    if (disrupt.startsWith("{")) {
        disrupt = "NONE";
    }
    if (risk.startsWith("{")) {
        risk = "NONE";
    }
    content.replaceWith(scpinfo(scp, clear, level, containment.toUpperCase(), secondary.toUpperCase(), risk.toUpperCase(), disrupt.toUpperCase()));
}

export {
    access,
    accessfail
}