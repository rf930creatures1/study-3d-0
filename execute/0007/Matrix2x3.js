//=======================
//  Matrix2x3クラス
//=======================
function Matrix2x3() {
}

Matrix2x3.prototype.set = function(mt11, mt12, mt13, mt21, mt22, mt23) {
	this.m11 = mt11;
	this.m12 = mt12;
	this.m13 = mt13;
	this.m21 = mt21;
	this.m22 = mt22;
	this.m23 = mt23;
}

Matrix2x3.prototype.dup = function() {
	return Matrix2x3_Set(this.m11, this.m12, this.m13, this.m21, this.m22, this.m23);
}

Matrix2x3.prototype.setIdentity = function() {
	this.m11 = 1;
	this.m12 = 0;
	this.m13 = 0;
	this.m21 = 0;
	this.m22 = 1;
	this.m23 = 0;
}

Matrix2x3.prototype.setZero = function() {
	this.m11 = 0;
	this.m12 = 0;
	this.m13 = 0;
	this.m21 = 0;
	this.m22 = 0;
	this.m23 = 0;
}

//移動
Matrix2x3.prototype.translate = function(moveX, moveY) {
	this.m13 += moveX;
	this.m23 += moveY;
}

//拡大縮小
Matrix2x3.prototype.scale = function(scale) {
	this.m11 *= scale;
	this.m22 *= scale;
}

//回転
Matrix2x3.prototype.rotate = function(radian) {
	var cosed = Math.cos(radian);
	var sined = Math.sin(radian);
	var rotmat = new Matrix2x3_Set(cosed, -sined, 0, sined, cosed, 0);
	//現在の値に掛け算する
	this.multiply(rotmat);
}

//ベクトルと行列の内積
Matrix2x3.prototype.transform = function(vec2) {
	//(a, b, c)(z)   (az + bw + ct)
	//(d, e, f)(w) = (dz + ew + ft)
	//(g, h, i)(t)   (gz + hw + it)
	//i = 1, t = 1
	return new Vector2(this.m11 * vec2.x + this.m12 * vec2.y + this.m13 * 1, 
					   this.m21 * vec2.x + this.m22 * vec2.y + this.m23 * 1);
}

//行列同士の掛け算
Matrix2x3.prototype.multiply = function(mat2x3) {
	//コピーコンストラクタを実行
	var baseMatrix = this.dup();
	var a = baseMatrix;
	var b = mat2x3;
	var m31 = 0;
	var m32 = 0;
	var m33 = 0;
	//計算
	//行列の掛け算…
	//(a, b, c)(z, y, x)   (az + bw + ct, ay + bv + cs, ax + bu + cr)
	//(d, e, f)(w, v, u) = (dz + ew + ft, dy + ev + fs, dx + eu + fr)
	//(g, h, i)(t, s, r)   (gz + hw + it, gy + hv + is, gx + hu + ir)
	this.set(a.m11 * b.m11 + a.m12 * b.m21 + a.m13 * m31,  a.m11 * b.m12 + a.m12 * b.m22 + a.m13 * m32,  a.m11 * b.m13 + a.m12 * b.m23 + a.m13 * m33, 
			 a.m21 * b.m11 + a.m22 * b.m21 + a.m23 * m31,  a.m21 * b.m12 + a.m22 * b.m22 + a.m23 * m32,  a.m21 * b.m13 + a.m22 * b.m23 + a.m23 * m33);
}

//===staticメソッド的なもの===

function Matrix2x3_Identity() {
	var m = new Matrix2x3();
	m.setIdentity();
	return m;
}

function Matrix2x3_Set(mt11, mt12, mt13, mt21, mt22, mt23) {
	var m = new Matrix2x3();
	m.set(mt11, mt12, mt13, mt21, mt22, mt23);
	return m;
}

function Matrix2x3_Zero() {
	var m = new Matrix2x3();
	m.setZero();
	return m;
}

