// Dependencies
var express = require("express");
var mongojs = require("mongojs");
// Require request and cheerio. This makes the scraping possible
var request = require("request");
var cheerio = require("cheerio");

// Initialize Express
var app = express();

// Database configuration
var databaseUrl = "nytimes";
var collections = ["nytData"];

// Hook mongojs configuration to the db variable
var db = mongojs(databaseUrl, collections);
db.on("error", function(error) {
  console.log("Database Error:", error);
});

// Main route (simple Hello World Message)
app.get("/", function(req, res) {
  res.send("News Scraper");
});

/* TODO: make two more routes
 * -/-/-/-/-/-/-/-/-/-/-/-/- */

// Route 1
// =======
// This route will retrieve all of the data
// from the scrapedData collection as a json (this will be populated
// by the data you scrape using the next route)
app.get("/next", function(req, res) {
	db.nytData.find({}, function(error, found) {
		if (error) {
			console.log(error);
		}
		else {
			res.json(found);
		}
	});
});

// Route 2
// =======
// When you visit this route, the server will
// scrape data from the site of your choice, and save it to
// MongoDB.
// TIP: Think back to how you pushed website data
// into an empty array in the last class. How do you
// push it into a MongoDB collection instead?
app.get("/scrape", function(req, res) {
	db.nytData.remove();
	request("https://www.nytimes.com", function(error, response, html) {
		var $ = cheerio.load(html);
		var results = [];
		$("h1.story-heading").each(function(i, element) {
		    var headline = $(element).text();
		    var link = $(element).children().attr("href");
			    results.push({
			      headline: headline,
			      link: link
			    });
		});
		$("h2.story-heading").each(function(i, element) {
		    var headline = $(element).text();
		    var link = $(element).children().attr("href");
			    results.push({
			      headline: headline,
			      link: link
			    });
		});
		$("p.summary").each(function(i, element) {
		    var summary = $(element).text();
			    results.push({
			      summary: summary,
			    });
		});
	db.nytData.insert(results);
	console.log(results);
	});

});
/* -/-/-/-/-/-/-/-/-/-/-/-/- */

// Listen on port 3000
app.listen(3000, function() {
  console.log("App running on port 3000!");
});
