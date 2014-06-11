//=======================
//  自機クラス
//=======================
function Player(x, y, radius) {
	//自機の位置 (ワールド座標)
	if (x == null) x = 0;
	if (y == null) y = 0;
	this.position = new Vector2(x, y);
	//半径 (ローカル座標)
	if (radius == null) radius = 10;
	this.radius = radius; 
	
	//描画するかどうか
	this.visible = true;
	
	//モデルデータ (ローカル座標) //半径*サイン及びコサイン
	this.model = [new Vector2(this.radius * Math.cos(CircleCalculator.toRadian(90-180)), this.radius * Math.sin(CircleCalculator.toRadian(90-180))), //上
					new Vector2(this.radius * Math.cos(CircleCalculator.toRadian(-30-180)), this.radius * Math.sin(CircleCalculator.toRadian(-30-180))), //右下
					new Vector2(this.radius * Math.cos(CircleCalculator.toRadian(180+30-180)), this.radius * Math.sin(CircleCalculator.toRadian(180+30-180)))]; //左下
	
	//移動スピード
	this.moveSpeed = 100 * FPS;
	
	//何秒間隔で弾を撃つか
	this.shotInterval = 0.1;
	this.shotTime = 0;
	
	//発射する弾のタグ
	this.shootTags = ["player", "winner"];
	//このタグがある弾になら当たっても平気
	this.hitTags = ["player"];
	
}

Player.prototype.draw = function(canvas) {
	if (this.visible) {
		canvas.save();
		canvas.fillStyle = (new Color(255, 0, 255, 0)).toContextString();
		canvas.beginPath();
		
		//行列の作成と適用
		var mat = Matrix2x3_Identity();
		mat.translate(this.position.x, this.position.y);
		var drawnModel = [];
		for (var i = 0; i < this.model.length; i++) {
			drawnModel[i] = mat.transform(this.model[i]);
		}
		
		//自機は三角形を描く
		var len = this.model.length;
		for (var i = 0; i < len; i++) {
			if (i == 0) {
				canvas.moveTo(drawnModel[i % len].x, drawnModel[i % len].y);
			}
			canvas.lineTo(drawnModel[(i + 1) % len].x, drawnModel[(i + 1) % len].y);
		}
		
		canvas.closePath();
		canvas.fill();
		canvas.restore();
	}
}

Player.prototype.subdraw = function(canvas, y1d) {
	if (this.visible) {
		canvas.save();
		canvas.strokeStyle = (new Color(255, 0, 255, 0)).toContextString();
		canvas.beginPath();
		
		//行列の作成と適用
		var mat = Matrix2x3_Identity();
		mat.translate(this.position.x, this.position.y);
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
		}
		*/
		
		//透視変換
		//画面上が視点、画面下を注視点とし、カメラの上は画面手前
		var fr = 0;
		var fl = 384;
		var near = 0;
		var far = 512;
		var fRight = new Vector2(fr, far - near);
		var fLeft = new Vector2(fl, far - near);
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
		
		//自機は三角形を描く
		var len = this.model.length;
		for (var i = 0; i < len; i++) {
			if (i == 0) {
				canvas.moveTo(drawnModel[i % len].x, drawnModel[i % len].y);
			}
			canvas.lineTo(drawnModel[(i + 1) % len].x, drawnModel[i % len].y);
		}
		
		canvas.closePath();
		canvas.stroke();
		canvas.restore();
	}
}

Player.prototype.move = function(keyInput) {
	if (keyInput.left) {
		if (this.position.x - this.radius > 0) {
			this.position.x -= this.moveSpeed;
		}
	}
	else if (keyInput.right) {
		if (this.position.x + this.radius < 384) {
			this.position.x += this.moveSpeed;
		}
	}
	if (keyInput.up) {
		if (this.position.y - this.radius > 0) {
			this.position.y -= this.moveSpeed;
		}
	}
	else if (keyInput.down) {
		if (this.position.y + this.radius < 512) {
			this.position.y += this.moveSpeed;
		}
	}
}

Player.prototype.shot = function(keyInput) {
	this.shotTime += FPS;
	if (keyInput.space) {
		if (this.shotTime >= this.shotInterval) {
			this.shotTime = 0;
			return new Ammo(this.position.x, 
							this.position.y - this.radius, 
							5, 
							120, 
							new Vector2(0, -1), 
							this.shootTags,
							new Color(255, 0, 0, 255));
		}
	}
	return null;
}

Player.prototype.hit = function() {
	this.visible = false;
	dp("GAME OVER");
}
