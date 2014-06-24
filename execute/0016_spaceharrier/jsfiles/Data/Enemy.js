//=======================
//  敵クラス
//=======================
function Enemy(x, y, z, radius, hp, color) {
	//敵の位置 (ワールド座標)
	if (x == null) x = 0;
	if (y == null) y = 0;
	if (z == null) z = 0;
	this.basePosition = new Vector3(x, y, z);
	this.position = new Vector3(x, y, z); 
	//半径 (ローカル座標)
	if (radius == null) radius = 5;
	this.radius = radius; 
	
	//描画するかどうか
	this.visible = true;
	
	//モデルデータ (ローカル座標) //半径*サイン及びコサイン
	this.model = new Model(
				[new Polygon(
					new Vector3(this.radius * Math.cos(CircleCalculator.toRadian(-90)), this.radius * Math.sin(CircleCalculator.toRadian(-90)), 0), //下
					new Vector3(this.radius * Math.cos(CircleCalculator.toRadian(180-30)), this.radius * Math.sin(CircleCalculator.toRadian(180-30)), 0), //右上
					new Vector3(this.radius * Math.cos(CircleCalculator.toRadian(30)), this.radius * Math.sin(CircleCalculator.toRadian(30)), 0) //左上
				)]); 
	
	//移動スピード
	this.moveSpeed = 0.1 * FPS;
	this.moved = 0;
	this.zmoved = 0;
	
	//何秒間隔で弾を撃つか
	this.shotInterval = 0.2;
	this.shotTime = 0;
	
	//ショットの角度
	this.shotDegree = 0;
	//ショットの角度の回転スピード
	this.shotRotateSpeed = 720 * FPS;
	
	//発射する弾のタグ
	this.shootTags = ["enemy", "winner"];
	//このタグがある弾になら当たっても平気
	this.hitTags = ["enemy"];
	
	//HP
	this.hp = hp;
	
	//色
	if (color == null) color = new Color(255, 255, 0, 255);
	this.normalColor = color;
	this.damageColor = new Color(255, 255, 255, 255);
	this.color = this.normalColor;
}

//ワールド座標をセットする
Enemy.prototype.WorldVertexModel = function() {
	var wMat = Matrix4x4_Identity();
	wMat.translate(this.position.x, this.position.y, this.position.z);
	this.model.World(wMat);
}

Enemy.prototype.draw = function(canvas) {
	if (this.visible) {
		canvas.save();
		canvas.strokeStyle = this.color.toContextString();
		canvas.fillStyle = this.color.toContextString();
		this.model.draw(canvas);
		this.color = this.normalColor;
		canvas.restore();
	}
}

Enemy.prototype.move = function() {
	var mat = Matrix4x4_Identity();
	mat.translate(this.basePosition.x, this.basePosition.y, this.basePosition.z - this.zmoved * 300);
	mat.scale(50);
	var motion = Motion.InfinityShape(this.moved);
	this.position = mat.transform(motion);
	
	this.moved += this.moveSpeed;
	this.zmoved += this.moveSpeed;
	if (this.moved > 1) this.moved = 0;
	if (this.position.z < -30) this.visible = false;
}

Enemy.prototype.shot = function() {
	this.shotTime += FPS;
	this.shotDegree += this.shotRotateSpeed;
	this.shotDegree %= 360;
	if (this.shotTime >= this.shotInterval) {
		this.shotTime = 0;
		return new Ammo(this.position.x, 
						this.position.y, 
						this.position.z, 
						10, 
						40, 
						//new Vector2(Math.cos(CircleCalculator.toRadian(this.shotDegree)), Math.sin(CircleCalculator.toRadian(this.shotDegree))), 
						new Vector3(Math.cos(CircleCalculator.toRadian(this.shotDegree)), Math.sin(CircleCalculator.toRadian(this.shotDegree)), -1), 
						this.shootTags, 
						new Color(255, 255, 0, 0));
	}
	return null;
}

Enemy.prototype.hit = function() {
	if (this.hp > 0) this.hp--;
	if (this.hp <= 0) {
		this.visible = false;
		dp("YOU WIN");
	}
	else {
		this.color = this.damageColor;
	}
}
