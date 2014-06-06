//=======================
//  弾クラス
//=======================
function Ammo(x, y, z, radius, moveSpeed, moveVector, disableTags, color) {
	//弾の位置 (ワールド座標)
	if (x == null) x = 0;
	if (y == null) y = 0;
	if (z == null) z = 0;
	this.position = new Vector3(x, y, z); 
	//半径 (ローカル座標)
	if (radius == null) radius = 5;
	this.radius = radius; 
	//回転度合
	this.rotation = 0; 
	//モデルデータ (ローカル座標)
	this.model = new Model([
					new Polygon(new Vector3(-this.radius, 0, 0), new Vector3(0, 0, 0), new Vector3(0, 0, 1)), 
					new Polygon(new Vector3(this.radius, 0, 0), new Vector3(0, 0, 0), new Vector3(0, 0, 1)), 
					new Polygon(new Vector3(0, -this.radius, 0), new Vector3(0, 0, 0), new Vector3(0, 0, 1)), 
					new Polygon(new Vector3(0, this.radius, 0), new Vector3(0, 0, 0), new Vector3(0, 0, 1))
					]);
	//描画するかどうか
	this.visible = false;
	//回転速度 移動が早ければ回転は遅い
	if (moveSpeed == null) moveSpeed = 50;
	this.rotationSpeed = 15 / (moveSpeed * FPS);
	//移動スピード
	if (moveVector.x == null) moveVector.x = 0;
	if (moveVector.y == null) moveVector.y = 0;
	if (moveVector.z == null) moveVector.z = 1;
	this.moveSpeed = new Vector3(moveVector.x * moveSpeed * FPS, moveVector.y * moveSpeed * FPS, moveVector.z * moveSpeed * FPS);
	
	//弾が当たっても効かないヤツらリスト
	if (disableTags == null) disableTags = [];
	this.disables = disableTags;
	
	//弾の色
	if (color == null) color = new Color(255, 255, 0, 0);
	this.color = color;
}

//ワールド座標をセットする
Ammo.prototype.WorldVertexModel = function() {
	var wMat = Matrix4x4_Identity();
	wMat.translate(this.position.x, this.position.y, this.position.z);
	this.model.World(wMat);
}

Ammo.prototype.draw = function(canvas) {
	if (this.visible) {
		canvas.save();
		canvas.strokeStyle = "rgb(0, 0, 255)";
		canvas.fillStyle = "rgb(0, 0, 128)";
		this.model.draw(canvas);
		canvas.restore();
	}
}

Ammo.prototype.move = function() {
	//回転
	this.rotation += this.rotationSpeed;
	while (this.rotation < 0) this.rotation += 360;
	this.rotation %= 360;
	
	//移動
	this.position.offset(this.moveSpeed);
	
	//表示切り替え
	this.visible = true;
	//this.visible = this.position.x >= 0 - this.radius && this.position.x < 384 + this.radius &&
	//				this.position.y >= 0 - this.radius && this.position.y < 512 + this.radius;
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
