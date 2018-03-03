const fs = require('fs');
const mime = require('mime');
const os = require('os');
const $ = require("jquery");

let start_path = os.homedir() + "/Desktop";
start_path = start_path.replace(/\\/g, '/') + '/';
buildDirectory(start_path);


$('#up').click(function(){
	let upPathArr = $('#directory').val().split("/");
	let upPath = "";
	for(i = 0; i < (upPathArr.length - 2); i++){
		upPath += upPathArr[i] + "/";
	}
	//console.log(upPath);
	try{
		buildDirectory(upPath);
	}catch(err){
		switch(err){
			case "Error: EPERM: operation not permitted, stat 'C:\\Users\\SSHD'":
				alert("Insufficient Permissions to browse to that directory");
				break;
			default:
				alert(err);
				console.log(err);
		}
	}
});

function doubleClickFunction(_theItem){
	console.log(_theItem);
	if(_theItem.slice(-1) == "/"){
		buildDirectory(_theItem);
	}else{
		console.log("it's a file!");
	}
}
function fnStringBuilder(a, b){
	return  `<div class="file" data-type="${b}" ondblclick="doubleClickFunction('${a.path}${a.theFile}${a.directory ? '/':'' }')"><i class="ico ${b}" data-type="${b}"><img src="assets/icons/${b}.png" alt="${b}" /></i>${a.theFile}</div>`;
}
function mimeStringBuilder(a){
	return `<div class"mime">${a}</div>`;
}
function buildDirectory(_thePath){
	let _theFiles = fetchDirectory(_thePath);
	$('.file-container').html("");
	if(_theFiles.length > 1 ){ 
		_theFiles.forEach(fileObject => {
			let stringBuilder = `<div class="item">`;
			fileType = "";
			if(fileObject.directory){
				fileType = "folder";
			}else if(fileObject.alias){
				fileType = "alias";
			}else{
				fileType = "file";
			}
			stringBuilder += fnStringBuilder(fileObject, fileType);
			if(!(fileObject.directory) && !(fileObject.alias)){
				stringBuilder += mimeStringBuilder(fileObject.mimeType);
			}else{
				stringBuilder += mimeStringBuilder(" ");
			}
			stringBuilder += `</div>`;
			$('.file-container').append(stringBuilder);
		});
	}else{
		console.log("files is empty: " + _theFiles.length);
	}
}
function fetchDirectory(_thePath){
	let arr = [];
	let fileArr = [];
	let folderArr = [];
	let files = fs.readdirSync(_thePath)	
	files.forEach(file => {
		if( fs.statSync(_thePath + file).isDirectory() ){
			folderArr.push({
				path: _thePath,
				theFile: file,
				directory: fs.statSync(_thePath + file).isDirectory(),
				alias: fs.statSync(_thePath + file).isSymbolicLink(),
				mimeType: mime.getType(file)
			});
		}else{	
			fileArr.push({
				path: _thePath,
				theFile: file,
				directory: fs.statSync(_thePath + file).isDirectory(),
				alias: fs.statSync(_thePath + file).isSymbolicLink(),
				mimeType: mime.getType(file)
			});
		}
	});
	$('#directory').val(_thePath);
	return folderArr.concat(fileArr);
}