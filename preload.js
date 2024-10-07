const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electron', {
    loadNotes: () => ipcRenderer.invoke('load-notes'),
    saveNotes: (notes) => ipcRenderer.invoke('save-notes', notes),
});
