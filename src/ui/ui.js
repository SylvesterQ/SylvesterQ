// Copyright 2011 Florian Pons (florian.pons.tv). All Rights Reserved.
//
// Licensed under the MIT License

/**
 * @fileoverview Define sylv.ui: some ui tools
 *
 *
 */

define(["sylv"],function(sylv) { 
	
	sylv.ui = function() {};

	sylv.ui.print = function() {
		alert("Affichage not defined");
	};
	
	// short function to print
	$p = function(val) {if(val) sylv.ui.print(val, true)};

	sylv.ui.extractAll = function() {
		var res = "";
		for (name in glb) {
			res += "glb('"+name+"',"+globalSync.getString(name)+");\n";
		};
		return res;
	};

	/**
	 * Creates a matrix from a string
	 * @param {string} str The string representing a matrix.
	 * @return {!sylv.Matrix} The new matrix.
	 */
	sylv.ui.MatrixfromString = function(str) {
		var reg = new RegExp("[ ]*[[]+[ ]*","g");
		res = str.replace(reg, "");
		var reg = new RegExp("[ \\n]*[\\]]+[ \n]*","g");
		var res = res.split(reg);
		var last = res.pop();
		if (last != "") res[res.length] = last;
		reg = new RegExp("[ ]+","g");
		for (var i = 0; i < res.length; i++) {
			res[i] = res[i].split(reg);
			res[i] = res[i].map(parseFloat);
		};
		return jStat(res);
	};
	
	return sylv.ui;
});