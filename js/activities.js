function parseTweets(runkeeper_tweets) {
	//Do not proceed if no tweets loaded
	if(runkeeper_tweets === undefined) {
		window.alert('No tweets returned');
		return;
	}
   
	tweet_array = runkeeper_tweets.map(function(tweet) {
		return new Tweet(tweet.text, tweet.created_at);
	});
 
	var complete_array = tweet_array.filter(tweet => tweet.source === "completed_event");
	var activityCounts = {};
	for(var element of complete_array){
		var act = element.activityType;
		var dist = element.distance;
		//if(dist == 0)continue;
		if(!activityCounts[act]){
			activityCounts[act] = {count: 0, totalDist: 0, averageDist: 0};
		}
		activityCounts[act].count++;
		activityCounts[act].totalDist += dist;
	}
	activitiesArray = [];
	for(var act in activityCounts){
		var actstats = activityCounts[act]
		actstats.averageDist = actstats.totalDist/actstats.count;
 
 
		activitiesArray.push({
			activity: act,
			count: actstats.count,
			averageDist: actstats.averageDist
		});
	}
	activitiesArray.sort((a, b) => b.count - a.count);
	var longest = activitiesArray[0];
	var shortest = activitiesArray[0];
	for(var i = 0; i < 3; i++){
		if(activitiesArray[i].averageDist > longest.averageDist){
			longest = activitiesArray[i]
		}
		if(activitiesArray[i].averageDist < shortest.averageDist){
			shortest = activitiesArray[i]
		}
	}
	var weekend_dist = 0;
	var weekend_count = 0;
	var weekday_dist = 0;
	var weekday_count = 0;

	var top3 = activitiesArray.slice(0, 3).map(act => act.activity);
	var topActs = complete_array.filter(tweet => top3.includes(tweet.activityType));
 
	for(var element of topActs){
		var dist = element.distance;
		if(dist == 0) continue;
		var day = element.time.getDay();
		if(day == 6 || day == 0){
			weekend_dist += dist;
			weekend_count++;
		}else{
			weekday_dist += dist;
			weekday_count++;
		}
	}
 
	var weekend_average = weekend_count > 0 ? weekend_dist/weekend_count : 0;
	var weekday_average = weekday_count > 0 ? weekday_dist/weekday_count : 0;
	var result = weekend_average>weekday_average ? "weekends" : "weekdays";
 
	//let res = activitiesArray.find(a => a.activity === "circuit");
 
	document.getElementById('numberActivities').innerText = activitiesArray.length;
	document.getElementById('firstMost').innerText = activitiesArray[0].activity;
	document.getElementById('secondMost').innerText = activitiesArray[1].activity;
	document.getElementById('thirdMost').innerText = activitiesArray[2].activity;
	document.getElementById('longestActivityType').innerText = longest.activity;
	document.getElementById('shortestActivityType').innerText = shortest.activity;
	document.getElementById('weekdayOrWeekendLonger').innerText = result;
	//document.getElementById('shortestActivityType').innerText = activitiesArray[12].activity;

 
	//TODO: create a new array or manipulate tweet_array to create a graph of the number of tweets containing each type of activity.
	activity_vis_spec = {
	  "$schema": "https://vega.github.io/schema/vega-lite/v5.json",
	  "description": "A graph of the number of Tweets containing each type of activity.",
	  "data": {
		"values": activitiesArray
	  },
	  //TODO: Add mark and encoding
	  "mark": "bar",
	  "encoding": {
		"x": {"field": "activity", "type": "nominal", "title": "Activity Type",  },
		"y": { "field": "count", "type": "quantitative", "title": "Number of Tweets"},
		"color": { "field": "activity", "type": "nominal", "legend": null }
	  }
	};
	vegaEmbed('#activityVis', activity_vis_spec, {actions:false});
 
 
	//TODO: create the visualizations which group the three most-tweeted activities by the day of the week.
	//Use those visualizations to answer the questions about which activities tended to be longest and when.
	
	// var top3 = activitiesArray.slice(0, 3).map(act => act.activity);
	// var topActs = complete_array.filter(tweet => top3.includes(tweet.activityType));
	var graphData = topActs.map(tweet => ({
		activity: tweet.activityType,
		distance: tweet.distance,
		day: tweet.time.toLocaleDateString("en-US", { weekday: "short" })
	}));
   
	var distance_vis_spec = {
		"$schema": "https://vega.github.io/schema/vega-lite/v5.json",
		"description": "Distances by day of the week for the top 3 activities.",
		"data": { "values": graphData },
		"mark": "point",
		"encoding": {
			"x": { "field": "day", "type": "nominal", "title": "time (day)", "sort": ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]},
			"y": { "field": "distance", "type": "quantitative", "title": "distance"},
			"color": { "field": "activity", "type": "nominal", "title": "Activity Type" }
		}
	};
   
	var distance_mean_vis_spec = {
		"$schema": "https://vega.github.io/schema/vega-lite/v5.json",
		"description": "Mean distance by day of week for the top 3 activities.",
		"data": { "values": graphData },
		"mark": "point",
		"encoding": {
			"x": { "field": "day", "type": "nominal", "title": "time (day)", "sort": ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]},
			"y": {
			"aggregate": "mean",
			"field": "distance",
			"type": "quantitative",
			"title": "Mean of distance"
			},
			"color": { "field": "activity", "type": "nominal", "title": "Activity Type" }
		}
	};
 
 	var show_aggregate = false;
	var button = document.getElementById("aggregate");
 
	function changeGraph() {
		if (show_aggregate) {
			vegaEmbed("#distanceVis", distance_mean_vis_spec, { actions: false });
			button.innerText = "Show all activities";
			show_aggregate = false;
		} else {
			vegaEmbed("#distanceVis", distance_vis_spec, { actions: false });
			button.innerText = "Show means";
			show_aggregate = true;
		}
	}
 
	button.addEventListener("click", changeGraph);
	changeGraph();
 }
 
 //Wait for the DOM to load
 document.addEventListener('DOMContentLoaded', function (event) {
	loadSavedRunkeeperTweets().then(parseTweets);
 });
 