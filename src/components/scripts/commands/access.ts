import axios from "axios";
import cheerio from 'cheerio';
import $ from "jquery";
import { pageData, getRandomInt, span, scroll_, listItem } from "../util";
import { checkOptions, getHelp, helpflag, error } from "./commandUtils";

const termwindow = $("#window");
const scphistory = $("#scp-list ul");

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
                        const info = content(".info-container");
                        rating.remove();
                        footer.remove();
                        license.remove();
                        mobileexit.remove();
                        info.remove();
                        content(".collapsible-block-link").removeAttr("href");
                        scphistory.append(listItem(`scp-${scpnum}`));
                        termwindow.append(pageData(x.html()?.trim()));
                    }
                ).catch(() => {
                    termwindow.append(span("status-fail", `scp-${scpnum} not available.\n`));
                    console.error;
                }
                );
                handleClick();
                return;
            }
            termwindow.append(span("status-fail", "Error: Invalid format. Type 'access -help' for help.\n"));
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
                const info = content(".info-container");
                rating.remove();
                footer.remove();
                license.remove();
                mobileexit.remove();
                info.remove();
                content(".collapsible-block-link").removeAttr("href");
                termwindow.append(pageData(x.html()?.trim()));
                scphistory.append(listItem(args[0]));
            }
        ).catch(() => {
            termwindow.append(span("status-fail", `${args[0]} not available.\n`));
            console.error;
        });
        handleClick();
    }
}

const handleClick = async () => {
    $("a").each((_, l) => {
        l.addEventListener("click", (e) => {
            e.preventDefault();
            if (l.hasAttribute("href")) {
                let url = `http://scp-wiki.wikidot.com/$${[l.getAttribute("href")?.replace(/^\//gm, "")]}`;
                let scp = l.getAttribute("href")?.replace(/^\//gm, "")!;
                getUrl(url, scp);
            }
        })
    })

    $(".collapsible-block").each((_, l) => {
        let f = $(l).children()[0];
        let p = $(l).children()[1];
        f.addEventListener("click", () => {
            f.style.display = "none";
            p.style.display = "block";
        })
        p.addEventListener("click", () => {
            p.style.display = "none";
            f.style.display = "block";
        })
    })
}

const getUrl = async (url: string, scp: string) => {
    const a = axios.create();
    await a.get(url).then((html: { data: any; }) => {
        const data = html.data;
        const content = cheerio.load(data);
        const x = content("#page-content");
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
        termwindow.append(pageData(x.html()?.trim()));
        scphistory.append(listItem(scp.toUpperCase()));
        handleClick();
    }).then(
        () => {
            termwindow.append("root@user:~$ ");
        }
    )
}

export {
    access
}