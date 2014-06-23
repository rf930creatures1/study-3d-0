//================
//  Polygonクラス
//================
function Polygon(p1, p2, p3) {
	this.p1 = p1;
	this.p2 = p2;
	this.p3 = p3;
}

function Polygon_ExtraConstractor1(x1, y1, z1, x2, y2, z2, x3, y3, z3) {
	Polygon.call(this, new Vector3(x1, y1, z1), new Vector3(x2, y2, z2), new Vector3(x3, y3, z3));
}
Polygon_ExtraConstractor1.prototype = new Polygon();

//3点からなる面が表か
Polygon.prototype.isObverse = function() {
	var p1 = this.p1;
	var p2 = this.p2;
	var p3 = this.p3;
	var v1 = new Vector3(p1.x - p3.x, p1.y - p3.y, p1.z - p3.z);
	var v2 = new Vector3(p2.x - p3.x, p2.y - p3.y, p2.z - p3.z);
	var v3 = v1.cross(v2);
	var vn = v3.normalize();
	return vn.z < 0; //マイナス方向を向いている = こちらを向いているので、表。
}
