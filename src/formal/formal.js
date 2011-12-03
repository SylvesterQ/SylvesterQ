// Copyright 2011 Florian Pons (florian.pons.tv). All Rights Reserved.
//
// Licensed under the MIT License

/**
 * @fileoverview Class for representing matrices and static helper functions.
 *
 *
 */

define(["formal/polynomial", "formal/operators", "formal/standard", "formal/polynomial"],function() {
	sylv.Formal = function(txt) {
		txt = txt.split("=");
		var fctName = null;
		var params = {};
		var parameters = null;
		if (txt.length==2) {
			txt[0] = txt[0].split(/[()]/);
			var fctName = txt[0][0];
			var params = {};
			var parameters = txt[0][1]
			var tmpParams = parameters.split(",")
			for (var p in tmpParams) params[tmpParams[p]] = new sylv.Funct(null);
		}
		
		var val = sylv.Formal.parse(txt[fctName?1:0], params);
		
		if (fctName) {
			// build the function
			var fctCorp = fctName+" = function(";
				fctCorp += parameters
				fctCorp += ") {\n";
				fctCorp += "for (var parameter in params) params[parameter].value = eval(parameter);\n";
				fctCorp += "return val.calc();\n";
				fctCorp += "}\n";
			eval(fctCorp);
			var ftc = eval(fctName);
			
			ftc.node = val;
			if (!sylv.Functs[fctName]) {
				sylv.Funct.creat(fctName, ftc);
			};
			return ftc
		} else {
			return val.calc();
		}
	};
	
	sylv.extend(sylv.Formal, {
		parse: function(txt, params) {
			var val = null;
			var tmpNode;
			
			while (txt) {
				var pos = txt.search(/[(,)*+]/);
				var tmpTxt;
				if(pos == -1) {
					// if this is the end of the string
					tmpTxt = txt;
				} else {
					// get the value
					tmpTxt=txt.substr(0, pos);
				}
				if(tmpTxt) {
					if(tmpTxt in params) tmpNode = params[tmpTxt];
					else tmpNode = new sylv.Funct(tmpTxt);
					if(val) {
						val.push(tmpNode);
					} else {
						val = tmpNode;
					};
				};
				switch (txt.charAt(pos)) {
					case "(":
						val = tmpNode;
						break;
					case ")":
						val = val.parent;
						break;
					case "+":
						tmpNode = new sylv.Funct("Add");
						while (!val.isRoot() && val.name == "Multi") val = val.parent
						val.permute(tmpNode);
						val = tmpNode;
						break;
					case "*":
						tmpNode = new sylv.Funct("Multi");
						while (val.name == "Add") val = val.nodes[1]
						val.permute(tmpNode);
						val = tmpNode;
						break;
				};
				pos++;
				txt = pos?txt.substr(pos):""; //stop the loop if it's not progressing
			};
			// we get the root
			return val.getRoot();
		}
	}, true);
	
	return sylv.Formal;
})