// Copyright 2011 Florian Pons (florian.pons.tv). All Rights Reserved.
//
// Licensed under the MIT License

/**
 * @fileoverview Classe to found 0 value by dichotomie.
 *
 *
 */

define(["sylv", "estim/GoldenSection"],function(sylv) {
	/**
	 * 
	 *
	 * @param {float} 
	 * @param {float}
	 * @param {function}
	 * @constructor
	 */
	sylv.Dichotomie = function(x0, x1, fct) {
		this.f = fct;
		var f0 = fct(x0)
		// this algo needs fct(x0)*fct(x1)<0
		if (f0*fct(x1)>0) {
			gFct = fct;
			if (f0<0) gFct = function(x) {return fct(x)};
			var gs = new sylv.GoldenSection(x0, x1, gFct);
			var stop = 0;
			while (gs.nextStep()>0) {if(stop++ < 1000) throw "sylv.Dichotomie: can't find values where fct(x0)*fct(x1)<0";};
			x0 = gs.a
			f0 = gs.fa
		};
		if(f0<0) {
			this.x0 = x0;
			this.x1 = x1;
		} else {
			this.x0 = x1;
			this.x1 = x0;
		};
		this.a = (this.x0+this.x1)/2
		this.fa = fct(this.a);
	};
	
	sylv.extend(sylv.Dichotomie, {
		// Calculate the next step and return the value of the function at the new point.
		nextStep: function() {
			if(this.fa<0) {
				this.x0 = this.a;
			} else {
				this.x1 = this.a;
			};
			this.a = (this.x0+this.x1)/2
			this.fa = this.f(this.a);
			return this.fa;
		}
	});
	
	return sylv.GoldenSection;
});