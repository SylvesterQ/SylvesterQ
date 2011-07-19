// Copyright 2011 Florian Pons (florian.pons@gmail.com). All Rights Reserved.
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
 * @fileoverview Class for representing matrices and static helper functions.
 *
 *
 */
 
function Matrix(m) {
	this.array_ = m;
};

Matrix.prototype.toString = function() {
	var res = "[";
	for (var i=0; i<this.array_.length; i++) {
		res = res+"["+this.array_[i].toString()+"],\n";
	};
	res = res.substr(0, res.length-2);
	res = res+"]";
	return res;
};

Matrix.prototype.add = function(m) {
	var l = [];
	var nbl = this.array_.length==m.array_.length?this.array_.length:0;
	var nbc = (nbl!=0 && this.array_[1].length==m.array_[1].length)?this.array_[1].length:0;
	for (var i=0; i<nbl; i++) {
    var c=[];
    var c1 = this.array_[i];
    var c2 = m.array_[i];
    for (var j=0; j<nbc; j++) {
      c.push(c1[j]+c2[j]);
    };
    l.push(c);
	};
	return new Matrix(l);
};

Matrix.prototype.mult = function(m) {
	var l = [];
	var nbl = this.array_.length;
	var nbm = (nbl!=0 && this.array_[1].length==m.array_.length)?this.array_[1].length:0;
	var nbc = nbm!=0?m.array_[1].length:0;
	for (var i=0; i<nbl; i++) {
    var c=[];
    for (var j=0; j<nbc; j++) {
			var s=0;
			for (var k=0; k<nbm; k++) {
				s+= this.array_[i][k]*m.array_[k][j];
			};
			c.push(s);
    };
    l.push(c);
	};
	return new Matrix(l);
};