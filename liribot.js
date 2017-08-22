//**************************************************
//LIRIBOT
//Lifelike specific data collector.
//Basically Skynet
//By Corey Rodems
//**************************************************
var app = {
	task: process.argv[2],
	a: process.argv[3],
	all: process.argv,
	//Spotify Function
	getSpot: function (task, a, all) {
		var Spotify = require('node-spotify-api');
		var name = "";
		var incr = 1;
		var spotify = new Spotify({
			id: process.env.SPOTIFY_ID,
			secret: process.env.SPOTIFY_SECRET
		});
		app.makeName(a, all);
		if (app.getName() === "noname") {
			name = '"' + "HELP!" + '"';
		}
		else {
			name = '"' + app.getName().replace(/\+/g, ' ') + '"';
		}
		app.logInputs(task, name.replace(/['"]+/g, ''));
		spotify.search({
			type: 'track',
			query: '"' + name + '"'
		}, function (err, data) {
			if (err) {
				return console.log('Error occurred: ' + err);
			}
			for (var i = 0; i < 10; i++) {
				console.log("Resonse Number: " + incr);
				console.log("SEARCHED SONG: " + name);
				console.log("==================================================");
				console.log("ARTIST: " + data.tracks.items[i].artists[0].name);
				console.log("SONG NAME: " + data.tracks.items[i].name);
				console.log("PREVIEW LINK" + data.tracks.items[i].preview_url);
				console.log("==================================================");
				console.log(" ");
				incr++;
			}
			app.logOutputs(data.items);
		});
	},
	getTwit: function (task, a, all) {
		if (a === "" || a === 'undefined') {
			a = "cro____";
		}
		else {
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
				app.logOutputs(tweets);
			});
		}
		app.logInputs(task, a);
	},
	getMovie: function (task, a, all) {
		var request = require("request");
		var name = "";
		app.makeName(a, all);
		app.logInputs(task, app.getName().replace(/\+/g, ' '));
		if (app.getName() === "noname") {
			name = "Mr+Nobody";
		}
		else {
			name = app.getName();
		}
		var queryUrl = "http://www.omdbapi.com/?t=" + name + "&y=&plot=short&apikey=40e9cece";
		request(queryUrl, function (error, response, body) {
			if (!error && response.statusCode === 200) {
				//OMDB OUTPUT 
				if (JSON.parse(body).Response === "false") {
					return console.log("Error: " + JSON.parse(body).Error);
				}
				else {
					app.logOutputs(response);
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
					console.log(JSON.parse(body).Ratings.length)
					if (JSON.parse(body).Ratings.length > 0) {
						for (var i = 0; i < JSON.parse(body).Ratings.length; i++) {
							console.log(JSON.parse(body).Ratings[i].Source);
							console.log(JSON.parse(body).Ratings[i].Value);
						}
					}
					else {
						console.log(JSON.parse(body).imdbRating);
					}
				}
			}
		});
	},
	//reads txt file, picks random task/search and runs it
	readTxt: function () {
		var fs = require("fs");
		var incr = 0;
		fs.readFile("random.txt", "utf8", function (err, data) {
			if (err) {
				return console.log(err);
			}
			var output = data.split(";");
			for (var i = 0; i < output.length; i++) {
				// console.log(output[i].replace(/\,/g, ' '))
			}
			//Gets a random pair in the random.txt, then reads it and puts it thru the switch
			var randomNum = Math.floor(Math.random() * output.length);
			var picked = output[randomNum].trim();
			var pickedArr = ["", ""];
			var pickedSplit = picked.split(",")
			pickedArr.push(pickedSplit[0]);
			pickedArr.push(pickedSplit[1]);
			console.log(pickedArr);
			switching(pickedArr[2], pickedArr[3], pickedArr, app.getSpot, app.getTwit, app.getMovie);
			console.log(" ");
			console.log("===================RANDOM=PICK====================");
			console.log("TASK: " + pickedArr[2]);
			console.log("VALUE: " + pickedArr[3]);
			console.log("==================================================");
			console.log(" ");
			console.log(" ");
			console.log(" ");
		});
	},
	//makes names out of argv array for music/movies
	makeName: function (a, all) {
		var endName = [];
		var NameLong = [];
		if (!all[3] || all[3] === 'undefined') {
			endName = "noname";
		}
		else if (all.length === 4) {
			endName = all[3].toLowerCase();
		}
		else {
			for (var i = 3; i < all.length; i++) {
				NameLong.push(all[i]);
			}
			var endName = NameLong.toString().replace(/,/g, "+").toLowerCase();
		}
		this.getName = function () {
			return endName;
		}
	},
	//logs user inputs
	logInputs: function (task, value) {
		var fs = require("fs");
		fs.appendFile("random.txt", task + "," + value + ";", function (err) {
			if (err) {
				return console.log(err);
			}
			console.log("random.txt was updated!");
		});
	},
	//logs response outputs
	logOutputs: function (response) {
		var fs = require("fs");
		fs.appendFile("log.txt", "<START>" + JSON.stringify(response) + "<END>", function (err) {
			if (err) {
				return console.log(err);
			}
			console.log("log.txt was updated!");
		});
	},
	//tests keys
	testFunc: function (task) {
		console.log("======================" + task.toUpperCase() + "======================");
		console.log("process.env.TWITTER_CONSUMER_KEY " + process.env.TWITTER_CONSUMER_KEY);
		console.log("process.env.TWITTER_CONSUMER_SECRET " + process.env.TWITTER_CONSUMER_SECRET);
		console.log("process.env.TWITTER_ACCESS_TOKEN_KEY " + process.env.TWITTER_ACCESS_TOKEN_KEY);
		console.log("process.env.TWITTER_ACCESS_TOKEN_SECRET " + process.env.TWITTER_ACCESS_TOKEN_SECRET);
	}
}
switching(app.task, app.a, app.all, app.getSpot, app.getTwit, app.getMovie, app.readTxt)
//Runs the function assigned to the string
function switching(task, a, all, spotify, twitter, movie, read) {
	switch (task) {
	case "my-tweets":
		twitter(task, a);
		break;
	case "spotify-this-song":
		spotify(task, a, all);
		break;
	case "movie-this":
		movie(task, a, all);
		break;
	case "do-what-it-says":
		read(task, a, all);;
		break;
	case "test":
		test(task);
		break;
	}
}