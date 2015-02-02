/* scenario
   example goal - determine model for predicting tip
 */
var tips = [ 5, 17, 11, 8, 14, 5 ];
var mean = mean(tips);
var residuals = tips.map(function (value) {
	return value - mean;
    });
var squared_residuals = residuals.map(function(value) {
	return value * value;
    });
var sum_of_squares = squared_residuals.reduce(function(prev, curr, index, arr) {
	return prev + curr;
    });
function mean(list) {
    var acc=0;
    tips.reduce(function(value, next) {
	    acc += next;
	    return next;
	},0);
    return acc / list.length;
};
console.log(tips);
console.log(mean);
console.log(residuals);
console.log(squared_residuals);
console.log(sum_of_squares);
