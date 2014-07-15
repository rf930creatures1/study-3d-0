function g(x) { 
	return x + 1;
}

function f(u) {
	return u * 2;
}

function gof1(x) {
	return g(f(x));
}

//関数を合成して関数を返す関数 (合成関数を返す関数)
function o(f1, f2) {
	return /*new Hoge(*/ function(x) { return f1(f2(x)); } /*)*/;
}

function main() {
	var param;
	var answer;
	
	param = 5;
	
	//関数同士を自前で合成する
	answer = g(f(param));
	//関数同士を合成したものを使う
	answer = gof1(param);
	
	//oを通してgとfを合成し、それを実行する
	var gof = o(g, f);
	answer = gof(param);
}

//y = f(x) の導関数
function Derivative(f1) {
	return function(x, dx) {
		( f1(x + dx) - f1(x) ) / dx;
	};
}



