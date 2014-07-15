var wx;
var hy;
var canvas;
var ss;

var x0,x1,y0,y1;
// x0,y0はcanvas左下の座標、x1,y1は右上の座標
var ox0,ox1,oy0,oy1;
var nx0,nx1,ny0,ny1;
// oがついたものは、それぞれzoomが行われる前の座標
// nがついたものは、それぞれzoomが行われた後の座標


// xxとyyは、スクリーン座標からグラフのx,y座標を得る。
function xx(x) {
    return x0+x*(x1-x0)/wx;
}

function yy(y) {
    return y0+(hy-y)*(y1-y0)/hy;
}

// sxとsyは、グラフの座標からスクリーン座標を得る。
function sy(y) {
    return hy - hy*(y-y0)/(y1-y0);
// Y=hy - hy*(y-y0)/(y1-y0)
// hy -Y = hy*(y-y0)/(y1-y0)
// (hy -Y)*(y1-y0)/hy = y-y0
// y0+(hy-Y)*(y1-y0)/hy =y
}

function sx(x) {
    return wx*(x-x0)/(x1-x0);
// X=wx*(x-x0)/(x1-x0)
// X*(x1-x0)=wx*(x-x0)
// X*(x1-x0)/wx=x-x0
// x0+X*(x1-x0)/wx=x
}

var mode;

function funcchange() {
	var index=funcselector.selectedIndex;
	if( index >= 0 ) {
		mode=funcselector[index].value;
	}
    drawALL();
}

function f(x) {
    if( mode=="sqx") {
	return x*x;
    } else if(mode == "linearx"){
	return x;
    } else if(mode == "cbx" ) {
	return x*x*x;
    } else if(mode=="totsuhb") {
	return 1-x*x;
    }else if(mode=="sinx") {
	return Math.sin(3*x);
    } else if(mode=="cosx2") {
    	return Math.cos(10*x*x);
    } else if(mode=="sin1overx") {
    	return Math.sin(1/x);
    }
}


function df(x) {
    if( mode=="sqx") {
	return 2*x;
    } else if(mode == "linearx"){
	return 1;
    } else if(mode == "cbx" ) {
	return 3*x*x;
    } else if(mode=="totsuhb") {
	return -2*x;
    }else if(mode=="sinx") {
	return 3*Math.cos(3*x);
    }else if(mode=="cosx2") {
    	return -20*x*Math.sin(10*x*x);
    }else if(mode=="sin1overx"){
    	return -Math.cos(1/x)/(x*x);
    }
}

function drawCoordinate(ctx) {
    ctx.beginPath();
    ctx.moveTo(0, sy(0));
    ctx.lineTo(0.8 * wx - 1, sy(0));
    ctx.lineTo(0.8 * wx - 1, sy(0));
    ctx.lineTo(0.8 * wx - 21, sy(0) - 10);
    ctx.moveTo(0.8 * wx - 1, sy(0));
    ctx.lineTo(0.8 * wx - 21, sy(0) + 10);
    ctx.moveTo(sx(0), 0);
    ctx.lineTo(sx(0), hy);
    ctx.moveTo(sx(0)- 10, 20);
    ctx.lineTo(sx(0), 0);
    ctx.lineTo(sx(0)+10, 20);
    ctx.strokeStyle = "black";
    ctx.stroke();
}

function drawGraph(ctx) {
    ctx.beginPath();
    ctx.moveTo(0, sy(f(xx(0))));
    for(var i = 1; i < wx; i++) {
	ctx.lineTo(i, sy(f(xx(i))));
    }
    ctx.strokeStyle = "red";
    ctx.stroke();
    if( katamukiFlg != 0 ) {
	ctx.beginPath();
	ctx.moveTo(0,sy(f(mx1)-df(mx1)*(mx1-xx(0))));
	ctx.lineTo(wx,sy(f(mx1)-df(mx1)*(mx1-xx(wx))));
	ctx.strokeStyle="green";
	ctx.stroke();
    }
}

