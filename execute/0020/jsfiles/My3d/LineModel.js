//================
//  LineModelクラス
//================
function LineModel(line3Ds) {
	Model.call(this, line3Ds);
}

LineModel.prototype = new Model();

//モデルデータから面データを取り出していく
LineModel.prototype.MatrixApplied = function(line3Ds, matrix, divideW) {
	if (divideW == null) divideW = false;
	var retModel = [];
	for (var i = 0; i < line3Ds.length; i++) {
		var t;
		if (!divideW) {
			var p1 = matrix.transform(line3Ds[i].p1);
			var p2 = matrix.transform(line3Ds[i].p2);
			t = new Line3d(p1, p2);
		}
		else {
			var p1 = matrix.transformW(line3Ds[i].p1);
			var p2 = matrix.transformW(line3Ds[i].p2);
			t = new Line3d(p1, p2);
		}
		retModel[i] = t;
	}
	return retModel;
}

LineModel.prototype.BoneAppend = function() {
	var append = [];
	for (var i = 0; i < this.localPolygons.length; i++) {
		var p1 = this.localPolygons[i].p1.transform();
		var p2 = this.localPolygons[i].p2.transform();
		append[i] = new Line3d(p1, p2, p3);
	}
	this.bonePolygons = append;
}

//モデル描画
LineModel.prototype.draw = function(canvas, strokeColors) {
	canvas.save();
	for (var i in this.screenPolygons) {
		if (strokeColors != null && strokeColors.length > 0) {
			canvas.strokeStyle = strokeColors[i % strokeColors.length].toContextString();
		}
		var s = this.screenPolygons[i];
		canvas.beginPath();
		canvas.moveTo(s.p1.x, s.p1.y);
		canvas.lineTo(s.p2.x, s.p2.y);
		canvas.closePath();
		canvas.stroke();
	}
	canvas.restore();
}
