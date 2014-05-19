//=======================
//  Sizeクラス
//=======================
function Size(arg1, arg2) {
	switch (arguments.length) {
		case 1: this.copy(arg1); break;
		case 2: this.set(arg1, arg2); break;
		default: this.set(0, 0); break;
	}
}

Size.prototype.set = function(width, height) {
	this.width = width;
	this.height = height;
}

Size.prototype.copy = function(sz) {
	this.width = sz.width;
	this.height = sz.height;
}

Size.prototype.getPoint = function(pt) {
	return new Point(pt.x + this.width, pt.y + this.height);
}

//SizeFも完全コピーで作っとく
function SizeF(arg1, arg2) {
	Size.apply(this, arguments);
}
SizeF.prototype = new Size(this);