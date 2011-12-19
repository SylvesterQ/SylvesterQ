// Copyright 2011 Florian Pons (florian.pons.tv). All Rights Reserved.
//
// Licensed under the MIT License

/**
 * @fileoverview Bases functions
 *
 *
 */
 
define(function() {

	sylv = {};

	sylv.loadFile = function(name) {
		var text;
		$.get(name, function(data) {text=data});
		return text;
	};
	
	sylv.load = function(mod) {
		requirejs(mod + "/" + mod);
	}

	sylv.extend = function(obj, methodes, forceStatic) {
		if(forceStatic) {
			for(var mth in methodes) {
				obj[mth] = methodes[mth];
			}
			return obj;
		}
		if (typeof(obj) == "string") obj = sylv.setExportable(obj);
		if (methodes.prototype) {
			obj.prototype = methodes.prototype;
		} else {
			for(var mth in methodes) {
				obj.prototype[mth] = methodes[mth];
			}
		}
		return obj;
	};
	
	sylv.setExportable = function(objName) {
		var obj = eval(objName);
		obj.prototype.constructorName = objName;
		return obj;
	};
	
	return sylv;

});
