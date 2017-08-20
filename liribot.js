//**************************************************
//LIRIBOT
//Lifelike specific data collector.
//Basically Skynet
//By Corey Rodems
//**************************************************
var app = {
    task: process.argv[2],
    a: process.argv[3],
    all: process.argv
}
switching(app.task, app.a, app.all)
//Runs the function assigned to the string
function switching(task, a, all) {
    switch (task) {
        case "my-tweets":
            twitterCall(task, a);
            break;
        case "spotify-this-song":
            ;
            break;
        case "movie-this":
            omdbCall(task, a, all);
            break;
        case "do-what-it-says":
            readTxt(task, a, all);;
            break;
        case "test":
            test(task);
            break;
    }
}
//Twitter function: gets tweets
function twitterCall(task, a) {
    if (a === "") {
        a = "cro____";
    } else {
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
    logInputs(task, a);
}
//OMDB Function: Gets a movie's details
function omdbCall(task, a, all) {
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
    logInputs(task, movieName.replace(/\+/g, ' '));
    var queryUrl = "http://www.omdbapi.com/?t=" + movieName + "&y=&plot=short&apikey=40e9cece";
    request(queryUrl, function(error, response, body) {
        if (!error && response.statusCode === 200) {
            //OMDB OUTPUT 
            if (JSON.parse(body).Response === "false") {
                return console.log("Error: " + JSON.parse(body).Error);
            } else {
                logOutputs(response);
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
                } else {
                    console.log(JSON.parse(body).imdbRating);
                }
            }
        }
    });
}
//logs terminal inputs to random.txt
function logInputs(task, value) {
    var fs = require("fs");
    fs.appendFile("random.txt", task + "," + '"' + value + '"' + "; ", function(err) {
        if (err) {
            return console.log(err);
        }
		console.log("random.txt was updated!");
    });
}
//logs outputs to log.txt
function logOutputs(response) {
    var fs = require("fs");
    fs.appendFile("log.txt", "<START>" + JSON.stringify(response) + "<END>", function(err) {
        if (err) {
            return console.log(err);
        }
        console.log("log.txt was updated!");
    });
}
//reads random.txt
function readTxt() {
    var fs = require("fs");
    var incr = 0;
    fs.readFile("random.txt", "utf8", function(err, data) {
        if (err) {
            return console.log(err);
        }
        var output = data.split(";");
        for (var i = 0; i < output.length; i++) {
            console.log(output[i].replace(/\,/g, ' '))
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