//=======================
//  Scene0クラス
//=======================
function Scene0(gameManager) {
	GameScene.call(this, gameManager);

	//敵の位置へ、生成タイミングは一定期間置きつつのランダムで、噴射してみたい
	
	this.enemies = [];
	
	this.ammos = [];
	
	//自機
	this.player = new Player(0, 0, 0);
	
	this.guide3d = new Guide3d(50);
	
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
	for (var i in this.enemies) {
		var enemy = this.enemies[i];
		if (enemy != null) {
			characters.push(enemy);
		}
	}
	characters.push(this.player);
	
	//キャラクタのワールド座標をセットする
	for (var i in characters) {
		characters[i].WorldVertexModel();
	}
	
	//カメラ用スクロール情報を作る
	var charaMoveRange = 384;
	var nearPlaneWidth = 300;
	var cameraMoveRange = charaMoveRange - nearPlaneWidth;
	var eyeX = this.player.position.x * cameraMoveRange / charaMoveRange;
	var eyeY = this.player.position.y * cameraMoveRange / charaMoveRange;
	
	//カメラを作る
	var atMat = Matrix4x4_Identity();
	var eyeMat = Matrix4x4_Identity();
	//eyeMat.rotateY(CircleCalculator.toRadian(-90));
	//eyeMat.rotateX(CircleCalculator.toRadian(15));
	//eyeMat.rotateX(CircleCalculator.toRadian(180));
	atMat.translate(eyeX, eyeY, 0);
	eyeMat.translate(eyeX, eyeY, -30);
	at = atMat.transform(new Vector3(0, 0, 0)); //注視点(カメラの向き)
	eye = eyeMat.transform(new Vector3(0, 0, 0)); //視点	(カメラの場所)
	
	//3Dto2D変換してキャラクタのモデルに値を保持する
	for (var i in characters) {
		characters[i].model.Camera(at, eye);
		characters[i].model.Perspective(-nearPlaneWidth/2, nearPlaneWidth/2, nearPlaneWidth/2, -nearPlaneWidth/2, 30, 70);
		characters[i].model.Screen(canvas);
	}
	
	//スクリーンへ描画
	for (var i in characters) {
		characters[i].draw(canvas);
	}
	
	//3dガイドライン
	this.guide3d.draw(canvas, at, eye, -nearPlaneWidth/2, nearPlaneWidth/2, nearPlaneWidth/2, -nearPlaneWidth/2, 30, 70);
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
	
	//敵をランダム生成
	if (Math.floor(Math.random() * 30) == 0) {
		this.enemies.push(new Enemy(Math.floor(Math.random() * 384 - 192), Math.floor(Math.random() * 384 - 192), Math.floor(Math.random() * 150 + 50), 30, 2, new Color(255, 255, 0, 255)));
	}
	
	//敵の状態
	var aliveEnemies = [];
	for (var i in this.enemies) {
		var enemy = this.enemies[i];
		if (enemy.visible) {
			//移動
			enemy.move();
			//ショット
			var shot = enemy.shot();
			if (shot != null) this.ammos.push(shot);
			aliveEnemies.push(enemy);
		}
	}
	this.enemies = aliveEnemies;
	
	//弾の移動
	var aliveAmmos = [];
	for (var i in this.ammos) {
		var ammo = this.ammos[i];
		if (ammo != null) {
			//移動する
			ammo.move();
			//まだ描画対象ならば、
			if (ammo.visible) {
				//あたり判定
				if (this.player.visible && !ammo.isDisable(this.player.hitTags) && ammo.isCrash(this.player.position, 3)) {
					this.player.hit();
					ammo.visible = false;
					//敵が勝ったら、敵に対する自機の弾のあたり判定を無効にする。
					for (var j in this.enemies) {
						var enemy = this.enemies[j];
						enemy.hitTags.push("winner");
					}
				}
				else {
					var hit = false;
					for (var j in this.enemies) {
						var enemy = this.enemies[j];
						if (enemy.visible && !ammo.isDisable(enemy.hitTags) && ammo.isCrash(enemy.position, enemy.radius)) {
							enemy.hit();
							ammo.visible = false;
							//敵に勝ったら、自機に対する敵の弾のあたり判定を無効にする。
							if (!enemy.visible) {
								this.player.hitTags.push("winner");
							}
							hit = true;
							break;
						}
					}
					if (!hit) {
						//当たってないのなら、
						//次の描画対象にする
						aliveAmmos.push(ammo);
					}
				}
			}
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
