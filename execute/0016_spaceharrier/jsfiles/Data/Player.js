//=======================
//  自機クラス
//=======================
function Player(x, y, z, radius) {
	//自機の位置 (ワールド座標)
	if (x == null) x = 0;
	if (y == null) y = 0;
	if (z == null) z = 0;
	this.position = new Vector3(x, y, z);
	//半径 (ローカル座標)
	if (radius == null) radius = 10;
	this.radius = radius; 
	
	//描画するかどうか
	this.visible = true;
	
	//モデルデータ (ローカル座標) //半径*サイン及びコサイン
	this.model = new Model(
				[new Polygon_ExtraConstractor1(
					this.radius * Math.cos(CircleCalculator.toRadian(90)), this.radius * Math.sin(CircleCalculator.toRadian(90)), 0, //上
					this.radius * Math.cos(CircleCalculator.toRadian(180+30)), this.radius * Math.sin(CircleCalculator.toRadian(180+30)), 0, //左下
					this.radius * Math.cos(CircleCalculator.toRadian(-30)), this.radius * Math.sin(CircleCalculator.toRadian(-30)), 0 //右下
				)]
				);
	
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

//ワールド座標をセットする
Player.prototype.WorldVertexModel = function() {
	var wMat = Matrix4x4_Identity();
	wMat.translate(this.position.x, this.position.y, this.position.z);
	this.model.World(wMat);
}

//描画
Player.prototype.draw = function(canvas) {
	if (this.visible) {
		canvas.save();
		canvas.strokeStyle = "rgb(255, 0, 0)";
		canvas.fillStyle = "rgb(128, 0, 0)";
		this.model.draw(canvas);
		canvas.restore();
	}
}

Player.prototype.move = function(keyInput) {
	if (this.visible) {
		if (keyInput.left) {
			if (this.position.x - this.radius > -384/2) {
				this.position.x -= this.moveSpeed;
			}
		}
		else if (keyInput.right) {
			if (this.position.x + this.radius < 384/2) {
				this.position.x += this.moveSpeed;
			}
		}
		if (keyInput.up) {
			if (this.position.y + this.radius < 384/2) {
				this.position.y += this.moveSpeed;
			}
		}
		else if (keyInput.down) {
			if (this.position.y - this.radius > -384/2) {
				this.position.y -= this.moveSpeed;
			}
		}
	}
}

Player.prototype.shot = function(keyInput) {
	this.shotTime += FPS;
	if (this.visible) {
		if (keyInput.space) {
			if (this.shotTime >= this.shotInterval) {
				this.shotTime = 0;
				return new Ammo(this.position.x, 
								this.position.y, 
								this.position.z, 
								5, 
								120, 
								new Vector3(0, 0, 1), 
								this.shootTags,
								new Color(255, 0, 0, 255));
			}
		}
	}
	return null;
}

Player.prototype.hit = function() {
	this.visible = false;
	dp("GAME OVER");
}
