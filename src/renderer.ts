const { ipcRenderer } = require("electron");
//import { ipcRenderer } from "electron";

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
    win?.classList.toggle("pause-cursor");
});
ipcRenderer.on("focused", () => {
    win?.classList.toggle("pause-cursor");
});