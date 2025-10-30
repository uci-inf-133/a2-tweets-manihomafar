let tweet_array = [];
let written_array = [];

function parseTweets(runkeeper_tweets) {
	//Do not proceed if no tweets loaded
	if(runkeeper_tweets === undefined) {
		window.alert('No tweets returned');
		return;
	}

	//TODO: Filter to just the written tweets
	tweet_array = runkeeper_tweets.map(function(tweet) {
		return new Tweet(tweet.text, tweet.created_at);
	});

	written_array = tweet_array.filter(tweet => tweet.written == true);
}

function addEventHandlerForSearch() {
	//TODO: Search the written tweets as text is entered into the search box, and add them to the table
	document.getElementById('searchCount').innerText = 0;
	document.getElementById('searchText').innerText = "";

	var search_field = document.getElementById('textFilter');

	search_field.addEventListener('input', function () {
		var search = search_field.value.toLowerCase();

		if (search == "") {
			document.getElementById('tweetTable').innerHTML = "";
			document.getElementById('searchCount').innerText = "0";
			document.getElementById('searchText').innerText = "";
			return;
		}

		var res = written_array.filter(tweet => tweet.text.toLowerCase().includes(search));
		document.getElementById('searchCount').innerText = res.length;
		document.getElementById('searchText').innerText = search;

		var html = "";
		for (var i = 0; i < res.length; i++) {
			html += res[i].getHTMLTableRow(i + 1);
		}
		document.getElementById('tweetTable').innerHTML = html;
	});
}

//Wait for the DOM to load
document.addEventListener('DOMContentLoaded', function (event) {
	addEventHandlerForSearch();
	loadSavedRunkeeperTweets().then(parseTweets);
});