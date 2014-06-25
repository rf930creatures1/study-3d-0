function Obj3dFile() {
	this.materialFileNames = [];
	this.groups = [];
}

function Obj3dFile_Group() {
	this.groupName = ""; //グループ名
	this.useMaterialName = ""; //マテリアル名
	this.vertexes = []; //頂点座標
	this.uvs = []; //テクスチャ座標
	this.normalVectors = []; //法線ベクトル
	this.surfaces = []; //面
}

function Obj3dFile_SurfaceVertex() {
	this.vertex = null;
	this.uv = null;
	this.normalVector = null;
}

function Obj3dFile_Surface() {
	this.surfaceVertexes = [];
}

Obj3dFile.read = function(text) {
	var ret = new Obj3dFile();
	var value = ""; //文字溜め
	var command = ""; //何のパラメータか
	
	var groupCount = 0; //グループ数カウント
	var group = new Obj3dFile_Group(); //グループ保持
	
	//面がアクセスする用データ
	var vertexes = [];
	var uvs = [];
	var normalVectors = [];
	
	//各座標・ベクトルデータ保持
	var vertex = null;
	var uv = null;
	var normalVector = null;
	var surface = null;
	
	for (var i = 0; i < text.length; i++) {
		//一文字だけ見る
		var newchar = text.substr(i, 1);
		
		//\rは完全に読み飛ばす。
		if (newchar == "\r") {
			continue;
		}
		//改行やスペース、ファイル終端は確定
		else if (newchar == "\n" || newchar == " " || i == text.length - 1) {
			
			//改行やスペースではなくファイル終端の場合は最後の文字を溜める
			if (newchar != "\n" && newchar != " " && i == text.length - 1) {
				value += newchar;
			}
			
			//読み込み
			
			//コメント
			if (value == "#") {
				//文字が続く限り、改行を見つけるまで読み飛ばす
				while (i < text.length && text.substr(i, 1) != "\n") {
					i++;
				}
			}
			
			//マテリアルファイル名
			if (value == "mtllib") {
				command = "mtllib_param1"; //次のコマンドをセット
			}
			else if (command == "mtllib_param1") {
				//マテリアルファイル名を保持
				ret.materialFileNames.push(value);
				command = ""; //次のコマンドをセット
			}
			
			//グループ名
			if (value == "g") {
				command = "g_param1"; //次のコマンドをセット
			}
			else if (command == "g_param1") {
				//グループが既に作られていた場合は、前のグループをretに追加し、新たなグループを作成する。
				if (groupCount > 0) {
					ret.groups.push(group);
					group = new Obj3dFile_Group();
				}
				//グループ名を保持
				group.groupName = value;
				groupCount++;
				command = ""; //次のコマンドをセット
			}
			
			//マテリアル名
			if (value == "usemtl") {
				command = "usemtl_param1"; //次のコマンドをセット
			}
			else if (command == "usemtl_param1") {
				group.useMaterialName = value;
				command = ""; //次のコマンドをセット
			}
			
			//頂点データ
			if (value == "v") {
				vertex = new Vector3(); //データ作成
				command = "v_param1"; //次のコマンドをセット
			}
			else if (command == "v_param1") {
				vertex.x = Number(value); //データ読み取り
				command = "v_param2"; //次のコマンドをセット
			}
			else if (command == "v_param2") {
				vertex.y = Number(value); //データ読み取り
				command = "v_param3"; //次のコマンドをセット
			}
			else if (command == "v_param3") {
				vertex.z = Number(value); //データ読み取り
				group.vertexes.push(vertex); //データをグループにセット
				vertexes.push(vertex); //面用データにセット
				command = ""; //次のコマンドをセット
			}
			
			//テクスチャ座標データ
			if (value == "vt") {
				uv = new Vector2(); //データ作成
				command = "vt_param1"; //次のコマンドをセット
			}
			else if (command == "vt_param1") {
				uv.x = Number(value); //データ読み取り
				command = "vt_param2"; //次のコマンドをセット
			}
			else if (command == "vt_param2") {
				uv.y = Number(value); //データ読み取り
				group.uvs.push(uv); //データをグループにセット
				uvs.push(uv); //面用データにセット
				command = ""; //次のコマンドをセット
			}
			
			//法線ベクトルデータ
			if (value == "vn") {
				normalVector = new Vector3(); //データ作成
				command = "vn_param1"; //次のコマンドをセット
			}
			else if (command == "vn_param1") {
				normalVector.x = Number(value); //データ読み取り
				command = "vn_param2"; //次のコマンドをセット
			}
			else if (command == "vn_param2") {
				normalVector.y = Number(value); //データ読み取り
				command = "vn_param3"; //次のコマンドをセット
			}
			else if (command == "vn_param3") {
				normalVector.z = Number(value); //データ読み取り
				group.normalVectors.push(normalVector); //データをグループにセット
				normalVectors.push(normalVector); //面用データにセット
				command = ""; //次のコマンドをセット
			}
			
			//面データ
			if (value == "f") {
				surface = new Obj3dFile_Surface(); //データ作成 //(スペース塊)
				command = "f_param1"; //次のコマンドをセット
			}
			else if (command == "f_param1") {
				//データはスラッシュ区切りで「頂点座標値番号/テクスチャ座標値番号/頂点法線ベクトル番号」
				var datas = value.split("/");
				
				//1つだけなら頂点座標値番号、2つあるなら頂点座標値番号とテクスチャ座標値番号、3つあれば全部。
				//ファイルに書いてある番号を元に、点の生の参照データを入れる。
				//番号は0からではなく1から始まることに注意
				var svtx = new Obj3dFile_SurfaceVertex(); //(スラッシュ塊)
				if (datas.length > 0) {
					var num = Number(datas[0]);
					if (!isNaN(num) && num > 0) {
						svtx.vertex = vertexes[num - 1];
					}
				}
				if (datas.length > 1) {
					var num = Number(datas[1]);
					if (!isNaN(num) && num > 0) {
						svtx.uv = uvs[num - 1];
					}
				}
				if (datas.length > 2) {
					var num = Number(datas[2]);
					if (!isNaN(num) && num > 0) {
						svtx.normalVector = normalVectors[num - 1];
					}
				}
				surface.surfaceVertexes.push(svtx);
				
				//スペースならデータが続き(多角形の頂点の数だけあり、三角形なら3個)、改行や終端なら終わり
				if (newchar == "\n" || i == text.length - 1) {
					group.surfaces.push(surface);  //(改行塊)
					command = "";
				}
			}
			
			//溜めた文字をリセット
			value = "";
		}
		else {
			//文字を溜める
			value += newchar;
		}
	}
	
	//最後のグループを追加する
	ret.groups.push(group);
	
	return ret;
}
