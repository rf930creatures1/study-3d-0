//=======================
//  敵クラス
//=======================
function Enemy(x, y, radius) {
	//敵の位置 (ワールド座標)
	if (x == null) x = 0;
	if (y == null) y = 0;
	this.basePosition = new Vector2(x, y);
	this.position = new Vector2(x, y); 
	//半径 (ローカル座標)
	if (radius == null) radius = 5;
	this.radius = radius; 
	
	//描画するかどうか
	this.visible = false;
	
	//モデルデータ (ローカル座標) //半径*サイン及びコサイン
	this.model = [new Vector2(this.radius * Math.cos(CircleCalculator.toRadian(90)), this.radius * Math.sin(CircleCalculator.toRadian(90))), //下
					new Vector2(this.radius * Math.cos(CircleCalculator.toRadian(-30)), this.radius * Math.sin(CircleCalculator.toRadian(-30))), //右上
					new Vector2(this.radius * Math.cos(CircleCalculator.toRadian(180+30)), this.radius * Math.sin(CircleCalculator.toRadian(180+30)))]; //左上
	
	//移動スピード
	this.moveSpeed = 0.1 * FPS;
	this.moved = 0;
	
	//何秒間隔で弾を撃つか
	this.shotInterval = 0.01;
	this.shotTime = 0;
	
	//ショットの角度
	this.shotDegree = 0;
	//ショットの角度の回転スピード
	this.shotRotateSpeed = 720 * FPS;
}

Enemy.prototype.draw = function(canvas) {
	if (this.visible) {
		canvas.save();
		canvas.fillStyle = (new Color(255, 255, 0, 255)).toContextString();
		canvas.beginPath();
		
		//行列の作成と適用
		var mat = Matrix2x3_Identity();
		mat.translate(this.position.x, this.position.y);
		var drawnModel = [];
		for (var i = 0; i < this.model.length; i++) {
			drawnModel[i] = mat.transform(this.model[i]);
		}
		
		//敵は三角形を描く
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

Enemy.prototype.move = function() {
	var mat = Matrix2x3_Identity();
	mat.translate(this.basePosition.x, this.basePosition.y);
	mat.scale(50);
	var motion = Motion.InfinityShape(this.moved);
	this.position = mat.transform(motion);
	
	this.moved += this.moveSpeed;
	if (this.moved > 1) this.moved = 0;
}

Enemy.prototype.shot = function() {
	this.shotTime += FPS;
	this.shotDegree += this.shotRotateSpeed;
	this.shotDegree %= 360;
	if (this.shotTime >= this.shotInterval) {
		this.shotTime = 0;
		return new Ammo(this.position.x, this.position.y + this.radius, 10, 40, new Vector2(Math.cos(CircleCalculator.toRadian(this.shotDegree)), Math.sin(CircleCalculator.toRadian(this.shotDegree))));
	}
	return null;
}
