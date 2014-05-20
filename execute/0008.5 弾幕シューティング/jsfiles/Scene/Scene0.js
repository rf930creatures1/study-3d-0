//=======================
//  Scene0クラス
//=======================
function Scene0(gameManager) {
	GameScene.call(this, gameManager);
	this.ammos = [];
	//敵の位置へ、生成タイミングは一定期間置きつつのランダムで、噴射してみたい
	this.enemy = new Enemy(384/2, 100, 30);
	this.enemy.visible = true;
	
	//自機
	this.player = new Player(384/2, 450);
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
	this.player.draw(canvas);
	this.enemy.draw(canvas);
}

Scene0.prototype.step = function() {
	//敵のショット
	var shot = this.enemy.shot();
	if (shot != null) this.ammos.push(shot);
	
	//自機の移動
	if (this.player.visible) {
		this.player.move(this.gManager.keyInput);
		this.player.shot();
	}
	
	//敵の移動
	this.enemy.move();
	
	//敵弾の移動
	var aliveAmmos = [];
	for (var i in this.ammos) {
		var ammo = this.ammos[i];
		if (ammo != null) {
			//移動する
			ammo.move();
			//まだ描画対象ならば、
			if (ammo.visible) {
				//あたり判定
				if (this.player.visible && ammo.isCrash(this.player.position)) {
					this.player.visible = false;
					dp("GAME OVER");
				}
				//次の描画対象にする
				aliveAmmos.push(ammo);
			}
		}
	}
	this.ammos = aliveAmmos;
	
}

Scene0.prototype.destroy = function() {

}
