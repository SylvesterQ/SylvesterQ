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

function execute() {
	var cmd = document.getElementById("consoleIn");
	$("#consoleOut"+$p.nb).before('<div id="consoleOut'+(++$p.nb)+'"></div>');
	sylv.ui.print("<hr/>", false);
	try {
		// select the input mode
		if($("#inputMode").val() == "Standard") {
			$p(eval(consoleIn.getValue()));
		} else {
			$p(sylv.Formal(consoleIn.getValue()));
		};
	} catch(e) {
		$p("<span style='color:red'>"+e+"</span>");
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
	$("#consoleOut"+$p.nb).before('<div id="consoleOut'+(++$p.nb)+'" style="width:'+windowWidth+'px;height:300px;"></div>');
	jStat.flot("#consoleOut"+$p.nb, vals, optIfNotMatrix);
	return ""
};

function onResize() {
	windowWidth = $(window).width()-70;
	$("#consoleIn").width(windowWidth);
	for (var i = 0; i<=$p.nb; i++) {
		$("#consoleOut"+i).width(windowWidth)
	};
};

define(["tree/tree", "data/data", "process/process", "estim/estim", "copula/copula", "formal/formal", "ui/ui", "ui/plot"], function() {
	
	sylv.ui.print = function(val, nl) {
		var txt = val?val.toString():"";
		var cnsl = document.getElementById("consoleOut"+$p.nb);
		cnsl.innerHTML=txt.replace(/\n/g,"<br/>")+(nl?"<br/>":"")+cnsl.innerHTML; 
	};

	$p.nb = 0;

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
