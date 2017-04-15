/*------------------------------------------------------------------------
# JA Rochea for Joomla 1.5 - Version 1.4 - Licence Owner JA130162
# ------------------------------------------------------------------------
# Copyright (C) 2004-2008 J.O.O.M Solutions Co., Ltd. All Rights Reserved.
# @license - Copyrighted Commercial Software
# Author: J.O.O.M Solutions Co., Ltd
# Websites:  http://www.joomlart.com -  http://www.joomlancers.com
# This file may not be redistributed in whole or significant part.
-------------------------------------------------------------------------*/
var siteurl = '';

function switchFontSize (ckname,val){
	var bd = $E('BODY');
	switch (val) {
		case 'inc':
			if (CurrentFontSize+1 < 7) {
				bd.removeClass('fs'+CurrentFontSize);
				CurrentFontSize++;
				bd.addClass('fs'+CurrentFontSize);
			}		
		break;
		case 'dec':
			if (CurrentFontSize-1 > 0) {
				bd.removeClass('fs'+CurrentFontSize);
				CurrentFontSize--;
				bd.addClass('fs'+CurrentFontSize);
			}		
		break;
		default:
			bd.removeClass('fs'+CurrentFontSize);
			CurrentFontSize = val;
			bd.addClass('fs'+CurrentFontSize);		
	}
	Cookie.set(ckname, CurrentFontSize,{duration:365});
}

function switchTool (ckname, val) {
	createCookie(ckname, val, 365);
	window.location.reload();
}

function createCookie(name,value,days) {
  if (days) {
    var date = new Date();
    date.setTime(date.getTime()+(days*24*60*60*1000));
    var expires = "; expires="+date.toGMTString();
  }
  else expires = "";
  document.cookie = name+"="+value+expires+"; path=/";
}

String.prototype.trim = function() { return this.replace(/^\s+|\s+$/g, ""); };

function changeToolHilite(oldtool, newtool) {
	if (oldtool != newtool) {
		if (oldtool) {
			oldtool.src = oldtool.src.replace(/-hilite/,'');
		}
		newtool.src = newtool.src.replace(/.gif$/,'-hilite.gif');
	}
}

//addEvent - attach a function to an event
function jaAddEvent(obj, evType, fn){ 
 if (obj.addEventListener){ 
   obj.addEventListener(evType, fn, false); 
   return true; 
 } else if (obj.attachEvent){ 
   var r = obj.attachEvent("on"+evType, fn); 
   return r; 
 } else { 
   return false; 
 } 
}

function equalHeight(){
	if ($('ja-botsl')) {
		makeEqualHeight ($ES('.module',$('ja-botsl')));
	}

	makeEqualHeight($$('.rsg_galleryblock'));
}

function makeEqualHeight(divs) {
	if(!divs) return;
	var maxh = 0;
	//alert(divs);
	divs.each(function(el, i){
		el = getDeepestDiv(el);
		var ch = el.getCoordinates().height;
		maxh = (maxh < ch) ? ch : maxh;		
	},this);
	divs.each(function(el, i){
		el = getDeepestDiv(el);
		if(el.getCoordinates().height < maxh)
		{
			el.setStyle('height', maxh);		
		}
	},this);
}

function getDeepestDiv (div) {
	while (div.getChildren().length && (div.getChildren()[0].tagName == 'DIV'))
	{
		div = div.getChildren()[0];
	}
	return div;
}

function getLastWrapModDiv(mod) {
	while (mod.getFirst().tagName == 'DIV')
	{
		mod = mod.getFirst();
	}
	return mod;
}

function preloadImages () {
	var imgs = new Array();
	for (var i = 0; i < arguments.length; i++) {
		var imgsrc = arguments[i];
		imgs[i] = new Image();
		imgs[i].src = imgsrc;
	}
}

jaToolsHover = function() {
	var jautw = document.getElementById("ja-usertoolswrap");	
	if (!jautw) return;

	jautw.onmouseover=function() {
		this.className="ja-toolswraphover";
	}
	jautw.onmouseout=function() {
		this.className="";
	}
}

jaAddEvent (window, 'load', jaToolsHover);

jaToolsHover = function() {
	var jautw = document.getElementById("jausertoolswrap");	
	if (!jautw) return;

	jautw.onmouseover=function() {
		this.className="ja-toolswraphover";
	}
	jautw.onmouseout=function() {
		this.className="";
	}
}

jaAddEvent (window, 'load', jaToolsHover);

function getElementsByClass(searchClass,node,tag) {
	var classElements = new Array();
	var j = 0;
	if ( node == null )
		node = document;
	if ( tag == null )
		tag = '*';
	var els = node.getElementsByTagName(tag);
	var elsLen = els.length;
	var pattern = new RegExp('(^|\\s)'+searchClass+'(\\s|$)');
	for (var i = 0; i < elsLen; i++) {
		if ( pattern.test(els[i].className) ) {
			classElements[j] = els[i];
			j++;
		}
	}
	//alert(searchClass + j);
	return classElements;
}

