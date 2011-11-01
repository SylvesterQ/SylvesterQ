// Copyright 2011 Florian Pons (florian.pons.tv). All Rights Reserved.
//
// Licensed under the MIT License

/**
 * @fileoverview define sync tools between client and server
 *
 *
 */
 
define(["sylv"],function(sylv) {
	
	// define the glb object, this object select data to sync
	glb = function(name, val) {
		if(val == undefined) {
			if(typeof(glb[name]) == "string") {
					return eval(glb[name]);
			} else {
					return glb[name];
			};
		} else {
			glb[name] = val;
			$p(name+":"+glb[name].toString());
			eval(name+"=glb['"+name+"'];");
			globalSync(name);
			return glb[name];
		};
	};
	
	globalSync = function(name) {
		globalSync.socket.emit('update', { name: name, val: globalSync.getString(name) });
	};
	// get the string constructor from a velue
	globalSync.getString = function(name) {
		var type = glb[name].constructorName?glb[name].constructorName:glb[name].constructor.name;
		if(type=="String") {
			return "'"+glb[name]+"'";
		} else {
			return "new "+type+"("+glb[name].toString()+")";
		};
	};
	
	globalSync.setSocket = function(socket) {
		globalSync.socket = socket;
		globalSync.socket.on('update', function (data) {
			glb[data.name] = eval(data.val);
			$p(data.name+":"+glb[data.name].toString());
			eval(data.name+"=glb['"+data.name+"'];");
		});
	};
	if(typeof(document)=="object") {
		// assume we are on a client
		if(typeof(io)=="object") {
			// socket.io is loaded
			globalSync.setSocket(io.connect('http://localhost'));
		};
	};
	
	return globalSync;

});
