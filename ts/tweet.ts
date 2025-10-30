class Tweet {
	private text:string;
	time:Date;

	constructor(tweet_text:string, tweet_time:string) {
        this.text = tweet_text;
		this.time = new Date(tweet_time);//, "ddd MMM D HH:mm:ss Z YYYY"
	}

	//returns either 'live_event', 'achievement', 'completed_event', or 'miscellaneous'
    get source():string {
        //TODO: identify whether the source is a live event, an achievement, a completed event, or miscellaneous.
        if(this.text.startsWith("Just completed")){return "completed_event";}
        if(this.text.startsWith("Just posted")){return "completed_event";}
        if(this.text.startsWith("Achieved")){return "achievement";}
        if(this.text.includes("I just set a goal")){return "achievement";}
        if(this.text.includes("@Runkeeper Live")){return "live_event";}
        return "miscellaneous";
    }

    //returns a boolean, whether the text includes any content written by the person tweeting.
    get written():boolean {
        //TODO: identify whether the tweet is written
        if(this.text.includes(" - ")){return true;}
        return false;
    }

    get writtenText():string {
        if(!this.written) {
            return "";
        }
        //TODO: parse the written text from the tweet
        var dash_i = this.text.indexOf(" - ");
        var url_i = this.text.indexOf("https");
        if(dash_i != -1 && url_i != -1 && dash_i < url_i){
            return this.text.slice(dash_i + 3, url_i)
        }
        return "";
    }
    

    get activityType():string {
        if (this.source != 'completed_event') {
            return "unknown";
        }
        //TODO: parse the activity type from the text of the tweet
        var km_index = this.text.indexOf(" km ");
        var mi_index = this.text.indexOf(" mi ");
        if(km_index != -1 && mi_index != - 1){
            var unit = km_index < mi_index ? "km" : "mi";
        }
        else if (km_index != -1){var unit = "km";}
        else if (mi_index != -1){var unit = "mi";}
        else{
            var unit = "n/a";
        }

        if(unit != "n/a"){
            var start_index = unit == "km" ? km_index : mi_index;
            if(this.written){
                var end_index = this.text.indexOf("-");
                var activity = this.text.slice(start_index + 4, end_index - 1);
            }else{
                var end_index = this.text.indexOf("with");
                var activity = this.text.slice(start_index + 4, end_index - 1);
            }
        }else{
            var start_index = this.text.indexOf(" posted a ");
            if(start_index != -1){
                var end_index = this.text.indexOf(" in ");
                var activity = this.text.slice(start_index + 10, end_index);
            }else{
                start_index = this.text.indexOf(" posted an ");
                var end_index = this.text.indexOf(" in ");
                var activity = this.text.slice(start_index + 11, end_index);
            }
        }
        return activity;
    }

    get distance():number {
        if(this.source != 'completed_event') {
            return 0;
        }
        //TODO: prase the distance from the text of the tweet
        var km_index = this.text.indexOf(" km ");
        var mi_index = this.text.indexOf(" mi ");
        if(km_index != -1 && mi_index != - 1){
            if(km_index < mi_index){
                var unit = "km";
            }else{
                var unit = "mi";
            }
        }
        else if (km_index != - 1){var unit = "km";}
        else if (mi_index != -1){var unit = "mi";}
        else{
            var unit = "n/a";
        }
        if(unit != "n/a"){
            var words = this.text.split(unit)[0];
            var words_trm = words.trim();
            var word_array = words_trm.split(" ");
            var len = word_array.length;
            var dist = word_array[len-1];
            if(unit == "km"){
                return Number(dist)/1.609
            }
            return Number(dist);
        }
        return 0;
    }

    getHTMLTableRow(rowNumber:number):string {
        //TODO: return a table row which summarizes the tweet with a clickable link to the RunKeeper activity
        if (this.source !== "completed_event") {
            return "";
        }

        var clickableText = this.text;
        var start_index = 0;

        while(true){
            var url_start = clickableText.indexOf("https://", start_index);
            if(url_start == -1){
                break;
            }

            var url_end = clickableText.indexOf(" ", url_start);
            if(url_end != -1){
                var link = clickableText.slice(url_start,url_end);
            } else{
                var link = clickableText.slice(url_start, clickableText.length);
            }
            var html_link = "<a href=\"" + link + "\">" + link + "</a>";
            clickableText = clickableText.slice(0,url_start) +  html_link + clickableText.slice(url_end);
            start_index = url_start + html_link.length;
        }
        
        return(
            "<tr>"+
                "<td>" + rowNumber + "</td>" +
                "<td>" + this.activityType + "</td>" +
                "<td>" + clickableText + "</td>" +
            "</tr>"
        );
    }
}