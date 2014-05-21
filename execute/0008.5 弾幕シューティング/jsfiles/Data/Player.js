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
