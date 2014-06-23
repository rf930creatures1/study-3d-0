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

/*
//正射影行列
Matrix4x4.prototype.orthogonalProjectionMatrix = function(width, height) {
	// http://marupeke296.com/DX10_No5_FontTexture.html
	return Matrix4x4_Set(2 / width, 0, 0, 0, 0, -2 / height, 0, 0, 0, 0, 1, 0, -1, 1, 0, 1);
	this.multiply(screen);
}
*/

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
Matrix4x4.prototype.rotateX = function(radian) {
	//X軸回転
	var cosed = Math.cos(radian);
	var sined = Math.sin(radian);
	var rotmat = Matrix4x4_Set(1, 0, 0, 0, 0, cosed, -sined, 0, 0, sined, cosed, 0, 0, 0, 0, 1);
	//現在の値に掛け算する
	this.multiply(rotmat);
}

//回転
Matrix4x4.prototype.rotateY = function(radian) {
	//Y軸回転
	var cosed = Math.cos(radian);
	var sined = Math.sin(radian);
	var rotmat = Matrix4x4_Set(cosed, 0, sined, 0, 0, 1, 0, 0, -sined, 0, cosed, 0, 0, 0, 0, 1);
	//現在の値に掛け算する
	this.multiply(rotmat);
}

//回転
Matrix4x4.prototype.rotateZ = function(radian) {
	//Z軸回転
	var cosed = Math.cos(radian);
	var sined = Math.sin(radian);
	var rotmat = Matrix4x4_Set(cosed, -sined, 0, 0, sined, cosed, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1);
	//現在の値に掛け算する
	this.multiply(rotmat);
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

Matrix4x4.prototype.transformW = function(vec3) {
	var ret = this.transform(vec3);
	var w = this.m41 * vec3.x + this.m42 * vec3.y + this.m43 * vec3.z + this.m44 * 1;
	var _w = 1 / w;
	ret.x *= _w;
	ret.y *= _w;
	ret.z *= _w;
	return ret;
}

//行列同士の掛け算
Matrix4x4.prototype.multiply = function(mat4x4) {
	//コピーコンストラクタを実行
	var baseMatrix = this.dup();
	var a = baseMatrix;
	var b = mat4x4;
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

//ビュー行列 (ワールド座標からカメラ座標にフィルタするための行列)
function Matrix4x4_ViewMatrix(at, eye) { // at:注視点(カメラの向き), eye:視点(カメラの場所)
	var cameraUpVector = new Vector3(0, 1, 0);           // カメラの視点から "上" の方向。通常(0, 1, 0)でよい。
	var zaxis = at.subtract(eye).normalize();            // Vector3.normalize(eye-at);//左手系のときは(eye-at)、右手系のときは(at-eye)。
	var xaxis = cameraUpVector.cross(zaxis).normalize(); // Vector3.normalize(Vector3.cross(new Vector3(0, 1, 0), zaxis));
	var yaxis = zaxis.cross(xaxis);                      // Vector3.Cross(zaxis, xaxis);
	//左手系の場合。右手系ならreturnでセットしている行列の順番を縦横入れ替えること。
	return Matrix4x4_Set(
		xaxis.x, xaxis.y, xaxis.z, -xaxis.dot(eye),
		yaxis.x, yaxis.y, yaxis.z, -yaxis.dot(eye),
		zaxis.x, zaxis.y, zaxis.z, -zaxis.dot(eye),
		0, 0, 0, 1 
	);
}

//正射影行列
function Matrix4x4_OrthogonalProjectionMatrix(left, right, top, bottom, near, far) {
	// http://marina.sys.wakayama-u.ac.jp/~tokoi/?date=20090829
	return Matrix4x4_Set(2 / (right - left), 0, 0, -((right + left) / (right - left)), 
						 0, 2 / (top - bottom), 0, -((top + bottom) / (top - bottom)), 
						 0, 0, 2 / (far - near), -((far + near) / (far - near)), 
						 0, 0, 0, 1);
}

//透視投影変換行列
function Matrix4x4_PerspectiveMatrix(left, right, top, bottom, near, far) {
	// http://marina.sys.wakayama-u.ac.jp/~tokoi/?date=20090829
	return Matrix4x4_Set(2 * near / (right - left), 0, -(right + left) / (right - left), 0, 
						 0, 2 * near / (top - bottom), -(top + bottom) / (top - bottom), 0, 
						 0, 0, (far + near) / (far - near), -((2 * far * near) / (far - near)), 
						 0, 0, 1, 0);
						 //もしかしたらカメラ行列はやっぱりeye-atでしたとかになるかもしれない。
}

//ビューポート行列 (スクリーン座標への変換)
function Matrix4x4_ViewportMatrix(width, height) {
	return Matrix4x4_Set(width / 2, 0, 0, width / 2, 0, -height / 2, 0, height / 2, 0, 0, 1, 0, 0, 0, 0, 1);
}

//行列入れ替え
function Matrix4x4_Transpose(mat4x4) {
	return Matrix4x4_Set(mat4x4.m11, mat4x4.m21, mat4x4.m31, mat4x4.m41,
						mat4x4.m12, mat4x4.m22, mat4x4.m32, mat4x4.m42,
						mat4x4.m13, mat4x4.m23, mat4x4.m33, mat4x4.m43,
						mat4x4.m14, mat4x4.m24, mat4x4.m34, mat4x4.m44);
}
