var app={
	task: process.argv[2],
	a: process.argv[3],
	b: process.argv[4]

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
	 
	var client = new Twitter({
	  consumer_key: "5UnjRgblnzgIfGcW66Vf9ClvC",
	  consumer_secret: "X3D3jpRqQlQXgLkPeWf9NozPPusiKQxFXb2HwmMOCOegOfLxGs",
	  access_token_key: "898352648578977793-OVmlyZmMOJGdLsP0E7r6gSRN8si389p",
	  access_token_secret: "h3jnBzXx1alNv3iaKNlxsVKDQ0AKiPAqBsJuKmLY6uH0B"
	});
	
	var params = {screen_name: a,
				  count: "1"

	};
	client.get('statuses/user_timeline', params, function(error, tweets, response) {
	  if (error) {
	    return console.log(error);
	  }
	  console.log(tweets[0].text);
	  // console.log(response);
	});
}

function omdbCall(a,b){
	var request = require("request");
	var movieName = process.argv[2];
	var queryUrl = "http://www.omdbapi.com/?t=" + movieName + "&y=&plot=short&apikey=40e9cece";
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