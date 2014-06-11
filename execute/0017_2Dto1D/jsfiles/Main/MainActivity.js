//===========================
//  MainActivity
//===========================
var mainActivity;
var FPS = 1 / 60;
function MainActivity(in_canvas, in_subcanvas) {
	mainActivity = this;
	this.gManager = new GameManager(in_canvas, in_subcanvas);
	setInterval("mainActivity.gManager.gameloop()", 1000 * FPS);
	in_canvas.addEventListener("click", this.onClick, false);
	document.addEventListener("keydown", this.onKeyDown);
	document.addEventListener("keyup", this.onKeyUp);
}

//クリックアクション
MainActivity.prototype.onClick = function(e) {
	
}

//キー押下アクション
MainActivity.prototype.onKeyDown = function(e) {
	if (e.keyCode == 40) mainActivity.gManager.keyInput.down = true;
	else if (e.keyCode == 37) mainActivity.gManager.keyInput.left = true;
	else if (e.keyCode == 38) mainActivity.gManager.keyInput.up = true;
	else if (e.keyCode == 39) mainActivity.gManager.keyInput.right = true;
	else if (e.keyCode == 32) mainActivity.gManager.keyInput.space = true;
}

//キー押下アクション
MainActivity.prototype.onKeyUp = function(e) {
	if (e.keyCode == 40) mainActivity.gManager.keyInput.down = false;
	else if (e.keyCode == 37) mainActivity.gManager.keyInput.left = false;
	else if (e.keyCode == 38) mainActivity.gManager.keyInput.up = false;
	else if (e.keyCode == 39) mainActivity.gManager.keyInput.right = false;
	else if (e.keyCode == 32) mainActivity.gManager.keyInput.space = false;
}

