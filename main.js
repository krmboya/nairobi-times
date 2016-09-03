/* Code for the site */
$(function () {
    "use strict";
    
    var NATION_LATEST_URL = "http://www.nation.co.ke/latestrss.rss";
    var NATION_POLITICS_URL = "http://www.nation.co.ke/news/politics/" + 
	"1064-1064-view-asFeed-gogm2d/index.xml";
    var NATION_BUSINESS_URL = "http://www.nation.co.ke/business/" + 
	"996-996-view-asFeed-35lsruz/index.xml";
    var STANDARD_SPORTS_URL = "www.standardmedia.co.ke/rss/sports.php";
    var STANDARD_WORLDNEWS_URL = "http://www.standardmedia.co.ke/rss/world.php";
    var NATION_TECH_URL = "http://www.nation.co.ke/business/Tech/" + 
	"1017288-1017288-view-asFeed-14e217wz/index.xml";

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
