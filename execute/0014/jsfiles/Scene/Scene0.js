//=======================
//  Scene0クラス
//=======================
function Scene0(gameManager) {
	GameScene.call(this, gameManager);
	
}
Scene0.prototype = new GameScene(this.gManager);
Scene0.prototype.init = function() {
	//位置データ (ワールド座標)
	this.position = new Vector3(0, 0, 0);
	
	//大きさ
	this.radius = 100; 
	
	//モデルデータ (ローカル座標)
	//頂点
	var mp = [new Vector3(-10, 10, -10), new Vector3(10, 10, -10), new Vector3(10, -10, -10), new Vector3(-10, -10, -10),
			new Vector3(10, 10, 10), new Vector3(10, -10, 10), new Vector3(-10, -10, 10), new Vector3(-10, 10, 10)];
	//モデル (nullを入れて面データ(MoveToとlineToの使い分けフラグ)にしている)
	this.model = [
					//正面
					mp[0], mp[1], mp[2], mp[3], null, 
					//上面
					mp[7], mp[4], mp[1], mp[0], null, 
					//背面
					mp[4], mp[5], mp[6], mp[7], null, 
					//下面
					mp[5], mp[2], mp[3], mp[6], null, 
					//右面
					mp[1], mp[4], mp[5], mp[2], null, 
					//左面
					mp[7], mp[6], mp[3], mp[0], null, 
				];
	
	this.yrot = 0;
	
	//マウスの直前までの状態
	this.mouseButton = false;
	//マウスが最初に押されたときの点
	this.mouseOX = 0;
	//マウスが押される直前のyrot
	this.gyrot = 0;
}

Scene0.prototype.disp = function(canvas) {
	canvas.save();
	canvas.clearRect(0, 0, canvas.canvas.width, canvas.canvas.height);
	canvas.strokeStyle = "rgb(255, 0, 0)";
	canvas.fillStyle = "rgb(64, 0, 0)";
	
	//行列の作成と適用 ローカル座標からワールド座標に変換
	var wMat = Matrix4x4_Identity();
	wMat.translate(this.position.x, this.position.y, this.position.z);
	var wDrawnModel = [];
	for (var i = 0; i < this.model.length; i++) {
		if (this.model[i] != null) {
			wDrawnModel[i] = wMat.transform(this.model[i]);
		}
		else {
			wDrawnModel[i] = null;
		}
	}
	
	//ワールド座標からカメラ座標(カメラを原点としたときの座標)に変換
	var at = new Vector3(0, 0, 0);			//注視点(カメラの向き)
	var eye = new Vector3(0, 0, -50);		//視点	(カメラの場所)
	var eyeMat = Matrix4x4_Identity();
	eyeMat.rotateY(CircleCalculator.toRadian(this.yrot));
	eyeMat.rotateX(CircleCalculator.toRadian(20));
	eye = eyeMat.transform(eye);
	var cMat = Matrix4x4_ViewMatrix(at, eye);
	var cDrawnModel = [];
	for (var i = 0; i < this.model.length; i++) {
		if (wDrawnModel[i] != null) {
			cDrawnModel[i] = cMat.transform(wDrawnModel[i]);
		}
		else {
			cDrawnModel[i] = null;
		}
	}
	
	//射影変換
	//カメラを原点として、カメラの広さ(視錐台)を定義する。
	//行列を噛ませた結果、中心を0として端が-1or1の数値を得ることができる。
	//(物はワールド座標Z=0、カメラはワールド座標Z=-10に居るが、カメラから見ると物はカメラ座標Z=10にあるので、引数のnearとfarはカメラから見てZ=5～15を見る。)
	//var pMat = Matrix4x4_OrthogonalProjectionMatrix(-20, 20, 20, -20, 5, 15);
	var pMat = Matrix4x4_PerspectiveMatrix(-20, 20, 20, -20, 30, 50);
	var pDrawnModel = [];
	for (var i = 0; i < this.model.length; i++) {
		if (cDrawnModel[i] != null) {
			pDrawnModel[i] = pMat.transformW(cDrawnModel[i]);
		}
		else {
			pDrawnModel[i] = null;
		}
	}
	
	//スクリーン変換
	//射影変換した座標を元に、(いわば正規化されているのでそこに)画面の大きさを掛けてスクリーン座標を得る。
	var sMat = Matrix4x4_ViewportMatrix(canvas.canvas.width, canvas.canvas.height);
	var sDrawnModel = [];
	for (var i = 0; i < this.model.length; i++) {
		if (pDrawnModel[i] != null) {
			sDrawnModel[i] = sMat.transform(pDrawnModel[i]);
		}
		else {
			sDrawnModel[i] = null;
		}
	}
	
	//描画する
	var drawnModel = sDrawnModel;
	var len = this.model.length;
	var moveto = true;
	var linecolors = ["rgb(255, 0, 0)", "rgb(255, 255, 0)", "rgb(255, 255, 255)", "rgb(0, 255, 0)", "rgb(0, 255, 255)", "rgb(0, 0, 255)" ];
	var linecolorindex = 0;
	for (var i = 0; i < len; i++) {
		if (drawnModel[i] != null) {
			if (moveto) {
				canvas.beginPath();
				canvas.moveTo(drawnModel[i].x, drawnModel[i].y);
			}
			else {
				canvas.lineTo(drawnModel[i].x, drawnModel[i].y);
			}
			moveto = false;
		}
		else {
			canvas.closePath();
			moveto = true;
			canvas.stroke();
			linecolorindex++;
			canvas.strokeStyle = linecolors[linecolorindex];
		}
	}
	
	canvas.restore();
}

Scene0.prototype.step = function() {
	if (this.gManager.keyInput.mouseButton) {
		//それまで押されていなかった場合、
		if (!this.mouseButton) {
			//移動の原点情報を格納する
			this.mouseOX = this.gManager.keyInput.mouseX;
			this.gyrot = this.yrot;
		}
		//角度を決める
		this.yrot = -(this.gManager.keyInput.mouseX - this.mouseOX) + this.gyrot;
	}
	else {
		if (this.gManager.keyInput.left) {
			this.yrot += 40 * FPS;
		}
		else if (this.gManager.keyInput.right) {
			this.yrot -= 40 * FPS;
		}
	}
	this.mouseButton = this.gManager.keyInput.mouseButton;
}

Scene0.prototype.destroy = function() {

}
