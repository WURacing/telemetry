/**
 * Generates a random number or points to plot
 */
var prev = [], coeff = [];
var numSeries = 6;
for (var i = 0; i < numSeries; i++) {
    prev[i] = 50;
    coeff[i] = 1;
}

exports.getRandomData = function() {
    var y = [];
    y[0] = Date.now();
    for (var i = 0; i < numSeries; i++) {
        y[i+1] = prev[i] + Math.random() * 5 - coeff[i] * Math.random() * 5;
        prev[i] = y[i+1];
        if (y[i+1] < 10) {
            coeff[i] = -4;
        } else if (y[i+1] > 90) {
            coeff[i] = 4;
        } else {
            coeff[i] = 1;
        }
    }
    return y;
}