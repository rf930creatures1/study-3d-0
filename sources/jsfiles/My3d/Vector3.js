//=======================
//  Vector3クラス
//=======================
function Vector3(arg1, arg2, arg3) {
	switch (arguments.length) {
		case 1: this.copy(arg1); break;
		case 3: this.set(arg1, arg2, arg3); break;
		default: this.set(0, 0, 0); break;
	}
}

Vector3.prototype.set = function(x, y, z) {
	this.x = x;
	this.y = y;
	this.z = z;
}

Vector3.prototype.copy = function(vec3) {
	this.x = vec3.x;
	this.y = vec3.y;
	this.z = vec3.z
}
