//=======================
//  StopWatchクラス
//=======================
function StopWatch() {
	this.pause = true;
	this.startTime = 0;
	this.lapTime = 0;
}
StopWatch.prototype.start = function() {
	if (this.pause) {
		var date = new Date();
		this.startTime = date.getTime();
		this.pause = false;
	}
}
StopWatch.prototype.stop = function() {
	if (!this.pause) {
		var date = new Date();
		var stopTime = date.getTime();
		this.lapTime += stopTime - this.startTime;
		this.pause = true;
	}
}
StopWatch.prototype.reset = function() {
	this.lapTime = 0;
}
StopWatch.prototype.restart = function() {
	this.stop();
	this.reset();
	this.start();
}
StopWatch.prototype.now = function() {
	var date = new Date();
	var time = date.getTime();
	
	var lnow = this.lapTime;
	if (!this.pause) lnow += time - this.startTime;
	var fnow = lnow;
	return fnow / 1000.0; //1000で1秒。1=1ミリ秒。だから、1が1秒になるように割って返す。
}

//計測中
StopWatch.prototype.isRunning = function() {
	return !this.pause;
}

