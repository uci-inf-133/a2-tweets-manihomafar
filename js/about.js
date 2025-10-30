function parseTweets(runkeeper_tweets) {
	//Do not proceed if no tweets loaded
	if(runkeeper_tweets === undefined) {
		window.alert('No tweets returned');
		return;
	}

	tweet_array = runkeeper_tweets.map(function(tweet) {
		return new Tweet(tweet.text, tweet.created_at);
	});

	var date_array = tweet_array.map(tweet => tweet.time.getTime());
	var first = new Date(Math.min(...date_array));
	var last = new Date(Math.max(...date_array));
	var first_string = first.toLocaleDateString('en-us', { weekday:'long', year:'numeric', month:'long', day:'numeric' });
	var last_string = last.toLocaleDateString('en-us', { weekday:'long', year:'numeric', month:'long', day:'numeric' });

	var completed_array = tweet_array.filter(tweet => tweet.source == "completed_event");
	var completed_pct = (completed_array.length/tweet_array.length*100).toFixed(2);
	var achievement_array = tweet_array.filter(tweet => tweet.source == "achievement");
	var achievement_pct = (achievement_array.length/tweet_array.length*100).toFixed(2);
	var live_array = tweet_array.filter(tweet => tweet.source == "live_event");
	var live_pct = (live_array.length/tweet_array.length*100).toFixed(2);
	var misc_array = tweet_array.filter(tweet => tweet.source == "miscellaneous");
	var misc_pct = (misc_array.length/tweet_array.length*100).toFixed(2);
	var written_array = tweet_array.filter(tweet => tweet.written);
	var written_pct = (written_array.length/completed_array.length*100).toFixed(2);

	
	//This line modifies the DOM, searching for the tag with the numberTweets ID and updating the text.
	//It works correctly, your task is to update the text of the other tags in the HTML file!
	document.getElementById('numberTweets').innerText = tweet_array.length;
	document.getElementById('firstDate').innerText = first_string;
	document.getElementById('lastDate').innerText = last_string;	
	document.getElementsByClassName('completedEvents')[0].innerText = completed_array.length;
	document.getElementsByClassName('completedEvents')[1].innerText = completed_array.length;
	document.getElementsByClassName('completedEventsPct')[0].innerText = completed_pct + "%";
	document.getElementsByClassName('liveEvents')[0].innerText = live_array.length;
	document.getElementsByClassName('liveEventsPct')[0].innerText = live_pct + "%";
	document.getElementsByClassName('achievements')[0].innerText = achievement_array.length;
	document.getElementsByClassName('achievementsPct')[0].innerText = achievement_pct + "%";
	document.getElementsByClassName('miscellaneous')[0].innerText = misc_array.length;
	document.getElementsByClassName('miscellaneousPct')[0].innerText = misc_pct + "%";
	document.getElementsByClassName('written')[0].innerText = written_array.length;
	document.getElementsByClassName('writtenPct')[0].innerText = written_pct + "%";
}

//Wait for the DOM to load
document.addEventListener('DOMContentLoaded', function (event) {
	loadSavedRunkeeperTweets().then(parseTweets);
});