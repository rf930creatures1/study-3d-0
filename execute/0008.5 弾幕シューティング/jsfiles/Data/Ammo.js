//=======================
//  弾クラス
//=======================
function Ammo(x, y, radius, moveSpeed) {
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
	this.moveSpeed = new Vector2(0, moveSpeed * FPS);
}

Ammo.prototype.draw = function(canvas) {
	if (this.visible) {
		canvas.save();
		canvas.strokeStyle = (new Color(255, 255, 0, 0)).toContextString();
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

Ammo.prototype.move = function() {
	//回転
	this.rotation += this.rotationSpeed;
	while (this.rotation < 0) this.rotation += 360;
	this.rotation %= 360;
	
	//移動
	this.position = new Vector2(this.position.x + this.moveSpeed.x, this.position.y + this.moveSpeed.y);
	
	//表示切り替え
	this.visible = this.position.x >= 0 - this.radius && this.position.x < 384 + this.radius &&
					this.position.y >= 0 - this.radius && this.position.y < 512 + this.radius;
}

