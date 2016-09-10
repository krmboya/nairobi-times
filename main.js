/* Code for the site */
$(function () {
    "use strict";

    var PROXY_URL = "http://proxy.99nth.com";
    
    var NATION_LATEST_URL = "http://www.nation.co.ke/latestrss.rss";
    var NATION_POLITICS_URL = "http://www.nation.co.ke/news/politics/" + 
	"1064-1064-view-asFeed-gogm2d/index.xml";
    var NATION_BUSINESS_URL = "http://www.nation.co.ke/business/" + 
	"996-996-view-asFeed-35lsruz/index.xml";
    var STANDARD_SPORTS_URL = "http://www.standardmedia.co.ke/rss/sports.php";
    var STANDARD_WORLDNEWS_URL = "http://www.standardmedia.co.ke/rss/world.php";
    var NATION_TECH_URL = "http://www.nation.co.ke/business/Tech/" + 
	"1017288-1017288-view-asFeed-14e217wz/index.xml";

    var snippetTemplate = $(".recent-news .snippet");

    // Used to decode html encoded characters in feed
    var dummyTextArea = document.createElement("textarea");

    function decodeHtml(html) {
	dummyTextArea.innerHTML = html;
	return dummyTextArea.value;
    }

    var createSnippet = function ( newsItem ) {
	// Creates a template snippet for news item
	var newSnippet = snippetTemplate.clone();
	newSnippet.find("h3 a").text(newsItem["title"]);
	newSnippet.find("h3 a").attr("href", newsItem["link"]);
	newSnippet.find("p").text(newsItem["description"]);
	return newSnippet
    };

    var populateHero = function ( newsItem ){
	// Sets the hero news item
	var heroSection = $("section.hero");
	heroSection.find("h2").text(newsItem["title"]);
	heroSection.find("p").text(newsItem["description"]);
    };

    var topItems = function ( category, count ) {
	// Returns first count entries from feed category
	return feeds[category].slice(0, count);
    }

    // Construct the feeds object
    // Exposes an .add method that triggers an 'added' event
    var feeds = (function( obj ) {
	obj.add = function(category, feed) {
	    this[category] = feed;
	    this.trigger('feed.added', [category]);
	};
	return obj;
    })($({}))

    // Populate appropriate news category on loading it
    feeds.on("feed.added", function(e, category) {

	var domSection = $("#" + category + " ul");
	topItems(category, 5).forEach(function(newsItem) {
	    domSection.append(createSnippet(newsItem));
	});

	// if latest section, populate hero
	if (category === "politics") {
	    populateHero(topItems(category, 1)[0]);
	}
    });
    
    var sectionUrls = {
	"latest": NATION_LATEST_URL,
	"politics": NATION_POLITICS_URL,
	"business": NATION_BUSINESS_URL,
	"sports": STANDARD_SPORTS_URL,
	"world": STANDARD_WORLDNEWS_URL,
	"technology": NATION_TECH_URL
    }
    
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
		"title": decodeHtml(element.find("title").text()),
		"link": element.find("link").text(),
		"description": decodeHtml(element.find("description").text()),
	    }

	    items.push(item);
	});

	return items;
    };
    
    var setFeed = function ( category, url ) {
	// Fetches the feed from url and sets it as category

	var req = fetchURL(url);

	req.then( 
	    function( data ) {
		feeds.add(category, rssEntries(data));
	    },
	    function () {
		console.log("error encountered fetching feed");
	    });

    };

    // fetch each defined section
    for (var section in sectionUrls) {
	if(sectionUrls.hasOwnProperty(section)) {
	    setFeed(section, sectionUrls[section]);
	}
    }

});
