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

Matrix2x2.prototype.dup = function() {
	return Matrix2x2_Set(this.m11, this.m12, this.m21, this.m22);
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
	//現在の値に掛け算する
	this.multiply(rotmat);
}

Matrix2x2.prototype.transform = function(vec2) {
	return new Vector2(this.m11 * vec2.x + this.m12 * vec2.y, this.m21 * vec2.x + this.m22 * vec2.y);
}

//行列同士の掛け算
Matrix2x2.prototype.multiply = function(mat2x2) {
	//コピーコンストラクタを実行
	var baseMatrix = this.dup();
	//計算
	//行列の掛け算…
	//(a, b)(p, q) = (ap + br, aq + bs)
	//(c, d)(r, s)   (cp + dr, cq + ds)
	this.set(baseMatrix.m11 * mat2x2.m11 + baseMatrix.m12 * mat2x2.m21, 
			 baseMatrix.m11 * mat2x2.m12 + baseMatrix.m12 * mat2x2.m22,
			 baseMatrix.m21 * mat2x2.m11 + baseMatrix.m22 * mat2x2.m21,
			 baseMatrix.m21 * mat2x2.m12 + baseMatrix.m22 * mat2x2.m22);
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

