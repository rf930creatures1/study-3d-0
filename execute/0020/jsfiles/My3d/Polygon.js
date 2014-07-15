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

//頂点データの配列を渡して、2つ以下なら0個、3つなら1個、4つなら2個、5つなら3個…のPolygon(三角形)を配列で返す。
//法線データの配列も渡すと、法線に沿って表や裏を決める。
Polygon.vertexesToTriangles = function(vertexes, normalVectors) {
	var ret = [];
	
	if (normalVectors != null && normalVertors.length != vertexes.length) {
		//配列数が一致しないと不具合が生じる可能性があるので一応デバッグ出力する
		dp("Polygon.vertexesToTriangles::頂点データと法線データの配列数が一致しなかった");
	}
	
	for (var i = 0; i < vertexes.length - 2; i++) {
		var tri = new Polygon(vertexes[0], vertexes[i + 1], vertexes[i + 2]);
		if (normalVectors != null) {
			var nvAverage = (normalVectors[0] + normalVectors[i + 1] + normalVectors[i + 2]) / 3;
			if (tri.isObverse() != (nvAverage < 0)) {
				var swap = tri.p2;
				tri.p2 = tri.p3;
				tri.p3 = swap;
			}
		}
		ret.push(tri);
	}
	return ret;
}

//頂点データの配列を渡して、2つ以下なら0個、3つなら1個、4つなら2個、5つなら3個…のPolygon(三角形)を配列で返す。
//法線データの配列も渡すと、法線に沿って表や裏を決める。
//Surfaceバージョン
Polygon.surfaceToTriangles = function(surface) {
	var ret = [];
	
	for (var i = 0; i < surface.surfaceVertexes.length - 2; i++) {
		var sv1 = surface.surfaceVertexes[0];
		var sv2 = surface.surfaceVertexes[i + 1];
		var sv3 = surface.surfaceVertexes[i + 2];
		var tri = new Polygon(sv1.vertex, sv2.vertex, sv3.vertex);
		var nvAverage = (new Vector3(sv1.normalVector.x + sv2.normalVector.x + sv3.normalVector.x, sv1.normalVector.y + sv2.normalVector.y + sv3.normalVector.y, sv1.normalVector.z + sv2.normalVector.z + sv3.normalVector.z)).normalize();
		if (tri.isObverse() != (nvAverage.z < 0)) {
			var swap = tri.p2;
			tri.p2 = tri.p3;
			tri.p3 = swap;
		}
		ret.push(tri);
	}
	return ret;
}
