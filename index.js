const {app, BrowserWindow, ipcMain, dialog} = require('electron');
const path = require('path');
const url = require('url'); 
const fs = require('fs');
var win;
var IMG_DIR ='/src/';
function createWindow() {
  win = new BrowserWindow({
    width: 695,
    height:550,
    icon:path.join(__dirname, IMG_DIR, 'images/iconicon.jpg'),
    
    webPreferences: {
      nodeIntegration: true
    },  
    //frame: false
  });
  win.setMenu(null);
  win.loadFile('./src/index.html');
  win.webContents.openDevTools();
  win.on('closed', () => {
    win = null;
  });

  ipcMain.on('openDialog', () => {
    openFolderDialog();
  })

}

app.on('ready', createWindow)
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})
      
app.on('activate', () => {
  if (win === null) {
    createWindow()
  }
})  

function openFolderDialog() {
  dialog.showOpenDialog(win, { properties: ['openDirectory'] }, function (filePath) {
    if (filePath) {
      fs.writeFile('path.txt', filePath, function (err, data) {
        if (err) console.log(err);
      });
      // console.log(walkSync(filePath[0]));
      scanDir(filePath)
    }
  })
}

var walkSync = function(dir, filelist) {
  files = fs.readdirSync(dir);
  filelist = filelist || [];
  files.forEach(function(file) {
    if (fs.statSync(path.join(dir, file)).isDirectory()) {
      filelist = walkSync(path.join(dir, file), filelist);
    }
    else {
      if (file.substr(-4) === '.mp3' || file.substr(-4) === '.m4a'
        || file.substr(-5) === '.webm' || file.substr(-4) === '.wav'
        || file.substr(-4) === '.aac' || file.substr(-4) === '.ogg'
        || file.substr(-5) === '.opus') {
        filelist.push(path.join(dir, file));
      }
    }
  });
  return filelist;
};


function scanDir(filePath) {
  if (!filePath || filePath[0] == 'undefined') return;
  var arr = walkSync(filePath[0]);
  var objToSend = {};
  objToSend.files = arr;
  objToSend.path = filePath;
  win.webContents.send('selected-files', objToSend)
}