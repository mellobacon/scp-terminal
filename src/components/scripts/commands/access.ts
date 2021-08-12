import axios from "axios";
import cheerio from 'cheerio';
import $ from "jquery";
import { pageData } from "../util";
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
                const url = `http://scp-wiki.wikidot.com/random:random-scp`;
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
                ).catch(console.error);
                return;
            }
            termwindow.append("no\n"); 
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
        ).catch(console.error);
    }
}

export {
    access
}