var katamukiFlg;
function katamukiOn() {
    katamukiFlg=1;
    drawALL();
}

var zoomFlg;
function zoomOn() {
    zoomFlg=1;
}



function drawMarker1(ctx) {
    drawMarker(ctx, mx1);
    drawimage(ctx,"x.png", sx(mx1) - 0.017 * wx, hy - 0.04 * wx, 0.03 * wx, 0.03 * wx);
    drawimage(ctx,"f.png", 0, sy(f(mx1)) - 0.025 * wx, 0.03 * wx, 0.05 * wx);
}

function drawMarker2(ctx) {
    drawMarker(ctx, mx2);
    drawimage(ctx,"xpdx.png", sx(mx2) - 0.05 * wx, hy - 0.05 * wx, 0.2 * wx, 0.05 * wx);
    drawimage(ctx,"fpdf.png", 0, sy(f(mx2)) - 0.025 * wx, 0.2 * wx, 0.05 * wx);
}

function drawimage(ctx,filename,x,y,w,h) {
    var image=new Image();
    image.src=filename;
    image.onload=function(){
	ctx.drawImage(image,x,y,w,h);
    };
}


function drawMarker(ctx, mx) {
    ctx.beginPath();
    var Y0 = hy-0.1*wx;
    var X0 = sx(mx);
    ctx.moveTo(X0, Y0);
    ctx.lineTo(X0 + 0.025 * wx, Y0 + 0.05 * wx);
    ctx.lineTo(X0 - 0.025 * wx, Y0 + 0.05 * wx);
    ctx.closePath();
    ctx.fillStyle = "black";
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(X0, Y0);
    ctx.lineTo(X0, sy(f(mx)));
    ctx.lineTo(sx(0), sy(f(mx)));
    ctx.strokeStyle = "cyan";
    ctx.stroke();
}

var sx1,sx2,sy1,sy2;
function drawDiff(ctx, x1, x2) {
    sx1 = sx(x1);
    sx2 = sx(x2);
    sy1 = sy(f(x1));
    sy2 = sy(f(x2));
    ctx.beginPath();
    ctx.moveTo(sx1, sy1);
    ctx.lineTo(sx2, sy1);
    ctx.lineTo(sx2, sy2);
    ctx.closePath();
    ctx.strokeStyle = "pink";
    ctx.stroke();
    ctx.fillStyle = 'rgba(200, 80, 80, 0.5)';
    ctx.fill();
}


function drawTriangle(ctx) {
    var my1 = f(mx1);
    var my2 = f(mx2);

    var diff;
    if(mx2 == mx1) {
	diff = df(mx1);
    } else {
	diff = (my2 - my1) / (mx2 - mx1);
    }
    ctx.beginPath();
    ctx.moveTo(0.825 * wx, 0.6 * hy);
    ctx.lineTo(0.975 * wx, 0.6 * hy);
    ctx.lineTo(0.975 * wx, 0.6 * hy - diff * wx * 0.15);
    ctx.closePath();
    ctx.strokeStyle = "pink";
    ctx.stroke();
    ctx.fillStyle = 'rgba(200, 80, 80, 0.5)';
    ctx.fill();
    drawimage(ctx,"dfdx.png", 0.925 * wx, 0.6 * hy - diff * wx * 0.08, 0.05 * wx, 0.07 * wx);
    ctx.fillStyle = "black";
    ctx.font = "72px";
    ctx.fillText("1", 0.875 * wx, 0.62 * hy);
    ctx.beginPath();
    ctx.moveTo(0.825*wx,0.6*hy);
    ctx.lineTo(sx1,sy1);
    ctx.moveTo(0.975 * wx, 0.6 * hy);
    ctx.lineTo(sx2,sy1);
    ctx.moveTo(0.975 * wx, 0.6 * hy - diff * wx * 0.15);
    ctx.lineTo(sx2,sy2);
    ctx.strokeStyle="lightgray";
    ctx.stroke();
    	if( katamukiFlg!=0) {
	ctx.beginPath();
	ctx.moveTo(0.825 * wx, 0.6 * hy);
	ctx.lineTo(0.975 * wx, 0.6 * hy-0.15*wx*df(mx1));
	ctx.strokeStyle="green";
	ctx.stroke();
    }
}

