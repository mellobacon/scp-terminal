import { BrowserWindow, ipcRenderer } from "electron";
import { ipcMain, app, net } from "electron";
import { join } from "path";

let mainWindow: BrowserWindow;
function createWindow() {
    mainWindow = new BrowserWindow({
        height: 600,
        width: 900,
        frame: false,
        /*transparent: true,*/
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
    mainWindow.on("blur", () => {
        mainWindow.webContents.send("unfocused");
    })
    mainWindow.on("focus", () => {
        mainWindow.webContents.send("focused");
    })
}

app.on("ready", createWindow);

ipcMain.on("execute", (_, url) => {
    app.whenReady().then(() => {
        let http = /(^(https)|(http)):\/\//gm;
        if (!http.test(url)) {
            url = `http://scp-wiki.wikidot.com/${url}`;
        }
        const request = net.request(url);
        let status;
        request.on('response', (response) => {
            status = `${response.statusCode}`;
            mainWindow.webContents.send("view", [status, url]);
          })
          request.end(); 
    })
})
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

ipcMain.on("exit", () => {
    app.quit();
})
