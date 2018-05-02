const os = require('os');
const $ = require("jquery");
const {shell} = require('electron');
const fileSystem = require('./js/fileSystem.js');
const redisWorker = require('./js/redis.js');
const filterWorker = require('./js/filterBuilder.js');
const contextMenu = require('./js/contextMenu.js');

let $filters =  $('.file-information .filter-options');
let $fileInfo = $('.file-information .file-content');
let $sidebar =  $('.file-information');
let $mainContent = $('.file-container');


let filterArr = [];
let start_path = os.homedir() + "/Desktop/chapter2.5";
start_path = start_path.replace(/\\/g, '/') + '/';

fileSystem.buildDirectory(start_path);

// Item click functions!
function doubleClickFunction(_theItem){
	console.log(_theItem);
	if(_theItem.slice(-1) == "/"){
		fileSystem.buildDirectory(_theItem);
	}else{
		shell.openItem(_theItem);
	}
}
function fileSingleClickFunction(_theItem, _itmRef){
	let thisItm = _itmRef;
	if(_theItem.slice(-1) != "/"){
		openSidebar();
		$(thisItm).addClass('active');
		$fileInfo.html(fileSystem.buildFileInformation(_theItem));
	}
}

// File Details Controls
$('#close').click(function(e){
	e.preventDefault();
	if(!filterWorker.getFilterItems()){
		closeSidebar();
	}else{
		closeSidebar(false);	
	}
});

function addTag(){
	let tag = $('#tagginginput').val();
	let path = $('#filePath').val()
	if(tag != ""){
		redisWorker.addTag(path, tag);
	}
};

// Top Navigation Controls
$('#up').click(function(){
	let upPathArr = $('#directory').attr('data-current').split("/");
	let upPath = "";
	for(i = 0; i < (upPathArr.length - 2); i++){
		upPath += upPathArr[i] + "/";
	}
	try{
		fileSystem.buildDirectory(upPath);
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
$("#go").click(function(){
	openPathInNav();
});
$("#filter").click(function(){
	if(!filterWorker.getFilterItems()){
		openSidebar();
		filterWorker.getFilterList().then(function(resp){
			let theResp = filterWorker.buildString(resp);
			sidebarReset();
			$filters.html(theResp);
		}).catch(function(err){
			console.log(`Something didn't go as expected...\n${err}`);
		});
	}else{
		openSidebar(false);
	}
});

$('.filter-options').on('change', '#filters .filter', function(){
	if(this.checked == true){
		filterWorker.addFilterItem($(this).data('filter'));
	}else{
		filterWorker.removeFilterItem($(this).data('filter'));
		if(!filterWorker.getFilterItems()){
			openPathInNav();
		}
	}
	runFilter();
});
$('.filter-options').on('change', '#filters .filterType', function(){
	redisWorker.setFilterType($('#filters input[name=filter-type]:checked').val());
	runFilter();
});
function openPathInNav(){
	let desiredPath = $('#directory').val();
	console.log("...");
	if(desiredPath.slice(-1) !== "/"){
		desiredPath += "/";
	}
	try{
		fileSystem.buildDirectory(desiredPath)
	}catch(err){
		
		switch(err){
			default:
				alert(err);
				console.log(err);
		}
	}
}
function openSidebar(_boolean){
	if(typeof _boolean == "undefined" || _boolean){
		sidebarReset();
	}
	$sidebar.addClass('active');
	$('body').addClass('noScroll');
}
function closeSidebar(_boolean){
	if(typeof _boolean == "undefined" || _boolean){
		sidebarReset();
	}
	$('body').removeClass('noScroll');
	$sidebar.removeClass('active');
}
function sidebarReset(){
	$sidebar.find('div').html("");
	$mainContent.find('div.file').removeClass('active');
}
function runFilter(){
	if(filterWorker.getFilterItems()){
		redisWorker.filterResults(filterWorker.getFilterItems()).then(function(resp){
			$mainContent.html(fileSystem.buildFilteredResults(resp));
		});
	}
}

// adding in some rightclickiness goodness --

$("body").contextmenu(function(e){
	contextMenu.openContextMenu(e, this);
});
$("div.file").contextmenu(function(e){
	contextMenu.openContextMenu(e, this);
});
$("div.file").contextmenu(function(e){
	contextMenu.openContextMenu(e, this);
});

