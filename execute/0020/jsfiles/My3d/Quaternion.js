//=====================
// Quaternionクラス
//=====================

function Quaternion(x, y, z, w) {
	if (x == null) x = 0;
	if (y == null) y = 0;
	if (z == null) z = 0;
	if (w == null) w = 0;
	this.x = x;
	this.y = y;
	this.z = z;
	this.w = w;
}

Quaternion.rotate = function(transformVec3, axisVec3, rad, scale) {
	if (scale == null) scale = 1;
	var p = new Quaternion(transformVec3.x, transformVec3.y, transformVec3.z, 0);
	var r = rad / 2;
	var s = Math.sin(r);
	var c = Math.cos(r);
	axisVec3 = axisVec3.normalize();
	var q = new Quaternion(axisVec3.x * s * scale, axisVec3.y * s * scale, axisVec3.z * s * scale, c * scale);
	var qq = q.conjugate();
	//var qq_p = qq.multiply(p);
	//var qq_p_q = qq_p.multiply(q);
	//return new Vector3(qq_p_q.x, qq_p_q.y, qq_p_q.z);
	//右手座標系で、軸の根元から先端を見て反時計回りになるように、元々は作られていた。
	//なので、左手座標系で以下同文にしたいので、掛け算(qq*p*q)の順番を入れ替え(q*p*qq)てみる。
	//※入れ替えて大丈夫になるのは偶然かもしれないので、何かバグが起きたら変数rの宣言で「var r = -rad / 2;」にしてみる。
	var q_p = q.multiply(p);
	var q_p_qq = q_p.multiply(qq);
	return new Vector3(q_p_qq.x, q_p_qq.y, q_p_qq.z);
}

//クォータニオン同士の掛け算
Quaternion.prototype.multiply = function(q) {
	var vec3I = new Vector3(this.x, this.y, this.z);
	var vec3II = new Vector3(q.x, q.y, q.z);
	var w = this.w * q.w - vec3I.dot(vec3II);
	var cross = vec3I.cross(vec3II);
	return new Quaternion(this.w * q.x + q.w * this.x + cross.x, 
						  this.w * q.y + q.w * this.y + cross.y, 
						  this.w * q.z + q.w * this.z + cross.z, 
						  w);
}

//共役クォータニオン
Quaternion.prototype.conjugate = function() {
	return new Quaternion(-this.x, -this.y, -this.z, this.w);
}

//回転行列生成
Quaternion.prototype.rotationMatrix = function() {
	return new Matrix4x4_Set(
		1 - 2 * (Math.pow(this.y, 2) + Math.pow(this.z, 2)), 2 * (this.x * this.y - this.w * this.z), 2 * (this.w * this.y + this.x * this.z), 0,
		2 * (this.x * this.y + this.w * this.z), 1 - 2 * (Math.pow(this.x, 2) + Math.pow(this.z, 2)), 2 * (this.y * this.z + this.w * this.x), 0,
		2 * (this.x * this.z + this.w * this.y), 2 * (this.y * this.z + this.w * this.x), 1 - 2 * (Math.pow(this.x, 2) + Math.pow(this.y, 2)), 0,
		0, 0, 0, 1);
}

//最小弧クォータニオン
//とある2つのベクトルの、狭い方の角度を表すクォータニオンを取得する。
//クォータニオンなので中身を見てもパッとわかるものではないし、外部で使うことはほとんどない。
Quaternion.rotationArc = function(vec3I, vec3II) {
	vec3I.normalize();
	vec3II.normalize();
	var c = vec3I.cross(vec3II);
	var d = vec3I.dot(vec3II);
	var s = Math.sqrt((1 + d) * 2);
	return new Quaternion(c.x / s, c.y / s, c.z / s, s / 2);
}

//球面線形補間
Quaternion.prototype.slerp = function(q0, q1, rad) {
	var q0q1 = q0.w * q1.w + q0.x * q1.x + q0.y * q1.y + q0.z * q1.z;
	var ss = 1 - (q0q1 * q0q1);
	if (ss == 0){
		return new Quaternion(q0.x, q0.y, q0.z, q0.w);
	}
	else {
		var ph = Math.acos(q0q1);
		if(q0q1 < 0 && ph > Math.PI / 2){
			q0q1 = - q0.w * q1.w - q0.x * q1.x - q0.y * q1.y - q0.z * q1.z;
			ph = Math.acos(q0q1);
			var _1_dev_sinph = 1 / Math.sin(ph);
			var s0 = Math.sin(ph * (1 - rad)) * _1_dev_sinph;
			var s1 = Math.sin(ph * rad) * _1_dev_sinph;
			
			return new Quaternion(
				q0.x * s0 - q1.x * s1,
				q0.y * s0 - q1.y * s1,
				q0.z * s0 - q1.z * s1,
				q0.w * s0 - q1.w * s1
			);
		}
		else {
			var _1_dev_sinph = 1 / Math.sin(ph);
			var s0 = Math.sin(ph * (1 - rad)) * _1_dev_sinph;
			var s1 = Math.sin(ph * rad) * _1_dev_sinph;
			return new Quaternion(
				q0.x * s0 + q1.x * s1,
				q0.y * s0 + q1.y * s1,
				q0.z * s0 + q1.z * s1,
				q0.w * s0 + q1.w * s1
			);
		}
	}
}
