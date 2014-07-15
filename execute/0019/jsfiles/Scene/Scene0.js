//=======================
//  Scene0クラス
//=======================
function Scene0(gameManager) {
	GameScene.call(this, gameManager);
	
}
Scene0.prototype = new GameScene(this.gManager);
Scene0.prototype.init = function() {
	this.guide3d = new Guide3d(20);
	
	//位置データ (ワールド座標)
	this.position = new Vector3(0, 0, 0);
	
	//大きさ
	this.radius = 100;
	
	//モデルデータ (ローカル座標)

	//頂点
	var mp = [new Vector3(0, 10, 0), new Vector3(10, -10, 0), new Vector3(-10, -10, 0)];
	//モデル (nullを入れて面データ(MoveToとlineToの使い分けフラグ)にしている)
	this.model = new Model([new Polygon(
					//時計回りに描くと表になる。
					mp[0], mp[1], mp[2] 
					
				)]);
	
	//任意軸のガイド
	this.rotGenten = new Vector3(0, 0, 0);
	this.axisVec = (new Vector3(0, 1, 0)).normalize();
	var axisGuideLength = 20;
	this.axisVecEnd = new Vector3(	axisGuideLength * this.axisVec.x + this.rotGenten.x, 
									axisGuideLength * this.axisVec.y + this.rotGenten.y, 
									axisGuideLength * this.axisVec.z + this.rotGenten.z);
	//this.guideAar = new Model([new Polygon(this.rotGenten, this.axisVecEnd, this.rotGenten)]);
	this.guideAar = new Model([new Polygon(new Vector3(-this.axisVecEnd.x/2, -this.axisVecEnd.y/2, -this.axisVecEnd.z/2), this.rotGenten, this.axisVecEnd)]);
	
	
/*
	var mPolygons = [];
	for (var i in obj3dFile.groups[0].surfaces) {
		var polygons = Polygon.surfaceToTriangles(obj3dFile.groups[0].surfaces[i]);
		for (var j in polygons) {
			mPolygons.push(polygons[j])
		}
	}
	this.model = new Model(mPolygons);
*/

	this.xrot = 0;
	this.yrot = 0;
	this.zrot = 0;
	this.autorot = 0;
	
	//マウスの直前までの状態
	this.mouseButton = false;
	//マウスが最初に押されたときの点
	this.mouseOX = 0;
	this.mouseOY = 0;
	//マウスが押される直前のxyrot
	this.gxrot = 0;
	this.gyrot = 0;
	
	//投影変換どちらを使うか spaceキーで切り替え
	this.seisyaei = false;
	//space押しっぱなしでぱっぱと変更しないように、投影変換できるかフラグ
	this.seisyaeiChangePermissition = true;
}

