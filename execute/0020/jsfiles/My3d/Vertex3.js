//=======================
//  頂点クラス
//=======================
function Vertex3(x, y, z) {
	Vector3.call(this, x, y, z);
	this.jEffects = [];
}
Vertex3.prototype = new Vector3();

//ボーンの情報(行列)から移動済みのVector3を返す
Vertex3.prototype.transform = function() {
	var mat = Matrix4x4_Identity();
	//影響値の全合計値を1としたいので、まずは合計値を計算
	var weighttotal = 0;
	for (var i in this.jEffects) {
		weighttotal += this.jEffects[i].weight;
	}
	var _1_weighttotal = 1 / weighttotal;
	//jointsの数だけ行列掛け算する。その際、影響値を考慮。
	for (var i in this.jEffects) {
		mat.multiply(this.jEffects[i].joint.worldMatrix.scalerMultiply(this.jEffects[i].weight * _1_weighttotal));
	}
	//行列によって移動したVector3を返す
	return mat.transform(this);
}

Vertex3.prototype.addJoint = function(joint, weight) {
	this.jEffects.push(new BoneEffector(joint, weight));
}

//モデルは作ろう。
//骨はbvhから読む。…点情報はあるけどそれを行列化する場合どうしよう。
//とあるジョイントに使っている行列情報を、頂点にも掛け与える。
//だからジョイントの場所とか関係ない？ある感じがしてきた。
//OFFSETは単純に例えばyに10移動した行列を作るだけ。ローカル行列。
//影響度はどのように行列に干渉する？
