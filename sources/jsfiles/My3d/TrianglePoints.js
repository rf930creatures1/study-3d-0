//=======================
//  TrianglePointsクラス
//=======================
function TrianglePoints(arg1, arg2, arg3, arg4, arg5, arg6, arg7, arg8, arg9) {
	switch (arguments.length) {
		case 1: this.copy(arg1); break;
		case 3: this.set(arg1, arg2, arg3); break;
		case 9: this.vecset(arg1, arg2, arg3, arg4, arg5, arg6, arg7, arg8, arg9); break;
		default: this.vecset(0, 0, 0, 0, 0, 0, 0, 0, 0); break;
	}
}

TrianglePoints.prototype.set = function(vec3_1, vec3_2, vec3_3) {
	this.p1 = vec3_1;
	this.p2 = vec3_2;
	this.p3 = vec3_3;
}

TrianglePoints.prototype.copy = function(triangle) {
	this.p1 = triangle.p1;
	this.p2 = triangle.p2;
	this.p3 = triangle.p3;
}

TrianglePoints.prototype.vecset = function(vec3_p1_x, vec3_p1_y, vec3_p1_z, vec3_p2_x, vec3_p2_y, vec3_p2_z, vec3_p3_x, vec3_p3_y, vec3_p3_z) {
	this.p1 = new Vector3(vec3_p1_x, vec3_p1_y, vec3_p1_z);
	this.p2 = new Vector3(vec3_p2_x, vec3_p2_y, vec3_p2_z);
	this.p3 = new Vector3(vec3_p3_x, vec3_p3_y, vec3_p3_z);
}