var mx1, mx2;
var cap;

function ptdown(e) {
    e.preventDefault();
    var mouseX = e.clientX - e.target.getBoundingClientRect().left;
    var mouseY = e.clientY - e.target.getBoundingClientRect().top;
    ptdownsub(mouseX, mouseY);
}

var zoomCX,zoomCY;
function ptdownsub(mouseX, mouseY) {
    var smx1 = sx(mx1);
    var smx2 = sx(mx2);
    if(mouseY > hy - 0.1 * wx) {
	if(smx1 - 0.025 * wx < mouseX && mouseX < smx1 + 0.025 * wx) {
	    cap = 1;
	    return;
	} else if(smx2 - 0.025 * wx < mouseX && mouseX < smx2 + 0.025 * wx) {
	    cap = 2;
	    return;
	}
    }
    cap = 0;
    if( zoomFlg != 0 && animeTimer <0 ) {
	zoomCX=mouseX;
	zoomCY=mouseY;
	drawALL();
    }
}

function ptmove(e) {
    e.preventDefault();
    var mouseX = e.clientX - e.target.getBoundingClientRect().left;
    var mouseY = e.clientY - e.target.getBoundingClientRect().top;
    ptmovesub(mouseX,mouseY);
}

function ptmovet() {
    var e = event.touches[0];
    event.preventDefault();
    var rect = event.target.getBoundingClientRect();
    ptmovesub(e.clientX - rect.left,e.clientY-rect.top);
}


function ptmovesub(mouseX,mouseY) {
    if(cap == 1 || cap == 2) {
	if(mouseX > 0.8 * wx) {
	    mouseX = 0.8 * wx;
	}
	if(mouseX < 0) {
	    mouseX = 0;
	}
	if(cap == 1) {
	    mx1 = xx(mouseX);
	} else if(cap == 2) {
	    mx2 = xx(mouseX);
	}
	drawALL();
    } else if( cap==0 && zoomFlg != 0) {
	zoomCX=mouseX;
	zoomCY=mouseY;
	drawALL();
    }
}

function ptexit(e) {
    cap=-1;
    drawALL();
}

var animeTimer;
function animationGO() {
    x0=ox0+animeTimer*(nx0-ox0);
    x1=ox1+animeTimer*(nx1-ox1);
    y0=oy0+animeTimer*(ny0-oy0);
    y1=oy1+animeTimer*(ny1-oy1);
    var xe=x0+0.8*(x1-x0);
    if( mx1 < x0 ) {
	mx1=x0;
    }
    if( mx1 > xe) {
	mx1=xe;
    }
    if( mx2 < x0 ) {
	mx2=x0;
    }
    if( mx2 > xe) {
	mx2=xe;
    }
    animeTimer += 0.01;
    drawALL();
    if( animeTimer < 1.0 ) {
	setTimeout('animationGO()',20);	
	var ctx = canvas.getContext("2d");
	ctx.fillStyle='rgba(200, 200, 200, 0.2)';
	ctx.fillRect(sx(nx0),sy(ny0),sx(nx1)-sx(nx0),sy(ny1)-sy(ny0));
    } else {
	animeTimer=-1;
    }
}


function ptup(e) {
    if( cap == 0 && zoomFlg != 0 ) {
	if( animeTimer < 0 ) {
	    // animeTimer >=0 だったら、もうアニメは始まっているので
	    // 以下は実行しない。
	    ox0=x0; ox1=x1; oy0=y0; oy1=y1;
	    nx0=xx(zoomCX-0.25*wx);
    	    nx1=xx(zoomCX+0.25*wx);
	    ny0=yy(zoomCY+0.25*hy);
    	    ny1=yy(zoomCY-0.25*hy);
	    animeTimer=0;
	    animationGO();
	}
    }
    cap=-1;
    drawALL();
}

