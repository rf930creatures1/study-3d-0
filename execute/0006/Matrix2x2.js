//=======================
//  Matrix2x2クラス
//=======================
function Matrix2x2() {
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

Matrix2x2.prototype.scale = function(scale) {
	this.m11 *= scale;
	this.m22 *= scale;
}

Matrix2x2.prototype.rotate = function(radian) {
	var cosed = Math.cos(radian);
	var sined = Math.sin(radian);
	var rotmat = new Matrix2x2_Set(cosed, -sined, sined, cosed);
	//行列の掛け算…
	//(a, b)(p, q) = (ap + br, aq + bs)
	//(c, d)(r, s)   (cp + dr, cq + ds)
	var outmat = new Matrix2x2_Set(
				this.m11 * rotmat.m11 + this.m12 * rotmat.m21, 
				this.m11 * rotmat.m12 + this.m12 * rotmat.m22,
				this.m12 * rotmat.m11 + this.m22 * rotmat.m21,
				this.m12 * rotmat.m12 + this.m22 * rotmat.m22);
	this.m11 = outmat.m11;
	this.m12 = outmat.m12;
	this.m21 = outmat.m21;
	this.m22 = outmat.m22;
}

Matrix2x2.prototype.transform = function(vec2) {
	return new Vector2(this.m11 * vec2.x + this.m12 * vec2.y, this.m21 * vec2.x + this.m22 * vec2.y);
}



//===staticメソッド的なもの===

function Matrix2x2_Identity() {
	var m = new Matrix2x2();
	m.setIdentity();
	return m;
}

function Matrix2x2_Set(mt11, mt12, mt21, mt22) {
	var m = new Matrix2x2();
	m.set(mt11, mt12, mt21, mt22);
	return m;
}

function Matrix2x2_Zero() {
	var m = new Matrix2x2();
	m.setZero();
	return m;
}
