// import { lstat } from 'node:fs/promises'
// import { cwd } from 'node:process'
import { ipcRenderer } from 'electron';
const fs = require('fs');

export const createFileCalendarConfig = (content: string) => {
  const data = content.split(',', 4);
  const urlPart = content.slice(content.lastIndexOf('https://'));
  const contentFormat = `{"zoom":${data[0].split(':')[1]},"hstart":${data[1].split(':')[1]},"hend":${data[2].split(':')[1]},"urlIcal":"${urlPart}"}`;

  fs.writeFileSync('calendar_config.json', contentFormat, (err: any) => {
    if (err) throw err;
  });

  //renvoyer le path d'ou le fichier a été créé
  ///Users/drissbenadjal/Documents/Electron/project-tasksync/frontend/calendar_config.json
  const path = 'Users/drissbenadjal/Documents/Electron/project-tasksync/frontend/calendar_config.json';
  return path;
}


// ipcRenderer.on('main-process-message', (_event, ...args) => {
//   console.log('[Receive Main-process message]:', ...args)
// })

// lstat(cwd()).then(stats => {
//   console.log('[fs.lstat]', stats)
// }).catch(err => {
//   console.error(err)
// })

type CloseBtnType = {
  window: {
    minimize: () => void;
    maximize: () => void;
    close: () => void;
  };
};

export const CLOSE_BTN: CloseBtnType = {
  window: {
    minimize: () => ipcRenderer.send("minimize"),
    maximize: () => ipcRenderer.send("maximize"),
    close: () => ipcRenderer.send("close"),
  },
};


const OpenUrl = (url: string) => {
  ipcRenderer.send('open-url', url)
}

export default OpenUrl;