function undoZoom() {
    x0=ox0;
    x1=ox1;
    y0=oy0;
    y1=oy1;
    drawALL();
}

function ptdownt() {
    event.preventDefault();
    var e = event.touches[0];
    var rect = event.target.getBoundingClientRect();
    ptdownsub(e.clientX - rect.left, e.clientY - rect.top);
}

function ptdownms(event) {
    event.preventManupulation();
    ptdownsub(event.pageX, event.pageY);
}

function ptmovems(event) {
    event.preventManupulation();
    ptmovesub(event.pageX,event.pageY);
}

var funcselector;

function init() {
    canvas = document.getElementById("maincanvas");
    wx=document.body.clientWidth*0.9;
    if( wx>600) {wx=600;}
    hy=wx*0.75;
    canvas.width=wx;
    canvas.height=hy;
    mode="sqx";
    katamukiFlg=0;
    zoomFlg=0;

    funcselector=document.getElementById("func");
    if( funcselector != null ) {
	funcselector.onchange=funcchange;	
    }

//    var touchdev = false;
//    if (navigator.userAgent.indexOf('iPhone') > 0
//	|| navigator.userAgent.indexOf('iPod') > 0
//	|| navigator.userAgent.indexOf('iPad') > 0
//	|| navigator.userAgent.indexOf('Android') > 0) {
//	touchdev = true;
//    }
//    if( touchdev ) {
	if( window.navigator.msPointerEnabled ) {
		canvas.addEventListener("MSPointerDown",ptdownms,false);
		canvas.addEventListener("MSPointerMove",ptmovems,false);
		canvas.addEventListener("MSPointerUp",ptup,false);
	} else {
		canvas.ontouchstart = ptdownt;	
		canvas.ontouchmove = ptmovet;
		canvas.ontouchend = ptup;
	}
//   } else {
	canvas.onmousedown = ptdown;	
	canvas.onmousemove = ptmove;
	canvas.onmouseup = ptup;
	canvas.onmouseout = ptexit;
 //   }
    cap = -1;
    // マウスは何もとらえてない。
    initCoordinate();
    mx1=0.5;
    mx2=1;
    drawALL();
}

var autoTimer;

function autoAnime( ) {
    if( autoTimer>1.0 ) {
	autoTimer=0;
    } else if(autoTimer >0.5 ) {
	mx2=2*(nx1*(autoTimer-0.5)+ox1*(1-autoTimer));
    } else {
	mx2=2*(ox1*autoTimer+nx1*(0.5-autoTimer));
    }
    autoTimer+=0.04;
    drawALL();
    setTimeout('autoAnime()',100);
}

function autoMode() {
	autoTimer=0;
	ox1=mx1;
	nx1=mx2;
	setTimeout('autoAnime()',20);
}

function initCoordinate() {
    animeTimer=-1;
    ox0=x0=-0.2;
    ox1=x1=1.8;
    oy0=y0=-0.2;
    oy1=y1=1.3;
    // グラフでの１が、canvasサイズの0.6倍になるようにする。
    //mx1 = 0.5;
    //mx2 = 1;
    drawALL();
}

function drawZoom(ctx) {
    if( zoomFlg ==0 ) {
	return;
    }
    if( cap==0 && animeTimer <0 ) {
	ctx.fillStyle='rgba(200, 200, 200, 0.3)';
	ctx.fillRect(zoomCX-0.25*wx,zoomCY-0.25*hy,0.5*wx,0.5*hy);
    }
}

function drawALL() {
    var ct = canvas.getContext("2d");
    ct.clearRect(0, 0, wx, hy);
    ct.fillStyle = "white";
    ct.fillRect(0, 0, wx, hy);
    drawCoordinate(ct);
    drawGraph(ct);
    drawMarker1(ct);
    drawMarker2(ct);
    drawDiff(ct, mx1, mx2);
    drawTriangle(ct);
    drawZoom(ct);
}
