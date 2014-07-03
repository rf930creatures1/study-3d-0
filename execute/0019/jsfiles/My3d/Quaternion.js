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

function Quaternion_GenerateFromVec3(vec3, w) {
	Quaternion.call(vec3.x, vec3.y, vec3.z, w);
}
Quaternion_GenerateFromVec3.prototype = new Quaternion();

//クォータニオン同士の掛け算
Quaternion.prototype.multiply = function(q) {
	var vec3I = new Vector3(this.x, this.y, this.z);
	var vec3II = new Vector3(q.x, q.y, q.z);
	var w = this.w * q.w - vec3I.dot(vec3II);
	var cross = vec3I.cross(vec3II);
	return new Quaternion(cross.x + this.w * q.x + this.x * q.w, 
						   cross.y + this.w * q.y + this.y * q.w, 
						   cross.z + this.w * q.z + this.z * q.w, 
						   w);
}

//共役クォータニオン
Quaternion.prototype.conjugate = function() {
	return new Quaternion(-this.x, -this.y, -this.z, this.w);
}

//回転クォータニオン
Quaternion.prototype.transfrom = function(vec3, rad) {
	var p = new Quaternion(vec3.x, vec3.y, vec3.z, 0);
	var radian = rad / 2;
	var sin = Math.sin(radian);
	var cos = Math.cos(radian);
	var q = new Quaternion(vec3.x * sin, vec3.y * sin, vec3.z * sin, cos);
	var r = q.conjugate();
	var rp = r.multiply(p);
	return rp.multiply(q);
}

Quaternion.prototype.transfrom2 = function(vec3, rad) {
	var p = new Quaternion(vec3.x, vec3.y, vec3.z, 0);
	var radian = rad / 2;
	var sin = Math.sin(radian);
	var cos = Math.cos(radian);
	var q = new Quaternion(vec3.x * sin, vec3.y * sin, vec3.z * sin, cos);
	var r = q.conjugate();
	return r.multiply(q);
}

//回転行列生成
Quaternion.prototype.rotationMatrix = function() {
	return new Matrix4x4_Set(
		1 - 2 * (Math.pow(this.y, 2) + Math.pow(this.z, 2)), 2 * (this.x * this.y - this.w * this.z), 2 * (this.w * this.y + this.x * this.z), 0,
		2 * (this.x * this.y + this.w * this.z), 1 - 2 * (Math.pow(this.x, 2) + Math.pow(this.z, 2)), 2 * (this.y * this.z + this.w * this.x), 0,
		2 * (this.x * this.z + this.w * this.y), 2 * (this.y * this.z + this.w * this.x), 1 - 2 * (Math.pow(this.x, 2) + Math.pow(this.y, 2)), 0,
		0, 0, 0, 1);
}

/*
Quaternion.makeFromMatrix = function(_matrix4x4) {
	var m = _matrix4x4;
	
}
*/
