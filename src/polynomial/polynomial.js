// Copyright 2011 Florian Pons (florian.pons.tv). All Rights Reserved.
//
// Licensed under the MIT License

/**
 * @fileoverview Classe representing Archimedean Copula.
 *
 *
 */

define(["sylv"],function(sylv) {
	/**
	 * Class to generate Gaussian random number
	 *
	 * @param {Array} factors
	 * @constructor
	 */
	sylv.Polynomial = function(arr) {
		if(arr instanceof Array) {
			res = arr;
		} else {
			res = [];
			for (var i=0; i<arguments.length; i++) {
				res[i] = arguments[i];
			}
		};
		res.__proto__.__proto__ = sylv.Polynomial.prototype;
		return res;
	};
	
	sylv.extend("sylv.Polynomial", {
		// Calculate the next step and return the value of the function at the new point.
		eval: function(val) {
			res = this[0];
			var x = 1;
			if(typeof(val)=="object" && "x" in val) {
				res = val.identity().x(res);
				for (var i=1; i<this.length; i++) {
					x = val.x(x);
					res = x.x(this[i]).add(res);
				}
			} else {
				for (var i=1; i<this.length; i++) {
					x *= val;
					res += x*this[i];
				}
			}
			return res;
		},
		
		add: function(P) {
			var s = Math.min(this.length,P.length);//small power
			for (var i=0; i<s; i++) {
				this[i] = this[i]+P[i];
			};
			if (this.length<P.length) {
				this[i] = P[i];
			};
			return this;
		}
	});
	
	return sylv.Polynomial;
});
