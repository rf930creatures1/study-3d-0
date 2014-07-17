//=======================
//  骨関節クラス
//=======================
function BoneJoint(matrix, tags) {
	//親(自分自身)が居て、子がいる。
	//親が動くと、子が動く。親の行列を、子の行列に掛ける。
	//子が動いても、親は感知しない
	
	this.matrix = matrix;
	this.children = [];
	this.worldMatrix = null;
	if (tags == null) this.tags = [];
	else this.tags = tags;
}

//子を追加
BoneJoint.prototype.createChild = function(matrix, tags) {
	var child = new BoneJoint(matrix, tags);
	this.children.push(child);
	return child;
}

//子を削除
BoneJoint.prototype.removeChild = function(index) {
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

BoneJoint.prototype.calcWorldMatrix = function(parentWorldMatrix) {
	var m = parentWorldMatrix.dup();
	m.multiply(this.matrix);
	this.worldMatrix = m;
	for (var i in this.children) {
		this.children[i].calcWorldMatrix(m);
	}
}

BoneJoint.prototype.findTag = function(searchTags) {
	for (var i in this.tags) {
		for (var j in searchTags) {
			if (searchTags[j] == this.tags[i]) {
				return true;
			}
		}
	}
	return false;
}
