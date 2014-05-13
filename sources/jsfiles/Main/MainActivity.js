//===========================
//  MainActivity
//===========================
var mainActivity;
function MainActivity(in_canvas) {
	mainActivity = this;
	this.gManager = new GameManager(in_canvas);
	setInterval("mainActivity.gManager.gameloop()", 1000 / 60);
	in_canvas.addEventListener("click", this.onClick, false);
}
//クリックアクション
MainActivity.prototype.onClick = function(e) {
	
}
