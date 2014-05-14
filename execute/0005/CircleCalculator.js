//==================
// CircleCalculator
//==================
function CircleCalculator() {
}

//ラジアン角に変換
CircleCalculator.toRadian = function(degree) {
	return degree * Math.PI / 180.0;
}
//ディグリー角に変換
CircleCalculator.toDegree = function(radian) {
	return (radian / (Math.PI / 180.0));
}
