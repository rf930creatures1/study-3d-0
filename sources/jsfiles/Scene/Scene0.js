//=======================
//  Scene0クラス
//=======================
function Scene0(gameManager) {
	GameScene.call(this, gameManager);
	this.points = [];
}
Scene0.prototype = new GameScene(this.gManager);
Scene0.prototype.init = function() {
	this.points[0] = new Point(50, 50);
	this.points[1] = new Point(100, 50);
	this.points[2] = new Point(100, 30);
}
Scene0.prototype.disp = function(canvas) {
	canvas.save();
	canvas.strokeStyle = (new Color(255, 255, 0, 0)).toContextString();
	if (this.points.length >= 2) {
		canvas.beginPath();
		canvas.moveTo(this.points[0].x, this.points[0].y);
		for (var i = 1; i < this.points.length; i++) {
			canvas.lineTo(this.points[i].x, this.points[i].y);
		}
		canvas.closePath();
		canvas.stroke();
	}
	canvas.restore();
}
Scene0.prototype.step = function() {
}
Scene0.prototype.destroy = function() {

}