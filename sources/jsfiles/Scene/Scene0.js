//=======================
//  Scene0クラス
//=======================
function Scene0(gameManager) {
	GameScene.call(this, gameManager);
}
Scene0.prototype = new GameScene(this.gManager);
Scene0.prototype.init = function() {

}
Scene0.prototype.disp = function(canvas) {
	canvas.save();
	canvas.fillStyle = "rgb(0,255,255)";
	canvas.fillRect(0, 0, 384, 512);
	canvas.restore();
}
Scene0.prototype.step = function() {

}
Scene0.prototype.destroy = function() {

}