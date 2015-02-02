var buildDT = require('../').buildDT;

// data 
var data = [
	    { outlook:"overcast", temperature:"cool", humidity:"normal", windy:"true", play:"yes"},
	    { outlook:"overcast", temperature:"hot", humidity:"high", windy:"false", play:"yes"},
	    { outlook:"overcast", temperature:"hot", humidity:"normal", windy:"false", play:"yes"},
	    { outlook:"overcast", temperature:"mild", humidity:"high", windy:"true", play:"yes"},

	    { outlook:"rainy", temperature:"cool", humidity:"normal", windy:"true", play:"no"},
	    { outlook:"rainy", temperature:"mild", humidity:"high", windy:"true", play:"no"},
	    { outlook:"rainy", temperature:"cool", humidity:"normal", windy:"false", play:"yes"},
	    { outlook:"rainy", temperature:"mild", humidity:"high", windy:"false", play:"yes"},
	    { outlook:"rainy", temperature:"mild", humidity:"normal", windy:"false", play:"yes"},

	    { outlook:"sunny", temperature:"hot", humidity:"high", windy:"false", play:"no"},
	    { outlook:"sunny", temperature:"hot", humidity:"high", windy:"true", play:"no"},
	    { outlook:"sunny", temperature:"mild", humidity:"high", windy:"false", play:"no"},
	    { outlook:"sunny", temperature:"cool", humidity:"normal", windy:"false", play:"yes"},
	    { outlook:"sunny", temperature:"mild", humidity:"normal", windy:"true", play:"yes"}

	    ];


//console.log('entropy', entropy(data, 'play'));
//console.log('choose', choose(data, 'outlook'));
//console.log('choose', choose(data, 'temperature'));
//console.log('expectedEntropy', expectedEntropy(data, 'outlook', 'play'));
//console.log('expectedEntropy', expectedEntropy(data, 'temperature', 'play'));
//console.log('expectedEntropy', expectedEntropy(data, 'humidity', 'play'));
//console.log('group', choose(data, 'humidity'));
//console.log('expectedEntropy', expectedEntropy(data, 'windy', 'play'));

//console.log('entropy in dataset is %d', entropy(data, 'play'));
//var decision = getNextDecision(data, 'play');
//console.log('if you select on the %s field, entropy decreases to %d', decision.selectOn, decision.entropy);

console.log(JSON.stringify(buildDT(data, 'play')));