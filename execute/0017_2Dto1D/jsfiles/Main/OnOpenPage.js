//==================
// Start Methods
//==================
var gActived;
function start() {
	gActived = true;
	var canvas = document.getElementById("mainCanvas");
	var subcanvas = document.getElementById("subCanvas");
	expandCanvas(canvas, subcanvas);
	new MainActivity(canvas, subcanvas);
}

function expandCanvas(in_canvas, in_subcanvas){
	in_canvas.width = 384;
	in_canvas.height = 512;
	in_subcanvas.width = 384;
	in_subcanvas.height = 5;
}
