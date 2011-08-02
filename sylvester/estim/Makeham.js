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
 * @fileoverview Classe d'évaluation de coefficients de la formule de Makeham.
 *
 *
 */

/**
 * Fonction d'évaluation de coefficients de la formule de Makeham.
 *
 * @param {integer} date de demarrage de P
 * @param {array[float]} Taux annuel de vitalité au dates x, x+1, X+2 ...
 * @constructor
 */
function MakehamEstim(x, P) {
	var n = Math.floor(P.length/3);
	var A = [0,0,0];
  for (var i = 0; i<3; i++) {
		for (var j = 0; j<n; j++) {
			A[i] += Math.log(P[i*n+j]);
		}
	};
	this.c = Math.exp(Math.log((A[1]-A[2])/(A[0]-A[1]))/n);
	var cn_1 = Math.pow(this.c,n)-1;
	var V = (A[1]-A[0])/cn_1;
	this.g = Math.exp(V/(Math.pow(this.c,x)*cn_1));
	this.s = Math.exp((A[0]-V)/n)
};

// Returns a process representation of the serie
MakehamEstim.prototype.getProcess = function() {
	return new Makeham(this.c, this.g, this.s);
};