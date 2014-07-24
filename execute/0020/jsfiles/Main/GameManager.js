//===========================
//  GameManager
//===========================
var GameSceneName = {
	SCENE0: 0, 
};
function GameManager(in_canvas) {
	this.canvas = in_canvas;
	
	//キー入力記憶クラス
	this.keyInput = new KeyInput();
	
	//仮想画面サイズ
	this.virtualScreenSize = new Size(384, 384);
	
	//キャンバスの大きさ設定と中央揃え
	var context = this.canvas.getContext("2d");
	var scaleX = this.canvas.width / this.virtualScreenSize.width;
	var scaleY = this.canvas.height / this.virtualScreenSize.height;
	var YbiggerX = scaleX < scaleY;
	var centering;
	if (YbiggerX) { 
		centering = (this.canvas.height - this.virtualScreenSize.height * scaleX) / 2;
		context.translate(0, centering);
		context.scale(scaleX, scaleX);
		context.beginPath();
		context.rect(0, 0, this.virtualScreenSize.width, this.virtualScreenSize.height);
		context.clip();
	}
	else {
		centering = (this.canvas.width - this.virtualScreenSize.width * scaleY) / 2;
		context.translate(centering, 0);
		context.scale(scaleY, scaleY);
		context.beginPath();
		context.rect(0, 0, this.virtualScreenSize.width, this.virtualScreenSize.height);
		context.clip();
	}
	
	this.scenes = [new Scene0(this)];
	this.changeScene(GameSceneName.SCENE0);
	
	window.onbeforeunload = this.destroy;
	
	//FPS計測用
	this.fpsCounter = 0;
	this.fpsTimer = new StopWatch();
	this.fpsTimer.start();
}
GameManager.prototype.gameloop = function() {
	if (gActived) {
		this.init();
		this.disp();
		this.step();
	}
	
	//FPS計測
	this.fpsCounter++;
	if (this.fpsTimer.now() >= 1) {
		//dp(this.fpsCounter);
		this.fpsCounter = 0;
		this.fpsTimer.restart();
	}
}
GameManager.prototype.init = function() {
	if (this.initFlag) {
		this.nowScene.init();
		this.initFlag = false;
	}
}
GameManager.prototype.step = function() {
	this.nowScene.step();
}
GameManager.prototype.disp = function() {
	//描画コンテキストの取得
	if (this.canvas != null) {
		if (this.canvas.getContext) {
			
			var context = this.canvas.getContext("2d");
			
			context.save();
			
			//キャンバスクリア
			context.clearRect(0, 0, this.virtualScreenSize.width, this.virtualScreenSize.height);
			
			//DEBUG::キャンバスサイズ描画
			if (true) {
				context.strokeStyle = "rgb(128, 0, 0)";
				context.strokeRect(0, 0, this.virtualScreenSize.width, this.virtualScreenSize.height);
			}
			
			//描画する
			this.nowScene.disp(context);
			
			context.restore();
		}
	}
}

//リソースデータ破棄
GameManager.destroy = function() {
	for (var i = 0; i < this.scenes.length; i++) {
		if (this.scenes[i] != null) {
			this.scenes[i].destroy();
		}
	}
}

GameManager.prototype.changeScene = function(sceneName) {
	this.nowScene = this.scenes[sceneName];
	this.initFlag = true;
}
GameManager.prototype.getGameScene = function(sceneName) {
	return this.scenes[sceneName];
}
GameManager.prototype.getNowScene = function() {
	return this.nowScene;
}
