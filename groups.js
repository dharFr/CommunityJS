var couch = require('./couch.js');

var continent = {};
continent.sortedCountries = function () {
	var sorted = {},
	key, keys = [];
	for (key in this.countries) keys.push(key);
	keys.sort();
	for (var i = 0; i < keys.length; i++) {
		sorted[keys[i]] = this.countries[keys[i]];
	}
	return sorted;
}

var tree;
var rawdata; 
function getTree(callback) {
	if(tree){
		console.log('using cached data');
		callback(null, tree, rawdata);
		return;
	}
	couch.queryData(function(err, data) {
		if(err) {
			callback(err)
			return;
		}
		tree = {};
		rawdata = data;
		for (var i in data) {
			var continentName = data[i].continent;
			var country = data[i].country;
			var state = data[i].state;
			var link = '<a href="'+ data[i].link+ '">' + data[i].link + '</a>';
			var anchor = '<a name="'+ data[i].id+ '">'+ data[i].town + '</a>';
			var item = anchor + ': ' + link;

			if(!state) state = 'no-state';
			if(!tree[continentName]) 
			tree[continentName] = Object.create(continent, {countries: { value : {} } });
			if(!tree[continentName].countries[country]) 
			tree[continentName].countries[country] = [];
			if(!tree[continentName].countries[country][state]) 
			tree[continentName].countries[country][state] = [];
			tree[continentName].countries[country][state].push(item);
		}
		callback(null, tree, rawdata);
	})
}
module.exports.getTree = getTree;