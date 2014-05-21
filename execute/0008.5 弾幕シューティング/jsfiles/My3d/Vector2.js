//=======================
//  Vector2クラス
//=======================
function Vector2(x, y) {
	if (x == null) x = 0;
	if (y == null) y = 0;
	this.x = x;
	this.y = y;
}

Vector2.prototype.dup = function() {
	return new Vector2(this.x, this.y);
}

Vector2.prototype.add = function(vec2) {
	this.x += vec2.x;
	this.y += vec2.y;
}

//引数のVector2までの距離
Vector2.prototype.distanceToTarget = function(target) {
	var x = this.x - target.x;
	var y = this.y - target.y;
	return Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2));
}
