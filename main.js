/* Code for the site */
$(function () {
    
    var NATION_FEED_URL = "http://www.nation.co.ke/latestrss.rss";
    var PROXY_URL = "http://proxy.99nth.com";

    var fetchURL = function ( url ) {
	// Triggers a GET request on the url.
	// Returns a jqXHR object

	var jqXHR = $.ajax({
	    url: PROXY_URL,
	    headers: { "Upstream-URL": url },
	    method: "GET",
	});

	return jqXHR;
    };

    var parseRSS = function( xml ) {
	// Parses rss xml returning a list of objects representing each entry

	var items = [];

	$(xml).find("item").each(function () {
	    var element = $(this);
	    var item = {
		"title": element.find("title").text(),
		"link": element.find("link").text(),
		"description": element.find("description"),
	    }

	    items.push(item);
	});

	return items;
    };
    
    var p = fetchURL(NATION_FEED_URL);
    console.log(p);

});
