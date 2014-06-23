//======================
// 座標系ガイド線クラス
//======================
function Guide3d(guideLength) { //表示する線の長さを引数で取る
	if (guideLength == null) guideLength = 100;
	var mp = [new Vector3(0, 0, 0), new Vector3(guideLength, 0, 0), new Vector3(0, guideLength, 0), new Vector3(0, 0, guideLength)];
	this.model = new Model(
					[new Polygon(mp[0], mp[1], mp[0]),
					 new Polygon(mp[0], mp[2], mp[0]),
					 new Polygon(mp[0], mp[3], mp[0])
					]
				);
}

//描画の実行
Guide3d.prototype.draw = function(canvas, at, eye, perspective, left, right, top, bottom, near, far) {
	canvas.save();
	
	this.model.World(Matrix4x4_Identity());
	this.model.Camera(at, eye);
	if (perspective) {
		this.model.Perspective(left, right, top, bottom, near, far);
	}
	else {
		this.model.OrthogonalProjection(left, right, top, bottom, near, far);
	}
	this.model.Screen(canvas);
	
	//描画する
	var len = this.model.screenPolygons.length;
	var linecolors = ["rgba(255, 0, 0, 0.5)", "rgba(0, 0, 255, 0.5)", "rgba(0, 255, 0, 0.5)"];
	var linecolorindex = 0;
	canvas.strokeStyle = linecolors[linecolorindex];
	for (var i = 0; i < len; i++) {
		var s = this.model.screenPolygons[i];
		canvas.beginPath();
		canvas.moveTo(s.p1.x, s.p1.y);
		canvas.lineTo(s.p2.x, s.p2.y);
		canvas.lineTo(s.p3.x, s.p3.y);
		canvas.closePath();
		canvas.stroke();
		linecolorindex++;
		canvas.strokeStyle = linecolors[linecolorindex];
	}
	
	canvas.restore();
}

