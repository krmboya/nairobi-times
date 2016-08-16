/* Code for the site */
$(function () {
    "use strict";
    
    var NATION_FEED_URL = "http://www.nation.co.ke/latestrss.rss";
    var PROXY_URL = "http://proxy.99nth.com";

    var feeds = {}

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

    var rssEntries = function( xml ) {
	// Returns entries retrieved from RSS xml

	var items = [];

	$(xml).find("item").each(function () {
	    var element = $(this);
	    var item = {
		"title": element.find("title").text(),
		"link": element.find("link").text(),
		"description": element.find("description").text(),
	    }

	    items.push(item);
	});

	return items;
    };
    
    var setFeed = function ( category, url ) {

	var req = fetchURL(NATION_FEED_URL);

	req.then( 
	    function( data ) {
		feeds[category] = rssEntries(data);
		console.log(feeds);
	    },
	    function () {
		console.log("error encountered fetching feed");
	    });

    };

    setFeed("nation", NATION_FEED_URL);
});
