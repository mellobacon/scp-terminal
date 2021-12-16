import { ipcRenderer } from "electron";

document.getElementById('close')!.addEventListener('click', () => {
    ipcRenderer.send('close');
})
document.getElementById('maximize')!.addEventListener('click', () => {
    ipcRenderer.send('maximize');
})
document.getElementById('minimize')!.addEventListener('click', () => {
    ipcRenderer.send('minimize');
})
document.getElementById('file')!.addEventListener('click', () => {
    ipcRenderer.send('debug');
})

let win = document.getElementById("window");
ipcRenderer.on("unfocused", () => {
    let cmdinput = document.getElementsByClassName("cmd-input")[document.getElementsByClassName("cmd-input").length - 1];
    cmdinput.classList.add("pause-cursor-unfocused");
});
ipcRenderer.on("focused", () => {
    let cmdinput = document.getElementsByClassName("cmd-input")[document.getElementsByClassName("cmd-input").length - 1];
    cmdinput.classList.remove("pause-cursor-unfocused");
});
document.onkeydown = (e) => {
    if ((e.code == "Minus" || e.code == "Equal") && (e.ctrlKey || e.metaKey)) {
        e.preventDefault();
    }
}