Scene0.prototype.disp = function(canvas) {
	canvas.save();
	canvas.clearRect(0, 0, canvas.canvas.width, canvas.canvas.height);
	canvas.strokeStyle = (new Color(255, 255, 0, 0)).toContextString();
	canvas.fillStyle = (new Color(128, 0, 192, 0)).toContextString();
	
	
	var wMat = Matrix4x4_Identity();
	wMat.translate(this.position.x, this.position.y, this.position.z);
	
	//任意軸回転
	var saarMat = Matrix4x4_SuperArbitraryAxisRotate(this.rotGenten , this.axisVec, CircleCalculator.toRadian(this.autorot));
	wMat.multiply(saarMat); //以上の情報をワールドマトリックスに格納する
	//任意軸回転ここまで
	
	//this.model.World(wMat);
	this.model.WorldQ(this.axisVec, CircleCalculator.toRadian(this.autorot));
	
	var at = new Vector3(0, 0, 0);			//注視点(カメラの向き)
	var eye = new Vector3(0, 0, 0);			//視点	(カメラの場所)
	var up = new Vector3(0, 1, 0);			//上	(カメラ自身の回転)
	var eyeMat = Matrix4x4_Identity();
	var upMat = Matrix4x4_Identity();
	eyeMat.rotateY(CircleCalculator.toRadian(this.yrot));
	eyeMat.rotateX(CircleCalculator.toRadian(this.xrot));
	eyeMat.rotateZ(CircleCalculator.toRadian(this.zrot));
	//upMat.rotateZ(CircleCalculator.toRadian(this.zrot));
	eyeMat.translate(0, 0, -50);
	eye = eyeMat.transform(eye);
	up = upMat.transform(up);
	
	var near = 30;
	var far = 50;
	var nearPlaneWidth = 40;
	
	this.model.Camera(at, eye, up);
	if (this.seisyaei)
		this.model.OrthogonalProjection(-nearPlaneWidth/2, nearPlaneWidth/2, nearPlaneWidth/2, -nearPlaneWidth/2, near, far);
	else
		this.model.Perspective(-nearPlaneWidth/2, nearPlaneWidth/2, nearPlaneWidth/2, -nearPlaneWidth/2, near, far);
	this.model.Screen(canvas);
	
	var fillColors = [
		new Color(255, 192, 0, 0), new Color(255, 192, 0, 0), 
		new Color(255, 0, 192, 0), new Color(255, 0, 192, 0), 
		new Color(255, 0, 0, 192), new Color(255, 0, 0, 192), 
		new Color(255, 0, 192, 192), new Color(255, 0, 192, 192), 
		new Color(255, 192, 192, 0), new Color(255, 192, 192, 0), 
		new Color(255, 192, 0, 192), new Color(255, 192, 0, 192)
	];
	
	this.model.draw(canvas, null, fillColors);
	
	//3dガイドライン
	if (this.seisyaei) this.guide3d.projectionType = ProjectionType.SEISHAEI;
	else this.guide3d.projectionType = ProjectionType.TOUSHI;
	this.guide3d.draw(canvas, at, eye, up, -nearPlaneWidth/2, nearPlaneWidth/2, nearPlaneWidth/2, -nearPlaneWidth/2, near, far);
	
	//任意軸ガイドライン
	this.guideAar.World(Matrix4x4_Identity());
	this.guideAar.Camera(at, eye, up);
	if (this.seisyaei)
		this.guideAar.OrthogonalProjection(-nearPlaneWidth/2, nearPlaneWidth/2, nearPlaneWidth/2, -nearPlaneWidth/2, near, far);
	else
		this.guideAar.Perspective(-nearPlaneWidth/2, nearPlaneWidth/2, nearPlaneWidth/2, -nearPlaneWidth/2, near, far);
	this.guideAar.Screen(canvas);
	this.guideAar.draw(canvas, [new Color(255, 255, 255, 0)], null);
	
	canvas.restore();
}

Scene0.prototype.step = function() {
	this.autorot += 50 * FPS;
	if (this.gManager.keyInput.mouseButton) {
		//それまで押されていなかった場合、
		if (!this.mouseButton) {
			//移動の原点情報を格納する
			this.mouseOX = this.gManager.keyInput.mouseX;
			this.mouseOY = this.gManager.keyInput.mouseY;
			this.gxrot = this.xrot;
			this.gyrot = this.yrot;
		}
		//角度を決める
		this.yrot = (this.gManager.keyInput.mouseX - this.mouseOX) + this.gyrot;
		this.xrot = (this.gManager.keyInput.mouseY - this.mouseOY) + this.gxrot;
	}
	else {
		if (this.gManager.keyInput.left) {
			this.yrot -= 40 * FPS;
		}
		else if (this.gManager.keyInput.right) {
			this.yrot += 40 * FPS;
		}
		if (this.gManager.keyInput.up) {
			this.xrot -= 40 * FPS;
		}
		else if (this.gManager.keyInput.down) {
			this.xrot += 40 * FPS;
		}
		if (this.gManager.keyInput.space) {
			if (this.seisyaeiChangePermissition) {
				this.seisyaei = !this.seisyaei;
			}
			//一回離すのを待つ
			this.seisyaeiChangePermissition = false;
		}
		else {
			this.seisyaeiChangePermissition = true;
		}
	}
	this.mouseButton = this.gManager.keyInput.mouseButton;
}

Scene0.prototype.destroy = function() {

}
