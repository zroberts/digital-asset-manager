var fs = require('fs');
var files = fs.readdirSync('.');

for(fn in files){
	stringBuilder = "<div class=\"item\">";


	$('.file-container').append(stringBuilder);	
}