function makeTransBg(el, bgimgdf, sizingMethod, type, offset){
	var objs = el;
	if(!objs) return;
	if ($type(objs) != 'array') objs = [objs];
	if(!sizingMethod) sizingMethod = 'crop';
	if(!offset) offset = 0;
	var blankimg = siteurl + 'images/blank.png';
	objs.each(function(obj) {
		var bgimg = bgimgdf;
		if (obj.tagName == 'IMG') {
			//This is an image
			if (!bgimg) bgimg = obj.src;
			if (!(/\.png$/i).test(bgimg) || (/blank\.png$/i).test(bgimg)) return;

			obj.setStyle('height',obj.offsetHeight);
			obj.setStyle('width',obj.offsetWidth);
			obj.src = blankimg;
			obj.setStyle ('visibility', 'visible');
			obj.setStyle('filter', "progid:DXImageTransform.Microsoft.AlphaImageLoader(src="+bgimg+", sizingMethod='"+sizingMethod+"')");
		}else{
			//Background
			if (!bgimg) bgimg = obj.getStyle('backgroundImage');
			var pattern = new RegExp('url\s*[\(\"\']*([^\'\"\)]*)[\'\"\)]*');
			if ((m = pattern.exec(bgimg))) bgimg = m[1];
			if (!(/\.png$/i).test(bgimg) || (/blank\.png$/i).test(bgimg)) return;
			if (!type)
			{
				obj.setStyle('background', 'none');
				//if(!obj.getStyle('position'))
				if(obj.getStyle('position')!='absolute' && obj.getStyle('position')!='relative') {
					obj.setStyle('position', 'relative');
				}

				//Get all child
				var childnodes = obj.childNodes;
				for(var j=0;j<childnodes.length;j++){
					if((child = $(childnodes[j]))) {
						if(child.getStyle('position')!='absolute' && child.getStyle('position')!='relative') {
							child.setStyle('position', 'relative');
						}
						child.setStyle('z-index',2);
					}
				}
				//Create background layer:
				var bgdiv = new Element('IMG');
				bgdiv.src = blankimg;
				bgdiv.width = obj.offsetWidth - offset;
				bgdiv.height = obj.offsetHeight - offset;
				bgdiv.setStyles({
					'position': 'absolute',
					'top': 0,
					'left': 0
				});

				bgdiv.className = 'TransBG';

				bgdiv.setStyle('filter', "progid:DXImageTransform.Microsoft.AlphaImageLoader(src="+bgimg+", sizingMethod='"+sizingMethod+"')");
				bgdiv.inject(obj, 'top');
				//alert(obj.innerHTML + '\n' + bgdiv.innerHTML);
			} else {
				obj.setStyle('filter', "progid:DXImageTransform.Microsoft.AlphaImageLoader(src="+bgimg+", sizingMethod='"+sizingMethod+"')");
			}
		}
	}.bind(this));

}

function ie6pnghover (obj, img_out, img_over) {
	obj = $(obj);
	if(!obj) return;
	if (obj.tagName == 'IMG') {
		//This is an image
		obj.setStyle('height',obj.offsetHeight);
		obj.setStyle('width',obj.offsetWidth);
		obj.src = 'images/blank.png';
		obj.setStyle ('visibility', 'visible');
	}else{
		obj.setStyle ('background', 'none');
	}
	obj.setStyle('filter', "progid:DXImageTransform.Microsoft.AlphaImageLoader(src="+img_out+", sizingMethod='crop')");
	obj.addEvent('mouseover', function () {
		obj.setStyle('filter', "progid:DXImageTransform.Microsoft.AlphaImageLoader(src="+img_over+", sizingMethod='crop')");
	});
	obj.addEvent('mouseout', function () {
		obj.setStyle('filter', "progid:DXImageTransform.Microsoft.AlphaImageLoader(src="+img_out+", sizingMethod='crop')");
	});
}

function isIE6() {
	version=0
	if (navigator.appVersion.indexOf("MSIE")!=-1){
		temp=navigator.appVersion.split("MSIE")
		version=parseFloat(temp[1])
	}
	return (version && (version < 7));
}

//Hack readon
function hackReadon () {
	var readons = getElementsByClass ("readon", null, "A");	
	if (!readons || !readons.length) return;
	for (var i=0; i<readons.length; i++)
	{
		var readon = readons[i];
		//Get readon parent (TR)
		var p = readon;
		while ((p = p.parentNode) && p.tagName != 'TR'){}
		if (!p) continue;
		var pc = p;
		while ((pc = pc.previousSibling) && pc.tagName != 'TR') {}
		if (!pc) continue;
		var tc = pc.firstChild;
		while (tc && tc.tagName!='TD') tc=tc.nextSibling;
		if (!tc) continue;
		tc.appendChild (readon);
		p.parentNode.removeChild(p);
		readon.style.display = 'block';
	}
}

//Add span to module title
function addSpanToTitle () {
  var colobj = document.getElementById ('ja-topsl-col1');
  if (!colobj) return;
  var modules = getElementsByClass ('moduletable.*', colobj, "DIV");
 if (!modules) return;
  for (var i=0; i<modules.length; i++) {
    var module = modules[i];
    var title = module.getElementsByTagName ("h3")[0];  
    if (title) {
      title.innerHTML = "<span>"+title.innerHTML+"</span>";
      //module.className = "ja-" + module.className;
    }
  }
}

window.addEvent ('load', function() {
	addSpanToTitle();
	equalHeight();
});
