import { ipcRenderer } from "electron";
import $ from "jquery";
import { accessfail } from "./commands/access";
const termwindow_ = document.querySelector("#window")!;
const termwindow = $("#window");

let scphistory: string[] = [];

/**
 * Timeout but better
 * @param ms time in milliseconds
 */
 const sleep = (ms: any) => {
    return new Promise(resolve => setTimeout(resolve, ms));
}

const getVersion = async () => {
    const version: string = await ipcRenderer.invoke("getversion");
    return version;
}

const getRandomInt = (min:number, max:number) => {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min); //The maximum is exclusive and the minimum is inclusive
}

const name = ["Bjornsen", "Conwell", "Labelle", "Lloyd", "Bright", "Cimmerian", "Clef", "Crow", "Gears", "user"]
const random = getRandomInt(0, name.length - 1);
/**
 * Appends the prompt to the terminal window
 */
const appendPrompt = () => {
    termwindow.append(`${name[random]}@Site-19:~$ `);
}

/**
 * Makes a box for page data; Ideally for displaying scp data.
 * @param content The content to be in the page data box
 * @returns 
 */
const pageData = (...content: any) => {
    return "<div class=\"page-data\">" + content + "</div>";
}

const h3 = (string: string) => {
    return `<h3 class="title3"> ${string} </h3>`;
}
const h5 = (string: string) => {
    return `<h5 class="title5"> ${string} </h5>`;
}

const listItem = (string: string) => {
    return `<li class="scp-h-item"> ${string} </li>`;
}

/**
 * Makes a span element with a custom class. Good for styling
 * @param classname the name of the class
 * @param message the string to go inside span
 * @returns a span with the set class name
 */
const span = (classname: string, message: string) => {
    return "<span class=\"" + classname + "\">" + message + "</span>";
}

const scpinfo = (scp: string, level = "N/A", clear = "N/A", containment = "N/A", secondary = "N/A", risk = "N/A", disruption = "N/A") => {
    return `
    <div class="scp-info-text">
    <div class="main-text">Item #: <span class="item-number">${scp}</span> - <span class="level-name">${level}</span> (Clearance <span class="level-number">${clear}</span>)</div>

    <div class="containment-text">Containment Class: <span class="containment-class">${containment}</span></div>

    <div class="disruption-text">Disruption Class: <span class="disruption-class">${disruption}</span></div>

    <div class="secondary-containment-text">Secondary Class: <span class="secondary-class">${secondary}</span></div>

    <div class="risk-text">Risk Class: <span class="risk-class">${risk}</span></div>
    </div>`;
}

/**
 * Enables smooth scrolling down the window
 */
 const scrollPage = () => {
    termwindow_.scrollBy({
        top: termwindow_.scrollHeight,
        behavior: "smooth"
    })
}

/**
 * Enables smooth scrolling to a page
 */
const scrollToLink = () => {
    const pages = document.getElementsByClassName("page-data");
    const page = pages[pages.length - 1];
    if (page == null || accessfail) {
        scrollPage();
    }
    else {
        termwindow_.scrollTo({
            top: termwindow_.scrollHeight - page.scrollHeight - 75,
            behavior: "smooth"
        })
    }
}

const addScpHistory = (scp: string) => {
    scphistory.push(scp);
}
const clearScpHistory = () => {
    scphistory = [];
}

export {
    pageData,
    h3,
    h5,
    span,
    getRandomInt,
    scrollPage,
    listItem,
    sleep,
    scrollToLink,
    getVersion,
    appendPrompt,
    scpinfo,
    addScpHistory,
    clearScpHistory,
    scphistory
}