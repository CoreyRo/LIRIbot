//**************************************************
//LIRIBOT
//Lifelike specific data collector.
//Basically Skynet
//Type 'node liribot.js info' in the terminal for a list of commands
//
//By Corey Rodems
//**************************************************
var app = {
	task: process.argv[2],
	a: process.argv[3],
	all: process.argv,
	//Spotify Function
	getSpot: function(task, a, all) {
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
		}, function(err, data) {
			if (err) {
				return console.log('Error occurred: ' + err);
			}
			for (var i = 0; i < 10; i++) {
				console.log("Response Number: " + incr);
				console.log("SEARCHED SONG: " + name.toUpperCase());
				console.log("==================================================");
				console.log("ARTIST: " + data.tracks.items[i].artists[0].name);
				console.log("SONG NAME: " + data.tracks.items[i].name);
				console.log("ALBUM NAME: " + data.tracks.items[i].album.name);
				console.log("PREVIEW LINK" + data.tracks.items[i].preview_url);
				console.log("==================================================");
				console.log(" ");
				incr++;
			}
			app.logOutputs(data.items);
		});
	},
	getTwit: function(task, a, all) {
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
			client.get('statuses/user_timeline', params, function(error, tweets, response) {
				if (error) {
					return console.log(error);
				}
				for (var i = tweets.length - 1; i >= 0; i--) {
					console.log("Tweet Number: " + inc++);
					console.log("==================================================");
					console.log("Username: @" + tweets[i].user.screen_name);
					app.wordWrap(75, tweets[i].text);
					var twt = app.getForm();
					console.log("Tweet: " + twt);
					console.log("==================================================");
					console.log(" ");
				}
				app.logOutputs(tweets);
			});
		}
		app.logInputs(task, a);
	},
	getMovie: function(task, a, all) {
		var request = require("request");
		var name = "";
		app.makeName(a, all);
		
		if (app.getName() === "noname") {
			name = "Mr+Nobody";
		}
		else {
			name = app.getName();
		}
		
		var queryUrl = "http://www.omdbapi.com/?t=" + name + "&y=&plot=short&apikey=40e9cece";
		request(queryUrl, function(error, response, body) {
			if (!error && response.statusCode === 200) {
				//OMDB OUTPUT 
				if (JSON.parse(body).Response === "false") {
					return console.log("Error: " + JSON.parse(body).Error);
				}
				else if(!JSON.parse(body).Response === "false") {
					app.logOutputs(response);
					app.logInputs(task, app.getName().replace(/\+/g, ' '));
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
					app.wordWrap(75, JSON.parse(body).Plot);
					var plot = app.getForm();
					console.log("Plot: " + plot);
					console.log(" ");
					console.log("**********************Ratings!********************");
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
				else{
					console.log(JSON.parse(body).Error + "\n" + name);
				}
			}
		});
	},
	//reads txt file, picks random task/search and runs it
	readTxt: function() {
		var fs = require("fs");
		var incr = 0;
		fs.readFile("random.txt", "utf8", function(err, data) {
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
			app.switching(pickedArr[2], pickedArr[3], pickedArr, app.getSpot, app.getTwit, app.getMovie);
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
	makeName: function(a, all) {
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
		//closure to get the formatted text back
		this.getName = function() {
			return endName;
		}
	},
	//logs user inputs
	logInputs: function(task, value) {
		var fs = require("fs");
		fs.appendFile("random.txt", task + "," + value + ";", function(err) {
			if (err) {
				return console.log(err);
			}
			console.log("random.txt was updated!");
		});
	},
	//logs response outputs
	logOutputs: function(response) {
		var fs = require("fs");
		fs.appendFile("log.txt", "<START>" + JSON.stringify(response) + "<END>", function(err) {
			if (err) {
				return console.log(err);
			}
			console.log("log.txt was updated!");
		});
	},
	//tests keys
	testFunc: function(task) {
		console.log("======================" + task.toUpperCase() + "======================");
		console.log("process.env.TWITTER_CONSUMER_KEY " + process.env.TWITTER_CONSUMER_KEY);
		console.log("process.env.TWITTER_CONSUMER_SECRET " + process.env.TWITTER_CONSUMER_SECRET);
		console.log("process.env.TWITTER_ACCESS_TOKEN_KEY " + process.env.TWITTER_ACCESS_TOKEN_KEY);
		console.log("process.env.TWITTER_ACCESS_TOKEN_SECRET " + process.env.TWITTER_ACCESS_TOKEN_SECRET);
	},
	//checks the argv2 or the txt for the task
	switching: function(task, a, all, spotify, twitter, movie, read, reset, info) {
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
			case "reset":
				reset();
				break;
			case "info":
				info();
				break;
		}
	},
	//runs switch
	main: function() {
		app.switching(app.task, app.a, app.all, app.getSpot, app.getTwit, app.getMovie, app.readTxt, app.reset, app.info)
	},
	//resets the random.txt file that holds all inputs
	reset: function() {
		console.log("============WARNING!==============================")
		console.log("=====================WARNING!=====================")
		console.log("==============================WARNING!============")
		var inquirer = require("inquirer");
		inquirer
			.prompt([{
				type: "confirm",
				message: "This will reset the Random.txt file! Are you sure?:",
				name: "confirm",
				default: true
			}])
			.then(function(inquirerResponse) {
				if (inquirerResponse.confirm) {
					var fs = require("fs");
					fs.writeFile("random.txt", "spotify-this-song,I Want it That Way;", function(err) {
						if (err) {
							return console.log(err);
						}
						console.log("Random.txt was reset!");
					});
				}
				else {
					console.log("Random.txt reset aborted!");
				}
			});
	},
	info: function() {
		console.log("======================INFO========================")
		console.log("The commands are:");
		console.log(" ");
		console.log("my-tweets");
		console.log("'my-tweets unsername' will bring back a list of recent tweets for that user");
		console.log(" ");
		console.log("movie-this");
		console.log("'movie-this move name' will bring back info for that movie");
		console.log(" ");
		console.log("spotify-this-song");
		console.log("'spotify-this-song song name' will bring back a list of songs with that name and similar names");
		console.log(" ");
		console.log("do-what-it-says");
		console.log("'do-what-it-says' will pick a random action from the history log");
		console.log(" ");
		console.log("reset");
		console.log("'reset' will reset the history log");
		console.log(" ");
		console.log("test");
		console.log("'test' will test your process.env keys");
	},
	//Wraps the text within my app so it looks nice
	wordWrap: function(WRAP_SIZE, wordWrap) {
		var format;
		var word;
		var line;
		format = "";
		line = "";
		word = "";
		for (var i = 0; i < wordWrap.length; i++) {
			if (wordWrap[i] !== " ") {
				word = word + wordWrap[i];
			}
			else {
				if (line.length + word.length > WRAP_SIZE) {
					format = format + line + '\n\t';
					line = '';
				}
				line = line + word + " ";
				word = '';
			}
		}
		if (line.length + word.length < WRAP_SIZE) {
			format = format + line + word;
		}
		else {
			format = format + line + '\n' + word;
		}
		//closure to get the formatted text back
		this.getForm = function() {
			return format;
		}
		return format;
	}
}
//runs the code
app.main();