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
	 * Class to generate Gaussian random number
	 *
	 * @param {Array} factors
	 * @constructor
	 */
	sylv.Polynomial = function(arr) {
		this.val = arr;
	};
	
	p$ = function(arr) {
		if(arr instanceof Array) {
			return new sylv.Polynomial(arr);
		} else {
			var val = [];
			for (var i=0; i<arguments.length; i++) {
				val[i] = arguments[i];
			}
			return new sylv.Polynomial(val);
		};
	};
	
	sylv.extend(sylv.Polynomial, {
		// Calculate the next step and return the value of the function at the new point.
		eval: function(X) {
			var res = this.val[0];
			if(typeof(val)=="object" && "x" in val) {
				for (var l=1; l<this.val.length; l++) {
					res = X.x(res);
					res = res.add(this.val[l]);
				}
			} else {
				for (var l=1; l<this.val.length; l++) {
					res *= X;
					res += this.val[l];
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
