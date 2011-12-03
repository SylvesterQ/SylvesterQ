// Copyright 2011 Florian Pons (florian.pons.tv). All Rights Reserved.
//
// Licensed under the MIT License

/**
 * @fileoverview Classe representing formal function.
 *
 *
 */

define(["sylv", "tree/tree"],function(sylv) {

	sylv.Funct = function (val) {
		var tmpVal;
		sylv.Node.apply(this);
		if (typeof(val) == "function") {
			this.val = val;
		} else if(val instanceof sylv.Funct) {
			this.val = val.val;
		} else if(tmpVal = sylv.Functs[val]) {
			this.val = tmpVal.val;
			this.name = tmpVal.name;
		} else {
			// the default function is constant
			this.value = typeof(val)=="string"?eval(val):val;
			this.val = function() {return this.value};
		};
	};
	
	sylv.extend(sylv.Funct, sylv.Node);
	sylv.extend(sylv.Funct, {
		calc: function() {
			return this.val.apply(this, this.nodes);
		}
	});
	
	sylv.Functs = {};
	f$ = Math;
	
	sylv.extend(sylv.Funct, {
		/**
		 * Help to create new formal function
		 *
		 * @param {String} name of the new function
		 * @param {Function} factors
		 * @constructor
		 */
		creat: function(name, value, operators) {
			sylv.Functs[name] = new sylv.Funct(value);
			sylv.Functs[name].operators = operators;
			sylv.Functs[name].name = name;
			f$[name] = value;
		},
		
		extend: function(methodes) {
			for(var mth in methodes) {
				if (typeof(methodes[mth]) == "function") {
					sylv.Funct.creat(mth, methodes[mth]);
				} else {
					sylv.Funct.creat(mth, methodes[mth][mth], methodes[mth]);
				};
			}
		}
	}, true);
	
	return sylv.Funct;
});
