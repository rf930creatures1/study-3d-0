//=======================
//  Matrix2x2クラス
//=======================
function Matrix2x2() {
	this.setIdentity();
}

Matrix2x2.prototype.set = function(mt11, mt12, mt21, mt22) {
	this.m11 = mt11;
	this.m12 = mt12;
	this.m21 = mt21;
	this.m22 = mt22;
}

Matrix2x2.prototype.setIdentity = function() {
	this.m11 = 1;
	this.m12 = 0;
	this.m21 = 0;
	this.m22 = 1;
}

Matrix2x2.prototype.setZero = function() {
	this.m11 = 0;
	this.m12 = 0;
	this.m21 = 0;
	this.m22 = 0;
}

Matrix2x2.prototype.setScale = function(scale) {
	this.m11 = scale;
	this.m22 = scale;
}

Matrix2x2.prototype.setRotate = function(radian) {
	var cosed = Math.cos(radian);
	var sined = Math.sin(radian);
	this.m11 = cosed;
	this.m12 = -sined;
	this.m21 = sined;
	this.m22 = cosed;
}

Matrix2x2.prototype.transform = function(vec2) {
	return new Vector2(this.m11 * vec2.x + this.m12 * vec2.y, this.m21 * vec2.x + this.m22 * vec2.y);
}



