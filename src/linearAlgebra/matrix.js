/**
 * sylv.matrix - JavaScript Statistical Library
 * Copyright (c) 2011
 * This document is licensed as free software under the terms of the
 * MIT License: http://www.opensource.org/licenses/mit-license.php */
 
define(["sylv"], function() {
	
	// for quick reference
	var slice = Array.prototype.slice;
	var toString = Object.prototype.toString;

	// ascending/descending functions for sort
	var ascNum = function( a, b ) { return a - b; }

	// test if array
	var isArray = Array.isArray || function( arg ) {
		return toString.call( arg ) === "[object Array]";
	};

	// test if function
	var isFunction = function( arg ) {
		return toString.call( arg ) === "[object Function]";
	};

	// test if object
	var isObject = function( arg ) {
		return toString.call( arg ) === "[object Object]";
	};
	
	// calculate correction for IEEE error
	var calcRdx = function( n, m ) {
		var val = n > m ? n : m;
		return Math.pow( 10, 15 - ~~( Math.log((( val > 0 ) ? val : -val )) * Math.LOG10E ));
	};
	
	sylv.matrix = function(args) {
		// if first argument is an array, must be vector or matrix
		if ( isArray( args ) || args instanceof sylv.matrix) {
			if ( isArray( args[0] )) {
				for ( var i = 0; i < args.length; i++ ) {
					this[i] = args[i];
				}
				this.length = args.length;
			} else {
				this[0] = args;
				this.length = 1;
			}
		} else if ( args.length == 1 ) {
			this[0] = [args];
			this.length = 1;
		}
		return this;
	};
	
	m$ = function(args) {return new sylv.matrix(args)};
	
	sylv.extend(sylv.matrix, {
		// generate a rows x cols matrix of zeros
		zeros : function( rows, cols ) {
			return sylv.matrix.create( rows, cols, function() { return 0; });
		},

		// generate a rows x cols matrix of ones
		ones : function( rows, cols ) {
			return sylv.matrix.create( rows, cols, function() { return 1; });
		},

		// generate a rows x cols matrix of uniformly random numbers
		rand : function( rows, cols ) {
			return sylv.matrix.create( rows, cols, function() { return Math.random(); });
		},

		// generate an identity matrix of size row x cols
		identity : function( rows, cols ) {
			if(!cols) cols = rows;
			return sylv.matrix.create( rows, cols, function( i, j ) { return ( i === j ) ? 1 : 0; });
		},

		// generate sequence
		seq : function( min, max, length, func ) {
			var arr = [],
				hival = calcRdx( min, max ),
				step = ( max * hival - min * hival ) / (( length - 1 ) * hival ),
				current = min,
				cnt = 0;
			// current is assigned using a technique to compensate for IEEE error
			for ( ; current <= max; cnt++, current = ( min * hival + step * hival * cnt ) / hival )
				arr.push(( func ? func( current ) : current ));
			return arr;
		}
	}, true);
	
	sylv.extend(sylv.matrix, {
		length : 0,
		
		toString: function() {
			var res = "[[";
			res = res+this.toArray().join("],\n[");
			res = res+"]]";
			return res;
		},
		
		// Returns the number of rows in the matrix
		rows : function() {
			return this.length || 1;
		},

		// Returns the number of columns in the matrix
		cols : function() {
			return this[0].length || 1;
		},

		// Returns the dimensions of the object { rows: i, cols: j }
		dimensions : function() {
			return {
				rows : this.rows(),
				cols : this.cols()
			};
		},

		// Returns a specified row as a vector
		row : function( index ) {
			return sylv.matrix( this[index] );
		},

		// Returns the specified column as a vector
		col : function( index ) {
			var column = [],
				i = 0;
			for ( ; i < this.length; i++ ) {
				column[i] = [ this[i][index] ];
			}
			return sylv.matrix( column );
		},

		// Returns the diagonal of the matrix
		diag : function() {
			var row = 0,
				nrow = this.rows(),
				res = [];
			for( ; row < nrow; row++ ) {
				res[row] = [ this[row][row] ];
			}
			return sylv.matrix( res );
		},

		// Returns the anti-diagonal of the matrix
		antidiag : function() {
			var nrow = this.rows() - 1,
				res = [],
				i = 0;
			for( ; nrow >= 0; nrow--, i++ ) {
				res[i] = [ this[i][nrow] ];
			}
			return sylv.matrix( res );
		},

		// map a function to a matrix or vector
		map : function( func, toAlter ) {
			return sylv.matrix( sylv.matrix.map( this, func, toAlter ));
		},

		// destructively alter an array
		alter : function( func ) {
			sylv.matrix.alter( this, func );
			return this;
		},
		
		// transpose a matrix or array
		transpose : function( arr ) {
			if ( !isArray( arr[0] )) arr = [ arr ];
			var rows = arr.length,
				cols = arr[0].length,
				obj = [],
				i = 0, j;
			for ( ; i < cols; i++ ) {
				obj.push([]);
				for ( j = 0; j < rows; j++ ) {
					obj[i].push( arr[j][i] );
				}
			}
			return obj;
		},

		// map a function to an array or array of arrays
		map : function( arr, func, toAlter ) {
			if ( !isArray( arr[0] )) arr = [ arr ];
			var row = 0,
				nrow = arr.length,
				ncol = arr[0].length,
				res = toAlter ? arr : [],
				col;
			for ( ; row < nrow; row++ ) {
				if ( !res[row] ) res[row] = [];
				for ( col = 0; col < ncol; col++ )
					res[row][col] = func( arr[row][col], row, col );
			}
			return res.length === 1 ? res[0] : res;
		},

		// destructively alter an array
		alter : function( arr, func ) {
			return sylv.matrix.map( arr, func, true );
		},

		// generate a rows x cols matrix according to the supplied function
		create : function ( rows, cols, func ) {
			var res = [], i, j;
			for( i = 0; i < rows; i++ ) {
				res[i]  = [];
				for( j = 0; j < cols; j++ ) {
					res[i].push( func( i, j ));
				}
			}
			return res;
		},

		// add a vector or scalar to the vector
		add : function( arr, arg ) {
			// check if arg is a vector or scalar
			return isNaN( arg ) ?
				sylv.matrix.map( arr, function( value, row, col ) { return value + arg[row][col]; })
			: sylv.matrix.map( arr, function ( value ) { return value + arg; });
		},

		// TODO: Implement matrix division
		// matrix division
		divide : function( arr, arg ) {
			return isNaN( arg ) ?
				false
			: sylv.matrix.map(arr, function ( value ) { return value / arg; });
		},

		// matrix multiplication
		x : function( arr, arg ) {
			var row, col, nrescols, sum,
				nrow = arr.length,
				ncol = arr[0].length,
				res = sylv.matrix.zeros( nrow, nrescols = ( isNaN( arg )) ? arg[0].length : ncol ),
				rescols = 0;
			if( isNaN( arg )) {
				for( ; rescols < nrescols; rescols++ ) {
					for( row = 0; row < nrow; row++ ) {
						sum = 0;
						for( col = 0; col < ncol; col++ )
							sum += arr[row][col] * arg[col][rescols];
						res[row][rescols] = sum;
					}
				}
				return ( nrow === 1 && rescols === 1 ) ? res[0][0] : res;
			}
			return sylv.matrix.map( arr, function( value ) { return value * arg; });
		},

		// subtract a vector or scalar from the vector
		subtract : function( arr, arg ) {
			var res;
			if( isNaN( arg ) ) {
				if( isNaN( arg[0] ) ) {
					res = sylv.matrix.map( arr, function( value, row, col ) { return value - arg[row][col]?arg[row][col]:0; });
				} else {
					res = sylv.matrix.map( arr, function( value, row, col ) { return value - arg[col]?arg[col]:0; });
				};
			} else {
				res = sylv.matrix.map( arr, function( value ) { return value - arg; });
			};
			return res
		},

		// Returns the dot product of two matricies
		dot : function( arr, arg ) {
			if ( !isArray( arr )) arr = [ arr ];
			if ( !isArray( arg )) arg = [ arg ];
				// convert column to row vector
			var left = ( arr[0].length === 1 && arr.length !== 1 ) ? sylv.matrix.transpose( arr ) : arr,
				right = ( arg[0].length === 1 && arg.length !== 1 ) ? sylv.matrix.transpose( arg ) : arg,
				res = [],
				row = 0,
				nrow = left.length,
				ncol = left[0].length,
				sum, col;
			for( ; row < nrow; row++ ) {
				res[row] = [];
				sum = 0;
				for( col = 0; col < ncol; col++ )
					sum += left[row][col] * right[row][col];
				res[row] = sum;
			}
			return ( res.length === 1 ) ? res[0] : res;
		},

		// raise every element by a scalar or vector
		pow : function( arr, arg ) {
			return sylv.matrix.map( arr, function( value ) { return Math.pow( value, arg ); });
		},

		// generate the absolute values of the vector
		abs : function( arr ) {
			return sylv.matrix.map( arr, function( value ) { return Math.abs( value ); });
		},

		// set all values to zero
		clear : function( arr ) {
			return sylv.matrix.alter( arr, function() { return 0; });
		},

		// BUG: Does not work for matrices
		// computes the norm of the vector
		norm : function( arr ) {
			arr = isArray( arr[0] ) ? arr : [arr];
			if( arr.length > 1 && arr[0].length > 1 ) {
				// matrix norm
				return false;
			}
			// vector norm
			return Math.sqrt( sylv.matrix.dot( arr, arr ));
		},

		// BUG: Does not work for matrices
		// computes the angle between two vectors
		angle : function( arr, arg ) {
			 return Math.acos( sylv.matrix.dot( arr, arg ) / ( sylv.matrix.norm( arr ) * sylv.matrix.norm( arg )));
		},

		// Tests whether a matrix is symmetric
		symmetric : function( arr ) {
			var issymmetric = true,
				row = 0,
				size = arr.length, col;
			if( arr.length !== arr[0].length ) return false;
			for ( ; row < size; row++ ) {
				for ( col = 0; col < size; col++ ) {
					if ( arr[col][row] !== arr[row][col] ) return false;
				}
			}
			return true;
		},

		/* array/vector specific methods */

		// sum of an array
		sum : function( arr ) {
			var sum = 0,
				i = arr.length;
			while( --i >= 0 ) sum += arr[i];
			return sum;
		},

		// minimum value of an array
		min : function( arr ) {
			return Math.min.apply( null, arr );
		},

		// maximum value of an array
		max : function( arr ) {
			return Math.max.apply( null, arr );
		},

		// mean value of an array
		mean : function( arr ) {
			return sylv.matrix.sum( arr ) / arr.length;
		},

		// median of an array
		median : function( arr ) {
			var arrlen = arr.length,
				_arr = arr.slice().sort( ascNum );
			// check if array is even or odd, then return the appropriate
			return !( arrlen & 1 ) ? ( _arr[ ( arrlen / 2 ) - 1 ] + _arr[ ( arrlen / 2 ) ] ) / 2 : _arr[ ( arrlen / 2 ) | 0 ];
		},

		// mode of an array
		mode : function( arr ) {
			var arrLen = arr.length,
				_arr = arr.slice().sort( ascNum ),
				count = 1,
				maxCount = 0,
				numMaxCount = 0,
				i = 0,
				maxNum;
			for ( ; i < arrLen; i++ ) {
				if ( _arr[ i ] === _arr[ i + 1 ] ) {
					count++;
				} else {
					if ( count > maxCount ) {
						maxNum = _arr[i];
						maxCount = count;
						count = 1;
						numMaxCount = 0;
					} else {
						// are there multiple max counts
						if ( count === maxCount ) {
							numMaxCount++;
						// count is less than max count, so reset values
						} else {
							count = 1;
						}
					}
				}
			}
			return ( numMaxCount === 0 ) ? maxNum : false;
		},

		// range of an array
		range : function( arr ) {
			var _arr = arr.slice().sort( ascNum );
			return _arr[ _arr.length - 1 ] - _arr[0];
		},

		// variance of an array
		variance : function( arr ) {
			var mean = sylv.matrix.mean( arr ),
				stSum = 0,
				i = arr.length - 1;
			for( ; i >= 0; i-- ) {
				stSum += Math.pow(( arr[i] - mean ), 2 );
			}
			return stSum / ( arr.length - 1 );
		},

		// standard deviation of an array
		stdev : function( arr ) {
			return Math.sqrt( sylv.matrix.variance( arr ));
		},

		// mean deviation (mean absolute deviation) of an array
		meandev : function( arr ) {
			var devSum = 0,
				mean = sylv.matrix.mean( arr ),
				i = arr.length - 1;
			for ( ; i >= 0; i-- ) {
				devSum += Math.abs( arr[i] - mean );
			}
			return devSum / arr.length;
		},

		// median deviation (median absolute deviation) of an array
		meddev : function( arr ) {
			var devSum = 0,
				median = sylv.matrix.median( arr ),
				i = arr.length - 1;
			for ( ; i >= 0; i-- ) {
				devSum += Math.abs( arr[i] - median );
			}
			return devSum / arr.length;
		},

		// quartiles of an array
		quartiles : function( arr ) {
			var arrlen = arr.length,
				_arr = arr.slice().sort( ascNum );
			return [
				_arr[ Math.round(( arrlen ) / 4 ) - 1 ],
				_arr[ Math.round(( arrlen ) / 2 ) - 1 ],
				_arr[ Math.round(( arrlen ) * 3 / 4 ) - 1 ]
			];
		},

		// covariance of two arrays
		covariance : function( arr1, arr2 ) {
			var u = sylv.matrix.mean( arr1 ),
				v = sylv.matrix.mean( arr2 ),
				sq_dev = [],
				arr1Len = arr1.length,
				i = 0;
			for ( ; i < arr1Len; i++ ) {
				sq_dev[i] = ( arr1[i] - u ) * ( arr2[i] - v );
			}
			return sylv.matrix.sum( sq_dev ) / arr1Len;
		},

		// correlation coefficient of two arrays
		corrcoeff : function( arr1, arr2 ) {
			return sylv.matrix.covariance( arr1, arr2 ) / sylv.matrix.stdev( arr1 ) / sylv.matrix.stdev( arr2 );
		}
	});
});
