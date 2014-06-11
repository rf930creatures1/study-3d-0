//=======================
//  弾クラス
//=======================
function Ammo(x, y, radius, moveSpeed, moveVector, disableTags, color) {
	//弾の位置 (ワールド座標)
	if (x == null) x = 0;
	if (y == null) y = 0;
	this.position = new Vector2(x, y); 
	//半径 (ローカル座標)
	if (radius == null) radius = 5;
	this.radius = radius; 
	//回転度合
	this.rotation = 0; 
	//モデルデータ (ローカル座標)
	this.model = [new Vector2(-this.radius, 0), 
					new Vector2(this.radius, 0), 
					new Vector2(0, -this.radius), 
					new Vector2(0, this.radius)];
	//描画するかどうか
	this.visible = false;
	//回転速度 移動が早ければ回転は遅い
	if (moveSpeed == null) moveSpeed = 50;
	this.rotationSpeed = 15 / (moveSpeed * FPS);
	//移動スピード
	if (moveVector.x == null) moveVector.x = 0;
	if (moveVector.y == null) moveVector.y = 1;
	this.moveSpeed = new Vector2(moveVector.x * moveSpeed * FPS, moveVector.y * moveSpeed * FPS);
	
	//弾が当たっても効かないヤツらリスト
	if (disableTags == null) disableTags = [];
	this.disables = disableTags;
	
	//弾の色
	if (color == null) color = new Color(255, 255, 0, 0);
	this.color = color;
}

Ammo.prototype.draw = function(canvas) {
	if (this.visible) {
		canvas.save();
		canvas.strokeStyle = this.color.toContextString();
		canvas.beginPath();
		
		//行列の作成と適用
		var mat = Matrix2x3_Identity();
		mat.translate(this.position.x, this.position.y);
		mat.rotate(CircleCalculator.toRadian(this.rotation));
		var drawnModel = [];
		for (var i = 0; i < this.model.length; i++) {
			drawnModel[i] = mat.transform(this.model[i]);
		}
		
		//弾は十字に描く
		for (var i = 0; i < 2; i++) {
			canvas.moveTo(drawnModel[i * 2].x, drawnModel[i * 2].y);
			canvas.lineTo(drawnModel[i * 2 + 1].x, drawnModel[i * 2 + 1].y);
		}
		
		canvas.closePath();
		canvas.stroke();
		canvas.restore();
	}
}

Ammo.prototype.subdraw = function(canvas, y1d) {
	if (this.visible) {
		canvas.save();
		canvas.strokeStyle = this.color.toContextString();
		canvas.beginPath();
		
		//行列の作成と適用
		var mat = Matrix2x3_Identity();
		mat.translate(this.position.x, this.position.y);
		mat.rotate(CircleCalculator.toRadian(this.rotation));
		var drawnModel = [];
		for (var i = 0; i < this.model.length; i++) {
			drawnModel[i] = mat.transform(this.model[i]);
		}
		
		//正射影行列
		/*
		var right = 384;
		var left = 0;
		for (var i = 0; i < this.model.length; i++) {
			var x = drawnModel[i].x;
			var xd = 2 * x / (right - left) - 1;
			//スクリーン座標へ
			var width = 384;
			drawnModel[i].x = xd * width;
			drawnModel[i].y = y1d;
		}*/
		/*
		var pMat = Matrix2x3_OrthogonalProjectionMatrix(0, 384);
		var wDrawnModel = drawnModel;
		var drawnModel = [];
		for (var i = 0; i < wDrawnModel.length; i++) {
			drawnModel[i] = pMat.transform(wDrawnModel[i]);
			drawnModel[i].x = (drawnModel[i].x + 1) * (384 / 2);
			drawnModel[i].y = y1d;
		}*/
		
		//透視変換
		var fr = 384;
		var fl = 0;
		var near = 0;
		var far = 512;
		var fRight = new Vector2(fr, far);
		var fLeft = new Vector2(fl, far);
		for (var i = 0; i < this.model.length; i++) {
			var p = drawnModel[i];
			var pLeft = new Vector2();
			var pRight = new Vector2();
			
			//Far板とP板と視点から、相似の三角形を求める
			pLeft.y = p.y;
			pRight.y = p.y;
			pLeft.x = fLeft.x * pRight.y / fRight.y;
			pRight.x = fRight.x * pLeft.y / fLeft.y;
			
			//ここから1次元。
			//pLeftとpRightを使ってp.xを正規化する。
			var pd = (p.x - pLeft.x) / (pRight.x - pLeft.x);
			//正規化したp.xを(-1～1)になるように2倍して-1する
			pd = pd * 2 - 1;
			
			//スクリーン座標へ
			var width = 384;
			drawnModel[i].x = (pd + 1) * (width / 2);
			drawnModel[i].y = y1d;
		}
				
		//弾は十字に描く
		for (var i = 0; i < 2; i++) {
			canvas.moveTo(drawnModel[i * 2].x, drawnModel[i * 2].y);
			canvas.lineTo(drawnModel[i * 2 + 1].x, drawnModel[i * 2].y);
		}
		
		canvas.closePath();
		canvas.stroke();
		canvas.restore();
	}
}

Ammo.prototype.move = function() {
	//回転
	this.rotation += this.rotationSpeed;
	while (this.rotation < 0) this.rotation += 360;
	this.rotation %= 360;
	
	//移動
	this.position.add(this.moveSpeed);
	
	//表示切り替え
	this.visible = this.position.x >= 0 - this.radius && this.position.x < 384 + this.radius &&
					this.position.y >= 0 - this.radius && this.position.y < 512 + this.radius;
}

Ammo.prototype.isCrash = function(target, radius) {
	return this.position.distanceToTarget(target) - this.radius / 2 < radius;
}

Ammo.prototype.isDisable = function(tags) {
	for (var i in this.disables) {
		for (var j in tags) {
			if (tags[j] == this.disables[i]) {
				return true;
			}
		}
	}
	return false;
}
