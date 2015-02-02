// information, entropy, decision trees, etc
// https://class.coursera.org/datasci-002/lecture/149

// HELPER
var util = require('./DataUtil'),
    sha1 = util.sha1Obj;

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
    var hash = sha1(data);
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

// entropy of data for a given @labelField
// -E p(x) log2 p(x)
function entropy(data, labelField) {
    var info = getMetadata(data);  // data info
    var values = info.valueLists[labelField];
    var valcounts = info.valueCounts[labelField];

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
function expectedEntropy(data, decisionField, labelField) {
    var info = getMetadata(data);
    var values = info.valueLists[labelField];
    var groupedData = choose(data, decisionField);
  
    var _entropy = 0;
    groupedData.forEach(function (rows) {
	    _entropy += rows.length/data.length*entropy(rows, labelField);
	});
    return _entropy;
}

// make decision tree
function getNextDecision(data, labelField) {
    // compute entropy of dataset
    var _entropy = entropy(data, labelField);
    var info = getMetadata(data),
	fieldNames = info.fieldNames;
    
    // compute entropy for choosing each field & pick the field that minimizes entropy
    var minimizingField;
    var _entropy=Number.MAX_VALUE; // start with huge entropy
    fieldNames.forEach(function(fieldName) {
	    if (fieldName == labelField) return; // skip labelField
	    var _expectedEntropy = expectedEntropy(data, fieldName, labelField);
	    if (_expectedEntropy < _entropy) {
		minimizingField=fieldName;
		_entropy = _expectedEntropy;
	    }
	});
    
    //    return _entropy;
    return {if:minimizingField, entropy:_entropy};
}

// build decision tree with ID3 algorithm
// assume attributes are discreet
// choose attribute w/highest information gain
// create branch for each value of attribute
// partition examples
// repeate with remaining attributes
function buildDT(data, labelField, selectValue) {

    // helper
    function getNumberOfLabels() {
	return getMetadata(data).valueLists[labelField].length;
    }

    // stop when all examples have same label or no examples left
    if (getNumberOfLabels()==1) return {equals:selectValue, labelValue:getMetadata(data).valueLists[labelField][0]};
    if (data.length == 0) return "DONE";
    var selectField = getNextDecision(data, labelField).if;
    
    function makeStep(selectField) {
	//console.log('data', selectField, data);
	var ret = {if: selectField, branches:[]};
	if (selectValue) ret.equals = selectValue;
	return ret;
    };

    var dt = makeStep(selectField);

    function addBranch(tree) {
	dt.branches.push(tree);
    }
    //    console.log('selectField', selectField, choose(data, selectField).length);    

    choose(data, selectField).forEach(function(branch) {
	    //	    console.log('branch', selectField, branch[0][selectField]);
	    addBranch(buildDT(branch, labelField, branch[0][selectField]));
	});

    //    var info = getMetadata(data);
    return dt;
}

module.exports = {
    buildDT: buildDT
};
