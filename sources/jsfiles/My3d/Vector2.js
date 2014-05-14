//=======================
//  Vector2クラス
//=======================
function Vector2(arg1, arg2) {
	Point.apply(this, arguments);
}
Vector2.prototype = new Point(this);
