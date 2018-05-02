const Redis = require('ioredis');
const redis = new Redis({
	port: 6379,
	host: '206.189.198.101',
	keyPrefix: 'tag:'

});
let filterType = "union";
module.exports = {
	addTag: function(_thePath, _theTag){
		redis.sadd('tag-names', _theTag);
		redis.sadd(_theTag, _thePath);
	},
	filterResults: function(_key){
		if(_key instanceof Array){
			switch(filterType){
				case "inter": 
					return redis.sinter(_key);
					break;
				case "diff":
					return redis.sdiff(_key);
					break;
				default:
					return redis.sunion(_key);
					break;
			}
		}else{
			return redis.smembers(_key);	
		}
	},
	setFilterType: function(_filterType){
		filterType = _filterType;
	},
	getFilterType: function(){
		return filterType;
	}
}