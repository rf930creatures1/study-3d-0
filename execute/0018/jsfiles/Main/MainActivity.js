//===========================
//  MainActivity
//===========================
var mainActivity;
var FPS = 1 / 60;
function MainActivity(in_canvas) {
	mainActivity = this;
	this.gManager = new GameManager(in_canvas);
	setInterval("mainActivity.gManager.gameloop()", 1000 * FPS);
	in_canvas.addEventListener("mousedown", this.onMouseDown);
	in_canvas.addEventListener("mousemove", this.onMouseMove);
	in_canvas.addEventListener("mouseup", this.onMouseUp);
	document.addEventListener("keydown", this.onKeyDown);
	document.addEventListener("keyup", this.onKeyUp);
}

//キー押下アクション
MainActivity.prototype.onKeyDown = function(e) {
	if (e.keyCode == 40) mainActivity.gManager.keyInput.down = true;
	else if (e.keyCode == 37) mainActivity.gManager.keyInput.left = true;
	else if (e.keyCode == 38) mainActivity.gManager.keyInput.up = true;
	else if (e.keyCode == 39) mainActivity.gManager.keyInput.right = true;
	else if (e.keyCode == 32) mainActivity.gManager.keyInput.space = true;
}

//キー押上アクション
MainActivity.prototype.onKeyUp = function(e) {
	if (e.keyCode == 40) mainActivity.gManager.keyInput.down = false;
	else if (e.keyCode == 37) mainActivity.gManager.keyInput.left = false;
	else if (e.keyCode == 38) mainActivity.gManager.keyInput.up = false;
	else if (e.keyCode == 39) mainActivity.gManager.keyInput.right = false;
	else if (e.keyCode == 32) mainActivity.gManager.keyInput.space = false;
}

//マウスボタン左押下アクション
MainActivity.prototype.onMouseDown = function(e) {
	if (e.button == 0) { //左クリックのとき、
		mainActivity.gManager.keyInput.mouseX = e.clientX;
		mainActivity.gManager.keyInput.mouseY = e.clientY;
		mainActivity.gManager.keyInput.mouseButton = true;
	}
}

//マウス移動アクション
MainActivity.prototype.onMouseMove = function(e) {
	mainActivity.gManager.keyInput.mouseX = e.clientX;
	mainActivity.gManager.keyInput.mouseY = e.clientY;
}

//マウスボタン左押上アクション
MainActivity.prototype.onMouseUp = function(e) {
	if (e.button == 0) { //左クリックのとき、
		mainActivity.gManager.keyInput.mouseX = e.clientX;
		mainActivity.gManager.keyInput.mouseY = e.clientY;
		mainActivity.gManager.keyInput.mouseButton = false;
	}
}
