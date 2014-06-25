//==================
// Start Methods
//==================
var gActived;
function start() {
	gActived = true;
	var canvas = document.getElementById("mainCanvas");
	expandCanvas(canvas);
	new MainActivity(canvas);
}

function expandCanvas(in_canvas){
	in_canvas.width = 384;
	in_canvas.height = 384;
}
