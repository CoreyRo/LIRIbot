var app={
	task: process.argv[2],
	a: process.argv[3],
	b: process.argv[4],
	all: process.argv

}

switch(app.task){
	case "my-tweets":
	twitterCall(app.a,app.b)
	;
	break;
	case "spotify-this-song":

	;
	break;
	case "movie-this":
	omdbCall(app.a,app.b,app.all)
	;
	break;
	case "do-what-it-says":

	;
	break;
	case "test":
	test(app.task, app.a, app.b);
	break;
}


function twitterCall(a,b){
	var Twitter = require('twitter');
	var inc = 1
	var client = new Twitter({
	  consumer_key: "5UnjRgblnzgIfGcW66Vf9ClvC",
	  consumer_secret: "X3D3jpRqQlQXgLkPeWf9NozPPusiKQxFXb2HwmMOCOegOfLxGs",
	  access_token_key: "898352648578977793-OVmlyZmMOJGdLsP0E7r6gSRN8si389p",
	  access_token_secret: "h3jnBzXx1alNv3iaKNlxsVKDQ0AKiPAqBsJuKmLY6uH0B"
	});
	
	var params = {screen_name: a,
				  count: "10"

	};
	client.get('statuses/user_timeline', params, function(error, tweets, response) {
	  if (error) {
	    return console.log(error);
	  }
	  for (var i = tweets.length - 1; i >= 0; i--) {
	  	console.log("Tweet Number: " + inc);
	  	console.log("==================================================");
	  	console.log("@" + tweets[i].user.screen_name);
	  	console.log(tweets[i].text);
	  	console.log("==================================================");
	  	console.log(" ");
	  	inc ++;
	  }

	 
	});
}

function omdbCall(a,b, all){
	var request = require("request");
	var movieName = [];
	var movieNameLong = [];
	console.log(all.length)
	if(all.length === 4){
		movieName = all[3].toLowerCase();
		console.log("Single Word Title: " + true);
	}
	else{
		for (var i = 3; i < all.length; i++) {
			
			movieNameLong.push(all[i]);
			
		}
		
		var movieName = movieNameLong.toString().replace(/,/g , "+").toLowerCase();
		
		
	}	
	var movieTitle = movieName.replace(/\+/g,' ').toUpperCase();
	console.log("Movie Name: " + movieTitle)
	var queryUrl = "http://www.omdbapi.com/?t=" + a + "&y=&plot=short&apikey=40e9cece";
	request(queryUrl, function(error, response, body) {

	  if (!error && response.statusCode === 200) {
	    console.log("Release Year: " + JSON.parse(body).Year);
	  }
	});
}

function test(task,a,b){
	console.log(task);
	console.log(a);
	console.log(b);
}