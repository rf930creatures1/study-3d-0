//=======================
//  Vector4クラス
//=======================
function Vector4(x, y, z, w) {
	this.set(x, y, z, w);
}

Vector4.prototype.set = function(x, y, z, w) {
	this.x = x;
	this.y = y;
	this.z = z;
}

Vector4.prototype.dup = function() {
	return new Vector4(this.x, this.y, this.z, this.w);
}

Vector4.prototype.offset = function(vec4) {
	this.x += vec4.x;
	this.y += vec4.y;
	this.z += vec4.z;
	this.w += vec4.w;
}

//引数のVector3までの距離
Vector4.prototype.distanceToTarget = function(target) {
	var x = target.x - this.x;
	var y = target.y - this.y;
	var z = target.z - this.z;
	return Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2) + Math.pow(z, 2));
}

//正規化
Vector4.prototype.normalize = function() {
	return this.normalize_thickness(1);
}
//1以外で正規化するなら、引数で指定
Vector4.prototype.normalize_thickness = function(thickness) {
	var len = Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
	var scale = thickness / len;
	return new Vector4(this.x * scale, this.y * scale, this.z * scale, this.w * scale);
}

//加算
Vector4.prototype.add = function(vec4) {
	return new Vector4(this.x + vec4.x, this.y + vec4.y, this.z + vec4.z, this.w + vec4.w);
}

//減算
Vector4.prototype.subtract = function(vec4) {
	return new Vector4(this.x - vec4.x, this.y - vec4.y, this.z - vec4.z, this.w - vec4.w);
}

//内積
Vector4.prototype.dot = function(vec4) {
	return this.x * vec4.x + this.y * vec4.y + this.z * vec4.z;
}

//外積
Vector4.prototype.cross = function(vec4) {
	return new Vector4(this.y * vec4.z - this.z * vec4.y, this.z * vec4.x - this.x * vec4.z, this.x * vec4.y - this.y * vec4.x);
}
