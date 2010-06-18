// regist onResult as message passing
chrome.extension.onRequest.addListener(onRequest);

function onRequest(request, sender, callback) {
	if (request.action == 'fetchBookmarks')
		getBookmarks(request.query, callback);
}


function getBookmarks(query, callback) {
	chrome.bookmarks.search(query, function(bookmarks){
		callback({
			bookmarks: bookmarks,
			query: query
		});
	})
}