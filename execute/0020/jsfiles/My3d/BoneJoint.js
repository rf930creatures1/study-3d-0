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
	this.animationDatas = null; //BvhChannelData[]
	this.frameTime = 1 / 30; //フレームタイム ここにあるべきなのかは定かでない。
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

BoneJoint.createJointsFromBvh = function(bvhLoader) {
	var ret = [];
	
	//再帰関数の定義
	var createJoint = function(bvhLoader, bvhJoint) {
		var child = [];
		for (var j in bvhJoint.child) {
			child.push(createJoint(bvhLoader, bvhJoint.child[j]));
		}
		//bvhJoint.offsetから行列を作る
		var m = Matrix4x4_Identity();
		m.translate(bvhJoint.offset.x, bvhJoint.offset.y, bvhJoint.offset.z);
		var bj = new BoneJoint(m, [bvhJoint.name]);
		bj.children = child;
		bj.animationDatas = bvhJoint.channels;
		bj.frameTime = bvhLoader.frameTime;
		return bj;
	}
	
	for (var i in bvhLoader.hierarchy) {
		var root = bvhLoader.hierarchy[i];
		var bone = createJoint(bvhLoader, root);
		ret.push(bone);
	}
	return ret;
}

BoneJoint.prototype.animation = function(t) {
	//tとframeTimeから、どのアニメーションかを見たい。tは秒
	//ただしもし相対なら、最初から見たときと途中から見たときで結果がことなる。
	//bvhの仕様はまだ謎。
	//回転はラジアンで表しているってことにしていいのかな。
	//移動は絶対位置で表しているってことにしていいのかな。
	
	var anime = function(boneJoint, t) {
		for (var j in boneJoint.children) {
			anime(boneJoint.children[j], t);
		}
		
		var f = Math.floor(t / boneJoint.frameTime);
		var m = boneJoint.matrix;
		for (var i in boneJoint.animationDatas) {
			var animdata = boneJoint.animationDatas[i];
			//時間がモーションデータを超えてたら止める
			if (animdata.motion.length - 1 > f) {
				if (i == 0) { //最初だけ単位行列化
					m.setIdentity();
				}
				var value = animdata.motion[f];
				if (animdata.name == "Xposition") {
					m.translate(value, 0, 0);
				}
				else if (animdata.name == "Yposition") {
					m.translate(0, value, 0);
				}
				else if (animdata.name == "Zposition") {
					m.translate(0, 0, value);
				}
				else if (animdata.name == "Xrotation") {
					m.rotateX(value);
				}
				else if (animdata.name == "Yrotation") {
					m.rotateY(value);
				}
				else if (animdata.name == "Zrotation") {
					m.rotateZ(value);
				}
			}
		}
	}
	
	anime(this, t);
}