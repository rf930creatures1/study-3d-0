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
	this.quaternion = null;
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
		var nt = (t - f * boneJoint.frameTime) / boneJoint.frameTime; // (現在の時間-フレーム開始時間)/フレームの長さ で％を求める
		var m = boneJoint.matrix;
		var td = new TransData();
		var ntd = new TransData();
		var tds = [td, ntd];
		boneJoint.transdata = td;
		
		for (var i in boneJoint.animationDatas) {
			var animdata = boneJoint.animationDatas[i];
			for (var j = 0; j < tds.length; j++) { //j==1は、補間用に取得
				//時間がモーションデータを超えてたら止める
				if (f + j < animdata.motion.length) {
					tds[j].changed = true;
					var value = animdata.motion[f + j];
					if (animdata.name == "Xposition") {
						tds[j].posX = value;
					}
					else if (animdata.name == "Yposition") {
						tds[j].posY = value;
					}
					else if (animdata.name == "Zposition") {
						tds[j].posZ = -value;
					}
					else if (animdata.name == "Xrotation") {
						tds[j].rotX = CircleCalculator.toRadian(value);
					}
					else if (animdata.name == "Yrotation") {
						tds[j].rotY = CircleCalculator.toRadian(value);
					}
					else if (animdata.name == "Zrotation") {
						tds[j].rotZ = CircleCalculator.toRadian(value);
					}
				}
			}
		}
		
		//補間する
		//tdが始まり、ntdが目標、ntが時間、tdに入れる。
		if (ntd.changed) {
			var q = Quaternion.slerp(Quaternion.Euler(td.rotX, td.rotY, td.rotZ), Quaternion.Euler(ntd.rotX, ntd.rotY, ntd.rotZ), nt);
			//td.rotX = q.x;
			//td.rotY = q.y;
			//td.rotZ = q.z;
			td.quaternion = q;
		}
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
				if (td.quaternion == null) {
					m.rotateZ(td.rotZ);
					m.rotateX(td.rotX);
					m.rotateY(td.rotY);
				}
				else {
					m.multiply(td.quaternion.rotationMatrix());
				}
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
	colcnt=0;
}

var colcnt = 0; //Genealogyの色を分けるための変数なので、色分けする必要が無いなら取り除く。
BoneJoint.prototype.drawGenealogy = function(canvas, boneJoint, basePosition, at, eye, up, seisyaei, left, right, top, bottom, near, far) {
	
	//親と子を結んで、
	//子を使って再帰する
	
	for (var i in boneJoint.children) {
		colcnt++;
		var mat = boneJoint.worldMatrix.dup();
		var matid = Matrix4x4_Identity();
		matid.translate(basePosition.x, basePosition.y, basePosition.z);
		matid.multiply(mat);
		
		mat = boneJoint.children[i].worldMatrix.dup();
		var matid2 = Matrix4x4_Identity();
		matid2.translate(basePosition.x, basePosition.y, basePosition.z);
		matid2.multiply(mat);
		
		var po = new Vector3();
		var p1 = matid.transform(po);
		var p2 = matid2.transform(po);
		var lineModel = new LineModel([new Line3d(p1, p2)]);
		
		lineModel.World(Matrix4x4_Identity());
		lineModel.Camera(at, eye, up);
		if (seisyaei)
			lineModel.OrthogonalProjection(left, right, top, bottom, near, far);
		else
			lineModel.Perspective(left, right, top, bottom, near, far);
		lineModel.Screen(canvas);
		
		var cols = [new Color(255, 255, 255, 255), new Color(255, 0, 255, 255)];
		lineModel.draw(canvas, [cols[colcnt % 2]]);
		
		this.drawGenealogy(canvas, boneJoint.children[i], basePosition, at, eye, up, seisyaei, left, right, top, bottom, near, far);
	}
}
