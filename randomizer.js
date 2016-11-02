/**
 * Generates a random number or points to plot
 */
var prev1 = 50, prev2 = 25, totalPoints = 300 , coeff1 = 1, coeff2 = 1;

exports.getRandomData = function() {
    var y1 = prev1 + Math.random() * 5 - coeff1 * Math.random() * 5;
    var y2 = prev2 + Math.random() * 2.5 - coeff2 * Math.random() * 2.5;
    prev1 = y1;
    prev2 = y2;

    if (y1 < 10) {
        coeff1 = -4;
    } else if (y1 > 90) {
        coeff1 = 4;
    } else {
        coeff1 = 1;
    }

    if (y2 < 5) {
        coeff2 = -2;
    } else if (y2 > 40) {
        coeff2 = 2;
    } else {
        coeff2 = 1;
    }
    return [Date.now(), y1, y2];
}