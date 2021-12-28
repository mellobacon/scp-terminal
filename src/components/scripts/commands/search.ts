import $ from "jquery";
import axios from "axios";
import cheerio from 'cheerio';
import { pageData, h3 } from "../util";
import { checkOptions, getHelp, helpflag, error } from "./commandUtils";
import { access } from "./access";

const termwindow = $("#window");
let joke = false;

// TODO: Make a better way to search for scps
/**
 * Displays scps based on the 4 containment classes + joke scps
 * @param args command arguments
 */
const search = async (args: any[]) => {
    const options = ["-s", "-e", "-k", "-t", "-j"];
    checkOptions(args, options, 2);
    if (helpflag) {
        getHelp("search");
        return;
    }
    if (!error) {
        joke = false;
        const a = axios.create();
        if (args[0] === "-s") {
            const url = `http://scp-wiki.wikidot.com/system:page-tags/tag/safe`;
            await a.get(url).then(
                (html: { data: any }) => {
                    const data = html.data;
                    const content = cheerio.load(data);
                    const x = content("#tagged-pages-list");
                    termwindow.append(h3("Safe SCPs"));
                    termwindow.append(`<hr>`);
                    termwindow.append(pageData(x.html()?.trim()));
                }
            ).catch(
                (error) => {
                    console.log(error.response.data);
                }
            )
        }
        else if (args[0] === "-e") {
            const url = `http://scp-wiki.wikidot.com/system:page-tags/tag/euclid`;
            await a.get(url).then(
                (html: { data: any }) => {
                    const data = html.data;
                    const content = cheerio.load(data);
                    const x = content("#tagged-pages-list");
                    termwindow.append(h3("Euclid SCPs"));
                    termwindow.append(`<hr>`);
                    termwindow.append(pageData(x.html()?.trim()));
                }
            )
        }
        else if (args[0] === "-k") {
            const url = `http://scp-wiki.wikidot.com/system:page-tags/tag/keter`;
            await a.get(url).then(
                (html: { data: any }) => {
                    const data = html.data;
                    const content = cheerio.load(data);
                    termwindow.append(h3("Keter SCPs"));
                    termwindow.append(`<hr>`);
                    const x = content("#tagged-pages-list");
                    termwindow.append(pageData(x.html()?.trim()));
                }
            )
        }
        else if (args[0] === "-t") {
            const url = `http://scp-wiki.wikidot.com/system:page-tags/tag/thaumiel`;
            await a.get(url).then(
                (html: { data: any }) => {
                    const data = html.data;
                    const content = cheerio.load(data);
                    const x = content("#tagged-pages-list");
                    termwindow.append(h3("Thaumiel SCPs"));
                    termwindow.append(`<hr>`);
                    termwindow.append(pageData(x.html()?.trim()));
                }
            )
        }
        else if (args[0] === "-j") {
            joke = true;
            const url = `http://scp-wiki.wikidot.com/joke-scps/noredirect/true`;
            await a.get(url).then(
                (html: { data: any }) => {
                    const data = html.data;
                    const content = cheerio.load(data);
                    const x = content(".content-panel");
                    termwindow.append(h3("Joke SCPs"));
                    termwindow.append(`<hr>`);
                    termwindow.append(pageData(x.html()?.trim()));
                }
            )
        }
        else {
            termwindow.append("Full list of SCPs not available. For help, type 'search -help'.\n");
        }
        $(".page-data").addClass("loaded");
        handleClick();
        return;
    }
}

const handleClick = () => {
    let content: JQuery<HTMLElement>;
    if (joke) {
        content = $(".content-panel a");
    }
    else {
        content = $("#tagged-pages-list a");
    }
    content.each((_, link) => {
        link.addEventListener("click", (e)=> {
            e.preventDefault();
            access([link.getAttribute("href")?.replace(/^\//gm, "")]);
        })
    })
}

export {
    search
}