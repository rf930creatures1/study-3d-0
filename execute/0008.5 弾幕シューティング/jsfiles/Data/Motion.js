//=======================
//  移動運動staticクラス
//=======================
function Motion() {
}

//無限の形で移動する
Motion.InfinityShape = function(t) {
	//tは時間%。0～1
	//0がスタート、0.5が左1周まで完了、1が右1周も完了。
	//角度は360が2回。360未満なら時計回り、360以上なら反時計回りになる。限度オーバーで0に戻る。
	var degree = (360 * 2 * t) % (360 * 2);
	var clockwise = 1;
	if (degree >= 360) {
		clockwise = -1;
		degree -= 180;
	}
	degree *= clockwise;
	
	var radian = CircleCalculator.toRadian(degree);
	var ret = new Vector2(Math.cos(radian) - clockwise, 
						  Math.sin(radian) );
	return ret;
}

Motion.HorizontalRoundTrip = function(t) {
	return new Vector2(Math.sin(t * Math.PI * 2), 0);
}
