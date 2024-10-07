const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const fs = require('fs');

let mainWindow;
const notesFilePath = path.join(__dirname, 'notes.json');

// Verifica se o arquivo já existe, se não, cria um arquivo vazio
if (!fs.existsSync(notesFilePath)) {
    fs.writeFileSync(notesFilePath, JSON.stringify([]));
}

function createWindow() {
    mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            contextIsolation: true,
            enableRemoteModule: false,
        },
    });

    mainWindow.loadFile('index.html');
    mainWindow.on('closed', function () {
        mainWindow = null;
    });
}

function loadNotes() {
    if (fs.existsSync(notesFilePath)) {
        const data = fs.readFileSync(notesFilePath);
        return JSON.parse(data);
    }
    return [];
}

function saveNotes(notes) {
    fs.writeFileSync(notesFilePath, JSON.stringify(notes));
}

ipcMain.handle('load-notes', () => {
    return loadNotes();
});

ipcMain.handle('save-notes', (event, notes) => {
    saveNotes(notes);
});

app.on('ready', createWindow);
app.on('window-all-closed', function () {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', function () {
    if (mainWindow === null) {
        createWindow();
    }
});
