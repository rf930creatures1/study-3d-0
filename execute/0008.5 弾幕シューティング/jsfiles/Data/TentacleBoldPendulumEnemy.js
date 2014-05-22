//=======================
//  大胆振子触手敵クラス
//=======================
function TentacleBoldPendulumEnemy(x, y, radius, hp, color) {
	Enemy.call(this, x, y, radius, hp, color);
	
	this.shotInterval = 0.05;
	this.shooterAngle = 90;
	
	var mat1 = Matrix2x3_Identity();
	this.tentacle = new Tentacle(mat1);
	var mat = mat1.dup(); 
	mat.translate(0, 50);
	this.tentacle.createChild(mat.dup()).createChild(mat.dup()).createChild(mat.dup()).createChild(mat.dup());
	
	var mat2 = mat.dup();
	var mat3 = mat1.dup();
	mat3.rotate(CircleCalculator.toRadian(-30));
	mat3.multiply(mat2);
	this.tentacle.createChild(mat3.dup());//.createChild(mat.dup());
	
}
TentacleBoldPendulumEnemy.prototype = new Enemy(this.x, this.y, this.radius, this.hp, this.color);

TentacleBoldPendulumEnemy.prototype.draw = function(canvas) {
	//Enemy.prototype.draw.call(this, canvas);
	this.tentacle.calcWorldMatrix(this.tentacle.matrix);
	if (this.visible) {
		canvas.save();
		
		//行列の作成と適用
		var mats = this.tentacle.getAllMatrix();
		for (var ii in mats) {
			//本体だけ白く光る
			if (ii == 0) {
				canvas.fillStyle = this.color.toContextString();
				this.color = this.normalColor;
			}
			else {
				canvas.fillStyle = this.normalColor.toContextString();
			}
			
			var mat = mats[ii].dup();
			var matid = Matrix2x3_Identity();
			//行列は掛け算する順番が大事。で、左×右の計算をしているので先にtranslate掛け算しないといけない。
			//だから、新しく行列を用意して、それにtranslateしたあとで、親子関係の行列を掛けてやる。
			matid.translate(this.position.x, this.position.y);
			matid.multiply(mat);
			var drawnModel = [];
			for (var i = 0; i < this.model.length; i++) {
				drawnModel[i] = matid.transform(this.model[i]);
			}
			
			//敵は三角形を描く
			canvas.beginPath();
			var len = this.model.length;
			for (var i = 0; i < len; i++) {
				if (i == 0) {
					canvas.moveTo(drawnModel[i % len].x, drawnModel[i % len].y);
				}
				canvas.lineTo(drawnModel[(i + 1) % len].x, drawnModel[(i + 1) % len].y);
			}
			canvas.closePath();
			canvas.fill();
		}
		
		//親と子の原点をつなぐ
		canvas.strokeStyle = (new Color(255, 255, 255, 255)).toContextString();
		this.drawGenealogy(canvas, this.tentacle);
		/*
		for (var ii in mats) {
			var mat = mats[ii].dup();
			var matid = Matrix2x3_Identity();
			matid.translate(this.position.x, this.position.y);
			matid.multiply(mat);
			if (Number(ii) + 1 < mats.length) {
				mat = mats[Number(ii) + 1].dup();
				var matid2 = Matrix2x3_Identity();
				matid2.translate(this.position.x, this.position.y);
				matid2.multiply(mat);
				
				canvas.beginPath();
				var po = new Vector2();
				var p1 = matid.transform(po);
				var p2 = matid2.transform(po);
				canvas.moveTo(p1.x, p1.y);
				canvas.lineTo(p2.x, p2.y);
				canvas.closePath();
				canvas.stroke();
			}
		}
		*/
		
		canvas.restore();
	}
}

