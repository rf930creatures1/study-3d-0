//=======================
//  触手敵クラス
//=======================
function TentacleEnemy(x, y, radius, hp, color) {
	Enemy.call(this, x, y, radius, hp, color);
	
	var mat = Matrix2x3_Identity();
	mat.translate(0, 10);
	this.tentacle = new Tentacle(mat);
	this.tentacle.createChild(mat.dup()).createChild(mat.dup());
	
	this.tentacle.children[0].matrix.translate(0, 50);
	this.shooterAngle = 45;
	this.tentacle.children[0].matrix.rotate(CircleCalculator.toRadian(this.shooterAngle));
	this.tentacle.children[0].children[0].matrix.translate(0, 100);
}
TentacleEnemy.prototype = new Enemy(this.x, this.y, this.radius, this.hp, this.color);

TentacleEnemy.prototype.draw = function(canvas) {
	//Enemy.prototype.draw.call(this, canvas);
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
		
		canvas.restore();
	}
}

TentacleEnemy.prototype.move = function() {
	Enemy.prototype.move.call(this);
	
	//孫(this.tentacle.children[0].children[0])だけ親(this.tentacle)とは別に∞運動してみたいが、
	//孫は行列しかもっていない状態でどのように位置を保持すればよいのか。
}

TentacleEnemy.prototype.shot = function() {
	this.shotTime += FPS;
	this.shotDegree += this.shotRotateSpeed;
	this.shotDegree %= 360;
	if (this.shotTime >= this.shotInterval) {
		this.shotTime = 0;
		
		var mats = this.tentacle.getAllMatrix();
		var mat = mats[mats.length - 1].dup();
		var matid = Matrix2x3_Identity();
		matid.translate(this.position.x, this.position.y);
		matid.multiply(mat);
		var p1 = matid.transform(new Vector2());
		//this.shooterAngleにはモデルが下向きであるため90度加算する。
		return new Ammo(p1.x + Math.cos(CircleCalculator.toRadian(this.shooterAngle + 90)) * this.radius, 
						p1.y + Math.sin(CircleCalculator.toRadian(this.shooterAngle + 90)) * this.radius, 
						10, 
						40, 
						new Vector2(Math.cos(CircleCalculator.toRadian(this.shotDegree)), Math.sin(CircleCalculator.toRadian(this.shotDegree))), 
						this.shootTags, 
						new Color(255, 255, 0, 0));
	}
	return null;
}

TentacleEnemy.prototype.hit = function() {
	Enemy.prototype.hit.call(this);
}

