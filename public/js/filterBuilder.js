const redisWorker = require('./redis.js');
let filtersArr = [];

module.exports = {
	getFilterList: function(){
		return redisWorker.filterResults('tag-names');
	},
	buildString: function(_arrayOfItems){
		let theString = `<form id="filters">`;
		theString += radioButtons();
		_arrayOfItems.forEach(item=>{
	
			theString += `<input type="checkbox" class="filter" data-filter="${item}" />${toTitleCase(item)}<br />`;
		});
		return theString;
	}, 
	addFilterItem: function(_item){
		filtersArr.push(_item);
	},
	removeFilterItem: function(_item){
		removeFromArr(filtersArr, _item);
	}, 
	getFilterItems: function(){
		if(filtersArr.length > 0){
			return filtersArr;
		}else{
			return false;
		}
	}, 
}


function toTitleCase(str){
	return str.replace(/\w\S*/g, function(txt){
		return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
	})
}
function removeFromArr(_array, _element){
	let index = _array.indexOf(_element);
	_array.splice(index, 1);
}
function radioButtons(){
	let radioString = "";
	switch(redisWorker.getFilterType()){
		case "inter":
			radioString = `<input type="radio" name="filter-type" class="filterType" value="union" />Union | <input type="radio" name="filter-type" class="filterType" value="inter" checked /> Intersect | <input type="radio" name="filter-type" class="filterType" value="diff" /> Difference<br /><br />`;
		case "diff":
			radioString = `<input type="radio" name="filter-type" class="filterType" value="union" />Union | <input type="radio" name="filter-type" class="filterType" value="inter" /> Intersect | <input type="radio" name="filter-type" class="filterType" value="diff" checked /> Difference<br /><br />`;
		default:
			radioString = `<input type="radio" name="filter-type" class="filterType" value="union" checked />Union | <input type="radio" name="filter-type" class="filterType" value="inter" /> Intersect | <input type="radio" name="filter-type" class="filterType" value="diff" /> Difference<br /><br />`;
	}
	return radioString;
}