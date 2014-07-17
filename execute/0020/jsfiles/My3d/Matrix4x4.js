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

//逆行列生成
Matrix4x4.prototype.reverseMatrix = function() {
	var a = [[this.m11, this.m12, this.m13, this.m14], 
			 [this.m21, this.m22, this.m23, this.m24], 
			 [this.m31, this.m32, this.m33, this.m34], 
			 [this.m41, this.m42, this.m43, this.m44]];
	//単位行列を作る
	var mid = Matrix4x4_Identity();
	var inv_a = [[mid.m11, mid.m12, mid.m13, mid.m14], 
				 [mid.m21, mid.m22, mid.m23, mid.m24], 
				 [mid.m31, mid.m32, mid.m33, mid.m34], 
				 [mid.m41, mid.m42, mid.m43, mid.m44]]; //ここに逆行列が入る
	var buf; //一時的なデータを蓄える
	var n = 4;  //配列の次数
	
	//掃き出し法
	for (var i = 0; i < n; i++){
		buf = 1 / a[i][i];
		for (var j = 0; j < n; j++){
			a[i][j] *= buf;
			inv_a[i][j] *= buf;
		}
		for (var j = 0; j < n; j++){
			if (i != j){
				buf = a[j][i];
				for (var k = 0; k < n; k++){
					a[j][k] -= a[i][k] * buf;
					inv_a[j][k] -= inv_a[i][k] * buf;
				}
			}
		}
	}
	return new Matrix4x4_Set(inv_a[0][0], inv_a[0][1], inv_a[0][2], inv_a[0][3], 
							 inv_a[1][0], inv_a[1][1], inv_a[1][2], inv_a[1][3], 
							 inv_a[2][0], inv_a[2][1], inv_a[2][2], inv_a[2][3], 
							 inv_a[3][0], inv_a[3][1], inv_a[3][2], inv_a[3][3]);
}

//行列の各値をスカラー倍する
Matrix4x4.prototype.scalerMultiply = function(scaler) {
	return Matrix4x4_Set(	this.m11 * scaler, 
							this.m12 * scaler, 
							this.m13 * scaler, 
							this.m14 * scaler, 
							this.m21 * scaler, 
							this.m22 * scaler, 
							this.m23 * scaler, 
							this.m24 * scaler, 
							this.m31 * scaler, 
							this.m32 * scaler, 
							this.m33 * scaler, 
							this.m34 * scaler, 
							this.m41 * scaler, 
							this.m42 * scaler, 
							this.m43 * scaler, 
							this.m44 * scaler);
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
function Matrix4x4_ViewMatrix(at, eye, up) { // at:注視点(カメラの向き), eye:視点(カメラの場所)
	if (up == null) up = new Vector3(0, 1, 0);           // カメラの視点から "上" の方向。通常(0, 1, 0)でよい。カメラ自体を回転させるときはこれを変える。
	var zaxis = at.subtract(eye).normalize();            // Vector3.normalize(eye-at);//左手系のときは(eye-at)、右手系のときは(at-eye)。
	var xaxis = up.cross(zaxis).normalize(); // Vector3.normalize(Vector3.cross(new Vector3(0, 1, 0), zaxis));
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

//任意軸回転の行列生成 (引数：回転軸を表す3Dベクトル, 角度ラジアン)
function Matrix4x4_ArbitraryAxisRotate(vec, rad) {
	var c = Math.cos(rad);
	var s = Math.sin(rad);
	var t = 1 - c;
	
	var nvec = vec.normalize();
	var x = nvec.x != null ? nvec.x : 0;
	var y = nvec.y != null ? nvec.y : 0;
	var z = nvec.z != null ? nvec.z : 0;
	
	return new Matrix4x4_Set(
 		t * x * x + c, 		t * x * y - s * z, 	t * x * z + s * y, 	0,
		t * y * x + s * z, 	t * y * y + c, 		t * y * z - s * x, 	0,
		t * z * x - s * y, 	t * z * y + s * x, 	t * z * z + c, 		0,
		0, 					0, 					0, 					1);
}

//軸原点も変えられる任意軸回転の行列生成 (引数：回転軸の原点, 回転軸を表す3Dベクトル, 角度ラジアン)
function Matrix4x4_SuperArbitraryAxisRotate(origin, vec, rad) {
	if (origin == null) origin = new Vector3();
	var ret = Matrix4x4_Identity();
	ret.translate(origin.x, origin.y, origin.z); //回転軸の原点に移動
	var rev = ret.reverseMatrix(); //元の場所に戻れるように、逆行列を準備しておく
	ret.multiply(Matrix4x4_ArbitraryAxisRotate(vec, rad)); //任意軸で回転
	ret.multiply(rev); //軸の原点から物の原点に戻る。
	return ret;
}
