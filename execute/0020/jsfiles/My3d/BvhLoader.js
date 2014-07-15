function BvhLoader() {
	this.hierarchy = null;
	this.frames = 0; //hierarchy.channels.lengthと等価
	this.frameTime = 0; //1フレームは何秒か
}

function BvhJoint() {
	this.name = "";
	this.offset = null;
	this.channels = [];
	this.child = [];
}

function BvhOffsetData(x, y, z) {
	if (x == null) x = 0;
	if (y == null) y = 0;
	if (z == null) z = 0;
	this.x = x;
	this.y = y;
	this.z = z;
}

function BvhChannelData() {
	this.name = "";
	this.motion = [];
}

BvhLoader.read = function(text) {
	var ret = new BvhLoader();
	var textLen = text.length;
	var textLenM1 = textLen - 1;
	
	var mode = ""; //ヒエラルキー部なのか、モーション部なのか
	var value = ""; //文字溜め
	var command = ""; //何のパラメータか
	
	var joint = null; //関節ノード
	var offset = null; //関節オフセットベクトルノード
	var channel = null; //関節自由度ノード
	var channelsParamNum = 0; //関節自由度のパラメータ数
	var channelsParamInCount = 0; //関節自由度のパラメータ入力カウンタ
	var allChannels = []; //関節自由度の全インスタンスを作った順に保存
	var motionInCount = 0; //MOTIONの値入れカウンタ
	
	var jGeneration = 0; //JOINTの世代カウンタ
	var jGenerations = []; //JOINTの世代一時保存
	
	
	for (var i = 0; i < textLen; i++) {
		var newchar = text.substr(i, 1);
		
		//\rは完全に読み飛ばす。
		if (newchar == "\r") {
			continue;
		}
		//JOINTの世代をカウント
		else if (newchar == "{") {
			jGeneration++;
		}
		else if (newchar == "}") {
			jGeneration--;
		}
		//改行やスペース、ファイル終端は確定
		else if (newchar == "\n" || newchar == " " || newchar == "\t" || i == textLenM1) {
			//改行やスペースではなくファイル終端の場合は最後の文字を溜める
			if (newchar != "\n" && newchar != " " && newchar != "\t" && i == textLenM1) {
				value += newchar;
			}
			
			//読み込み
			
			//コメント
			/* BVHファイルにコメントは有効でないっぽいけど処理は残しておこう。コメントアウトして。
			if (value == "#") {
				//文字が続く限り、改行を見つけるまで読み飛ばす
				while (i < text.length && text.substr(i, 1) != "\n") {
					i++;
				}
			}
			*/
			
			if (mode == "HIERARCHY") {
				if (value == "ROOT" || value == "JOINT" || value == "End") {
					joint = new BvhJoint();
					if (jGenerations[jGeneration - 1] != null) {
						jGenerations[jGeneration - 1].child.push(joint);
					}
					jGenerations[jGeneration] = joint;
					
					command = "joint_param1";
				}
				else if (command == "joint_param1") {
					joint.name = value;
					command = "";
				}
				
				if (value == "OFFSET") {
					offset = new BvhOffsetData();
					command = "offset_param1";
				}
				else if (command == "offset_param1") {
					offset.x = Number(value);
					command = "offset_param2";
				}
				else if (command == "offset_param2") {
					offset.y = Number(value);
					command = "offset_param3";
				}
				else if (command == "offset_param3") {
					offset.z = Number(value);
					joint.offset = offset;
					command = "";
				}
				
				if (value == "CHANNELS") {
					command = "channels_param1";
				}
				else if (command == "channels_param1") {
					channelsParamNum = Number(value);
					command = "channels_param2";
				}
				else if (command == "channels_param2") {
					channel = new BvhChannelData();
					channel.name = value;
					joint.channels.push(channel);
					allChannels.push(channel);
					if (channelsParamInCount >= channelsParamNum - 1) {
						channelsParamInCount = 0;
						command = "";
					}
					else {
						channelsParamInCount++;
					}
				}
			}
			else if (mode == "MOTION") {
				if (value == "Frames:") {
					command = "mframe_param1"
				}
				else if (command == "mframe_param1") {
					ret.frames = Number(value);
					command = "";
				}
				
				else if (value == "Time:") { //『Frame Time:』なんだけどスペースあって処理めんどいからTimeだけで判断。
					command = "mframet_param1"
				}
				else if (command == "mframet_param1") {
					ret.frameTime = Number(value);
					command = "";
				}
				
				else if (value != "" && value != "Frame") { //Timeだけで判断すると、ここでvalueに『Frame Time:』の「Frame」が入っている可能性があるのでそれはスルー
					allChannels[motionInCount % allChannels.length].motion.push(Number(value));
					motionInCount++;
				}
			}
			
			if (value == "HIERARCHY") {
				mode = "HIERARCHY";
			}
			if (value == "MOTION") {
				mode = "MOTION";
			}
			
			//溜めた文字をリセット
			value = "";
		}
		//文字を溜める
		else {
			value += newchar;
		}
	}
	
	//第一世代がROOT。
	ret.hierarchy = jGenerations[0];
	
	return ret;
}
