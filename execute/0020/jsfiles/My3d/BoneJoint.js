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
	this.transdata = null; //animationメソッド内部で生成
	if (tags == null) this.tags = [];
	else this.tags = tags;
}

function TransData() {
	this.changed = false;
	this.posX = 0;
	this.posY = 0;
	this.posZ = 0;
	this.rotX = 0;
	this.rotY = 0;
	this.rotZ = 0;
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
	
	function loadMotion(boneJoint, t) {
		for (var j in boneJoint.children) {
			loadMotion(boneJoint.children[j], t);
		}
		
		var f = Math.floor(t / boneJoint.frameTime);
		var m = boneJoint.matrix;
		var td = new TransData();
		boneJoint.transdata = td;
		for (var i in boneJoint.animationDatas) {
			var animdata = boneJoint.animationDatas[i];
			//時間がモーションデータを超えてたら止める
			if (f < animdata.motion.length) {
				td.changed = true;
				var value = animdata.motion[f];
				if (animdata.name == "Xposition") {
					td.posX = value;
				}
				else if (animdata.name == "Yposition") {
					td.posY = value;
				}
				else if (animdata.name == "Zposition") {
					td.posZ = -value;
				}
				else if (animdata.name == "Xrotation") {
					td.rotX = CircleCalculator.toRadian(value);
				}
				else if (animdata.name == "Yrotation") {
					td.rotY = CircleCalculator.toRadian(value);
				}
				else if (animdata.name == "Zrotation") {
					td.rotZ = CircleCalculator.toRadian(value);
				}
			}
		}
		/*
		if (td.changed) {
			m.setIdentity();
			//回転する
			m.rotateZ(td.rotZ);
			m.rotateX(td.rotX);
			m.rotateY(td.rotY);
			//移動してから↑
			m.translate(td.posX, td.posY, td.posZ);
		}
		*/
	}
	
	function identity(boneJoint) {
		var m = boneJoint.matrix;
		var td = boneJoint.transdata;
		if (td.changed) {
			m.setIdentity();
		}
		
		for (var j in boneJoint.children) {
			identity(boneJoint.children[j]);
		}
	}
	
	function rotate(bjParent, boneJoint) {
		//親の姿勢情報を使って回転する
		if (bjParent != null) {
			var m = boneJoint.matrix;
			var td = bjParent.transdata;
			if (td.changed) {
				m.rotateZ(td.rotZ);
				m.rotateX(td.rotX);
				m.rotateY(td.rotY);
			}
		}
		
		for (var j in boneJoint.children) {
			rotate(boneJoint, boneJoint.children[j]);
		}
	}
	
	function translate(boneJoint) {
		//自分自身の位置に移動する
		var m = boneJoint.matrix;
		var td = boneJoint.transdata;
		if (td.changed) {
			m.translate(td.posX, td.posY, td.posZ);
		}
		
		for (var j in boneJoint.children) {
			translate(boneJoint.children[j]);
		}
	}
	
	loadMotion(this, t);
	identity(this);
	rotate(null, this);
	translate(this);
}