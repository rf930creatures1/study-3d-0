//=======================
//  Vector2クラス
//=======================
function Vector2(arg1, arg2) {
	switch (arguments.length) {
		case 1: this.copy(arg1); break;
		case 2: this.set(arg1, arg2); break;
		default: this.set(0, 0); break;
	}
}

Vector2.prototype.set = function(x, y) {
	this.x = x;
	this.y = y;
}

Vector2.prototype.copy = function(pt) {
	this.x = pt.x;
	this.y = pt.y;
}
