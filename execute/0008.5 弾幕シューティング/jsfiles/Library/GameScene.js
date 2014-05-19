//=======================
//  GameSceneクラス
//=======================
function GameScene(gameManager) {
	this.gManager = gameManager;
}
GameScene.prototype.getManager = function() {
	return this.gManager;
}
GameScene.prototype.init = function() {
}
GameScene.prototype.disp = function(canvas) {
}
GameScene.prototype.step = function() {
}
GameScene.prototype.destroy = function() {
}
GameScene.prototype.getSceneName = function() { 
	return -1;
}
