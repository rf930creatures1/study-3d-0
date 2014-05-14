//=======================
//  Scene0クラス
//=======================
var DOING  = {
	LINE: 0, 
	VEC2LINE: 1,
	CROSS: 2,
	TRIANGLE: 3
};

function Scene0(gameManager) {
	GameScene.call(this, gameManager);
}
Scene0.prototype = new GameScene(this.gManager);
Scene0.prototype.init = function() {
	this.doing = DOING.CROSS;
	this.triangle = new TrianglePoints(50, 250, 0, 200, 250, 0, 200, 50, 0);
	this.vec2line = [new Vector2(100, 100), new Vector2(100, 200)];
	this.clossline1 = [new Vector2(384/2, 0), new Vector2(384/2, 512)];
	this.clossline2 = [new Vector2(0, 512/2), new Vector2(384, 512/2)];
}
Scene0.prototype.disp = function(canvas) {
	canvas.save();
	canvas.strokeStyle = (new Color(255, 255, 0, 0)).toContextString();
	canvas.beginPath();
	
	if (this.doing == DOING.LINE) {
		canvas.moveTo(100, 100);
		canvas.lineTo(200, 100);
	}
	else if (this.doing == DOING.VEC2LINE) {
		canvas.moveTo(this.vec2line[0].x, this.vec2line[0].y);
		canvas.lineTo(this.vec2line[1].x, this.vec2line[1].y);
	}
	else if (this.doing == DOING.CROSS) {
		canvas.moveTo(this.clossline1[0].x, this.clossline1[0].y);
		canvas.lineTo(this.clossline1[1].x, this.clossline1[1].y);
		canvas.moveTo(this.clossline2[0].x, this.clossline2[0].y);
		canvas.lineTo(this.clossline2[1].x, this.clossline2[1].y);
	}
	else if (this.doing == DOING.TRIANGLE) {
		canvas.moveTo(this.triangle.p1.x, this.triangle.p1.y);
		canvas.lineTo(this.triangle.p2.x, this.triangle.p2.y);
		canvas.lineTo(this.triangle.p3.x, this.triangle.p3.y);
	}
	
	canvas.closePath();
	canvas.stroke();
	canvas.restore();
}
Scene0.prototype.step = function() {
}
Scene0.prototype.destroy = function() {

}