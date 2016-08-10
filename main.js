/* Code for the site */
$(function () {
    
    var NATION_FEED_URL = "http://www.nation.co.ke/latestrss.rss";
    
    $.ajax({
	url: "http://proxy.99nth.com",
	headers: { "Upstream-URL": NATION_FEED_URL },
	method: "GET",
	success: function( data ) {
	    $(data).find('item').each(function () {
		var el = $(this);
		console.log(el.find("title").text());
	    });
	}
    });

    console.log("request made");

});
