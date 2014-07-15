//================
//  Modelクラス
//================
function Model(polygons) {
	//ポリゴンをそれぞれ配列で保管する。
	this.localPolygons = polygons;
	this.worldPolygons = null;
	this.cameraPolygons = null;
	this.projectionPolygons = null;
	this.screenPolygons = null;
}

//モデルデータから面データを取り出していく
Model.prototype.MatrixApplied = function(polygons, matrix, divideW) {
	if (divideW == null) divideW = false;
	var retModel = [];
	for (var i = 0; i < polygons.length; i++) {
		var t;
		if (!divideW) {
			var p1 = matrix.transform(polygons[i].p1);
			var p2 = matrix.transform(polygons[i].p2);
			var p3 = matrix.transform(polygons[i].p3);
			t = new Polygon(p1, p2, p3);
		}
		else {
			var p1 = matrix.transformW(polygons[i].p1);
			var p2 = matrix.transformW(polygons[i].p2);
			var p3 = matrix.transformW(polygons[i].p3);
			t = new Polygon(p1, p2, p3);
		}
		retModel[i] = t;
	}
	return retModel;
}

//ローカル座標からワールド座標へ変換
Model.prototype.World = function(matrix) {
	this.worldPolygons = this.MatrixApplied(this.localPolygons, matrix, false);
}

//ローカル座標からワールド座標へ変換 クォータニオンを使う
Model.prototype.WorldQ = function(axisVec3, rad) {
	var polygons = this.localPolygons;
	var retModel = [];
	for (var i = 0; i < polygons.length; i++) {
		var p1 = Quaternion.rotate(polygons[i].p1, axisVec3, rad);
		var p2 = Quaternion.rotate(polygons[i].p2, axisVec3, rad);
		var p3 = Quaternion.rotate(polygons[i].p3, axisVec3, rad);
		var t = new Polygon(p1, p2, p3);
		retModel[i] = t;
	}
	
	this.worldPolygons = retModel;
}

//ワールド座標からカメラ座標(カメラを原点としたときの座標)へ変換
Model.prototype.Camera = function(at, eye, up) {
	var mat = Matrix4x4_ViewMatrix(at, eye, up);
	this.cameraPolygons = this.MatrixApplied(this.worldPolygons, mat, false);
}

//正射影行列
Model.prototype.OrthogonalProjection = function(left, right, top, bottom, near, far) {
	//射影変換
	//カメラを原点として、カメラの広さ(視錐台)を定義する。
	//行列を噛ませた結果、中心を0として端が-1or1の数値を得ることができる。
	//(物はワールド座標Z=0、カメラはワールド座標Z=-10に居るが、カメラから見ると物はカメラ座標Z=10にあるので、引数のnearとfarはカメラから見てZ=5～15を見る。)
	var mat = Matrix4x4_OrthogonalProjectionMatrix(left, right, top, bottom, near, far);
	this.projectionPolygons = this.MatrixApplied(this.cameraPolygons, mat, true);
}

//投影変換行列
Model.prototype.Perspective = function(left, right, top, bottom, near, far) {
	//射影変換
	//カメラを原点として、カメラの広さ(視錐台)を定義する。
	//行列を噛ませた結果、中心を0として端が-1or1の数値を得ることができる。
	//(物はワールド座標Z=0、カメラはワールド座標Z=-10に居るが、カメラから見ると物はカメラ座標Z=10にあるので、引数のnearとfarはカメラから見てZ=5～15を見る。)
	var mat = Matrix4x4_PerspectiveMatrix(left, right, top, bottom, near, far);
	this.projectionPolygons = this.MatrixApplied(this.cameraPolygons, mat, true);
}

//スクリーン座標へ変換
Model.prototype.Screen = function(canvas) {
	//射影変換した座標を元に、(いわば正規化されているのでそこに)画面の大きさを掛けてスクリーン座標を得る。
	var mat = Matrix4x4_ViewportMatrix(canvas.canvas.width, canvas.canvas.height);
	this.screenPolygons = this.MatrixApplied(this.projectionPolygons, mat, false);
}

//モデル描画
Model.prototype.draw = function(canvas, strokeColors, fillColors) {
	canvas.save();
	for (var i in this.screenPolygons) {
		if (strokeColors != null && strokeColors.length > 0) {
			canvas.strokeStyle = strokeColors[i % strokeColors.length].toContextString();
		}
		var s = this.screenPolygons[i];
		canvas.beginPath();
		canvas.moveTo(s.p1.x, s.p1.y);
		canvas.lineTo(s.p2.x, s.p2.y);
		canvas.lineTo(s.p3.x, s.p3.y);
		canvas.closePath();
		if (this.cameraPolygons[i].isObverse()) {
			if (fillColors != null && fillColors.length > 0) {
				canvas.fillStyle = fillColors[i % fillColors.length].toContextString();
			}
			canvas.fill();
		}
		canvas.stroke();
	}
	canvas.restore();
}
