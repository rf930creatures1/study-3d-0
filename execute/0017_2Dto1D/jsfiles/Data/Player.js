//=======================
//  自機クラス
//=======================
function Player(x, y, radius) {
	//自機の位置 (ワールド座標)
	if (x == null) x = 0;
	if (y == null) y = 0;
	this.position = new Vector2(x, y);
	//半径 (ローカル座標)
	if (radius == null) radius = 10;
	this.radius = radius; 
	
	//描画するかどうか
	this.visible = true;
	
	//モデルデータ (ローカル座標) //半径*サイン及びコサイン
	this.model = [new Vector2(this.radius * Math.cos(CircleCalculator.toRadian(90-180)), this.radius * Math.sin(CircleCalculator.toRadian(90-180))), //上
					new Vector2(this.radius * Math.cos(CircleCalculator.toRadian(-30-180)), this.radius * Math.sin(CircleCalculator.toRadian(-30-180))), //右下
					new Vector2(this.radius * Math.cos(CircleCalculator.toRadian(180+30-180)), this.radius * Math.sin(CircleCalculator.toRadian(180+30-180)))]; //左下
	
	//移動スピード
	this.moveSpeed = 100 * FPS;
	
	//何秒間隔で弾を撃つか
	this.shotInterval = 0.1;
	this.shotTime = 0;
	
	//発射する弾のタグ
	this.shootTags = ["player", "winner"];
	//このタグがある弾になら当たっても平気
	this.hitTags = ["player"];
	
	//射影変換後の表示位置
	this.subdrawPosition = null;
}

Player.prototype.draw = function(canvas) {
	if (this.visible) {
		canvas.save();
		canvas.fillStyle = (new Color(255, 0, 255, 0)).toContextString();
		
		//カメラのnear板ガイド
		canvas.stroleStyle = (new Color(255, 255, 0, 0)).toContextString();
		canvas.beginPath();
		var near = 200;
		canvas.moveTo(0, near);
		canvas.lineTo(384, near);
		canvas.closePath();
		canvas.stroke();
		
		canvas.beginPath();
		
		//行列の作成と適用
		var mat = Matrix2x3_Identity();
		mat.translate(this.position.x, this.position.y);
		var drawnModel = [];
		for (var i = 0; i < this.model.length; i++) {
			drawnModel[i] = mat.transform(this.model[i]);
		}
		
		//自機は三角形を描く
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

Player.prototype.subDrawModel = function(canvas, y1d) {
	if (this.visible) {
		/*
		canvas.save();
		canvas.strokeStyle = (new Color(255, 0, 255, 0)).toContextString();
		canvas.beginPath();
		*/
		
		//行列の作成と適用
		var mat = Matrix2x3_Identity();
		mat.translate(this.position.x, this.position.y);
		var drawnModel = [];
		for (var i = 0; i < this.model.length; i++) {
			drawnModel[i] = mat.transform(this.model[i]);
		}
		
		//正射影行列
		/*
		var right = 384;
		var left = 0;
		for (var i = 0; i < this.model.length; i++) {
			var x = drawnModel[i].x;
			var xd = 2 * x / (right - left) - 1;
			//スクリーン座標へ
			var width = 384;
			drawnModel[i].x = xd * width;
			drawnModel[i].y = y1d;
		}*/
		/*
		var pMat = Matrix2x3_OrthogonalProjectionMatrix(0, 384);
		var wDrawnModel = drawnModel;
		var drawnModel = [];
		for (var i = 0; i < wDrawnModel.length; i++) {
			drawnModel[i] = pMat.transform(wDrawnModel[i]);
			drawnModel[i].x = (drawnModel[i].x + 1) * (384 / 2);
			drawnModel[i].y = y1d;
		}
		*/
		
		//透視変換
		//画面上が視点、画面下を注視点とし、カメラの上は画面手前
		//準備する変数　：p.x(x), p.y(y), far(y), near(y), fl(x), fr(x)
		//計算で出す変数：pl(x), pr(x), 
		var nr = -384/2; //nr,nl,fr,flは、カメラから見てどのくらいの範囲を視界にするか。
		var nl = 384/2;  //
		var near = 200;
		var far = 512;
		for (var i = 0; i < this.model.length; i++) {
			var p = drawnModel[i];
			//カメラ座標調整
			p.x -= 384/2;
			
			//視点からnearと視点からfarの比率から、far板端を求める
			var fr = nr * far / near;
			var fl = nl * far / near;
			
			//PL:FL = (P.y-N):(F-N)
			//PR:FR = (P.y-N):(F-N)
			//上記からPLとPRを求めてから、
			//P' = (P.x-PL)/(PR-PL) //0～1
			//P'' = P' * 2 - 1 //-1～1
			//上記で正規化する
			
			//Far板とP板とNear板から、相似の台形を求める
			//-0のところを、前は-nearにしていたが、では、-nearが必要なときとはどのような状況なのか。
			var cmpFP = (p.y - 0) / (far - 0);
			var pl = fl * cmpFP;
			var pr = fr * cmpFP;
			
			
			//ここから1次元。
			//pLeftとpRightを使ってp.xを正規化する。
			var pd = (p.x - pl) / (pr - pl);
			//正規化したp.xを(-1～1)になるように2倍して-1する
			pd = pd * 2 - 1;
			
			//スクリーン座標へ
			var width = 384;
			drawnModel[i].x = (pd + 1) * (width / 2);
			//drawnModel[i].y = y1d;
		}
		
		//自機は三角形を描く
		/*
		var len = this.model.length;
		for (var i = 0; i < len; i++) {
			if (i == 0) {
				canvas.moveTo(drawnModel[i % len].x, y1d);
			}
			canvas.lineTo(drawnModel[(i + 1) % len].x, y1d);
		}
		
		canvas.closePath();
		canvas.stroke();
		canvas.restore();
		*/
		this.subdrawPosition = drawnModel;
	}
}

Player.prototype.subdraw = function(canvas, y1d) {
	canvas.save();
	canvas.strokeStyle = (new Color(255, 0, 255, 0)).toContextString();
	canvas.beginPath();
	
	var len = this.subdrawPosition.length;
	for (var i = 0; i < len; i++) {
		if (i == 0) {
			canvas.moveTo(this.subdrawPosition[i % len].x, y1d);
		}
		canvas.lineTo(this.subdrawPosition[(i + 1) % len].x, y1d);
	}
	
	canvas.closePath();
	canvas.stroke();
	canvas.restore();
}

Player.prototype.move = function(keyInput) {
	if (keyInput.left) {
		if (this.position.x - this.radius > 0) {
			this.position.x -= this.moveSpeed;
		}
	}
	else if (keyInput.right) {
		if (this.position.x + this.radius < 384) {
			this.position.x += this.moveSpeed;
		}
	}
	if (keyInput.up) {
		if (this.position.y - this.radius > 0) {
			this.position.y -= this.moveSpeed;
		}
	}
	else if (keyInput.down) {
		if (this.position.y + this.radius < 512) {
			this.position.y += this.moveSpeed;
		}
	}
}

Player.prototype.shot = function(keyInput) {
	this.shotTime += FPS;
	if (keyInput.space) {
		if (this.shotTime >= this.shotInterval) {
			this.shotTime = 0;
			return new Ammo(this.position.x, 
							this.position.y - this.radius, 
							5, 
							120, 
							new Vector2(0, -1), 
							this.shootTags,
							new Color(255, 0, 0, 255));
		}
	}
	return null;
}

Player.prototype.hit = function() {
	this.visible = false;
	dp("GAME OVER");
}
