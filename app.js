const electron = require('electron');
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;
const ipc = electron.ipcMain;
const dialog = electron.dialog;
const merge = require('easy-pdf-merge');

app.on('ready',function(){
  var mainWindow = new BrowserWindow({
    width : 800,
    height : 600
  });

  mainWindow.loadURL('file://' + __dirname + '/index.html');
  //mainWindow.openDevTools();

});

ipc.on('src-files-dialog',function(event){

      var window = BrowserWindow.fromWebContents(event.sender);

      var srcFileChooseOptions = {
        title : 'Choose the PDFs to merge',
        buttonLabel : 'OK',
        filters : [
          {
            name : 'PDFs',
            extensions : ['pdf']
          }
        ],
        properties : [
          'multiSelections',
          'openFile'
        ]
      };

      dialog.showOpenDialog(window,srcFileChooseOptions,function(files){

        if(files)
          event.sender.send('src-files-selected',files);

      });

});

ipc.on('dest-file-dialog',function(event){

      var window = BrowserWindow.fromWebContents(event.sender);

      var destFileChooseOptions = {
        title : 'Choose a destination for the merged PDF',
        buttonLabel : 'OK',
        filters : [
          {
            name : 'PDF',
            extensions : ['pdf']
          }
        ],
      };

      dialog.showSaveDialog(window,destFileChooseOptions,function(file){

        if(file)
        event.sender.send('dest-file-selected',file);

      });

});

ipc.on('merge',function(event,srcFiles,destFile){

      var window = BrowserWindow.fromWebContents(event.sender);

      merge(srcFiles,destFile,function(err){

          var statusMessage = "";
          var statusTitle = "";

          if(err) {
            console.log(err);
            statusTitle = "Error!";
            statusMessage = "Some error occured while merging";
          }

          else{
            statusTitle = "Success!";
            statusMessage = "Successfully merged";
          }

          var infoOptions = {
            type : 'info',
            title : statusTitle,
            message : statusMessage,
            buttons : ['OK']
          };

          dialog.showMessageBox(window,infoOptions);

          if(err)
            event.sender.send('merged-files',false);

          else
            event.sender.send('merged-files',true);
      });

});

ipc.on('show-message',function(event,messageBody){

      var window = BrowserWindow.fromWebContents(event.sender);
      
      var infoOptions = {
        type : 'info',
        title : 'Information',
        message : messageBody,
        buttons : ['OK']
      };

      dialog.showMessageBox(window,infoOptions);

});
