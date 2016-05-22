const ipc = require('electron').ipcRenderer;
const path = require('path');
var srcFiles = [];
var destFile = null;

$(document).ready(function(){

    $('#src-files').on('click',function(){
        ipc.send('src-files-dialog');
    });

    $('#dest-file').on('click',function(){
        ipc.send('dest-file-dialog');
    });

    $('#merge').on('click',function(){

        if(srcFiles.length >= 2)
        {
          if(destFile)
          {
            ipc.send('merge',srcFiles,destFile);
            $("#merge-status").html("Merging files...");
            $("#merge-status").show();
          }

          else {
              ipc.send('show-message','Select a destination to save the merged PDF!');
          }
        }

        else {
          ipc.send('show-message','Select atleast two PDFs to merge them!');
        }
    });
});

ipc.on('src-files-selected',function(event,files){

    srcFiles = srcFiles.concat(files);

    console.log(files);
    var html = "";

    files.forEach(function(val){

      var fullPath = val.split(path.sep);
      html+= fullPath[fullPath.length - 1] + "<br>";

    });

    $("#src-file-names").append(html);
    $("#src-file-names").show();
});

ipc.on('dest-file-selected',function(event,file){

    destFile = file;

    console.log(file);

    var html = "";

    var fullPath = file.split(path.sep);

    html += fullPath[fullPath.length - 1];

    $("#dest-file-name").html(html);
    $("#dest-file-name").show();
});

ipc.on('merged-files',function(event,bool){

    console.log(bool);
    var html = "";

    if(!bool)
    {
      html += "PDFs could not be merged! Some error occured! Try again!";
      $("#merge-status").html(html);
      return;
    }

    $("#src-file-names").html("");
    $("#dest-file-name").html("");
    $("#src-file-names").hide();
    $("#dest-file-name").hide();
    srcFiles = [];
    destFile = null;

    $("#merge-status").html(html);
});
