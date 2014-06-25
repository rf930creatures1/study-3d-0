//=======================
//  Vector3クラス
//=======================
function Vector3(x, y, z) {
	this.set(x, y, z);
}

Vector3.prototype.set = function(x, y, z) {
	this.x = x;
	this.y = y;
	this.z = z;
}

Vector3.prototype.dup = function() {
	return new Vector3(this.x, this.y, this.z);
}

Vector3.prototype.offset = function(vec3) {
	this.x += vec3.x;
	this.y += vec3.y;
	this.z += vec3.z;
}

//引数のVector3までの距離
Vector3.prototype.distanceToTarget = function(target) {
	var x = target.x - this.x;
	var y = target.y - this.y;
	var z = target.z - this.z;
	return Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2) + Math.pow(z, 2));
}

//正規化
Vector3.prototype.normalize = function() {
	return this.normalize_thickness(1);
}
//1以外で正規化するなら、引数で指定
Vector3.prototype.normalize_thickness = function(thickness) {
	var len = Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
	var scale = thickness / len;
	return new Vector3(this.x * scale, this.y * scale, this.z * scale);
}

//加算
Vector3.prototype.add = function(vec3) {
	return new Vector3(this.x + vec3.x, this.y + vec3.y, this.z + vec3.z);
}

//減算
Vector3.prototype.subtract = function(vec3) {
	return new Vector3(this.x - vec3.x, this.y - vec3.y, this.z - vec3.z);
}

//内積
Vector3.prototype.dot = function(vec3) {
	return this.x * vec3.x + this.y * vec3.y + this.z * vec3.z;
}

//外積
Vector3.prototype.cross = function(vec3) {
	return new Vector3(this.y * vec3.z - this.z * vec3.y, this.z * vec3.x - this.x * vec3.z, this.x * vec3.y - this.y * vec3.x);
}
