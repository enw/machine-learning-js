// information, entropy, decision trees, etc
// https://class.coursera.org/datasci-002/lecture/149

// HELPER
var hashutil = require('./hashutil');

//
// CONSTANTS
//

// OUTLOOK
var OVERCAST=0,
    RAINY=1,
    SUNNY=2,

    // TEMPERATURE
    COOL=0,
    HOT=1,
    MILD=2,

    // HUMIDITY
    NORMAL=0,
    HIGH=1,
    
    // windy
    TRUE=0,
    FALSE=1,
    
    // play
    YES=0,
    NO=1;

// data 
var data = [
	    { outlook:OVERCAST, temperature:COOL, humidity:NORMAL, windy:TRUE, play:YES},
	    { outlook:OVERCAST, temperature:HOT, humidity:HIGH, windy:FALSE, play:YES},
	    { outlook:OVERCAST, temperature:HOT, humidity:NORMAL, windy:FALSE, play:YES},
	    { outlook:OVERCAST, temperature:MILD, humidity:HIGH, windy:TRUE, play:YES},

	    { outlook:RAINY, temperature:COOL, humidity:NORMAL, windy:TRUE, play:NO},
	    { outlook:RAINY, temperature:MILD, humidity:HIGH, windy:TRUE, play:NO},
	    { outlook:RAINY, temperature:COOL, humidity:NORMAL, windy:FALSE, play:YES},
	    { outlook:RAINY, temperature:MILD, humidity:HIGH, windy:FALSE, play:YES},
	    { outlook:RAINY, temperature:MILD, humidity:NORMAL, windy:FALSE, play:YES},

	    { outlook:SUNNY, temperature:HOT, humidity:HIGH, windy:FALSE, play:NO},
	    { outlook:SUNNY, temperature:HOT, humidity:HIGH, windy:TRUE, play:NO},
	    { outlook:SUNNY, temperature:MILD, humidity:HIGH, windy:FALSE, play:NO},
	    { outlook:SUNNY, temperature:COOL, humidity:NORMAL, windy:FALSE, play:YES},
	    { outlook:SUNNY, temperature:MILD, humidity:NORMAL, windy:TRUE, play:YES}

	    ];

/*
  generate metadata about data
  {  
      fieldNames: [],
      valueLists: { }, 
      valueHashes: { },
      valueCounts: { }
   }
*/
var _datainfo = {}; 
function getMetadata(data) {
    var hash = hashutil(data);
    if (!_datainfo[hash]) {
	var fieldNames = [],
	    valueLists = [],
	    valueHashes = [],
	    valueCounts = [];
	function insertInfo(key, value) {
	    if (!valueHashes[key]) {
		fieldNames.push(key);
		valueHashes[key] = {};
		valueLists[key] = [];
		valueCounts[key] = {};
	    };
	    if (!valueHashes[key][value]) {
		valueHashes[key][value] = true;
		valueLists[key].push(value);
		valueCounts[key][value] = 0;
	    }
	    valueCounts[key][value] += 1; // 
	};
	// generate possible values
	data.forEach(function (row) {
		for (var k in row) insertInfo(k, row[k]);
	    });
	
	_datainfo[hash] = {
	    fieldNames: fieldNames,
	    valueLists: valueLists,
	    valueHashes: valueHashes,
	    valueCounts: valueCounts
	};
    };

    return _datainfo[hash];
}

//console.log(getMetadata(data));

// entropy of data for a given field
// -E p(x) log2 p(x)
function entropy(data, field) {
    var info = getMetadata(data);  // data info
    var values = info.valueLists[field];
    var valcounts = info.valueCounts[field];

    var entropy = 0;
    values.forEach(function(val) {
	    entropy += valcounts[val]/data.length * Math.log2(valcounts[val]/data.length);
	});
    return -entropy;
}

// returns a list of lists of rows, grouped by @selectField values
function choose(data, selectField) {
    var info = getMetadata(data);  // data info
    var values = info.valueLists[selectField];
    var valcounts = info.valueCounts[selectField];
    var hash = {};
    data.forEach(function(row) {
	    if (!hash[row[selectField]]) hash[row[selectField]] = [];
	    hash[row[selectField]].push(row);
	});

    // return list, not hash
    var ret=[];
    for (var k in hash) ret.push(hash[k]);
    return ret;
}
// expected entropy for making decision split on a particular field 
function expectedEntropy(data, decisionField, entropyField) {
    var info = getMetadata(data);
    var values = info.valueLists[entropyField];
    var groupedData = choose(data, decisionField);
  
    var _entropy = 0;
    groupedData.forEach(function (rows) {
	    _entropy += rows.length/data.length*entropy(rows, entropyField);
	});
    return _entropy;
}

// make decision tree
function getNextDecision(data, decisionField) {
    // compute entropy of dataset
    var _entropy = entropy(data, decisionField);
    var info = getMetadata(data),
	fieldNames = info.fieldNames;
    
    // compute entropy for choosing each field & pick the field that minimizes entropy
    var minimizingField;
    var _entropy=Number.MAX_VALUE; // start with huge entropy
    fieldNames.forEach(function(fieldName) {
	    if (fieldName == decisionField) return; // skip decisionField
	    var _expectedEntropy = expectedEntropy(data, fieldName, decisionField);
	    if (_expectedEntropy < _entropy) {
		minimizingField=fieldName;
		_entropy = _expectedEntropy;
	    }
	});
    
    //var groupedData = choose(data, decisionField);

    //    return _entropy;
    return {selectOn:minimizingField, entropy:_entropy};
}

//console.log('entropy', entropy(data, 'play'));
//console.log('choose', choose(data, 'outlook'));
//console.log('choose', choose(data, 'temperature'));
//console.log('expectedEntropy', expectedEntropy(data, 'outlook', 'play'));
//console.log('expectedEntropy', expectedEntropy(data, 'temperature', 'play'));
//console.log('expectedEntropy', expectedEntropy(data, 'humidity', 'play'));
//console.log('group', choose(data, 'humidity'));
//console.log('expectedEntropy', expectedEntropy(data, 'windy', 'play'));

console.log('dt', getNextDecision(data, 'play'));