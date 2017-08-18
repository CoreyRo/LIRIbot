var app = {
	task: process.argv[2],
	a: process.argv[3],
	all: process.argv
}
switch (app.task) {
case "my-tweets":
	twitterCall(app.a);
	break;
case "spotify-this-song":
	;
	break;
case "movie-this":
	omdbCall(app.a, app.all);
	break;
case "do-what-it-says":
	;
	break;
case "test":
	test(app.task);
	break;
}

function twitterCall(a) {
	var Twitter = require('twitter');
	var inc = 1
	var client = new Twitter({
		consumer_key: process.env.TWITTER_CONSUMER_KEY,
		consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
		access_token_key: process.env.TWITTER_ACCESS_TOKEN_KEY,
		access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET
	});
	var params = {
		screen_name: a,
		count: "20"
	};
	client.get('statuses/user_timeline', params, function (error, tweets, response) {
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
			inc++;
		}
	});
}
//OMDB Function
function omdbCall(a, all) {
	var request = require("request");
	var movieName = [];
	var movieNameLong = [];
	//if no movie name entered
	if (!all[3]) {
		movieName = "Mr+Nobody";
	}
	//if movie name is one word
	else if (all.length === 4) {
		movieName = all[3].toLowerCase();
	}
	//if movie name is multiple words
	else {
		for (var i = 3; i < all.length; i++) {
			movieNameLong.push(all[i]);
		}
		var movieName = movieNameLong.toString().replace(/,/g, "+").toLowerCase();
	}
	var queryUrl = "http://www.omdbapi.com/?t=" + movieName + "&y=&plot=short&apikey=40e9cece";
	request(queryUrl, function (error, response, body) {
		if (!error && response.statusCode === 200) {
			//OMDB OUTPUT 
			console.log("__________________________________________________");
			console.log("Title: " + JSON.parse(body).Title);
			console.log(" ");
			console.log("Rated: " + JSON.parse(body).Rated);
			console.log("Runtime: " + JSON.parse(body).Runtime);
			console.log("Release Year: " + JSON.parse(body).Year);
			console.log("==================================================");
			console.log("Director: " + JSON.parse(body).Director);
			console.log("Writers: " + JSON.parse(body).Writer);
			console.log("Cast: " + JSON.parse(body).Actors);
			console.log(" ");
			console.log("Plot: " + JSON.parse(body).Plot);
			console.log(" ");
			console.log("**********************Ratings!********************");
			for (var i = 0; i < JSON.parse(body).Ratings.length; i++) {
				console.log(JSON.parse(body).Ratings[i].Source);
				console.log(JSON.parse(body).Ratings[i].Value);
			}
		}
	});
}

//test function, to make sure nodejs, js, and keys are working
function test(task) {
	console.log("======================" + task.toUpperCase() + "======================");
	console.log("process.env.TWITTER_CONSUMER_KEY " + process.env.TWITTER_CONSUMER_KEY);
	console.log("process.env.TWITTER_CONSUMER_SECRET " + process.env.TWITTER_CONSUMER_SECRET);
	console.log("process.env.TWITTER_ACCESS_TOKEN_KEY " + process.env.TWITTER_ACCESS_TOKEN_KEY);
	console.log("process.env.TWITTER_ACCESS_TOKEN_SECRET " + process.env.TWITTER_ACCESS_TOKEN_SECRET);
}