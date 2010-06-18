// background.htmlにmessage passing
//chrome.extension.sendRequest({
//	'action': 'getBookmakForm'
//}, displayBookmarkForm);
/*
chrome.extension.sendRequest({
	action: 'init'
},init)

function init(){
	var container = document.createElement('div');
	container.id = 'go_form';
	var html = [
		'<input type="text" id="go_search" name="go_search"/>'
	].join('');
	container.innerHTML = html;

	document.body.insertBefore(container, document.body);
}
*/

var BookmarkSearch = function() {
	
	var _goForm = null;
	var _searchBox = null;
	var _searchResults = null;
	
	var _currentIndex = 0;
	
	var init = function() {
		var body = document.body;

		_goForm = document.createElement('div');
		_goForm.id = '__goForm';

		var searchContainer = document.createElement('div');
		searchContainer.id = '__goSearchContainer';

		var label = document.createElement('label');
		label.innerHTML = ">";
		label.id = "searchBoxLabel";
		label.setAttribute('for', 'searchBox');
		searchContainer.appendChild(label);

		_searchBox = document.createElement('input');
		_searchBox.type = 'text';
		_searchBox.id = 'searchBox';
		_searchBox.name = 'searchBox';
		_searchBox.onkeyup = function(e) { searchBookmarks(e); }
		_searchBox.onblur = function() { hide(); }
		searchContainer.appendChild(_searchBox);

		var clear = document.createElement('div');
		clear.style.clear = 'both';
		searchContainer.appendChild(clear);
		_goForm.appendChild(searchContainer);

		_searchResults = document.createElement('div');
		_searchResults.id = '__goBookmarkList';
		_goForm.appendChild(_searchResults);

		body.appendChild(_goForm);
	}
	
	var show = function() {
		_goForm.style.visibility = 'visible';
		_searchBox.focus();
	}
	
	var hide = function() {
		_goForm.style.visibility = 'hidden';
		clear();
	}
	
	var searchBookmarks = function(e) {
		e.preventDefault();
		var key = keyId[e.keyIdentifier] || e.keyIdentifier;

		if (key.match(/^\w{1}$/) || key === "BackSpace" || key === "Delete" || key === "Space") {
			//	console.log(search.value);
			chrome.extension.sendRequest({
				action: 'fetchBookmarks',
				query: _searchBox.value
			},showBookmarks)
		} else if (key === "Down") {
			next(+1);
		} else if (key === "Up") {
			next(-1);
		}
	}
	
	var next = function(n) {
		var lis = document.querySelectorAll('#__goBookmarkList > ul > li');
		if (!lis)	return;
		
		_currentIndex += n;
		_currentIndex = Math.max(_currentIndex, 0);
		_currentIndex = Math.min(_currentIndex, lis.length);

		unselect(lis);
		select(lis);		
	}

	var select = function(lis) {
		if (!lis)	lis = document.querySelectorAll('#__goBookmarkList > ul > li');
		if (!lis)	return;
		
		lis[_currentIndex].className += ' __goItemSelected';
	}
	
	var unselect = function(lis) {
		for (var i=0; i < lis.length; i++) {
			if (lis[i].className.match('__goItemSelected'))
				lis[i].className = lis[i].className.replace('__goItemSelected', '');
		};
	}

	var clear = function() {
		_searchBox.value = "";
		_currentIndex = 0;

		while(_searchResults.hasChildNodes())
			_searchResults.removeChild(_searchResults.firstChild);
	}
	
	var showBookmarks = function(response) {	
		console.log(response.bookmarks);

		var bookmarks = response.bookmarks;
		var query = response.query;

		var html = "";
		html += '<ul>';
		var reg = new RegExp(query, 'gi');
		for (var i=0; i<bookmarks.length; i++) {
			var bookmark = bookmarks[i];
			var title = bookmark.title.replace(reg, '<em>$&</em>');
			var url = bookmark.url.replace(reg, '<em>$&</em>');
			var value = title + '<span class="__goUrl">' + url + '</span>';

			var klass = (i==0) ? "__goResultItem __goItemSelected" : "__goResultItem";
			html += '<li class="' + "__goResultItem" + '"><nobr><a class="__goItemLink" href="' + bookmark.url + '">' + value + '</a></nobr></li>';
		}
		html += '</ul>';

		_searchResults.innerHTML = html;
		
		select();
	}
	
	return {
		init: init,
		show: show,
		hide: hide,
		clear: clear
	}
}()

BookmarkSearch.init();

