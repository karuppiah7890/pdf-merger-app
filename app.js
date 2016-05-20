const electron = require('electron');
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;

app.on('ready',function(){
  var mainWindow = new BrowserWindow({
    width : 800,
    height : 600
  });

  mainWindow.loadURL('file://' + __dirname + '/index.html');

});
