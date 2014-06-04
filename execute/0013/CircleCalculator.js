//==================
// CircleCalculator
//==================
function CircleCalculator() {
}

CircleCalculator.FRACTION_1_180 = 1/180;

//ラジアン角に変換
CircleCalculator.toRadian = function(degree) {
	return degree * Math.PI * CircleCalculator.FRACTION_1_180;
}
//ディグリー角に変換
CircleCalculator.toDegree = function(radian) {
	return (radian / (Math.PI * CircleCalculator.FRACTION_1_180));
}
