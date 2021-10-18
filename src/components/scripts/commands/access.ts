import axios from "axios";
import cheerio from 'cheerio';
import $ from "jquery";
import { pageData, getRandomInt, span } from "../util";
import { checkOptions, getHelp, helpflag, error } from "./commandUtils";

const termwindow = $("#window");

const access = async (args: any[]) => {
    checkOptions(args, null, 1);
    if (helpflag) {
        getHelp("access");
        return;
    }
    if (!error) {
        if (!args[0].startsWith("scp-")) {
            if (args[0] === "random") {
                const num = getRandomInt(0, 6999);
                const scpnum = new Intl.NumberFormat('en-US', { minimumIntegerDigits: 3 }).format(num).toString().replace(",", "");
                const url = `http://scp-wiki.wikidot.com/scp-${scpnum}`;
                const a = axios.create();
                await a.get(url).then(
                    (html: { data: any; }) => {
                        const data = html.data;
                        const content = cheerio.load(data);
                        const x = content("#page-content");
                        const rating = content(".page-rate-widget-box");
                        const footer = content(".footer-wikiwalk-nav");
                        const license = content(".licensebox");
                        const mobileexit = content(".mobile-exit");
                        const iframe = content("iframe");
                        const info = content(".info-container");
                        rating.remove();
                        footer.remove();
                        license.remove();
                        mobileexit.remove();
                        //iframe.remove();
                        info.remove();
                        termwindow.append(pageData(x.html()?.trim()));
                    }
                ).catch(() => {
                        termwindow.append(span("status-fail", `scp-${scpnum} not available.\n`));
                        console.error;
                    }
                );
                return;
            }
            termwindow.append(span("status-fail", "Error: Invalid format. Type 'access -help' for help."));
            return;
        }
        const url = `http://scp-wiki.wikidot.com/${args[0]}`;
        const a = axios.create();
        await a.get(url).then(
            (html: { data: any; }) => {
                const data = html.data;
                const content = cheerio.load(data);
                const x = content("#page-content");
                const rating = content(".page-rate-widget-box");
                const footer = content(".footer-wikiwalk-nav");
                const license = content(".licensebox");
                const mobileexit = content(".mobile-exit");
                const iframe = content("iframe");
                const info = content(".info-container");
                rating.remove();
                footer.remove();
                license.remove();
                mobileexit.remove();
                iframe.remove();
                info.remove();
                termwindow.append(pageData(x.html()?.trim()));
            }
        ).catch(() => {
            termwindow.append(span("status-fail", `${args[0]} not available.\n`));
            console.error;
        });
    }
}

export {
    access
}