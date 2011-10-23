// Copyright 2011 Florian Pons (florian.pons.tv). All Rights Reserved.
//
// Licensed under the MIT License

/**
 * @fileoverview Classe representing formal function.
 *
 *
 */

define(["sylv"],function(sylv) {
	
	/**
	 * Create basic tree
	 *
	 * @param {} the value of the node
	 * @constructor
	 */
	 
	sylv.Node = function() {
		this.parent = this;
		this.parentPlace = 0;
		this.nodes = [];
	};
	
	sylv.extend(sylv.Node, {
		setParent: function(parent) {
			this.parent = parent;
		},
		
		isRoot: function(parent) {
			return this.parent == this;
		},
		
		getRoot: function() {
			var res = this;
			while (!res.isRoot()) res = res.parent
			return res;
		},
		
		push: function(node) {
			node.parentPlace = this.nodes.length;
			this.nodes.push(node);
			node.setParent(this);
		},
		
		permute: function(node) {
			if(!this.isRoot()) {
				node.parentPlace = this.parentPlace;
				node.setParent(this.parent);
				this.parent.nodes[this.parentPlace] = node;
			}
			node.push(this);
		}
	})
	
	return sylv.Node;
});
