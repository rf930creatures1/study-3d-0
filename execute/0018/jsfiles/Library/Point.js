//=======================
//  Pointクラス
//=======================
function Point(arg1, arg2) {
	switch (arguments.length) {
		case 1: this.copy(arg1); break;
		case 2: this.set(arg1, arg2); break;
		default: this.set(0, 0); break;
	}
}

Point.prototype.set = function(x, y) {
	this.x = x;
	this.y = y;
}

Point.prototype.copy = function(pt) {
	this.x = pt.x;
	this.y = pt.y;
}

//PointFも完全コピーで作っとく
function PointF(arg1, arg2) {
	Point.apply(this, arguments);
}
PointF.prototype = new Point(this);
