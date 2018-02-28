
var fs = require('fs');
var mime = require('mime');
var os = require('os');
var start_path = os.homedir() + "/Desktop";
var $ = require("jquery");

start_path = start_path.replace(/\\/g, '/') + '/';
console.log(start_path);

files = fetchDirecty(_thePath);
files.forEach(file => {

});



function icoStringBuilder(a){
	return  "<div class=\"ico\" data-type=\"" + a + "\"></div>";
	return "<div class=\"ico\" data-type=\"" + a + "\"><img src=\"/assets/icons/"+a+".png\" alt=\"" + a + "\" /></div>";
}

function fnStringBuilder(a, b){
	return  "<div class=\"fn\"><a href=\"\" data-type=\""+ b +"\">"+ a + "</a></div>";
}
function fetchDirectory(_thePath){
	arr = [];
	fs.readdir(_thaPath, (err, files) => {
		if(err){
			console.log(err);
		}
		files.forEach(file => {
			arr.push({
				path: _thePath,
				theFile: file,
				directory: fs.statSync(_thePath + file).isDirectory(),
				alias: fs.statSync(_thePath + file).isSymbolicLink(),
				mimeType: mime.getType(file);
			});
		});
		return arr;
	});
}
function getStats(_inFile, _thePath){
	files.forEach(file =>{
			
			arrayOffiles += file;
			/*stringBuilder += icoStringBuilder("file");
			stringBuilder += fnStringBuilder(file, "file");*/
			
			fs.stat(start_path + file, (err, stats) => {
				stringBuilder = "<div class=\"fileitem\">";
				if(err){
					console.log(err);
				}else{
					if(stats.isDirectory()){
						stringBuilder += icoStringBuilder("folder");
						stringBuilder += fnStringBuilder(file, "folder");
					}else if(stats.isSymbolicLink()){
						stringBuilder += icoStringBuilder("alias");
						stringBuilder += fnStringBuilder(file, "alias");
					}else{
						stringBuilder += icoStringBuilder("file");
						stringBuilder += fnStringBuilder(file, "file");
					}
				}
				stringBuilder += "</div>";
				$('.file-container').append(stringBuilder);
			});
			
		});
}