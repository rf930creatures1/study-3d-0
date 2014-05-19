//=======================
//  敵クラス
//=======================
function Enemy(x, y, radius) {
	//敵の位置 (ワールド座標)
	if (x == null) x = 0;
	if (y == null) y = 0;
	this.position = new Vector2(x, y); 
	//半径 (ローカル座標)
	if (radius == null) radius = 5;
	this.radius = radius; 
	
	//描画するかどうか
	this.visible = false;
	
	//モデルデータ (ローカル座標) //半径*サイン及びコサイン
	this.model = [new Vector2(this.radius * Math.cos(CircleCalculator.toRadian(90)), this.radius * Math.sin(CircleCalculator.toRadian(90))), //下
					new Vector2(this.radius * Math.cos(CircleCalculator.toRadian(-45)), this.radius * Math.sin(CircleCalculator.toRadian(-45))), //右上
					new Vector2(this.radius * Math.cos(CircleCalculator.toRadian(180+45)), this.radius * Math.sin(CircleCalculator.toRadian(180+45)))]; //左上
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
	this.position = new Vector2(this.position.x + 1, this.position.y); 
}
