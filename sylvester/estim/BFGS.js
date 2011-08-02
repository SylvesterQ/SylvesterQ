// Copyright 2011 Florian Pons (florian.pons.tv). All Rights Reserved.
//
// Licensed under the Cecill License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//      http://www.cecill.info/licences/Licence_CeCILL_V2-en.txt
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS-IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

/**
 * @fileoverview Classe d'implementation de la méthode Broyden-Fletcher-Goldfarb-Shanno.
 *
 *
 */

/**
 * Class to generate Gaussian random number
 *
 * @param {integer} nombre d'individus
 * @param {array[integer]} date des resiliation ordonné par ordre decroissant
 * @param {array[integer]} date des morts ordonné par ordre decroissant
 * @constructor
 */
function BTFS(Delta, x0) {
  this.D = Delta;
	this.x = x0;
	this.B = Matrix.I(Delta(x0).length);
	this.mu = 0.9;
};

// Returns a string representation of the matrix
KaplanMeier.prototype.nextStep = function() {
	var that = this;
	var p = this.B.x(this.D(this.x)).scalarMultiply(-1);
	var S;
	var X;
	var gs = new GoldenSection(0, 5, function(a) {return that.f(X=that.x.add(S=p.scalarMultiply(a)))});
	var fx = this.f(this.x);
	var df = this.D(this.x);
	var d = this.mu*df.x(p);
	while (gs.nextStep() > fx+gs.a*d);
	var Y = this.D(X).subtract(df);
	var sy = S.transpose().x(Y);
	this.B = this.B.add(S.scalarMultiply((sy+Y.transpose().x(this.B).x(S))/(sy*sy)).x(S.transpose())).subtract(this.B.x(S).x(Y.transpose()).add(S.x(Y.transpose().x(this.B))).scalarMultiply(sy));
	return 0;
};