TentacleBoldPendulumEnemy.prototype.drawGenealogy = function(canvas, tentacle) {
	
	//親と子を結んで、
	//子を使って再帰する
	
	for (var i in tentacle.children) {
		var mat = tentacle.worldMatrix.dup();
		var matid = Matrix2x3_Identity();
		matid.translate(this.position.x, this.position.y);
		matid.multiply(mat);
		
		mat = tentacle.children[i].worldMatrix.dup();
		var matid2 = Matrix2x3_Identity();
		matid2.translate(this.position.x, this.position.y);
		matid2.multiply(mat);
		
		canvas.save();
		canvas.beginPath();
		var po = new Vector2();
		var p1 = matid.transform(po);
		var p2 = matid2.transform(po);
		canvas.moveTo(p1.x, p1.y);
		canvas.lineTo(p2.x, p2.y);
		canvas.closePath();
		canvas.stroke();
		canvas.restore();
		
		this.drawGenealogy(canvas, tentacle.children[i]);
	}
}

TentacleBoldPendulumEnemy.prototype.move = function() {
	//Enemy.prototype.move.call(this);
	this.furiko(this.tentacle.children[0], this.moved);
	//this.shooterAngle = 90 + 45 * this.moved;
	
	//砲台の向き
	var mats = this.tentacle.getAllMatrix();
	//モデルの先端とモデルの原点からベクトルを作って角度を求める
	var sp = mats[mats.length - 1].transform(this.model[0]);
	var tp = mats[mats.length - 1].transform(new Vector2());
	var rad = Math.atan2(sp.y - tp.y, sp.x - tp.x);
	var deg = CircleCalculator.toDegree(rad);
	this.shooterAngle = deg;
	
	this.moved += this.moveSpeed;
	if (this.moved > 1) this.moved = 0;
}

TentacleBoldPendulumEnemy.prototype.shot = function() {
	this.shotTime += FPS;
	//this.shotDegree += this.shotRotateSpeed;
	//this.shotDegree %= 360;
	if (this.shotTime >= this.shotInterval) {
		this.shotTime = 0;
		
		var mats = this.tentacle.getAllMatrix();
		var mat = mats[mats.length - 1].dup();
		var matid = Matrix2x3_Identity();
		matid.translate(this.position.x, this.position.y);
		matid.multiply(mat);
		var p1 = matid.transform(new Vector2());
		//this.shooterAngleにはモデルが下向きであるため90度加算する。
		return new Ammo(p1.x + Math.cos(CircleCalculator.toRadian(this.shooterAngle)) * this.radius, 
						p1.y + Math.sin(CircleCalculator.toRadian(this.shooterAngle)) * this.radius, 
						10, 
						40, 
						//砲台の向きに沿って発射する
						new Vector2(Math.cos(CircleCalculator.toRadian(this.shooterAngle)), Math.sin(CircleCalculator.toRadian(this.shooterAngle))), 
						this.shootTags, 
						new Color(255, 255, 0, 0));
	}
	return null;
}

TentacleBoldPendulumEnemy.prototype.hit = function() {
	Enemy.prototype.hit.call(this);
}

TentacleBoldPendulumEnemy.prototype.furiko = function(p, t) {
	if (p.children.length > 0) {
		for (var i in p.children) {
			this.furiko(p.children[i], t);
		}
	}
	var rot = 45; //曲がる角度
	
	//                                         初期角度 + 目標角度 * 時間
	//step1: 左に行く      if tが0.25未満なら、   0 + rot * ((t-0.00) / 0.25)
	//step2: 右に戻る else if tが0.50未満なら、 rot - rot * ((t-0.25) / 0.25)
	//step3: 右に行く else if tが0.75未満なら、   0 - rot * ((t-0.50) / 0.25)
	//step4: 左に戻る else                     -rot + rot * ((t-0.75) / 0.25)
	//loop
	
	var deg;
	for (var i = 0; i < 4; i++) {
		if (t <= (i+1)/4) {
			deg = (i == 1 ? 1 : i == 3 ? -1 : 0) * rot + ((i == 1 || i == 2) ? -1 : 1) * rot * ((t - (i * 0.25)) / (1/4));
			break;
		}
	}
	
	p.matrix.setIdentity();
	p.matrix.translate(0, 50);
	p.matrix.rotate(CircleCalculator.toRadian(deg));
}
