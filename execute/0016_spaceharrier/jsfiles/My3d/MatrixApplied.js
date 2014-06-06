//================================
//  3D表示用マトリックス適用関数(頂点に適用)
//================================
//頂点データを配列で渡す
function MatrixApplied(model, matrix, divideW) {
	if (divideW == null) divideW = false;
	var retModel = [];
	for (var i = 0; i < model.length; i++) {
		if (model[i] != null) {
			if (!divideW) {
				retModel[i] = matrix.transform(model[i]);
			}
			else {
				retModel[i] = matrix.transformW(model[i]);
			}
		}
		else {
			retModel[i] = null;
		}
	}
	return retModel;
}

MatrixApplied.Camera = function(model, at, eye) {
	//ワールド座標からカメラ座標(カメラを原点としたときの座標)に変換
	var mat = Matrix4x4_ViewMatrix(at, eye);
	return MatrixApplied(model, mat, false);
}

//正射影行列
MatrixApplied.OrthogonalProjection = function(model, left, right, top, bottom, near, far) {
	//射影変換
	//カメラを原点として、カメラの広さ(視錐台)を定義する。
	//行列を噛ませた結果、中心を0として端が-1or1の数値を得ることができる。
	//(物はワールド座標Z=0、カメラはワールド座標Z=-10に居るが、カメラから見ると物はカメラ座標Z=10にあるので、引数のnearとfarはカメラから見てZ=5～15を見る。)
	var mat = Matrix4x4_OrthogonalProjectionMatrix(left, right, top, bottom, near, far);
	return MatrixApplied(model, mat, true);
}

//正射影行列
MatrixApplied.Perspective = function(model, left, right, top, bottom, near, far) {
	//射影変換
	//カメラを原点として、カメラの広さ(視錐台)を定義する。
	//行列を噛ませた結果、中心を0として端が-1or1の数値を得ることができる。
	//(物はワールド座標Z=0、カメラはワールド座標Z=-10に居るが、カメラから見ると物はカメラ座標Z=10にあるので、引数のnearとfarはカメラから見てZ=5～15を見る。)
	var mat = Matrix4x4_PerspectiveMatrix(left, right, top, bottom, near, far);
	return MatrixApplied(model, mat, true);
}

MatrixApplied.Screen = function(model, canvas) {
	//スクリーン変換
	//射影変換した座標を元に、(いわば正規化されているのでそこに)画面の大きさを掛けてスクリーン座標を得る。
	var mat = Matrix4x4_ViewportMatrix(canvas.canvas.width, canvas.canvas.height);
	return MatrixApplied(model, mat, false);
}
