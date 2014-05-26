//=======================
//  Matrix4x4クラス
//=======================
function Matrix4x4() {
}

Matrix4x4.prototype.set = function(mt11, mt12, mt13, mt14, mt21, mt22, mt23, mt24, mt31, mt32, mt33, mt34, mt41, mt42, mt43, mt44) {
	this.m11 = mt11;	this.m12 = mt12;	this.m13 = mt13;	this.m14 = mt14;
	this.m21 = mt21;	this.m22 = mt22;	this.m23 = mt23;	this.m24 = mt24;
	this.m31 = mt31;	this.m32 = mt32;	this.m33 = mt33;	this.m34 = mt34;
	this.m41 = mt41;	this.m42 = mt42;	this.m43 = mt43;	this.m44 = mt44;
}

Matrix4x4.prototype.dup = function() {
	return Matrix4x4_Set(this.m11, this.m12, this.m13, this.m14, this.m21, this.m22, this.m23, this.m24, this.m31, this.m32, this.m33, this.m34, this.m41, this.m42, this.m43, this.m44);
}

Matrix4x4.prototype.setIdentity = function() {
	this.m11 = 1;	this.m12 = 0;	this.m13 = 0;	this.m14 = 0;
	this.m21 = 0;	this.m22 = 1;	this.m23 = 0;	this.m24 = 0;
	this.m31 = 0;	this.m32 = 0;	this.m33 = 1;	this.m34 = 0;
	this.m41 = 0;	this.m42 = 0;	this.m43 = 0;	this.m44 = 1;
}

Matrix4x4.prototype.setZero = function() {
	this.m11 = 0;	this.m12 = 0;	this.m13 = 0;	this.m14 = 0;
	this.m21 = 0;	this.m22 = 0;	this.m23 = 0;	this.m24 = 0;
	this.m31 = 0;	this.m32 = 0;	this.m33 = 0;	this.m34 = 0;
	this.m41 = 0;	this.m42 = 0;	this.m43 = 0;	this.m44 = 0;
}

//正射影行列
Matrix4x4.prototype.orthogonalProjectionMatrix = function(width, height) {
	// http://marupeke296.com/DX10_No5_FontTexture.html
	var screen = Matrix4x4_Set(2 / width, 0, 0, 0, 0, -2 / height, 0, 0, 0, 0, 1, 0, -1, 1, 0, 1);
	this.multiply(screen);
}

//移動
Matrix4x4.prototype.translate = function(moveX, moveY, moveZ) {
	//(a, b, ax + by + c)
	//(d, e, dx + ey + f)
	//(0, 0, 1)
	//変更すべきは3箇所
	this.m14 = this.m11 * moveX + this.m12 * moveY + this.m13 * moveZ + this.m14;
	this.m24 = this.m21 * moveX + this.m22 * moveY + this.m23 * moveZ + this.m24;
	this.m34 = this.m31 * moveX + this.m32 * moveY + this.m33 * moveZ + this.m34;
}

//拡大縮小
Matrix4x4.prototype.scale = function(scaleX, scaleY, scaleZ) {
	if (scaleY == null) scaleY = scaleX;
	if (scaleZ == null) scaleZ = scaleX;
	//(ax, by,  c)
	//(dx, ey,  f)
	//( 0,  0,  1)
	//変更すべきは9箇所
	this.m11 = this.m11 * scaleX;
	this.m12 = this.m12 * scaleY;
	this.m13 = this.m13 * scaleZ;
	this.m21 = this.m21 * scaleX;
	this.m22 = this.m22 * scaleY;
	this.m23 = this.m23 * scaleZ;
	this.m31 = this.m31 * scaleX;
	this.m32 = this.m32 * scaleY;
	this.m33 = this.m33 * scaleZ;
}

//回転
Matrix4x4.prototype.rotate = function(radianX, radianY, radianZ) {
	//X軸回転
	var cosed = Math.cos(radianX);
	var sined = Math.sin(radianX);
	var rotmatX = Matrix4x4_Set(1, 0, 0, 0, 0, cosed, -sined, 0, 0, sined, cosed, 0, 0, 0, 0, 1);
	//Y軸回転
	var cosed = Math.cos(radianY);
	var sined = Math.sin(radianY);
	var rotmatY = Matrix4x4_Set(cosed, 0, sined, 0, 0, 1, 0, 0, -sined, 0, cosed, 0, 0, 0, 0, 1);
	//Y軸回転
	var cosed = Math.cos(radianZ);
	var sined = Math.sin(radianZ);
	var rotmatZ = Matrix4x4_Set(cosed, -sined, 0, 0, sined, cosed, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1);
	//各回転を掛け合わせる
	rotmatX.multiply(rotmatY);
	rotmatX.multiply(rotmatZ);
	//現在の値に掛け算する
	this.multiply(rotmatX);
}