var keyId = {
    "U+0008" : "BackSpace",
    "U+0009" : "Tab",
    "U+0018" : "Cancel",
    "U+001B" : "Esc",
    "U+0020" : "Space",
    "U+0021" : "!",
    "U+0022" : "\"",
    "U+0023" : "#",
    "U+0024" : "$",
    "U+0026" : "&",
    "U+0027" : "'",
    "U+0028" : "(",
    "U+0029" : ")",
    "U+002A" : "*",
    "U+002B" : "+",
    "U+002C" : ",",
    "U+002D" : "-",
    "U+002E" : ".",
    "U+002F" : "/",
    "U+0030" : "0",
    "U+0031" : "1",
    "U+0032" : "2",
    "U+0033" : "3",
    "U+0034" : "4",
    "U+0035" : "5",
    "U+0036" : "6",
    "U+0037" : "7",
    "U+0038" : "8",
    "U+0039" : "9",
    "U+003A" : ":",
    "U+003B" : ";",
    "U+003C" : "<",
    "U+003D" : "=",
    "U+003E" : ">",
    "U+003F" : "?",
    "U+0040" : "@",
    "U+0041" : "a",
    "U+0042" : "b",
    "U+0043" : "c",
    "U+0044" : "d",
    "U+0045" : "e",
    "U+0046" : "f",
    "U+0047" : "g",
    "U+0048" : "h",
    "U+0049" : "i",
    "U+004A" : "j",
    "U+004B" : "k",
    "U+004C" : "l",
    "U+004D" : "m",
    "U+004E" : "n",
    "U+004F" : "o",
    "U+0050" : "p",
    "U+0051" : "q",
    "U+0052" : "r",
    "U+0053" : "s",
    "U+0054" : "t",
    "U+0055" : "u",
    "U+0056" : "v",
    "U+0057" : "w",
    "U+0058" : "x",
    "U+0059" : "y",
    "U+005A" : "z",
    "U+005B" : "[",
    "U+005C" : "\\",
    "U+005D" : "]",
    "U+005E" : "^",
    "U+005F" : "_",
    "U+0060" : "`",
    "U+007B" : "{",
    "U+007C" : "|",
    "U+007D" : "}",
    "U+007F" : "Delete",
/* unsupported  
    "U+00A1" : "RevExcl",
    "U+0300" : "CombGrave",
    "U+0300" : "CombAcute",
    "U+0302" : "CombCircum",
    "U+0303" : "CombTilde",
    "U+0304" : "CombMacron",
    "U+0306" : "CombBreve",
    "U+0307" : "CombDot",
    "U+0308" : "CombDiaer",
    "U+030A" : "CombRing",
    "U+030B" : "CombDblAcute",
    "U+030C" : "CombCaron",
    "U+0327" : "CombCedilla",
    "U+0328" : "CombOgonek",
    "U+0345" : "CombYpogeg",
    "U+20AC" : "Euro",
    "U+3099" : "CombVoice",
    "U+309A" : "CombSVoice",
*/
}

var KeyMatcher = function(){
	const KEY_COLLATION = "qwert";
	const WAIT_TIME = 1000;
		
	var inputKeyStack = "";
	var beforeTime = new Date();
		
	var collation = function(key){
		var now = new Date();
		
		var agree = false, complete = false;
		
		if ((now - beforeTime) < WAIT_TIME) {
			var code = inputKeyStack + key;
			var min = Math.min(code.length, KEY_COLLATION.length);
			agree = code.slice(0, min) === KEY_COLLATION.slice(0, min);
			complete = min === KEY_COLLATION.length;
			
			if (agree)
				inputKeyStack = code;
			else
				inputKeyStack = "";
		} else {
			inputKeyStack = key;
		}
		beforeTime = now;
		
		console.log('stack:' + inputKeyStack);

		return agree && complete;
	}
	
	return {
		collation : collation
	}
}();


function keydownHandler(evt) {
	var key = keyId[evt.keyIdentifier] || evt.keyIdentifier,
	ctrl = evt.ctrlKey ? 'C-' : '',
	meta = (evt.metaKey || evt.altKey) ? 'M-' : '',
    shift = evt.shiftKey ? 'S-' : '';
	console.log('keyCode:' + evt.keyCode + ', keyIdentifier:' + evt.keyIdentifier + ', key:' + key);
}

function keyupHandler(evt) {
	var key = keyId[evt.keyIdentifier] || evt.keyIdentifier;
	
	if (key.match(/^\w{1}$/)) {
		if (KeyMatcher.collation(key))
			BookmarkSearch.show();
//			showForm();
	} else if (key === "Esc") {
		BookmarkSearch.hide();
//		hideForm();
	}
}


document.addEventListener('keydown', keydownHandler, false);
document.addEventListener('keyup', keyupHandler, false);
