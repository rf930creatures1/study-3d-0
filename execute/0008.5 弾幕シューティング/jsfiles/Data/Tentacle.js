//=======================
//  触手クラス
//=======================
function Tentacle(matrix) {
	//親(自分自身)が居て、子がいる。
	//親が動くと、子が動く。親の行列を、子の行列に掛ける。
	//子が動いても、親は感知しない
	
	this.matrix = matrix;
	this.children = [];
	//this.parent = null;
	this.worldMatrix = null;
}

//子を追加
Tentacle.prototype.createChild = function(matrix) {
	var child = new Tentacle(matrix);
	//child.parent = this;
	this.children.push(child);
	return child;
}

//子を削除
Tentacle.prototype.removeChild = function(index) {
	this.children[index].parent = null;
	this.children[index] = null;
	var newChildren = [];
	for (var i in this.children) {
		if (this.children[i] != null) {
			newChildren.push(this.children[i]);
		}
	}
	this.children = newChildren;
}

//自分自身、子、孫、曾孫などすべての、自分自身からの相対的な行列を取得する
Tentacle.prototype.getAllMatrix = function() {
	var ret = [this.matrix];
	for (var i in this.children) {
		var childAllMat = this.children[i].getAllMatrix();
		for (var j in childAllMat) {
			var dupmat = this.matrix.dup();
			
			/* 時間tがあれば、親につられながらも独立した∞型運動ができる
			var dupmat = Matrix2x3_Identity();
			var motion = Motion.InfinityShape(t);
			dupmat.translate(motion.x * 50, motion.y * 50);
			*/
			
			dupmat.multiply(childAllMat[j]);
			ret.push(dupmat);
		}
	}
	return ret;
}

Tentacle.prototype.calcWorldMatrix = function(worldMatrix) {
	var m = this.matrix.dup();
	m.multiply(worldMatrix);
	this.worldMatrix = m;
	for (var i in this.children) {
		this.children[i].calcWorldMatrix(m);
	}
}
/*
Tentacle.prototype.getMatrix = function() {
	if (this.parent != null) {
		var mat = this.parent.getMatrix();
		mat.multiply(this.matrix);
		return mat.dup();
	}
	return this.matrix.dup();
}
*/
