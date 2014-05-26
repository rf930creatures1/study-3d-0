//=======================
//  Vector3クラス
//=======================
function Vector3(x, y, z) {
	this.x = x;
	this.y = y;
	this.z = z;
}

Vector3.prototype.dup = function() {
	return new Vector3(this.x, this.y, this.z);
}

Vector3.prototype.add = function(vec3) {
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
