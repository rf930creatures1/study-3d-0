//=======================
//  大胆振子触手敵クラス
//=======================
function TentacleBoldPendulumEnemy(x, y, radius, hp, color) {
	Enemy.call(this, x, y, radius, hp, color);
	
	this.shotInterval = 0.00005;
	this.shooterAngle = 90;
	this.shooterAngle2 = 90;
	this.usingShooter = 0;
	this.moveSpeed = 0.005;
	
	var mat1 = Matrix2x3_Identity();
	this.furikotags = ["furiko"];
	this.tentacle = new Tentacle(mat1, this.furikotags);
	var mat = mat1.dup(); 
	mat.translate(0, 50);
	var cc1 = this.tentacle.createChild(mat.dup(), this.furikotags).createChild(mat.dup(), this.furikotags);
	cc1.createChild(mat.dup(), this.furikotags).createChild(mat.dup(), this.furikotags);
	
	var mat2 = mat.dup();
	var mat3 = mat1.dup();
	mat3.rotate(CircleCalculator.toRadian(-30));
	mat3.multiply(mat2);
	cc1.createChild(mat3.dup()).createChild(mat.dup());
	
}
TentacleBoldPendulumEnemy.prototype = new Enemy(this.x, this.y, this.radius, this.hp, this.color);

TentacleBoldPendulumEnemy.prototype.draw = function(canvas) {
	//Enemy.prototype.draw.call(this, canvas);
	this.tentacle.calcWorldMatrix(this.tentacle.matrix);
	if (this.visible) {
		canvas.save();
		
		//行列の作成と適用
		canvas.fillStyle = this.color.toContextString();
		this.color = this.normalColor;
		this.drawModel(canvas, this.tentacle);
		
		//親と子の原点をつなぐ
		canvas.strokeStyle = (new Color(255, 255, 255, 255)).toContextString();
		this.drawGenealogy(canvas, this.tentacle);
		
		canvas.restore();
	}
}

TentacleBoldPendulumEnemy.prototype.drawModel = function(canvas, tentacle) {
	var mat = tentacle.worldMatrix.dup();
	var matid = Matrix2x3_Identity();
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
	
	for (var i in tentacle.children) {
		canvas.fillStyle = this.normalColor.toContextString();
		this.drawModel(canvas, tentacle.children[i]);
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
	//親の横移動
	this.tentacleHeadMove(this.moved);
	
	//振り子運動
	this.furiko(this.tentacle.children[0], this.moved);
	
	//∞型運動
	this.infinityMove(this.tentacle.children[0].children[0].children[1], this.moved)
	
	//砲台の向き
	this.shooterAngle = this.calcShooterAngle(this.tentacle.children[0].children[0].children[0].children[0].worldMatrix);
	//砲台2の向き
	this.shooterAngle2 =this.calcShooterAngle(this.tentacle.children[0].children[0].children[1].children[0].worldMatrix);
	
	this.moved += this.moveSpeed;
	if (this.moved > 1) this.moved = 0;
}

TentacleBoldPendulumEnemy.prototype.shot = function() {
	this.shotTime += FPS;
	if (this.shotTime >= this.shotInterval) {
		this.shotTime = 0;
		
		var shooterAngle;
		var mat;
		var shootSize;
		var shootSpeed;
		var color;
		if (this.usingShooter == 0) {
			mat = this.tentacle.children[0].children[0].children[0].children[0].worldMatrix.dup();
			shooterAngle = this.shooterAngle;
			shootSize = 10;
			shootSpeed = 40;
			color = new Color(255, 255, 0, 0);
			this.usingShooter = 1;
		}
		else {
			mat = this.tentacle.children[0].children[0].children[1].children[0].worldMatrix.dup();
			shooterAngle = this.shooterAngle2;
			this.usingShooter = 0;
			shootSize = 15;
			shootSpeed = 90;
			color = new Color(255, 128, 128, 0);
		}
		var matid = Matrix2x3_Identity();
		matid.translate(this.position.x, this.position.y);
		matid.multiply(mat);
		var p1 = matid.transform(new Vector2());
		//this.shooterAngleにはモデルが下向きであるため90度加算する。
		return new Ammo(p1.x + Math.cos(CircleCalculator.toRadian(shooterAngle)) * this.radius, 
						p1.y + Math.sin(CircleCalculator.toRadian(shooterAngle)) * this.radius, 
						shootSize, 
						shootSpeed, 
						//砲台の向きに沿って発射する
						new Vector2(Math.cos(CircleCalculator.toRadian(shooterAngle)), Math.sin(CircleCalculator.toRadian(shooterAngle))), 
						this.shootTags, 
						color);
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
	
	if (p.findTag(this.furikotags)) {
		p.matrix.setIdentity();
		p.matrix.translate(0, 50);
		p.matrix.rotate(Math.sin(t * Math.PI * 2));
		//p.matrix.rotate(Math.sin(Math.tan(t * Math.PI * 2) * Math.PI * 2));
	}
}

//触手の頭を横移動
TentacleBoldPendulumEnemy.prototype.tentacleHeadMove = function(t) {
	var mat = Matrix2x3_Identity();
	mat.translate(this.basePosition.x, this.basePosition.y);
	mat.scale(-100);
	var motion = Motion.HorizontalRoundTrip(t);
	this.position = mat.transform(motion);
}

TentacleBoldPendulumEnemy.prototype.infinityMove = function(p, t) {
	//新しく行列を作って、∞型に動いた情報をtranslateして、それに子の行列情報を掛ける。
	var mat = Matrix2x3_Identity();
	var motion = Motion.InfinityShape(1 - t);
	var scale = 50;
	mat.rotate(Math.sin(this.moved * Math.PI * 2));
	mat.translate(motion.x * scale, motion.y * scale);
	mat.scale(1, -1);
	p.matrix = mat;
}

TentacleBoldPendulumEnemy.prototype.calcShooterAngle = function(origin_WorldMatrix) {
	var mat = origin_WorldMatrix.dup();
	//モデルの先端とモデルの原点からベクトルを作って角度を求める
	var sp = mat.transform(this.model[0]);
	var tp = mat.transform(new Vector2());
	var rad = Math.atan2(sp.y - tp.y, sp.x - tp.x);
	var deg = CircleCalculator.toDegree(rad);
	return deg;
}
