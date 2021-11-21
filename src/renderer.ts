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
    win?.classList.add("pause-cursor-unfocused");
});
ipcRenderer.on("focused", () => {
    win?.classList.remove("pause-cursor-unfocused");
});
document.onkeydown = (e) => {
    if ((e.code == "Minus" || e.code == "Equal") && (e.ctrlKey || e.metaKey)) {
        e.preventDefault();
    }
}
