//=======================
//  Scene0クラス
//=======================
function Scene0(gameManager) {
	GameScene.call(this, gameManager);
	this.ammos = [];
	//this.ammos[0] = new Ammo(100, 0, 10, 120);
	//this.ammos[1] = new Ammo(200, 0, 10);
	//敵の位置へ、生成タイミングは一定期間置きつつのランダムで、噴射してみたい
	this.enemy = new Enemy(100, 100, 30);
	this.enemy.visible = true;
}
Scene0.prototype = new GameScene(this.gManager);
Scene0.prototype.init = function() {
	
}

Scene0.prototype.disp = function(canvas) {
	for (var i in this.ammos) {
		var ammo = this.ammos[i];
		if (ammo != null) {
			ammo.draw(canvas);
		}
	}
	this.enemy.draw(canvas);
}

Scene0.prototype.step = function() {
	if (Math.floor(Math.random() * 10) == 0) {
		this.ammos.push(new Ammo(this.enemy.position.x, this.enemy.position.y + this.enemy.radius, 10, 80));
	}
	
	var aliveAmmos = [];
	for (var i in this.ammos) {
		var ammo = this.ammos[i];
		if (ammo != null) {
			ammo.move();
			if (ammo.visible) {
				aliveAmmos.push(ammo);
			}
		}
	}
	this.ammos = aliveAmmos;
	this.enemy.move();
}

Scene0.prototype.destroy = function() {

}
