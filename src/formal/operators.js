// Copyright 2011 Florian Pons (florian.pons.tv). All Rights Reserved.
//
// Licensed under the MIT License

/**
 * @fileoverview Classe representing formal Polynomia.
 *
 *
 */

define(["formal/funct"],function() {
	/**
	 * Add
	 *
	 * @param {*} first
	 * @param {*} second
	 * @constructor
	 */
	sylv.Funct.creat(
		"Add",
		function(x,y) {
			var X = (x instanceof sylv.Funct)?x.calc():x;
			var Y = (y instanceof sylv.Funct)?y.calc():y
			if (X.add) return X.add(Y);
			return  X+Y;
		}
	);
	
	/**
	 * Multiply
	 *
	 * @param {*} first
	 * @param {*} second
	 * @constructor
	 */
	sylv.Funct.creat(
		"Multi",
		function(x,y) {
			var X = (x instanceof sylv.Funct)?x.calc():x;
			var Y = (y instanceof sylv.Funct)?y.calc():y
			if (X.x) return X.x(Y);
			return  X*Y;
		}
	);
	
	return sylv.Functs;
});
