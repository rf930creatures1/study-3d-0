//================
//  Line3dクラス
//================
function Line3d(p1, p2) {
	this.p1 = p1;
	this.p2 = p2;
}

function Line3d_ExtraConstractor1(x1, y1, z1, x2, y2, z2) {
	Line3d.call(this, new Vector3(x1, y1, z1), new Vector3(x2, y2, z2));
}
Line3d_ExtraConstractor1.prototype = new Polygon();