//ベクトルと行列の内積
Matrix4x4.prototype.transform = function(vec3) {
	//(a, b, c)(z)   (az + bw + ct)
	//(d, e, f)(w) = (dz + ew + ft)
	//(g, h, i)(t)   (gz + hw + it)
	//i = 1, t = 1
	return new Vector3(this.m11 * vec3.x + this.m12 * vec3.y + this.m13 * vec3.z + this.m14 * 1, 
					   this.m21 * vec3.x + this.m22 * vec3.y + this.m23 * vec3.z + this.m24 * 1, 
					   this.m31 * vec3.x + this.m32 * vec3.y + this.m33 * vec3.z + this.m34 * 1);
}

//行列同士の掛け算
Matrix4x4.prototype.multiply = function(mat2x3) {
	//コピーコンストラクタを実行
	var baseMatrix = this.dup();
	var a = baseMatrix;
	var b = mat2x3;
	//計算
	//行列の掛け算…
	//(a, b, c)(z, y, x)   (az + bw + ct, ay + bv + cs, ax + bu + cr)
	//(d, e, f)(w, v, u) = (dz + ew + ft, dy + ev + fs, dx + eu + fr)
	//(g, h, i)(t, s, r)   (gz + hw + it, gy + hv + is, gx + hu + ir)
	this.set(a.m11 * b.m11 + a.m12 * b.m21 + a.m13 * b.m31 + a.m14 * b.m41,  a.m11 * b.m12 + a.m12 * b.m22 + a.m13 * b.m32 + a.m14 * b.m42,  a.m11 * b.m13 + a.m12 * b.m23 + a.m13 * b.m33 + a.m14 * b.m43,  a.m11 * b.m14 + a.m12 * b.m24 + a.m13 * b.m34 + a.m14 * b.m44, 
			 a.m21 * b.m11 + a.m22 * b.m21 + a.m23 * b.m31 + a.m24 * b.m41,  a.m21 * b.m12 + a.m22 * b.m22 + a.m23 * b.m32 + a.m24 * b.m42,  a.m21 * b.m13 + a.m22 * b.m23 + a.m23 * b.m33 + a.m24 * b.m43,  a.m21 * b.m14 + a.m22 * b.m24 + a.m23 * b.m34 + a.m24 * b.m44, 
			 a.m31 * b.m11 + a.m32 * b.m21 + a.m33 * b.m31 + a.m34 * b.m41,  a.m31 * b.m12 + a.m32 * b.m22 + a.m33 * b.m32 + a.m34 * b.m42,  a.m31 * b.m13 + a.m32 * b.m23 + a.m33 * b.m33 + a.m34 * b.m43,  a.m31 * b.m14 + a.m32 * b.m24 + a.m33 * b.m34 + a.m34 * b.m44, 
			 a.m41 * b.m11 + a.m42 * b.m21 + a.m43 * b.m31 + a.m44 * b.m41,  a.m41 * b.m12 + a.m42 * b.m22 + a.m43 * b.m32 + a.m44 * b.m42,  a.m41 * b.m13 + a.m42 * b.m23 + a.m43 * b.m33 + a.m44 * b.m43,  a.m41 * b.m14 + a.m42 * b.m24 + a.m43 * b.m34 + a.m44 * b.m44);
}

//===staticメソッド的なもの===

function Matrix4x4_Identity() {
	var m = new Matrix4x4();
	m.setIdentity();
	return m;
}

function Matrix4x4_Set(mt11, mt12, mt13, mt14, mt21, mt22, mt23, mt24, mt31, mt32, mt33, mt34, mt41, mt42, mt43, mt44) {
	var m = new Matrix4x4();
	m.set(mt11, mt12, mt13, mt14, mt21, mt22, mt23, mt24, mt31, mt32, mt33, mt34, mt41, mt42, mt43, mt44);
	return m;
}

function Matrix4x4_Zero() {
	var m = new Matrix4x4();
	m.setZero();
	return m;
}

