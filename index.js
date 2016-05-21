const ipc = require('electron').ipcRenderer;
var srcFiles = null;
var destFile = null;

$(document).ready(function(){

    $('#src-files').on('click',function(){
        ipc.send('src-files-dialog');
    });

    $('#dest-file').on('click',function(){
        ipc.send('dest-file-dialog');
    });

    $('#merge').on('click',function(){
        ipc.send('merge',srcFiles,destFile);
        $("#merge-status").html("Merging files...");
        $("#merge-status").show();
    });
});

ipc.on('src-files-selected',function(event,files){

    srcFiles = files;

    console.log(files);
    var html = "";

    files.forEach(function(val){
      html+= val + "<br>";
    });

    $("#src-file-names").html(html);
    $("#src-file-names").show();
});

ipc.on('dest-file-selected',function(event,file){

    destFile = file;

    console.log(file);
    var html = "";

    html += file;

    $("#dest-file-name").html(html);
    $("#dest-file-name").show();
});

ipc.on('merged-files',function(event,bool){


    console.log(bool);
    var html = "";

    if(bool)
      html += "PDFs merged!";

    else
      html += "PDFs could not be merged! Some error occured!";

    $("#merge-status").html(html);

});
