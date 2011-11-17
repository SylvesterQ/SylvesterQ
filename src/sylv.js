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
		if(sylv.loadFile.path==undefined) {
			var scripts = document.getElementsByTagName('script');
			for (var i = 0, ln = scripts.length; i < ln; i++) {
				var scriptSrc = scripts[i].src;
				var match = scriptSrc.match(/sylv\.js$/);
				if (match) {
					sylv.loadFile.path = scriptSrc.substring(0, scriptSrc.length - match[0].length);
					break;
				};
			};
		};
		document.write('<script type="text/javascript" src="' + sylv.loadFile.path + name + '"></script>');
	};

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
