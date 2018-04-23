
const fs = require('fs');
const mime = require('mime');
const $ = require("jquery");

module.exports = {
	buildDirectory: function(_thePath){
		let _theFiles = fetchDirectory(_thePath);
		let stringBuilder = "";
		$('.file-container').html("");
		if(_theFiles.length > 1 ){ 
			_theFiles.forEach(fileObject => {
				stringBuilder += `<div class="item">`;
				fileType = getFileType(fileObject);
				stringBuilder += fnStringBuilder(fileObject, fileType);
				if(!(fileObject.directory) && !(fileObject.alias)){
					stringBuilder += mimeStringBuilder(fileObject.mimeType);
				}else{
					stringBuilder += mimeStringBuilder(" ");
				}
				stringBuilder += `</div>`;
			});
		}else{
			console.log("files is empty: " + _theFiles.length);
		}
		$('.file-container').html(stringBuilder);
	},
	buildFileInformation: function(_thePath){
		let theFile = _thePath;
		let theString = buildMimeString(theFile);
		theString += addTaggingArea(theFile);
		return theString;
	},
	buildFilteredResults: function(_filterResults){
		let theString = "";
		_filterResults.forEach(result=>{
			file = fetchFile(result);
			theString += fnStringBuilder(file, getFileType(file));
		});	
		return theString;
	}
}
function getFileType(_fileObject){
	if(_fileObject.directory){
		return "folder";
	}else if(_fileObject.alias){
		return "alias";
	}else{
		return "file";
	}
}
function buildMimeString(_thePath){
	return `<div class="mime-type">${mime.getType(_thePath)}</div>`;
}
function addTaggingArea(_thePath){
	return `<div class="tagging">
				<input type="text" id="tagginginput" />
				<input type="hidden" id="filePath" value="${_thePath}" />
				<input type="button" value="add" onclick="addTag()" />
			</div>`;
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
	$('#directory').attr("data-current", _thePath); 
	return folderArr.concat(fileArr);
}
function fetchFile(_thePath){
	let filePath = "";
		filePathArr = _thePath.split('/'), 
		theFile = filePathArr.pop();
	filePathArr.forEach(part=>{
		filePath += part + "/";
	});
	//_thePath = fs.readFileSync(filePath + theFile);
	let file = {
		path: filePath,
		theFile: theFile,
		directory: false,
		alias: fs.statSync(_thePath).isSymbolicLink(),
		mimeType: mime.getType(theFile)
	}
	return file;
}
function fnStringBuilder(_fileObject, _fileType){
	return  `<div class="file" data-type="${_fileType}" ondblclick="doubleClickFunction('${_fileObject.path}${_fileObject.theFile}${_fileObject.directory ? '/':'' }')" onClick="fileSingleClickFunction('${_fileObject.path}${_fileObject.theFile}${_fileObject.directory ? '/':'' }', this)"><i class="ico ${_fileType}" data-type="${_fileType}"><img src="assets/icons/${_fileType}.png" alt="${_fileType}" /></i>${_fileObject.theFile}</div>`;
}
function mimeStringBuilder(_fileObject){
	return `<div class"mime">${_fileObject}</div>`;
}