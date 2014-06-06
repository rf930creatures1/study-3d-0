//=======================
//  Scene0クラス
//=======================
function Scene0(gameManager) {
	GameScene.call(this, gameManager);
	/*
	//敵の位置へ、生成タイミングは一定期間置きつつのランダムで、噴射してみたい
	this.enemy = new TentacleBoldPendulumEnemy(384/2, 100, 30, 150, new Color(255, 255, 0, 255));
	this.enemy.visible = true;
	*/
	this.ammos = [];
	
	//自機
	this.player = new Player(0, 0, 0);
	
	this.time = 0;
}
Scene0.prototype = new GameScene(this.gManager);
Scene0.prototype.init = function() {
	
}

Scene0.prototype.disp = function(canvas) {
/*
	this.enemy.draw(canvas);
	for (var i in this.ammos) {
		var ammo = this.ammos[i];
		if (ammo != null) {
			ammo.draw(canvas);
		}
	}
	this.player.draw(canvas);
*/
	//表示するキャラクタをまとめる
	var characters = [];
	for (var i in this.ammos) {
		var ammo = this.ammos[i];
		if (ammo != null) {
			characters.push(ammo);
		}
	}
	characters.push(this.player);
	
	//キャラクタのワールド座標をセットする
	for (var i in characters) {
		characters[i].WorldVertexModel();
	}
	
	//カメラを作る
	var at = new Vector3(0, 0, 0);					//注視点(カメラの向き)
	var eye = new Vector3(0, 0, -50);		//視点	(カメラの場所)
	//var eyeMat = Matrix4x4_Identity();
	//eyeMat.rotateY(CircleCalculator.toRadian(70));
	//eyeMat.rotateX(CircleCalculator.toRadian(15));
	//eye = eyeMat.transform(eye);
	
	//3Dto2D変換してキャラクタのモデルに値を保持する
	for (var i in characters) {
		characters[i].model.Camera(at, eye);
		characters[i].model.Perspective(-384/2, 384/2, 384/2, -384/2, 50, 100);
		characters[i].model.Screen(canvas);
	}
	
	//スクリーンへ描画
	for (var i in characters) {
		characters[i].draw(canvas);
	}
	
}

Scene0.prototype.step = function() {
	//自機の状態
	if (this.player.visible) {
		//移動
		this.player.move(this.gManager.keyInput);
		//ショット
		var myshot = this.player.shot(this.gManager.keyInput);
		if (myshot != null) this.ammos.push(myshot);
	}
	
/*
	//敵の状態
	if (this.enemy.visible) {
		//移動
		this.enemy.move();
		//ショット
		var shot = this.enemy.shot();
		if (shot != null) this.ammos.push(shot);
	}
	
*/
	//弾の移動
	var aliveAmmos = [];
	for (var i in this.ammos) {
		var ammo = this.ammos[i];
		if (ammo != null) {
			//移動する
			ammo.move();/*
			//まだ描画対象ならば、
			if (ammo.visible) {
				//あたり判定
				if (this.player.visible && !ammo.isDisable(this.player.hitTags) && ammo.isCrash(this.player.position, 3)) {
					this.player.hit();
					ammo.visible = false;
					//敵が勝ったら、敵に対する自機の弾のあたり判定を無効にする。
					this.enemy.hitTags.push("winner");
				}
				else if (this.enemy.visible && !ammo.isDisable(this.enemy.hitTags) && ammo.isCrash(this.enemy.position, this.enemy.radius)) {
					this.enemy.hit();
					ammo.visible = false;
					//敵に勝ったら、自機に対する敵の弾のあたり判定を無効にする。
					if (!this.enemy.visible) {
						this.player.hitTags.push("winner");
					}
				}
				else {
					//当たってないのなら、
					//次の描画対象にする
					aliveAmmos.push(ammo);
				}
			}*/
					aliveAmmos.push(ammo);
		}
	}
	this.ammos = aliveAmmos;
	
	this.time++;
}

Scene0.prototype.destroy = function() {

}

Scene0.prototype.getTime = function() {
	return this.time * FPS;
}
