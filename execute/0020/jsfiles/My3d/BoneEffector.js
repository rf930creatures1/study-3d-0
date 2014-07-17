//=======================
//  骨影響度クラス
//=======================
function BoneEffector(joint, weight) {
	if (weight == null) weight = 1;
	this.joint = joint;
	this.weight = weight;
}
