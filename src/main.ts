import { BrowserWindow } from "electron";
const { ipcMain, app } = require("electron");
const join = require("path").join;

let mainWindow: BrowserWindow;
function createWindow() {
    mainWindow = new BrowserWindow({
        height: 600,
        width: 900,
        frame: false,
        transparent: true,
        webPreferences: {
            nodeIntegration: true,
            experimentalFeatures: true,
            contextIsolation: false,
            //preload: join(__dirname, 'preload.js')
        }
    })

    mainWindow.loadFile(join(__dirname, './pages/index.html'));
    mainWindow.on("closed", () => {
        app.quit();
    })
    ipcMain.on("debug", () => {
        mainWindow.webContents.openDevTools();
    })
}

app.on("ready", createWindow);

ipcMain.on("close", () => {
    app.quit();
})

ipcMain.on("maximize", () => {
    BrowserWindow.getFocusedWindow()!.isMaximized() ? BrowserWindow.getFocusedWindow()!.unmaximize() : BrowserWindow.getFocusedWindow()!.maximize();
})

ipcMain.on("minimize", () => {
    BrowserWindow.getFocusedWindow()!.minimize();
})

app.on("activate", () => {
    if (mainWindow === null) {
        createWindow();
    }
})