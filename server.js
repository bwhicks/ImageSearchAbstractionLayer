//Env file handling for C9
var env = require('node-env-file');
env(__dirname + '/.env');

//Get Date time handler
var strftime = require('strftime');
//Setup for app
var express = require('express');
var app = new express();
//Import Bing API
var Bing = require('node-bing-api')
            ({ 
              accKey: process.env.ACCKEY, 
              rootUri: "https://api.datamarket.azure.com/Bing/Search/v1/" 
            });
//Function to pull out the relevant JSON fields from results
function makeJSON(img) {
    return {
      "mediaurl": img.MediaUrl,
      "title": img.Title,
      "bing-thumbnail": img.Thumbnail.MediaUrl,
      "sourceurl": img.SourceUrl
    };
  }

//Import mongoose
var mongoose = require('mongoose');
require('./query.js')();
var Query = mongoose.model('Query');
mongoose.connect(process.env.MONGOURI);


//Instructions for API on the '/'
app.get('/', function(req, res) {
   res.send('<html><h1>Quick Guide to This API</h1> \
   <p>This is a basic HTML document that will outline the API:</p>\
   <ul>\
   <li>/isal/query?offset=x\
   <br />Queries directed to /ial/ will image search Bing for "query" and x\
   = page (10 results, incremented by 10 * x)\
   </li>\
   <li>/latest/ Returns the latest 10 queries</li>\
   </ul></html>') 
});


app.get('/isal/:query', function(req, res) {
    
    var query = req.params.query;
    var offset = query.offset || 0;
 
 
    Bing.images(query, {top: 10, skip: offset}, function(err, result, body) {
            if (err) throw err;
            if (body) {
                res.send(body.d.results.map(makeJSON))
                
                var newQuery = new Query ({
                    search: query,
                    date: strftime('%F %T', Date().now)
                });
                
                newQuery.save(function (err) {
                    if (err) throw(err)
                    console.log('Search info saved')
                    
                })
            }
    });

    

});

app.get('/latest/', function(req, res) {
    Query.find({}, null, {
        'limit': 10,
        'sort': {
            'when': -1
        }
    }, function(err, results) {
            if (err) throw(err);
            console.log(results);
            res.send(results.map(function(arg) {
              return {
                  search: arg.search,
                  date: arg.date
              };      
            }))
        });
});


app.listen(process.env.port || 8080, function callback() {
    if (process.env.port) {
        console.log('Listening on port' + process.env.port);
    }
    else {
        console.log('Listening on port 8080');
    }
});