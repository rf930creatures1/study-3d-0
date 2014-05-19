//===========================
//  MainActivity
//===========================
var mainActivity;
var FPS = 1 / 60;
function MainActivity(in_canvas) {
	mainActivity = this;
	this.gManager = new GameManager(in_canvas);
	setInterval("mainActivity.gManager.gameloop()", 1000 * FPS);
	in_canvas.addEventListener("click", this.onClick, false);
}
//クリックアクション
MainActivity.prototype.onClick = function(e) {
	
}
