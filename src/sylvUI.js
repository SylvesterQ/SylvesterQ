// Copyright 2011 Florian Pons (florian.pons.tv). All Rights Reserved.
//
// Licensed under the MIT License

/**
 * @fileoverview Class for representing matrices and static helper functions.
 *
 *
 */
 
function exportAll() {
	consoleIn.setValue(sylv.ui.extractAll());
};

function historyNavAll() {
	consoleIn.setValue(keyInputShortCut.buff.join(";\n//////////////////////\n"));
};

function print(val) {if(val) sylv.ui.print(val, true)};

function execute() {
	var cmd = document.getElementById("consoleIn");
	$("#consoleOut"+print.nb).before('<div id="consoleOut'+(++print.nb)+'"></div>');
	sylv.ui.print("<hr/>", false);
	try {
		print(eval(consoleIn.getValue()));
	} catch(e) {
		print("<span style='color:red'>"+e+"</span>");
	};
	keyInputShortCut.buff[keyInputShortCut.buff.length-1]=consoleIn.getValue();
	consoleIn.setValue("");
	keyInputShortCut.buff.push("");
	keyInputShortCut.pos = keyInputShortCut.buff.length-1;
};

function keyInputShortCut(inst, e) {
	if(e.shiftKey && e.type=="keydown") switch(e.keyCode) {
		case 38:
			if(keyInputShortCut.pos==keyInputShortCut.buff.length-1) keyInputShortCut.buff[keyInputShortCut.pos]=consoleIn.getValue();
			keyInputShortCut.pos--;
			if(keyInputShortCut.pos<0) keyInputShortCut.pos=0;
			consoleIn.setValue(keyInputShortCut.buff[keyInputShortCut.pos]);
			break;
		case 40:
			keyInputShortCut.pos++;
			if(keyInputShortCut.pos>keyInputShortCut.buff.length-1) keyInputShortCut.pos=keyInputShortCut.buff.length-1;
			consoleIn.setValue(keyInputShortCut.buff[keyInputShortCut.pos]);
			break;
		case 13:
			execute();
			break;
	};
	if(e.shiftKey && e.keyCode==13) {
		event.preventDefault();
	};
};

function plot(vals, optIfNotMatrix) {
	$("#consoleOut"+print.nb).before('<div id="consoleOut'+(++print.nb)+'" style="width:'+windowWidth+'px;height:300px;"></div>');
	jStat.flot("#consoleOut"+print.nb, vals, optIfNotMatrix);
	return ""
};

function onResize() {
	windowWidth = $(window).width()-70;
	$("#consoleIn").width(windowWidth);
	for (var i = 0; i<=print.nb; i++) {
		$("#consoleOut"+i).width(windowWidth)
	};
};

define(["data/data", "process/process", "estim/estim", "ui/ui", "copula/copula", "polynomial/polynomial"], function() {
	require(["../tools/jStat/src/plugin/flot.jstat"]);
	
	sylv.ui.print = function(val, nl) {
		var txt = val?val.toString():"";
		var cnsl = document.getElementById("consoleOut"+print.nb);
		cnsl.innerHTML=txt.replace(/\n/g,"<br/>")+(nl?"<br/>":"")+cnsl.innerHTML; 
	};

	print.nb = 0;

	keyInputShortCut.pos = 0;
	keyInputShortCut.buff = [""];

	$(window).resize(onResize);

	$(document).ready(function() {
		consoleIn = CodeMirror.fromTextArea(document.getElementById("consoleIn"), {
			indentWithTabs: true,
			mode:  "javascript",
			matchBrackets: true,
			onKeyEvent: keyInputShortCut,
			theme: "default"
		});
		onResize();
	});

});
