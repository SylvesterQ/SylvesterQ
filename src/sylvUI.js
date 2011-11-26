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
	$("#consoleOut"+$p.nb).before('<div id="consoleOut'+(++$p.nb)+'"></div>');
	sylv.ui.print("<hr/>", false);
	try {
		// select the input mode
		if($("#inputMode").val() == "Formal") {
			$p(sylv.Formal(consoleIn.getValue()));
		} else {
			$p(eval(consoleIn.getValue()));
		};
	} catch(e) {
		$p("<span style='color:red'>"+e+"</span>");
	};
	keyInputShortCut.mode[keyInputShortCut.buff.length-1]=$("#inputMode").index();
	keyInputShortCut.buff[keyInputShortCut.buff.length-1]=consoleIn.getValue();
	consoleIn.setValue("");
	keyInputShortCut.buff.push("");
	keyInputShortCut.pos = keyInputShortCut.buff.length-1;
};

// navigate forward in the history
function historyUp() {
	if(keyInputShortCut.pos==keyInputShortCut.buff.length-1) {
		keyInputShortCut.mode[keyInputShortCut.pos]=$("#inputMode").index();
		keyInputShortCut.buff[keyInputShortCut.pos]=consoleIn.getValue();
	}
	keyInputShortCut.pos--;
	if(keyInputShortCut.pos<0) keyInputShortCut.pos=0;
	consoleIn.setValue(keyInputShortCut.buff[keyInputShortCut.pos]);
};

// navigate back in the history
function historyDown() {
	keyInputShortCut.pos++;
	if(keyInputShortCut.pos>keyInputShortCut.buff.length-1) keyInputShortCut.pos=keyInputShortCut.buff.length-1;
	consoleIn.setValue(keyInputShortCut.buff[keyInputShortCut.pos]);
};

function keyInputShortCut(inst, e) {
	if(e.shiftKey && e.type=="keydown") switch(e.keyCode) {
		case 38:
			historyUp();
			break;
		case 40:
			historyDown()
			break;
		case 13:
			execute();
			break;
	};
	if(e.shiftKey && e.keyCode==13) {
		event.preventDefault();
	};
};

function setCodeMirror() {
	consoleIn = CodeMirror.fromTextArea(document.getElementById("consoleIn"), {
		indentWithTabs: true,
		mode:  "javascript",
		matchBrackets: true,
		onKeyEvent: keyInputShortCut,
		theme: "default"
	});
};

function onModeChange() {
	if($("#inputMode").val() == "Mode") {
		if($("#inputMode option")[2].text == "Basic Input Mode") {
			consoleIn.toTextArea();
			consoleIn = $("#consoleIn");
			consoleIn.getValue = function() {return consoleIn.val()};
			consoleIn.setValue = function(v) {return consoleIn.val(v)};
			$("#inputMode option")[2].text = "Standard Input Mode";
			$("#inputMode").val("Standard");
		} else {
			setCodeMirror();
			$("#inputMode option")[2].text = "Basic Input Mode";
			$("#inputMode").val("Standard");
		};
	};
};

function plot(vals, optIfNotMatrix) {
	$("#consoleOut"+$p.nb).before('<div id="consoleOut'+(++$p.nb)+'" style="width:'+windowWidth+'px;height:300px;"></div>');
	sylv.flot("#consoleOut"+$p.nb, vals, optIfNotMatrix);
	return ""
};

function onResize() {
	windowWidth = $(window).width()-70;
	$("#consoleIn").width(windowWidth);
	for (var i = 0; i<=$p.nb; i++) {
		$("#consoleOut"+i).width(windowWidth)
	};
};

define(["stat/stat", "tree/tree", "data/data", "process/process", "estim/estim", "copula/copula", "formal/formal", "ui/ui", "ui/plot"], function() {
	
	sylv.ui.print = function(val, nl) {
		var txt = val?val.toString():"";
		var cnsl = document.getElementById("consoleOut"+$p.nb);
		cnsl.innerHTML=txt.replace(/\n/g,"<br/>")+(nl?"<br/>":"")+cnsl.innerHTML; 
	};

	$p.nb = 0;

	keyInputShortCut.pos = 0;
	keyInputShortCut.buff = [""];
	keyInputShortCut.mode = [$("#inputMode").index()];

	$(window).resize(onResize);
	$("#inputMode").change(onModeChange);

	$(document).ready(function() {
		setCodeMirror();
		onResize();
	});

});
