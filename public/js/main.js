
const fs = require('fs');
const mime = require('mime');
const os = require('os');
const $ = require("jquery");

let start_path = os.homedir() + "/Desktop";
start_path = start_path.replace(/\\/g, '/') + '/';

let files = [];
files = fetchDirectory(start_path);
buildDirectory(files);


function icoStringBuilder(a){
	return  `<div class="ico" data-type="${a}"></div>`;
	return `<div class="ico" data-type="${a}"><img src="/assets/icons/${a}.png" alt="${a}" /></div>`;
}
function fnStringBuilder(a, b){
	return  `<div class="fn"><a href="" data-type="${b}">${a}</a></div>`;
}
function buildDirectory(_thePath){
	if(_thePath.length > 1 ){ 
		_thePath.forEach(fileObject => {
			let stringBuilder = `<div class="item">`;
			fileType = "";
			if(fileObject.directory){
				stringBuilder += icoStringBuilder("folder");
				fileType = "folder";
			}else if(fileObject.alias){
				stringBuilder += icoStringBuilder("alias");
				fileType = "alias";
			}else{
				stringBuilder += icoStringBuilder("file");
				fileType = fileType.mimeType;
			}
			stringBuilder += fnStringBuilder(fileObject.theFile, fileType);
			console.log(fileObject.theFile + " " + fileObject.mimeType);
			stringBuilder += `</div>`;
			$('.file-container').append(stringBuilder);
		});
	}else{
		console.log("files is empty: " + array.length);
	}
}
function fetchDirectory(_thePath){
	arr = [];
	files = fs.readdirSync(_thePath)
		
	files.forEach(file => {
		arr.push({
			path: _thePath,
			theFile: file,
			directory: fs.statSync(_thePath + file).isDirectory(),
			alias: fs.statSync(_thePath + file).isSymbolicLink(),
			mimeType: mime.getType(file)
		});
	});
	return arr;
}